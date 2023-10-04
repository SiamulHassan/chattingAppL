import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "../Slice/loginSlice";
import counterRed from "../Slice/counterSlice";
import actFrnd from "../Slice/clickedFrndSlice";
import freindReqRed from "../Slice/friendReqNotification";
import DarkMood from "../Slice/darkmood";
// import loginSlice === authSlice from "../Slice/loginSlice";
export const store = configureStore({
  reducer: {
    logIn: loginReducer,
    counter: counterRed,
    activeSingleFrnd: actFrnd,
    frndReqNotify: freindReqRed,
    darkmood: DarkMood,
  },
});

// reducer: slice import hobe and configure sote kora lagbe
