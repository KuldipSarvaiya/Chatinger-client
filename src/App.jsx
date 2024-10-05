import { Routes, Route } from "react-router-dom";
import PageNotFound from "./Pages/PageNotFound";
import Home from "./Pages/Home";
import ChatRoom from "./Pages/ChatRoom";
import SignIn from "./Pages/Login/SignIn";
import SignUp from "./Pages/Login/SignUp";
import { useContext, useEffect, useLayoutEffect, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { Context } from "./ContextProvider";
import sendNotification from "./Widgets/sendNotification";
import FetchProfile from "./Pages/Login/FetchProfile";
import LoadingChats from "./Widgets/LoadingChats";

function App() {
  const { Data, setSocket, setInitialState } = useContext(Context);
  const socket = useRef(null);

  useLayoutEffect(() => {
    axios.defaults.baseURL = import.meta.env.VITE_APP_BASE_URL;
    const token = window.localStorage.getItem(import.meta.env.VITE_APP_STORAGE_NAME);
    if (token) {
      axios.defaults.headers.common.Authorization = import.meta.env.VITE_APP_AUTH_HEADER_TYPE + " " + token;
    }
  }, []);

  // create a connection variable
  useEffect(() => {
    socket.current = new io(import.meta.env.VITE_APP_SOCKET_URL);
    socket.current.on("connect", () => {
      console.log("Connected to the socket server!");
      setSocket(socket.current);
      if (Data.socket)
        sendNotification("Chatinger", "You'r All Set For Hot Chats");
    });

    socket.current.on("disconnect", () => {
      console.log("Disconnected from the socket server!");
      sendNotification("Chatinger", "Please Come Back soon");
    });

    return () => {
      console.log("clearing side effect from App.jsx");
      socket.current.close();
      setInitialState();
    };
  }, []);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <FetchProfile>
              <Home />
            </FetchProfile>
          }
        >
          <Route
            path="chat/:roomId"
            element={Data.socket ? <ChatRoom /> : <LoadingChats />}
          />
        </Route>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;
