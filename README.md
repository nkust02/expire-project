# 🥛 過期了沒？- 食品到期提醒系統

高科大 前端網頁框架 第15組專題

---

## 📌 專案介紹

「過期了沒？」是一套食品保存期限管理系統。

使用者可以：

- 註冊帳號
- 登入系統
- 新增食品資料
- 上傳食品照片
- 修改食品資料
- 刪除食品資料
- 查看剩餘天數
- 查看已過期天數
- 手機與電腦同步資料

系統依照到期日自動排序，並以不同顏色顯示食品狀態。

---

## 🚀 線上展示

前端：

https://expire-project.vercel.app

後端 API：

https://expire-project.onrender.com

---

## 🛠 技術架構

### Frontend

- React
- Vite
- React Router
- QRCode.react

### Backend

- Node.js
- Express.js

### Database

- MongoDB Atlas
- Mongoose

### Deployment

- Vercel
- Render

---

## 📂 專案結構

```text
expire-project
│
├─ front
│  ├─ src
│  ├─ public
│  └─ package.json
│
├─ back
│  ├─ models
│  ├─ routes
│  ├─ server.js
│  └─ package.json
│
└─ README.md