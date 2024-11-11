import './Lessons.css'
import React, { useState } from 'react';
import { Flex } from 'antd';
import Notes from './Notes';
import { CaretLeftOutlined } from '@ant-design/icons'

function Lessons() {
    const seasons = ["2024-2025 2. Dönem", "2024-2025 1. Dönem", "2023-2024 2. Dönem", "2023-2024 1. Dönem"]
  return (
    <div className='lessonGrid'>
        <Flex gap="middle" align='center' className='leftSideGrid' justify='space-between'>
            <Flex align='center' gap="middle">
                <img src="/assets/anonim.png" />
                <Flex vertical={true}>
                    <h3>Öğrenci Adı</h3>
                    <p>1/A (123)</p>
                </Flex>
            </Flex>
            <a href="/ogrenci/obiziz"><CaretLeftOutlined /> Geri Dön</a>
        </Flex>
        {seasons.map((s,k) => (
            <Notes id={1} season={s} key={k}/>
        ))}
    </div>
  )
}

export default Lessons
