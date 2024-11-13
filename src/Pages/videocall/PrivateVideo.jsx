import React, { useContext, useState } from "react";
import { Peer } from "peerjs";
import { Context } from "../../ContextProvider";
import ChatRoom from "../ChatRoom";
import {
  CallEnd,
  Chat,
  CropSquare,
  RectangleOutlined,
} from "@mui/icons-material";
import { IconButton, Tooltip, useMediaQuery, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Loader from "../../Widgets/Loader";
import PropTypes from "prop-types";

function PrivateVideo({ myvideo, videoRoomId }) {
  const { Data } = useContext(Context);
  const [friendsVideo, setFriendsVideo] = useState(null);
  const [peer, setPeer] = useState(null);
  const [fullVideo, setfullVideo] = useState(true);
  const theme = useTheme();
  const isBigScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const [showChats, setShowChats] = useState(isBigScreen);
  const navigate = useNavigate();
  const chat = Data?.auth?.chatrooms?.find(
    ({ _id }) => _id === videoRoomId
  );
  const name =
    chat?.display_name ||
    chat.members?.filter(({ _id }) => _id !== Data?.auth?._id)?.[0]
    ?.display_name;

  React.useEffect(() => {
    if (!Data.socket) return navigate("/");

    const leaveVideoCall = () => {
      navigate("/chat/" + videoRoomId, { replace: true });
    };

    Data.socket.emit("join_video_call", {
      room: videoRoomId,
      display_name: name,
    });
    Data.socket.on("end_private_video_call", leaveVideoCall);

    return () => {
      Data.socket.off("end_private_video_call", leaveVideoCall);
    };
  }, []);

  React.useEffect(() => {
    const newPeer = new Peer(Data.auth._id, {
      host: import.meta.env.VITE_APP_BASE_HOST,
      port: import.meta.env.VITE_APP_BASE_PORT,
      path: "/video-call",
      secure: false, // Set to true if using HTTPS
      debug: 0,
      config: {
        iceServers: [
          {
            urls: [
              import.meta.env.VITE_APP_STUN_SERVER_1
            ],
          },
        ],
      },
      retry_options: {
        retries: 3,
        minTimeout: 1000,
        maxTimeout: 5000,
      }
    });
    setPeer(newPeer);

    newPeer.on("open", () => {
      newPeer.on("call", (call) => {
        call.answer(myvideo);
        call.on("stream", (incomingStream) => {
          setFriendsVideo(incomingStream);
        });

        call.on("close", () => {
          setFriendsVideo(null);
        });
      });

      const room = Data?.auth?.chatrooms?.find(
        ({ _id }) => _id === videoRoomId
      );
      for (let member of room.members.filter(
        ({ _id }) => _id !== Data.auth._id
      )) {
        const call = newPeer.call(member._id, myvideo);

        call.on("stream", (incomingStream) => {
          setFriendsVideo(incomingStream);
        });

        call.on("close", () => {
          setFriendsVideo(null);
        });
      }
    });

    return () => {
      newPeer.destroy();

      if (peer) {
        peer.disconnect();
        peer.destroy();
        setPeer(null);
      }
    };
  }, [videoRoomId, myvideo]);

  return (
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
              onClick={() => {
                peer.disconnect();
                peer.destroy();

                Data.socket.emit("end_private_video_call", {
                  room: videoRoomId,
                });

                navigate("/chat/" + videoRoomId, { replace: true });
              }}
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
                disablePictureInPicture={true}
                className="w-40 h-30 object-cover rounded-sm cursor-pointer"
              />
            </div>
          ) : (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center w-full h-full bg-black/50">
              <div className="w-12 h-12">
                <Loader />
              </div>
              <span>TIP: Ask your friend to connect the call</span>
            </div>
          )}
        </div>
      </div>
      {showChats && (
        <div className="w-1/4 max-lg:pt-12 h-full max-lg:absolute right-0 bottom-0 max-lg:min-w-[375px] max-lg:max-w-[500px] max-lg:w-full z-50 ">
          <div className="h-full bg-gray-900 sm:border-l-2">
            <ChatRoom closeChatRoom={() => setShowChats(false)} />
          </div>
        </div>
      )}
    </section>
  );
}

PrivateVideo.propTypes = {
  myvideo: PropTypes.object.isRequired,
  videoRoomId: PropTypes.string.isRequired,
};

export default PrivateVideo;
