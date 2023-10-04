import React, { useState } from "react";
import { SlLogout } from "react-icons/sl";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loggedInUsers } from "../../Slice/loginSlice";
import "./Sidebar.css";
import SidebarIcons from "./SidebarIcons";
import { getAuth, signOut } from "firebase/auth";
import { ModalSideBar } from "../Modal/Modal";

const Sidebar = () => {
  const dispatch = useDispatch();
  const user = useSelector((users) => users.logIn.loggedIn);

  const navigate = useNavigate();
  const auth = getAuth();
  const handleLogOut = () => {
    signOut(auth)
      .then(() => {
        // local storage theke remove hobe but redux theke remove hobe na
        localStorage.removeItem("users");
        dispatch(loggedInUsers(null));
        navigate("/");
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  const [open, setOpen] = useState(false);
  const handleModalOpen = () => {
    setOpen(true);
  };

  return (
    <>
      <div className="sidebar">
        <div className="sidebar_wrapper">
          <div className="sidebar_profile">
            <div className="profile_picture" onClick={handleModalOpen}>
              <picture>
                <img
                  src={user.photoURL || "./images/avatar.png"}
                  onError={(e) => {
                    e.target.src = "./images/avatar.png";
                  }}
                  alt=""
                />
              </picture>
              <div className="profile_overlay">
                <AiOutlineCloudUpload />
              </div>
            </div>
          </div>
          <div className="displayName">
            <h3>{user.displayName}</h3>
          </div>
          <div className="other_pages">
            <SidebarIcons />
          </div>
          <div className="logout" onClick={handleLogOut}>
            <SlLogout />
          </div>
        </div>
      </div>
      <ModalSideBar open={open} setOpen={setOpen} />
    </>
  );
};

export default Sidebar;
