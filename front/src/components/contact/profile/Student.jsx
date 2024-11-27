import './Profile.css'
import React from 'react';
import { Flex } from 'antd';
import { useNavigate } from 'react-router-dom';

function Student({count}) {

  const nav = useNavigate();

  return (
    <div className="studentInfoFlex">
      <Flex align='center' justify='space-between' gap="middle" className='studentBreakPoint'>
        <Flex align='center' gap="middle">
          <img src="/assets/anonim.png" alt="profile" />
          <Flex vertical={true}>
            <h3>Öğr. Adı Soyadı</h3>
            <p style={count>0 ? {color: "#ff0000"} : {}}>Ödenmeyen borç {count>0 ? (": " + count.toLocaleString('tr-TR') + "₺") : " yok"} </p>
          </Flex>
        </Flex>
        <Flex gap="small" className='studentBreakPoint3'>
          <button className='studentEdit'>Bilgileri Düzenle</button>
          <button className='studentEdit'>Notları Görüntüle</button>
          <button className='studentEdit' onClick={() => nav('/odemeyap')}>Ödemeler</button>
        </Flex>
      </Flex>
      <Flex gap="large" justify='space-between' className='studentBreakPoint'>
        <div className="studentInfo">
          <h3>Kişisel Bilgiler</h3>
          <Flex gap="large" className='studentBreakPoint2'>
            <div>
              <p><b>Doğduğu ülke: </b>Türkiye</p>
              <p><b>Doğduğu il: </b>Ankara</p>
              <p><b>Doğum Tarihi: </b>09.08.2012</p>
            </div>
            <div>
              <p><b>Cinsiyet: </b>Erkek</p>
              <p><b>Dili: </b>Türkçe</p>
            </div>
          </Flex>
        </div>
        <div className="studentInfo">
          <h3>Okul Bilgileri</h3>
          <Flex gap="large" className='studentBreakPoint2'>
            <div>
              <p><b>Giriş Tarihi: </b>09.08.2021</p>
              <p><b>Çıkış Tarihi: </b>-</p>
              <p><b>Kayıt Türü: </b>Asıl kayıt</p>
            </div>
            <div>
              <p><b>Sınıfı: </b>3/A</p>
              <p><b>Numarası: </b>123</p>
              <p><b>Branş: </b>Sayısal</p>
            </div>
            <div>
              <p><b>Yatılılık Durumu: </b>Evet</p>
              <p><b>Danışman: </b>H. Can Azapcı</p>
              <p><b>Rehber: </b>Uğur Özer</p>
            </div>
          </Flex>
        </div>
      </Flex>
    </div>
  )
}

export default Student
