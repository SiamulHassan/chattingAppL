import { Button, TextField } from "@mui/material";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { checkMail } from "../../validation";
import "./style.css";
const ForgotPass = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const initialValues = {
    email: "",
  };
  const formik = useFormik({
    initialValues,
    validationSchema: checkMail,
    onSubmit() {
      sendPasswordResetEmail(auth, formik.values.email)
        .then(() => {
          toast.success("😎 check you mail and reset!", {
            position: "bottom-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: false,
            progress: undefined,
            theme: "light",
          });
          setTimeout(() => {
            navigate("/");
          }, 2000);
        })
        .catch((error) => {
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
          } else if (error.code.includes("auth/invalid-email")) {
            toast.error("👿 invalid email !", {
              position: "bottom-center",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: false,
              progress: undefined,
              theme: "light",
            });
          } else if (error.code.includes("auth/user-not-found")) {
            toast.error("👿 user not found", {
              position: "bottom-center",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: false,
              progress: undefined,
              theme: "light",
            });
          }
        });
    },
  });
  return (
    <>
      <ToastContainer />
      <div className="forgot-wrapper">
        <div className="innner-forget">
          <div className="forget_header">
            <h4>Reset Your Password</h4>
          </div>
          <div className="forget_form">
            <form className="reset-form" onSubmit={formik.handleSubmit}>
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
                      borderColor: "#11175d",
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#11175d",
                  },
                }}
              />
              {formik.errors.email && formik.touched.email ? (
                <p className="form-error">{formik.errors.email}</p>
              ) : null}
              <Button
                type="submit"
                className="form-btn--forget"
                variant="contained"
              >
                Reset
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPass;
