import './Login.css'
import { UserOutlined, LockOutlined} from '@ant-design/icons'

function LoginLayout() {

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
            <div className="inputArea">
              <UserOutlined className='inputIcon'/>
              <input type="text" placeholder='T.C. Kimlik No'/>
            </div>
            <div className="inputArea">
              <LockOutlined lassName='inputIcon'/>
              <input type="password" placeholder='Şifre'/>
            </div>
            <a href='/kesfet'>Giriş Yap</a>
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
