import './Lessons.css'
import React from 'react';
import { Flex } from 'antd';
import { extend } from 'dayjs';

function Notes({id, season}) {

  const notes = [
    {
      lesson: "Matematik",
      exam1: 80,
      exam2: 70,
      verbal1: 92,
      verbal2: 90,
      summary: 83
    },
    {
      lesson: "Türkçe",
      exam1: 80,
      exam2: 70,
      verbal1: 92,
      verbal2: 90,
      summary: 83
    },
    {
      lesson: "Sosyal Bilgiler",
      exam1: 80,
      exam2: 70,
      verbal1: 92,
      verbal2: 90,
      summary: 83
    },
    {
      lesson: "Hayat Bilgisi",
      exam1: 80,
      exam2: 70,
      verbal1: 92,
      verbal2: 90,
      summary: 83
    },
    {
      lesson: "Beden Eğitimi",
      exam1: 100,
      exam2: 100,
      verbal1: 100,
      verbal2: 100,
      summary: 100
    },
    {
      lesson: "Serbest Etkinlik",
      exam1: 80,
      exam2: 70,
      verbal1: 92,
      verbal2: 90,
      summary: 83
    },
  ]

  return (
    <div className='lessonsNotesArea'>
      <b>{season}</b>
        <div className="noteTableHead">
          <h4>Ders</h4>
          <h4>1. Sınav</h4>
          <h4>2. Sınav</h4>
          <h4>1. Sözlü</h4>
          <h4>2. Sözlü</h4>
          <h4>Ortalama</h4>
        </div>
        {notes.map((n,k) => (
          <div key={k} className="noteTableArea">
            <p><b>{n.lesson}</b></p>
            <input type='twxt' defaultValue={n.exam1} />
            <input type='text' defaultValue={n.exam2} />
            <input type='text' defaultValue={n.verbal1} />
            <input type='text' defaultValue={n.verbal2} />
            <input type='text' defaultValue={n.summary} />
          </div>
        ))}
        <button>Değişiklikleri kaydet</button>
    </div>
  )
}

export default Notes
