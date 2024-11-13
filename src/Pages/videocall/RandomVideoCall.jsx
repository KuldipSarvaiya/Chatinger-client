import React, { useContext, useRef, useState } from "react";
import { Peer } from "peerjs";
import { Context } from "../../ContextProvider";
import {
  CallEnd,
  Chat,
  CropSquare,
  RectangleOutlined,
  Videocam,
} from "@mui/icons-material";
import {
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme,
  Button,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Loader from "../../Widgets/Loader";
import PropTypes from "prop-types";
import RandomChatroom from "./RadomChatroom";
import MessageNotification from "../../Widgets/MessageNotification";

function RandomVideoCall({ myvideo }) {
  const { Data } = useContext(Context);
  const [friendsVideo, setFriendsVideo] = useState(null);
  const [peer, setPeer] = useState(null);
  const [fullVideo, setfullVideo] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [userCounts, setUserCounts] = useState({ active: 0, waiting: 0 });
  const theme = useTheme();
  const isBigScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const [showChats, setShowChats] = useState(isBigScreen);
  const [msgAlert, setMsgAlert] = useState(false);
  const navigate = useNavigate();
  const roomIdRef = useRef(null);

  React.useEffect(() => {
    if (!Data.socket) return navigate("/");

    // * Initialize peer when component mounts
    const newPeer = new Peer(Data.auth._id, {
      host: import.meta.env.VITE_APP_BASE_HOST,
      port: import.meta.env.VITE_APP_BASE_PORT,
      path: "/video-call",
      secure: false,
      debug: 3,
      config: {
        iceServers: [
          {
            urls: [import.meta.env.VITE_APP_STUN_SERVER_1],
          },
        ],
      },
      retry_options: {
        retries: 3,
        minTimeout: 1000,
        maxTimeout: 5000,
      },
    });
    setPeer(newPeer);

    Data.socket.emit("join_random_video_call", Data.auth._id);

    // Listen for user counts updates
    const countUsers = (counts) => {
      setUserCounts(counts);
    };
    Data.socket.on("userCounts", countUsers);

    // Listen for match found
    const matchFoundHnadler = ({ roomId, remotePeerId }) => {
      setIsSearching(false);
      roomIdRef.current = roomId;
      Data.socket.emit("join_room", { room: roomId });

      // Initiate call to matched peer
      const call = newPeer.call(remotePeerId, myvideo);
      call.on("stream", (incomingStream) => {
        setIsInCall(true);
        setFriendsVideo(incomingStream);
      });
    };
    Data.socket.on("matchFound", matchFoundHnadler);

    // Handle incoming calls
    newPeer.on("open", () => {
      newPeer.on("call", (call) => {
        call.answer(myvideo);
        call.on("stream", (incomingStream) => {
          setFriendsVideo(incomingStream);
        });
        call.on("close", endCall);
        call.on("error", endCall);
      });
    });
    newPeer.on("close", endCall);
    newPeer.on("disconnected", endCall);

    // Handle disconnection
    Data.socket.on("userDisconnected", endCall);

    const clearSideEffecs = () => {
      if (newPeer) {
        newPeer.destroy();
      }
      Data.socket.off("userCounts", countUsers);
      Data.socket.off("matchFound", matchFoundHnadler);
      Data.socket.off("userDisconnected", endCall);
      Data.socket.emit("leave_room", { room: roomIdRef.current });
      Data.socket.emit("disconnect_rvc");
    };

    newPeer.on('error',() => navigate('/random-video-call'))

    // window.addEventListener("beforeunload", clearSideEffecs);

    return clearSideEffecs;
  }, [friendsVideo]);

  const startRandomCall = () => {
    Data.socket.emit("findMatch");
    let fetch_loop;
    fetch_loop = setInterval(() => {
      if (!isSearching) {
        clearInterval(fetch_loop);
        return;
      } else Data.socket.emit("findMatch");
    }, 2000);
  };

  const endCall = () => {
    alert("Call ended");
    setIsInCall(false);
    setFriendsVideo(null);
    Data.socket.emit("callEnded");
    Data.socket.emit("leave_room", { room: roomIdRef.current });
    setMsgAlert({
      type: "video_call_ended",
      message: "Video call ended",
      display_name: "",
    });

    if (peer) {
      peer.disconnect();
      // peer.destroy();
      // setPeer(null);
    }
  };

  if (!isInCall) {
    return (
      <div className="grid grid-cols-1 grid-rows-1 h-full">
        <div className="h-full w-auto col-start-1 row-start-1">
          <video
            ref={(el) => {
              if (el) el.srcObject = myvideo;
            }}
            autoPlay
            muted={true}
            disablePictureInPicture={true}
            className={`h-full w-full max-w-5xl m-auto max-lg:max-w-full object-cover`}
          />
        </div>
        <div className="col-start-1 row-start-1 flex flex-col items-center justify-center h-full bg-gray-900/60 p-8">
          <Typography variant="h4" className="mb-6 text-white">
            Random Video Chat
          </Typography>

          <div className="mb-8 text-center">
            <Typography variant="body1" className="text-gray-300">
              Currently Online: {userCounts.active} users
            </Typography>
            <Typography variant="body2" className="text-gray-400">
              Waiting for matches: {userCounts.waiting} users
            </Typography>
          </div>

          {isSearching ? (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 mb-4">
                <Loader />
              </div>
              <Typography variant="body1" className="text-white">
                Looking for someone to chat with...
              </Typography>
              <Button
                variant="outlined"
                color="error"
                onClick={() => setIsSearching(false)}
                className="mt-4"
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              variant="contained"
              color="primary"
              startIcon={<Videocam />}
              onClick={() => {
                setIsSearching(true);
                setTimeout(() => {
                  startRandomCall();
                }, 1000);
              }}
              size="large"
            >
              Start Random Call
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="w-full h-full flex">
        <div className="lg:w-3/4 w-full h-full flex flex-col">
          <div className="w-full h-full relative flex justify-center">
            <video
              ref={(el) => {
                if (el) el.srcObject = friendsVideo || myvideo;
              }}
              autoPlay
              className={`${
                fullVideo ? "w-full " : " m-auto "
              } h-full max-md:h-auto object-cover`}
            />
            <div className="absolute bottom-3 right-3 md:right-10 md:bottom-10 flex gap-2 z-10">
              <span className="lg:hidden">
                {peer && (
                  <IconButton
                    sx={{
                      backgroundColor: "#7E7E8575",
                      color: "whitesmoke",
                      ":hover": {
                        backgroundColor: "#42445A",
                      },
                    }}
                    onClick={() => setShowChats(true)}
                    color="inherit"
                    size="large"
                  >
                    <Tooltip title="Show Chats">
                      <Chat />
                    </Tooltip>
                  </IconButton>
                )}
              </span>
              <IconButton
                sx={{
                  backgroundColor: "#7E7E8575",
                  color: "whitesmoke",
                  ":hover": {
                    backgroundColor: "#42445A",
                  },
                }}
                onClick={() => setfullVideo(!fullVideo)}
                color="inherit"
                size="large"
              >
                <Tooltip title="Change Screen Size">
                  {fullVideo ? <CropSquare /> : <RectangleOutlined />}
                </Tooltip>
              </IconButton>
              <IconButton
                size="large"
                sx={{
                  backgroundColor: "#ef4444",
                  color: "white",
                  ":hover": {
                    backgroundColor: "#dc2626",
                  },
                }}
                onClick={endCall}
              >
                <Tooltip title="End Call">
                  <CallEnd />
                </Tooltip>
              </IconButton>
            </div>
            {friendsVideo ? (
              <div className="absolute bottom-2 left-2 w-auto h-1/5">
                <video
                  ref={(el) => {
                    if (el) el.srcObject = myvideo;
                  }}
                  autoPlay
                  muted={true}
                  disablePictureInPicture={true}
                  className="w-40 h-30 object-cover rounded-sm cursor-pointer"
                />
              </div>
            ) : (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center w-full h-full bg-black/50">
                <div className="w-12 h-12">
                  <Loader />
                </div>
                <span>Connecting to chosen friend...</span>
              </div>
            )}
          </div>
        </div>
        <div
          className={`w-1/4 max-lg:pt-12 h-full max-lg:absolute right-0 bottom-0 max-lg:min-w-[375px] max-lg:max-w-[500px] max-lg:w-full z-50 ${
            peer && showChats ? "block" : "hidden"
          }`}
        >
          <div className="h-full bg-gray-900 sm:border-l-2">
            <RandomChatroom
              roomId={roomIdRef.current}
              closeChatRoom={() => setShowChats(false)}
              showChats={showChats}
            />
          </div>
        </div>
      </section>
      {msgAlert?.message && (
        <MessageNotification msgAlert={msgAlert} setMsgAlert={setMsgAlert} />
      )}
    </>
  );
}

RandomVideoCall.propTypes = {
  myvideo: PropTypes.object.isRequired,
};

export default RandomVideoCall;
