import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Login from "../pages/Login";

export default function LoggedInUser() {
  const users = useSelector((user) => user.logIn.loggedIn);
  return users ? <Outlet /> : <Login />;
}
