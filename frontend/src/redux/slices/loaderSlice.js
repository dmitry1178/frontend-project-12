/* eslint-disable no-param-reassign */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import routes from '../../routes';

export const fetchData = createAsyncThunk(
  'fetchData',
  async (data) => {
    const response = await axios.get(routes.dataPath(), data);
    return response.data;
  },
);

const downloadStatusSlice = createSlice({
  name: 'downloadStatus',
  initialState: { loadingStatus: 'idle', error: null },
  reducers: {
    setStatus(state) {
      state.loadingStatus = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.loadingStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchData.fulfilled, (state) => {
        state.loadingStatus = 'loaded';
        state.error = null;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.loadingStatus = 'failed';
        state.error = action.error;
      });
  },
});

export const { setStatus } = downloadStatusSlice.actions;
export const downloadStatusSelector = ((state) => state.downloadStatus);
export default downloadStatusSlice.reducer;
