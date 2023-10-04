import React, { useRef, useState } from "react";
//mui
import "./style.css";
import Box from "@mui/material/Box";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
//icons
import { AiFillAudio } from "react-icons/ai";
import { BiVideo } from "react-icons/bi";
import { AiOutlineCamera } from "react-icons/ai";
import { BsEmojiSmile } from "react-icons/bs";
import { AiFillCloseCircle } from "react-icons/ai";
import { TfiGallery } from "react-icons/tfi";
//camera
import Camera from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";
import Gallery from "../Gallery";
import { useSelector } from "react-redux";
import { getDatabase, push, ref, set } from "firebase/database";
import {
  getDownloadURL,
  getStorage,
  uploadString,
  ref as sref,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
const actions = [
  { icon: <AiFillAudio />, name: "audio" },
  { icon: <BiVideo />, name: "video" },
  { icon: <AiOutlineCamera />, name: "camera" },
  { icon: <BsEmojiSmile />, name: "emoji" },
  { icon: <TfiGallery />, name: "gallery" },
];

const BasicSpeedDial = () => {
  const galleryRef = useRef(null);
  const currentUser = useSelector((users) => users.logIn.loggedIn);
  const activeSingleFrnd = useSelector(
    (actSingle) => actSingle.activeSingleFrnd.activeStatus
  );
  const [capturePhoto, setCapturePhoto] = useState("");
  const [camOpen, setCamOpen] = useState(false);
  const storage = getStorage();
  const db = getDatabase();
  const handleChatIcon = (iconsAction) => {
    if (iconsAction.name === "audio") {
      //didn't used
    }
    if (iconsAction.name === "camera") {
      setCamOpen(true);
    }
    if (iconsAction.name === "video") {
      console.log("dataIconsName : you clicked video");
    }
    if (iconsAction.name === "gallery") {
      galleryRef.current.click();
    }
  };
  // handle capture
  const handlePhotoTaken = (dataUri) => {
    setCapturePhoto(dataUri);
    const storageRef = sref(
      storage,
      `captureSendImage/${currentUser.displayName}=${
        currentUser.uid
      }/${uuidv4()}`
      //remember: uuidv4 is a function
    );
    uploadString(storageRef, dataUri, "data_url").then(() => {
      getDownloadURL(storageRef).then((downloadURL) => {
        set(push(ref(db, "singleMessage")), {
          whoSendId: currentUser.uid,
          whoSendName: currentUser.displayName,
          whoReceiveId: activeSingleFrnd.id,
          whoReceiveName: activeSingleFrnd.name,
          img: downloadURL,
          date: `${new Date().getFullYear()} - ${
            new Date().getMonth() + 1
          } - ${new Date().getDate()}  ${new Date().getHours()}:${new Date().getMinutes()}`,
        });
        setCamOpen(false);
      });
    });
  };

  return (
    <>
      {camOpen && (
        <div className="cam_position">
          <div className="closeIcon">
            <AiFillCloseCircle onClick={() => setCamOpen(false)} />
          </div>
          <Camera
            onTakePhoto={(dataUri) => {
              handlePhotoTaken(dataUri);
            }}
          />
        </div>
      )}
      <Box sx={{ height: 0, transform: "translateZ(0px)", flexGrow: 1 }}>
        <SpeedDial
          ariaLabel="SpeedDial basic example"
          sx={{
            position: "absolute",
            bottom: 4,
            right: -38,
            "& .MuiSpeedDial-fab": {
              width: "30px",
              height: "30px",
              minHeight: "30px",
              backgroundColor: "var(--primary-color)",
            },
            "& .MuiSpeedDial-fab:hover": {
              backgroundColor: "#4b55c2",
            },
          }}
          icon={<SpeedDialIcon />}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={() => handleChatIcon(action)}
            />
          ))}
        </SpeedDial>
      </Box>
      <Gallery galleryRef={galleryRef} />
    </>
  );
};

export default BasicSpeedDial;
