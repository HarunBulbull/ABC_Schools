
import React from 'react';
import './Guide.css'
import { SearchOutlined } from '@ant-design/icons';
import { Flex } from 'antd';

function Guide() {

  return (
    <div className="guideGrid">
      <div className="firstSection">
        <div className="findArea">
          <input type="text" placeholder='Ara' />
          <SearchOutlined />
        </div>
        <Flex vertical={true} gap="middle" className="recordsArea">
          <Flex justify='space-between'>
            <h3>Son Kayıtlar</h3>
            <a href="#">Hepsini gör</a>
          </Flex>
          <Flex className="record" gap="middle" align='center'>
            <img src="/assets/egitim.jpg" alt="portal" />
            <Flex className="recordInfo" vertical={true}>
              <Flex vertical={true} className="recordInfoHead">
                <Flex align='center' justify='space-between'>
                  <h3>Kayıt Adı</h3>
                  <p>09.08.2024</p>
                </Flex>
                <Flex gap="middle" align='center'>
                  <div className="progress">
                    <span style={{ width: "76%" }}></span>
                  </div>
                  <p>76%</p>
                </Flex>
              </Flex>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ac gravida neque. Curabitur semper blandit elit sit amet luctus. Nam erat nibh, pulvinar sit amet mi eget, porttitor vehicula quam. Phasellus vel leo nec tortor egestas rutrum at at libero. Maecenas nec eros at enim condimentum mattis. Vivamus scelerisque, velit sit amet fermentum porttitor, leo nibh maximus velit, non eleifend magna nibh nec eros. Donec purus lorem, mattis at massa at, condimentum accumsan augue. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. In eget leo rhoncus, feugiat ante id, ornare tortor. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus...</p>
            </Flex>
          </Flex>
          <Flex className="record" gap="middle" align='center'>
            <img src="/assets/egitim.jpg" alt="portal" />
            <Flex className="recordInfo" vertical={true}>
              <Flex vertical={true} className="recordInfoHead">
                <Flex align='center' justify='space-between'>
                  <h3>Kayıt Adı</h3>
                  <p>09.08.2024</p>
                </Flex>
                <Flex gap="middle" align='center'>
                  <div className="progress">
                    <span style={{ width: "76%" }}></span>
                  </div>
                  <p>76%</p>
                </Flex>
              </Flex>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ac gravida neque. Curabitur semper blandit elit sit amet luctus. Nam erat nibh, pulvinar sit amet mi eget, porttitor vehicula quam. Phasellus vel leo nec tortor egestas rutrum at at libero. Maecenas nec eros at enim condimentum mattis. Vivamus scelerisque, velit sit amet fermentum porttitor, leo nibh maximus velit, non eleifend magna nibh nec eros. Donec purus lorem, mattis at massa at, condimentum accumsan augue. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. In eget leo rhoncus, feugiat ante id, ornare tortor. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus...</p>
            </Flex>
          </Flex>
        </Flex>
        <div className="latestArea">
          <div className="circle" />
          <div className="circle" />
          <Flex vertical={true} gap="middle" style={{ zIndex: 1, position: "relative" }}>
            <Flex align='center' justify='space-between' gap='large'>
              <h3>Son Eğitiminiz</h3>
              <Flex gap="middle" align='center' style={{width: "50%"}}>
                <div className="progress">
                  <span style={{ width: "76%", backgroundColor: "var(--secondary-color" }}></span>
                </div>
                <p>76%</p>
              </Flex>
            </Flex>
            <Flex gap="middle" className="latest">
              <img src="/assets/egitim.jpg" alt="latest" />
              <Flex vertical={true} gap="small">
                <Flex align='center' justify='space-between'>
                  <h3>Eğitim Adı</h3>
                  <a href="#" style={{color: "white", opacity: ".6"}}>Devam et</a>
                </Flex>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ac gravida neque. Curabitur semper blandit elit sit amet luctus. Nam erat nibh, pulvinar sit amet mi eget, porttitor vehicula quam. Phasellus vel leo nec tortor egestas rutrum at at libero. Maecenas nec eros at enim condimentum mattis. Vivamus scelerisque, velit sit amet fermentum porttitor, leo nibh maximus velit, non eleifend magna nibh nec eros.</p>
              </Flex>
            </Flex>
          </Flex>
        </div>
      </div>
      <div className="secondSection">
        <Flex vertical={true} gap="middle" className="commentsArea">
          <Flex align='center' justify='space-between'>
            <h3>Rehber Görüşleri</h3>
            <a href="#">Hepsi</a>
          </Flex>
          <Flex gap="small" className="comment">
            <img src="/assets/anonim.png" alt="anonim" />
            <Flex vertical={true}>
              <Flex align='center' justify='space-between'>
                <h4>Rehber Öğr. Adı</h4>
                <a href="#">Görüntüle</a>
              </Flex>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ac gravida neque. Curabitur semper blandit elit sit amet luctus. Nam erat nibh, pulvinar sit amet mi eget, porttitor vehicula quam. Phasellus vel leo nec tortor egestas rutrum at at libero Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
            </Flex>
          </Flex>
          <Flex gap="small" className="comment">
            <img src="/assets/anonim.png" alt="anonim" />
            <Flex vertical={true}>
              <Flex align='center' justify='space-between'>
                <h4>Rehber Öğr. Adı</h4>
                <a href="#">Görüntüle</a>
              </Flex>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ac gravida neque. Curabitur semper blandit elit sit amet luctus. Nam erat nibh, pulvinar sit amet mi eget, porttitor vehicula quam. Phasellus vel leo nec tortor egestas rutrum at at libero Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
            </Flex>
          </Flex>
        </Flex>
        <Flex vertical={true} gap="middle" className='studentList'>
          <h3>Velisi Olduğunuz Öğrenciler</h3>
          <Flex gap="middle" align='center'>
            <img src="/assets/anonim.png" alt="anonim" />
            <Flex vertical={true}>
              <h4>Öğrenci Adı</h4>
              <a href="#">Rehberlik Profilini Görüntüle</a>
            </Flex>
          </Flex>
          <Flex gap="middle" align='center'>
            <img src="/assets/anonim.png" alt="anonim" />
            <Flex vertical={true}>
              <h4>Öğrenci Adı</h4>
              <a href="#">Rehberlik Profilini Görüntüle</a>
            </Flex>
          </Flex>
          <Flex gap="middle" align='center'>
            <img src="/assets/anonim.png" alt="anonim" />
            <Flex vertical={true}>
              <h4>Öğrenci Adı</h4>
              <a href="#">Rehberlik Profilini Görüntüle</a>
            </Flex>
          </Flex>
          <Flex gap="middle" align='center'>
            <img src="/assets/anonim.png" alt="anonim" />
            <Flex vertical={true}>
              <h4>Öğrenci Adı</h4>
              <a href="#">Rehberlik Profilini Görüntüle</a>
            </Flex>
          </Flex>
          <Flex gap="middle" align='center'>
            <img src="/assets/anonim.png" alt="anonim" />
            <Flex vertical={true}>
              <h4>Öğrenci Adı</h4>
              <a href="#">Rehberlik Profilini Görüntüle</a>
            </Flex>
          </Flex>
        </Flex>
        <a href="#" className='goDate'>Rehberlik Randevusu Oluştur</a>
      </div>
    </div>
  )
}

export default Guide
