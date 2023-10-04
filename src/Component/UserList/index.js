import Search from "../Search";
import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import "./style.css";
// firebase
import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  remove,
  update,
} from "firebase/database";
import { useSelector } from "react-redux";
import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
} from "firebase/storage";

const UserList = () => {
  const db = getDatabase();
  const storage = getStorage();
  const currentUser = useSelector((users) => users.logIn.loggedIn);
  // all userlist except current
  const [userlist, setUserlist] = useState([]);
  const [friendReq, setFriendReq] = useState([]);
  const [cancel, setCancel] = useState([]);
  const [frndList, setFrndList] = useState([]);
  // jekhanei currentUser.photoURL use korcho sekhanei ?? diye defaultProfile dity hobe
  const defaultProfile = "./images/avatar.png";
  //fetching userlist
  useEffect(() => {
    const fetchUsers = ref(db, "users");
    onValue(fetchUsers, (snapshot) => {
      let usersArr = [];
      snapshot.forEach((users) => {
        if (currentUser.uid !== users.key) {
          getDownloadURL(storageRef(storage, users.key))
            .then((url) => {
              usersArr.push({
                ...users.val(),
                id: users.key,
                profilePicture: url,
              });
            })
            .catch((error) => {
              usersArr.push({
                ...users.val(),
                id: users.key,
                profilePicture: null,
              });
            })
            .then(() => {
              setUserlist([...usersArr]);
            });
        }
      });
    });
  }, [db, storage, currentUser.uid]);

  // sent request -> handle friend request
  const handleRequest = (users) => {
    // userlist >> current user bad diye baki user ra
    set(push(ref(db, "friendReq")), {
      senderID: currentUser.uid,
      senderName: currentUser.displayName,
      receiverID: users.id,
      receiverName: users.username,
      // getting profile of each current user>>:::
      senderProfile: currentUser.photoURL ?? defaultProfile,
      receiverProfile: users.profilePicture ?? defaultProfile,
    });
  };
  //
  // friendReq theke fetch kora>> (checking if they are friends) for btn: cancel
  useEffect(() => {
    const starCountRef = ref(db, "friendReq");
    onValue(starCountRef, (snapshot) => {
      let friendArr = [];
      snapshot.forEach((friendData) => {
        friendArr.push(friendData.val().receiverID + friendData.val().senderID);
      });
      setFriendReq(friendArr);
    });
  }, [db]);

  //click:: cancle request::::::
  useEffect(() => {
    const starCountRef = ref(db, "friendReq");
    onValue(starCountRef, (snapshot) => {
      const cancelFrnd = [];
      snapshot.forEach((friendData) => {
        cancelFrnd.push({ ...friendData.val(), id: friendData.key });
      });
      setCancel(cancelFrnd);
    });
  }, [db]);

  // handle cancel request
  const handleCancel = (friendId) => {
    remove(ref(db, "friendReq/" + friendId));
  };

  //accept req AND showing friedns btn (checking if they are friends) -> fetching form friends
  useEffect(() => {
    const fetchData = ref(db, "friends");
    onValue(fetchData, (snapshot) => {
      let frndArr = [];
      snapshot.forEach((acceptedFriends) => {
        frndArr.push(
          acceptedFriends.val().receiverID + acceptedFriends.val().senderID
        );
      });
      setFrndList(frndArr);
    });
  }, [db]);

  // showing block btn (checking if they are friends)
  const [checkFrndBlock, setCheckFrndList] = useState([]);
  useEffect(() => {
    const fetchData = ref(db, "blockedUsers");
    onValue(fetchData, (snapshot) => {
      let checkArr = [];
      snapshot.forEach((blockedUsers) => {
        checkArr.push(
          blockedUsers.val().whoBlockedID + blockedUsers.val().blockedByWhoID
        );
      });
      setCheckFrndList(checkArr);
    });
  }, [db, currentUser.uid]);
  const [filter, setFilter] = useState([]);
  const [matched, setNotMatched] = useState(true);
  const handleSearch = (searchVal) => {
    const matched = userlist.filter((users) =>
      users.username.toLowerCase().includes(searchVal.toLowerCase())
    );
    const unMatched = userlist.some((users) =>
      users.username.toLowerCase().includes(searchVal.toLowerCase())
    );
    setNotMatched(unMatched);
    setFilter(matched);
  };
  return (
    <>
      <div className="UserList_box">
        <Search handleSearch={handleSearch} />
        <h3 className="UserList_heading">User List</h3>

        {!matched ? (
          <p style={{ color: "var(--black)" }}>Nothing matched</p>
        ) : !filter.length ? (
          userlist.map((userlists, key) => (
            <div className="UserList_container" key={key}>
              <div className="UserList-profile_part">
                <div className="UserList-profile">
                  <picture>
                    <img
                      src={userlists.profilePicture || "./images/avatar.png"}
                      onError={(e) => {
                        e.target.src = "./images/avatar.png";
                      }}
                      alt=""
                    />
                  </picture>
                </div>
                <div className="UserList-profile_name">
                  <h4>{userlists.username}</h4>
                </div>
              </div>
              <div className="btn_part">
                {checkFrndBlock.includes(currentUser.uid + userlists.id) ||
                checkFrndBlock.includes(userlists.id + currentUser.uid) ? (
                  <Button
                    type="submit"
                    className="group-btn"
                    variant="contained"
                    disabled
                  >
                    Blocked
                  </Button>
                ) : frndList.includes(userlists.id + currentUser.uid) ||
                  frndList.includes(currentUser.uid + userlists.id) ? (
                  <Button
                    type="submit"
                    className="group-btn"
                    variant="contained"
                    disabled
                  >
                    Friends
                  </Button>
                ) : friendReq.includes(userlists.id + currentUser.uid) ||
                  friendReq.includes(currentUser.uid + userlists.id) ? (
                  <Button
                    type="submit"
                    className="group-btn"
                    variant="contained"
                    onClick={() =>
                      handleCancel(
                        cancel.find(
                          (frndData) =>
                            //frndData holo frndReq obj. so condition match korle sei matched obj return korbe amra akhane pura obj return na kore just sei obj er id return kortechi
                            frndData.receiverID === userlists.id &&
                            frndData.senderID === currentUser.uid
                        )?.id
                      )
                    }
                  >
                    Cancel Request
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="group-btn"
                    variant="contained"
                    onClick={() => handleRequest(userlists)}
                  >
                    Sent Request
                  </Button>
                )}
              </div>
            </div>
          ))
        ) : (
          filter.length > 0 &&
          filter.map((filteredUsers, key) => (
            <div className="UserList_container" key={key}>
              <div className="UserList-profile_part">
                <div className="UserList-profile">
                  <picture>
                    <img
                      src={
                        filteredUsers.profilePicture || "./images/avatar.png"
                      }
                      onError={(e) => {
                        e.target.src = "./images/avatar.png";
                      }}
                      alt=""
                    />
                  </picture>
                </div>
                <div className="UserList-profile_name">
                  <h4>{filteredUsers.username}</h4>
                </div>
              </div>
              <div className="btn_part">
                {checkFrndBlock.includes(currentUser.uid + filteredUsers.id) ||
                checkFrndBlock.includes(filteredUsers.id + currentUser.uid) ? (
                  <Button
                    type="submit"
                    className="group-btn"
                    variant="contained"
                    disabled
                  >
                    Blocked
                  </Button>
                ) : frndList.includes(filteredUsers.id + currentUser.uid) ||
                  frndList.includes(currentUser.uid + filteredUsers.id) ? (
                  <Button
                    type="submit"
                    className="group-btn"
                    variant="contained"
                    disabled
                  >
                    Friends
                  </Button>
                ) : friendReq.includes(filteredUsers.id + currentUser.uid) ||
                  friendReq.includes(currentUser.uid + filteredUsers.id) ? (
                  <Button
                    type="submit"
                    className="group-btn"
                    variant="contained"
                    onClick={() =>
                      handleCancel(
                        cancel.find(
                          (frndData) =>
                            //frndData holo frndReq obj. so condition match korle sei matched obj return korbe amra akhane pura obj return na kore just sei obj er id return kortechi
                            frndData.receiverID === filteredUsers.id &&
                            frndData.senderID === currentUser.uid
                        ).id
                      )
                    }
                  >
                    Cancel Request
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="group-btn"
                    variant="contained"
                    onClick={() => handleRequest(filteredUsers)}
                  >
                    Sent Request
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default UserList;
//userlist
// userlist.map((userlists, key) => (
//   <div className="UserList_container" key={key}>
//     <div className="UserList-profile_part">
//       <div className="UserList-profile">
//         <picture>
//           <img
//             src={
//               userlists.profilePicture ||
//               "./images/avatar.png"
//             }
//             onError={(e) => {
//               e.target.src = "./images/avatar.png";
//             }}
//             alt=""
//           />
//         </picture>
//       </div>
//       <div className="UserList-profile_name">
//         <h4>{userlists.username}</h4>
//       </div>
//     </div>
//     <div className="btn_part">
//       {checkFrndBlock.includes(
//         currentUser.uid + userlists.id
//       ) ||
//       checkFrndBlock.includes(
//         userlists.id + currentUser.uid
//       ) ? (
//         <Button
//           type="submit"
//           className="group-btn"
//           variant="contained"
//           disabled
//         >
//           Blocked
//         </Button>
//       ) : frndList.includes(userlists.id + currentUser.uid) ||
//         frndList.includes(currentUser.uid + userlists.id) ? (
//         <Button
//           type="submit"
//           className="group-btn"
//           variant="contained"
//           disabled
//         >
//           Friends
//         </Button>
//       ) : friendReq.includes(
//           userlists.id + currentUser.uid
//         ) ||
//         friendReq.includes(currentUser.uid + userlists.id) ? (
//         <Button
//           type="submit"
//           className="group-btn"
//           variant="contained"
//           onClick={() =>
//             handleCancel(
//               cancel.find(
//                 (frndData) =>
//                   //frndData holo frndReq obj. so condition match korle sei matched obj return korbe amra akhane pura obj return na kore just sei obj er id return kortechi
//                   frndData.receiverID === userlists.id &&
//                   frndData.senderID === currentUser.uid
//               ).id
//             )
//           }
//         >
//           Cancel Request
//         </Button>
//       ) : (
//         <Button
//           type="submit"
//           className="group-btn"
//           variant="contained"
//           onClick={() => handleRequest(userlists)}
//         >
//           Sent Request
//         </Button>
//       )}
//     </div>
//   </div>
// ))
