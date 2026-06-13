import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Footer from './components/Footer'; // 這裡有引入

function App() {
  // 💡 框架優化：初始化時先檢查瀏覽器有沒有登入紀錄，防止重整網頁後狀態消失
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('current_session_email'));

  return (
    <div style={{ backgroundColor: '#F0F4F8', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* 🛡️ 路由守衛：未登入者想進後台會被彈回登入頁 */}
          <Route 
            path="/dashboard" 
            element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" replace />} 
          />
        </Routes>
      </main>

      {/* 🌟 修正這裡：改成使用你寫好組員名單的大寫 <Footer /> 元件 */}
      <Footer />
    </div>
  );
}

export default App;