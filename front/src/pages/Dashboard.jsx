import React, { useState, useEffect } from 'react';

function Dashboard() {
  const currentUserName = localStorage.getItem('current_session_user') || '使用者';
  const currentUserEmail =
    localStorage.getItem('current_session_email');
  

  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [remindDays, setRemindDays] = useState('1');
  const [photo, setPhoto] = useState('');
  const[preview, setPreview] = useState('');
  const [editId, setEditId] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  
  // 💡 框架註記：這裡留給負責細節功能的同學儲存後端拿到的物品陣列
  const [items, setItems] = useState([
    // 這裡先留一筆可愛的莫蘭迪範例資料，方便同學看懂 RWD 樣式
    { id: 'demo', name: '範例鮮奶（請同學換成 API 資料）🥛', daysLeft: 2, date: '2026-06-04', color: '#F2C6C6' }
  ]);
  //圖片選擇函式
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setPhoto(reader.result);
      setPreview(reader.result);
    };

    reader.readAsDataURL(file);
  };
  const loadItems = async () => {
    try {
      const response = await fetch(
        `https://expire-project.onrender.com/api/items?email=${currentUserEmail}`
      );

      const data = await response.json();

      if (response.ok) {
        setItems(data);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert('讀取物品失敗');
    }
  };
  useEffect(() => {
  if (currentUserEmail) {
    loadItems();
  }
}, [currentUserEmail]);
console.log("目前 editId =", editId);
  const handleSubmit = async () => {

    if (!name || !date) {
      alert('請填寫完整資料');
      return;
    }

    if (editId) {
      await updateItem();
    } else {
      await createItem();
    }
  };
  const createItem = async () => {
    try {

      const response = await fetch(
        'https://expire-project.onrender.com/api/items',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name,
            date,
            remindDays,
            userEmail: currentUserEmail,
            photo
          })
        }
      );

      const data = await response.json();

      if (response.ok) {

        alert(data.message);

        setName('');
        setDate('');
        setRemindDays('1');
        setPhoto('');
        setPreview('');

        loadItems();

      } else {
        alert(data.message);
      }

    } catch (error) {
      console.error(error);
      alert('新增物品失敗');
    }
  };
  //刪除物品函式
  const deleteItem = async (id) => {

    if (!window.confirm('確定刪除嗎？'))
      return;

    try {

      await fetch(
        `https://expire-project.onrender.com/api/items/${id}`,
        {
          method: 'DELETE'
        }
      );
      setSelectedItem(null);
      loadItems();

    } catch (error) {
      console.error(error);
    }
  };
  //修改物品函式
  const updateItem = async () => {

    try {

      const response = await fetch(
        `https://expire-project.onrender.com/api/items/${editId}`,
        {
          method:'PUT',
          headers:{
            'Content-Type':'application/json'
          },
          body:JSON.stringify({
            name,
            date,
            remindDays,
            photo
          })
        }
      );

      const data = await response.json();

      alert(data.message);

      setEditId(null);

      setName('');
      setDate('');
      setRemindDays('1');
      setPhoto('');
      setPreview('');
      setSelectedItem(null);
      loadItems();

    } catch(error){
      console.error(error);
    }
  };
  // ✅ 完成物品（標記 done，不再計算到期）
  const markDone = async (id) => {
    try {
      const response = await fetch(
        `https://expire-project.onrender.com/api/items/${id}/done`,
        { method: 'PATCH' }
      );
      const data = await response.json();
      if (response.ok) {
        // 移除該筆，不需要重新 loadItems（更快）
        setItems(prev => prev.filter(item => item.id !== id));
        setSelectedItem(null);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert('標記完成失敗');
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes pulse {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.04);
            }
            100% {
              transform: scale(1);
            }
            .done-btn {
              background: none;
              border: 2px solid #C6E2D6;
              color: #4A8C6F;
              border-radius: 10px;
              padding: 4px 10px;
              font-size: 12px;
              font-weight: bold;
              cursor: pointer;
              transition: 0.2s;
              white-space: nowrap;
            }
            .done-btn:hover {
              background-color: #C6E2D6;
            }
          
        `}
      </style>
    <div style={{ padding: '30px 20px', backgroundColor: '#F0F4F8', minHeight: '80vh', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h2 style={{ color: '#4A5F73', marginBottom: '20px' }}>🐻 歡迎回來，{currentUserName} ！</h2>
        
        {/* RWD 彈性版面佈局 */}
        <div style={{ display: 'flex', gap: '25px', flexWrap: 'wrap' }}>
          
          {/* 左區：物品展示清單區 */}
          <div style={{ flex: 1, minWidth: '320px', backgroundColor: '#ffffff', padding: '25px', borderRadius: '24px', boxShadow: '0 6px 18px rgba(0,0,0,0.02)' }}>
            <h3 style={{ color: '#4A5F73', marginBottom: '20px', fontSize: '20px' }}>🎀 我的物品清單</h3>

            {/* 👇👇👇 終點線：留下漂亮的團員接手註解 👇👇👇 */}
            {/* 💡 同學請注意：
                1. 請在這裡使用 useEffect 呼叫後端 API (GET http://localhost:5000/api/items) 拿到物品陣列。
                2. 呼叫時記得在網址帶上當前使用者的 Email 參數 (可從 localStorage.getItem('current_session_email') 取得)。
                3. 拿到資料後，用 items.map() 把下面這個可愛卡片元件渲染出來。
                4. 資料庫的物品格式為：{ name: '名稱', date: '日期', remindDays: '天數' }。
            */}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {items.map(item => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.03)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '15px 20px',
                    backgroundColor: item.color,
                    borderRadius: '16px',
                    transition: '0.2s',
                    cursor: 'pointer',
                    // ⭐ 即將過期動畫
                    animation:
                      item.daysLeft <= 2
                        ? 'pulse 1s infinite'
                        : 'none'
                  }}
                >
                  
                  <div
                    style={{
                      display:'flex',
                      alignItems:'center',
                      gap:'10px'
                    }}
                  >
                    {item.photo && (
                      <img
                        src={item.photo}
                        alt={item.name}
                        style={{
                          width:'60px',
                          height:'60px',
                          borderRadius:'12px',
                          objectFit:'cover'
                        }}
                      />
                    )}

                    <span
                      style={{
                        fontWeight:'bold',
                        color:'#4A5F73'
                      }}
                    >
                      {item.name}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ backgroundColor: '#ffffff', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', color: '#4A5F73' }}>
                      {item.expired
                        ? `已過期 ${Math.abs(item.daysLeft)} 天`
                        : `剩餘 ${item.daysLeft} 天`
                      }
                    </span>
                    <div style={{ fontSize: '11px', color: '#708090', marginTop: '3px' }}>到期日: {item.date}</div>
                    {/* ✅ 完成按鈕：點擊後不再追蹤此物品 */}
                    <button
                      className="done-btn"
                      onClick={(e) => {
                        e.stopPropagation(); // 防止觸發選取卡片
                        if (window.confirm(`「${item.name}」已用完或處理完成？`)) {
                          markDone(item.id);
                        }
                      }}
                    >
                      ✅ 完成
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 右區：新增物品表單區 */}
          <div style={{ width: '100%', maxWidth: '320px', backgroundColor: '#ffffff', padding: '25px', borderRadius: '24px', boxShadow: '0 6px 18px rgba(0,0,0,0.02)', height: 'fit-content' }}>
            <h3 style={{ color: '#4A5F73', marginBottom: '20px', fontSize: '20px' }}>{selectedItem ? '✏️ 編輯物品' : '➕ 新增物品'}</h3>
            {/* 顯示選中商品 */}
            {selectedItem && (
              <div
                style={{
                  background:'#F5F5F5',
                  padding:'10px',
                  borderRadius:'10px',
                  marginBottom:'15px'
                }}
              >
                目前選取：
                <strong>{selectedItem.name}</strong>
              </div>
            )}
            
            {/* 💡 同學請注意：
                1. 請幫這個表單綁定 onSubmit 處理。
                2. 點擊「儲存物品」時發送 POST 連線到 http://localhost:5000/api/items。
                3. 傳送的 body 要包含：{ name, date, remindDays, userEmail }。
            */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input
                type="text"
                placeholder="物品名稱"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  padding:'10px 14px',
                  border:'2px solid #E2E8F0',
                  borderRadius:'14px',
                  width:'100%',
                  boxSizing:'border-box'
                }}
              />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{
                  padding:'10px 14px',
                  border:'2px solid #E2E8F0',
                  borderRadius:'14px',
                  width:'100%',
                  boxSizing:'border-box',
                  color:'#708090'
                }}
              />
              <select
                value={remindDays}
                onChange={(e) => setRemindDays(e.target.value)}
                style={{
                  padding:'10px 14px',
                  border:'2px solid #E2E8F0',
                  borderRadius:'14px',
                  width:'100%',
                  boxSizing:'border-box',
                  color:'#708090'
                }}
              >
                <option value="1">1 天前提醒</option>
                <option value="3">3 天前提醒</option>
                <option value="7">7 天前提醒</option>
              </select>
              <label
                style={{
                  backgroundColor:'#D2DFE6',
                  color:'#4A5F73',
                  border:'none',
                  padding:'10px',
                  borderRadius:'14px',
                  cursor:'pointer',
                  textAlign:'center'
                }}
              >
                📷 選擇照片

                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageChange}
                />
              </label>
              {/* 圖片預覽 */}
              {preview && (
                <img
                  src={preview}
                  alt="預覽"
                  style={{
                    width:'100%',
                    borderRadius:'12px',
                    marginTop:'10px',
                    objectFit:'cover',
                    maxHeight:'180px'
                  }}
                />
              )}
              <button
                type="button"
                onClick={handleSubmit}
                style={{
                  backgroundColor:'#A3B8CC',
                  color:'white',
                  border:'none',
                  padding:'12px',
                  borderRadius:'14px',
                  cursor:'pointer',
                  fontWeight:'bold',
                  fontSize:'15px',
                  marginTop:'5px'
                }}
              >
              儲存物品
              </button>
              {/* 修改按鈕 */}
              {selectedItem && (
                <button
                  type="button"
                  onClick={() => {

                    setEditId(selectedItem.id);

                    setName(selectedItem.name);
                    setDate(selectedItem.date);
                    setRemindDays(selectedItem.remindDays);

                    if(selectedItem.photo){
                      setPhoto(selectedItem.photo);
                      setPreview(selectedItem.photo);
                    }

                  }}
                  style={{
                    backgroundColor:'#F5E2B3',
                    color:'#4A5F73',
                    border:'none',
                    padding:'12px',
                    borderRadius:'14px',
                    cursor:'pointer',
                    width:'100%',
                    marginTop:'10px'
                  }}
                >
                  ✏️ 修改此物品
                </button>
              )}
              {/* 刪除按鈕 */}
              {selectedItem && (
                <button
                  type="button"
                  onClick={() => deleteItem(selectedItem.id)}
                  style={{
                    backgroundColor:'#F2C6C6',
                    color:'#4A5F73',
                    border:'none',
                    padding:'12px',
                    borderRadius:'14px',
                    cursor:'pointer',
                    width:'100%',
                    marginTop:'10px'
                  }}
                >
                  🗑️ 刪除此物品
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
    </>
  );
}

export default Dashboard;