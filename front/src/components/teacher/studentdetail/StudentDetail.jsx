import './StudentDetail.css'
import React, { useEffect, useState } from 'react';
import { Flex, message, Alert, Space, Spin, Select, Input, InputNumber, Popconfirm, Button, Form } from 'antd';
import { EditOutlined, CaretRightOutlined, CheckCircleOutlined, ExclamationCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import Noter from '../noter/Noter';
import { useParams } from 'react-router-dom';
import moment from 'moment';


function StudentDetail() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [contact, setContact] = useState(null);
  const [current, setCurrent] = useState(null);
  const { id } = useParams();
  const [form] = Form.useForm();
  const [alert, setAlert] = useState(false);
  const fetchStudent = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/api/info/student/${id}`, {
        method: "GET",
        headers: { 'x-api-key': import.meta.env.VITE_API_KEY }
      });
      if (response.ok) {
        let data = await response.json();
        setStudent(data.student);
        setContact(data.contact);
        form.setFieldsValue({
          education: data.student.new.education,
          food: data.student.new.food,
          scholarship: data.student.scholarship,
          paid: data.student.paid,
          discounts: data.student.discounts,
        });
        const currentRes = await fetch(`${baseUrl}/api/counts/sinif`, {
          method: "POST",
          headers: {
            'x-api-key': import.meta.env.VITE_API_KEY,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ gradeLevel: data.student.enrollment.gradeLevel, homeRoom: data.student.enrollment.homeroom })
        });
        if (currentRes.ok) {
          let currentData = await currentRes.json();
          setCurrent(currentData);
        }
      }
      else { message.error("Öğrenci bilgileri getirilemedi."); }
    }
    catch (error) { console.error("Öğrenci bilgileri getirilemedi.", error); }
    finally { setLoading(false); }
  }

  useEffect(() => { fetchStudent(); }, [baseUrl, id])

  const onFinish = async (values) => {
    if (values.education > current.meb.education && !alert) {
      return setAlert(true);
    }
    values.scholarship = values.scholarship ? values.scholarship : 0;
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/api/student/${student.id}`, {
        method: "PUT",
        headers: { 
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_API_KEY 
        },
        body: JSON.stringify({...values, new: {education: values.education, food: values.food}})
      });
      if (response.ok) {
        message.success("Öğrenci bilgileri başarıyla güncellendi!");
        setAlert(false);
      }
      else { message.error("Bir hata oluştu."); }
    }
    catch (error) { console.error("Öğrenci bilgileri güncellenemedi.", error); }
    finally { setLoading(false); }
  }

  /*const handleSave = async () => {
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
  }*/

  return (
    <Spin spinning={loading}>
      <div className="detailMain">
        <div className="profile">
          <div className="gridLeft">
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
              <li><p><b>T.C. Kimlik No:</b> {student?.nationalID}</p></li>
              <li><p><b>Doğum Tarihi:</b> {moment(student?.birthDate).format("DD/MM/YYYY")}</p></li>
              <li><p><b>Veli Adı:</b> {contact?.fullName}</p></li>
              <li><p><b>Veli Telefon:</b> {contact?.phoneNumbers[0]}</p></li>
              <li><p><b>Veli E-posta:</b> {contact?.emails[0]}</p></li>
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
          <Form
            form={form}
            name="basic"
            layout="vertical"
            autoComplete="off"
            onFinish={onFinish}
            className="studentDetailForm"
            style={{ width: "100%" }}
          >
            <h2 style={{ marginBottom: "1rem" }}>Öğrenci Ücret Bilgileri</h2>
            <Flex gap="middle" className='studentDetailFormFirstFlex' align="end">
              <Flex gap="middle" className='studentDetailFormSecondFlex' style={{ width: "100%" }}>
                <Flex vertical={true} style={{ width: "100%" }}>
                  <i>Önceki dönem ücreti: {student?.old?.education.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</i>
                  <Form.Item
                    label="Eğitim Baz Ücreti"
                    name="education"
                    rules={[{ required: true, message: 'Lütfen eğitim baz ücretini giriniz.' }]}
                    style={{ width: "100%" }}
                  >
                    <InputNumber style={{ width: "100%" }} min={0} />
                  </Form.Item>
                </Flex>
                <Flex vertical={true} style={{ width: "100%" }}>
                  <i>Önceki dönem ücreti: {student?.old?.food.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</i>
                  <Form.Item
                    label="Yemek Baz Ücreti"
                    name="food"
                    rules={[{ required: true, message: 'Lütfen yemek baz ücretini giriniz.' }]}
                    style={{ width: "100%" }}
                  >
                    <InputNumber style={{ width: "100%" }} min={0} />
                  </Form.Item>
                </Flex>
              </Flex>
              <Flex gap="middle" style={{ width: "100%" }}>
                <Form.Item
                  label="Burs"
                  name="scholarship"
                  style={{ width: "100%" }}
                >
                  <InputNumber style={{ width: "100%" }} min={0} max={100} />
                </Form.Item>
                <Form.Item
                  label="Ödenen Ücret"
                  name="paid"
                  rules={[{ required: true, message: 'Lütfen ödenen ücreti giriniz.' }]}
                  style={{ width: "100%" }}
                >
                  <InputNumber style={{ width: "100%" }} min={0} max={student?.new?.education + student?.new?.food} />
                </Form.Item>
              </Flex>
            </Flex>
            <Form.Item>
              <Form.Item
                label="İndirim Kalemleri"
                name="discounts"
                style={{ width: "100%" }}
              >
                <Select
                  mode="multiple"
                  options={[
                    { label: "ÖĞRETMEN", value: "ÖĞRETMEN" },
                    { label: "KENDİ ÖĞRENCİMİZ", value: "KENDİ ÖĞRENCİMİZ" },
                    { label: "ŞEHİT", value: "ŞEHİT" },
                    { label: "GAZİ", value: "GAZİ" },
                    { label: "PEŞİN", value: "PEŞİN" },
                    { label: "TEK", value: "TEK" },
                    { label: "ERKEN", value: "ERKEN" },
                    { label: "YÖNETİM", value: "YÖNETİM" },
                    { label: "PERSONEL", value: "PERSONEL" },
                    { label: "GEÇİŞ", value: "GEÇİŞ" }
                  ]}
                />
              </Form.Item>
            </Form.Item>
            {alert && <Alert
              message="Dikkat"
              description="Girmiş olduğunuz ücretler, MEB'e bildirilen baz ücretlerinden daha yüksek. Devam edilsin mi?"
              type="warning"
              style={{ marginBottom: "1rem" }}
              action={
                <Space direction="vertical">
                  <Button size="small" type="primary" htmlType="submit">
                    Evet
                  </Button>
                  <Button size="small" danger ghost onClick={() => setAlert(false)}>
                    Hayır
                  </Button>
                </Space>
              }
            />}
            <Button disabled={alert} type="primary" htmlType="submit" style={{ width: "100%" }}>Kaydet</Button>
          </Form>
        </Flex>
      </div>
    </Spin>
  )
}

export default StudentDetail
