import dotenv from "dotenv";
dotenv.config();

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',  // 明確指定 Gmail 伺服器
  port: 465,               // 用安全的 465 埠口
  secure: true,            // 465 埠口此項必須為 true
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  localAddress: '0.0.0.0', // ⭐ 強制指定本地端使用 IPv4 連線
  tls: {
    rejectUnauthorized: false // 允許安全憑證的相容性
  },
  // 💡 加上這兩行！逼出底層通訊日誌
  debug: true,
  logger: true
});


export async function sendExpiryEmail(
  email,
  itemName,
  expireDate
) {
  try {

    await transporter.sendMail({
      from: process.env.EMAIL_USER,

      to: email,

      subject: "【過期了沒】食品到期提醒",

      html: `
        <h2>食品即將到期</h2>

        <p>
          您的食品
          <b>${itemName}</b>
          將於
          <b>${expireDate}</b>
          到期。
        </p>

        <p>
          請盡快食用或處理。
        </p>
      `
    });

    console.log(
      `已寄送提醒給 ${email}`
    );

  } catch (error) {
    console.error(`❌ 信件寄送給 ${email} 失敗，原因為:`, error.message || error);
  }
}