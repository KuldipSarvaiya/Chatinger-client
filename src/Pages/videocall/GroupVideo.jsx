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
import { useNavigate, useSearchParams } from "react-router-dom";
import PropTypes from "prop-types";

function GroupVideo({ myvideo, videoRoomId }) {
  const { Data } = useContext(Context);
  const [videos, setVideos] = useState([{ [Data.auth._id]: myvideo }]);
  const [peer, setPeer] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(myvideo);
  const [fullVideo, setfullVideo] = useState(true);
  const theme = useTheme();
  const isBigScreen = useMediaQuery(theme.breakpoints.up("md"));
  const [showChats, setShowChats] = useState(isBigScreen);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const stream_ids = [];
  const chat = Data?.auth?.chatrooms?.find(({ _id }) => _id === videoRoomId);
  const name =
    chat?.display_name ||
    chat.members?.filter(({ _id }) => _id !== Data?.auth?._id)?.[0]
      ?.display_name;

  React.useEffect(() => {
    if (!searchParams.get("join"))
      Data.socket.emit("join_video_call", {
        room: videoRoomId,
        display_name: name,
      });
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

    newPeer.on("open", (id) => {
      console.log(
        "\n\n\n\n****************** Peer Called opened with this id = ",
        id
      );

      newPeer.on("call", (call) => {
        console.log(
          "\n ############ Incoming call detected while making a call\n",
          call
        );
        call.answer(myvideo);
        call.on("stream", (incomingStream) => {
          if (stream_ids.includes(call.peer)) return;

          console.log("\n ************ 1 stream has been added = ", call.peer);

          stream_ids.push(call.peer);
          setVideos((prevVideos) => [
            ...prevVideos,
            { [call.peer]: incomingStream },
          ]);
        });

        call.on("close", () => {
          console.log(
            "\n ************ 1 stream has been closed = ",
            call.peer,
            videos.find((obj) => Object.keys(obj)[0] === call.peer)
          );
          setVideos((prev) =>
            prev.filter((obj) => Object.entries(obj)[0] !== call.peer)
          );
          removeVideoElement(call.peer);
          stream_ids.splice(stream_ids.indexOf(call.peer), 1);
        });
      });

      const room = Data?.auth?.chatrooms?.find(
        ({ _id }) => _id === videoRoomId
      );
      for (let member of room.members.filter(
        ({ _id }) => _id !== Data.auth._id
      )) {
        const call = newPeer.call(member._id, myvideo);
        console.log(call);

        call.on("stream", (incomingStream) => {
          if (stream_ids.includes(call.peer)) return;

          stream_ids.push(call.peer);
          setVideos((prevVideos) => [
            ...prevVideos,
            { [call.peer]: incomingStream },
          ]);
        });

        call.on("close", () => {
          console.log(
            "\n ************ 2 stream has beed closed = ",
            call.peer,
            videos.find((obj) => Object.keys(obj)[0] === call.peer)
          );
          setVideos((prev) =>
            prev.filter((obj) => Object.entries(obj)[0] !== call.peer)
          );
          removeVideoElement(call.peer);
          stream_ids.splice(stream_ids.indexOf(call.peer), 1);
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

  const removeVideoElement = (videoId) => {
    const videoElement = document.getElementById(videoId);

    if (videoElement) {
      videoElement.parentNode.removeChild(videoElement);
    }
  };

  return (
    <section className="w-full h-full flex">
      <div className="lg:w-3/4 w-full h-full flex flex-col">
        <div className="h-4/5">
          {selectedVideo ? (
            <div className="w-full h-full relative flex justify-center border-b-2">
              <video
                ref={(el) => {
                  if (el) el.srcObject = selectedVideo;
                }}
                autoPlay
                className={`${
                  fullVideo ? "w-full " : " m-auto "
                } h-full max-md:h-auto object-cover`}
              />
              <div className="absolute bottom-3 right-3 md:right-10 md:bottom-10 flex gap-2">
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

                    navigate("/chat/" + videoRoomId, { replace: true });
                  }}
                >
                  <Tooltip title="End Call">
                    <CallEnd />
                  </Tooltip>
                </IconButton>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500 border-b-2">
              Select a streamer to display
            </div>
          )}
        </div>
        <div className="h-1/5 flex overflow-x-auto overflow-y-hidden">
          {videos?.map((stream) => (
            <div
              key={Object.keys(stream)[0]}
              id={Object.keys(stream)[0]}
              className="flex-shrink-0 m-2"
            >
              <video
                ref={(el) => {
                  if (el) el.srcObject = Object.values(stream)[0];
                }}
                autoPlay
                disablePictureInPicture={true}
                className="w-40 h-30 object-cover rounded-sm cursor-pointer"
                onClick={() => setSelectedVideo(Object.values(stream)[0])}
              />
            </div>
          ))}
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

GroupVideo.propTypes = {
  myvideo: PropTypes.object.isRequired,
  videoRoomId: PropTypes.string.isRequired,
};

export default GroupVideo;
