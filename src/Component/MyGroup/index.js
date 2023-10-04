import {
  Alert,
  Box,
  Button,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import "./style.css";
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
const MyGroup = () => {
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
  const [groupData, SetGroupData] = useState([]);
  const db = getDatabase();
  const currentUser = useSelector((users) => users.logIn.loggedIn);
  // fetching group(me created)
  useEffect(() => {
    const starCountRef = ref(db, "groups");
    onValue(starCountRef, (snapshot) => {
      let groupDataArr = [];
      snapshot.forEach((groupData) => {
        if (currentUser.uid === groupData.val().adminID) {
          groupDataArr.push({ ...groupData.val(), groupsRefID: groupData.key });
        }
      });
      SetGroupData(groupDataArr);
    });
  }, [db, currentUser.uid]);
  // req info
  const [reqInfo, setReqInfo] = useState([]);
  // for request btn
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  // for info btn
  const [openInfo, setOpenInfo] = React.useState(false);
  const handleOpenInfo = () => setOpenInfo(true);
  const handleCloseInfo = () => setOpenInfo(false);
  // handle req
  const handleReq = (groups) => {
    // setMember(false);
    handleOpen();
    // fetching groupRequest and showing after clicking request btn
    const starCountRef = ref(db, "groupsReq");
    onValue(starCountRef, (snapshot) => {
      let groupsReqDataArr = [];
      snapshot.forEach((groupsReqData) => {
        const adminID = groupsReqData.val().groupAdminID;
        const requestedGroupID = groupsReqData.val().groupsRefID;
        if (
          currentUser.uid === adminID &&
          requestedGroupID === groups.groupsRefID
        ) {
          groupsReqDataArr.push({
            ...groupsReqData.val(),
            groupsReqRefID: groupsReqData.key,
          });
        }
      });
      setReqInfo(groupsReqDataArr);
    });
  };

  //handle accept req
  const handleAcceptReq = (reqInfo) => {
    // accept and send data to database
    set(push(ref(db, "acceptedGroups")), {
      adminID: reqInfo.groupAdminID,
      groupsRefID: reqInfo.groupsRefID,
      groupReqSenderID: reqInfo.joinSenderID,
      adminName: reqInfo.groupAdminName,
      groupReqSenderName: reqInfo.joinSenderName,
    })
      .then(() => {
        setOpen(false);
      })
      .then(() => {
        //group req
        remove(ref(db, "groupsReq/" + reqInfo.groupsReqRefID));
      });
  };
  // info of accepted groups
  const [groupInfo, setGroupInfo] = useState([]);
  // const [member, setMember] = useState(false);
  const handleMyGroupInfo = (groups) => {
    handleOpenInfo();
    // setMember(true);
    // groups gives admin ID of who created this group same data acceptedGroups e o pabo so groups para
    // fetching acceptedGroups
    const starCountRef = ref(db, "acceptedGroups");
    onValue(starCountRef, (snapshot) => {
      let acceptedGroupsDataArr = [];
      snapshot.forEach((acceptedGroupsData) => {
        const adminID = acceptedGroupsData.val().adminID;
        const requestedGroupID = acceptedGroupsData.val().groupsRefID;
        // console.log("adminID", adminID, "requestedGroupID", requestedGroupID);
        if (
          currentUser.uid === adminID &&
          requestedGroupID === groups.groupsRefID
        ) {
          acceptedGroupsDataArr.push({
            ...acceptedGroupsData.val(),
            acceptedGroupsRefID: acceptedGroupsData.key,
          });
        }
      });
      setGroupInfo(acceptedGroupsDataArr);
    });
  };
  // console.log("groupInfo", groupInfo);
  // console.log("groupData", groupData);
  return (
    <>
      <div className="MyGroup_box">
        <h3 className="MyGroup_heading">My Group </h3>
        {groupData.length === 0 ? (
          <Alert sx={{ mt: 2 }} severity="info">
            No group created yet!
          </Alert>
        ) : (
          groupData.map((groups, key) => (
            <div className="MyGroup_container" key={key}>
              <div className="MyGroup_profile-part">
                <div className="MyGroup-profile">
                  <picture>
                    <img src="./images/avatar.png" alt="av" />
                  </picture>
                </div>
                <div className="MyGroup-profile_name">
                  <p className="admin_name">
                    <span>Admin:</span> {groups.adminName}
                  </p>
                  <h4>{groups.groupName}</h4>
                  <small>{groups.groupTagName}</small>
                </div>
              </div>
              <Button
                type="button"
                className="group-btn group-btn
                group-btn--myGroup"
                variant="contained"
                sx={{ mr: 2 }}
                size="small"
                onClick={() => handleMyGroupInfo(groups)}
              >
                Info
              </Button>
              <Button
                type="button"
                className="group-btn group-btn
                group-btn--myGroup"
                variant="contained"
                size="small"
                onClick={() => handleReq(groups)}
              >
                Request
              </Button>
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
                Request Info of Your Group
              </Typography>
              {reqInfo.length === 0 ? (
                <Alert sx={{ mt: 2 }} severity="info">
                  No req yet!
                </Alert>
              ) : (
                reqInfo.map((reqInfo, key) => (
                  <div className="reqInfo" key={key}>
                    <p>Sender:{reqInfo.joinSenderName}</p>
                    <Button
                      type="button"
                      className="group-btn group-btn
               group-btn--myGroup"
                      variant="contained"
                      sx={{ mr: 2 }}
                      // onClick={() => handleReq(groups)}
                    >
                      Reject
                    </Button>
                    <Button
                      type="button"
                      className="group-btn group-btn
               group-btn--myGroup"
                      variant="contained"
                      onClick={() => handleAcceptReq(reqInfo)}
                    >
                      Accept
                    </Button>
                  </div>
                ))
              )}
            </Box>
          </Modal>

          <Modal
            open={openInfo}
            onClose={handleCloseInfo}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                see member info
              </Typography>
              {groupInfo.length === 0 ? (
                <Alert sx={{ mt: 2 }} severity="info">
                  no member yet!
                </Alert>
              ) : (
                groupInfo.map((groupInfo, key) => (
                  <div className="reqInfo" key={key}>
                    <Alert severity="info">
                      {groupInfo.groupReqSenderName}
                    </Alert>
                  </div>
                ))
              )}
            </Box>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default MyGroup;
