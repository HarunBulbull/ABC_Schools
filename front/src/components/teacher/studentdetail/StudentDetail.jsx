import './StudentDetail.css'
import React, { useEffect, useState } from 'react';
import { Flex, message, Spin, Input, InputNumber, Popconfirm, Button } from 'antd';
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
      const response = await fetch(`${baseUrl}/api/info/student/${id}`, { 
        method: "GET" ,
        headers: { 'x-api-key': import.meta.env.VITE_API_KEY}
      });
      if (response.ok) {
        let data = await response.json();
        data.discounts = data.discounts.map((item, key) => ({ ...item, discount: Number(item.discount), key: key }));
        data.special = data.special.map((item, key) => ({ ...item, discount: Number(item.discount), key: key }));
        setStudent(data);
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

  const handleDelete = (key, type) => {
    setStudent({ ...student, [type]: student[type].filter((item) => item.key !== key) });
  }

  const handleSave = async () => {
    const discounts = [];
    let err = 0;
    await student.discounts.map((dis) => {
      if (dis.name && dis.discount) {
        if (dis.name.length > 0 && dis.discount > 0 && dis.discount < 101) {
          discounts.push({ name: dis.name, discount: dis.discount });
        }
        else { message.error("İndirim adı veya miktarı boş olamaz."); err++; }
      }
      else { message.error("İndirim adı veya miktarı boş olamaz."); err++; }
    })
    const special = [];
    await student.special.map((spe) => {
      if (spe.name && spe.discount) {
        if (spe.name.length > 0 && spe.discount > 0 && spe.discount < 101) {
          special.push({ name: spe.name, discount: spe.discount });
        }
        else { message.error("İndirim adı veya miktarı boş olamaz."); err++; }
      }
      else { message.error("İndirim adı veya miktarı boş olamaz."); err++; }
    })
    if (err > 0) return;
    const response = await fetch(`${baseUrl}/api/student/${student.id}`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json", 
        'x-api-key': import.meta.env.VITE_API_KEY
      },
      body: JSON.stringify({discounts, special}),
    });
    if(response.ok){message.success("Öğrenci bilgileri başarıyla güncellendi!");}
    else{message.error("Bir hata oluştu.");}
  }

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
              <li style={{ opacity: 0.3 }}><p><b>Veli Adı:</b> Çok yakında...</p></li>
              <li style={{ opacity: 0.3 }}><p><b>Veli Telefon:</b> Çok yakında...</p></li>
              <li style={{ opacity: 0.3 }}><p><b>Adres:</b> Çok yakında...</p></li>
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
            <h2>İndirimler</h2>
            <div className="discountGrid">
              <Flex vertical={true} gap="middle">
                <h4>Normal İndirimler</h4>
                {student?.discounts?.map((discount, index) => (
                  <Flex key={index} gap="small">
                    <Input
                      style={{ width: "100%" }}
                      placeholder='İndirim Adı'
                      value={discount.name}
                      onChange={(e) => setStudent({ ...student, discounts: student.discounts.map((item, key) => key === index ? { ...item, name: e.target.value } : item) })}
                    />
                    <Flex gap="small">
                      <InputNumber
                        min={1}
                        max={100}
                        style={{ width: "100%" }}
                        placeholder='İndirim Miktarı'
                        value={discount.discount}
                        onChange={(e) => setStudent({ ...student, discounts: student.discounts.map((item, key) => key === index ? { ...item, discount: e } : item) })}
                      />
                      <Popconfirm
                        title="İndirimi Sil"
                        description="İndirim silinecektir. Emin misiniz?"
                        okText="Sil"
                        cancelText="Vazgeç"
                        onConfirm={() => handleDelete(discount.key, "discounts")}
                      >
                        <Button type="primary" danger>Sil</Button>
                      </Popconfirm>
                    </Flex>
                  </Flex>
                ))}
                <Button
                  type="primary"
                  onClick={() => setStudent({ ...student, discounts: [...student.discounts, { name: "", discount: 1, key: student.discounts.length }] })}
                >
                  İndirim Ekle
                </Button>
              </Flex>
              <div className="span"></div>
              <Flex vertical={true} gap="middle">
                <h4>Gizli İndirimler</h4>
                {student?.special?.map((discount, index) => (
                  <Flex key={index} gap="small">
                    <Input
                      style={{ width: "100%" }}
                      placeholder='İndirim Adı'
                      value={discount.name}
                      onChange={(e) => setStudent({ ...student, special: student.special.map((item, key) => key === index ? { ...item, name: e.target.value } : item) })}
                    />
                    <Flex gap="small">
                      <InputNumber
                        min={1}
                        max={100}
                        style={{ width: "100%" }}
                        placeholder='İndirim Miktarı'
                        value={discount.discount}
                        onChange={(e) => setStudent({ ...student, special: student.special.map((item, key) => key === index ? { ...item, discount: e } : item) })}
                      />
                      <Popconfirm
                        title="İndirimi Sil"
                        description="İndirim silinecektir. Emin misiniz?"
                        okText="Sil"
                        cancelText="Vazgeç"
                        onConfirm={() => handleDelete(discount.key, "special")}
                      >
                        <Button type="primary" danger>Sil</Button>
                      </Popconfirm>
                    </Flex>
                  </Flex>
                ))}
                <Button
                  type="primary"
                  onClick={() => setStudent({ ...student, special: [...student.special, { name: "", discount: 1, key: student.special.length }] })}
                >
                  İndirim Ekle
                </Button>
              </Flex>
            </div>
            <Button type="primary" onClick={() => handleSave()}>Kaydet</Button>
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
