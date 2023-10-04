import {
  Alert,
  Backdrop,
  Box,
  Button,
  Fade,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import {
  getDatabase,
  ref,
  set,
  push,
  onValue,
  remove,
} from "firebase/database";
import { ButtonBase } from "@mui/material";
import React, { useEffect, useState } from "react";
import "./style.css";
import { useSelector } from "react-redux";
const Grouplist = () => {
  const db = getDatabase();
  const currentUser = useSelector((users) => users.logIn.loggedIn);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [groupInfo, setGroupInfo] = useState({
    groupName: "",
    groupTagName: "",
  });
  const [showOtherGroup, SetOtherGroup] = useState([]);
  // name and value add koror input e
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  const handleGroup = (e) => {
    const { value, name } = e.target;
    setGroupInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleCreateGroup = () => {
    set(push(ref(db, "groups")), {
      ...groupInfo,
      // admin holo je use group create kortese
      adminName: currentUser.displayName,
      adminID: currentUser.uid,
    }).then(() => {
      setOpen(false);
    });
  };
  // fetching group(me created)
  useEffect(() => {
    const starCountRef = ref(db, "groups");
    onValue(starCountRef, (snapshot) => {
      let groupDataArr = [];
      snapshot.forEach((groupData) => {
        if (currentUser.uid !== groupData.val().adminID) {
          groupDataArr.push({ ...groupData.val(), groupsRefID: groupData.key });
        }
      });
      SetOtherGroup(groupDataArr);
    });
  }, [db, currentUser.uid]);

  // handle join req
  const handleJoinGroup = (groupData) => {
    // console.log("joinData", groupData);
    set(push(ref(db, "groupsReq")), {
      groupsRefID: groupData.groupsRefID,
      groupAdminID: groupData.adminID,
      groupAdminName: groupData.adminName,
      joinSenderID: currentUser.uid,
      joinSenderName: currentUser.displayName,
    });
  };
  // showing cancle btn
  const [groupReq, setGroupReq] = useState([]);
  useEffect(() => {
    const starCountRef = ref(db, "groupsReq");
    onValue(starCountRef, (snapshot) => {
      let groupReqDataArr = [];
      snapshot.forEach((groupReqData) => {
        groupReqDataArr.push(
          groupReqData.val().groupAdminID +
            groupReqData.val().joinSenderID +
            groupReqData.val().groupsRefID
        );
      });
      setGroupReq(groupReqDataArr);
    });
  }, [db, currentUser.uid]);
  // fetching groupReqData
  const [cancel, setCancel] = useState([]);
  useEffect(() => {
    const starCountRef = ref(db, "groupsReq");
    onValue(starCountRef, (snapshot) => {
      let groupReqDataArr = [];
      snapshot.forEach((groupReqData) => {
        groupReqDataArr.push({
          ...groupReqData.val(),
          groupReqRef: groupReqData.key,
        });
      });
      setCancel(groupReqDataArr);
    });
  }, [db, currentUser.uid]);
  // handle cancel request
  const handleCancleReq = (id) => {
    console.log("got", id);
    remove(ref(db, "groupsReq/" + id));
  };
  //show memeber instedd of pending
  const [member, setMember] = useState([]);
  useEffect(() => {
    const starCountRef = ref(db, "acceptedGroups");

    onValue(starCountRef, (snapshot) => {
      let acceptedGroupsDataArr = [];
      snapshot.forEach((acceptedGroupsData) => {
        // console.log("snap acceptedGroups", acceptedGroupsData.val());
        acceptedGroupsDataArr.push(
          acceptedGroupsData.val().adminID +
            acceptedGroupsData.val().groupReqSenderID
        );
      });
      setMember(acceptedGroupsDataArr);
    });
  }, [db, currentUser.uid]);
  return (
    <div className="group_box">
      <div className="group_heading">
        <h3 className="group_heading">Group Lists</h3>
        <ButtonBase
          type="button"
          className="group-btn create_group--btn"
          variant="contained"
          onClick={handleOpen}
          sx={{
            color: "#fff",
            borderRadius: "5px",
          }}
        >
          Create Group
        </ButtonBase>
      </div>
      {showOtherGroup.length === 0 ? (
        <Alert sx={{ mt: 2 }} severity="info">
          No group created yet!
        </Alert>
      ) : (
        showOtherGroup.map((otherGroup, key) => (
          <div className="list_container" key={key}>
            <div className="profile_part">
              <div className="profile">
                <picture>
                  <img src="./images/avatar.png" alt="av" />
                </picture>
              </div>
              <div className="profile_name">
                <p className="admin_name">
                  {/* {console.log("otherGroupAID", otherGroup.adminID)} */}
                  <span>Admin:</span> {otherGroup.adminName}
                </p>
                <h4>{otherGroup.groupName}</h4>
                <small>{otherGroup.groupTagName}</small>
              </div>
            </div>
            <div className="btn_part">
              {/* {console.log("GOT?", otherGroup.adminID)}
              {console.log("GOT?", currentUser.uid)} */}
              {groupReq.includes(
                otherGroup.adminID + currentUser.uid + otherGroup.groupsRefID
              ) ? (
                <Button
                  type="button"
                  className="group-btn"
                  variant="contained"
                  onClick={() =>
                    handleCancleReq(
                      cancel.find(
                        (reqGpData) =>
                          reqGpData.groupAdminID === otherGroup.adminID &&
                          reqGpData.joinSenderID === currentUser.uid &&
                          reqGpData.groupsRefID === otherGroup.groupsRefID
                      ).groupReqRef
                    )
                  }
                >
                  {/* akhane cancel o koro + join hole joined*/}
                  Cancel
                </Button>
              ) : member.includes(currentUser.uid + otherGroup.adminID) ||
                member.includes(otherGroup.adminID + currentUser.uid) ? (
                <Button
                  type="button"
                  className="group-btn"
                  variant="contained"
                  disabled
                >
                  {/* akhane cancel o koro + join hole joined*/}
                  Joined
                </Button>
              ) : (
                <Button
                  type="button"
                  className="group-btn"
                  variant="contained"
                  onClick={() => handleJoinGroup(otherGroup)}
                >
                  {/* akhane cancel o koro + join hole joined*/}
                  Join
                </Button>
              )}
            </div>
          </div>
        ))
      )}

      <div className="div">
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Create New Group
            </Typography>

            <TextField
              id="outlined-basic"
              label="Group Name"
              variant="outlined"
              margin="normal"
              fullWidth
              name="groupName"
              value={groupInfo.groupName}
              onChange={(e) => handleGroup(e)}
            />
            <TextField
              id="outlined-basic"
              label="Group Tagline"
              variant="outlined"
              margin="normal"
              fullWidth
              name="groupTagName"
              value={groupInfo.groupTagName}
              onChange={(e) => handleGroup(e)}
            />
            <Button
              type="button"
              className="group-btn"
              variant="contained"
              onClick={handleCreateGroup}
            >
              Create Group
            </Button>
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default Grouplist;
