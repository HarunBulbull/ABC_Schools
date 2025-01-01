import React, { useEffect, useState } from 'react';
import { Flex, message, Table, Button, Popconfirm, Spin, Divider } from 'antd';
import { useNavigate } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';
import Import from './Import';
import './Datas.css';
function Datas() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const [data, setData] = useState([]);
  const [noData, setNoData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('');
  const [importData, setImportData] = useState(null);

  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/api/organization/missdatas`, {
        method: "GET",
        headers: { 'x-api-key': import.meta.env.VITE_API_KEY }
      });
      if (response.ok) {
        const data = await response.json();
        setData(data);
        setNoData(data.noData);
      }
      else { message.error("Veri Getirme Başarısız."); }
    }
    catch (error) { console.log("Veri hatası:", error); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [baseUrl])

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/api/organization/deletestudent/${id}`, {
        method: "DELETE",
        headers: { 'x-api-key': import.meta.env.VITE_API_KEY }
      });
      if (response.ok) {
        message.success("Veri silindi.");
        const deletedData = data.nok12.filter(item => item._id !== id);
        setData({...data, nok12: deletedData});
      }
      else { message.error("Veri silme başarısız."); }
    }
    catch (error) { console.log("Veri hatası:", error); }
    finally { setLoading(false); }
  }

  const k12Columns = [
    {
      title: 'Öğrenci',
      dataIndex: 'name',
      key: 'name',
      render: (name) => <b>{name}</b>
    },
    {
      title: 'T.C.',
      dataIndex: 'tc',
      key: 'tc',
      render: (tc) => <p>{tc}</p>
    },
    {
      title: 'Sınıf',
      dataIndex: 'class',
      key: 'class',
      render: (_, record) => <p>{record.class}</p>
    },
    {
      title: 'Numarası',
      dataIndex: 'no',
      key: 'no',
      render: (no) => <b>{no}</b>
    },
    {
      title: 'Sil',
      dataIndex: 'sil',
      key: 'sil',
      width: 1,
      render: (_, record) => (
        <Popconfirm
          title="Veriyi Sil"
          description="Veriyi silinecektir. Emin misiniz?"
          okText="Sil"
          cancelText="Vazgeç"
          onConfirm={() => handleDelete(record._id)}
        >
          <Button type="primary" danger>Sil</Button>
        </Popconfirm>
      )
    },
  ];

  const dataColumns = [
    {
      title: 'Öğrenci',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (fullName) => <b>{fullName}</b>
    },
    {
      title: 'T.C.',
      dataIndex: 'nationalID',
      key: 'nationalID',
      render: (nationalID) => <p>{nationalID}</p>
    },
    {
      title: 'Sınıf',
      dataIndex: 'enrollment',
      key: 'enrollment',
      render: (enrollment) => <p>{enrollment.homeroom}</p>
    },
    {
      title: 'Numarası',
      dataIndex: 'enrollment',
      key: 'enrollment',
      render: (enrollment) => <b>{enrollment.localId}</b>
    },
    {
      title: 'Kaydet',
      dataIndex: 'save',
      key: 'save',
      width: 1,
      render: (_, record) => (
        <Button type="primary" onClick={() => setImportData(record)}>Kaydet</Button>
      )
    },
  ];

  const handleSearch = async () => {
    if (text != "") {
      setLoading(true);
      try {
        const filteredData = noData.filter(item => item.fullName.includes(text));
        setNoData(filteredData);
      } catch (error) { console.log("Veri hatası:", error); }
      finally { setLoading(false); }
    }
    else {
      setNoData(data.noData);
    }
  }

  const handleSave = async (values) => {
    const data = {
      new: {education: values.education, food: values.food},
      old: {education: values.education, food: values.food},
      health: {illnesses: values.illnesses, medicines: values.medicines, report: values.report},
      scholarship: values.scholarship ? values.scholarship : 0,
      discounts: values.discounts,
      paid: 0,
      tc: importData.nationalID,
      name: importData.fullName,
      class: importData.enrollment.homeroom,
      no: importData.enrollment.localId,
      id: importData.id,
    }
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/api/organization/createstudent`, {
        method: "POST",
        headers: { 
          'x-api-key': import.meta.env.VITE_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        message.success("Veri kaydedildi.");
        const added = noData.filter(item => item.id !== importData.id);
        setData({...data, noData: added});
        setNoData(added);
        setImportData(null);
      }
      else { message.error("Veri kaydedilirken bir hata oluştu."); }
    }
    catch (error) { console.log("Veri hatası:", error); }
    finally { setLoading(false); }
  }

  return (
    <Spin spinning={loading}>
      {importData && <Import data={importData} onClose={() => setImportData(null)} save={handleSave} />}
      <Flex className='datasPadding' gap="large" align='center' vertical={true}>
        <Flex vertical={true} gap="small" style={{ width: '100%' }}>
          <h2>K12 Kaydı Bulunamayan Veriler</h2>
          <i>Aşağıdaki öğrencilerin K12'de kayıtlı bir T.C. Kimlik numarası bulunamadı!</i>
          <Table dataSource={data.nok12} columns={k12Columns} rowKey={(record) => record._id} scroll={{ x: 400 }} style={{ width: '100%' }} size="small" />
        </Flex>
        <Divider />
        <Flex vertical={true} gap="small" style={{ width: '100%' }}>
          <h2>Portal Kaydı Bulunamayan Veriler</h2>
          <i>Aşağıdaki öğrenciler K12'de kayıtlı olup portalda kayıtlı değildir.</i>
          <div className="findArea">
            <input type="text" className='findInput' placeholder='Öğrenci ara' value={text} onChange={(event) => setText(event.target.value.toLocaleUpperCase('tr-TR'))} onKeyDown={(event) => event.key === 'Enter' && handleSearch()} />
            <SearchOutlined className='searchIcon' onClick={() => handleSearch()} />
          </div>

          <Table dataSource={noData} columns={dataColumns} rowKey={(record) => record._id} scroll={{ x: 400 }} style={{ width: '100%' }} size="small" />
        </Flex>
      </Flex>
    </Spin>
  )
}

export default Datas
