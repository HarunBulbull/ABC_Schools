// * Obiziz 2024
// ! Dependincies
import './Profile.css'
import React from 'react';
import { Flex } from 'antd';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

function Student({count, info}) {
  // ! Hooks
  const nav = useNavigate();

  return (
    <div className="studentInfoFlex">
      <Flex align='center' justify='space-between' gap="middle" className='studentInfoHead'>
        <Flex align='center' gap="middle">
          <Flex vertical={true}>
            <h3>{info.fullName}</h3>
            <p style={count>0 ? {color: "#ff0000"} : {color: "#00e000"}}>Ödenmeyen borç{count>0 ? (": " + count.toLocaleString('tr-TR') + "₺") : " yok"} </p>
          </Flex>
        </Flex>
        <Flex gap="small" className='studentLinks'>
          <button className='studentEdit' onClick={() => nav(`/not-goruntule/${info.id}`)}>Notları Görüntüle</button>
          <button className='studentEdit' onClick={() => nav(`/odemeyap/${info.id}`)}>Ödemeler</button>
        </Flex>
      </Flex>
      <Flex gap="large" justify='space-between'>
        <div className="studentInfo">
          <Flex gap="large" className='studentInfoList'>
            <div style={{width: "100%"}}>
              <p><b>Doğum Tarihi: </b>{moment(info.birthDate).format('DD/MM/YYYY')}</p>
              <p><b>T.C. Kimlik No: </b>{info.nationalID}</p>
              <p><b>Cinsiyet: </b>{info.gender}</p>
            </div>
            <div style={{width: "100%"}}>
              <p><b>Sınıfı: </b>{info.enrollment.homeroom}</p>
              <p><b>Numarası: </b>{info.enrollment.localId}</p>
              <p><b>Okulu: </b>{info.enrollment.school.name}</p>
            </div>
          </Flex>
        </div>
      </Flex>
    </div>
  )
}

export default Student
