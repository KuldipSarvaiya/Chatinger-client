import axios from "axios";
import { useReducer } from "react";

function useDatas() {
  // default state of application when loaded
  const initialState = {
    isLoggedIn: false,
    auth: {
      id: "ok23ndjsaie",
      username: "kd_sarvaiya_",
      display_name: "kuldip sarvaiya",
      email: "kuldipsarvaiya94@gmail.com",
      jwt: "jwt-token",
      received_friend_requests: [
        { id: "111", name: "Kuldip Sarvaiya", type: "personal" },
        { id: "333", name: "Ankit Sarvaiya", type: "personal" },
        { id: "444", name: "Rajdeep Sarvaiya", type: "group" },
        { id: "555", name: "Dharmik Sarvaiya", type: "personal" },
        { id: "666", name: "Vikas Sarvaiya", type: "group" },
      ],
      chatrooms: [
        { id: "111", name: "Kuldip Sarvaiya", type: "personal" },
        { id: "333", name: "Ankit Sarvaiya", type: "personal" },
        { id: "444", name: "Rajdeep Sarvaiya", type: "group" },
        { id: "555", name: "Dharmik Sarvaiya", type: "personal" },
        { id: "666", name: "Vikas Sarvaiya", type: "group" },
      ],
    },
    socket: null,
    opened_chatrooms: new Map(),
    open_chatroom: new Map(),
  };

  //function that actualy chages the state of application,
  function updateData(prevState, props) {
    console.warn(`\n***********trying to change state with `,props);
    switch (props.type) {
      case "signin":
        return {
          ...prevState,
          isLoggedIn: true,
          auth: props.auth,
        };
      case "signout":
        console.log("signout function has called");
        return initialState;
      case "set_socket":
        return {
          ...prevState,
          socket: props.socket,
        };
      case "addnewchatroom":
        return {
          ...prevState,
          chatrooms: [...prevState.chatrooms, props.new_chatroom],
        };
      case "removefriendrequest":
        return {
          ...prevState,
          auth: {
            ...prevState.auth,
            received_friend_requests: prevState.auth.received_friend_requests.filter(
              (item) => item.id !== props.id
            ),
          },
        };
      case "openchatroom":
        return {
          ...prevState,
          opened_chatrooms: prevState.opened_chatrooms.set(
            props.room.id,
            props.room.IO
          ),
          open_chatroom: new Map().set(props.room.id, props.room.IO),
        };
      // case "closechatroom":
      default:
        return prevState;
    }
  }

  // application state defination
  const [Data, Dispatch] = useReducer(updateData, initialState);

  console.log("Data store reloaded = ", Data);

  // creating small function so changing state of application can make easy by convinent naming

  // will be used when signing in and complete creating new account
  const doSignIn = (auth) => {
    console.log("im into the doSignIn method");

    // setting default auth for every request
    axios.defaults.headers.common.Authorization = `bearer ${auth.jwt}`;
    document.cookie = auth.jwt;

    Dispatch({ type: "signin", auth });
  };
  // used for logout cases
  const doSignOut = () => {
    console.log(
      "\n\n*********im going to reset all state hoooo stop me if you can\n\n"
    );
    // setting default auth for every request
    axios.defaults.headers.common.Authorization = "bearer default_header";

    Dispatch({ type: "signout" });
  };
  // used only when user creates new group
  const addNewChatRoom = (chatroom) => {
    Dispatch({ type: "addnewchatroom", new_chatroom: chatroom });
  };
  const removeFriendRequest = (id) => {
    Dispatch({ type: "removefriendrequest", id });
  };
  const openChatRoom = (room) => {
    Dispatch({ type: "openchatroom", room });
  };
  // setting socket variable for global access
  const setSocket = (socket) => {
    Dispatch({ type: "set_socket", socket });
  };

  // returning state-data and state changing functions to whome invokes this custom hook
  return {
    Data,
    Dispatch,
    doSignIn,
    doSignOut,
    addNewChatRoom,
    removeFriendRequest,
    openChatRoom,
    setSocket,
  };
}

export default useDatas;
