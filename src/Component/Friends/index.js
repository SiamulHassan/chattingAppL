import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import "./style.css";
import {
  getDatabase,
  onValue,
  push,
  ref,
  remove,
  set,
} from "firebase/database";
import { useDispatch, useSelector } from "react-redux";
import { activeSliceReducer } from "../../Slice/clickedFrndSlice";

const Friend = () => {
  const [frndList, setFrndList] = useState([]);
  const db = getDatabase();
  const currentUser = useSelector((users) => users.logIn.loggedIn);
  const dispatch = useDispatch();
  // fetching friends to show friend list
  useEffect(() => {
    const fetchData = ref(db, "friends");
    onValue(fetchData, (snapshot) => {
      let frndArr = [];
      snapshot.forEach((acceptedFriends) => {
        if (
          (currentUser.uid === acceptedFriends.val().senderID &&
            acceptedFriends.val().receiverID !== currentUser.uid) ||
          (currentUser.uid === acceptedFriends.val().receiverID &&
            acceptedFriends.val().senderID !== currentUser.uid)
        ) {
          //// Only add to friend list, if the friend is not the current user
          frndArr.push({
            ...acceptedFriends.val(),
            friendsRefId: acceptedFriends.key,
          });
        }
      });
      setFrndList(frndArr);
    });
  }, [db, currentUser.uid]);

  // handle Block
  const handleBlock = (friends) => {
    // friends : sender(raihan)->senderProfile e ache>>>>receiver(siam)->receiverProfile e ache
    // if sender blocks>>send receiver info
    if (currentUser.uid === friends.senderID) {
      // curr jodi Raihan hoy + sender
      set(push(ref(db, "blockedUsers")), {
        //:::: SENDER BLOCK KORTESE> sender gets receiver info>>sender dekhbe
        whoBlocked: friends.receiverName,
        whoBlockedID: friends.receiverID,
        whoBlockedProfile: friends.receiverProfile,
        // PREV.CODE ::: receiverProfile: friends.senderProfile, senderProfile: friends.receiverProfile,
        //receiver profile hobe je sent korche
        // receiver gets
        blockedByWho: friends.senderName,
        blockedByWhoID: friends.senderID,
        blockedByWhoProfile: friends.senderProfile,
        // profile;;BOTH PROFILE NEEDED;akta bad dile onnota ar pabe na
      }).then(() => {
        remove(ref(db, "friends/" + friends.friendsRefId));
      });
    } else {
      //:::: RECEIVER BLOCK KORTESE> receiver gets SENDER info
      set(push(ref(db, "blockedUsers")), {
        //receiver gets
        whoBlocked: friends.senderName,
        whoBlockedID: friends.senderID,
        whoBlockedProfile: friends.senderProfile,
        //sender gets
        blockedByWho: friends.receiverName,
        blockedByWhoID: friends.receiverID,
        blockedByWhoProfile: friends.receiverProfile,
        // profile;;BOTH PROFILE NEEDED;;;akta bad dile onnota ar pabe na
      }).then(() => {
        remove(ref(db, "friends/" + friends.friendsRefId));
      });
    }
  };
  // handle unfriend
  const handleUnfriend = (friends) => {
    remove(ref(db, "friends/" + friends.friendsRefId));
  };
  // handle clicked friend
  const activeFrndData = (data) => {
    if (currentUser.uid === data.receiverID) {
      // then dispatch sender info
      dispatch(
        activeSliceReducer({
          status: "single",
          name: data.senderName,
          id: data.senderID,
        })
      );
    } else {
      // then dispatch receiver info
      dispatch(
        activeSliceReducer({
          status: "single",
          name: data.receiverName,
          id: data.receiverID,
        })
      );
    }
    // console.log("clickedFrnd", clickedFrndData);
  };
  return (
    <div className="friend-block_box">
      <h3 className="friend-block_heading">Friends</h3>
      {frndList.map((friends, key) => (
        <div
          className="friend-block_container"
          key={key}
          onClick={() => activeFrndData(friends)}
        >
          <div className="friend-block-profile_part">
            <div className="friend-block-profile">
              {currentUser.uid === friends.receiverID ? (
                <picture>
                  <img
                    src={friends.senderProfile}
                    alt="avatar"
                    onError={(e) => {
                      e.target.src = "./images/avatar.png";
                    }}
                  />
                </picture>
              ) : (
                <picture>
                  <img
                    src={friends.receiverProfile}
                    alt="avatar"
                    onError={(e) => {
                      e.target.src = "./images/avatar.png";
                    }}
                  />
                </picture>
              )}
            </div>
            <div className="friend-block-profile_name">
              <h4>
                {currentUser.uid === friends.senderID
                  ? friends.receiverName
                  : friends.senderName}
              </h4>
            </div>
          </div>
          <div className="btn_part">
            <div>
              <Button
                type="button"
                className="group-btn"
                variant="contained"
                onClick={() => handleBlock(friends)}
              >
                Block
              </Button>
            </div>
            <div>
              <Button
                type="button"
                className="btn--unfriend"
                variant="contained"
                onClick={() => handleUnfriend(friends)}
              >
                Unfriend
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Friend;
