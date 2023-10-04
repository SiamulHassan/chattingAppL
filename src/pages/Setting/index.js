import React from "react";
// css
import "./style.css";
import { useSelector } from "react-redux";
import AccountSetting from "./AccountSetting";
import DarkMood from "../../Component/DarkMood/DarkMood";

const Setting = () => {
  const currentUser = useSelector((users) => users.logIn.loggedIn);
  return (
    <div>
      <div className="theme">
       <DarkMood/>
      </div>
      <div className="setting">
      <div className="setting-content">
        <div className="profile-setting">
          <img
            src={currentUser.photoURL || "./images/avatar.png"}
            loading="lazy"
            alt=""
            onError={(e) => {
              e.target.src = "./images/avatar.png";
            }}
          />
        </div>
        <AccountSetting />
      </div>
    </div>
    </div>
  );
};

export default Setting;
