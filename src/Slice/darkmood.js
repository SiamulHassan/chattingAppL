import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  moodState: localStorage.getItem("darkmood")
    ? JSON.parse(localStorage.getItem("darkmood"))
    : false,
};

const moodSlice = createSlice({
  name: "DarkMood",
  initialState,
  reducers: {
    moodReducer: (state, action) => {
      state.moodState = action.payload;
    },
  },
});
export const { moodReducer } = moodSlice.actions;
export default moodSlice.reducer;
