import { Alert, IconButton, Snackbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { QuestionAnswerRounded, VideoChat } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { Context } from "../ContextProvider";
import PropTypes from "prop-types";

function MessageNotification({
  showAlert,
  setShowAlert,
  isExternallyTriggered,
}) {
  const [msgAlert, setMsgAlert] = useState(false);
  const navigate = useNavigate();
  const { Data } = useContext(Context);
  const { pathname } = useLocation();

  useEffect(() => {
    if (!Data.socket || !Data.isLoggedIn) return;

    const handleVideoCall = (data) => {
      setMsgAlert({
        type: "video_call",
        display_name: data.display_name,
        roomId: data.roomId,
        message: "video call started",
      });
    };

    const messagehandler = (data) => {
      const uuid = pathname?.split("/")?.[2];

      if (isExternallyTriggered || uuid !== data.room)
        setMsgAlert({
          type: "message",
          display_name: data.display_name,
          message: data.message,
        });
    };

    Data.socket.on("messageToClient", messagehandler);
    Data.socket.on("answer_video_call", handleVideoCall);
    for (let i = 0; i < Data.auth.chatrooms.length; i++) {
      const room = Data.auth.chatrooms[i];
      Data.socket.emit("join_room", { room: room._id });
    }

    return () => {
      Data.socket.off("messageToClient", messagehandler);
      Data.socket.off("answer_video_call", handleVideoCall);
      for (let i = 0; i < Data.auth.chatrooms.length; i++) {
        const room = Data.auth.chatrooms[i];
        Data.socket.emit("leave_room", { room: room._id });
      }
    };
  }, [Data.socket, Data.isLoggedIn]);

  useEffect(() => {
    if (isExternallyTriggered === true) {
      setMsgAlert(showAlert);
    }
  }, [isExternallyTriggered]);

  const closeAlert = () => {
    setMsgAlert(false);
    if (isExternallyTriggered === true) setShowAlert(false);
  };

  return (
    <>
      <Snackbar
        open={msgAlert !== false}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        autoHideDuration={5000}
      >
        <Alert
          onClose={closeAlert}
          severity="success"
          variant="filled"
          icon={
            msgAlert?.type === "video_call" ? (
              <VideoChat />
            ) : (
              <QuestionAnswerRounded />
            )
          }
          translate="yes"
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={closeAlert}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        >
          <div
            className={
              "grid grid-cols-1 gap-0" +
              (msgAlert.type === "video_call" ? " cursor-pointer" : "")
            }
            onClick={() => {
              if (msgAlert.type === "video_call") {
                navigate("/video/" + msgAlert.roomId + "?join=true");
              }
            }}
          >
            <span className="uppercase">{msgAlert.display_name}</span>
            {msgAlert?.message?.substr(0, 40)}
            {msgAlert?.message?.length > 40 ? "..." : ""}
          </div>
        </Alert>
      </Snackbar>
    </>
  );
}

MessageNotification.propTypes = {
  showAlert: PropTypes.object,
  setShowAlert: PropTypes.func,
  isExternallyTriggered: PropTypes.bool,
};

export default MessageNotification;
