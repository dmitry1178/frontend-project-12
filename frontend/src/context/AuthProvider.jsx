import React, { useState, useMemo } from 'react';
import Context from './index.js';

const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('user')));
  const logIn = (data) => {
    const user = { token: data.token, username: data.username };
    localStorage.setItem('user', JSON.stringify(user));
    setUserData(data);
  };

  const memo = useMemo(() => ({ data: userData, setUserData, logIn }), [userData]);

  return (
    <Context.Provider value={memo}>
      {children}
    </Context.Provider>
  );
};

export default AuthProvider;