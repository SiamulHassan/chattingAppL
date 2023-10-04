import React, { useEffect, useRef, useState } from "react";
// css
import "./style.css";
// icons
import { HiOutlineDotsVertical } from "react-icons/hi";
import { HiOutlineEmojiHappy } from "react-icons/hi";
import { FaTelegramPlane } from "react-icons/fa";
// mui
import { Badge } from "@mui/material";
import BasicSpeedDial from "../ChatSpeedDial";
import EmojiPicker from "emoji-picker-react";
// modal image
import ModalImage from "react-modal-image";
import { useSelector } from "react-redux";
import { getDatabase, onValue, push, ref, set } from "firebase/database";
import moment from "moment/moment";
import { AudioRecorder } from "react-audio-voice-recorder";
import {
  getDownloadURL,
  getStorage,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
const Chatting = () => {
  const [showInput, setShowInput] = useState(true);
  const [audioUrl, setAudioUrl] = useState("");
  const [audioBlob, setBlob] = useState("");
  const [showImoji, setShowImoji] = useState(false);
  // setting single message
  const scrollMess = useRef(null);
  const db = getDatabase();
  const storage = getStorage();
  const currentUser = useSelector((users) => users.logIn.loggedIn);
  const activeSingleFrnd = useSelector(
    (actSingle) => actSingle.activeSingleFrnd.activeStatus
  );
  const [sendMessage, setSendMessage] = useState("");
  const [messageList, setSingleMessList] = useState([]);
  // group message
  const [groupMessList, setGroupMessList] = useState([]);
  const [groupMember, setGroupMember] = useState([]);
  const [sendGroupMess, setSendGroupMess] = useState("");
  // reading single message
  useEffect(() => {
    const readSingleMess = ref(db, "singleMessage");
    onValue(readSingleMess, (snapshot) => {
      const singleChat = [];
      snapshot.forEach((singleMessData) => {
        if (
          (singleMessData.val().whoSendId === currentUser.uid &&
            singleMessData.val().whoReceiveId === activeSingleFrnd?.id) ||
          (singleMessData.val().whoReceiveId === currentUser.uid &&
            singleMessData.val().whoSendId === activeSingleFrnd?.id)
        ) {
          singleChat.push(singleMessData.val());
        }
      });
      setSingleMessList(singleChat);
    });
  }, [activeSingleFrnd, currentUser.uid, db]);
  ////////////////////// HANDLE GROUP MESSAGE
  useEffect(() => {
    const readGroupMess = ref(db, "groupMessage");
    onValue(readGroupMess, (snapshot) => {
      const groupChat = [];
      snapshot.forEach((groupMessData) => {
        groupChat.push(groupMessData.val());
      });
      setGroupMessList(groupChat);
    });
  }, [activeSingleFrnd, currentUser.uid, db]);
  // acceptedGroups >>> group members
  useEffect(() => {
    const readgroupMembers = ref(db, "acceptedGroups");
    onValue(readgroupMembers, (snapshot) => {
      const groupMemArr = [];
      snapshot.forEach((groupMembers) => {
        groupMemArr.push(
          // concatenating- groupID + reqSender
          groupMembers.val().groupsRefID + groupMembers.val().groupReqSenderID
        );
      });
      setGroupMember(groupMemArr);
    });
  }, [activeSingleFrnd, currentUser.uid, db]);
  //// handle submit message to database
  const handleMessSubmit = () => {
    if (activeSingleFrnd.status === "single") {
      set(push(ref(db, "singleMessage")), {
        whoSendId: currentUser.uid,
        whoSendName: currentUser.displayName,
        whoReceiveId: activeSingleFrnd?.id,
        whoReceiveName: activeSingleFrnd?.name,
        message: sendMessage,
        date: `${new Date().getFullYear()} - ${
          new Date().getMonth() + 1
        } - ${new Date().getDate()}  ${new Date().getHours()}:${new Date().getMinutes()}`,
      }).then(() => {
        setSendMessage("");
      });
    } else {
      set(push(ref(db, "groupMessage")), {
        whoSendId: currentUser.uid,
        whoSendName: currentUser.displayName,
        whoReceiveId: activeSingleFrnd?.id,
        whoReceiveName: activeSingleFrnd?.name,
        adminID: activeSingleFrnd?.adminID,
        message: sendGroupMess,
        date: `${new Date().getFullYear()} - ${
          new Date().getMonth() + 1
        } - ${new Date().getDate()}  ${new Date().getHours()}:${new Date().getMinutes()}`,
      }).then(() => {
        setSendGroupMess("");
      });
    }
  };

  // handle audio record
  const addAudioElement = (blob) => {
    const url = URL.createObjectURL(blob);
    setAudioUrl(url);
    setBlob(blob);
    // const audio = document.createElement("audio");
    // audio.src = url;
    // audio.controls = true;
    // document.body.appendChild(audio);
  };
  ///////////////// HANDLE SEND AUDIO
  const handleSendAudio = () => {
    const audioStorageRef = storageRef(storage, audioUrl);
    // 'file' comes from the Blob or File API
    uploadBytes(audioStorageRef, audioBlob).then((snapshot) => {
      getDownloadURL(audioStorageRef).then((downloadURL) => {
        if (activeSingleFrnd.status === "single") {
          set(push(ref(db, "singleMessage")), {
            whoSendId: currentUser.uid,
            whoSendName: currentUser.displayName,
            whoReceiveId: activeSingleFrnd?.id,
            whoReceiveName: activeSingleFrnd?.name,
            audio: downloadURL,
            date: `${new Date().getFullYear()} - ${
              new Date().getMonth() + 1
            } - ${new Date().getDate()}  ${new Date().getHours()}:${new Date().getMinutes()}`,
          }).then(() => {
            setAudioUrl("");
          });
        } else {
          console.log("for multiSatus");
        }
      });
    });
  };

  /////////// HANDLE IMOJI
  const handleImojiClick = ({ emoji }) => {
    setSendMessage(sendMessage + emoji);
    setShowImoji(false);
  };
  ////////////// SHOW LATEST MESSAGE BY AUTO SCROLL
  useEffect(() => {
    scrollMess?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageList]);
  return (
    <>
      <div className="chatt_main">
        <div className="chatt_profile">
          <div className="chatt_profile--left">
            <Badge
              variant="dot"
              sx={{
                "& .MuiBadge-dot": {
                  top: "90%",
                  right: "19%",
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: "#00d463",
                },
              }}
            >
              <div className="profile_image">
                <picture>
                  <img src="./images/avatar.png" alt="avatar" />
                </picture>
              </div>
            </Badge>

            <div className="profile_content">
              <p className="profile_name">{activeSingleFrnd?.name}</p>

              <p className="profile_status">ProfileStatus</p>
            </div>
          </div>
          <div className="chatt_profile--right">
            <HiOutlineDotsVertical />
          </div>
        </div>

        <div className="chatt-mid-message">
          {activeSingleFrnd?.status === "single"
            ? messageList.map((mess, i) => (
                <div ref={scrollMess} key={i}>
                  {mess.whoSendId === currentUser.uid ? (
                    mess.message ? (
                      <div className="chat-sender">
                        <div className="sender-mess">
                          <p>{mess.message}</p>
                        </div>
                        <span>
                          {moment(mess.date, "YYYYMMDD hh:mm").fromNow()}
                        </span>
                      </div>
                    ) : mess.img ? (
                      <div className="chat-images-right">
                        <ModalImage small={mess.img} large={mess.img} />
                        <div>
                          <span>
                            {moment(mess.date, "YYYYMMDD hh:mm").fromNow()}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="chat-audio-right">
                        <audio
                          width="320"
                          height="240"
                          controls
                          src={mess.audio}
                        ></audio>
                        <div>
                          <span>
                            {moment(mess.date, "YYYYMMDD hh:mm").fromNow()}
                          </span>
                        </div>
                      </div>
                    )
                  ) : mess.message ? (
                    <div className="chat-receiver">
                      <div className="receiver-mess">
                        <p>{mess.message}</p>
                      </div>
                      <span>
                        {moment(mess.date, "YYYYMMDD hh:mm").fromNow()}
                      </span>
                    </div>
                  ) : mess.img ? (
                    <div className="chat-images-left">
                      <ModalImage small={mess.img} large={mess.img} />
                      <div>
                        <span>
                          {moment(mess.date, "YYYYMMDD hh:mm").fromNow()}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="chat-audio-left">
                      <audio
                        width="320"
                        height="240"
                        controls
                        src={mess.audio}
                      ></audio>
                      <div>
                        <span>
                          {moment(mess.date, "YYYYMMDD hh:mm").fromNow()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))
            : // ami jodi grp er admin hoi and kono member jodi amar group e add thake(ai check er jonno amar group id + member id kora hoise::::current user id , active group id (activesingleFrnd))>>> member and admin sees mess.
            currentUser.uid === activeSingleFrnd?.adminID ||
              groupMember.includes(activeSingleFrnd?.id + currentUser.uid)
            ? groupMessList.map((groupMess, key) => (
                <div key={key}>
                  {/* group mess er khetre: je group e message send korche se current user kina ? 'sender' >>> akhon sender kon group e send korbe tar jonno whoReceivedId(ata created groups er id) === activeSingleFrnd?id(ata je group e click korche chat korar jonno tar id:current group id) check hocche : 'receiver'*/}
                  {groupMess.whoSendId === currentUser.uid
                    ? groupMess.whoReceiveId === activeSingleFrnd?.id && (
                        <div className="chat-sender">
                          <div className="sender-mess">
                            <p>{groupMess.message}</p>
                          </div>
                          <span>
                            {moment(groupMess.date, "YYYYMMDD hh:mm").fromNow()}
                          </span>
                        </div>
                      )
                    : groupMess.whoReceiveId === activeSingleFrnd?.id && (
                        <div className="chat-receiver">
                          <div className="receiver-mess">
                            <p>{groupMess.message}</p>
                          </div>
                          <span>
                            {moment(groupMess.date, "YYYYMMDD hh:mm").fromNow()}
                          </span>
                        </div>
                      )}
                </div>
              ))
            : "not a group member"}
        </div>
        {activeSingleFrnd?.status === "single" ? (
          <div className="chat-input">
            {showInput && !audioUrl && (
              <div className="input">
                <input
                  className="messInput"
                  type="text"
                  value={sendMessage}
                  onChange={(e) => setSendMessage(e.target.value)}
                />
                <BasicSpeedDial className="input-speedDial" />
              </div>
            )}
            <div
              className="audio-recorder-div"
              onClick={() => setShowInput(!showInput)}
            >
              <AudioRecorder
                onRecordingComplete={addAudioElement}
                audioTrackConstraints={{
                  noiseSuppression: true,
                  echoCancellation: true,
                }}
              />
            </div>
            {showImoji && (
              <div className="imoji">
                <EmojiPicker onEmojiClick={handleImojiClick} />
              </div>
            )}
            <div className="imoji-icon" onClick={() => setShowImoji(!false)}>
              <HiOutlineEmojiHappy />
            </div>
            {audioUrl && (
              <div className="audio-wrapper">
                <audio className="myaudio" controls src={audioUrl}></audio>
                <div className="audio-btns">
                  <div className="send" onClick={handleSendAudio}>
                    Send
                  </div>
                  <div className="delet" onClick={() => setAudioUrl}>
                    Delet
                  </div>
                </div>
              </div>
            )}
            {showInput && !audioUrl && (
              <div className="chat-btn">
                <button type="submit" onClick={handleMessSubmit}>
                  <FaTelegramPlane />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="chat-input groupchat">
            {showInput && !audioUrl && (
              <div className="input">
                <input
                  className="messInput"
                  type="text"
                  value={sendGroupMess}
                  onChange={(e) => setSendGroupMess(e.target.value)}
                />
                <BasicSpeedDial className="input-speedDial" />
              </div>
            )}
            <div
              className="audio-recorder-div"
              onClick={() => setShowInput(!showInput)}
            >
              <AudioRecorder
                onRecordingComplete={addAudioElement}
                audioTrackConstraints={{
                  noiseSuppression: true,
                  echoCancellation: true,
                }}
              />
            </div>
            {showImoji && (
              <div className="imoji">
                <EmojiPicker onEmojiClick={handleImojiClick} />
              </div>
            )}
            <div className="imoji-icon" onClick={() => setShowImoji(!false)}>
              <HiOutlineEmojiHappy />
            </div>
            {audioUrl && (
              <div className="audio-wrapper">
                <audio className="myaudio" controls src={audioUrl}></audio>
                <div className="audio-btns">
                  <div className="send" onClick={handleSendAudio}>
                    Send
                  </div>
                  <div className="delet" onClick={() => setAudioUrl}>
                    Delet
                  </div>
                </div>
              </div>
            )}
            {showInput && !audioUrl && (
              <div className="chat-btn">
                <button type="submit" onClick={handleMessSubmit}>
                  <FaTelegramPlane />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Chatting;
