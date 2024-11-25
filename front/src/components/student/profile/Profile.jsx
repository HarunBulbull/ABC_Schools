import './Profile.css'
import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import { GeoAltFill, ClockFill, Book, Clock} from 'react-bootstrap-icons'
import {Flex} from 'antd';

function Profile() {
    const [info, setInfo] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : logOut());
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const logOut = () => {
        localStorage.removeItem("user");
        window.location.reload();
    }


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${baseUrl}/api/info/student/${user.ID}`, { method: "GET" });
                const res = await response.json();
                if (response.ok) {
                    setInfo(res);
                    setLoading(false);
                }
                else { alert("Verileriniz getirilirken bir hata oluştu! :("); }
            }
            catch (error) {console.error(error);}
        }
        fetchData();
    }, [user])

    return (
        <Spin spinning={loading}>
            <div className="studentProfileGrid">
                <div className="infoArea">
                    <img src="/vectors/faq_img02.png" alt="info" className='info' />
                    <Flex gap="middle">
                        <img src="/vectors/testimonial_avatar01.png" alt="profile" />
                        <Flex vertical={true}>
                            <h2>Adı Soyadı</h2>
                            <p className='active'>Aktif Kayıt</p>
                        </Flex>
                    </Flex>
                    <span></span>
                    <div className="listArea">
                        <h3>Kişisel Bilgiler</h3>
                        <ul>
                            <li><b>Cinsiyet: </b>Erkek</li>
                            <li><b>Doğduğu Ülke: </b>Türkiye</li>
                            <li><b>Doğduğu İl: </b>Ankara</li>
                            <li><b>Doğum Tarihi: </b>09.08.2014</li>
                            <li><b>Dili: </b>Türkçe</li>
                        </ul>
                        <span></span>
                        <div className="relativeArea">
                            <img src="/vectors/agency_shape02.png" alt="cross" className='cross'/>
                            <img style={{left: "auto", right: 0, top: "2rem"}} src="/vectors/h3_newsletter_shape04.png" alt="cross" className='cross'/>
                        </div>
                        <h3>Okul Bilgieri</h3>
                        <ul style={{position: "relative"}}>
                            <li><b>Sınıfı: </b>3/A</li>
                            <li><b>Okul Numarası: </b>123</li>
                            <li><b>Giriş Tarihi: </b>09.08.2022</li>
                            <li><b>Çıkış Tarihi: </b>-</li>
                            <li><b>Kayıt Türü: </b>Asıl Kayıt</li>
                            <li><b>Branşı: </b>Sayısal</li>
                            <li><b>Yatılılık Durumu: </b>Evet</li>
                            <li><b>Danışman: </b>H. Can Azapcı</li>
                            <li><b>Rehber Öğretmen: </b>Uğur Özer</li>
                            <img src="/vectors/banner_shape04.png" alt="sus" className='sus' />
                        </ul>
                        <span></span>
                        <h3>Veliler</h3>
                        <ul style={{position: "relative"}}>
                            <li>Veli adı soyadı</li>
                            <li>Veli adı soyadı</li>
                            <li>Veli adı soyadı</li>
                            <img src="/vectors/banner_shape03.png" style={{top: 0, left: "70%", animationDelay: "1s"}} alt="sus" className='sus' />
                        </ul>
                        <span></span>
                        <div className="relativeArea">
                            <img src="/vectors/services_icon02.png" alt="phone" className='phone' />
                            <h3>İletişim</h3>
                            <h4 style={{marginTop: ".3rem"}}>Telefon Numaraları</h4>
                            <ul>
                                <li><a href="tel:+905555555555">+90 (555) 555 55 55</a></li>
                                <li><a href="tel:+905555555555">+90 (555) 555 55 55</a></li>
                                <li><a href="tel:+905555555555">+90 (555) 555 55 55</a></li>
                            </ul>
                            <h4 style={{marginTop: ".3rem"}}>E-posta adresleri</h4>
                            <ul>
                                <li><a href="mailto:mail@example.com">mail@example.com</a></li>
                                <li><a href="mailto:mail@example.com">mail@example.com</a></li>
                                <li><a href="mailto:mail@example.com">mail@example.com</a></li>
                            </ul>
                            <h4 style={{marginTop: ".3rem"}}>Adresler</h4>
                            <ul>
                                <li style={{marginTop: ".15rem"}}>Çankaya mahallesi, Nilgün sokak, 14/1, 06680, Çankaya/Ankara</li>
                                <li style={{marginTop: ".15rem"}}>Çankaya mahallesi, Nilgün sokak, 14/1, 06680, Çankaya/Ankara</li>
                                <li style={{marginTop: ".15rem"}}>Çankaya mahallesi, Nilgün sokak, 14/1, 06680, Çankaya/Ankara</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="rightArea">
                    <div className="adArea">
                        <img src="./vectors/project_shape01.png" alt="shape" className='shape' />
                        <img src="./vectors/h3_newsletter_shape01.png" alt="vector" className='vector' />
                        <div className="black">
                            <Flex align='center'>
                                <img src="./assets/announcement.png" alt="announce" />
                                <h2>Yaklaşan Etkinliklerim</h2>
                            </Flex>
                            <div className="activity">
                                <Flex justify='space-between' className='flexMedia'>
                                    <h4>Yeni Yıl Balosu</h4>
                                    <p style={{display: "flex", alignItems: "center", gap: ".3rem"}}><b><ClockFill/></b> <i>31.12.2024 - 22:00</i></p>
                                </Flex>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sodales sem magna, gravida porta erat volutpat sit amet. Aliquam volutpat, augue volutpat sollicitudin pulvinar, nulla nisl viverra ligula.</p>
                                <p style={{display: "flex", alignItems: "center", gap: ".3rem"}}><b><GeoAltFill/></b> <i>Konferans Salonu</i></p>
                            </div>
                            <div className="activity">
                                <Flex justify='space-between' className='flexMedia'>
                                    <h4>Yeni Yıl Balosu</h4>
                                    <p style={{display: "flex", alignItems: "center", gap: ".3rem"}}><b><ClockFill/></b> <i>31.12.2024 - 22:00</i></p>
                                </Flex>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sodales sem magna, gravida porta erat volutpat sit amet. Aliquam volutpat, augue volutpat sollicitudin pulvinar, nulla nisl viverra ligula.</p>
                                <p style={{display: "flex", alignItems: "center", gap: ".3rem"}}><b><GeoAltFill/></b> <i>Konferans Salonu</i></p>
                            </div>
                        </div>
                    </div>
                    <div className="rightGridArea">
                        <div className="homeworkList">
                        <img src="/vectors/h2_banner_img.png" alt="bulb" className='bulb'/>
                        <img src="/vectors/consultation_shape01.png" alt="shape" className='shape'/>
                            <h3>Ödevlerim</h3>
                            <div className="homework">
                                <Flex justify='space-between' className='flexMedia'>
                                    <Flex align='center' gap="small"><b><Book style={{opacity: .7}}/></b> <p>Matematik</p></Flex>
                                    <p>12.12.2024</p>
                                </Flex>
                                <i style={{opacity: .7}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sodales sem magna, gravida porta erat volutpat sit amet.</i>
                            </div>
                            <div className="homework">
                                <Flex justify='space-between' className='flexMedia'>
                                    <Flex align='center' gap="small"><b><Book style={{opacity: .7}}/></b> <p>Matematik</p></Flex>
                                    <p>12.12.2024</p>
                                </Flex>
                                <i style={{opacity: .7}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sodales sem magna, gravida porta erat volutpat sit amet.</i>
                            </div>
                            <div className="homework">
                                <Flex justify='space-between' className='flexMedia'>
                                    <Flex align='center' gap="small"><b><Book style={{opacity: .7}}/></b> <p>Matematik</p></Flex>
                                    <p>12.12.2024</p>
                                </Flex>
                                <i style={{opacity: .7}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sodales sem magna, gravida porta erat volutpat sit amet.</i>
                            </div>
                        </div>
                        <div className="verticalGrid">
                            <h3>Hızlı Linkler</h3>
                            <a href="/ders-programi"><div className="buttonBlack">Ders Programım</div></a>
                            <a href="/notlar"><div className="buttonBlack">Notlarım</div></a>
                            <a href="/rehberlik"><div className="buttonBlack">Rehberlik</div></a>
                        </div>
                    </div>
                </div>
            </div>
        </Spin>
    )
}

export default Profile
