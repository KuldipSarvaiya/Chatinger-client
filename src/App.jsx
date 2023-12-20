// import Websocket from "./practice_pages/Websocket";
// import Socket from "./practice_pages/Socket";
// import SocketSingleRoom from "./practice_pages/SocketSingleRoom";
// import Streamwebsocket from "./practice_pages/StreamWebSocket";
import { Routes, Route, useNavigate } from "react-router-dom";
import PageNotFound from "./Pages/PageNotFound";
import Home from "./Pages/Home";
import ChatRoom from "./Pages/ChatRoom";
import SignIn from "./Pages/Login/SignIn";
import SignUp from "./Pages/Login/SignUp";
import { useEffect } from "react";
import useDatas from "./DataStore/useDatas";

function App() {
  const { Data } = useDatas();
  const navigate = useNavigate();

  useEffect(() => {
    if (!Data.isLoggedIn) navigate("/signin");
  }, [Data.isLoggedIn]);

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
