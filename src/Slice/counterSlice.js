import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  count: 0,
};
export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => {
      state.count += 1;
    },
    decrement: (state) => {
      state.count -= 1;
    },
    incrementAsWish: (state, action) => {
      state.count += action.payload;
    },
  },
});
export const { increment, decrement, incrementAsWish } = counterSlice.actions;
export default counterSlice.reducer;
