import { Routes, Route } from "react-router-dom";
import PageNotFound from "./Pages/PageNotFound";
import Home from "./Pages/Home";
import ChatRoom from "./Pages/ChatRoom";
import SignIn from "./Pages/Login/SignIn";
import SignUp from "./Pages/Login/SignUp";
import { useContext, useEffect, useLayoutEffect, useRef } from "react";
// import useDatas from "./DataStore/useDatas";
import axios from "axios";
import { io } from "socket.io-client";
import { Context } from "./ContextProvider";

function App() {
  // const { setSocket } = useDatas();
  const { setSocket } = useContext(Context);
  // const navigate = useNavigate();
  const socket = useRef(null);

  useLayoutEffect(() => {
    axios.defaults.baseURL = "http://127.0.0.1:8080";
    axios.defaults.headers.common.Authorization = "bearer default_header";
  }, []);

  // create a connection variable
  useEffect(() => {
    socket.current = new io("ws://127.0.0.1:8080");
    socket.current.on("connect", () => {
      console.log("Connected to the socket server!");
      setSocket(socket.current);
    });

    return () => {
      console.log("clearing side effect from App.jsx");
      socket.current.close();
      setSocket(null);
    };
  }, []);

  // if (!Data.isLoggedIn) navigate("/signin");

  return (
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path=":roomId" element={<ChatRoom />} />
        </Route>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
  );
}

export default App;
