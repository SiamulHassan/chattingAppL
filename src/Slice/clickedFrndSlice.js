import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeStatus: null,
};
export const clickedFrndSlice = createSlice({
  name: "clickedFrnd",
  initialState,
  reducers: {
    activeSliceReducer: (state, action) => {
      state.activeStatus = action.payload;
    },
  },
});
export const { activeSliceReducer } = clickedFrndSlice.actions;
export default clickedFrndSlice.reducer;

// note ::: slice (clickedFrndSlice) theke action and reducer ashbe clickedFrndSlice
