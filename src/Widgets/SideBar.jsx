import PropTypes from "prop-types";
import Friend from "./Friend";
import { useNavigate } from "react-router-dom";
import {
  Badge,
  Button,
  ButtonGroup,
  CircularProgress,
  Dialog,
  IconButton,
  Modal,
  Paper,
  TextField,
  Tooltip,
} from "@mui/material";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import GroupAddRoundedIcon from "@mui/icons-material/GroupAddRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import Diversity1RoundedIcon from "@mui/icons-material/Diversity1Rounded";
import { useContext, useEffect, useRef, useState } from "react";
import { Context } from "../ContextProvider";
import axios from "axios";
import { PrivacyTipOutlined } from "@mui/icons-material";

function SideBar() {
  console.log("sidebar reloaded");
  const navigate = useNavigate();
  const { Data, addNewChatRoom, removeFriendRequest, doSignOut } =
    useContext(Context);
  const [showModal, setShowModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchedFriendsList, setSearchedFriendsList] = useState(undefined);
  const groupMessageRef = useRef(null);

  useEffect(() => {
    const token = window.localStorage.getItem(import.meta.env.VITE_APP_STORAGE_NAME);
    if (!Data.isLoggedIn && !token) navigate("/signin", { replace: true });
  });

  function addNewFriend(event) {
    console.log(event.target.name);

    try {
      const res = axios.post("/friend/request", {
        requested_by: event.target.name,
      });
      console.log(res);
      setSearchedFriendsList((prev) => {
        return prev.filter((item) => item._id !== event.target.name);
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function handleFriendSearch(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const search = formData.get("searchred_username");
    setIsSearching(true);

    try {
      const res = await axios.get("/friend/search_by_username/" + search);
      console.log(res.data);
      if (!res.data.error && res.data.users.length > 0)
        setSearchedFriendsList(res.data.users);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSearching(false);
    }
  }

  async function createNewGroup(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const group_name = formData.get("group_name");
    groupMessageRef.current.innerHTML = "";

    if (/\s/.test(group_name)) {
      groupMessageRef.current.innerHTML =
        "Group name cannot contain whitespace characters";
      return;
    }

    setIsSearching(true);
    try {
      const res = await axios.post("/group", { group_name: group_name });
      console.log(res);
      if (!res.data.error) {
        const chatroom = res.data.chatroom[0];
        const me = {
          _id: Data.auth._id,
          username: Data.auth.username,
          display_name: Data.auth.display_name,
        };
        chatroom.members = [me];
        chatroom.admin = Data.auth._id;
        console.log("new group log", chatroom);
        
        addNewChatRoom(chatroom);
        setShowGroupModal(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSearching(false);
    }
  }

  async function manageFriendRequest(event) {
    const friend_id = event.target.dataset.friend_id;
    const status = event.target.dataset.status;

    try {
      const res = await axios.patch("/friend/request", { friend_id, status });
      console.log(res);
      if (!res.data.error) {
        if (status === "accept") {
          addNewChatRoom(res.data.chatroom);
        }
        removeFriendRequest(friend_id);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div
        className={`h-full max-h-screen absolute left-0 top-0 pt-12 z-40 bg-yellow-500 w-64 border-r-2 overflow-auto scroll-smooth`}
        style={{ height: "100vh" }}
      >
        {/* user's name and actions */}
        <div className="bg-green-500 border-b-4 mb-1 flex flex-row text-lg flex-nowrap justify-stretch items-center pl-2 ">
          <span
            className="uppercase grow ml-1 font-bold cursor-pointer"
            onClick={() => {
              navigate("/");
            }}
          >
            {Data.auth.display_name}
          </span>
          <Tooltip title="More Friends">
            <IconButton onClick={() => setShowModal(true)}>
              <Badge
                variant="dot"
                color={
                  Data?.auth?.received_friend_requests?.length > 0
                    ? "success"
                    : "default"
                }
              >
                <GroupAddRoundedIcon />
              </Badge>
            </IconButton>
          </Tooltip>
        </div>

        {/* friend's list */}
        {Data?.auth?.chatrooms
          ?.sort()
          ?.map(
            (chat) =>
              (chat?.members?.length > 1 || chat?.type === "group") && (
                <Friend
                  key={chat._id}
                  id={chat._id}
                  name={
                    chat.display_name ||
                    chat.members.filter(({ _id }) => _id !== Data.auth._id)[0]
                      .display_name
                  }
                  username={
                    chat.members.filter((mem) => mem._id !== Data.auth._id)[0]
                      ?.username
                  }
                  last_message=""
                />
              )
          )}
        <div className="absolute grid grid-cols-1 bottom-0 left-0 w-full">
          <ButtonGroup size="large" variant="contained" color="inherit">
            <Tooltip title="Privacy Policy">
              <Button>
                <IconButton
                  onClick={() => {
                    navigate("/privacy-policy");
                  }}
                  size="small"
                >
                  <PrivacyTipOutlined />
                  <span className="text-lg font-mono font-semibold">POLICY</span>
                </IconButton>
              </Button>
            </Tooltip>
            <Tooltip title="Sign Out">
              <Button>
                <IconButton
                  onClick={() => {
                    if (confirm("Are You Sure? You Want To SignOut !?")) {
                      doSignOut();
                      navigate("/signin", { replace: true });
                    }
                  }}
                  size="small"
                >
                  <span className="text-lg font-mono font-semibold">SIGNOUT</span>
                  <LogoutRoundedIcon />
                </IconButton>
              </Button>
            </Tooltip>
          </ButtonGroup>
        </div>
      </div>

      {/* new friends modal */}
      <Modal
        open={showModal}
        onClose={() => {
          setShowModal(false);
        }}
      >
        <Paper
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            padding: 2,
            width: {
              xs: "90%",
              sm: "70%",
              md: "600px",
              lg: "700px",
              xl: "700px",
            },
            boxShadow: "inset 0px 0px 10px 3px black,5px 5px 30px white",
            backgroundColor: "#22c55e",
            height: {
              xs: "70%",
              sm: "60%",
              md: "500px",
              lg: "500px",
              xl: "500px",
            },
          }}
          className="flex flex-col gap-2"
        >
          {/* close modal sign - X */}
          <span className="self-end">
            <IconButton
              size="small"
              color="error"
              // sx={{ bgcolor: "red" }}
              onClick={() => {
                setShowModal(false);
              }}
            >
              <CloseRoundedIcon />
            </IconButton>
          </span>

          {/* search username */}
          <form onSubmit={handleFriendSearch}>
            <span className="flex gap-2">
              <TextField
                type="search"
                label="Search Friend with Username"
                variant="filled"
                name="searchred_username"
                size="small"
                color="secondary"
                fullWidth
                disabled={isSearching}
                required
              />
              <IconButton
                type="submit"
                disabled={isSearching}
                size="large"
                sx={{ bgcolor: "rgba(0, 0, 0, 0.1)" }}
              >
                <SearchRoundedIcon />
              </IconButton>
            </span>
          </form>

          {/* new group button */}
          <span>
            <Button
              disabled={isSearching}
              variant="contained"
              color="secondary"
              size="small"
              onClick={() => setShowGroupModal(true)}
            >
              <Diversity1RoundedIcon />
              &nbsp;Create New Group
            </Button>
          </span>

          {/* horizontal seperator line */}
          <center>
            <hr width="96%" />
          </center>

          <span className="overflow-auto">
            {/* friend request */}
            <span>
              {Data?.auth?.received_friend_requests?.length > 0 && (
                <i>
                  <u>Friend Requests</u>
                </i>
              )}
              {Data?.auth?.received_friend_requests?.map((data) => {
                return (
                  <span
                    key={data._id}
                    className="flex flex-row justify-between gap-3 items-center px-2 m-1 "
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-bold capitalize">
                        {data.display_name}
                      </span>
                      <span className="text-xs font-normal lowercase">
                        {data.username}
                      </span>
                    </div>
                    <span className="text-sm font-bold">
                      <Button
                        color="secondary"
                        variant="outlined"
                        data-friend_id={data._id}
                        data-status={"accept"}
                        sx={{ padding: "0 4px", margin: 0 }}
                        onClick={manageFriendRequest}
                      >
                        accept✅
                      </Button>
                      &nbsp; &nbsp;
                      <Button
                        color="secondary"
                        variant="outlined"
                        data-friend_id={data._id}
                        data-status={"reject"}
                        sx={{ padding: "0 4px", margin: 0 }}
                        onClick={manageFriendRequest}
                      >
                        reject❌
                      </Button>
                    </span>
                  </span>
                );
              })}
            </span>

            {/* loading circle */}
            {isSearching && (
              <center className="m-auto">
                <CircularProgress color="secondary" />
              </center>
            )}

            {/* search found friend's result list */}
            {searchedFriendsList !== undefined && (
              <span>
                <br />
                {searchedFriendsList && searchedFriendsList.length > 0 && (
                  <i>
                    <u>Search Results</u>
                  </i>
                )}
                {searchedFriendsList.map((data) => {
                  return (
                    <div
                      key={data._id}
                      className="flex flex-row justify-between gap-3 items-center px-2 m-1 border-l-[5px] rounded-l-lg border-gray-900/50"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-bold capitalize">
                          {data.display_name}
                        </span>
                        <span className="text-xs font-normal lowercase">
                          {data.username}
                        </span>
                      </div>
                      <span className="text-sm font-bold">
                        <Button
                          color="secondary"
                          variant="outlined"
                          name={data._id}
                          sx={{ padding: "0 4px", margin: 0 }}
                          onClick={addNewFriend}
                        >
                          Request
                        </Button>
                      </span>
                    </div>
                  );
                })}
              </span>
            )}
          </span>
        </Paper>
      </Modal>

      {/* creating new group dialog */}
      <Dialog onClose={() => setShowGroupModal(false)} open={showGroupModal}>
        <form onSubmit={createNewGroup}>
          <span className="bg-yellow-500 flex flex-col gap-2 p-2">
            <span className="self-end">
              <IconButton
                size="small"
                color="error"
                // sx={{ bgcolor: "red" }}
                onClick={() => {
                  setShowGroupModal(false);
                }}
              >
                <CloseRoundedIcon />
              </IconButton>
            </span>
            <TextField
              type="text"
              label="Enter Group Name"
              name="group_name"
              variant="filled"
              color="success"
              fullWidth
              required
            />
            <span ref={groupMessageRef} className="text-red-500 text-xs"></span>
            <Button
              variant="contained"
              type="submit"
              color="secondary"
              size="small"
              disabled={isSearching}
            >
              {isSearching ? (
                <CircularProgress color="inherit" />
              ) : (
                "Create Group"
              )}
            </Button>
          </span>
        </form>
      </Dialog>
    </>
  );
}

SideBar.propTypes = {
  show: PropTypes.bool,
};

export default SideBar;
