import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Header({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();

  const headerStyle = {
    backgroundColor: '#A3B8CC',
    padding: '20px 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: '0 0 24px 24px',
    boxShadow: '0 6px 16px rgba(163, 184, 204, 0.4)',
    borderBottom: '3px solid #ffffff'
  };

  const btnStyle = {
    backgroundColor: '#ffffff',
    color: '#4A5F73',
    border: 'none',
    padding: '10px 22px',
    borderRadius: '20px',
    fontWeight: 'bold',
    textDecoration: 'none',
    fontSize: '15px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    marginLeft: '12px',
    cursor: 'pointer'
  };

  return (
    <header style={headerStyle}>
      <Link to="/" style={{ textDecoration: 'none', fontSize: '24px', fontWeight: 'bold', color: '#ffffff' }}>
        🍼 過期了沒 App
      </Link>
      
      <nav style={{ display: 'flex', alignItems: 'center' }}>
        <Link to="/" style={btnStyle}>首頁</Link>
        
        {!isLoggedIn ? (
          <>
            <Link to="/login" style={btnStyle}>登入</Link>
            <Link to="/register" style={{ ...btnStyle, backgroundColor: '#4A5F73', color: '#ffffff' }}>註冊</Link>
          </>
        ) : (
          <>
            <Link to="/dashboard" style={{ ...btnStyle, backgroundColor: '#E2E8F0' }}>我的物品 📜</Link>
            <button 
              onClick={() => { setIsLoggedIn(false); navigate('/'); }} 
              style={{ ...btnStyle, backgroundColor: '#4A5F73', color: '#ffffff' }}
            >
              登出
            </button>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;