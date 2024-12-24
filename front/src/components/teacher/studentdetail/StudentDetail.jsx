import './StudentDetail.css'
import React, { useEffect, useState } from 'react';
import { Flex, message, Spin } from 'antd';
import { EditOutlined, CaretRightOutlined, CheckCircleOutlined, ExclamationCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import Noter from '../noter/Noter';
import { useParams } from 'react-router-dom';
import moment from 'moment';

function StudentDetail() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const fetchStudent = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/api/info/student/${id}`, { method: "GET" });
      if (response.ok) {
        const data = await response.json();
        setStudent(data);
        console.log(data);
      }
      else { message.error("Öğrenci bilgileri getirilemedi."); }
    }
    catch (error) { console.error("Öğrenci bilgileri getirilemedi.", error); }
    finally { setLoading(false); }
  }

  useEffect(() => { fetchStudent(); }, [baseUrl, id])

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
    <Spin spinning={loading}>
      <div className="detailMain">
        <div className="profile">
          <div className="gridLeft">
            <img src="/assets/anonim.png" />
            <div className="gridLeftBottom">
              <h2>{student?.fullName}</h2>
              <p>{student?.enrollment.homeroom}</p>
            </div>
          </div>
          <div className="span" />
          <div className="generalInfo">
            <h2>Genel Bilgiler</h2>
            <ul>
              <li><p><b>Öğrenci Adı:</b> {student?.fullName}</p></li>
              <li><p><b>Sınıf:</b> {student?.enrollment.homeroom}</p></li>
              <li><p><b>Öğrenci Numarası:</b> {student?.enrollment.localId}</p></li>
              <li><p><b>T.C. Kimlik No:</b> {student?.nationalId}</p></li>
              <li><p><b>Doğum Tarihi:</b> {moment(student?.birthDate).format("DD/MM/YYYY")}</p></li>
              <li><p><b>Veli Adı:</b> Veli Adı</p></li>
              <li><p><b>Veli Telefon:</b> +90 (555) 555 55 55</p></li>
              <li><p><b>Adres:</b> Çankaya mahallesi, Nilgün sokak, No:14/1, ÇANKAYA/ANKARA - 06680</p></li>
            </ul>
          </div>
          <div className="span" />
          <div className="generalInfo">
            <h2>Sağlık Bilgileri</h2>
            <ul>
              <li><p><b>Sağlık Problemleri:</b></p></li>

              <ul style={{ marginTop: 0 }}>
                {student?.health?.illnesses && student?.health?.illnesses.length > 0 ? student?.health?.illnesses.map((illness, index) => (
                  <li key={index}><p>{illness}</p></li>
                )) : 
                <li><p>Öğrencinin sağlık problemleri yoktur.</p></li>}
              </ul>
            </ul>
            <ul>
              <li><p><b>Sürekli Kullandığı İlaçlar:</b></p></li>
              <ul style={{ marginTop: 0 }}>
              {student?.health?.medicines && student?.health?.medicines.length > 0 ? student?.health?.medicines.map((medicine, index) => (
                  <li key={index}><p>{medicine}</p></li>
                )) : 
                <li><p>Öğrencinin sürekli kullandığı ilaç yoktur.</p></li>}
              </ul>
            </ul>
            <ul>
              <li><p><b>Sağlık Raporu:</b></p></li>
              <ul style={{ marginTop: 0 }}>
                <li><a href={student?.health?.report}>Sağlık raporunu görüntüle</a></li>
              </ul>
            </ul>
          </div>
          <EditOutlined className='editIcon' />
        </div>

        
        <Flex gap="large" className='secondSection'>
          <div className="notesArea">
            <Flex justify="space-between" align='center'>
              <h2>Ders Notları</h2>
              <a href="/ogrenci/obiziz/dersler" className='allButton'>Hepsi <CaretRightOutlined /></a>
            </Flex>
            <a href="#" className='button'>2024-2025 1. Dönem</a>
            <a href="#" className='button'>2024-2025 2. Dönem</a>
            <a href="#" className='button'>2025-2026 1. Dönem</a>
          </div>
          <div className="notesArea">
            <Flex justify="space-between" align='center'>
              <h2>Ödeme Geçmişi</h2>
              <a href="#" className='allButton'>Hepsi <CaretRightOutlined /></a>
            </Flex>
            <a href="#" className='button success'><CheckCircleOutlined />&nbsp;&nbsp;2024-2025 1. Dönem</a>
            <a href="#" className='button pending'><ClockCircleOutlined />&nbsp;&nbsp;2024-2025 2. Dönem</a>
            <a href="#" className='button error'><ExclamationCircleOutlined />&nbsp;&nbsp;2024-2025 2. Dönem</a>
          </div>
        </Flex>
        <div className="mainNotes">
          <Flex align='center' justify='space-between'>
            <h2>Rehberlik Notları</h2>
            <a href="#" className='allButton'>Hepsi <CaretRightOutlined /></a>
          </Flex>
          <Flex vertical={true} gap="middle" style={{ marginTop: "1rem" }}>
            {notes.map((n, k) => (
              <div className="noteGrid">
                <Noter key={k} info={n} />
                <CaretRightOutlined className='noteDetail' />
              </div>
            ))}
            <a href="#" className='mainNotesButton'>Yeni Not Ekle</a>
          </Flex>
        </div>
      </div>
    </Spin>
  )
}

export default StudentDetail
