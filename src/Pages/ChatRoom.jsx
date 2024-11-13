import { useLocation, useNavigate, useParams } from "react-router-dom";
import Message from "../Widgets/Message";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Modal,
  Paper,
  SpeedDial,
  SpeedDialAction,
  Tooltip,
} from "@mui/material";
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
import { ArrowBackIos, MoreVert, Person } from "@mui/icons-material";
import { PropTypes } from "prop-types";
import MessageNotification from "../Widgets/MessageNotification";

function ChatRoom({ closeChatRoom }) {
  const { roomId } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [msgList, setMsgList] = useState([]);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [msgAlert, setMsgAlert] = useState(false);
  const [invitableFriends, setInvitableFriends] = useState([]);
  const msg = useRef(null);
  const lastKeyPressed = useRef(null);
  const messagesRef = useRef(null);
  const oldMessagesFetched = useRef(false);
  const { Data, removeChatRoom } = useContext(Context);
  const [chatMembers, setChatMembers] = useState([]);
  const chat = Data?.auth?.chatrooms?.filter(({ _id }) => _id === roomId)[0];
  const name =
    chat?.display_name ||
    chatMembers?.filter(({ _id }) => _id !== Data?.auth?._id)?.[0]
      ?.display_name;

  useEffect(() => {
    if (msgList.length > 0) setMsgList([]);

    const messageListener = (message) => {
      if (message.room !== roomId) return setMsgAlert(message);
      setMsgList((prev) => [
        ...prev,
        {
          _id: Date.now(),
          isMyMessage: false,
          message: message.message,
          sent_by: message.display_name,
        },
      ]);
      scrollDown();
    };

    const answerVideoCall = (data) => {
      console.log(data);
      
      setMsgAlert({
        type: "video_call",
        display_name: data.display_name,
        roomId: data.roomId,
        message: "video call started",
      });
      // navigate("/video/" + data.roomId);
    };

    if (Data.socket !== null) {
      Data.socket.emit("join_room", { room: roomId });
      Data.socket.on("messageToClient", messageListener);
      Data.socket.on("answer_video_call", answerVideoCall);

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
      Data.socket.off("messageToClient", messageListener);
      // Data.socket.off("answer_video_call", answerVideoCall);
      // Data.socket.emit("leave_room", { room: roomId });
    };
  }, [Data.socket, roomId]);

  useEffect(() => {
    const listMessages = (data) => {
      const convertedData = data.map((item) => {
        return {
          _id: item._id,
          message: item.text,
          isMyMessage: item.sent_by._id === Data.auth._id,
          deliveredAt: item.deliveredAt,
          sent_by: item.sent_by.display_name,
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
      setMsgList([]);
    };
  }, [Data.socket, roomId]);

  useEffect(() => {
    if (chat && showGroupModal && invitableFriends.length < 1)
      fetchInvitableFriends();

    return () => {
      setInvitableFriends([]);
    };
  }, [showGroupModal, chat]);

  useEffect(() => {
    const room =
      Data?.auth?.chatrooms?.find(({ _id }) => _id === roomId)?.members || [];

    if (room.length === 0) navigate("/", { replace: true });

    setChatMembers(room);
    return () => {
      setChatMembers([]);
    };
  }, [roomId]);

  async function fetchInvitableFriends() {
    if (chat?.admin !== Data.auth._id) return;

    try {
      const res = await axios.get("/group/members?chatroom_id=" + roomId);
      if (!res.data.error) setInvitableFriends(res.data?.members);
    } catch (error) {
      console.log(error);
    }
  }

  function sendMessage() {
    if (!msg.current.value) return;

    Data.socket.emit("messageToServer", {
      room: roomId,
      message: msg.current.value,
      sent_by: Data.auth._id,
      display_name: Data.auth.display_name,
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

  async function manageGroupMember(operation_type, member_id) {
    try {
      const res = await axios.put("/group/members", {
        member_id,
        operation_type,
        chatroom_id: roomId,
      });

      if (!res.data.error) {
        if (operation_type === "add") {
          setChatMembers((prev) => [
            ...prev,
            invitableFriends.filter(({ _id }) => _id === member_id)[0],
          ]);
          setInvitableFriends((prev) =>
            prev.filter(({ _id }) => _id !== member_id)
          );
        } else {
          setInvitableFriends((prev) => [
            ...prev,
            chatMembers.find(({ _id }) => _id === member_id),
          ]);
          setChatMembers((prev) => prev.filter(({ _id }) => _id !== member_id));
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function removeFriend() {
    try {
      const res = await axios.delete("/friend?chatroom_id=" + roomId);

      if (!res.data.error) {
        removeChatRoom(roomId);
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error(error);
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
      console.error(error);
    }
  }

  async function leaveGroup() {
    try {
      const res = await axios.delete("/group/leave_group/" + roomId);
      if (!res.data.error) {
        removeChatRoom(roomId);
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <section className="h-full p-2 max-sm:p-1 w-full flex flex-col relative gap-1">
        {/* friend's detail navbar */}
        {pathname.includes("chat") ? (
          <div className="relative chat_nav p-2 rounded-lg w-full bg-red-500 flex items-center h-12 text-2xl font-medium max-sm:text-lg gap-0 uppercase flex-row flex-nowrap min-h-fit">
            <span className="hidden md:inline">
              <Avatar
                variant="circular"
                sx={{ bgcolor: "transparent", border: "2px dashed black" }}
              >
                {name?.indexOf(" ") !== -1
                  ? name?.split(" ")?.[0]?.charAt?.(0) +
                    name?.split(" ")?.[1]?.charAt(0)
                  : name?.split(" ")?.[0]?.charAt?.(0)}
              </Avatar>
            </span>

            <span className="grow ml-1 -md:text-lg -lg:text-lg whitespace-nowrap">
              {name}
            </span>

            <Box
              sx={{
                position: "absolute",
                top: "0px",
                right: "10px",
                zIndex: "10",
              }}
            >
              <SpeedDial
                ariaLabel="SpeedDial playground example"
                icon={<MoreVert />}
                direction={"down"}
              >
                <SpeedDialAction
                  icon={<VideoChatIcon />}
                  tooltipTitle={<span>video&nbsp;call</span>}
                  tooltipOpen
                  onClick={() => navigate(`/video/${roomId}`)}
                />
                {chat?.type === "group" && (
                  <SpeedDialAction
                    icon={
                      chat?.admin === Data.auth._id ? (
                        <PersonAddAlt1RoundedIcon />
                      ) : (
                        <Person />
                      )
                    }
                    tooltipTitle={
                      <span>
                        {chat?.admin === Data.auth._id ? "manage" : ""}
                        &nbsp;members
                      </span>
                    }
                    tooltipOpen
                    onClick={() => setShowGroupModal(true)}
                  />
                )}
                {chat?.type === "group" && chat?.admin !== Data.auth._id && (
                  <SpeedDialAction
                    icon={<LogoutIcon />}
                    tooltipTitle={<span>leave&nbsp;group</span>}
                    tooltipOpen
                    onClick={leaveGroup}
                  />
                )}
                {chat?.type !== "group" && (
                  <SpeedDialAction
                    icon={<PersonRemoveAlt1Icon />}
                    tooltipTitle={<span>remove&nbsp;friend</span>}
                    tooltipOpen
                    onClick={removeFriend}
                  />
                )}
                <SpeedDialAction
                  icon={<UpdateIcon />}
                  tooltipTitle={<span>clear&nbsp;chat</span>}
                  tooltipOpen
                  onClick={clearChats}
                />
                <SpeedDialAction
                  icon={<CloseFullscreenRoundedIcon />}
                  tooltipTitle={<span>Close&nbsp;Chat</span>}
                  tooltipOpen
                  onClick={() => navigate("/")}
                />
              </SpeedDial>
            </Box>
          </div>
        ) : (
          <div className="chat_nav p-2 rounded-lg w-full lg:hidden">
            <IconButton
              sx={{
                color: "white",
              }}
              onClick={closeChatRoom}
            >
              <Tooltip title="Close Chat">
                <ArrowBackIos />
              </Tooltip>
            </IconButton>
          </div>
        )}

        {/* message display */}
        <section
          className="w-full flex flex-col overflow-y-auto overflow-x-hidden grow"
          ref={messagesRef}
        >
          {/* image that displayed when no messages are send or received */}
          {msgList.length < 1 && (
            <span className="flex-1 grid place-content-center">
              <img
                src="/assets/message_notification.png"
                alt=""
                className="drop-shadow-[0_25px_50px_rgba(255,255,255,1)] z-0"
                draggable="false"
              />
            </span>
          )}
          {msgList.map((message) => {
            return (
              <Message
                key={message._id}
                isMyMessage={message.isMyMessage}
                message={message.message}
                sent_by={message.sent_by}
                isGroup={chat?.type === "group"}
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

      {/* message notification */}
      {msgAlert && (
        <MessageNotification msgAlert={msgAlert} setMsgAlert={setMsgAlert} />
      )}

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
          <span className="overflow-auto">
            <u>
              <i>Group Members</i>
            </u>
            {chatMembers?.filter(({ _id }) => _id !== Data?.auth?._id)?.length <
              1 && (
              <center>
                <h1>
                  <i>----//-- 0.0 Members Are In This Group --//----</i>
                </h1>
              </center>
            )}
            {chatMembers
              ?.filter(({ _id }) => _id !== Data?.auth?._id)
              ?.map((item) => (
                <span
                  key={item._id}
                  className="border-l-[5px] rounded-l-lg border-gray-900/50 flex flex-row justify-between gap-3 items-center px-2 m-1 "
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-bold capitalize">
                      {item.display_name}
                    </span>
                    <span className="text-xs font-normal lowercase">
                      {item.username}
                    </span>
                  </div>
                  {chat?.admin === Data.auth._id && (
                    <span className="text-sm font-bold">
                      <Button
                        color="secondary"
                        variant="outlined"
                        sx={{ padding: "0 4px", margin: 0 }}
                        onClick={() => manageGroupMember("remove", item._id)}
                      >
                        Remove Member ❌
                      </Button>
                    </span>
                  )}
                </span>
              ))}

            {chat?.admin === Data.auth._id && (
              <>
                <br />
                <br />

                {/* invite friends list */}
                {invitableFriends.length > 0 && (
                  <u>
                    <i>Invite Friends To Group</i>
                  </u>
                )}
                {invitableFriends.map((item) => (
                  <span
                    key={item._id}
                    className="border-l-[5px] rounded-l-lg border-gray-900/50 flex flex-row justify-between gap-3 items-center px-2 m-1 "
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-bold capitalize">
                        {item.display_name}
                      </span>
                      <span className="text-xs font-normal lowercase">
                        {item.username}
                      </span>
                    </div>
                    <span className="text-sm font-bold">
                      <Button
                        color="secondary"
                        variant="outlined"
                        sx={{ padding: "0 4px", margin: 0 }}
                        onClick={() => manageGroupMember("add", item._id)}
                      >
                        Add ➕
                      </Button>
                    </span>
                  </span>
                ))}
              </>
            )}
          </span>

          {/* delete group button */}
          {chat?.admin === Data.auth._id && (
            <span className="w-full text-center pt-4 mb-2">
              <Button
                variant="contained"
                color="error"
                size="small"
                onClick={removeFriend}
              >
                <DeleteForeverIcon />
                &nbsp;Delete Group Permenetly
              </Button>
            </span>
          )}
        </Paper>
      </Modal>
    </>
  );
}

ChatRoom.propTypes = {
  closeChatRoom: PropTypes.func,
};

export default ChatRoom;
