import { InfoCircleOutlined } from '@ant-design/icons';
import React, { useEffect, useRef } from 'react';
import { Flex, Divider } from 'antd';
import moment from 'moment';
import './Payment.css'
import { useReactToPrint } from "react-to-print";

function Karteks({ student, current, totalData, discounts, onClose }) {
  const contentRef = useRef();
  const handlePrint = useReactToPrint({ contentRef, onAfterPrint: () => { onClose() } });

  useEffect(() => {
    handlePrint();
  }, []);

  const calc = (count, perc) => { return count - (count / 100 * perc); }

  return (
    <div className="PrintArea" ref={contentRef}>
      <div className="PrintPadding" style={{ padding: "2rem", position: "relative" }}>
        <Flex justify='center' align='center' gap="middle">
          <img style={{
            width: "100px",
            position: "absolute",
            top: "2rem",
            left: "2rem"
          }} src="/assets/mainlogo.png" />
          <Flex vertical={true} justify='center' align='center'>
            <h1 style={{ paddingTop: "15px" }}>ABC OKULLARI</h1>
            <p>Kayıt Yenileme Formu</p>
          </Flex>
        </Flex>
        <Divider style={{ paddingTop: "2rem" }} orientation="left">Öğrenci Bilgileri</Divider>
        <Flex vertical={true}>
          <p><b>Adı Soyadı: </b>{student?.fullName}</p>
          <p><b>T.C. Kimlik No: </b>{student?.nationalID}</p>
          <p><b>Doğum Tarihi: </b>{moment(student?.birthDate).format('DD/MM/YYYY')}</p>
          <p><b>Sınıfı: </b>{student?.enrollment?.homeroom}</p>
          <p><b>Numarası: </b>{student?.enrollment?.localId}</p>
          <p><b>Okulu: </b>{student?.enrollment?.school?.name}</p>
        </Flex>
        <Divider orientation="left">Önceki Dönem Bilgileri</Divider>
        <Flex vertical={true}>
          <p><b>Eğitim Baz Ücreti: </b>{student?.old?.education.toLocaleString('tr-TR')} ₺</p>
          <p><b>Yemek Baz Ücreti: </b>{student?.old?.food.toLocaleString('tr-TR')} ₺</p>
          <p><b>İndirimler:</b></p>
          <ul style={{ paddingLeft: "1rem" }}>
            {student?.olddiscounts.length > 0 ?
              student?.olddiscounts.map((d, k) => (
                <li key={k}><p><b>{d.name}: </b>{d.value}%</p></li>
              ))
              :
              <li>Önceki döneme ait indirim bulunmamaktadır.</li>
            }
          </ul>
          <p><b>Eğitim Net Ücreti: </b>{totalData.oldeducation.toLocaleString('tr-TR')} ₺</p>
          <p><b>Yemek Net Ücreti: </b>{totalData.oldfood.toLocaleString('tr-TR')} ₺</p>
          <p><b>Toplam Ödeme: </b>{(totalData.oldeducation + totalData.oldfood).toLocaleString('tr-TR')} ₺</p>
        </Flex>
        <Divider orientation="left">Dönem Bilgileri</Divider>
        <Flex vertical={true}>
          <p><b>Eğitim Baz Ücreti: </b>{student?.new?.education.toLocaleString('tr-TR')} ₺</p>
          <p><b>Yemek Baz Ücreti: </b>{student?.new?.food.toLocaleString('tr-TR')} ₺</p>
          <p><b>İndirimler:</b></p>
          <ul style={{ paddingLeft: "1rem" }}>
            {discounts.length > 0 ?
              discounts.map((d, k) => (
                <li key={k}><p><b>{d.name}: </b>{d.value}%</p></li>
              ))
              :
              <li>Döneme ait indirim bulunmamaktadır.</li>
            }
          </ul>
          <p><b>Eğitim Net Ücreti: </b>{totalData.neweducation.toLocaleString('tr-TR')} ₺</p>
          <p><b>Yemek Net Ücreti: </b>{totalData.newfood.toLocaleString('tr-TR')} ₺</p>
          <p><b>Toplam Ödeme: </b>{(totalData.neweducation + totalData.newfood).toLocaleString('tr-TR')} ₺</p>
        </Flex>
        <Divider orientation="left">Ödeme Planları</Divider>
        <Flex vertical={true}>
          {current.indirimler &&
            <>
              <p><b>Ocak Ayı Peşin (-{current?.indirimler[11].value}%): </b>{calc((totalData.neweducation + totalData.newfood), current?.indirimler[11].value).toLocaleString('tr-TR')} ₺</p>
              <p><b>Ocak Ayı Tek (-{current?.indirimler[12].value}%): </b>{calc((totalData.neweducation + totalData.newfood), current?.indirimler[12].value).toLocaleString('tr-TR')} ₺</p>
              <p><b>Şubat Ayı Peşin (-{current?.indirimler[13].value}%): </b>{calc((totalData.neweducation + totalData.newfood), current?.indirimler[13].value).toLocaleString('tr-TR')} ₺</p>
              <p><b>Şubat Ayı Tek (-{current?.indirimler[14].value}%): </b>{calc((totalData.neweducation + totalData.newfood), current?.indirimler[14].value).toLocaleString('tr-TR')} ₺</p>
              <p><b>Taksitli: </b>{(totalData.neweducation + totalData.newfood).toLocaleString('tr-TR')} ₺</p>
            </>
          }
        </Flex>
        <Divider orientation="left">Bilgilendirme</Divider>
        <Flex vertical={true}>
          <p><InfoCircleOutlined /> Öğrencilerin maksimum 4 adet indirimi olabilir, fazlası olursa en büyük dördü olacak şekilde indirimler uygulanır.</p>
          <p><InfoCircleOutlined /> Kardeş indirimlerinin ücreti, 2. ve sonrasındaki kardeşlerden düşülür.</p>
          <p><InfoCircleOutlined /> Yemek ücretlerinde sadece peşin ve tek çekim indirim kalemleri uygulanmaktadır.</p>
          <p><InfoCircleOutlined /> Bu sayfa sadece bilgilendirme amaçlıdır. Öğrencinin okul kaydına esas eğitim bedeli ve indirim oranları, veli ile okul arasında düzenlenen öğrenci kayıt sözleşmesi ile kesinlik kazanır.</p>
        </Flex>
      </div>
    </div>
  )
}

export default Karteks
