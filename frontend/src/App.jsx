import React, { useState, useMemo } from 'react';
import {
  BrowserRouter, Routes, Route, Link, Navigate,
} from 'react-router-dom';
import { Navbar, Container, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import ErrorPage from './routes/ErrorPage.jsx';
import LoginPage from './routes/LoginPage.jsx';
import ChatPage from './routes/ChatPage.jsx';
import routes from './routes.js';
import SignupPage from './routes/SignUpPage.jsx';
import AuthContext, { useAuth } from './contexts/index.jsx';

const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(() => {
    const item = localStorage.getItem('userData');
    return item ? JSON.parse(item) : null;
  });
  const logIn = (data) => {
    setUserData(data);
    const stringedData = JSON.stringify(data);
    localStorage.setItem('userData', stringedData);
  };
  const logOut = () => {
    setUserData(null);
    localStorage.removeItem('userData');
  };
  const auth = useMemo(() => ({ userData, logIn, logOut }), [userData]);
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

const PrivateRoute = ({ children }) => {
  const auth = useAuth();
  return auth.userData ? children : <Navigate to={routes.loginPage} />;
};
const AuthButton = () => {
  const auth = useAuth();
  const { t } = useTranslation();
  return auth.userData && <Button onClick={auth.logOut}>{t('login.logout')}</Button>;
};

const App = () => {
  const { t } = useTranslation();
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="d-flex flex-column vh-100">
          <Navbar className="shadow-sm navbar-expand-lg navbar-light bg-white">
            <Container>
              <Navbar.Brand as={Link} to={routes.homePage}>{t('chat')}</Navbar.Brand>
              <AuthButton />
            </Container>
          </Navbar>
          <Routes>
            <Route path="*" element={<ErrorPage />} />
            <Route path={routes.loginPage} element={<LoginPage />} />
            <Route path={routes.signupPage} element={<SignupPage />} />
            <Route
              path={routes.homePage}
              element={(
                <PrivateRoute>
                  <ChatPage />
                </PrivateRoute>
              )}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
