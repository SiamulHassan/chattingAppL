import { Button } from "@mui/material";
import {
  getDatabase,
  onValue,
  push,
  ref,
  remove,
  set,
} from "firebase/database";
import React, { useEffect, useState } from "react";

//css
import "./style.css";
import { useSelector } from "react-redux";
const FriendRequest = () => {
  const db = getDatabase();
  const currentUser = useSelector((users) => users.logIn.loggedIn);
  const [showReq, setShowReq] = useState([]);
  //showing frnd req to the >> Friend Request
  useEffect(() => {
    const starCountRef = ref(db, "friendReq");
    onValue(starCountRef, (snapshot) => {
      let friendArr = [];
      snapshot.forEach((friendData) => {
        if (currentUser.uid === friendData.val().receiverID) {
          friendArr.push({ ...friendData.val(), freienIdsID: friendData.key });
        }
      });
      setShowReq(friendArr);
    });
  }, [db, currentUser.uid]);
  // fetching profile url
  const handleAccept = (friends) => {
    set(push(ref(db, "friends")), {
      ...friends,
    }).then(() => {
      remove(ref(db, "friendReq/" + friends.freienIdsID));
    });
  };
  // reject request
  const handleReject = (rejFrnd) => {
    remove(ref(db, "friendReq/" + rejFrnd.freienIdsID));
  };
  return (
    <>
      <div className="friend_box">
        <h3 className="firend_heading">Friend Request</h3>
        {showReq &&
          showReq.map((requestList, key) => (
            <div className="friend_container" key={key}>
              {/* {console.log("FriendReq requestList", requestList)} */}
              <div className="friend_profile-part">
                <div className="friend-profile">
                  <picture>
                    <img
                      src={requestList.senderProfile || "./images/avatar.png"}
                      alt="avatar"
                      onError={(e) => {
                        e.target.src = "./images/avatar.png";
                      }}
                    />
                  </picture>
                </div>
                <div className="friend-profile_name">
                  <h4>{requestList.senderName}</h4>
                </div>
              </div>
              <div className="btn_part">
                <div>
                  <Button
                    type="submit"
                    className="group-btn"
                    variant="contained"
                    onClick={() => handleAccept(requestList)}
                  >
                    Accept
                  </Button>
                </div>
                <div>
                  <Button
                    type="submit"
                    className="btn--reject"
                    variant="contained"
                    onClick={() => handleReject(requestList)}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default FriendRequest;
