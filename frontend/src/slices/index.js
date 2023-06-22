import { combineReducers, configureStore } from '@reduxjs/toolkit';
import channelsReducer from './channelSlices.js';
import messagesReducer from './MessageSlices.js';
import modalReducer from './modalSlices.js';

const reducer = combineReducers({
  messages: messagesReducer,
  channels: channelsReducer,
  modal: modalReducer,
});

export default configureStore({
  reducer,
});
