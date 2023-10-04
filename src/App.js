import Registration from "./pages/Registration";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import LoggedInUser from "./privateRouter/LoggedUser";
import NotLoggedIn from "./privateRouter/notLoggedUser";
import ForgotPass from "./pages/ForgotPassword";
import MenuBar from "./RootLayout";
import Message from "./pages/Message";
import Notification from "./pages/Notification";
import Setting from "./pages/Setting";
import Counter from "./Component/Counter/CounterT";
import { useSelector } from "react-redux";
function App() {
  const darkmood = useSelector((mood) => mood.darkmood.moodState);
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route element={<LoggedInUser />}>
          <Route element={<MenuBar />}>
            <Route path="/" element={<Home />}></Route>
            <Route path="/notification" element={<Notification />}></Route>
            <Route path="/message" element={<Message />}></Route>
            <Route path="/setting" element={<Setting />}></Route>
            <Route path="/count" element={<Counter />}></Route>
          </Route>
        </Route>
        <Route element={<NotLoggedIn />}>
          <Route path="/registration" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgotPassword" element={<ForgotPass />} />
        </Route>
      </Route>
    )
  );

  return (
    <div className={darkmood ? "dark" : ""}>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
