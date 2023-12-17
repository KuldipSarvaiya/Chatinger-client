import PropTypes from "prop-types";
import Friend from "./Friend";
// import { useEffect, useState } from "react";
import useDatas from "../DataStore/useDatas";
import { useNavigate } from "react-router-dom";
import { Badge, IconButton, Tooltip } from "@mui/material";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import GroupAddRoundedIcon from "@mui/icons-material/GroupAddRounded";

function SideBar() {
  console.log("sidebar reloaded");
  const navigate = useNavigate();
  const { Data } = useDatas();

  return (
    <div
      className={`h-full absolute left-0 top-0 pt-12 z-40 bg-yellow-500 w-64 border-r-2 overflow-auto scroll-smooth`}
      style={{ height: "100vh" }}
    >

      {/* user's name and actions */}
      <div className="bg-green-500 border-b-4 flex flex-row text-sm flex-nowrap justify-stretch items-center pl-2 ">
        {/* <Avatar /> */}
        <span
          className="uppercase grow ml-1 font-bold cursor-pointer"
          onClick={() => {
            navigate("/");
          }}
        >
          {Data.auth.name}
        </span>
        <Tooltip title="More Friends">
          <IconButton>
            <Badge
              variant="dot"
              color={
                Data.auth.friendrequests.length > 0 ? "success" : "default"
              }
            >
              <GroupAddRoundedIcon />
            </Badge>
          </IconButton>
        </Tooltip>
        <Tooltip title="Sign Out">
          <IconButton>
            <LogoutRoundedIcon />
          </IconButton>
        </Tooltip>
      </div>

      {/* friend's list */}
      {Data.chatrooms.map((friend) => (
        <Friend key={friend.id} id={friend.id} name={friend.name} />
      ))}
    </div>
  );
}

SideBar.propTypes = {
  show: PropTypes.bool,
};

export default SideBar;
