import './Panel.css'
import {
  CheckCircleOutlined,
  LogoutOutlined,
  CaretLeftOutlined,
  UserOutlined ,
  GatewayOutlined
} from '@ant-design/icons'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'

function ContactLayout({ children }) {
  const [activeTab, setActiveTab] = useState(window.location.pathname)
  const [collapsed, setCollapsed] = useState(window.innerWidth < 1156 ? true : false);
  const nav = useNavigate();
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : logOut();
  const logOut = () => {
    localStorage.removeItem("user");
    window.location.reload();
  }

  useEffect(() => {
    nav('/profil')
  }, [])

  window.addEventListener("resize", () => {
    if (window.innerWidth < 1156) { setCollapsed(true) }
  })

  const tabs = [
    {
      icon: <UserOutlined />,
      label: 'Profilim',
      path: '/profil',
      disabled: false
    },
    /*{
      icon: <GatewayOutlined />,
      label: 'Rehberlik',
      path: '/rehberlik',
      disabled: true
    },
    {
      icon: <CheckCircleOutlined />,
      label: 'Ödeme Geçmişi',
      path: '/odeme-gecmisi',
      disabled: true
    },*/
  ]

  return (
    <div className="mainGrid">
      <div className="panelArea" style={collapsed ? { width: "50px" } : {}}>
        <img src="/assets/mainlogo.png" alt="main_logo" style={collapsed ? { width: "30px" } : {}} />
        <ul>
          {tabs.map((t, k) => (
            <li style={collapsed ? { width: "100%", padding: 0, justifyContent: "center", opacity: t.disabled ? ".5" : "1", cursor: t.disabled ? "not-allowed" : "pointer"} : {opacity: t.disabled ? ".5" : "1", cursor: t.disabled ? "not-allowed" : "pointer"}} key={k} onClick={ () => {setActiveTab(!t.disabled && t.path); nav(!t.disabled && t.path) }} className={activeTab === t.path ? 'activeTab' : ''}><p>{t.icon}</p><p style={collapsed ? { display: "none" } : {}}>{t.label}</p></li>
          ))}
        </ul>
        <ul className='bottomPanel' style={collapsed ? { width: "50px" } : {}}>
          <li style={collapsed ? { width: "100%", padding: 0, justifyContent: "center", display: window.innerWidth < 1156 ? "none" : "" } : { display: "flex" }} onClick={() => setCollapsed(!collapsed)}><p><CaretLeftOutlined className='collapseIcon' style={{ rotate: collapsed ? "180deg" : "0deg" }} /></p><p style={collapsed ? { display: "none" } : {}}>Daralt</p></li>
          <li style={collapsed ? { width: "100%", padding: 0, justifyContent: "center" } : {}}><a style={collapsed ? { justifyContent: "center" } : {}} href='/' onClick={() => logOut()}><p><LogoutOutlined /></p><p style={collapsed ? { display: "none" } : {}}>Çıkış Yap</p></a></li>
        </ul>
      </div>
      <div className="mainArea" style={collapsed ? { marginLeft: "50px", width: "calc(100% - 50px" } : {}}>
        {children}
      </div>
    </div>
  )
}

export default ContactLayout
