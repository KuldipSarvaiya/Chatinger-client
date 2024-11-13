import Message from "../../Widgets/Message";
import { Avatar, IconButton, Tooltip } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import axios from "axios";
import { ArrowBackIos, PersonAdd } from "@mui/icons-material";
import { PropTypes } from "prop-types";
import { Context } from "../../ContextProvider";
import MessageNotification from "../../Widgets/MessageNotification";

function RandomChatroom({ closeChatRoom, roomId, showChats }) {
  const [msgList, setMsgList] = useState([]);
  const [friendDetails, setFriendDetails] = useState({});
  const msg = useRef(null);
  const lastKeyPressed = useRef(null);
  const messagesRef = useRef(null);
  const { Data } = useContext(Context);
  const [msgAlert, setMsgAlert] = useState(false);

  useEffect(() => {
    if (msgList.length > 0) setMsgList([]);

    if (Data.socket !== null) {
      Data.socket.on("messageToClient", messageListener);
      Data.socket.emit("messageToServer", {
        do_not_send_message: "yes",
        type: "details",
        _id: Data.auth._id,
        display_name: Data.auth.display_name,
      });
    }

    return () => {
      Data.socket.off("messageToClient", messageListener);
    };
  }, []);

  const messageListener = (message) => {
    console.log(message);

    if (message.type === "details") {
      alert("message received");
      return setFriendDetails(message);
    }

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

    console.log(showChats);
    
    if (showChats === false) {
      setMsgAlert({
        type: "chat",
        message: message.message,
        display_name: message.display_name,
      });
    }
  };

  function sendMessage() {
    if (!msg.current.value) return;

    Data.socket.emit("messageToServer", {
      do_not_send_message: "yes",
      room: roomId,
      type: "message",
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

  function addNewFriend() {
    try {
      const res = axios.post("/friend/request", {
        requested_by: friendDetails._id,
      });
      console.log(res);

      if (res.statusText === "OK")
        setFriendDetails((prev) => ({ ...prev, request_sent: true }));
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <section className="h-full p-2 max-sm:p-1 w-full flex flex-col relative gap-1">
        {/* friend's detail navbar */}
        <div className="relative chat_nav p-2 rounded-lg bg-red-500 flex items-center h-12 text-2xl font-medium max-sm:text-lg gap-0 uppercase flex-row flex-nowrap min-h-fit">
          <span className="flex lg:hidden">
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
            {friendDetails.display_name && (
              <Avatar
                variant="circular"
                sx={{ bgcolor: "transparent", border: "2px dashed black" }}
              >
                {friendDetails.display_name?.indexOf(" ") !== -1
                  ? friendDetails.display_name?.split(" ")?.[0]?.charAt?.(0) +
                    friendDetails.display_name?.split(" ")?.[1]?.charAt(0)
                  : friendDetails.display_name?.split(" ")?.[0]?.charAt?.(0)}
              </Avatar>
            )}
          </span>

          <span className="grow ml-1 -md:text-lg -lg:text-lg whitespace-nowrap">
            {friendDetails?.display_name || ""}
          </span>
          {friendDetails?._id && (
            <IconButton
              sx={{
                color: "white",
              }}
              onClick={addNewFriend}
            >
              <Tooltip title="Invite Friend">
                <PersonAdd />
              </Tooltip>
            </IconButton>
          )}
        </div>
        <div className="chat_nav p-2 rounded-lg w-full lg:hidden"></div>

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
                isGroup={true}
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
      {msgAlert?.message && (
        <MessageNotification msgAlert={msgAlert} setMsgAlert={setMsgAlert} />
      )}
    </>
  );
}

RandomChatroom.propTypes = {
  closeChatRoom: PropTypes.func,
  roomId: PropTypes.string,
  showChats: PropTypes.bool,
};

export default RandomChatroom;
