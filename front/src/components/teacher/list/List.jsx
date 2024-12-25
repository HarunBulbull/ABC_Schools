import './List.css'
import React, { useEffect, useState } from 'react';
import { Flex, Spin, message, Select, InputNumber } from 'antd';
import { SearchOutlined, CaretRightOutlined, CaretLeftOutlined } from '@ant-design/icons';
import User from '../user/User'

function List() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [index, setIndex] = useState(0);
  const [perpage, setPerpage] = useState('10');
  const [pages, setpages] = useState(0);
  const [text, setText] = useState('');
  const [finder, setFinder] = useState(false);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/api/organization/students/${index * perpage}/${perpage}/true`, { 
        method: "GET",
        headers: { 'x-api-key': import.meta.env.VITE_API_KEY}
      });
      if (response.ok) {
        const data = await response.json();
        setStudents(data.students);
        setpages(Math.ceil(Number(data.totalstudents) / Number(perpage)))
      }
      else { message.error("Veri Getirme Başarısız."); }
    }
    catch (error) { console.log("Veri hatası:", error); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchStudents(); }, [baseUrl, perpage, index])

  useEffect(() => { setIndex(0); }, [perpage])

  const handleSearch = async () => {
    if (text != "") {
      setFinder(true);
      setLoading(true);
      try {
        const response = await fetch(`${baseUrl}/api/organization/findstudent/${text}`, { 
          method: "GET",
          headers: { 'x-api-key': import.meta.env.VITE_API_KEY}
         });
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setStudents(data);
        }
        else { message.error("Veri Getirme Başarısız."); }
      } catch (error) { console.log("Veri hatası:", error); }
      finally { setLoading(false); }
    }
    else {
      setFinder(false);
      fetchStudents();
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
          <div className="tableGrid3 tableHeader">
            <b>Öğrenci</b>
            <b>İletişim</b>
            <b>İndirimler</b>
            <b>Ödenmeyen Borç</b>
            <Select
              defaultValue="10"
              disabled={finder}
              options={[
                { value: '10', label: '10 Kişi/Sayfa' },
                { value: '20', label: '20 Kişi/Sayfa' },
                { value: '50', label: '50 Kişi/Sayfa' },
                { value: '100', label: '100 Kişi/Sayfa' }
              ]}
              onChange={(value) => setPerpage(value)}
            />
          </div>
          {students.map((a, b) => (
            <div className="tableGrid3 tableItem" key={b}>
              <User info={{ picture: '/assets/anonim.png', name: a.fullName, class: a.enrollment.homeroom }} />
              <Flex vertical={true}>
                <p>{a.phoneNumbers ? a.phoneNumbers[0] : ''}</p>
                <p>{a.emails ? a.emails[0] : ''}</p>
              </Flex>
              <Flex vertical={true}>
                <p><b>Normal: </b>{a.discounts.length}</p>
                <p><b>Gizli: </b>{a.special.length}</p>
              </Flex>
              <Flex vertical={true}>
                <p style={(a.total.education + a.total.food) > 0 ? {color: 'red'} : {color: 'green'}}>{(a.total.education + a.total.food).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</p>
              </Flex>
              <a href={`/ogrenci/${a.id}`} style={{ justifySelf: "flex-end" }}>Öğrenci İşlemleri <CaretRightOutlined /></a>
            </div>
          ))}
          <div className="tableGrid3 tableHeader" style={{ borderRadius: "0 0 10px 10px", gridTemplateColumns: "1fr 1fr 1fr" }}>
            {!finder &&
              <>
                <a onClick={() => index > 0 && setIndex(index - 1)} style={{ textAlign: "start", userSelect: "none" }}><CaretLeftOutlined /> Önceki Sayfa</a>
                <Flex align='center' gap="middle" justify='center'>
                  <p style={{ justifySelf: "center" }}>Sayfa</p>
                  <InputNumber min={1} max={pages} value={index + 1} onChange={(value) => setIndex(value - 1)} />
                  <p>/ {pages}</p>
                </Flex>
                <a onClick={() => (pages - 1) > index && setIndex(index + 1)} style={{ justifySelf: "flex-end", userSelect: "none" }}>Sonraki Sayfa <CaretRightOutlined /></a>
              </>
            }
          </div>
        </div>
      </Flex>
    </Spin>
  )
}

export default List
