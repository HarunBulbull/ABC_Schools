import './User.css'
import React from 'react';
import { Flex } from 'antd';

function User({ info }) {

  return (
      <Flex gap="middle" align='center'>
        {info.class ?
          <Flex vertical={true} >
            <h3>{info.name}</h3>
            <p>{info.class}</p>
          </Flex> 
          :
          <h2>{info.name}</h2>
        }
      </Flex>
  )
}

export default User
