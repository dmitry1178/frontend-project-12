/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { fetchData } from './loaderSlice.js';

const channelsSlice = createSlice({
  name: 'channels',
  initialState: { channels: [], currentChannelId: 1 },
  reducers: {
    addChannel(state, { payload }) {
      if (state.channels.some((channel) => channel.id === payload.id)) {
        return;
      }
      state.channels.push(payload);
    },
    changeChannel(state, { payload }) {
      state.currentChannelId = payload.id;
    },
    deleteChannel(state, { payload }) {
      const newChannels = state.channels.filter((channel) => channel.id !== payload.id);
      state.channels = newChannels;
      if (payload.id === state.currentChannelId) {
        state.currentChannelId = 1;
      }
    },
    renameChannel(state, { payload }) {
      state.channels = state.channels.reduce((acc, channel) => {
        const curentName = channel.id === payload.id ? payload.name : channel.name;
        return [...acc, { ...channel, name: curentName }];
      }, []);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.fulfilled, (state, { payload }) => {
        const { channels, currentChannelId } = payload;
        state.channels = channels;
        state.currentChannelId = currentChannelId;
      });
  },
});

export const {
  addChannel,
  changeChannel,
  deleteChannel,
  renameChannel,
} = channelsSlice.actions;
export const channelsSelector = ((state) => state.channels);
export default channelsSlice.reducer;
