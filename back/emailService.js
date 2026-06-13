import dotenv from "dotenv";
dotenv.config();

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
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
    console.error(error);
  }
}