import './BigCalendar.css'
import React from 'react';
import { Calendar, ConfigProvider, Flex } from 'antd';
import trTR from 'antd/locale/tr_TR';
import {
  PieChartOutlined,
  UserOutlined,
  CaretRightOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';

function BigCalendar() {

  return (
    <Flex vertical={true} gap="middle" style={{padding: "1rem"}}>
      <div className="CalendarArea">
        <ConfigProvider locale={trTR}>
          <Calendar />
        </ConfigProvider>
      </div>
      <Flex vertical={true} gap="middle" className="eventsArea">
        <h2>Etinlikler</h2>

        <div className='event'>
          <div className='eventLeft'>
            <PieChartOutlined className='eventIcon'/>
            <Flex vertical={true}>
              <h3>Rehberlik Toplantısı</h3>
              <p>Uzaktan</p>
            </Flex>
          </div>
          <CaretRightOutlined/>
        </div>

        <div className='event'>
          <div className='eventLeft'>
            <UserOutlined className='eventIcon'/>
            <Flex vertical={true}>
              <h3>Değerlendirme Rapor Sonuçları</h3>
              <p>Görevler</p>
            </Flex>
          </div>
          <CaretRightOutlined/>
        </div>
 
        <div className='event'>
          <div className='eventLeft'>
            <ClockCircleOutlined className='eventIcon'/>
            <Flex vertical={true}>
              <h3>Webinar</h3>
              <p>Uzaktan</p>
            </Flex>
          </div>
          <CaretRightOutlined/>
        </div>

      </Flex>
    </Flex>
  )
}

export default BigCalendar
