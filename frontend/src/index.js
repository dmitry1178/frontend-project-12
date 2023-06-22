import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './styles/style.css';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { io } from 'socket.io-client';
import store from './redux/slices/index.js';
import RunApp from './init';

const app = () => {
  const container = ReactDOM.createRoot(document.getElementById('chat'));
  const socket = io();
  container.render(
    <Provider store={store}>
      <RunApp socket={socket} />
    </Provider>,
  );
};

app();
