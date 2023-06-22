/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const modalSlice = createSlice({
  name: 'modals',
  initialState: { type: null, isShow: false, idChannel: null },
  reducers: {
    activeModal: (state, { payload }) => {
      state.isShow = payload.isShow;
      state.type = payload.type;
      state.idChannel = payload.idChannel;
    },
  },
});

export const { activeModal, setIdChannel } = modalSlice.actions;
export const modalsSelector = ((state) => state.modals);
export default modalSlice.reducer;
