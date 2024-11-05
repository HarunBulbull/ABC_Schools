import './Panel.css'
import { 
  CompassOutlined,
  UnorderedListOutlined,
  CalendarOutlined,
  SettingOutlined,
  LogoutOutlined,
  CaretLeftOutlined
} from '@ant-design/icons'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'

function MainLayout({ children }) {
  const [activeTab, setActiveTab] = useState(window.location.pathname)
  const [collapsed, setCollapsed] = useState(false);
  const nav = useNavigate();

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
      icon: <CalendarOutlined />,
      label: 'Planlamalarım',
      path: '/planlamalarim'
    },
  ]

  return (
    <div className="mainGrid" style={collapsed ? {gridTemplateColumns: "50px 1fr"} : {}}>
      <div className="panelArea" style={collapsed ? {width: "50px"} : {}}>
        <img src="/assets/mainlogo.png" alt="main_logo" style={collapsed ? {width: "30px"} : {}} />
        <ul>
          {tabs.map((t, k) => (
            <li style={collapsed ? {width: "100%", padding: 0, justifyContent: "center"} : {}} key={k} onClick={() => {setActiveTab(t.path); nav(t.path)}} className={activeTab === t.path ? 'activeTab' : ''}><p>{t.icon}</p><p style={collapsed ? {display: "none"} : {}}>{t.label}</p></li>
          ))}
        </ul>
        <ul className='bottomPanel' style={collapsed ? {width: "50px"} : {}}>
          <li style={collapsed ? {width: "100%", padding: 0, justifyContent: "center"} : {}} onClick={() => {setActiveTab('/ayarlar'); nav('/ayarlar')}} className={activeTab === '/ayarlar'? 'activeTab' : ''}><p><SettingOutlined /></p><p style={collapsed ? {display: "none"} : {}}>Ayarlar</p></li>
          <li style={collapsed ? {width: "100%", padding: 0, justifyContent: "center"} : {}} onClick={() => setCollapsed(!collapsed)}><p><CaretLeftOutlined className='collapseIcon' style={{rotate: collapsed ? "180deg" : "0deg"}}/></p><p style={collapsed ? {display: "none"} : {}}>Daralt</p></li>
          <li style={collapsed ? {width: "100%", padding: 0, justifyContent: "center"} : {}}><a style={collapsed ? {justifyContent: "center"} : {}} href='/login'><p><LogoutOutlined /></p><p style={collapsed ? {display: "none"} : {}}>Çıkış Yap</p></a></li>
        </ul>
      </div>
      <div className="mainArea">
        {children}
      </div>
    </div>
  )
}

export default MainLayout
