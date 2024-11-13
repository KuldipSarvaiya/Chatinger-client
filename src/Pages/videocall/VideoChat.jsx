import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Context } from "../../ContextProvider";
import Loader from "../../Widgets/Loader";
import PrivateVideo from "./PrivateVideo";
import GroupVideo from "./GroupVideo";
import { Modal, Paper } from "@mui/material";
import RandomVideoCall from "./RandomVideoCall";

function VideoChat() {
  const { roomId } = useParams();
  const { Data } = React.useContext(Context);
  const [localStream, setLocalStream] = React.useState(null);
  const [mediaBlocked, setMediaBlocked] = React.useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const chatRoom = Data.auth.chatrooms.find(({ _id }) => _id === roomId);

  React.useEffect(() => {
    if (!chatRoom && pathname !== "/random-video-call")
      return navigate("/", { replace: true });
    getMediaPermission();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
      setLocalStream(null);
    };
  }, []);

  async function getMediaPermission() {
    const hasDevices =  await checkDevices()
    if (!hasDevices) return;

    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      })
      .then((stream) => {
        setLocalStream(stream);
        if (mediaBlocked) setMediaBlocked(false);
      })
      .catch((e) => {
        console.log(e);

        setMediaBlocked(true);
      });
  }

  const checkDevices = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const hasCamera = devices.some((device) => device.kind === "videoinput");
    const hasMic = devices.some((device) => device.kind === "audioinput");

    if (!hasCamera || !hasMic) {
      alert(`${!hasCamera ? "Camera " : ""} ${!hasMic ? "Microphone " : ""} not found`);
      return false;
    }
    return true;
  };

  return (
    <>
      {localStream && !mediaBlocked ? (
        pathname === "/random-video-call" ? (
          <RandomVideoCall myvideo={localStream} videoRoomId={roomId} />
        ) : chatRoom.type === "private" ? (
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
          className="p-6 rounded-lg shadow-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-lg"
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
