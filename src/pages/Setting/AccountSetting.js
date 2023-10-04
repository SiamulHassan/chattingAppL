import React from "react";
import "./style.css";
import { Button, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import { getAuth, updatePassword, updateProfile } from "firebase/auth";
import { getDatabase, ref, update } from "firebase/database";
import { loggedInUsers } from "../../Slice/loginSlice";

const AccountSetting = () => {
  const currentUserRedux = useSelector((users) => users.logIn.loggedIn);
  const auth = getAuth();
  const db = getDatabase();
  const dispatch = useDispatch();
  // form initial values
  const initialValues = {
    fullName: currentUserRedux.displayName,
    email: currentUserRedux.email,
    newPassword: "",
  };

  const formik = useFormik({
    initialValues,
    onSubmit() {
      handleSubmitForm();
    },
  });

  const handleSubmitForm = async () => {
    await updateProfile(auth.currentUser, {
      displayName: formik.values.fullName,
    }).then(async () => {
      const userInfo = {
        displayName: auth.currentUser.displayName,
      };
      await update(ref(db, "users/" + currentUserRedux.uid), {
        username: userInfo.displayName,
      });
      await updatePassword(auth.currentUser,formik.values.newPassword).then(()=>{
        console.log('you hacked my pass:',formik.values.newPassword)
      })
      dispatch(loggedInUsers({...currentUserRedux, displayName: formik.values.fullName }));
      localStorage.setItem( 
        "users",
        JSON.stringify({ ...currentUserRedux, displayName: formik.values.fullName })
      );
    });
  };
  return (
    <div>
      <form onSubmit={formik.handleSubmit} className="setting-from">
        <TextField
          label="Full Name"
          className="inputs-design"
          variant="outlined"
          type="text"
          name="fullName"
          value={formik.values.fullName}
          onChange={formik.handleChange}
          sx={{
            "& .MuiOutlinedInput-root.Mui-focused": {
              "& > fieldset": {
                borderColor: "#11175d",
              },
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#11175d",
            },
          }}
        />
        <TextField
          disabled
          className="inputs-design"
          label="Email"
          variant="outlined"
          type="text"
          name="email"
          value={formik.values.email}
        />
        <TextField
          className="inputs-design"
          label="New Password"
          variant="outlined"
          name="newPassword"
          type="password"
          value={formik.values.newPassword}
          onChange={formik.handleChange}
          sx={{
            "& .MuiOutlinedInput-root.Mui-focused": {
              "& > fieldset": {
                borderColor: "#11175d",
              },
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#11175d",
            },
          }}
        />
        <Button type="submit" className="form-btn" variant="contained">
          Update
        </Button>
      </form>
    </div>
  );
};

export default AccountSetting;
