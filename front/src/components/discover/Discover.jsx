import './Discover.css'
import React, { useEffect, useState } from 'react';
import { Calendar, ConfigProvider, Divider, Flex } from 'antd';
import {
  PieChartOutlined,
  UserOutlined,
  CaretRightOutlined,
  ClockCircleOutlined,
  SearchOutlined,
  BellOutlined,
  MessageOutlined
} from '@ant-design/icons';
import trTR from 'antd/locale/tr_TR';
import User from '../user/User';
import dayjs from 'dayjs';
import 'dayjs/locale/tr';
dayjs.locale('tr')


function Discover() {
  const turkishMonths = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']
  const turkishDays = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi']

  const [selectedDay, setSelectedDay] = useState(dayjs());
  const [day, setDay] = useState("");

  useEffect(() => {
    const monthIndex = selectedDay.month();
    const dayIndex = selectedDay.day();
    let day = selectedDay.$D;
    if(day<10){day=0 + "" + day}
    const turkishDate = day + " " + turkishMonths[monthIndex] + " " + selectedDay.$y + ", " + turkishDays[dayIndex];
    setDay(turkishDate)
  }, [selectedDay]) 

  const events = [
    {
      icon: <ClockCircleOutlined/>,
      name: 'Webinar',
      category: 'Uzaktan',
      time: '12:30 - 13:30'
    },
    {
      icon: <PieChartOutlined/>,
      name: 'Rehberlik Toplantısı',
      category: 'Uzaktan',
      time: '16:30 - 18:30'
    },
    {
      icon: <UserOutlined/>,
      name: 'Değerlendirme Rapor Sonuçları',
      category: 'Görevler'
    }
  ]

  const returns = [
    {
      picture: '/assets/anonim.png',
      name: 'Mert Yılmaz',
      class: 'Tarih Öğretmeni'
    },
    {
      picture: '/assets/anonim.png',
      name: 'H. Can Azapcı',
      class: 'Din Kültürü Öğretmeni'
    },
    {
      picture: '/assets/anonim.png',
      name: 'Harun Bülbül',
      class: 'Fen Bilgisi Öğretmeni'
    },
    {
      picture: '/assets/anonim.png',
      name: 'İpek Dokumacı',
      class: '7-A Öğrenci'
    },
  ]

  return (
    <section className='sectionDiscover'>

      <div className="discoverSectionMain">

        <div className="header">
          <Flex vertical={true}>
            <h3>Hızlı Arama</h3>
            <p>İstediğiniz konuyu, kişiyi ya da etkinliği anahtar kelimeler ile arayın.</p>
          </Flex>
          <div className="finderArea">
            <input type="text" placeholder='Kişi... Hizmet... Etkinlik...' />
            <SearchOutlined className='searchIcon' />
          </div>
        </div>

        <div className="adArea">
          <h1>Buraya istediğimiz herhangi bir şeyi koyabiliriz.</h1>
          <p>Böylece dikkat çekici ve görünür bir alanımız daha olmuş olur.</p>
          <a href='#'>Ayrıntılı Bilgi</a>
          <div className="bgColor"/>
        </div>

        <div className="bottomArea">

          <div className="returnArea">
            <Flex align='center' justify='space-between' className='returnHeader'>
              <h2>Dönüş Bekleyenler</h2>
              <a href="#">Hepsi <CaretRightOutlined /></a>
            </Flex>
            <Flex vertical={true} gap="middle">
              {returns.map((ret, key) => (
                <Flex key={key} align='center' justify='space-between' className='returnUsers'>
                  <User info={ret}/>
                  <MessageOutlined className='messageIcon'/>
                </Flex>
              ))}
            </Flex>
          </div>

          <div className="educationArea">
            <h2>Yeni Eğitimler</h2>
            <div className="educationInfo">
              <img src="/assets/egitim.jpg" />
              <div className="educationHeader">
                <h4>Rehberliğin anlamı, amacı, rehberlik anlayışı, rehberliğin temel ilkeleri</h4>
                <Flex className='dotes'>
                  <div className="dot"/>
                  <div className="dot"/>
                  <div className="dot"/>
                </Flex>
              </div>
              <p>Prof. Dr. Ayhan Yaman</p>
              <Flex gap="middle" className='clockArea'>
                <ClockCircleOutlined/>
                <Flex gap="small">
                  <p>3 Saat</p>
                  <span className='divider'></span>
                  <p>2 Ders</p>
                </Flex>
              </Flex>
              <a href="#">Hemen İzle</a>
            </div>
          </div>

        </div>

      </div>

      <div className="discoverSectionSidebar">
        <div className="userArea">
          <User info={{picture: '/assets/user.png', name: 'Uğur Özer'}}/>
          <BellOutlined className='bell'/>
        </div>
        <ConfigProvider locale={trTR}>
          <Calendar fullscreen={false} value={selectedDay} onChange={(value) => setSelectedDay(value)}/>
        </ConfigProvider>
        <Divider></Divider>
        <div className="discoverEvents">
          <Flex align="center" justify='space-between' style={{padding: "0 1rem"}}>
            <h3 className='eventHeaderSelectedDay'>{day.split(',')[0]}, <p>{day.split(',')[1]}</p></h3>
            <p className='eventHeaderToday' onClick={() => setSelectedDay(dayjs())}>Bugün</p>
          </Flex>
          <Flex vertical={true} style={{padding: "0 1rem"}} gap="large" className='allEvents'>
            {events.map((ev, key) => (
              <Flex key={key} align='center' justify='space-between' className='event'>
                <Flex align='center' gap="middle">
                  <div className="eventIcon">{ev.icon}</div>
                  <Flex vertical={true}>
                    <h4>{ev.name}</h4>
                    <p>{ev.category}</p>
                    {ev.time && <p>{ev.time}</p>}
                  </Flex>
                </Flex>
                <CaretRightOutlined/>
              </Flex>
            ))}
          </Flex>
          <a href='/planlamalarim'>Hepsini Gör</a>
        </div>
      </div>

    </section>
  )
}

export default Discover
