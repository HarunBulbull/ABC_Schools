import { useEffect } from 'react';
import './Login.css'
import { useNavigate } from 'react-router-dom'

function LoginLayout() {
  const apiUrl = import.meta.env.VITE_K12_GET_CODE;
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
  const nav = useNavigate();

  useEffect(() => {
    if(user){
      nav('/')
      window.location.reload();
    }
  }, [user])

  const handleLogin = () => {
    window.location.href = apiUrl;
  }

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
            <button onClick={() => handleLogin()}>Giriş Yap</button>
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
