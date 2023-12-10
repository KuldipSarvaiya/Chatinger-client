import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

function SocketSingleRoom() {
  const [msg, setMsg] = useState("");
  const [msgList, setMsgList] = useState([]);
  const messagesRef = useRef(null);
  const socket = useRef(null);

  const myMessageClassList =
    "p-3 bg-white w-fit mr-3 rounded-tr-xl rounded-l-xl self-end max-w-screen-md";
  const yourMessageClassList =
    "p-3 bg-white w-fit ml-3 rounded-tl-xl rounded-r-xl max-w-screen-md mb-3";

  useEffect(() => {
    socket.current = new io("ws://localhost:8080");

    // Connection opened
    socket.current.on("connect", () => {
      // Listen for messages
      socket.current.on("message", (event) => {
        setMsgList((prev) => [...prev, { from: "you", message: event }]);
        setTimeout(() => {
          messagesRef.current.lastChild.scrollIntoView({
            behavior: "smooth",
            inline: "end",
          });
        }, 0);
      });
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  function sendMessage() {
    socket.current.emit("message", msg);
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

  return (
    <div className="relative w-9/12 h-screen p-10 m-auto pb-20">
      {/* Message Box */}
      <div
        ref={messagesRef}
        className="w-full h-full flex flex-col overflow-auto mb-10 pt-2"
      >
        {msgList.map((message, index) => {
          return (
            <span
              key={index}
              className={
                message.from === "me"
                  ? myMessageClassList
                  : yourMessageClassList
              }
            >
              {message.message}
            </span>
          );
        })}
      </div>

      {/* send Messages */}
      <div className="absolute bottom-0 w-full left-0 gap-5 my-4 px-10 flex justify-center items-center">
        <textarea
          id="messageBox"
          className="w-5/6 rounded-sm outline-none font-mono text-xl resize-none px-1 border-b-4 border-blue-600"
          placeholder="Type Your Message Here..."
          value={msg}
          onChange={(e) => {
            setMsg(e.target.value);
          }}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-xl h-fit font-mono p-1 rounded-md capitalize shadow-white shadow-md disabled:bg-blue-800 disabled:shadow-none"
          disabled={msg === ""}
        >
          send📤
        </button>
      </div>
    </div>
  );
}

export default SocketSingleRoom;
