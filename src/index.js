import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
// firebase import
import firebaseConfig from "./DBconnection/firebaseConfig";
import "react-toastify/dist/ReactToastify.css";
// redux
import { store } from "./Store/store"; // jekhane achi sekhanei Store folder ache
import { Provider } from "react-redux";
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
