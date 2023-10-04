import React, { useEffect, useState } from "react";
import { AiOutlineHome } from "react-icons/ai";
import { AiOutlineMessage } from "react-icons/ai";
import { IoMdNotificationsOutline } from "react-icons/io";
import { AiOutlineSetting } from "react-icons/ai";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const SidebarIcons = () => {
  const notify = useSelector((notify) => notify.frndReqNotify.friendReq);

  return (
    <>
      <div className="icons">
        <NavLink className="sidebar_icons" to="/">
          <AiOutlineHome />
        </NavLink>
        <NavLink className="sidebar_icons" to="/message">
          <AiOutlineMessage />
        </NavLink>
        <NavLink className="sidebar_icons notify" to="/notification">
          {/* {console.log(notification?.length)} */}
          {notify && <div className="nofify-count">{notify?.length}</div>}
          <IoMdNotificationsOutline />
        </NavLink>
        <NavLink className="sidebar_icons" to="/setting">
          <AiOutlineSetting />
        </NavLink>
      </div>
    </>
  );
};

export default SidebarIcons;
