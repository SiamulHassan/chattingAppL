import { Button, Container, Grid, TextField } from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import { FaRegEyeSlash } from "react-icons/fa";
import { TfiEye } from "react-icons/tfi";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";
import { signIn } from "../../validation";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
} from "firebase/auth";
//css
import "./style.css";
import { FacebookAuthProvider } from "firebase/auth";
// actions
import { loggedInUsers } from "../../Slice/loginSlice";
import { useDispatch, useSelector } from "react-redux";
import { ref, set, getDatabase, update, onValue } from "firebase/database";
const Login = () => {
  const [showEye, setShowEye] = useState("password");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const db = getDatabase();
  const auth = getAuth();
  const googleProvider = new GoogleAuthProvider();
  // dispatch
  const dispatch = useDispatch();
  const handleEye = () => {
    showEye === "password" ? setShowEye("text") : setShowEye("password");
  };
  // form initial values
  const initialValues = {
    email: "",
    password: "",
  };
  const formik = useFormik({
    initialValues,
    validationSchema: signIn,
    onSubmit() {
      setIsLoading(true);
      signInWithEmailAndPassword(
        auth,
        formik.values.email,
        formik.values.password
      )
        .then(({ user }) => {
          if (user.emailVerified) {
            setIsLoading(false);
            dispatch(loggedInUsers(user));
            localStorage.setItem("users", JSON.stringify(user));
            navigate("/");
          } else {
            setIsLoading(false);
            toast.error("🦄 verify to procced !", {
              position: "bottom-center",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: false,
              progress: undefined,
              theme: "light",
            });
          }
        })
        .catch((error) => {
          if (error.code.includes("auth/user-not-found")) {
            toast.error("🦄 user not found !", {
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
  // current use only login korar pore e paba
  // auth curent user gives current user even if you create with traditional eaml
  console.log(" auth current user ::", auth.currentUser);
  // handle google me
  const handleGoogle = () => {
    signInWithPopup(auth, googleProvider).then(({ user }) => {
      console.log("google", user.uid);
      const starCountRef = ref(db, "users");
      onValue(starCountRef, (snapshot) => {
        let userExists = false;
        snapshot.forEach((userData) => {
          console.log("userValexists?", userData.key);
          if (userData.val().email === user.email) {
            // user exists
            userExists = true;
            set(ref(db, "users/" + userData.key), {
              username: userData.val().username,
              email: userData.val().email,
            });
            dispatch(loggedInUsers(JSON.stringify(user)));
            localStorage.setItem("users", JSON.stringify(user));
          }
        });
        if (!userExists) {
          // user does not exist so full google login
          set(ref(db, "users/" + user.uid), {
            username: user.displayName,
            email: user.email,
            bottom: null,
            test: null,
          });
          dispatch(loggedInUsers(JSON.stringify(user)));
          localStorage.setItem("users", JSON.stringify(user));
        }
      });
      //  firebase user fetch
      // navigate("/");
    });
  };

  // facebook
  const fbProvider = new FacebookAuthProvider();
  const handleFacebook = () => {
    signInWithPopup(auth, fbProvider)
      .then(({ user }) => {
        dispatch(loggedInUsers(JSON.stringify(user)));
        localStorage.setItem("users", JSON.stringify(user));
        // The signed-in user info.
        navigate("/");
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  return (
    <>
      <Container fixed>
        <ToastContainer />
        <Grid className="box" container spacing={10} style={{ marginTop: "0" }}>
          <Grid item xs={6}>
            <div className="signup-img">
              <picture>
                {/* public folder e image folder rakhle public ullekh korte hoy na */}
                <img src="./images/login.png" alt="login-png" />
              </picture>
            </div>
          </Grid>
          <Grid item xs={6}>
            <div className="forms">
              <div className="login-header">
                <div className="avatar">
                  <picture>
                    <img src="../images/avatar.png" alt="" />
                  </picture>
                </div>
                <h2>Login to your account</h2>
                <div className="auto_log">
                  <div className="google" onClick={handleGoogle}>
                    <div className="logo_part">
                      <FcGoogle className="gogle_iocn" />
                    </div>
                    <div className="text_part">
                      <p className="gogle_text">Login with Google</p>
                    </div>
                  </div>
                  <div className="google facebook" onClick={handleFacebook}>
                    <div className="logo_part">
                      <FaFacebookF className="gogle_iocn fb_icon" />
                    </div>
                    <div className="text_part">
                      <p className="gogle_text">Login with Fb</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-inputs">
                <form onSubmit={formik.handleSubmit}>
                  <TextField
                    className="inputs-design"
                    label="syeam45@gmail.com"
                    variant="outlined"
                    type="text"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    sx={{
                      "& .MuiInputLabel-root": {
                        color: "var(--fieldset-border)",
                      },
                      "& .MuiInputBase-root": {
                        color: "var(--fieldset-border)",
                      },
                      "& .MuiOutlinedInput-root.Mui-focused": {
                        "& > fieldset": {
                          borderColor: "var(--fieldset-border)",
                        },
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "var(--fieldset-border)",
                      },
                      " & fieldset": {
                        borderColor: "var(--fieldset-border)",
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
                      label="12345678"
                      variant="outlined"
                      type={showEye}
                      name="password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      sx={{
                        "& .MuiInputLabel-root": {
                          color: "var(--fieldset-border)",
                        },
                        "& .MuiInputBase-root": {
                          color: "var(--fieldset-border)",
                        },
                        "& .MuiOutlinedInput-root.Mui-focused": {
                          "& > fieldset": {
                            borderColor: "var(--fieldset-border)",
                          },
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "var(--fieldset-border)",
                        },
                        " & fieldset": {
                          borderColor: "var(--fieldset-border)",
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
                      Sign In
                    </Button>
                  )}
                </form>
                <div className="links">
                  <Link className="forgotPassword" to="/forgotPassword">
                    Forgot password ??
                  </Link>
                  <p>
                    Didn't have an account ?
                    <Link to="/registration">Sign Up</Link>
                  </p>
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Login;
