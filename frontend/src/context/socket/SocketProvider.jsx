import React, { useMemo } from 'react';
import { SocketContext } from '../index.js';
import buildChatAPI from './buildChatAPI.js';

const SocketProvider = ({ children, socket }) => {
  const requests = useMemo(() => buildChatAPI(socket), [socket]);
  return (
    <SocketContext.Provider value={requests}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;