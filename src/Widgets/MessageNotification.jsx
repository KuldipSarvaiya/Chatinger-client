import { Alert, IconButton, Snackbar } from "@mui/material";
import { createPortal } from "react-dom";
import CloseIcon from "@mui/icons-material/Close";
import { QuestionAnswerRounded, VideoChat } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const MessageNotification = ({ msgAlert, setMsgAlert }) => {
  const navigate = useNavigate();

  return createPortal(
    <Snackbar
      open={msgAlert !== false}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      autoHideDuration={2000}
    >
      <Alert
        onClose={() => setMsgAlert(false)}
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
            onClick={() => setMsgAlert(false)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        <div
          className={"grid grid-cols-1 gap-0" + (msgAlert.type === "video_call" ? " cursor-pointer" : "")}
          onClick={() => {
            if (msgAlert.type === "video_call") {
              navigate("/video/" + msgAlert.roomId + "?join=true");
            }
          }}
        >
          <span className="uppercase">{msgAlert.display_name}</span>
          {msgAlert.message}
        </div>
      </Alert>
    </Snackbar>,
    document.getElementById("root")
  );
};

export default MessageNotification;
