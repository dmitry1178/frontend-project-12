/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { fetchData } from './loaderSlice.js';
import { deleteChannel } from './channelsSlice.js';

const messagesSlice = createSlice({
  name: 'messages',
  initialState: { messages: [] },
  reducers: {
    addMessage(state, { payload }) {
      state.messages.push(payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.fulfilled, (state, { payload }) => {
        state.messages = payload.messages;
      });
    builder
      .addCase(deleteChannel, (state, { payload }) => {
        const newList = state.messages.filter((message) => message.channelId !== payload.id);
        state.messages = newList;
      });
  },
});

export const { addMessage, removeMessages } = messagesSlice.actions;
export const messagesSelector = ((state) => state.messages);
export const dataChatSelector = ((state) => {
  const curentMessages = state.messages.messages
    .filter((message) => message.channelId === state.channels.currentChannelId);
  const curentChannel = state.channels.channels
    .find((channel) => channel.id === state.channels.currentChannelId);
  return { curentMessages, curentChannel };
});
export default messagesSlice.reducer;
