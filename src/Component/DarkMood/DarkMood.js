import React from "react";
import "./style.css";
import { Switch } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { moodReducer } from "../../Slice/darkmood";
const DarkMood = () => {
  const darkmood = useSelector((mood) => mood.darkmood.moodState);
  const dispatch = useDispatch();
  const handleDarkMood = (e) => {
    if (e.target.checked) {
      dispatch(moodReducer(true));
      // dispatch action e je value pathacchi seta localstorage e o pathabo.
      localStorage.setItem("darkmood", true);
    } else {
      dispatch(moodReducer(false));
      localStorage.setItem("darkmood", false);
    }
  };

  return (
    <div className="theme-part-nav">
      <Switch onChange={handleDarkMood} checked={darkmood} />
    </div>
  );
};

export default DarkMood;
