
import React from 'react';
import { Flex } from 'antd';

function User({ info }) {

  return (
      <Flex gap="middle" align='center' style={{fontSize: '14px'}}>
        {info.class ?
          <Flex vertical={true} >
            <b>{info.name}</b>
            <p>{info.class}</p>
          </Flex> 
          :
          <b>{info.name}</b>
        }
      </Flex>
  )
}

export default User
