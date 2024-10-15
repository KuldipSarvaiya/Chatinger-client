import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "../../ContextProvider";
import Loader from "../../Widgets/Loader";
import PrivateVideo from "./PrivateVideo";
import GroupVideo from "./GroupVideo";
import { Modal, Paper } from "@mui/material";

function VideoChat() {
  const { roomId } = useParams();
  const { Data } = React.useContext(Context);
  const [localStream, setLocalStream] = React.useState(null);
  const [mediaBlocked, setMediaBlocked] = React.useState(false);
  const navigate = useNavigate();
  const chatRoom = Data.auth.chatrooms.find(({ _id }) => _id === roomId);

  React.useEffect(() => {
    if (!chatRoom) return navigate("/", { replace: true });
    getMediaPermission();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
      setLocalStream(null);
    };
  }, []);

  function getMediaPermission() {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setLocalStream(stream);
        if (mediaBlocked) setMediaBlocked(false);
      })
      .catch(() => {
        setMediaBlocked(true);
      });
  }

  return (
    <>
      {localStream && !mediaBlocked ? (
        chatRoom.type === "private" ? (
          <PrivateVideo myvideo={localStream} videoRoomId={roomId} />
        ) : (
          <GroupVideo myvideo={localStream} videoRoomId={roomId} />
        )
      ) : (
        <span className="w-12 h-12 absolute inset-0 m-auto">
          <Loader />
        </span>
      )}

      <Modal open={mediaBlocked}>
        <Paper
          sx={{
            boxShadow: "inset 0px 0px 10px 3px black, 3px 3px 20px 0px white",
            backgroundColor: "#22c55e",
          }}
          className="p-6 rounded-lg shadow-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
          <h2 className="text-2xl font-bold mb-4">⚠️Permission Required</h2>
          <p className="mb-4">
            To use the video chat feature, we need access to your camera and
            microphone. Please grant permission to continue.
          </p>
          <button
            className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded"
            onClick={getMediaPermission}
          >
            Grant Permission
          </button>
        </Paper>
      </Modal>
    </>
  );
}

export default VideoChat;
