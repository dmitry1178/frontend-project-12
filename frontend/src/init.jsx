/* eslint-disable react/jsx-no-constructed-context-values */

import React from 'react';
import { Provider } from 'react-redux';
import { io } from 'socket.io-client';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ErrorBoundary, Provider as RollbarProvider } from '@rollbar/react';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import i18next from 'i18next';
import debug from 'debug';
import resources from './locales/index.js';
import App from './App.jsx';
import { actions as messagesActions } from './slices/MessageSlices.js';
import { actions as channelsActions } from './slices/channelSlices.js';
import { ChatApiContext } from './contexts/index.jsx';
import store from './slices/index.js';

const defaultLanguage = 'ru';
const socketTimeoutMs = 5000;

export default async () => {
  const i18nextInstance = i18next.createInstance();
  await i18nextInstance
    .use(initReactI18next)
    .init({
      lng: defaultLanguage,
      debug: false,
      resources,
    });
  const socket = io();
  debug(`Subscribe for socket events (socket.id=${socket.id})`);
  socket
    .on('connect', () => {
      debug(`socket "connect" id=${socket.id}`);
    })
    .on('connect', () => {
      debug('socket "connect_error"');
    })
    .on('disconnect', (reason) => {
      debug(`socket "disconnect" (${reason})`);
    })

    .on('newMessage', (payload) => {
      debug('newMessage "event"', payload);
      store.dispatch(messagesActions.addMessage(payload));
    })
    .on('newChannel', (payload) => {
      debug('newChannel "event"', payload);
      store.dispatch(channelsActions.addChannel(payload));
    })
    .on('removeChannel', (payload) => {
      debug('removeChannel "event"', payload);
      store.dispatch(channelsActions.removeChannel(payload));
    })
    .on('renameChannel', (payload) => {
      const { id, name } = payload;
      store.dispatch(channelsActions.renameChannel({ id, name }));
    });
  const getSocketEmitPromise = (...args) => new Promise((resolve, reject) => {
    socket.timeout(socketTimeoutMs).emit(...args, (err, response) => {
      if (err) reject(err);
      resolve(response);
    });
  });
  const chatApi = {
    newMessage: (...args) => getSocketEmitPromise('newMessage', ...args),
    newChannel: (...args) => getSocketEmitPromise('newChannel', ...args),
    removeChannel: (...args) => getSocketEmitPromise('removeChannel', ...args),
    renameChannel: (...args) => getSocketEmitPromise('renameChannel', ...args),
  };
  const rollbarConfig = {
    accessToken: process.env.REACT_APP_ROLLBAR_TOKEN,
    captureUncaught: true,
    environment: 'production',
  };
  return (
    <I18nextProvider i18n={i18nextInstance}>
      <RollbarProvider config={rollbarConfig}>
        <ErrorBoundary>
          <Provider store={store}>
            <ChatApiContext.Provider value={chatApi}>
              <App />
              <ToastContainer pauseOnFocusLoss={false} position="top-right" />
            </ChatApiContext.Provider>
          </Provider>
        </ErrorBoundary>
      </RollbarProvider>
    </I18nextProvider>
  );
};
