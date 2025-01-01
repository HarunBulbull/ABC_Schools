import React from 'react';
import { Flex, Button, Form, Input, InputNumber, Select } from 'antd';
import './Datas.css';

function Import({ onClose, save }) {
  const [form] = Form.useForm();

  const onFinish = (values) => {save(values);}

  return (
    <div className="importAreaBackBlur">
      <Form
        form={form}
        name="basic"
        layout="vertical"
        autoComplete="off"
        onFinish={onFinish}
        className="importArea"
      >

        <Flex gap="middle">
          <Form.Item
            label="Eğitim Baz Ücreti"
            name="education"
            rules={[{ required: true, message: 'Lütfen eğitim baz ücretini giriniz.' }]}
            style={{ width: "100%" }}
          >
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>
          <Form.Item
            label="Yemek Baz Ücreti"
            name="food"
            rules={[{ required: true, message: 'Lütfen yemek baz ücretini giriniz.' }]}
            style={{ width: "100%" }}
          >
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>
        </Flex>
        <Flex gap="middle">
          <Form.Item
            label="İndirim Kalemleri"
            name="discounts"
            style={{ width: "100%" }}
          >
            <Select
              mode="multiple"
              options={[
                { label: "ÖĞRETMEN", value: "ÖĞRETMEN" },
                { label: "KENDİ ÖĞRENCİMİZ", value: "KENDİ ÖĞRENCİMİZ" },
                { label: "ŞEHİT", value: "ŞEHİT" },
                { label: "GAZİ", value: "GAZİ" },
                { label: "PEŞİN", value: "PEŞİN" },
                { label: "TEK", value: "TEK" },
                { label: "ERKEN", value: "ERKEN" },
                { label: "YÖNETİM", value: "YÖNETİM" },
                { label: "PERSONEL", value: "PERSONEL" },
                { label: "GEÇİŞ", value: "GEÇİŞ" }
              ]}
            />
          </Form.Item>
          <Form.Item
            label="Burs"
            name="scholarship"
            style={{ width: "100px" }}
          >
            <InputNumber style={{ width: "100%" }} min={0} max={100} />
          </Form.Item>
        </Flex>
        <Form.Item
          label="Hastalıklar"
          name="illnesses"
          style={{ width: "100%" }}
        >
          <Input style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label="İlaçlar"
          name="medicines"
          style={{ width: "100%" }}
        >
          <Input style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label="Sağlık Raporu"
          name="report"
          style={{ width: "100%" }}
        >
          <Input style={{ width: "100%" }} />
        </Form.Item>
        <Flex align="center" gap="middle">
          <Button style={{ width: "100%" }} type="primary" danger onClick={() => onClose()}>İptal</Button>
          <Button style={{ width: "100%" }} type="primary" htmlType="submit">Kaydet</Button>
        </Flex>
      </Form>
    </div>
  )
}

export default Import
