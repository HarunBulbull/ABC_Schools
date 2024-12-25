import { Button, Spin, Divider, Form, message, InputNumber, Flex } from "antd";
import { useState, useEffect } from "react";

function Counts() {
    const apiURL = import.meta.env.VITE_API_BASE_URL;
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [counts, setCounts] = useState([]);

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
                body: JSON.stringify(parsedData),
            });

            if (response.ok) {message.success("Veriler başarıyla güncellendi!");}
            else {message.error("Bir hata oluştu.");}
        } 
        catch (error) {console.log(error);}
        finally {setLoading(false);}
    };

    const grades = ["ilkokul", "ortaokul", "anadolu", "fen"];
    const classes = ["sinif1", "sinif2", "sinif3", "sinif4"];
    const anaokulu = ["yas3", "yas4", "yas5"];

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${apiURL}/api/counts`, {
                method: "GET",
                headers: { 'x-api-key': import.meta.env.VITE_API_KEY}
            });
            if (response.ok) {
                const data = await response.json();
                setCounts(data);
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
            } else { console.log("Bir hata oluştu!"); }
        } catch (error) { console.log(error); }
        finally { setLoading(false); }
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
                <div className="paddingArea" style={{ padding: "2rem" }}>
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
                    {grades.map((g, k) => (
                        <div key={k}>
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
                    <Button type="primary" htmlType="submit" style={{ width: "100%" }}>Kaydet</Button>
                </div>

            </Form>
        </Spin>
    )
}

export default Counts
