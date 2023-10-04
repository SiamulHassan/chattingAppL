import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  friendReq: null,
};

const friendReqSlice = createSlice({
  name: "friendReq",
  initialState,
  reducers: {
    friendReqReducer: (state, action) => {
      state.friendReq = action.payload;
    },
  },
});
export const { friendReqReducer } = friendReqSlice.actions;
export default friendReqSlice.reducer;
