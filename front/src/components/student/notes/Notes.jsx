import './Notes.css'
import React from 'react';
import { CaretDownFill } from 'react-bootstrap-icons';
import Note from './Note';

function Notes() {

    const years = [
        "2015-2016",
        "2016-2017",
        "2017-2018",
        "2018-2019",
        "2019-2020",
        "2020-2021",
        "2021-2022",
        "2022-2023",
        "2023-2024",
        "2024-2025",
    ];

    const notes =
        [
            {
                lesson: "Matematik",
                exam1: 87,
                exam2: 92,
                note1: 100,
                note2: 100
            },
            {
                lesson: "Türkçe",
                exam1: 67,
                exam2: 78,
                note1: 90,
                note2: 90
            },
            {
                lesson: "Fen Bilimleri",
                exam1: 73,
                exam2: 88,
                note1: 95,
                note2: 100
            },
            {
                lesson: "Hayat Bilgisi",
                exam1: 73,
                exam2: 84,
                note1: 90,
                note2: 95
            },
            {
                lesson: "Beden Eğitimi",
                exam1: 100,
                exam2: 100
            }
        ];

    const handleExpand = (id) => {
        const element = document.getElementById(id);
        const caret = document.getElementById('caret' + id);
        if (element.style.height == "90px") {
            element.style.height = "30px"
            caret.style.rotate = "0deg";
        }
        else {
            element.style.height = "90px"
            caret.style.rotate = "180deg";
        }
    }

    return (
        <div className="notesGrid">
            <div className="selectArea">
                {years.map((y, k) => (
                    <div key={k} className="selector" id={k}>
                        <div className="head" onClick={() => handleExpand(k)}>
                            <b>{y}</b>
                            <CaretDownFill id={'caret' + k} style={{ transition: "ease .3s" }} />
                        </div>
                        <a>1. Dönem</a>
                        <a>2. Dönem</a>
                    </div>
                ))}
            </div>
            <div className="noteTable">
                <b>Ders</b>
                <b>1. Sınav</b>
                <b>2. Sınav</b>
                <b>1. Sözlü</b>
                <b>2. Sözlü</b>
                <b>Ortalama</b>
                {notes.map((n, k) => (
                    <Note info={n} key={k} />
                ))}
            </div>
        </div>
    )
}

export default Notes
