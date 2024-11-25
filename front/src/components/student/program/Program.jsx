import './Program.css'
import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import { GeoAltFill, ClockFill, Book, Clock} from 'react-bootstrap-icons'
import {Flex} from 'antd';
import Day from './Day';

function Program() {
    const [info, setInfo] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : logOut());
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const logOut = () => {
        localStorage.removeItem("user");
        window.location.reload();
    }

    const days = 
    [
        {
            day: "Pazartesi",
            lessons: ["Ders-1", "Ders-2", "Ders-3", "Ders-4", "Ders-5", "Ders-6", "Ders-7"]
        },
        {
            day: "Salı",
            lessons: ["Ders-1", "Ders-2", "Ders-3", "Ders-4", "Ders-5", "Ders-6", "Ders-7"]
        },
        {
            day: "Çarşamba",
            lessons: ["Ders-1", "Ders-2", "Ders-3", "Ders-4", "Ders-5", "Ders-6", "Ders-7"]
        },
        {
            day: "Perşembe",
            lessons: ["Ders-1", "Ders-2", "Ders-3", "Ders-4", "Ders-5", "Ders-6", "Ders-7"]
        },
        {
            day: "Cuma",
            lessons: ["Ders-1", "Ders-2", "Ders-3", "Ders-4", "Ders-5", "Ders-6", "Ders-7"]
        },
        {
            day: "Cumartesi",
            lessons: ["Ders-1", "Ders-2", "Ders-3", "Ders-4", "Ders-5", "Ders-6", "Ders-7"]
        },
        {
            day: "Pazar",
            lessons: ["Ders-1", "Ders-2", "Ders-3", "Ders-4", "Ders-5", "Ders-6", "Ders-7"]
        },
    ]


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
            <div className="programPadding">
                <div className="programGrid">
                    {days.map((d, k) => (
                        <Day key={k} info={d}/>
                    ))}
                </div>
            </div>
        </Spin>
    )
}

export default Program
