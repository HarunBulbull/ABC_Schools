import './List.css'
import React, { useEffect, useState } from 'react';
import { Flex, Spin, message } from 'antd';
import { SearchOutlined, CaretRightOutlined, CaretLeftOutlined } from '@ant-design/icons';
import User from '../user/User'

function List() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);

      try {
        const response = await fetch(`${baseUrl}/api/organization/students/1/10/true`, {
          method: "GET",
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setStudents(data);

        } else {
          message.error("Veri Getirme Başarısız.");
        }
      } catch (error) {
        console.log("Veri hatası:", error);
      }
      finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [baseUrl])

  const list = ["", "", "", "", "", "", "", "", "", ""]

  return (
    <Spin spinning={loading}>

      <Flex gap="large" align='center' vertical={true} className='listPadding'>
        <div className="findArea">
          <input className='findInput' type="text" placeholder='Öğrenci ara' />
          <SearchOutlined className='searchIcon' />
        </div>
        <div className="tableArea">
          <div className="tableGrid3 tableHeader">
            <h3>Öğrenci Adı</h3>
            <h3>Öğrenci Velisi</h3>
          </div>
          {list.map((a, b) => (
            <div className="tableGrid3 tableItem" key={b}>
              <User info={{ picture: '/assets/anonim.png', name: 'Öğrenci Adı', class: '1-A Öğrenci (123)' }} />
              <Flex vertical={true}>
                <h3>Veli Adı</h3>
                <p>05555555555</p>
              </Flex>
              <a href="/ogrenci/obiziz">Öğrenci İşlemleri <CaretRightOutlined /></a>
            </div>
          ))}
          <div className="tableGrid3 tableHeader" style={{ borderRadius: "0 0 1rem 1rem" }}>
            <a href="#" style={{ textAlign: "start" }}><CaretLeftOutlined /> Önceki Sayfa</a>
            <p>Sayfa 2/10</p>
            <a href="#">Sonraki Sayfa <CaretRightOutlined /></a>
          </div>
        </div>
      </Flex>
    </Spin>
  )
}

export default List
