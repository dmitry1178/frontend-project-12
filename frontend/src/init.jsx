import React from 'react';
import ReactDOM from 'react-dom/client';

import { Provider } from 'react-redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import { I18nextProvider } from 'react-i18next';
import SocketProvider from './context/socket/SocketProvider';
import store from './redux/slices/index.js';
import i18Instance from './i18n/index.js';

import App from './App.jsx';

const RunApp = ({ socket }) => {
  const lng = localStorage.getItem('language');
  if (lng) {
    i18Instance.changeLanguage(lng);
  }

  const rollbarConfig = {
    enabled: true,
    // eslint-disable-next-line no-undef
    accessToken: process.env.REACT_APP_ROLLBAR_ACCESS_TOKEN,
    captureUncaught: true,
    captureUnhandledRejections: true,
  };

  const root = ReactDOM.createRoot(document.getElementById('chat'));
  root.render(
    <Provider store={store}>
      <RollbarProvider config={rollbarConfig}>
        <ErrorBoundary>
          <I18nextProvider i18n={i18Instance}>
            <SocketProvider socket={socket}>
              <App />
            </SocketProvider>
          </I18nextProvider>
        </ErrorBoundary>
      </RollbarProvider>
    </Provider>,
  );
};

export default RunApp;
