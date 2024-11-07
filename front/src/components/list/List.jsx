import './List.css'
import React from 'react';
import { Flex } from 'antd';
import { SearchOutlined, CaretRightOutlined, CaretLeftOutlined } from '@ant-design/icons';
import User from '../user/User'

function List() {

  const list = ["","","","","","","","","",""]

  return (
      <Flex gap="large" align='center' vertical={true} className='listPadding'>
        <div className="findArea">
          <input type="text" placeholder='Öğrenci ara'/>
          <SearchOutlined className='searchIcon'/>
        </div>
        <div className="tableArea">
          <div className="tableGrid3 tableHeader">
            <h3>Öğrenci Adı</h3>
            <h3>Öğrenci Velisi</h3>
          </div>
          {list.map((a,b) =>(
            <div className="tableGrid3 tableItem" key={b}>
              <User info={{picture: '/assets/anonim.png', name: 'Öğrenci Adı', class: '1-A Öğrenci (123)'}} />
              <Flex vertical={true}>
                <h3>Veli Adı</h3>
                <p>+90 (555) 555 55 55</p>
              </Flex>
              <a href="/ogrenci/obiziz">Öğrenci İşlemleri <CaretRightOutlined/></a>
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

export default List
