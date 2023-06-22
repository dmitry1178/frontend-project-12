import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ToastContainer } from 'react-toastify';
import InputMessages from './components/InputMessage';
import Channels from './components/Channels.jsx';
import ChatInfo from './components/ChatInfo.jsx';
import Messages from './components/Messages.jsx';
import AddChannel from './components/AddChannel';
import { loaderSelector, toDefault } from '../../redux/slices/loaderSlice.js';
import { fetchData } from '../../redux/slice/loaderSlice.js';
import { useAuthContext } from '../../context/index.js';

import Loader from './components/Loader.jsx';
import routes from '../../routes.js';
import Nav from '../Nav';
import Modal from './components/Modal.jsx';

const Chat = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const loaderState = useSelector(loaderSelector);
  const { data } = useAuthContext();
  const useAuth = useAuthContext();
  const dispatch = useDispatch();

  const disconnect = useCallback(() => {
    localStorage.clear();
    useAuth.setUserData(null);
    dispatch(toDefault());
    navigate(routes.loginPagePath());
  }, [useAuth, dispatch, navigate]);

  useEffect(() => {
    const { token } = data;
    dispatch(fetchData(token));
    if (loaderState === 401) {
      disconnect();
    }
  }, [loaderState, data, dispatch, disconnect]);

  return (
    <>
      {loaderState === 'AWAIT' && <Loader />}
      <Nav button />
      <div className="container h-100 my-4 overflow-hidden rounded shadow">
        <div className="row h-100 bg-white flex-md-row">
          <div className="col-4 col-md-2 border-end pt-5 px-0 bg-light">
            <div className="d-flex justify-content-between mb-2 ps-4 pe-2">
              <span>{t('channels.channels')}</span>
              <AddChannel />
            </div>
            <ul className="nav flex-column nav-pills nav-fill px-2">
              <Channels />
            </ul>
          </div>
          <div className="col p-0 h-100">
            <div className="d-flex flex-column h-100">
              <ChatInfo />
              <div id="messages-box" className="chat-messages overflow-auto px-5 ">
                <Messages />
              </div>
              <div className="mt-auto px-5 py-3">
                <InputMessages />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        progress={undefined}
        theme="light"
      />
    </>
  );
};

export default Chat;