
// Dependincies #######################################################################################
import { CheckCircleOutlined, ExclamationCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import { useParams, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Flex, Radio, message, Checkbox, Spin } from 'antd';
import Cards from 'react-credit-cards-2';
import moment from 'moment';
import './Payment.css'
import Sozlesme from './Sozlesme';
import Karteks from './Karteks';



function Payment() {


  // Hooks #######################################################################################
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
  const [paymentType, setPaymentType] = useState(null);
  const apiURL = import.meta.env.VITE_API_BASE_URL;
  const [calculated, setCalculated] = useState(0);
  const [sozlesme, setSozlesme] = useState(false);
  const [selected, setSelected] = useState(null);
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [karteks, setKarteks] = useState(false);
  const [student, setStudent] = useState(null);
  const [contact, setContact] = useState(null);
  const [totalData, setTotalData] = useState({
    oldeducation: 0,
    oldfood: 0,
    neweducation: 0,
    newfood: 0
  });
  const [current, setCurrent] = useState([]);
  const [cardInfo, setCardInfo] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
    focus: '',
  });
  const [amount, setAmount] = useState(0);
  const [onay, setOnay] = useState(false);
  const params = useParams();
  const nav = useNavigate();
  const id = params.id;





  // Fetch student, contact and class current data ####################################################################
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const fetchStudent = await fetch(`${apiURL}/api/info/student/${id}`, {
          method: "GET",
          headers: { 'x-api-key': import.meta.env.VITE_API_KEY }
        });
        if (fetchStudent.ok) {
          const student = await fetchStudent.json();
          if (student.contact.id == user.ID || "{" + student.contact.id + "}" == user.ID) {
            setStudent(student.student);
            setContact(student.contact);
            const currentRes = await fetch(`${apiURL}/api/counts/sinif`, {
              method: "POST",
              headers: {
                'x-api-key': import.meta.env.VITE_API_KEY,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ gradeLevel: student.student.enrollment.gradeLevel, homeRoom: student.student.enrollment.homeroom })
            });
            if (currentRes.ok) {
              const currentData = await currentRes.json();
              setCurrent(currentData);
              let dcs = student.student.discounts.map((d) => {
                const ind = currentData.indirimler.findIndex((c) => c.name === d)
                return {
                  name: d,
                  value: currentData.indirimler[ind].value
                }
              });
              if (student.student.scholarship > 0) {
                dcs.push({ name: "Burs", value: student.student.scholarship });
              }
              let oldeducation = student.student.old.education;
              let oldfood = student.student.old.food;
              let neweducation = student.student.new.education;
              let newfood = student.student.new.food;
              if (student.student.olddiscounts.length > 0) {
                student.student.olddiscounts.sort((a, b) => b.value - a.value).map((d) => {
                  oldeducation = calc(oldeducation, d.value);
                  if (d.name == "PEŞİN" || d.name == "TEK") {
                    oldfood = calc(oldfood, d.value);
                  }
                })
              }
              const discounts = dcs.sort((a, b) => b.value - a.value).slice(0, 4);
              setDiscounts(discounts);
              if (discounts.length > 0) {
                discounts.map((d) => {
                  neweducation = calc(neweducation, d.value);
                  if (d.name == "PEŞİN" || d.name == "TEK") {
                    newfood = calc(newfood, d.value);
                  }
                })
              }
              setTotalData({
                oldeducation: oldeducation,
                oldfood: oldfood,
                neweducation: neweducation,
                newfood: newfood
              })
            } else {
              message.error("Veriler getirilemedi!");
            }
          } else {
            alert("Bu öğrenci verilerine erişme yetkiniz bulunmamaktadır!");
            nav('/profil');
          }
        }
        else { message.error("Veri Getirme Başarısız."); }
      }
      catch (error) { console.log("Veri hatası:", error); }
      finally { setLoading(false); }
    }
    fetchStudents();
  }, [apiURL])

  
  




  // Card Input changed #######################################################################################
  const handleInputChange = (evt) => {
    const { name, value } = evt.target;
    setCardInfo((prev) => ({ ...prev, [name]: value }));
  }

  



  // Calculate discounted amount #######################################################################################
  useEffect(() => {
    let x = amount;
    const discountList = discounts.sort((a, b) => b.value - a.value).slice(0, 4)
    discountList.map((d) => { x = calc(x, d.value) })
    setCalculated(x);
  }, [amount, discounts])



  // Card focus changed #######################################################################################
  const handleInputFocus = (evt) => { setCardInfo((prev) => ({ ...prev, focus: evt.target.name })); }




  // Calculate percentage #######################################################################################
  const calc = (count, perc) => { return count - (count / 100 * perc); }                              






  // Payment #######################################################################################
  const handlePay = async () => {
    if (!onay) {
      message.error("Sözleşmeyi okudum ve kabul ediyorum kısmını işaretleyiniz!");
      return;
    }
    try {
      const data = {
        cardNumber: cardInfo.number,
        cardHolder: cardInfo.name,
        cardCvv: cardInfo.cvc,
        cardExMonth: cardInfo.expiry.substring(0, 2),
        cardExYear: cardInfo.expiry.substring(2, 4),
        amount: calculated,
        installment: selected,
        user: contact.id
      }
      const res = await fetch(`${apiURL}/api/kuveyt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'x-api-key': import.meta.env.VITE_API_KEY
        },
        body: JSON.stringify(data)
      });

      var responseText = await res.json();
      if (responseText.success) {
        message.success("Ödeme sayfasına yönlendiriliyorsunuz.");

        document.open();
        document.write(responseText.html);
        document.close();
      }
    } catch (error) {
      console.log(error);
      message.error("Sunucu hatası oluştu!");
    }
  }



  return (
    <Spin spinning={loading}>
      {karteks && <Karteks student={student} current={current} totalData={totalData} discounts={discounts} onClose={() => setKarteks(false)} />}
      {sozlesme && <Sozlesme student={student} contact={contact} onClose={() => setSozlesme(false)} />}
      <div className="paymentGrid">
        <div className="infoArea">
          {student ?
            <>
              <Flex gap="middle" align='center'>
                <h2>{student.fullName}</h2>
              </Flex>
              <span></span>
              <div className="listArea">
                <h3>Kişisel Bilgiler</h3>
                <ul>
                  <li><b>Cinsiyet: </b>{student.gender !== null ? (student.gender ? "Erkek" : "Kız") : "Belirtilmemiş"}</li>
                  <li><b>T.C. Kimlik No: </b>{student.nationalID}</li>
                  <li><b>Doğum Tarihi: </b>{moment(student.birthDate).format('DD/MM/YYYY')}</li>
                  <li><b>Sınıf Seviyesi: </b>{student.enrollment.gradeLevel}</li>
                </ul>
                <span></span>
                <h3>Okul Bilgieri</h3>
                <ul style={{ position: "relative" }}>
                  <li><b>Sınıfı: </b>{student.enrollment.homeroom}</li>
                  <li><b>Okul Numarası: </b>{student.enrollment.localId}</li>
                  <li><b>Geçerli Dönem: </b>{student.enrollment.yearID - 1} - {student.enrollment.yearID}</li>
                  <li><b>Kurum: </b>{student.enrollment.school.lea.name}</li>
                  <li><b>Okul: </b>{student.enrollment.school.name}</li>
                </ul>
                <span></span>
                <h3>Ödeme Bilgileri</h3>
                {student?.new?.education + student?.new?.food - student?.paid > 0 ?
                  <>
                    <div className="paymentCard errorCard">
                      <ExclamationCircleOutlined className='cardIcon' />
                      <div className="paymentInfo">
                        <h4>{student.enrollment.yearID} - {student.enrollment.yearID + 1} Eğitim ve Öğretim Dönemi Ödeme Bilgileri</h4>
                        <span></span>
                        <p>Eğitim Ödemesi: {student?.new?.education.toLocaleString('tr-TR')}₺</p>
                        <p>Yemek Ödemesi: {student?.new?.food.toLocaleString('tr-TR')}₺</p>
                        <p>Ödenen: {student?.paid.toLocaleString('tr-TR')}₺</p>
                        <p>Kalan: {(student?.new?.education + student?.new?.food - student?.paid).toLocaleString('tr-TR')}₺</p>
                        <span></span>
                        <a onClick={() => setAmount(student?.new?.education + student?.new?.food - student?.paid)}>Hemen Öde</a>
                      </div>
                    </div>
                  </>
                  :
                  <div className="paymentCard successCard">
                    <CheckCircleOutlined className='cardIcon' />
                    <div className="paymentInfo">
                      <h4>Ödenmemiş Borç Bulunamadı.</h4>
                      <span></span>
                      <p>Şu an için bu öğrenciye ait ödenmemiş borç bulunmamaktadır.</p>
                    </div>
                  </div>
                }
                <div className="paymentCard infoCard">
                  <InfoCircleOutlined className='cardIcon' />
                  <div className="paymentInfo">
                    <h4>Bilgilendirme</h4>
                    <span></span>
                    <p>{student.enrollment.yearID} - {student.enrollment.yearID + 1} Eğitim ve öğretim dönemi kayıt karteksinizi görüntülemek için <a href='#' onClick={() => setKarteks(true)}>buraya</a> tıklayınız.</p>
                  </div>
                </div>
              </div>
            </>
            :
            <h2>Veriler yükleniyor...</h2>
          }
        </div>
        <div className="secondGrid">
          <div className="upGrid">
            <div className="selectedCount">
              {
                amount > 0 ?
                  <>
                    <ExclamationCircleOutlined className="selectedIcon" />
                    <h3>Ödeme Bilgileri</h3>
                    <p><b>Ödeme Tutarı: </b>{amount.toLocaleString('tr-TR')} ₺</p>
                    {discounts.length > 0 &&
                      <>
                        <p><b>İndirimler:</b></p>
                        <ul>
                          {discounts.map((d, k) => (
                            <li key={k}><p><b>{d.name}: </b>{d.value}%</p></li>
                          ))}
                        </ul>
                      </>
                    }
                    <p><b>Ödenecek Tutar: </b>{calculated.toLocaleString('tr-TR')} ₺</p>
                    <span className='span'></span>
                    <h3>Ödeme Seçenekleri</h3>
                    <Radio.Group onChange={(e) =>
                      discounts.findIndex((el) => el.name === e.target.value) == -1 &&
                      setDiscounts([...discounts, { name: e.target.value, value: (e.target.value === "OCAK TEK" ? current?.indirimler[12].value : current?.indirimler[14].value) }])
                    }>
                      <Flex vertical={true}>
                        <Radio disabled={new Date().getMonth() != 0} value={"OCAK TEK"}>Ocak Ayı Peşin (Havale) (-{current?.indirimler[11].value}%)</Radio>
                        <Radio disabled={new Date().getMonth() != 0} value={"OCAK TEK"}>Ocak Ayı Tek Çekim (-{current?.indirimler[12].value}%)</Radio>
                        <Radio disabled={new Date().getMonth() != 1} value={"ŞUBAT TEK"}>Şubat Ayı Peşin (Havale) (-{current?.indirimler[13].value}%)</Radio>
                        <Radio disabled={new Date().getMonth() != 1} value={"ŞUBAT TEK"}>Şubat Ayı Tek Çekim (-{current?.indirimler[14].value}%)</Radio>
                      </Flex>
                    </Radio.Group>
                    <Checkbox onChange={(e) => setOnay(e.target.checked)} style={{display: "flex", alignItems: "center", marginTop: "1rem"}}><a href='#' onClick={() => setSozlesme(true)}>Sözleşmeyi</a> okudum ve kabul ediyorum.</Checkbox>
                  </>
                  :
                  <>
                    <InfoCircleOutlined className="selectedIcon" />
                    <h3>Herhangi bir ödeme seçmediniz!</h3>
                  </>
              }
            </div>
            <div className="creditCard">
              <Cards
                number={cardInfo.number}
                expiry={cardInfo.expiry}
                cvc={cardInfo.cvc}
                name={cardInfo.name}
                placeholders={{ name: 'ADINIZ SOYADINIZ' }}
                locale={{ valid: 'Son Kul. Tar.' }}
                focused={cardInfo.focus}
              />
              <form className="cart-form" >
                <Flex vertical={window.innerWidth > 950} gap="middle" style={{ width: "100%" }}>
                  <input
                    type="tel"
                    name="number"
                    placeholder="Kart Numarası"
                    value={cardInfo.number}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    maxLength={16}
                    max="9999999999999999"
                  />
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Adınız Soyadınız"
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    required
                  />
                </Flex>
                <Flex vertical={window.innerWidth > 950} gap="middle" style={{ width: "100%" }}>
                  <input
                    type="tel"
                    name="expiry"
                    className="form-control"
                    placeholder="Son Kullanma Tarihi"
                    pattern="\d\d/\d\d"
                    required
                    maxLength={4}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                  />
                  <input
                    type="tel"
                    name="cvc"
                    className="form-control"
                    placeholder="CVC"
                    pattern="\d{3,4}"
                    maxLength="3"
                    required
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                  />
                </Flex>
              </form>
            </div>
          </div>
          <button className='submitPayment' onClick={() => handlePay()}>Ödemeyi Tamamla</button>
        </div>
      </div >
    </Spin>
  )
}

export default Payment
