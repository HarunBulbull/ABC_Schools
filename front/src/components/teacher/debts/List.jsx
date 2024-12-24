import React, { useEffect, useState } from 'react';
import { Flex, Spin, message, Select, InputNumber } from 'antd';
import { SearchOutlined, CaretRightOutlined, CaretLeftOutlined } from '@ant-design/icons';
import User from '../user/User'

function DebtList() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const [students, setStudents] = useState([]);
  const [studentsRecover, setStudentsRecover] = useState([]);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('');
  const [finder, setFinder] = useState(false);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/api/organization/withdebt`, { method: "GET", });
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
        setStudentsRecover(data);
      }
      else { message.error("Veri Getirme Başarısız."); }
    }
    catch (error) { console.log("Veri hatası:", error); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchStudents(); }, [baseUrl])

  const handleSearch = async () => {
    if (text != "") {
      setFinder(true);
      setLoading(true);
      try {
        setStudents(studentsRecover.filter(a => a.fullName.includes(text)))
      } catch (error) { console.log("Veri hatası:", error); }
      finally { setLoading(false); }
    }
    else {
      setFinder(false);
      setStudents(studentsRecover);
    }
  }

  return (
    <Spin spinning={loading}>

      <Flex gap="large" align='center' vertical={true} className='listPadding'>
        <div className="findArea">
          <input className='findInput' type="text" placeholder='Öğrenci ara' value={text} onChange={(event) => setText(event.target.value.toLocaleUpperCase('tr-TR'))} onKeyDown={(event) => event.key === 'Enter' && handleSearch()} />
          <SearchOutlined className='searchIcon' onClick={() => handleSearch()} />
        </div>
        <div className="tableArea">
          <div className="tableGrid3 tableHeader" style={{gridTemplateColumns: "2fr 2fr 2fr 1fr"}}>
            <b>Öğrenci</b>
            <b>İletişim</b>
            <b>Ödenmeyen Borç</b>
          </div>
          {students.map((a, b) => (
            <div className="tableGrid3 tableItem" key={b} style={{gridTemplateColumns: "2fr 2fr 2fr 1fr"}}>
              <User info={{ picture: '/assets/anonim.png', name: a.fullName, class: a.enrollment.homeroom }} />
              <Flex vertical={true}>
                <p>{a.phoneNumbers ? a.phoneNumbers[0] : ''}</p>
                <p>{a.emails ? a.emails[0] : ''}</p>
              </Flex>
              <Flex vertical={true}>
                <p style={(a.total.education + a.total.food) > 0 ? {color: 'red'} : {color: 'green'}}>{(a.total.education + a.total.food).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</p>
              </Flex>
              <a href={`/ogrenci/${a.id}`} style={{ justifySelf: "flex-end" }}>Öğrenci İşlemleri <CaretRightOutlined /></a>
            </div>
          ))}
          <div className="tableGrid3 tableHeader" style={{ borderRadius: "0 0 10px 10px", gridTemplateColumns: "1fr 1fr 1fr" }}>
          </div>
        </div>
      </Flex>
    </Spin>
  )
}

export default DebtList
