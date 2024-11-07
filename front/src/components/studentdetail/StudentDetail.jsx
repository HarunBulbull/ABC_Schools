import './StudentDetail.css'
import React from 'react';
import { Flex } from 'antd';
import { EditOutlined, CaretRightOutlined, CheckCircleOutlined, ExclamationCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import Noter from '../noter/Noter';

function StudentDetail() {

  const notes = [
    {
      name: "Mert Yılmaz",
      main: "Kişisel Rehberlik",
      note: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus aliquet id ligula eget elementum. Maecenas hendrerit, elit in maximus porttitor, neque urna bibendum nisl, ut pellentesque leo purus quis odio. Maecenas pharetra, nibh et mattis blandit, neque lacus dictum lorem."
    },
    {
      name: "Uğur Özer",
      main: "Gelişimsel Rehberlik",
      note: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus aliquet id ligula eget elementum. Maecenas hendrerit, elit in maximus porttitor, neque urna bibendum nisl, ut pellentesque leo purus quis odio. Maecenas pharetra, nibh et mattis blandit, neque lacus dictum lorem."
    },
    {
      name: "H. Can Azapcı",
      main: "Eğitsel Rehberlik",
      note: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus aliquet id ligula eget elementum. Maecenas hendrerit, elit in maximus porttitor, neque urna bibendum nisl, ut pellentesque leo purus quis odio. Maecenas pharetra, nibh et mattis blandit, neque lacus dictum lorem."
    },
    {
      name: "Harun Bülbül",
      main: "Mesleki Rehberlik",
      note: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus aliquet id ligula eget elementum. Maecenas hendrerit, elit in maximus porttitor, neque urna bibendum nisl, ut pellentesque leo purus quis odio. Maecenas pharetra, nibh et mattis blandit, neque lacus dictum lorem."
    }
  ];

  return (
    <div className="detailMain">
      <div className="profile">
        <div className="gridLeft">
          <img src="/assets/anonim.png" />
          <div className="gridLeftBottom"> 
            <h2>Öğrenci Adı</h2>
            <p>1/A Sınıfı (123)</p>
          </div>
        </div>
        <div className="span"/>
        <div className="generalInfo">
          <h2>Genel Bilgiler</h2>
          <ul>
            <li><p><b>Öğrenci Adı:</b> Öğrenci Adı</p></li>
            <li><p><b>Sınıf / Şube:</b> 1/A</p></li>
            <li><p><b>Öğrenci Numarası:</b> 123</p></li>
            <li><p><b>T.C. Kimlik No:</b> 12345678912</p></li>
            <li><p><b>Doğum Tarihi:</b> 09/08/2018 (6)</p></li>
            <li><p><b>Veli Adı:</b> Veli Adı</p></li>
            <li><p><b>Veli Telefon:</b> +90 (555) 555 55 55</p></li>
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
              <li><p>Öğrencinin sürekli kullandığı ilaç yoktur.</p></li>
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
      <Flex gap="large" className='secondSection'>
        <div className="notesArea">
          <Flex justify="space-between" align='center'>
            <h2>Ders Notları</h2>
            <a href="#" className='allButton'>Hepsi <CaretRightOutlined/></a>
          </Flex>
          <a href="#" className='button'>2024-2025 1. Dönem</a>
          <a href="#" className='button'>2024-2025 2. Dönem</a>
          <a href="#" className='button'>2025-2026 1. Dönem</a>
        </div>
        <div className="notesArea">
          <Flex justify="space-between" align='center'>
            <h2>Ödeme Geçmişi</h2>
            <a href="#" className='allButton'>Hepsi <CaretRightOutlined/></a>
          </Flex>
          <a href="#" className='button success'><CheckCircleOutlined />&nbsp;&nbsp;2024-2025 1. Dönem</a>
          <a href="#" className='button pending'><ClockCircleOutlined />&nbsp;&nbsp;2024-2025 2. Dönem</a>
          <a href="#" className='button error'><ExclamationCircleOutlined />&nbsp;&nbsp;2024-2025 2. Dönem</a>
        </div>
      </Flex>
      <div className="mainNotes">
        <Flex align='center' justify='space-between'>
          <h2>Rehberlik Notları</h2>
          <a href="#" className='allButton'>Hepsi <CaretRightOutlined/></a>
        </Flex>
        <Flex vertical={true} gap="middle" style={{marginTop: "1rem"}}>
          {notes.map((n,k) => (
            <div className="noteGrid">
              <Noter key={k} info={n}/>
              <CaretRightOutlined className='noteDetail'/>
            </div>
          ))}
          <a href="#" className='mainNotesButton'>Yeni Not Ekle</a>
        </Flex>
      </div>
    </div>
  )
}

export default StudentDetail
