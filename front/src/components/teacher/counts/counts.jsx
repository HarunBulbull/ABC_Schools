import { Button, Spin, Divider, Form, message, InputNumber, Input, Flex, Table, Popconfirm, Space } from "antd";
import { useState, useEffect } from "react";
import './counts.css'

function Counts() {
    const apiURL = import.meta.env.VITE_API_BASE_URL;
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [counts, setCounts] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [changes, setChanges] = useState(false);

    const onFinish = async (values) => {
        try {
            setLoading(true);
            const indirimler = [];
            Object.entries(values).forEach(([key, value]) => {
                if (key !== 'education' && key !== 'food') {
                    indirimler.push({ name: key, value: value });
                }
            })
            const meb = {
                education: values.education,
                food: values.food,
            }
            const response = await fetch(`${apiURL}/api/counts/${selectedClass._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    'x-api-key': import.meta.env.VITE_API_KEY
                },
                body: JSON.stringify({ meb, indirimler }),
            });

            if (response.ok) { 
                message.success("Veriler başarıyla güncellendi!");
                setChanges(false);
                const ind = counts.findIndex(count => count._id === selectedClass._id);
                fetchData(ind);
             }
            else { message.error("Bir hata oluştu."); }
        }
        catch (error) { console.log(error); }
        finally { setLoading(false); }
    };

    const fetchData = async (num) => {
        setLoading(true);
        try {
            const response = await fetch(`${apiURL}/api/counts`, {
                method: "GET",
                headers: { 'x-api-key': import.meta.env.VITE_API_KEY }
            });

            if (response.ok) {
                const data = await response.json();
                setCounts(data);
                setSelectedClass(data[num]);
                form.setFieldsValue({
                    education: data[num].meb.education,
                    food: data[num].meb.food,
                })
                data[num].indirimler.forEach((ind) => {
                    form.setFieldValue(ind.name, ind.value);
                })
            }
            else { message.error("Veriler alınırken bir hata oluştu!"); }
        } catch (error) {
            console.log(error);
            message.error("Veriler alınırken bir hata oluştu!");
        }
        finally { setLoading(false); }
    };

    useEffect(() => {
        form.setFieldsValue({
            education: selectedClass?.meb?.education,
            food: selectedClass?.meb?.food,
        })
        selectedClass?.indirimler.forEach((ind) => {
            form.setFieldValue(ind.name, ind.value);
        })
    }, [selectedClass]);

    useEffect(() => { fetchData(0); }, [apiURL]);

    const handleClassChange = (count) => {
        if (changes) {
            if (confirm('Kaydetmediğiniz değişiklikler kaybolacaktır. Devam etmek istiyor musunuz?')) {
                setSelectedClass(count);
                setChanges(false);
            }
        }
        else {
            setSelectedClass(count);
        }
    }

    return (
        <Spin spinning={loading}>
            <div className="classCountPadding">
                <div className="classSelector">
                    <Divider className="classSelectorDivider" orientation="left">Sınıflar</Divider>
                    {counts.map((count) => (
                        <div className="classSelectorArea">
                            <div
                                className={selectedClass === count ?
                                    "classSelectorAreaTitle selectedTitle"
                                    : "classSelectorAreaTitle"}
                                onClick={() =>
                                    handleClassChange(count)
                                }>{count?.sinif}</div>
                        </div>
                    ))}
                </div>
                <Form
                    form={form}
                    name="basic"
                    layout="vertical"
                    autoComplete="off"
                    onFinish={onFinish}
                >
                    <Flex vertical={true} gap="middle">
                        <div className="whiteArea">
                            <Divider>Meb Baz Ücreti</Divider>
                            <Flex className="flexResponsive" gap="middle">
                                <Form.Item
                                    label="Eğitim Baz Ücreti"
                                    name="education"
                                    rules={[{ required: true, message: 'Lütfen bu alanı doldurun.' }]}
                                    style={{ width: "100%" }}
                                >
                                    <InputNumber onChange={(e) => { setChanges(true); }} style={{ width: "100%" }} />
                                </Form.Item>
                                <Form.Item
                                    label="Yemek Baz Ücreti"
                                    name="food"
                                    rules={[{ required: true, message: 'Lütfen bu alanı doldurun.' }]}
                                    style={{ width: "100%" }}
                                >
                                    <InputNumber onChange={(e) => { setChanges(true); }} style={{ width: "100%" }} />
                                </Form.Item>
                            </Flex>
                        </div>
                        <div className="whiteArea">
                            <Divider>İndirimler</Divider>
                            <div className="discountGrid">
                                {selectedClass?.indirimler?.map((ind, key) => (
                                    <Form.Item
                                        key={key}
                                        label={ind.name}
                                        name={ind.name}
                                        rules={[{ required: true, message: 'Lütfen bu alanı doldurun.' }]}
                                        style={{ width: "100%" }}
                                    >
                                        <InputNumber onChange={(e) => { setChanges(true); }} min={0} max={100} style={{ width: "100%" }} />
                                    </Form.Item>
                                ))}
                            </div>
                        </div>
                    </Flex>
                    <Button type="primary" htmlType="submit" style={{ width: "100%", marginTop: "1rem" }}>Kaydet</Button>

                </Form>
            </div>
        </Spin>
    )
}

export default Counts
