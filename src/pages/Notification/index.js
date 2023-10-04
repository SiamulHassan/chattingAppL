import React, { useEffect, useState } from "react";
import "./style.css";
import { getDatabase, onValue, ref } from "firebase/database";
import { useDispatch, useSelector } from "react-redux";
import { friendReqReducer } from "../../Slice/friendReqNotification";
const Notification = () => {
  const currentUser = useSelector((users) => users.logIn.loggedIn);
  const [friReqData, setFrndReqData] = useState([]);
  const db = getDatabase();
  const dispatch = useDispatch();
  //  checkign
  useEffect(() => {
    const starCountRef = ref(db, "friendReq");
    onValue(starCountRef, (snapshot) => {
      const frndReqData = [];
      snapshot.forEach((friendData) => {
        if (currentUser.uid === friendData.val().senderID) {
          frndReqData.push({
            receiverName: friendData.val().receiverName,
            receiverID: friendData.val().receiverID,
          });
        } else {
          frndReqData.push({
            senderName: friendData.val().senderName,
            senderID: friendData.val().senderID,
          });
        }
      });
      setFrndReqData(frndReqData);
      dispatch(friendReqReducer(frndReqData));
    });
  }, [db]);
  return (
    <>
      {friReqData.map((reqData, key) => (
        <div className="friend-req" key={key}>
          <p> {reqData.senderName} send you a friend request</p>
        </div>
      ))}
    </>
  );
};

export default Notification;
