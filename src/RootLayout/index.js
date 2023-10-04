import { Grid } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Component/Sidebar/Sidebar";
import "./style.css";
const MenuBar = () => {
  return (
    <>
      <Grid container spacing={2}>
        <Grid className="menu_part" item xs={1}>
          <Sidebar />
        </Grid>
        <Grid className="outlet_parts" item xs={11}>
          <Outlet />
        </Grid>
      </Grid>
    </>
  );
};

export default MenuBar;
