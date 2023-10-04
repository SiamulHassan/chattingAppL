// css
import { Grid } from "@mui/material";
import BlockUser from "../../Component/BlockUser";
import FriendRequest from "../../Component/FriendRequest/FriendRequest";
import Friend from "../../Component/Friends";
import Grouplist from "../../Component/GroupLists/Grouplist";
import MyGroup from "../../Component/MyGroup";
import Search from "../../Component/Search";
import UserList from "../../Component/UserList";
import "./style.css";
const Home = () => {
  return (
    <>
      <Grid container className="group_items">
        <Grid item xs={4} className="group_items-modify">
          {/* <div>
            <Search />
          </div> */}
          <div>
            <Grouplist />
            <FriendRequest />
          </div>
        </Grid>
        <Grid item xs={4} className="group_items-modify">
          <Friend />
          <MyGroup />
        </Grid>
        <Grid item xs={4} className="group_items-modify">
          <UserList />
          <BlockUser />
        </Grid>
      </Grid>
    </>
  );
};

export default Home;
