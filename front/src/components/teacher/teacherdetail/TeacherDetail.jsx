
import React from 'react';
import { Flex } from 'antd';
import { EditOutlined, CaretRightOutlined, CheckCircleOutlined, ExclamationCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import Noter from '../noter/Noter';

function TeacherDetail() {

  return (
    <div className="detailMain">
      <div className="profile">
        <div className="gridLeft">
          <img src="/assets/anonim.png" />
          <div className="gridLeftBottom"> 
            <h2>Öğretmen Adı</h2>
            <p>Matematik Öğretmeni</p>
          </div>
        </div>
        <div className="span"/>
        <div className="generalInfo">
          <h2>Genel Bilgiler</h2>
          <ul>
            <li><p><b>Öğretmen Adı:</b> Öğretmern Adı</p></li>
            <li><p><b>T.C. Kimlik No:</b> 12345678912</p></li>
            <li><p><b>Doğum Tarihi:</b> 09/08/1980 (44)</p></li>
            <li><p><b>Telefon:</b> +90 (555) 555 55 55</p></li>
            <li><p><b>E-mail:</b> info@obiziz.com</p></li>
            <li><p><b>Adres:</b> Çankaya mahallesi, Nilgün sokak, No:14/1, ÇANKAYA/ANKARA - 06680</p></li>
          </ul>
        </div>
        <div className="span"/>
        <div className="generalInfo">
          <h2>Sağlık Bilgileri</h2>
          <ul>
            <li><p><b>Sağlık Problemleri:</b></p></li>
            <ul style={{marginTop: 0}}>
              <li><p>Alerjik sinüzit</p></li>
              <li><p>Astigmat</p></li>
            </ul>
          </ul>
          <ul>
            <li><p><b>Sürekli Kullandığı İlaçlar:</b></p></li>
            <ul style={{marginTop: 0}}>
              <li><p>Öğretmenin sürekli kullandığı ilaç yoktur.</p></li>
            </ul>
          </ul>
          <ul>
            <li><p><b>Sağlık Raporu:</b></p></li>
            <ul style={{marginTop: 0}}>
              <li><a href="#">Sağlık raporunu görüntüle</a></li>
            </ul>
          </ul>
        </div>
        <EditOutlined className='editIcon'/>
      </div>
    </div>
  )
}

export default TeacherDetail
