import './Panel.css'
import {
  CompassOutlined,
  UnorderedListOutlined,
  CalendarOutlined,
  SettingOutlined,
  LogoutOutlined,
  CaretLeftOutlined,
  DollarOutlined
} from '@ant-design/icons'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'

function MainLayout({ children }) {
  const [activeTab, setActiveTab] = useState(window.location.pathname)
  const [collapsed, setCollapsed] = useState(window.innerWidth < 1156 ? true : false);
  const nav = useNavigate();

  const [link, setLink] = useState(window.location);            // Girilen url
  const [code, setCode] = useState("");                         // Access Code
  const baseUrl = import.meta.env.VITE_API_BASE_URL;            // Base url
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
  //
  // Link içindeki paramtereleri arayarak access code elde etme
  //

  useEffect(() => {
    if (link.search) {
      setCode(window.location.search.split('code=')[1].split('&')[0])
    } else {
      if(!user){
        nav('/login')
        window.location.reload();
      }
    }
  }, [link, user])


  useEffect(() => {
    if (code != "" && !user) {
      const fetchData = async () => {
        try {
          const response = await fetch(`${baseUrl}/api/token/${code}`, {
            method: "GET",
            headers: { 'x-api-key': import.meta.env.VITE_API_KEY}
          });
          const res = await response.json();
          if(response.ok){
            if(res.ID == "{d90dc8a4-49ae-ef11-8147-bc97e1afd933}"){
              localStorage.setItem('user', JSON.stringify(res));
              window.location.reload();
            }else{
              alert("Profilinizin portala erişim hakkı bulunmamaktadır. https://okul.k12net.com adresine gidip hesabınızdan çıkış yapıp Obiziz tarafından size verilen erişim hakkına sahip bir profil ile giriş yapınız.");
            }
          }else{
            nav('/login')
            window.location.reload();
          }
        } catch (error) {
          console.error(error);
        }
      }
      fetchData();
    }
  }, [code])

  
  window.addEventListener("resize", () => {
    if (window.innerWidth < 1156) { setCollapsed(true) }
  })

  const tabs = [
    {
      icon: <CompassOutlined />,
      label: 'Keşfet',
      path: '/kesfet'
    },
    {
      icon: <UnorderedListOutlined />,
      label: 'Öğrenci Listesi',
      path: '/ogrenci-listesi'
    },
    {
      icon: <UnorderedListOutlined />,
      label: 'Öğretmenler',
      path: '/ogretmen-listesi'
    },
    {
      icon: <CalendarOutlined />,
      label: 'Planlamalarım',
      path: '/planlamalarim'
    },
    {
      icon: <DollarOutlined />,
      label: 'Ücretler',
      path: '/ucretler'
    },
    {
      icon: <UnorderedListOutlined />,
      label: 'Bekleyen Ödemeler',
      path: '/borclar'
    },
  ]

  return (
    <div className="mainGrid">
      <div className="panelArea" style={collapsed ? { width: "50px" } : {}}>
        <img src="/assets/mainlogo.png" alt="main_logo" style={collapsed ? { width: "30px" } : {}} />
        <ul>
          {tabs.map((t, k) => (
            <li style={collapsed ? { width: "100%", padding: 0, justifyContent: "center" } : {}} key={k} onClick={() => { setActiveTab(t.path); nav(t.path) }} className={activeTab === t.path ? 'activeTab' : ''}><p>{t.icon}</p><p style={collapsed ? { display: "none" } : {}}>{t.label}</p></li>
          ))}
        </ul>
        <ul className='bottomPanel' style={collapsed ? { width: "50px" } : {}}>
          <li style={collapsed ? { width: "100%", padding: 0, justifyContent: "center" } : {}} onClick={() => { setActiveTab('/ayarlar'); nav('/ayarlar') }} className={activeTab === '/ayarlar' ? 'activeTab' : ''}><p><SettingOutlined /></p><p style={collapsed ? { display: "none" } : {}}>Ayarlar</p></li>
          <li style={collapsed ? { width: "100%", padding: 0, justifyContent: "center", display: window.innerWidth < 1156 ? "none" : "" } : { display: "flex" }} onClick={() => setCollapsed(!collapsed)}><p><CaretLeftOutlined className='collapseIcon' style={{ rotate: collapsed ? "180deg" : "0deg" }} /></p><p style={collapsed ? { display: "none" } : {}}>Daralt</p></li>
          <li style={collapsed ? { width: "100%", padding: 0, justifyContent: "center" } : {}}><a style={collapsed ? { justifyContent: "center" } : {}} href='/login' onClick={() => localStorage.removeItem('user')}><p><LogoutOutlined /></p><p style={collapsed ? { display: "none" } : {}}>Çıkış Yap</p></a></li>
        </ul>
      </div>
      <div className="mainArea" style={collapsed ? { marginLeft: "50px", width: "calc(100% - 50px" } : {}}>
        {children}
      </div>
    </div>
  )
}

export default MainLayout
