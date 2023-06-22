import store from '../../redux/slices/index.js';
import { addChannel, deleteChannel, renameChannel } from '../../redux/slices/channelsSlice.js';
import { addMessage } from '../../redux/slices/messagesSlice.js';

const buildChatAPI = (socket) => {
  socket.on('newMessage', (payload) => {
    store.dispatch(addMessage(payload));
  });

  socket.on('newChannel', (payload) => {
    store.dispatch(addChannel(payload));
  });

  socket.on('removeChannel', (payload) => {
    store.dispatch(deleteChannel(payload));
  });

  socket.on('renameChannel', (payload) => {
    store.dispatch(renameChannel(payload));
  });

  const addNewMessage = (props, resolve) => {
    socket.emit('newMessage', props, ({ status }) => {
      if (status) {
        resolve();
      }
    });
  };

  const addNewChannel = (props, resolve) => {
    socket.emit('newChannel', props, ({ status }) => {
      if (status) {
        resolve();
      }
    });
  };

  const removeChannel = (props, resolve) => {
    socket.emit('removeChannel', props, ({ status }) => {
      if (status) {
        resolve();
      }
    });
  };

  const renameChannelName = (props, resolve) => {
    socket.emit('renameChannel', props, ({ status }) => {
      if (status) {
        resolve();
      }
    });
  };

  return {
    addNewMessage,
    addNewChannel,
    removeChannel,
    renameChannelName,
  };
};

export default buildChatAPI;
