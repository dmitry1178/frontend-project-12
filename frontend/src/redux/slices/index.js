import { configureStore } from '@reduxjs/toolkit';
import channelsReducer from './channelsSlice.js';
import messagesReducer from './messagesSlice.js';
import loaderSlice from './loaderSlice.js';
import modalsReducer from './modalSlice.js';

export default configureStore({
  reducer: {
    channels: channelsReducer,
    messages: messagesReducer,
    loader: loaderSlice,
    modals: modalsReducer,
  },
});
