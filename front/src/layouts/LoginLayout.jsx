import { useState } from 'react';
import './Login.css'
import { UserOutlined, LockOutlined } from '@ant-design/icons'

function LoginLayout() {
  const apiUrl = import.meta.env.VITE_K12_BASE_URL;
  const clientId = import.meta.env.VITE_K12_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_K12_CLIENT_SECRET;
  const redirectUrl = import.meta.env.VITE_K12_REDIRECT_URL;

  return (
    <>
      <div className="backgroundVideo">
        <div className="overVideoDiv"></div>
        <video autoPlay loop muted playsInline src="https://abc.k12.tr/wp-content/uploads/2023/12/abctanitim.mp4"></video>
      </div>
      <div className="loginFormArea">
        <h1>ABC Portal Giriş</h1>
        <div className="loginFormGrid">
          <div className="loginInputs">
            <a href={`${apiUrl}/GWCore.Web/connect/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUrl}&scope=openid%20profile`}>Giriş Yap</a>
          </div>
          <div className='span'></div>
          <div className="brandArea">
            <img src="/assets/mainlogo.png" alt="main_logo" />
            <h3>ABC Koleji</h3>
          </div>
        </div>
      </div>
    </>
  )
}

export default LoginLayout
