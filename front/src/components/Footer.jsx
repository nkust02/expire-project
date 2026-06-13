import React from 'react';

function Footer() {
  const footerStyle = {
    backgroundColor: '#8095a9',
    color: '#F0F4F8',
    textAlign: 'center',
    padding: '30px 20px',
    fontSize: '14px',
    marginTop: 'auto', // 關鍵：確保內容不夠多時，Footer 依然乖乖待在最底部
    borderRadius: '24px 24px 0 0', // 上方圓角
    boxShadow: '0 -4px 16px rgba(74, 95, 115, 0.2)',
    borderTop: '3px solid #ffffff'
  };

  return (
    <footer style={footerStyle}>
      <p style={{ fontWeight: 'bold', fontSize: '16px', margin: '0 0 8px 0' }}>
        🍼 「過期了沒？」
      </p>
      <p style={{ opacity: 0.8, fontSize: '13px', margin: '5px 0' }}>
        組員： C113156202 陳俐雯 | C113156223 方金芹 | C113156230 周語捷 | C113156247 林芷嘉
      </p>
      <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.2)', maxWidth: '400px', margin: '15px auto' }} />
      <p style={{ fontSize: '12px', opacity: '0.6', margin: 0 }}>
        國立高雄科技大學 前端網頁框架第15組 版權所有 © 2026
      </p>
    </footer>
  );
}

export default Footer;