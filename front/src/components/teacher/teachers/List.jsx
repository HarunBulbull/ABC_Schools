import './List.css'
import React, { useEffect, useState } from 'react';
import { Flex, Spin, Select, message, } from 'antd';
import { SearchOutlined, CaretRightOutlined, CaretLeftOutlined } from '@ant-design/icons';
import User from '../user/User'


function TeacherList() {

  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [index, setIndex] = useState(0);
  const [perpage, setPerpage] = useState('10');
  const [pages, setpages] = useState(0);
  const [text, setText] = useState('');
  const [finder, setFinder] = useState(false);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/api/organization/teachers/${index * perpage}/${perpage}/true`, { method: "GET" });
      if (response.ok) {
        const data = await response.json();

        setTeachers(data.teachers);
        setpages(Math.ceil(Number(data.totalteachers) / Number(perpage)))
      }
      else { message.error("Veri Getirme Başarısız."); }
    } catch (error) { console.log("Veri hatası:", error); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchTeachers();
  }, [baseUrl, perpage, index])

  useEffect(() => { setIndex(0); }, [perpage])

  const handleSearch = async () => {
    setFinder(!finder)
    if(!finder){
      setLoading(true);
      try {
        const response = await fetch(`${baseUrl}/api/organization/findteacher/${text}`, { method: "GET" });
        if (response.ok) {
          const data = await response.json();
          setTeachers(data);
        }
        else { message.error("Veri Getirme Başarısız."); }
      } catch (error) { console.log("Veri hatası:", error); }
      finally { setLoading(false); }
    }
    else{fetchTeachers();}
  }

  return (
    <Spin spinning={loading}>
      <Flex gap="large" align='center' vertical={true} className='listPadding'>
        <div className="findArea">
          <input type="text" placeholder='Öğretmen ara' value={text} onChange={(event) => setText(event.target.value.toLocaleUpperCase('tr-TR'))} />
          <SearchOutlined className='searchIcon' onClick={() => handleSearch()} />
        </div>
        <div className="tableArea">
          <div className="tableGrid3 tableHeader">
            <h3>Öğretmen</h3>
            <h3>Telefon</h3>
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
          {teachers.map((a, b) => (
            <div className="tableGrid3 tableItem" key={b}>
              <User info={{ picture: '/assets/anonim.png', name: a.fullName, class: a.assignments[0].teachingAssignmentDescription }} />
              <Flex vertical={true}>
                <p>{a.phoneNumbers[0]}</p>
              </Flex>
              <a href="/ogretmen/obiziz" style={{ justifySelf: "flex-end" }}>Öğretmen İşlemleri <CaretRightOutlined /></a>
            </div>
          ))}
          <div className="tableGrid3 tableHeader" style={{ borderRadius: "0 0 1rem 1rem" }}>
            {!finder &&
            <>
              <a onClick={() => index > 0 && setIndex(index - 1)} style={{ textAlign: "start", userSelect: "none" }}><CaretLeftOutlined /> Önceki Sayfa</a>
              <p>Sayfa {index + 1}/{pages}</p>
              <a onClick={() => (pages - 1) > index && setIndex(index + 1)} style={{ justifySelf: "flex-end", userSelect: "none" }}>Sonraki Sayfa <CaretRightOutlined /></a>
            </>
            }
          </div>
        </div>
      </Flex>
    </Spin>
  )
}

export default TeacherList
