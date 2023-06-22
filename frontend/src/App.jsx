import React from 'react';
import {
  BrowserRouter, Navigate, Route, Routes, Outlet,
} from 'react-router-dom';
import Chat from './pages/chat/Chat';
import Login from './pages/login/Login';
import NotFoundPage from './pages/NotFoundPage';
import Signup from './pages/signup/Signup';

import { useAuthContext } from './context/index.js';
import AuthProvider from './context/AuthProvider';
import routes from './routes.js';

const PrivateRoute = () => {
  const authContext = useAuthContext();
  return authContext.data ? <Outlet /> : <Navigate to={routes.loginPagePath()} />;
};

const AuthRoute = () => {
  const authContext = useAuthContext();
  return authContext.data ? <Navigate to={routes.rootPagePath()} /> : <Outlet />;
};

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path={routes.rootPagePath()} element={<PrivateRoute />}>
          <Route path={routes.rootPagePath()} element={<Chat />} />
        </Route>
        <Route path={routes.loginPagePath()} element={<AuthRoute />}>
          <Route path={routes.loginPagePath()} element={<Login />} />
        </Route>
        <Route path={routes.singUpPagePath()} element={<AuthRoute />}>
          <Route path={routes.singUpPagePath()} element={<Signup />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
