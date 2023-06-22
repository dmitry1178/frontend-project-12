/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';

const defaultChannelId = 1;
const initialState = {
  channels: [],
  currentChannelId: defaultChannelId,
};

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    setChannels: (state, { payload }) => ({ ...state, channels: payload }),
    setCurrentChannelId: (state, { payload }) => ({ ...state, currentChannelId: payload }),
    addChannel: (state, action) => {
      state.channels.push(action.payload);
      state.currentChannelId = action.payload.id;
    },
    renameChannel: (state, { payload: { id, name } }) => {
      const channel = state.channels.find((ch) => (ch.id === id));
      channel.name = name;
    },
    removeChannel: (state, action) => {
      const { id } = action.payload;
      state.channels = state.channels.filter((channel) => (channel.id !== id));
      if (state.currentChannelId === id) {
        state.currentChannelId = _.first(state.channels).id;
      }
    },
  },
});

export const { actions } = channelsSlice;
export default channelsSlice.reducer;
