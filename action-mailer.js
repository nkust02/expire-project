// action-mailer.js
import nodemailer from 'nodemailer';

// 接收來自 GitHub Actions 傳入的 Render JSON 名單資料
// 第一個參數是執行的路徑，第二個參數是檔案路徑，第三個才是我們傳入的 JSON 字串
const jsonString = process.argv[2]; 

if (!jsonString || jsonString === '$DATA' || jsonString === '[]') {
  console.log('⚠️ 欄位為空或沒有任何需要寄信的即期食品資料，程式結束。');
  process.exit(0);
}

let sendList = [];
try {
  sendList = JSON.parse(jsonString);
} catch (parseErr) {
  console.error('❌ 解析 Render 傳回的 JSON 資料失敗：', parseErr.message);
  process.exit(1);
}

// 建立 Gmail Nodemailer 傳送器（在 GitHub Actions 執行，走最簡單的 service 快捷鍵即可通關！）
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function startActionMail() {
  console.log(`🤖 [GitHub 伺服器代工] 寄信機器人啟動，準備發送 ${sendList.length} 封信件...`);
  
  for (const item of sendList) {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: item.userEmail, 
        subject: "【過期了沒】食品到期提醒",
        html: `
          <h2>食品即將到期</h2>
          <p>您的食品 <b>${item.name}</b> 將於 <b>${item.date}</b> 到期（剩餘 ${item.diffDays} 天）。</p>
          <p>請盡快食用或處理。</p>
        `
      });
      console.log(`📧 成功由 GitHub 寄信給: ${item.userEmail} [${item.name}]`);
    } catch (error) {
      console.error(`❌ 信件寄送給 ${item.userEmail} 失敗，原因為:`, error.message || error);
    }
  }
  console.log('🎉 所有信件發送排程結束！');
}

startActionMail();
