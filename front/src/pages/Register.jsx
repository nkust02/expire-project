import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // 📡 管道接通：將新註冊資料傳給後端寫入 MongoDB
      const response = await fetch('https://expire-project.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      const data = await response.json();

      if (!response.ok) {
        setMessage({ text: data.message, type: 'error' });
      } else {
        setMessage({ text: '🎉 註冊成功！即將導向登入頁面...', type: 'success' });
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) {
      setMessage({ text: '❌ 無法連線至後端伺服器', type: 'error' });
    }
  };

  return (
    <div style={{ padding: '60px 20px', display: 'flex', justifyContent: 'center', backgroundColor: '#F0F4F8' }}>
      <div style={{ backgroundColor: '#ffffff', width: '100%', maxWidth: '380px', padding: '35px', borderRadius: '24px', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
        <h3 style={{ color: '#4A5F73', fontSize: '24px', marginBottom: '25px', textAlign: 'center' }}>建立新帳號 🌱</h3>
        {message.text && (
          <div style={{ color: message.type === 'error' ? '#D97706' : '#15803D', backgroundColor: message.type === 'error' ? '#FEF3C7' : '#DCFCE7', padding: '12px', borderRadius: '14px', fontSize: '14px', marginBottom: '15px', fontWeight: 'bold' }}>
            {message.text}
          </div>
        )}
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ color: '#4A5F73', fontSize: '14px', fontWeight: 'bold' }}>使用者名稱</label>
            <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} placeholder="怎麼稱呼您呢" style={{ width: '100%', padding: '12px', marginTop: '5px', border: '2px solid #E2E8F0', borderRadius: '14px', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ color: '#4A5F73', fontSize: '14px', fontWeight: 'bold' }}>電子郵件</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@mail.com" style={{ width: '100%', padding: '12px', marginTop: '5px', border: '2px solid #E2E8F0', borderRadius: '14px', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ color: '#4A5F73', fontSize: '14px', fontWeight: 'bold' }}>密碼</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="請設定密碼" style={{ width: '100%', padding: '12px', marginTop: '5px', border: '2px solid #E2E8F0', borderRadius: '14px', boxSizing: 'border-box' }} />
          </div>
          <button type="submit" style={{ backgroundColor: '#4A5F73', color: 'white', border: 'none', padding: '12px', borderRadius: '14px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>確認註冊</button>
        </form>
      </div>
    </div>
  );
}

export default Register;