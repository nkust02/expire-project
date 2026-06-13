// action-mailer.js
// 💡 注意 1：因為 GitHub 環境預設支援 CommonJS 語法，這裡一律改用 require 導入
const nodemailer = require('nodemailer');

// 💡 注意 2：接收來自 GitHub 傳入的 Render JSON 名單字串
const rawData = process.argv[2]; 
if (!rawData || rawData === '$DATA') {
  console.log('❌ 沒有收到任何需要寄信的資料，程式結束。');
  process.exit(0);
}

// 將 GitHub 傳過來的字串還原成 JavaScript 陣列物件
const sendList = JSON.parse(rawData);

// 建立 Nodemailer 傳送器（這段跟你原本的一模一樣，在 GitHub 執行絕對不會再卡 Resolved！）
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  localAddress: '0.0.0.0',
  tls: {
    rejectUnauthorized: false
  },
  debug: true,
  logger: true
});

// 💡 核心修改：遍歷 Render 給我們的名單，一封一封把信噴射出去！
async function startActionMail() {
  console.log(`🤖 GitHub Actions 寄信機器人啟動，準備發送 ${sendList.length} 封信件...`);
  
  for (const item of sendList) {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: item.userEmail, // 💡 對應 Render 打包過來的欄位名稱
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
