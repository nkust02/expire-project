import React from 'react';
import { useNavigate } from 'react-router-dom';
import{QRCodeSVG} from 'qrcode.react';
import { BigPlayButton, Player,ControlBar,PlaybackRateMenuButton,ForwardControl,ReplayControl } from 'video-react';
import "video-react/dist/video-react.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '40px 20px', backgroundColor: '#F0F4F8', minHeight: '80vh', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px' }}>
        
        {/* 歡迎大標題區 */}
        <div style={{ backgroundColor: '#ffffff', padding: '40px 20px', borderRadius: '28px', textAlign: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.03)' }}>
          <span style={{ fontSize: '50px' }}>✨</span>
          <h1 style={{ color: '#4A5F73', fontSize: 'clamp(24px, 5vw, 36px)', margin: '10px 0', lineHeight: '1.3' }}>
            過期了沒？您的食物守護小助手
          </h1>
          <p style={{ color: '#7A8B9B', fontSize: '16px', marginBottom: '25px', padding: '0 10px' }}>
            依據有效期限「由少到多」自動排序，並用溫柔的莫蘭迪色標示危險程度！
          </p>
          <button 
            onClick={() => navigate('/dashboard')}
            style={{ backgroundColor: '#A3B8CC', color: 'white', border: 'none', padding: '14px 40px', fontSize: '16px', borderRadius: '25px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(163,184,204,0.5)' }}
          >
            立即開啟管理後台 🚀
          </button>
        </div>

        {/* 響應式並排/堆疊區塊 */}
        <div style={{ 
          display: 'flex', 
          gap: '25px', 
          flexWrap: 'wrap', // 關鍵：螢幕不夠寬時會自動換行
          width: '100%'
        }}>
          
          {/* 左邊：專案展示影片區 */}
          <div style={{ 
            flex: '1 1 500px', // 彈性基礎寬度 500px，不夠寬就變全寬
            backgroundColor: '#ffffff', 
            padding: '25px', 
            borderRadius: '28px', 
            boxShadow: '0 8px 24px rgba(0,0,0,0.03)',
            boxSizing: 'border-box'
          }}>
            <h3 style={{ color: '#4A5F73', marginTop: 0, marginBottom: '15px', fontSize: '18px' }}>
              🎬 介紹影片
            </h3>
            <div style={{ width: '100%', aspectRatio: '16/9', backgroundColor: '#E2E8F0', borderRadius: '18px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#7A8B9B', border: '2px dashed #A3B8CC' }}>
              <div style={{width:'95%'}}>
                <Player
                  playsInline
                  src="/expire-demo.mp4"
                  fluid={true}
                  muted={true}
                >
                  <BigPlayButton position="center" />
                  <ControlBar autoHide={true} autoHideTime={3000}>
                    <PlaybackRateMenuButton rates={[5, 2, 1, 0.5]} />
                    <ReplayControl seconds={10} order={2.1} />
                    <ReplayControl seconds={5} order={2.2} />
                    <ForwardControl seconds={5} order={3.1} />
                    <ForwardControl seconds={10} order={3.2} />
                  </ControlBar>
                </Player>
              </div>
              
              
                
                
              
            </div>
            <p style={{ textAlign: 'center', fontSize: '12px', color: '#94A3B8' }}>支援各式手機與桌面網頁比例適應</p>
          </div>

          {/* 右邊：手機體驗 QR Code 區 */}
          <div style={{ 
            flex: '1 1 300px', // 彈性基礎寬度 300px
            backgroundColor: '#ffffff', 
            padding: '25px', 
            borderRadius: '28px', 
            boxShadow: '0 8px 24px rgba(0,0,0,0.03)', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            textAlign: 'center',
            boxSizing: 'border-box'
          }}>
            <h3 style={{ color: '#4A5F73', marginTop: 0, marginBottom: '10px', fontSize: '18px' }}>📱 手機瀏覽</h3>
            <p style={{ color: '#7A8B9B', fontSize: '14px', margin: '0 0 20px 0' }}>歡迎掃描<br/>用手機同步體驗可愛介面</p>
            
            <div style={{ width: '160px', height: '160px', backgroundColor: '#F0F4F8', border: '3px solid #A3B8CC', borderRadius: '18px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#4A5F73', fontWeight: 'bold', fontSize: '14px' }}>
              {/*QR Code 圖片 ]*/} 
              <QRCodeSVG
                value={window.location.origin}
                size={150}
                fgColor='#4A5F73'
                bgColor='transparent'
              />
            </div>
            
            <span style={{ fontSize: '12px', color: '#A3B8CC', marginTop: '15px' }}>高科大 前端網頁框架第15組</span>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Home;