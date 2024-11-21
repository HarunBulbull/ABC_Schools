
import React, { useEffect, useState } from 'react';
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import bankList from '../../context/banklist.json'
import './Payment.css'
import { Flex } from 'antd';

function Payment() {
  const [bank, setBank] = useState(null);
  const [selected, setSelected] = useState(null);
  const [amount, setAmount] = useState(150000);
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
      <Flex align='start'>
        <div className="studentList">
          <h3>Öğrenci Seçin</h3>
          <div className="student">
            <img src="/assets/anonim.png" alt="student" />
            <div className="studentInfo">
              <h4>Öğrenci Adı</h4>
              <p>1-A (123)</p>
            </div>
          </div>
          <div className="student selectedStudent">
            <img src="/assets/anonim.png" alt="student" />
            <div className="studentInfo">
              <h4>Öğrenci Adı</h4>
              <p>1-A (123)</p>
            </div>
          </div>
          <div className="student">
            <img src="/assets/anonim.png" alt="student" />
            <div className="studentInfo">
              <h4>Öğrenci Adı</h4>
              <p>1-A (123)</p>
            </div>
          </div>
          <div className="student">
            <img src="/assets/anonim.png" alt="student" />
            <div className="studentInfo">
              <h4>Öğrenci Adı</h4>
              <p>1-A (123)</p>
            </div>
          </div>
          <div className="student">
            <img src="/assets/anonim.png" alt="student" />
            <div className="studentInfo">
              <h4>Öğrenci Adı</h4>
              <p>1-A (123)</p>
            </div>
          </div>
          <div className="student">
            <img src="/assets/anonim.png" alt="student" />
            <div className="studentInfo">
              <h4>Öğrenci Adı</h4>
              <p>1-A (123)</p>
            </div>
          </div>
          <div className="student">
            <img src="/assets/anonim.png" alt="student" />
            <div className="studentInfo">
              <h4>Öğrenci Adı</h4>
              <p>1-A (123)</p>
            </div>
          </div>
          <div className="student">
            <img src="/assets/anonim.png" alt="student" />
            <div className="studentInfo">
              <h4>Öğrenci Adı</h4>
              <p>1-A (123)</p>
            </div>
          </div>
          <div className="student">
            <img src="/assets/anonim.png" alt="student" />
            <div className="studentInfo">
              <h4>Öğrenci Adı</h4>
              <p>1-A (123)</p>
            </div>
          </div>
          <div className="student">
            <img src="/assets/anonim.png" alt="student" />
            <div className="studentInfo">
              <h4>Öğrenci Adı</h4>
              <p>1-A (123)</p>
            </div>
          </div>
        </div>
      </Flex>
      <Flex gap="middle" style={{width: "100%"}} vertical={true}>
        <div className="secondGrid" style={{gridTemplateColumns: bank ? "auto 1fr" : "1fr"}}>
          <Flex align='start'>
            <div className="creditCard" style={{width: bank ? "auto" : "100%"}}>
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
          </Flex>
          {bank &&
          <Flex align='start'>
            <div className="installmentArea">
              <img src={`/banks/${bank}.png`} alt='bank' className='bankImage' />
              <div className="table">
                <div className="tableHeaders">
                  <b>Taksit</b>
                  <b>Aylık Ödeme</b>
                  <b>Toplam Ödeme</b>
                </div>
                {installmentList.map((i, k) => (
                  <div key={k} onClick={() => setSelected(i.type)} className={i.type === selected ? "tableRow selectedRow" : "tableRow"}>
                    <p>{i.type} {i.type !== "Peşin" && "Taksit"}</p>
                    <p>{i.perMonth > 0 ? i.perMonth + " ₺" : "-"}</p>
                    <p>{i.count > 0 ? i.count + " ₺" : "-"}</p>
                  </div>
                ))}
              </div>
            </div>
          </Flex>
          }
        </div>
        <button className='submitPayment'>Ödemeyi Tamamla</button>
      </Flex>
    </div>
  )
}

export default Payment
