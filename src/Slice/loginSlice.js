import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loggedIn: localStorage.getItem("users")
    ? JSON.parse(localStorage.getItem("users"))
    : null,
};
const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    loggedInUsers: (state, action) => {
      state.loggedIn = action.payload;
    },
  },
});
export const { loggedInUsers } = loginSlice.actions;
export default loginSlice.reducer;
