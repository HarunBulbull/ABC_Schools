// * Obiziz 2024
// ! Dependincies
import { CheckCircleOutlined, ExclamationCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import { useParams, useNavigate } from 'react-router-dom';
import bankList from '../../../context/banklist.json'
import React, { useEffect, useState } from 'react';
import { Flex, Radio, message } from 'antd';
import Cards from 'react-credit-cards-2';
import moment from 'moment';
import './Payment.css'

function Payment() {

  // ! Hooks
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null; // ? Localden kullanıcı verilerini çeker
  const [selectedPayment, setselectedPayment] = useState(null);                                // ? Ödeme yapılacak yıl
  const [installmentList, setInstallmentList] = useState([]);                                  // ? Taksitler
  const [paymentType, setPaymentType] = useState(null);                                        // ? Ödeme seçeneği (taksitli, tek...)
  const apiURL = import.meta.env.VITE_API_BASE_URL;                                            // ? Api Url
  const [calculated, setCalculated] = useState(0);                                             // ? İndirimler uygulanmış ücret
  const [selected, setSelected] = useState(null);                                              // ? Seçilen taksit
  const [discounts, setDiscounts] = useState([]);                                              // ? İndirimler
  const [student, setStudent] = useState(null);                                                // ? Öğrenci bilgileri
  const [amount, setAmount] = useState(0);                                                     // ? İndirimsiz fiyat
  const [bank, setBank] = useState(null);                                                      // ? Girilen bin nosundan bulunan banka
  const [info, setInfo] = useState([]);                                                        // ? Veli Bilgileri
  const params = useParams();                                                                  // ? UseParam Hook
  const nav = useNavigate();                                                                   // ? UseNavigate Hook
  const id = params.id;                                                                        // ? URL param ile gelen öğrenci idsi

  // * Öğrenci ve Veli bilgilerini çekme
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(`${apiURL}/api/info/contactStudents/${user.ID}`, { method: "GET" });
        if (response.ok) {
          const data = await response.json();
          setInfo(data);

          // ! Öğrenci, velinin öğrencisi değilse sayfadan at
          /*if (data.students.findIndex((el) => el.id === id) == -1) {
            alert("Bu öğrenci verilerine erişme yetkiniz bulunmamaktadır!");
            nav('/profil');
          }*/

          // ? İndirimler
          let dc = [];
          if (new Date().getMonth() == 0) { dc.push({ label: 'Erken Kayıt', discount: 10 }); }
          if (data.students.length > 1) { dc.push({ label: 'Kardeş', discount: 10 }); }
          setDiscounts(dc);
        }
        else { message.error("Veri Getirme Başarısız."); }
        const fetchStudent = await fetch(`${apiURL}/api/info/student/${id}`, { method: "GET" });
        if (fetchStudent.ok) {
          const student = await fetchStudent.json();
          setStudent(student.student);
        }
        else { message.error("Veri Getirme Başarısız."); }
      }
      catch (error) { console.log("Veri hatası:", error); }
    }
    fetchStudents();
  }, [apiURL])

  // * Taksitler
  // * Type = taksit miktarı, interest = faiz
  // * Faiz'i -1 girilen veriler seçilemezler.
  const installments = [
    { type: 2, interest: 0 }, { type: 3, interest: 0 }, { type: 4, interest: -1 },
    { type: 5, interest: -1 }, { type: 6, interest: 10 }, { type: 7, interest: -1, },
    { type: 8, interest: -1 }, { type: 9, interest: 20 }, { type: 10, interest: 25 },
    { type: 11, interest: 30 }, { type: 12, interest: 35 }
  ];

  // * Kart Bilgileri
  const [cardInfo, setCardInfo] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
    focus: '',
  });

  // * Kart objesinin üstündeki yazıları güncelleme ve girilen bin numarasından banka bulma
  const handleInputChange = (evt) => {
    const { name, value } = evt.target;
    setCardInfo((prev) => ({ ...prev, [name]: value }));
    if (name == "number") {
      const ind = bankList.findIndex((b) => b.bin == value.substring(0, 6));
      if (value.length > 5) { setBank(bankList[ind].banka_kodu) }
      else {
        setBank(null)
        setSelected(null)
      }
    }
  }

  // * Seçilen fiyat değiştikçe taksitleri ve indirimli fiyatı yeniden ayarlama
  useEffect(() => {

    // ? Taksit hesaplama
    const installmentsList = [{ type: "Peşin", count: amount.toLocaleString('tr-TR'), perMonth: -1 }];
    installments.map((i) => {
      if (i.interest == -1) { installmentsList.push({ type: i.type, count: -1, perMonth: -1 }); }
      else {
        const newCount = ((amount * i.interest) / 100) + amount;
        const perMonth = newCount / i.type;
        installmentsList.push({ type: i.type, count: newCount.toLocaleString('tr-TR'), perMonth: perMonth.toLocaleString('tr-TR') });
      }
    })
    setInstallmentList(installmentsList);

    // ? İndirimli fiyat hesaplama
    let x = amount;
    discounts.map((d) => { x = calc(x, d.discount) })
    setCalculated(x);
  }, [amount])

  const handleInputFocus = (evt) => { setCardInfo((prev) => ({ ...prev, focus: evt.target.name })); } // ? Kart focus eventi
  const calc = (count, perc) => { return count - (count / 100 * perc); }                              // ? Yüzdelik çıkartıcı (x sayısından x sayısının %y'sini çıkartır.)

  const handlePay = async () => {
    try {
      const data = {
        cardNumber: cardInfo.number,
        cardHolder: cardInfo.name,
        cardCvv: cardInfo.cvc,
        cardExMonth: cardInfo.expiry.substring(0, 2),
        cardExYear: cardInfo.expiry.substring(2, 4),
        amount: calculated,
        installment: selected,
        user: info.ID
      }
      const res = await fetch(`${apiURL}/api/kuveyt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
    <div className="paymentGrid">
      <div className="infoArea">
        {student ?
          <>
            <Flex gap="middle" align='center'>
              <img src="/vectors/testimonial_avatar01.png" alt="profile" />
              <h2>{student.fullName}</h2>
            </Flex>
            <span></span>
            <div className="listArea">
              <h3>Kişisel Bilgiler</h3>
              <ul>
                <li><b>Cinsiyet: </b>{student.gender}</li>
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
                <li><b>Danışman: </b>H. Can Azapcı</li>
                <li><b>Rehber Öğretmen: </b>Uğur Özer</li>
              </ul>
              <span></span>
              <h3>Borç Geçmişi</h3>
              {student?.total?.education + student?.total?.food > 0 ?
                <>
                  <div className="paymentCard errorCard">
                    <ExclamationCircleOutlined className='cardIcon' />
                    <div className="paymentInfo">
                      <h4>Öğrencinizin Ödenmemiş Borçları</h4>
                      <span></span>
                      <p>Eğitim: {student?.total?.education.toLocaleString('tr-TR')}₺</p>
                      <p>Yiyecek: {student?.total?.food.toLocaleString('tr-TR')}₺</p>
                      <span></span>
                      <a onClick={() => setAmount(student?.total?.education + student?.total?.food)}>Hemen Öde</a>
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
                  <p>Geçmiş dönem borçlarınız en kısa sürede entegre edilecektir.</p>
                </div>
              </div>
            </div>
          </>
          :
          <h2>Veriler yükleniyor...</h2>
        }
      </div>
      <div className="secondGrid" style={window.innerWidth > 950 ? { gridTemplateRows: paymentType === "Taksitli" ? "1fr auto 50px" : "1fr 50px" } : {}}>
        <div className="upGrid" style={window.innerWidth > 950 ? { gridTemplateColumns: paymentType === "Taksitli" ? "1fr auto" : "1fr", gridTemplateRows: paymentType !== "Taksitli" ? "1fr auto" : "" } : {}}>
          <div className="selectedCount">
            {
              selectedPayment ?
                <>
                  <ExclamationCircleOutlined className="selectedIcon" />
                  <h3>Ödeme Bilgileri</h3>
                  <p><b>Ödeme Tutarı: </b>{amount.toLocaleString('tr-TR')} ₺</p>
                  {discounts.length > 0 &&
                    <>
                      <p><b>İndirimler:</b></p>
                      <ul>
                        {discounts.map((d, k) => (
                          <li key={k}><p><b>{d.label}: </b>{d.discount}%</p></li>
                        ))}
                      </ul>
                    </>
                  }
                  <p><b>Ödenecek Tutar: </b>{calculated.toLocaleString('tr-TR')} ₺</p>
                  <span className='span'></span>
                  <h3>Ödeme Seçenekleri</h3>
                  <Radio.Group onChange={(e) => setPaymentType(e.target.value)}>
                    <Flex vertical={true}>
                      <Radio value={"Taksitli"}>Taksitli ({calculated.toLocaleString('tr-TR')} ₺)</Radio>
                      <Radio disabled={new Date().getMonth() != 0} value={"Ocak Peşin"}>Ocak Ayı Peşin (-12%) ({calc(calculated, 12).toLocaleString('tr-TR')} ₺)</Radio>
                      <Radio disabled={new Date().getMonth() != 0} value={"Ocak Tek"}>Ocak Ayı Tek Çekim (-10%) ({calc(calculated, 10).toLocaleString('tr-TR')} ₺)</Radio>
                      <Radio disabled={new Date().getMonth() != 1} value={"Şubat Peşin"}>Şubat Ayı Peşin (-10%) ({calc(calculated, 10).toLocaleString('tr-TR')} ₺)</Radio>
                      <Radio disabled={new Date().getMonth() != 1} value={"Şubat Tek"}>Şubat Ayı Tek Çekim (-8%) ({calc(calculated, 8).toLocaleString('tr-TR')} ₺)</Radio>
                    </Flex>
                  </Radio.Group>
                </>
                :
                <>
                  <InfoCircleOutlined className="selectedIcon" />
                  <h3>Herhangi bir yıl seçmediniz!</h3>
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
              <Flex vertical={window.innerWidth > 950 ? paymentType === "Taksitli" : true} gap="middle" style={{ width: "100%" }}>
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
              <Flex vertical={window.innerWidth > 950 ? paymentType === "Taksitli" : true} gap="middle" style={{ width: "100%" }}>
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
        {paymentType === "Taksitli" &&
          <div className="installmentArea">
            {bank && <img src={`/banks/${bank}.png`} alt='bank' className='bankImage' />}
            <div className="table">
              <div className="tableHeaders">
                <b>Taksit</b>
                <b>Aylık Ödeme</b>
                <b>Toplam Ödeme</b>
              </div>
              {installmentList.map((i, k) => (
                <div key={k} onClick={() => setSelected(i.type)} className={i.type === selected ? "tableRow selectedRow" : "tableRow"}>
                  <p>{i.type} {i.type !== "Peşin" && "Taksit"}</p>
                  <p>{selectedPayment ? (bank ? (i.perMonth > 0 ? i.perMonth + " ₺" : "-") : "-") : "-"}</p>
                  <p>{selectedPayment ? (bank ? (i.count > 0 ? i.count + " ₺" : "-") : "-") : "-"}</p>
                </div>
              ))}
            </div>
          </div>
        }
        <button className='submitPayment' onClick={() => handlePay()}>Ödemeyi Tamamla</button>
      </div>
    </div >
  )
}

export default Payment
