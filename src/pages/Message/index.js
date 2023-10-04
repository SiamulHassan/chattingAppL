import React, { useEffect, useInsertionEffect, useState } from "react";
// css
import "./style.css";
// mui
import { Button, Grid } from "@mui/material";
//components
import Friend from "../../Component/Friends";
// firebase
import { getDatabase, onValue, ref } from "firebase/database";
import Chatting from "../../Component/Chatting";
import { useDispatch, useSelector } from "react-redux";
import { activeSliceReducer } from "../../Slice/clickedFrndSlice";
import Lottie from "lottie-react";
import ltttieAnimationConversation from "../../lottie/conversation.json";
const Message = () => {
  /////////////////////////////////////////////
  // STATES
  const activeSingleFrnd = useSelector(
    (actSingle) => actSingle.activeSingleFrnd.activeStatus
  );

  const [allGroup, setShowAllGroup] = useState([]);
  /////////////////////////////////////////////
  // FIREBASE
  const db = getDatabase();
  const dispatch = useDispatch();
  /////////////////////////////////////////////
  // FETCHING GROUP
  useEffect(() => {
    const fetchGroup = ref(db, "groups");
    onValue(fetchGroup, (snapshot) => {
      let groupArr = [];
      snapshot.forEach((groupData) => {
        groupArr.push({ ...groupData.val(), groupRefKey: groupData.key });
      });
      setShowAllGroup(groupArr);
    });
  }, [db]);
  /////////////////////////// HANDLE ACTIVE GROUPS
  const handleActiveGroup = (allgroups) => {
    dispatch(
      activeSliceReducer({
        status: "group",
        name: allgroups.groupName,
        adminID: allgroups.adminID,
        id: allgroups.groupRefKey,
      })
    );
  };
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <div className="allgroup-block_box">
            <h3 className="allgroup-block_heading">All Groups</h3>
            {allGroup &&
              allGroup.map((groups, key) => (
                <div
                  className="allgroup-block_container"
                  key={key}
                  onClick={() => handleActiveGroup(groups)}
                >
                  <div className="allgroup-profile_part">
                    <div className="allgroup-profile">
                      <picture>
                        <img src="./images/avatar.png" alt="av" />
                      </picture>
                    </div>
                    <div className="profile_name">
                      <h4>{groups.groupName}</h4>
                      <small>{groups.groupTagName}</small>
                    </div>
                  </div>
                  <div className="btn_part">
                    <Button
                      type="button"
                      className="group-btn"
                      variant="contained"
                    >
                      Message
                    </Button>
                  </div>
                </div>
              ))}
          </div>
          <Friend />
        </Grid>
        <Grid item xs={8}>
          {activeSingleFrnd?.status === "single" ||
          activeSingleFrnd?.status === "group" ? (
            <Chatting />
          ) : (
            <div>
              <p className="chat-heading">
                Click Group or Friends to Start Conversation
              </p>
              <div className="lottie-animation">
                <Lottie
                  animationData={ltttieAnimationConversation}
                  loop={true}
                />
              </div>
            </div>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default Message;
