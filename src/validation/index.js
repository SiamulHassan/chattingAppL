import * as Yup from "yup";

export const signUp = Yup.object({
  fullName: Yup.string().min(3).max(13).required("type your name"),

  email: Yup.string().required("you missed email field"),
  password: Yup.string().required("you missed pass field"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "did not macth")
    .required("you should comfirm pass"),
});
export const signIn = Yup.object({
  email: Yup.string().required("you missed email field"),
  password: Yup.string().required("you missed pass field"),
});
export const checkMail = Yup.object({
  email: Yup.string().required("email required !"),
});
