import './List.css'
import React, { useEffect, useState } from 'react';
import { Flex, Spin, message, Select } from 'antd';
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
      const response = await fetch(`${baseUrl}/api/organization/students/${index * perpage}/${perpage}/true`, { method: "GET", });
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
    setFinder(!finder)
    if (!finder) {
      setLoading(true);
      try {
        const response = await fetch(`${baseUrl}/api/organization/findstudent/${text}`, { method: "GET" });
        if (response.ok) {
          const data = await response.json();
          setStudents(data);
        }
        else { message.error("Veri Getirme Başarısız."); }
      } catch (error) { console.log("Veri hatası:", error); }
      finally { setLoading(false); }
    }
    else { fetchStudents(); }
  }

  return (
    <Spin spinning={loading}>

      <Flex gap="large" align='center' vertical={true} className='listPadding'>
        <div className="findArea">
          <input type="text" placeholder='Öğrenci ara' value={text} onChange={(event) => setText(event.target.value.toLocaleUpperCase('tr-TR'))} />
          <SearchOutlined className='searchIcon' onClick={() => handleSearch()} />
        </div>
        <div className="tableArea">
          <div className="tableGrid3 tableHeader" style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr" }}>
            <h3>Öğrenci Adı</h3>
            <h3>İletişim</h3>
            <h3>Öğrenci Velisi</h3>
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
            <div className="tableGrid3 tableItem" style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr" }} key={b}>
              <User info={{ picture: '/assets/anonim.png', name: a.fullName, class: a.enrollment.homeroom }} />
              <Flex vertical={true}>
                <p>{a.phoneNumbers ? a.phoneNumbers[0] : ''}</p>
                <p>{a.emails ? a.emails[0] : ''}</p>
              </Flex>
              <Flex vertical={true}>
                <h3>Veli Adı</h3>
                <p>05555555555</p>
              </Flex>
              <a href={`/ogrenci/${a.id}`} style={{ justifySelf: "flex-end" }}>Öğrenci İşlemleri <CaretRightOutlined /></a>
            </div>
          ))}
          <div className="tableGrid3 tableHeader" style={{ borderRadius: "0 0 1rem 1rem", gridTemplateColumns: "1fr 1fr 1fr" }}>
            {!finder &&
              <>
                <a onClick={() => index > 0 && setIndex(index - 1)} style={{ textAlign: "start", userSelect: "none" }}><CaretLeftOutlined /> Önceki Sayfa</a>
                <p style={{ justifySelf: "center" }}>Sayfa {index + 1}/{pages}</p>
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
