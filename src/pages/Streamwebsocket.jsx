import { useEffect, useRef, useState } from "react";
import useWebSocket from "react-use-websocket";

const StreamWebSocket = () => {
  const [videoChunks, setVideoChunks] = useState([]);
  const videoUrl = useRef(null);
  const { lastMessage, getWebSocket } = useWebSocket("ws://localhost:8080");

  useEffect(() => {
    if (lastMessage?.data) {
      setVideoChunks((prevChunks) => [...prevChunks, lastMessage.data]);
    }
  }, [lastMessage]);

  useEffect(() => {
    if (lastMessage?.data === "stream-completed") {
      const videoBlob = new Blob(videoChunks, { type: "video/mp4" });
      videoUrl.current = URL.createObjectURL(videoBlob);
    }

    return () => {
      getWebSocket().close();
    };
  }, [lastMessage, videoChunks]);

  return (
    <>
      {videoUrl && (
        <video
          src={videoUrl.current}
          width={window.innerWidth / 2}
          controls
          autoPlay
        />
      )}
    </>
  );
};

export default StreamWebSocket;
