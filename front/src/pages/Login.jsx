import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // 📡 管道接通：向後端發送登入驗證
      const response = await fetch('https://expire-project.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
      } else {
        setError('');
        setIsLoggedIn(true);
        // 💾 儲存 Session 紀錄，供後續 Dashboard 讀取
        localStorage.setItem('current_session_user', data.username);
        localStorage.setItem('current_session_email', email);
        navigate('/dashboard');
      }
    } catch (err) {
      setError('❌ 無法連線至後端伺服器');
    }
  };

  return (
    <div style={{ padding: '60px 20px', display: 'flex', justifyContent: 'center', backgroundColor: '#F0F4F8' }}>
      <div style={{ backgroundColor: '#ffffff', width: '100%', maxWidth: '380px', padding: '35px', borderRadius: '24px', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
        <h3 style={{ color: '#4A5F73', fontSize: '24px', marginBottom: '25px', textAlign: 'center' }}>歡迎回來 🐻</h3>
        {error && <div style={{ color: '#D97706', backgroundColor: '#FEF3C7', padding: '10px', borderRadius: '12px', fontSize: '13px', marginBottom: '15px', fontWeight: 'bold' }}>{error}</div>}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ color: '#4A5F73', fontSize: '14px', fontWeight: 'bold' }}>電子郵件</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@mail.com" style={{ width: '100%', padding: '12px', marginTop: '5px', border: '2px solid #E2E8F0', borderRadius: '14px', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ color: '#4A5F73', fontSize: '14px', fontWeight: 'bold' }}>密碼</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="請輸入密碼" style={{ width: '100%', padding: '12px', marginTop: '5px', border: '2px solid #E2E8F0', borderRadius: '14px', boxSizing: 'border-box' }} />
          </div>
          <div style={{ textAlign: 'right' }}>
            <a href="/forgot-password" target="_blank" rel="noopener noreferrer" style={{ color: '#A3B8CC', fontSize: '13px', textDecoration: 'none', fontWeight: 'bold' }}>忘記密碼？</a>
          </div>
          <button type="submit" style={{ backgroundColor: '#A3B8CC', color: 'white', border: 'none', padding: '12px', borderRadius: '14px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>登入系統</button>
        </form>
      </div>
    </div>
  );
}

export default Login;