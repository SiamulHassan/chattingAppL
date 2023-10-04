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
import { useSelector } from "react-redux";
const BlockUser = () => {
  const [blocked, setBlocked] = useState([]);
  const db = getDatabase();
  const currentUser = useSelector((users) => users.logIn.loggedIn);
  const defaultProfile = "./images/avatar.png";
  // fetching blockedUsers to show blocked users list
  useEffect(() => {
    const fetchData = ref(db, "blockedUsers");
    onValue(fetchData, (snapshot) => {
      let blockedArr = [];
      snapshot.forEach((blockedUsers) => {
        if (
          (currentUser.uid === blockedUsers.val().blockedByWhoID &&
            blockedUsers.val().whoBlockedID !== currentUser.uid) ||
          (blockedUsers.val().whoBlockedID === currentUser.uid &&
            blockedUsers.val().blockedByWhoID !== currentUser.uid)
        ) {
          if (currentUser.uid === blockedUsers.val().whoBlockedID) {
            // condition is true
            // je current user -> je block hoise
            // whoBlocked holo -> receiver
            // blockedByWho holo -> sender
            ///////////////
            // je block hocche take cuurent dhorbo...(siam dekhbe raihan ke )
            // whoBlocked....je block hocche
            ////////////
            blockedArr.push({
              //receiver jodi block hoy..taile receiver ja dekhbe ta holo
              // sender info dekhbe...sender profile holo -> blockedByWho
              blockedRefID: blockedUsers.key,
              blockedByWho: blockedUsers.val().blockedByWho,
              blockedByWhoID: blockedUsers.val().blockedByWhoID,
              blockedByWhoProfile: blockedUsers.val().blockedByWhoProfile,
            });
          } else {
            // sender jodi block hoy...taile sender ja dekhabe ta holo
            // receiver info dekhbe...receiver profile holo -> whoBlocked
            blockedArr.push({
              blockedRefID: blockedUsers.key,
              whoBlocked: blockedUsers.val().whoBlocked,
              whoBlockedID: blockedUsers.val().whoBlockedID,
              whoBlockedProfile: blockedUsers.val().whoBlockedProfile,
            });
          }
        }
      });
      setBlocked(blockedArr);
    });
  }, [db, currentUser.uid]);
  // handle unblock
  // senderID: currentUser.uid,
  // senderName: currentUser.displayName,
  // senderProfile: currentUser.photoURL,

  // receiverID: blockedUsers.id,
  // receiverName: blockedUsers.username,
  // receiverProfile: blockedUsers.profilePicture,
  const handleUnblock = (blockedUsers) => {
    //who blocked take pacchi>> receiver...(sender hobe curent user)
    // (siam sender But akhane raihan ke dekhay) tar mane receiver tai sender akhane
    // console.log("receiverrName:", blockedUsers.username);
    set(push(ref(db, "friends")), {
      // same property name hobe ja friends e chilo...(handleReq e data pabe)
      senderID: blockedUsers.whoBlockedID,
      senderName: blockedUsers.whoBlocked,
      senderProfile: blockedUsers.whoBlockedProfile,
      receiverID: currentUser.uid,
      receiverName: currentUser.displayName,
      receiverProfile: currentUser.photoURL ?? defaultProfile,
    }).then(() => {
      remove(ref(db, "blockedUsers/" + blockedUsers.blockedRefID));
    });
  };
  return (
    <div className="blockUser_box">
      <h3 className="blockUser_heading">Blocked Users</h3>
      {blocked &&
        blocked.map((blockedUser, key) => (
          <div className="blockUser_box_container" key={key}>
            <div className="blockUser_box_profile_part">
              <div className="blockUser_box_profile">
                <picture>
                  <img
                    src={
                      blockedUser.whoBlockedProfile ??
                      blockedUser.blockedByWhoProfile
                    }
                    alt="av"
                  />
                </picture>
              </div>
              <div className="blockUser_box_profile_name">
                <h4>{blockedUser.whoBlocked}</h4>
                <h4>{blockedUser.blockedByWho}</h4>
              </div>
            </div>
            <div className="btn_part">
              {/*block hoise ke seta dekho -> erpor je block hoise se ki dekte parbe seta dekho*/}
              {blockedUser.whoBlockedID && (
                <Button
                  type="submit"
                  className="group-btn"
                  variant="contained"
                  onClick={() => handleUnblock(blockedUser)}
                >
                  Unblock
                </Button>
              )}
            </div>
          </div>
        ))}
    </div>
  );
};

export default BlockUser;
