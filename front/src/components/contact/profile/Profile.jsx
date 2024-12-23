// * Obiziz 2024
// ! Dependincies
import './Profile.css'
import { SearchOutlined, PhoneOutlined, MailOutlined, DeploymentUnitOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import Student from './Student';
import moment from 'moment';

function ContactProfile() {

  // ! Hooks
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;  // ? Localden kullanıcı verilerini çeker
  const [studentRecovery, setStudentRecovery] = useState([]);                                   // ? Yedek öğrenci listesi
  const apiURL = import.meta.env.VITE_API_BASE_URL;                                             // ? Api URL
  const [students, setStudents] = useState([]);                                                 // ? Öğrenci Listesi
  const [info, setInfo] = useState([]);                                                         // ? Veli Bilgisi

  // * Veli Bilgilerini ve Veli öğrencilerinin detay bilgilerini çekme
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(`${apiURL}/api/info/contactStudents/${user.ID}`, { method: "GET" });
        if (response.ok) {
          const data = await response.json();
          setInfo(data);

          // ? Her öğrencinin detaylı bilgilerini çekip kaydetme
          let studentList = [];
          for (const s of data.students) {
            const fetchStudent = await fetch(`${apiURL}/api/info/student/${s.id}`, { method: "GET" });
            if (fetchStudent.ok) {
              const student = await fetchStudent.json();
              studentList.push(student);
            }
          }
          setStudents(studentList);
          setStudentRecovery(studentList);
        }
        else { message.error("Veri Getirme Başarısız."); }
      }
      catch (error) { console.log("Veri hatası:", error); }
    }
    fetchStudents();
  }, [apiURL])

  // * Öğrenci arama
  const handleSearch = (value) => {
    if (value != "") { setStudents(studentRecovery.filter((st) => st.fullName.toLowerCase().includes(value.toLowerCase()))) }
    else { setStudents(studentRecovery); }
  }

  return (
    <div className='contactFullGrid'>
      {info ?
        <div className="contactGrid">
          <div className="contactInfo">
            <DeploymentUnitOutlined className='icon' />
            <h2>Genel Bilgileriniz</h2>
            <p><b>İsim: </b>{info.fullName}</p>
            <p><b>Cinsiyet: </b>{info.gender}</p>
            <p><b>T.C. Kimlik No: </b>{info.nationalID}</p>
            <p><b>Doğum Tarihi: </b>{moment(info.birthDate).format('DD/MM/YYYY')}</p>
          </div>
          <div className="contactInfo">
            <PhoneOutlined className='icon' />
            <h2>Telefon Numaralarınız</h2>
            {info.phoneNumbers && info.phoneNumbers.length > 0 ?
              <ul>
                {info.phoneNumbers.map((p, k) => (
                  <li key={k}><p>{p}</p></li>
                ))}
              </ul>
              :
              <p>Hiç telefon numarası bulunamadı... :(</p>
            }
          </div>
          <div className="contactInfo">
            <MailOutlined className='icon' />
            <h2>E-posta Adresleriniz</h2>
            {info.emails && info.emails.length > 0 ?
              <ul>
                {info.emails.map((e, k) => (
                  <li key={k}><p>{e}</p></li>
                ))}
              </ul>
              :
              <p>Hiç e-posta bulunamadı... :(</p>
            }
          </div>
        </div>
        :
        <p>Yükleniyor...</p>
      }
      <div className="contactBottomGrid">
        <div className="leftSide">
          <div className="findArea">
            <input type="text" placeholder='Velisi Olduğunuz Öğrenciler' onChange={(e) => handleSearch(e.target.value)} />
            <SearchOutlined className='icon' />
          </div>
          <div className='studentList'>
            {students.map((s, k) => (
              <Student key={k} info={s} count={150000} />
            ))}
          </div>
        </div>
        <div className="rightSide">
          <h3>Ödeme Geçmişi</h3>
          <div className="payment">
            <h4>Ödeme Başlığı</h4>
            <p><b>Öğrenci: </b>Öğrenci adı</p>
            <p><b>Tutar: </b>0.000₺</p>
            <a href="#">Dekont görüntüle</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactProfile
