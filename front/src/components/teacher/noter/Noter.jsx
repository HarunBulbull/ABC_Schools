
import React from 'react';
import { Flex } from 'antd';

function Noter({ info }) {

  return (
      <Flex vertical={true}>
        <p><b>{info.name}</b> • {info.main}</p>
        <p>{info.note}</p>
      </Flex>
  )
}

export default Noter
