
import React, { useEffect, useState } from 'react';
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import bankList from '../../../context/banklist.json'
import './Payment.css'
import { Flex } from 'antd';
import { CheckCircleOutlined, ExclamationCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';

function Payment() {
  const [bank, setBank] = useState(null);
  const [selected, setSelected] = useState(null);
  const [amount, setAmount] = useState(150000);
  const [selectedPayment, setselectedPayment] = useState(null);
  const [installmentList, setInstallmentList] = useState([]);
  const [installments, setInstallments] = useState([
    {
      type: 2,
      interest: 0,
    },
    {
      type: 3,
      interest: 0,
    },
    {
      type: 4,
      interest: -1,
    },
    {
      type: 5,
      interest: -1,
    },
    {
      type: 6,
      interest: 10,
    },
    {
      type: 7,
      interest: -1,
    },
    {
      type: 8,
      interest: -1,
    },
    {
      type: 9,
      interest: 20,
    },
    {
      type: 10,
      interest: 25,
    },
    {
      type: 11,
      interest: 30,
    },
    {
      type: 12,
      interest: 35,
    }
  ])
  const [cardInfo, setCardInfo] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
    focus: '',
  });

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

  const handleInputFocus = (evt) => {
    setCardInfo((prev) => ({ ...prev, focus: evt.target.name }));
  }

  useEffect(() => {
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
  }, [amount])

  return (
    <div className="paymentGrid">
      <div className="infoArea">
        <Flex gap="middle">
          <img src="/vectors/testimonial_avatar01.png" alt="profile" />
          <Flex vertical={true}>
            <h2>Adı Soyadı</h2>
            <p className='active'>Aktif Kayıt</p>
          </Flex>
        </Flex>
        <span></span>
        <div className="listArea">
          <h3>Kişisel Bilgiler</h3>
          <ul>
            <li><b>Cinsiyet: </b>Erkek</li>
            <li><b>Doğduğu Ülke: </b>Türkiye</li>
            <li><b>Doğduğu İl: </b>Ankara</li>
            <li><b>Doğum Tarihi: </b>09.08.2014</li>
            <li><b>Dili: </b>Türkçe</li>
          </ul>
          <span></span>
          <h3>Okul Bilgieri</h3>
          <ul style={{ position: "relative" }}>
            <li><b>Sınıfı: </b>3/A</li>
            <li><b>Okul Numarası: </b>123</li>
            <li><b>Giriş Tarihi: </b>09.08.2022</li>
            <li><b>Çıkış Tarihi: </b>-</li>
            <li><b>Kayıt Türü: </b>Asıl Kayıt</li>
            <li><b>Branşı: </b>Sayısal</li>
            <li><b>Yatılılık Durumu: </b>Evet</li>
            <li><b>Danışman: </b>H. Can Azapcı</li>
            <li><b>Rehber Öğretmen: </b>Uğur Özer</li>
          </ul>
          <span></span>
          <h3>Ödeme Geçmişi</h3>
          <div className="paymentCard infoCard">
            <InfoCircleOutlined className='cardIcon' />
            <div className="paymentInfo">
              <h4>2018 - 2019 Yılı Ödemesi</h4>
              <p>Bekliyor</p>
              <p>Tutar: 100.000₺</p>
              <span></span>
              <a onClick={() => {setAmount(100000); setselectedPayment({year: "2018-2019", status: "Bekliyor", icon: <InfoCircleOutlined className="selectedIcon"/>})}}>Hemen Öde</a>
            </div>
          </div>
          <div className="paymentCard errorCard">
            <ExclamationCircleOutlined className='cardIcon' />
            <div className="paymentInfo">
              <h4>2017 - 2018 Yılı Ödemesi</h4>
              <p>Ödenmedi</p>
              <p>Tutar: 80.000₺</p>
              <span></span>
              <a onClick={() => {setAmount(80000); setselectedPayment({year: "2017-2018", status: "Ödenmedi", icon: <ExclamationCircleOutlined className="selectedIcon"/>})}}>Hemen Öde</a>
            </div>
          </div>
          <div className="paymentCard successCard">
            <CheckCircleOutlined className='cardIcon' />
            <div className="paymentInfo">
              <h4>2016 - 2017 Yılı Ödemesi</h4>
              <p>Ödendi</p>
              <span></span>
              <p>Kart Numarası: **** **** **** 4039</p>
              <p>Toplam Tutar: 57.000₺</p>
              <p>Banka: Garanti BBVA</p>
              <p>Tarih: 09.08.2016</p>
              <p>Taksit: 6 Ay</p>
              <span></span>
              <a href="#">Dekont Görüntüle</a>
            </div>
          </div>
        </div>
      </div>
      <div className="secondGrid">
        <div className="upGrid">
          <div className="selectedCount">
            {
            selectedPayment ? 
              <>
                {selectedPayment.icon}
                <h3>{selectedPayment.year}</h3>
                <p>{selectedPayment.status}</p>
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
            </form>
          </div>
        </div>

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
        <button className='submitPayment'>Ödemeyi Tamamla</button>
      </div>
    </div >
  )
}

export default Payment
