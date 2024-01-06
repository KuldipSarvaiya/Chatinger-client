import PropTypes from "prop-types";
import Friend from "./Friend";
// import useDatas from "../DataStore/useDatas";
import { useNavigate } from "react-router-dom";
import {
  Badge,
  Button,
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
import { useContext, useState } from "react";
import { Context } from "../ContextProvider";

function SideBar() {
  console.log("sidebar reloaded");
  const navigate = useNavigate();
  // const { Data, removeFriendRequest, doSignOut } = useDatas();
  const { Data, removeFriendRequest, doSignOut } = useContext(Context);
  const [showModal, setShowModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchedFriendsList, setSearchedFriendsList] = useState(undefined);

  function addNewFriend(event) {
    console.log(event.target.name);
    setSearchedFriendsList((prev) => {
      return prev.filter((item) => item.id !== event.target.name);
    });
  }

  function handleFriendSearch(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    console.log(formData.get("searchred_username"));
    setIsSearching(true);
    setTimeout(() => {
      setSearchedFriendsList([
        { id: "111", username: "Kuldip Sarvaiya", name: "Kuldip Sarvaiya" },
        { id: "333", username: "Ankit Sarvaiya", name: "Ankit Sarvaiya" },
        { id: "444", username: "Rajdeep Sarvaiya", name: "Rajdeep Sarvaiya" },
        { id: "555", username: "Dharmik Sarvaiya", name: "Dharmik Sarvaiya" },
        { id: "666", username: "Vikas Sarvaiya", name: "Vikas Sarvaiya" },
        { id: "1211", username: "Kuldip Sarvaiya", name: "Kuldip Sarvaiya" },
        { id: "3233", username: "Ankit Sarvaiya", name: "Ankit Sarvaiya" },
        { id: "4244", username: "Rajdeep Sarvaiya", name: "Rajdeep Sarvaiya" },
        { id: "5255", username: "Dharmik Sarvaiya", name: "Dharmik Sarvaiya" },
        { id: "6266", username: "Vikas Sarvaiya", name: "Vikas Sarvaiya" },
        { id: "q111", username: "Kuldip Sarvaiya", name: "Kuldip Sarvaiya" },
        { id: "q333", username: "Ankit Sarvaiya", name: "Ankit Sarvaiya" },
        { id: "q444", username: "Rajdeep Sarvaiya", name: "Rajdeep Sarvaiya" },
        { id: "q555", username: "Dharmik Sarvaiya", name: "Dharmik Sarvaiya" },
        { id: "q666", username: "Vikas Sarvaiya", name: "Vikas Sarvaiya" },
        { id: "q1211", username: "Kuldip Sarvaiya", name: "Kuldip Sarvaiya" },
        { id: "q3233", username: "Ankit Sarvaiya", name: "Ankit Sarvaiya" },
        { id: "q4244", username: "Rajdeep Sarvaiya", name: "Rajdeep Sarvaiya" },
        { id: "q5255", username: "Dharmik Sarvaiya", name: "Dharmik Sarvaiya" },
        { id: "q6266", username: "Vikas Sarvaiya", name: "Vikas Sarvaiya" },
      ]);
      setIsSearching(false);
    }, 3000);
  }

  function createNewGroup(event) {
    event.preventDefault();
    setIsSearching(true);
    const formData = new FormData(event.target);
    console.log(formData.get("group_name"));
    console.log(event);
    setTimeout(() => {
      setIsSearching(false);
    }, 3000);
  }

  function cancelFriendRequest(event) {
    event.preventDefault();
    console.log("requested friend's id = ", event.target.name);
    removeFriendRequest(event.target.name);
  }

  function confirmFriendRequest(event) {
    event.preventDefault();
    console.log("requested friend's id = ", event.target.name);
    removeFriendRequest(event.target.name);
  }

  return (
    <>
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
            {Data.auth.display_name}
          </span>
          <Tooltip title="More Friends">
            <IconButton onClick={() => setShowModal(true)}>
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
            <IconButton
              onClick={() => {
                if (confirm("Are You Sure? You Want To SignOut !?")) {
                  doSignOut();
                  navigate("/signin", { replace: true });
                }
              }}
            >
              <LogoutRoundedIcon />
            </IconButton>
          </Tooltip>
        </div>

        {/* friend's list */}
        {Data.auth.chatrooms.map((friend) => (
          <Friend key={friend.id} id={friend.id} name={friend.name} />
        ))}
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
              {Data.auth.friendrequests.length > 0 && (
                <i>
                  <u>Friend Requests</u>
                </i>
              )}
              {Data.auth.friendrequests.map((data, index) => {
                return (
                  <span
                    key={index}
                    className="flex flex-row justify-between gap-3 items-center px-2 m-1 "
                  >
                    <span className="text-sm font-bold">{data.name}</span>
                    <span className="text-sm font-bold">
                      <Button
                        color="secondary"
                        variant="outlined"
                        name={data.id}
                        sx={{ padding: "0 4px", margin: 0 }}
                        onClick={confirmFriendRequest}
                      >
                        accept✅
                      </Button>
                      &nbsp; &nbsp;
                      <Button
                        color="secondary"
                        variant="outlined"
                        name={data.id}
                        sx={{ padding: "0 4px", margin: 0 }}
                        onClick={cancelFriendRequest}
                      >
                        cancel❌
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
                {searchedFriendsList.map((data, index) => {
                  return (
                    <span
                      key={index}
                      className="flex flex-row justify-between gap-3 items-center px-2 m-1 "
                    >
                      <span className="text-sm font-bold">{data.username}</span>
                      <span className="text-sm font-bold">
                        <Button
                          color="secondary"
                          variant="outlined"
                          name={data.id}
                          sx={{ padding: "0 4px", margin: 0 }}
                          onClick={addNewFriend}
                        >
                          Message
                        </Button>
                      </span>
                    </span>
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
