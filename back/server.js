import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import mongoose from 'mongoose';
import dotenv from "dotenv";
dotenv.config();
console.log("MONGO:", process.env.MONGODB_URI);
import { sendExpiryEmail } from './emailService.js';
import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']); // 強制 Node.js 使用 Google DNS 解析 SRV

// 之後再執行你的 mongoose.connect(process.env.MONGO_URI)



const app = express();
app.use(
  cors({
    origin: "*"
  })
);
app.use(express.json({
  limit:'20mb' // 增加請求體的大小限制，適合圖片上傳
}));
app.use(express.urlencoded({ 
  limit:'20mb',
  extended: true }));

// 🔌 1. 串接本地端 MongoDB (請確保電腦已啟動 MongoDB Compass)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Atlas 連線成功"))
  .catch(err => console.error("資料庫連線失敗:", err));

// 📝 2. 定義資料庫規格 (Schemas)
// 使用者規格
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model('User', userSchema);

// 物品規格 (新增：對應你的草圖功能)
const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: String, required: true },       // 有效日期
  remindDays: { type: String, required: true }, // 幾天前提醒
  userEmail: { type: String, required: true },  // 屬於哪個使用者的物品
  photo: {type: String,default: ''}, // 物品照片URL（可選）
  done: { type: Boolean, default: false }, // ✅ 完成狀態
  emailSentDates: { type: [String], default: [] }, // 📧 記錄已寄信的日期，避免重複寄
});
const Item = mongoose.model('Item', itemSchema);

// 🔐 3. 帳號系統 API
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existUser = await User.findOne({ email });
    if (existUser) return res.status(400).json({ message: '❌ 該電子郵件已被註冊！' });
    const newUser = new User({ username, email, password});
    await newUser.save();
    res.status(201).json({ message: '🎉 註冊成功！' });
  } catch (error) {
    res.status(500).json({ message: '伺服器錯誤' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(400).json({ message: '❌ 帳號或密碼不正確！' });
    }
    // 登入成功，回傳使用者的 email 與名字
    res.status(200).json({ message: '🐻 歡迎回來', username: user.username, email: user.email });
  } catch (error) {
    res.status(500).json({ message: '伺服器錯誤' });
  }
});

app.post('/debug/run-scheduler', async (req, res) => {
  const secret = req.headers['x-cron-secret'];
  if (secret !== process.env.CRON_SECRET) {
    return res.status(401).send('Unauthorized');
  }
  try {
    await runExpiryReminder();
    return res.status(200).send('Scheduler executed');
  } catch (err) {
    console.error('Debug run-scheduler 錯誤:', err);
    return res.status(500).send('Scheduler failed');
  }
});

// 🍎 4. 物品管理核心 API (新增、讀取並自動排序)

// 【真實讀取物品】抓取特定使用者的物品，並依據剩餘天數自動由少到多排序
app.get('/api/items', async (req, res) => {
  try {
    const { email } = req.query; // 從網址參數抓取是哪個使用者的
    if (!email) return res.status(400).json({ message: '缺少使用者 Email' });

    const userItems = await Item.find({ userEmail: email, done: { $ne: true } }); // 只抓未完成的物品

    // 上市級邏輯：計算剩餘天數並排序
    const sortedItems = userItems.map(item => {
      const today = new Date();
      today.setHours(0,0,0,0);
      const expireDate = new Date(item.date);
      expireDate.setHours(0,0,0,0);
      
      // 計算時間差 (毫秒轉天數)
      const diffTime = expireDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // 依據剩餘天數設定莫蘭迪顏色
      let cardColor = '#C6E2D6'; // 安全粉綠
      if (diffDays < 0) cardColor = '#ffb3b3'; // 已過期
      else if (diffDays <= 2) cardColor = '#F2C6C6'; // 危險粉紅 (2天內)
      else if (diffDays <= 5) cardColor = '#F5E2B3'; // 警告粉黃 (5天內)

      return {
        id: item._id,
        name: item.name,
        date: item.date,
        remindDays: item.remindDays,
        daysLeft: diffDays,
        expired: diffDays < 0,
        color: cardColor,
        photo: item.photo
      };
    }).sort((a, b) => a.daysLeft - b.daysLeft); // 🌟 關鍵：由少到多自動排序！

    res.status(200).json(sortedItems);
  } catch (error) {
    res.status(500).json({ message: '讀取物品失敗' });
  }
});

// 【真實新增物品】
app.post('/api/items', async (req, res) => {
  try {
    const { name, date, remindDays, userEmail, photo } = req.body;
    const newItem = new Item({ name, date, remindDays, userEmail, photo });
    await newItem.save();
    res.status(201).json({ message: '🍏 物品已成功存入雲端資料庫！' });
  } catch (error) {
    res.status(500).json({ message: '新增物品失敗' });
  }
});
//修改API
app.put('/api/items/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      date,
      remindDays,
      photo
    } = req.body;

    await Item.findByIdAndUpdate(id, {
      name,
      date,
      remindDays,
      photo
    });

    res.status(200).json({
      message: '✏️ 物品修改成功'
    });

  } catch (error) {
    res.status(500).json({
      message: '修改失敗'
    });
  }
});
//刪除API
app.delete('/api/items/:id', async (req, res) => {
  try {

    const { id } = req.params;

    await Item.findByIdAndDelete(id);

    res.status(200).json({
      message: '🗑️ 刪除成功'
    });

  } catch (error) {
    res.status(500).json({
      message: '刪除失敗'
    });
  }
});
// 完成物品 API（標記為已完成，不再計算到期）
app.patch('/api/items/:id/done', async (req, res) => {
  try {
    const { id } = req.params;
    await Item.findByIdAndUpdate(id, { done: true });
    res.status(200).json({ message: '✅ 已標記為完成！' });
  } catch (error) {
    res.status(500).json({ message: '標記失敗' });
  }
});
// 每日到期提醒排程邏輯抽成函式（可手動觸發以便偵錯）
async function runExpiryReminder() {
  console.log('📧 開始執行每日到期提醒排程...');
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0]; // e.g. "2026-06-11"

    // 抓取所有未完成的物品
    const allItems = await Item.find({ done: { $ne: true } });

    // 同時抓取使用者 email（保留擴充空間）
    const userMap = {};
    const users = await User.find({}, 'email');
    users.forEach(u => { userMap[u.email] = true; });

    for (const item of allItems) {
      const expireDate = new Date(item.date);
      expireDate.setHours(0, 0, 0, 0);
      const diffTime = expireDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const remindDaysNum = parseInt(item.remindDays) || 1;

      // 判斷是否需要寄信：剩餘天數 <= 提醒天數，且今天還沒寄過
      if (diffDays <= remindDaysNum && !item.emailSentDates.includes(todayStr)) {
        try {
          await sendExpiryEmail(item.userEmail, item.name, item.date);
          // 記錄今天已寄，避免重複觸發
          await Item.findByIdAndUpdate(item._id, {
            $push: { emailSentDates: todayStr }
          });
          console.log(`已寄信給 ${item.userEmail}：${item.name} 剩 ${diffDays} 天`);
        } catch (sendErr) {
          console.error('寄信失敗 for', item.userEmail, item._id, sendErr);
        }
      }
    }
    console.log('✅ 排程完成');
  } catch (err) {
    console.error('排程執行失敗:', err);
  }
}

// 排程（每天早上 8:00 執行）
cron.schedule('0 8 * * *', runExpiryReminder, {
  timezone: 'Asia/Taipei' // 台灣時間
});

// --- Debug endpoints: 手動觸發寄信與執行排程 ---
app.get('/debug/send-email', async (req, res) => {
  const { email, name, date } = req.query;
  if (!email) return res.status(400).send('請提供 email，例：/debug/send-email?email=you@example.com');
  try {
    await sendExpiryEmail(email, name || '測試品', date || new Date().toISOString().split('T')[0]);
    return res.status(200).send('Email Sent');
  } catch (err) {
    console.error('Debug send-email 錯誤:', err);
    return res.status(500).send('Email send failed');
  }
});

app.post('/debug/run-scheduler', async (req, res) => {
  try {
    await runExpiryReminder();
    return res.status(200).send('Scheduler executed');
  } catch (err) {
    console.error('Debug run-scheduler 錯誤:', err);
    return res.status(500).send('Scheduler failed');
  }
});
/*測試
app.get('/test-email', async (req,res)=>{

  await sendExpiryEmail(
    '你的gmail@gmail.com',
    '牛奶',
    '2026-06-20'
  );

  res.send('Email Sent');

});
*/

// 🚀 啟動本地伺服器
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🐻 本地後端系統正在運行於 http://localhost:${PORT}`));