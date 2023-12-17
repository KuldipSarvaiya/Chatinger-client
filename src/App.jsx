// import Websocket from "./practice_pages/Websocket";
// import Socket from "./practice_pages/Socket";
// import SocketSingleRoom from "./practice_pages/SocketSingleRoom";
// import Streamwebsocket from "./practice_pages/StreamWebSocket";
import { Routes, Route } from "react-router-dom";
import PageNotFound from "./Pages/PageNotFound";
import Home from "./Pages/Home";
import ChatRoom from "./Pages/ChatRoom";
import SignIn from "./Pages/Login/SignIn";
import SignUp from "./Pages/Login/SignUp";

function App() {
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
