import React, { useState } from "react";
import Container from "@mui/material/Container";
import { Button, Grid } from "@mui/material";
import TextField from "@mui/material/TextField";
// icons
import { TfiEye } from "react-icons/tfi";
import { FaRegEyeSlash } from "react-icons/fa";
//formik
import { useFormik } from "formik";
import "./style.css";
// sign up validation
import { signUp } from "../../validation";
import { PulseLoader } from "react-spinners";
// authentication
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const Registration = () => {
  const db = getDatabase();
  const [showEye, setShowEye] = useState("password");
  const [isLoading, setIsLoading] = useState(false);
  // navigate (comes from react router dom)
  const navigate = useNavigate();
  // firebase auth
  const auth = getAuth();
  const handleEye = () => {
    showEye === "password" ? setShowEye("text") : setShowEye("password");
  };
  // form initial values
  const initialValues = {
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const formik = useFormik({
    initialValues,
    validationSchema: signUp,
    onSubmit() {
      setIsLoading(true);
      createUserWithEmailAndPassword(
        auth,
        formik.values.email,
        formik.values.password
      )
        .then(({ user }) => {
          console.log("userrrr", user);
          updateProfile(auth.currentUser, {
            displayName: formik.values.fullName,
          }).then(() => {
            setIsLoading(false);
            sendEmailVerification(auth.currentUser)
              .then(() => {
                set(ref(db, "users/" + user.uid), {
                  username: user.displayName,
                  email: user.email,
                });
              })
              .then(() => {
                toast.success("😎 check you mail and verify!", {
                  position: "bottom-center",
                  autoClose: 2000,
                  hideProgressBar: false,
                  closeOnClick: false,
                  pauseOnHover: false,
                  progress: undefined,
                  theme: "light",
                });
                formik.resetForm();
                setIsLoading(false);
                setTimeout(() => {
                  navigate("/login");
                }, 2000);
              });
          });
        })
        .catch((error) => {
          console.log(error.message);
          if (error.code.includes("auth/email-already-in-use")) {
            toast.error("👿 email already is in use !", {
              position: "bottom-center",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: false,
              progress: undefined,
              theme: "light",
            });
            setIsLoading(false);
          }
        });
    },
  });

  return (
    <>
      <Container fixed>
        <ToastContainer />
        <Grid
          style={{ alignItems: "center", height: "105vh" }}
          container
          spacing={6}
        >
          <Grid item xs={6}>
            <div className="forms">
              <div className="reg-header">
                <h2>Get started with easily register</h2>
                <p>Free register and you can enjoy it</p>
              </div>
              <div className="form-inputs">
                <form onSubmit={formik.handleSubmit}>
                  {formik.errors.fullName && formik.touched.fullName ? (
                    // <p className="form-error">{formik.errors.fullName}</p>
                    <TextField
                      error
                      label={formik.errors.fullName}
                      className="inputs-design"
                      variant="outlined"
                      type="text"
                      name="fullName"
                      value={formik.values.fullName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      // transform this with create or makeStyle
                      sx={{
                        "& .MuiOutlinedInput-root.Mui-focused": {
                          "& > fieldset": {
                            borderColor: "var(--fieldset-border)",
                          },
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "var(--fieldset-border)",
                        },
                      }}
                    />
                  ) : (
                    <TextField
                      className="inputs-design"
                      label="Full Name"
                      variant="outlined"
                      type="text"
                      name="fullName"
                      value={formik.values.fullName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      sx={{
                        "& .MuiOutlinedInput-root.Mui-focused": {
                          "& > fieldset": {
                            borderColor: "var(--fieldset-border)",
                          },
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "var(--fieldset-border)",
                        },
                        "&:hover fieldset": {
                          borderColor: "var(--fieldset-border) !important",
                        },
                      }}
                    />
                  )}
                  <TextField
                    className="inputs-design"
                    label="Email"
                    variant="outlined"
                    type="text"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    sx={{
                      "& .MuiOutlinedInput-root.Mui-focused": {
                        "& > fieldset": {
                          borderColor: "var(--fieldset-border)",
                        },
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "var(--fieldset-border)",
                      },
                      "&:hover fieldset": {
                        borderColor: "var(--fieldset-border) !important",
                      },
                    }}
                  />
                  {formik.errors.email && formik.touched.email ? (
                    <p className="form-error">{formik.errors.email}</p>
                  ) : null}
                  <div className="password">
                    <TextField
                      className="inputs-design"
                      label="Password"
                      variant="outlined"
                      type={showEye}
                      name="password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      sx={{
                        "& .MuiOutlinedInput-root.Mui-focused": {
                          "& > fieldset": {
                            borderColor: "var(--fieldset-border)",
                          },
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "var(--fieldset-border)",
                        },
                        "&:hover fieldset": {
                          borderColor: "var(--fieldset-border) !important",
                        },
                      }}
                    />
                    {formik.errors.password && formik.touched.password ? (
                      <p className="form-error">{formik.errors.password}</p>
                    ) : null}
                    <div className="eye-closed" onClick={handleEye}>
                      {showEye === "password" ? <FaRegEyeSlash /> : <TfiEye />}
                    </div>
                  </div>
                  <TextField
                    className="inputs-design"
                    label="Confirm password"
                    variant="outlined"
                    type="password"
                    name="confirmPassword"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    sx={{
                      "& .MuiOutlinedInput-root.Mui-focused": {
                        "& > fieldset": {
                          borderColor: "var(--fieldset-border)",
                        },
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "var(--fieldset-border)",
                      },
                      "&:hover fieldset": {
                        borderColor: "var(--fieldset-border) !important",
                      },
                    }}
                  />
                  {formik.errors.confirmPassword &&
                  formik.touched.confirmPassword ? (
                    <p className="form-error">
                      {formik.errors.confirmPassword}
                    </p>
                  ) : null}

                  {isLoading ? (
                    <Button
                      disabled
                      type="submit"
                      className="form-btn"
                      variant="contained"
                    >
                      <PulseLoader color="#fff" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="form-btn"
                      variant="contained"
                    >
                      Sign Up
                    </Button>
                  )}
                </form>
                <div className="links">
                  <p>
                    Already have an account ? <Link to="/login">Sign In</Link>{" "}
                  </p>
                </div>
              </div>
            </div>
          </Grid>
          <Grid item xs={6}>
            <div className="signup-img">
              <picture>
                {/* public folder e image folder rakhle public ullekh korte hoy na */}
                <img src="./images/reg-png.png" alt="registration-png" />
              </picture>
            </div>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Registration;
