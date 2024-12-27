import { Button, Spin, Divider, Form, message, InputNumber, Input, Flex, Table, Popconfirm, Space } from "antd";
import { useState, useEffect } from "react";
import './counts.css'
import { DeleteOutlined, InfoCircleOutlined } from "@ant-design/icons";

function Counts() {
    const apiURL = import.meta.env.VITE_API_BASE_URL;
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [counts, setCounts] = useState([]);
    const [discounts, setDiscounts] = useState([]);

    const onFinish = async (values) => {
        try {
            const parsedData = {};
            Object.entries(values).forEach(([key, value]) => {
                const [grade, className, type] = key.split('-');
                if (!parsedData[grade]) {
                    parsedData[grade] = {};
                }
                if (!parsedData[grade][className]) {
                    parsedData[grade][className] = {};
                }
                parsedData[grade][className][type] = value;
            });
            setLoading(true);
            const response = await fetch(`${apiURL}/api/counts/${counts._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    'x-api-key': import.meta.env.VITE_API_KEY
                },
                body: JSON.stringify({ ...parsedData, indirimler: discounts }),
            });

            if (response.ok) { message.success("Veriler başarıyla güncellendi!"); }
            else { message.error("Bir hata oluştu."); }
        }
        catch (error) { console.log(error); }
        finally { setLoading(false); }
    };

    const grades = ["ilkokul", "ortaokul", "anadolu", "fen"];
    const classes = ["sinif1", "sinif2", "sinif3", "sinif4"];
    const anaokulu = ["yas3", "yas4", "yas5"];

    const Columns = [
        {
            title: 'İndirim Adı',
            dataIndex: 'DiscountName',
            key: 'DiscountName',
            render: (_, record, index) => <Input
                onChange={(e) =>
                    setDiscounts(discounts.map((discount) => discount._id === record._id ? { ...discount, DiscountName: e.target.value } : discount))
                }
                value={record.DiscountName}
            />
        },
        {
            title: 'İndirim Oranı (%)',
            dataIndex: 'DiscountValue',
            key: 'DiscountValue',
            width: 150,
            render: (_, record, index) => <InputNumber
                onChange={(value) =>
                    value > 0 && value < 101 ?
                        setDiscounts(discounts.map((discount) => discount._id === record._id ? { ...discount, DiscountValue: value } : discount)) : null
                }
                min={0} max={100} value={record.DiscountValue} style={{ width: "100%" }}
            />
        },
        {
            title: 'Sil',
            dataIndex: 'sil',
            key: 'sil',
            width: 1,
            render: (_, record, index) => (
                <Space>
                    <Popconfirm
                        title="İndirimi Sil"
                        description="İndirimi silmek istediğinizden emin misiniz?"
                        okText="Sil"
                        cancelText="İptal"
                        onConfirm={() => setDiscounts(discounts.filter((discount) => discount !== record))}
                    >
                        <Button type="primary" danger><DeleteOutlined /></Button>
                    </Popconfirm>
                </Space>
            )
        },
    ];

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${apiURL}/api/counts`, {
                method: "GET",
                headers: { 'x-api-key': import.meta.env.VITE_API_KEY }
            });

            if (response.ok) {
                const data = await response.json();
                setCounts(data);
                form.setFieldValue("ocakpesin", data.erkenindirimler.ocak.pesin);
                form.setFieldValue("ocaktek", data.erkenindirimler.ocak.tek);
                form.setFieldValue("subatpesin", data.erkenindirimler.subat.pesin);
                form.setFieldValue("subattek", data.erkenindirimler.subat.tek);
                setDiscounts(data.indirimler);
                anaokulu.map((s) => {
                    form.setFieldValue(("anaokulu-" + s + "-egitim"), data.anaokulu[s].egitim);
                    form.setFieldValue(("anaokulu-" + s + "-yemek"), data.anaokulu[s].yemek);
                })
                grades.map((grd) => {
                    classes.map((cls) => {
                        form.setFieldValue((grd + "-" + cls + "-egitim"), data[grd][cls].egitim);
                        form.setFieldValue((grd + "-" + cls + "-yemek"), data[grd][cls].yemek);
                    })
                })
            } else {
                message.error("Veriler alınırken bir hata oluştu!");
            }
        } catch (error) {
            console.log(error);
            message.error("Veriler alınırken bir hata oluştu!");
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, [apiURL]);

    function capitalizeFirstLetter(val) {
        return String(val).charAt(0).toUpperCase() + String(val).slice(1);
    }

    return (
        <Spin spinning={loading}>
            <Form
                form={form}
                name="basic"
                layout="vertical"
                autoComplete="off"
                onFinish={onFinish}
            >
                <div className="countspaddingArea" style={{ padding: "2rem" }}>
                    <div className="countsGrid">
                        <div className="countsGridArea">
                            <h2>Meb Baz Ücretleri</h2>
                            <div className="classListerArea">
                                <Divider orientation="left">Anaokulu Baz Ücretleri</Divider>
                                {anaokulu.map((s, k) => (
                                    <Flex gap="middle" key={k}>
                                        <Form.Item
                                            label={(k + 3) + " Yaş Eğitim Baz Ücreti"}
                                            name={"anaokulu-" + s + "-egitim"}
                                            rules={[{ required: true, message: 'Lütfen bu alanı doldurun.' }]}
                                            style={{ width: "100%" }}
                                        >
                                            <InputNumber style={{ width: "100%" }} />
                                        </Form.Item>
                                        <Form.Item
                                            label={(k + 3) + " Yaş Yemek Baz Ücreti"}
                                            name={"anaokulu-" + s + "-yemek"}
                                            rules={[{ required: true, message: 'Lütfen bu alanı doldurun.' }]}
                                            style={{ width: "100%" }}
                                        >
                                            <InputNumber style={{ width: "100%" }} />
                                        </Form.Item>
                                    </Flex>
                                ))}
                            </div>
                            {grades.map((g, k) => (
                                <div className="classListerArea" key={k}>
                                    <Divider orientation="left">{capitalizeFirstLetter(g)} Baz Ücretleri</Divider>
                                    {classes.map((c, i) => (
                                        <Flex gap="middle" key={i}>
                                            <Form.Item
                                                label={g === "fen" ? (k * 4 + (i + 1) - 4) + ". Sınıf Eğitim Baz Ücreti" : (k * 4 + (i + 1)) + ". Sınıf Eğitim Baz Ücreti"}
                                                name={g + "-" + c + "-egitim"}
                                                rules={[{ required: true, message: 'Lütfen bu alanı doldurun.' }]}
                                                style={{ width: "100%" }}
                                            >
                                                <InputNumber style={{ width: "100%" }} />
                                            </Form.Item>
                                            <Form.Item
                                                label={g === "fen" ? (k * 4 + (i + 1) - 4) + ". Sınıf Yemek Baz Ücreti" : (k * 4 + (i + 1)) + ". Sınıf Yemek Baz Ücreti"}
                                                name={g + "-" + c + "-yemek"}
                                                rules={[{ required: true, message: 'Lütfen bu alanı doldurun.' }]}
                                                style={{ width: "100%" }}
                                            >
                                                <InputNumber style={{ width: "100%" }} />
                                            </Form.Item>
                                        </Flex>
                                    ))}
                                </div>
                            ))}
                        </div>
                        <div className="countsGridArea">
                            <h2>İndirimler</h2>
                            <Table
                                dataSource={discounts}
                                columns={Columns}
                                rowKey={(record) => record._id}
                                loading={loading}
                                scroll={{ x: 400 }}
                                style={{ width: '100%' }}
                                size="small"
                            />
                            <div className="classListerArea">
                                <Flex vertical={true} gap="middle">
                                    <Flex gap="middle" align="start">
                                        <InfoCircleOutlined style={{ transform: "translateY(25%)" }} />
                                        <p>Lütfen erken dönem indirimlerini indirim ekle şeklinde eklemeyiniz. Onun yerine aşağıdaki erken dönem indirimleri alanlarını doldurun.</p>
                                    </Flex>
                                    <Flex gap="middle" align="start">
                                        <InfoCircleOutlined style={{ transform: "translateY(25%)" }} />
                                        <p>Lütfen burs indirimlerini öğrenci sayfalarından ekleyiniz.</p>
                                    </Flex>
                                    <Flex gap="middle" align="start">
                                        <InfoCircleOutlined style={{ transform: "translateY(25%)" }} />
                                        <p>İndirimleri kaydetmek için en altta bulunan "Kaydet" butonuna tıklayın.</p>
                                    </Flex>
                                </Flex>
                            </div>
                            <div className="classListerArea">
                                <Divider orientation="left">İndirim Ekle</Divider>
                                <Flex vertical={true}>
                                    <Form.Item
                                        label="İndirim Adı"
                                        name="DiscountName"
                                        style={{ width: "100%" }}
                                    >
                                        <Input style={{ width: "100%" }} />
                                    </Form.Item>
                                    <Form.Item
                                        label="İndirim Oranı (%)"
                                        name="DiscountValue"
                                        style={{ width: "100%" }}
                                    >
                                        <InputNumber min={0} max={100} style={{ width: "100%" }} />
                                    </Form.Item>
                                </Flex>
                                <Button type="primary" style={{ width: "100%" }} onClick={() => {
                                    if (form.getFieldValue("DiscountName") && form.getFieldValue("DiscountValue")) {
                                        setDiscounts([...discounts, { DiscountName: form.getFieldValue("DiscountName"), DiscountValue: form.getFieldValue("DiscountValue") }])
                                        form.setFieldValue("DiscountName", "")
                                        form.setFieldValue("DiscountValue", "")
                                    } else {
                                        message.error("Lütfen tüm alanları doldurun.")
                                    }
                                }}>
                                    İndirim Ekle</Button>
                            </div>
                            <div className="classListerArea">
                                <Divider orientation="left">Erken Dönem İndirimleri</Divider>
                                <h4>Ocak Ayı İndirimleri</h4>
                                <Flex vertical={true}>
                                    <Form.Item
                                        label="Ocak Tek"
                                        name="ocaktek"
                                        rules={[{ required: true, message: 'Lütfen bu alanı doldurun.' }]}
                                        style={{ width: "100%" }}
                                    >
                                        <InputNumber style={{ width: "100%" }} />
                                    </Form.Item>
                                    <Form.Item
                                        label="Ocak Peşin"
                                        name="ocakpesin"
                                        rules={[{ required: true, message: 'Lütfen bu alanı doldurun.' }]}
                                        style={{ width: "100%" }}
                                    >
                                        <InputNumber style={{ width: "100%" }} />
                                    </Form.Item>
                                </Flex>
                                <h4>Şubat Ayı İndirimleri</h4>
                                <Flex vertical={true}>
                                    <Form.Item
                                        label="Şubat Tek"
                                        name="subattek"
                                        rules={[{ required: true, message: 'Lütfen bu alanı doldurun.' }]}
                                        style={{ width: "100%" }}
                                    >
                                        <InputNumber style={{ width: "100%" }} />
                                    </Form.Item>
                                    <Form.Item
                                        label="Şubat Peşin"
                                        name="subatpesin"
                                        rules={[{ required: true, message: 'Lütfen bu alanı doldurun.' }]}
                                        style={{ width: "100%" }}
                                    >
                                        <InputNumber style={{ width: "100%" }} />
                                    </Form.Item>
                                </Flex>
                            </div>
                            <div className="classListerArea">
                                <Flex vertical={true} gap="middle">
                                    <Flex gap="middle" align="start">
                                        <InfoCircleOutlined style={{ transform: "translateY(25%)" }} />
                                        <p>Yapılan zam tüm öğrencilerin ücretlerini etkiler.</p>
                                    </Flex>
                                    <Flex gap="middle" align="start">
                                        <InfoCircleOutlined style={{ transform: "translateY(25%)" }} />
                                        <p>Bireysel öğrencilerin ücretlerini düzenlemek için öğrenci sayfalarına gidiniz.</p>
                                    </Flex>
                                    <Flex gap="middle" align="start">
                                        <InfoCircleOutlined style={{ transform: "translateY(25%)" }} />
                                        <p>Öğrenci sayısına göre, zam yapmak biraz zaman alabilir. Lütfen işlem süresince sayfayı terk etmeyiniz.</p>
                                    </Flex>
                                </Flex>
                            </div>
                            <div className="classListerArea">
                                <Divider orientation="left">Öğrenci Bazlarına Zam Yap</Divider>
                                <Flex vertical={true}>
                                    <Form.Item label="Zam Oranı (%)" name="zam" style={{ width: "100%" }}>
                                        <InputNumber style={{ width: "100%" }} />
                                    </Form.Item>
                                    <Popconfirm
                                        title="Zammı Uygula"
                                        description="Zammı uygulamak istediğinize emin misiniz? Ara sınıflardaki bütün öğrencilerin bundan etkileneceğini unutmayın."
                                        okText="Uygula"
                                        cancelText="İptal"
                                    >
                                        <Button type="primary" style={{ width: "100%" }} danger>Uygula</Button>
                                    </Popconfirm>
                                </Flex>
                            </div>
                        </div>
                    </div>
                    <Button type="primary" htmlType="submit" style={{ width: "100%", marginTop: "1rem" }}>Kaydet</Button>
                </div>

            </Form>
        </Spin>
    )
}

export default Counts
