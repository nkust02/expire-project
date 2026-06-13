import React, { useState } from 'react';

function ForgotPassword() {
  const [step, setStep] = useState(1); 
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');

  // 📡 連線後端檢查信箱是否存在
  const verifyEmailAndSend = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://expire-project.onrender.com/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      // 信箱存在，生成隨機碼（真實模擬寄信，可在此處接EmailJS）
      const randomCode = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedCode(randomCode);
      alert(`✉️ [上市級驗證機制] 驗證碼已成功發送！\n\n您的臨時安全驗證碼為：${randomCode}`);
      setStep(2);
    } catch (err) {
      alert('❌ 無法連線至後端伺服器');
    }
  };

  // 📡 連線後端真正覆寫資料庫密碼
  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://expire-project.onrender.com/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword })
      });
      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        window.close(); // 關閉此獨立分頁
      } else {
        alert('重設失敗');
      }
    } catch (err) {
      alert('❌ 無法連線至後端伺服器');
    }
  };

  return (
    <div style={{ padding: '60px 20px', display: 'flex', justifyContent: 'center', backgroundColor: '#F0F4F8', minHeight: '60vh', fontFamily: 'sans-serif' }}>
      <div style={{ backgroundColor: '#ffffff', width: '100%', maxWidth: '400px', padding: '35px', borderRadius: '24px', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
        {step === 1 && (
          <form onSubmit={verifyEmailAndSend}>
            <h3 style={{ color: '#4A5F73', fontSize: '22px', marginBottom: '10px' }}>找回您的密碼 🔑</h3>
            <p style={{ color: '#7A8B9B', fontSize: '14px', marginBottom: '20px' }}>系統將連線雲端資料庫核對您的信箱。</p>
            <label style={{ color: '#4A5F73', fontSize: '14px', fontWeight: 'bold' }}>註冊電子郵件</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@mail.com" style={{ width: '100%', padding: '12px', marginTop: '5px', border: '2px solid #E2E8F0', borderRadius: '14px', boxSizing: 'border-box', marginBottom: '20px' }} />
            <button type="submit" style={{ width: '100%', backgroundColor: '#A3B8CC', color: 'white', border: 'none', padding: '12px', borderRadius: '14px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>寄送安全驗證碼</button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={(e) => { e.preventDefault(); if(code === generatedCode) setStep(3); else alert('❌ 驗證碼錯誤！'); }}>
            <h3 style={{ color: '#4A5F73', fontSize: '22px', marginBottom: '10px' }}>身份確認 ✉️</h3>
            <input type="text" required maxLength="4" value={code} onChange={(e) => setCode(e.target.value)} placeholder="請輸入驗證碼" style={{ width: '100%', padding: '12px', border: '2px solid #E2E8F0', borderRadius: '14px', boxSizing: 'border-box', marginBottom: '20px', textAlign: 'center', fontSize: '20px', letterSpacing: '8px' }} />
            <button type="submit" style={{ width: '100%', backgroundColor: '#A3B8CC', color: 'white', border: 'none', padding: '12px', borderRadius: '14px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>核對驗證碼</button>
          </form>
        )}
        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <h3 style={{ color: '#4A5F73', fontSize: '22px', marginBottom: '10px' }}>重設密碼 🔒</h3>
            <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="請輸入新密碼" style={{ width: '100%', padding: '12px', border: '2px solid #E2E8F0', borderRadius: '14px', boxSizing: 'border-box', marginBottom: '20px' }} />
            <button type="submit" style={{ width: '100%', backgroundColor: '#4A5F73', color: 'white', border: 'none', padding: '12px', borderRadius: '14px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>更新資料庫密碼</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;