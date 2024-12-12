// * Obiziz 2024
// ! Dependincies
import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

function Success() {
  // ! Hooks
  const nav = useNavigate(); 

  return (
    <Result
    style={{
      height: "100dvh", 
      display: "flex", 
      flexDirection: "column", 
      justifyContent: "center", 
      alignItems: "center"
    }}
    status="success"
    title="Ödemeniz Alındı!"
    subTitle="Ödemenizi başarıyla aldık, ödeme takip kodunuz: ..."
    extra={[
      <Button type="primary" key="console" onClick={() => nav('/profil')}>
        Profile Dön
      </Button>
    ]}
  />
  )
}

export default Success
