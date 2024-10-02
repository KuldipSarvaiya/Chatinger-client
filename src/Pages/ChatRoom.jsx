import { useNavigate, useParams } from "react-router-dom";
import Message from "../Widgets/Message";
import { Avatar, Button, IconButton, Modal, Paper } from "@mui/material";
import CloseFullscreenRoundedIcon from "@mui/icons-material/CloseFullscreenRounded";
import { useContext, useEffect, useRef, useState } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import PersonRemoveAlt1Icon from "@mui/icons-material/PersonRemoveAlt1";
import VideoChatIcon from "@mui/icons-material/VideoChat";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import LogoutIcon from "@mui/icons-material/Logout";
import { Context } from "../ContextProvider";
import axios from "axios";
import UpdateIcon from "@mui/icons-material/Update";
// import useDatas from "../DataStore/useDatas";

function ChatRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [msgList, setMsgList] = useState([]);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const msg = useRef(null);
  const lastKeyPressed = useRef(null);
  const messagesRef = useRef(null);
  const oldMessagesFetched = useRef(false);
  // const { Data } = useDatas();
  const { Data, removeChatRoom } = useContext(Context);
  const chat = Data?.auth?.chatrooms?.filter(({ _id }) => _id === roomId)[0];

  console.log("chatroom reloaded", roomId);
  const name = chat?.members.filter(({ _id }) => _id !== Data.auth._id)[0]
    .display_name;
  const type = chat?.members.filter(({ _id }) => _id !== Data.auth._id)[0].type;

  useEffect(() => {
    // reset messages when room changed
    if (msgList.length > 0) setMsgList([]);

    const messageListener = (message) => {
      console.log("Message received from server = ", message);
      setMsgList((prev) => [
        ...prev,
        { _id: Date.now(), isMyMessage: false, message },
      ]);
      scrollDown();
    };

    if (Data.socket !== null) {
      console.log(`\n******now i'll try to join ${roomId}`);
      Data.socket.emit("join_room", { room: roomId });
      Data.socket.on("messageToClient", messageListener);

      Data.socket.emit("retriveMessages", {
        room: roomId,
        payload: {
          chatroom_id: roomId,
          skip: 0,
          take: 100,
        },
      });
    }

    return () => {
      console.log(`\n********leaving room ${roomId}`);
      Data.socket.off("messageToClient", messageListener);
      Data.socket.emit("leave_room", { room: roomId });
    };
  }, [Data.socket, roomId]);

  // effect to load first messages
  useEffect(() => {
    const listMessages = (data) => {
      console.log("Listing message");
      console.log(data);
      const convertedData = data.map((item) => {
        return {
          _id: item._id,
          message: item.text,
          isMyMessage: item.sent_by._id === Data.auth._id,
          deliveredAt: item.deliveredAt,
        };
      });
      if (!oldMessagesFetched.current) {
        setMsgList((prev) => [...prev, ...convertedData]);
        scrollDown();
      }
      oldMessagesFetched.current = true;
    };

    if (Data.socket) {
      Data.socket.on("listMessages", listMessages);
      if (oldMessagesFetched.current === false)
        Data.socket.emit("retriveMessages", {
          room: roomId,
          payload: {
            chatroom_id: roomId,
            skip: 0,
            take: 100,
          },
        });
    }

    return () => {
      Data.socket.off("listMessages", listMessages);
      oldMessagesFetched.current = false;
    };
  }, [Data.socket, roomId]);

  function sendMessage() {
    if (!msg.current.value) return;

    Data.socket.emit("messageToServer", {
      room: roomId,
      message: msg.current.value,
      sent_by: Data.auth._id,
    });

    setMsgList((prev) => [
      ...prev,
      { isMyMessage: true, message: msg.current.value },
    ]);
    scrollDown();
  }

  function scrollDown() {
    if (msgList.length < 0) return;
    setTimeout(() => {
      messagesRef.current.lastChild.scrollIntoView({
        behavior: "smooth",
        inline: "end",
      });
      msg.current.focus();
      msg.current.value = null;
    }, 0);
  }

  function removeGroupMember(event) {
    event.preventDefault();
    console.log(event.target.name);
  }

  function inviteGroupMember(event) {
    event.preventDefault();
    console.log(event.target.name);
  }

  function deleteGroup() {
    console.log("iam deleting group");
  }

  async function removeFriend() {
    try {
      const res = await axios.delete("/friend?chatroom_id=" + roomId);
      console.log(res);

      if (!res.data.error) {
        removeChatRoom(roomId);
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function clearChats() {
    try {
      const res = await axios.delete("/friend/clear_chats/" + roomId);
      if (!res.data.error) {
        Data.socket.emit("retriveMessages", {
          room: roomId,
          payload: {
            chatroom_id: roomId,
            skip: 0,
            take: 100,
          },
        });
        setMsgList([]);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <section className="h-full p-2 max-sm:p-1 w-full flex flex-col relative gap-1">
        {/* friend's detail navbar */}
        <span className="p-2 rounded-lg w-full bg-red-500 flex items-center h-12 text-2xl font-medium max-sm:text-lg gap-0 uppercase flex-row flex-nowrap min-h-fit">
          <span className="hidden md:inline">
            <Avatar
              variant="circular"
              sx={{ bgcolor: "transparent", border: "2px dashed black" }}
            >
              {name.indexOf(" ") !== -1
                ? name.split(" ")[0].charAt(0) + name.split(" ")[1].charAt(0)
                : name.split(" ")[0].charAt(0)}
            </Avatar>
          </span>
          <span className="grow -md:text-lg -lg:text-lg whitespace-nowrap">
            {name}
          </span>

          <IconButton title="private video chat" onClick={() => {}}>
            <VideoChatIcon />
          </IconButton>
          {type === "group" ? (
            <>
              {chat?.admin === Data.auth._id && (
                <IconButton
                  title="add member to group"
                  onClick={() => setShowGroupModal(true)}
                >
                  <PersonAddAlt1RoundedIcon />
                </IconButton>
              )}
              <IconButton
                title="exit group chat"
                onClick={() => {}}
                className="rotate-180"
              >
                <LogoutIcon />
              </IconButton>
            </>
          ) : (
            <IconButton title="remove friend" onClick={removeFriend}>
              <PersonRemoveAlt1Icon />
            </IconButton>
          )}
          <IconButton title="Clear Chat" onClick={clearChats}>
            <UpdateIcon />
          </IconButton>
          <IconButton title="Close Chat" onClick={() => navigate("/")}>
            <CloseFullscreenRoundedIcon />
          </IconButton>
        </span>

        {/* message display */}
        <section
          className="w-full flex flex-col overflow-y-auto overflow-x-hidden grow"
          ref={messagesRef}
        >
          {/* image that displayed when no messages are send or received */}
          {msgList.length < 1 && (
            <span className="flex-1 grid place-content-center">
              <img
                src="assets/message_notification.png"
                alt=""
                className="drop-shadow-[0_25px_50px_rgba(255,255,255,1)] "
              />
            </span>
          )}
          {msgList.map((message) => {
            return (
              <Message
                key={message._id}
                isMyMessage={message.isMyMessage}
                message={message.message}
              />
            );
          })}
        </section>

        {/* send message space */}
        <span className="flex flex-row gap-0 w-full justify-center items-center">
          <textarea
            className="w-3/4 text-slate-700 max-md:w-11/12 rounded-s-md outline-none text-xl resize-none px-1 border-b-4 border-blue-500"
            placeholder="Type Your Message..."
            ref={msg}
            onKeyDownCapture={(e) => {
              if (e.key === "Enter" && lastKeyPressed.current !== "Shift")
                sendMessage();
              lastKeyPressed.current = e.key;
            }}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-xl font-mono p-3 px-4 rounded-e-md h-full uppercase disabled:bg-blue-800 disabled:shadow-none disabled:bg-transparent"
            disabled={msg === ""}
          >
            <SendRoundedIcon />
          </button>
        </span>
      </section>

      {/* group member managing dialog */}
      <Modal open={showGroupModal} onClose={() => setShowGroupModal(false)}>
        <Paper
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            padding: "5px 10px",
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
          {/* close modal button */}
          <span className="flex justify-end">
            <IconButton
              size="small"
              color="error"
              onClick={() => {
                setShowGroupModal(false);
              }}
            >
              <CloseRoundedIcon />
            </IconButton>
          </span>

          {/* group members and remove member */}
          <spam className="overflow-auto">
            <u>
              <i>Group Members</i>
            </u>
            <center>
              <h1>
                <i>----//-- 0.0 Members Are In This Group --//----</i>
              </h1>
            </center>
            <span
              key={"index"}
              className="flex flex-row justify-between gap-3 items-center px-2 m-1 "
            >
              <span className="text-sm font-bold">{"data.username"}</span>
              <span className="text-sm font-bold">
                <Button
                  color="secondary"
                  variant="outlined"
                  name={"data.id"}
                  sx={{ padding: "0 4px", margin: 0 }}
                  onClick={removeGroupMember}
                >
                  Remove Member ❌
                </Button>
              </span>
            </span>

            {/* invite friends list */}
            <br />
            <u>
              <i>Invite Friends To Group</i>
            </u>
            <center>
              <h1>
                <i>----//-- No Friend Left To Invite To Group --//----</i>
              </h1>
            </center>
            <span
              key={"index"}
              className="flex flex-row justify-between gap-3 items-center px-2 m-1 "
            >
              <span className="text-sm font-bold">{"data.username"}</span>
              <span className="text-sm font-bold">
                <Button
                  color="secondary"
                  variant="outlined"
                  name={"data.id"}
                  sx={{ padding: "0 4px", margin: 0 }}
                  onClick={inviteGroupMember}
                >
                  Invite🔀
                </Button>
              </span>
            </span>
          </spam>

          {/* delete group button */}
          <span className="w-full text-center pt-8">
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={deleteGroup}
            >
              <DeleteForeverIcon />
              &nbsp;Delete Group Permenetly&nbsp;
              <DeleteForeverIcon />
            </Button>
          </span>
        </Paper>
      </Modal>
    </>
  );
}

export default ChatRoom;
