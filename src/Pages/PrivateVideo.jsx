import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { Peer } from "peerjs";
import { Context } from "../ContextProvider";

function PrivateVideo() {
  const [localStream, setLocalStream] = useState(null);
  const [videos, setVideos] = useState([]);
  const { videoId } = useParams();
  const { Data } = useContext(Context);

  React.useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setVideos([stream]);
        setLocalStream(stream);
      })
      .catch((error) => console.error("Error accessing media devices:", error));
  }, []);

  const handleMakeCall = () => {
    const newPeer = new Peer(Data.auth._id, {
      host: import.meta.env.VITE_APP_BASE_HOST,
      port: import.meta.env.VITE_APP_BASE_PORT,
      path: "/video-call",
      secure: false, // Set to true if using HTTPS
      debug: 3,
      config: {
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      },
    });

    newPeer.on("open", (id) => {
      console.log(
        "\n\n\n\n****************** Peer Called opened with this id = ",
        id
      );

      const call = newPeer.call(videoId, localStream);
      call.on("stream", (incomingStream) => {
        setVideos([...videos, incomingStream]);
      });
    });
  };

  const handleAnswerCall = () => {
    const newPeer = new Peer(videoId, {
      host: import.meta.env.VITE_APP_BASE_HOST,
      port: import.meta.env.VITE_APP_BASE_PORT,
      path: "/video-call",
      secure: false,
      debug: 3,
      config: {
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      },
    });

    newPeer.on("open", (id) => {
      console.log(
        "\n\n\n\n****************** Peer Answered opened with this id = ",
        id
      );

      newPeer.on("call", (call) => {
        console.log("Incoming call detected");
        call.answer(localStream);
        call.on("stream", (incomingStream) => {
          setVideos([...videos, incomingStream]);
        });
      });
    });

    newPeer.on("error", (error) => {
      console.error("PeerJS error:", error);
    });
  };

  return (
    <div>
      {videos?.map((stream, i) => (
        <video
          key={i}
          ref={(el) => {
            if (el) el.srcObject = stream;
          }}
          autoPlay
        />
      ))}

      <button
        className="m-3 p-2 bg-red-500 rounded-lg"
        onClick={handleMakeCall}
      >
        Make Call
      </button>
      <button
        className="m-3 p-2 bg-green-500 rounded-lg"
        onClick={handleAnswerCall}
      >
        Answer Call
      </button>
    </div>
  );
}

export default PrivateVideo;
