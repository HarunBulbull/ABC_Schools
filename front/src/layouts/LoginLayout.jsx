import { useEffect } from 'react';
import './Login.css'
import { useNavigate } from 'react-router-dom'

function LoginLayout() {
  const apiUrl = import.meta.env.VITE_K12_GET_CODE;
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
  const nav = useNavigate();

  useEffect(() => {
    if(user){window.location.reload();}
    else{
      if(window.location.search.includes("code=")){
        const code = window.location.search.split('code=')[1].split('&')[0];
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
            }
            
            else{alert("Verileriniz getirilirken bir hata oluştu! :(");}
          } catch (error) {
            console.error(error);
          }
        }
        fetchData();
      }
    }
  }, [user])

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
            <button onClick={() => window.location.href = apiUrl}>Giriş Yap</button>
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
