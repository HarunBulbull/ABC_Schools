import './List.css'
import React from 'react';
import { Flex } from 'antd';
import { SearchOutlined, CaretRightOutlined, CaretLeftOutlined } from '@ant-design/icons';
import User from '../user/User'

function TeacherList() {

  const list = ["","","","","","","","","",""]

  return (
      <Flex gap="large" align='center' vertical={true} className='listPadding'>
        <div className="findArea">
          <input type="text" placeholder='Öğretmen ara'/>
          <SearchOutlined className='searchIcon'/>
        </div>
        <div className="tableArea">
          <div className="tableGrid3 tableHeader">
            <h3>Öğretmen</h3>
            <h3>Telefon</h3>
          </div>
          {list.map((a,b) =>(
            <div className="tableGrid3 tableItem" key={b}>
              <User info={{picture: '/assets/anonim.png', name: 'Öğretmen Adı', class: 'Matematik Öğretmeni'}} />
              <Flex vertical={true}>
                <p>+90 (555) 555 55 55</p>
              </Flex>
              <a href="/ogretmen/obiziz">Öğretmen İşlemleri <CaretRightOutlined/></a>
            </div>
          ))}
          <div className="tableGrid3 tableHeader" style={{borderRadius: "0 0 1rem 1rem"}}>
            <a href="#" style={{textAlign: "start"}}><CaretLeftOutlined/> Önceki Sayfa</a>
            <p>Sayfa 2/10</p>
            <a href="#">Sonraki Sayfa <CaretRightOutlined/></a>
          </div>
        </div>
      </Flex>
  )
}

export default TeacherList
