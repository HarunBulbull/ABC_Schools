import './Profile.css'
import React from 'react';
import { EditOutlined } from '@ant-design/icons';
import Student from './Student';

function ContactProfile() {

  return (
    <div className="contactGrid">
      <div className="contactInfoArea">
        <div className="contactInfoFlex">
          <div className="contactInfo">
            <h2>Genel Bilgileriniz</h2>
            <p><b>Adınız: </b>Veli Adı</p>
            <p><b>Soyadınız: </b>Veli Soyadı</p>
            <p><b>Vatandaşlık: </b>Türk</p>
          </div>
          <div className="contactInfo">
            <h2>Mesleki Bilgileriniz</h2>
            <p><b>Meslek Grubu: </b>Bilgi İşlem</p>
            <p><b>Meslek: </b>Yazılım</p>
            <p><b>Görev: </b>Yazılım Geliştirici</p>
            <p><b>Şirket: </b>Obiziz Dijital İletişim</p>
          </div>
          <div className="contactInfo">
            <h2>Telefon Numaralarınız</h2>
            <ul>
              <li><p>+90 (555) 555 55 55</p></li>
              <li><p>+90 (555) 555 55 55</p></li>
              <li><p>+90 (555) 555 55 55</p></li>
            </ul>
          </div>
          <div className="contactInfo">
            <h2>E-posta Adresleriniz</h2>
            <ul>
              <li><p>info@obiziz.com</p></li>
              <li><p>info@obiziz.com</p></li>
              <li><p>info@obiziz.com</p></li>
            </ul>
          </div>
          <div className="contactInfo">
            <h2>Adresleriniz</h2>
            <ul>
              <li><p>Çankaya mah, Nilgün sok. 14/1, 06680, Çankaya/Ankara</p></li>
              <li><p>Çankaya mah, Nilgün sok. 14/1, 06680, Çankaya/Ankara</p></li>
              <li><p>Çankaya mah, Nilgün sok. 14/1, 06680, Çankaya/Ankara</p></li>
            </ul>
          </div>
        </div>
        <button className='contactEdit'><EditOutlined/> Bilgileri Düzenle</button>
      </div>
      <div className="contactFlex">
        <Student count={0}/>
        <Student count={0}/>
        <Student count={150000}/>
        <Student count={75000}/>
        <Student count={0}/>
        <Student count={0}/>
      </div>
    </div>
  )
}

export default ContactProfile
