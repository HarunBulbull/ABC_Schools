import './List.css'
import React, { useEffect, useState } from 'react';
import { Flex, message, Table, Button, Popconfirm } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

function List() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [index, setIndex] = useState(0);
  const [perpage, setPerpage] = useState(10);
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');
  const [search, setSearch] = useState(false);
  const navigate = useNavigate();

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/api/organization/students/${index * perpage}/${perpage}`, {
        method: "GET",
        headers: { 'x-api-key': import.meta.env.VITE_API_KEY }
      });
      if (response.ok) {
        const data = await response.json();
        setStudents(data.students);
        setCount(data.total)
      }
      else { message.error("Veri Getirme Başarısız."); }
    }
    catch (error) { console.log("Veri hatası:", error); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (!search) { fetchStudents(); } else { handleSearch(); } }, [baseUrl, perpage, index])

  const handleSearch = async () => {
    if (text != "") {
      setSearch(true);
      setLoading(true);
      try {
        const response = await fetch(`${baseUrl}/api/organization/findstudent/${text}/${index * perpage}/${perpage}`, {
          method: "GET",
          headers: { 'x-api-key': import.meta.env.VITE_API_KEY }
        });
        if (response.ok) {
          const data = await response.json();
          setStudents(data.students);
          setCount(data.total)
        }
        else { message.error("Veri Getirme Başarısız."); }
      } catch (error) { console.log("Veri hatası:", error); }
      finally { setLoading(false); }
    }
    else {
      setSearch(false);
      fetchStudents();
    }
  }

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/api/organization/deletestudent/${id}`, {
        method: "DELETE",
        headers: { 'x-api-key': import.meta.env.VITE_API_KEY }
      });
      if (response.ok) {
        message.success("Veri silindi.");
        if(search){
          handleSearch();
        }
        else{
          fetchStudents();
        }
      }
      else { message.error("Veri silme başarısız."); }
    }
    catch (error) { console.log("Veri hatası:", error); }
    finally { setLoading(false); }
  }

  const Columns = [
    {
      title: 'Öğrenci',
      dataIndex: 'studentData',
      key: 'studentData',
      render: (studentData) => <Flex vertical={true}>
        <b>{studentData.fullName}</b>
        <p>{studentData.enrollment.homeroom}</p>
      </Flex>
    },
    {
      title: 'Veli',
      dataIndex: 'contactData',
      key: 'contactData',
      render: (contactData) => <Flex vertical={true}>
        <p>{contactData.fullName}</p>
        <p>{contactData.phoneNumbers ? contactData.phoneNumbers[0] : ''}</p>
        <p>{contactData.emails ? contactData.emails[0] : ''}</p>
      </Flex>
    },
    {
      title: 'Önceki Dönem',
      dataIndex: 'studentData',
      key: 'studentData',
      render: (studentData) => <Flex vertical={true}>
        <p><b>Eğitim:&nbsp;</b>{studentData.old.education.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</p>
        <p><b>Yemek:&nbsp;</b>{studentData.old.food.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</p>
      </Flex>
    },
    {
      title: 'Sonraki Dönem',
      dataIndex: 'studentData',
      key: 'studentData',
      render: (studentData) => <Flex vertical={true}>
        <p><b>Eğitim:&nbsp;</b>{studentData.new.education.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</p>
        <p><b>Yemek:&nbsp;</b>{studentData.new.food.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</p>
      </Flex>
    },
    {
      title: 'İşlemler',
      dataIndex: 'studentData',
      key: 'studentData',
      width: 1,
      render: (studentData) => (
        <Flex gap="small">
          <Popconfirm
            title="Öğrenciyi Sil"
            description="Öğrenciyi silinecektir. Emin misiniz?"
            okText="Sil"
            cancelText="Vazgeç"
            onConfirm={() => handleDelete(studentData._id)}
          >
            <Button type="primary" danger>Sil</Button>
          </Popconfirm>
          <Button type="primary" onClick={() => navigate(`/ogrenci/${studentData.id}`)}>Detaylar</Button>
        </Flex>
      )
    },
  ];

  return (
    <Flex gap="large" align='center' vertical={true} className='listPadding'>
      <div className="findArea">
        <input type="text" className='findInput' placeholder='Öğrenci ara' value={text} onChange={(event) => setText(event.target.value.toLocaleUpperCase('tr-TR'))} onKeyDown={(event) => event.key === 'Enter' && handleSearch()} />
        <SearchOutlined className='searchIcon' onClick={() => handleSearch()} />
      </div>
      <Table
        pagination={{
          pageSize: perpage,
          total: count,
          showTotal: (total) => `${total} kayıt bulundu.`,
          onChange: (page) => setIndex(page - 1),
          pageSizeOptions: [10, 20, 50, 100],
          showSizeChanger: true,
          onShowSizeChange: (current, size) => {
            setPerpage(size);
            setIndex(0);
          }
        }}
        dataSource={students}
        columns={Columns}
        rowKey={(record) => record._id}
        loading={loading}
        scroll={{ x: 400 }}
        style={{ width: '100%' }}
        size="small"
      />
    </Flex>
  )
}

export default List
