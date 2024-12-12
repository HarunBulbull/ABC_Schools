// * Obiziz 2024
// ! Dependincies
import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

function Fail() {
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
    status="error"
    title="Ödemeniz Alınırken Bir Sorun Oluştu!"
    subTitle="Ödemenizi alırken bir sorunla karşılaştık, lütfen daha sonra tekrar deneyin."
    extra={[
      <Button type="primary" key="console" onClick={() => nav('/profil')}>
        Profile Dön
      </Button>
    ]}
  />
  )
}

export default Fail
