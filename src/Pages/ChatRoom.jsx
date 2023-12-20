import { useNavigate, useParams } from "react-router-dom";
import Message from "../Widgets/Message";
import { Avatar, Button, IconButton, Modal, Paper } from "@mui/material";
import CloseFullscreenRoundedIcon from "@mui/icons-material/CloseFullscreenRounded";
import { useRef, useState } from "react";
// import RemoveCircleOutlineRoundedIcon from "@mui/icons-material/RemoveCircleOutlineRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";

function ChatRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");
  const [msgList, setMsgList] = useState([]);
  const [showGroupModal, setShowGroupModal] = useState(false);
  // const socket = useRef(null);
  const messagesRef = useRef(null);

  console.log("chatroom reloaded", roomId);
  const name = "Kuldip Sarvaiya";
  const type = "group";

  function sendMessage() {
    // socket.current.emit("message", msg);
    setMsgList((prev) => [...prev, { from: "me", message: msg }]);
    setMsg("");
    setTimeout(() => {
      messagesRef.current.lastChild.scrollIntoView({
        behavior: "smooth",
        inline: "end",
      });
      document.querySelector("#messageBox").focus();
    }, 0);
  }

  function removeMember(event) {
    event.preventDefault();
    console.log(event.target.name);
  }

  function inviteMember(event) {
    event.preventDefault();
    console.log(event.target.name);
  }

  return (
    <>
      <section className="h-full p-2 max-sm:p-1 w-full flex flex-col relative gap-1">
        {/* friend's detail navbar */}
        <span className="p-2 rounded-lg w-full bg-red-500 flex items-center h-12 text-2xl font-medium max-sm:text-lg gap-3 uppercase flex-row flex-nowrap min-h-fit">
          <Avatar
            variant="circular"
            sx={{ bgcolor: "transparent", border: "2px dotted black" }}
          >
            {name.indexOf(" ") !== -1
              ? name.split(" ")[0].charAt(0) + name.split(" ")[1].charAt(0)
              : name.split(" ")[0].charAt(0)}
          </Avatar>
          <span className="grow -md:text-md -lg:text-lg">{name}</span>

          {/* icon shorcuts */}
          {type === "group" && (
            <IconButton
              title="add member to group"
              onClick={() => setShowGroupModal(true)}
            >
              <PersonAddAlt1RoundedIcon />
            </IconButton>
          )}
          <IconButton title="Close Chat" onClick={() => navigate("/")}>
            <CloseFullscreenRoundedIcon />
          </IconButton>
        </span>

        {/* image that displayed when no messages are send or received */}
        {msgList.length < 1 && (
          <span className="self-center absolute bottom-44">
            <img
              src="assets/message_notification.png"
              width={"auto"}
              height={"700px"}
              alt=""
              className="drop-shadow-[0_25px_50px_rgba(255,255,255,1)] "
            />
          </span>
        )}

        {/* message display */}
        <span
          className="w-full flex flex-col overflow-y-auto overflow-x-hidden grow"
          ref={messagesRef}
        >
          {msgList.map((message, index) => {
            return (
              <Message
                key={index}
                isMyMessage={(index + 1) % 2 === 0}
                message={message.message}
              />
            );
          })}
        </span>

        {/* send message space */}
        <span className="flex flex-row gap-1 w-full justify-center items-center max-md:gap-1">
          <textarea
            id="messageBox"
            className="w-3/4 text-slate-700 max-md:w-11/12 rounded-md outline-none text-xl resize-none px-1 border-b-4 border-green-500"
            placeholder="Type Your Message..."
            value={msg}
            onChange={(e) => {
              setMsg(e.target.value);
            }}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-xl font-mono p-3 rounded-md h-full uppercase shadow-white shadow-md disabled:bg-blue-800 disabled:shadow-none disabled:bg-transparent"
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

          <spam className="overflow-auto">
            {/* group members and remove member */}
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
                  onClick={removeMember}
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
                  onClick={inviteMember}
                >
                  Invite🔀
                </Button>
              </span>
            </span>
          </spam>
        </Paper>
      </Modal>
    </>
  );
}

export default ChatRoom;
