/* eslint-disable react/prop-types */
import PropTypes from "prop-types";
import { createContext, useReducer } from "react";
import axios from "axios";

export const Context = createContext();

function ContextProvider({ children }) {
  const initialState = {
    isLoggedIn: false,
    auth: {
      _id: "",
      username: "",
      display_name: "",
      jwt: "",
      received_friend_requests: [],
      chatrooms: [],
    },
    socket: null,
    opened_chatrooms: new Map(),
    open_chatroom: new Map(),
  };

  //function that actualy chages the state of application,
  function updateData(prevState, props) {
    console.warn(`\n***********trying to change state with `, props);
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
          auth: {chatrooms: [...prevState.auth.chatrooms, props.new_chatroom],}
        };
      case "remove_chatroom":
        return {
          ...prevState,
          auth: {
            ...prevState.auth,
            chatrooms: prevState.auth.chatrooms.filter((room) => {
              return props._id !== room._id;
            }),
            opened_chatrooms: prevState.opened_chatrooms.filter((room) => {
              return props.chatroom._id !== room._id;
            }),
          },
        };
      case "removefriendrequest":
        return {
          ...prevState,
          auth: {
            ...prevState.auth,
            received_friend_requests: prevState.auth.received_friend_requests.filter(
              (item) => item._id !== props._id
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
      case "exit":
        return initialState;
      default:
        return prevState;
    }
  }

  // application state defination
  const [Data, Dispatch] = useReducer(updateData, initialState);

  console.log("Data store reloaded = ", Data);

  // ? creating small function so changing state of application can make easy by convinent naming

  // will be used when signing in and complete creating new account
  const doSignIn = (auth) => {
    console.log("im into the doSignIn method");
console.log(auth);

    // setting default auth for every request
    axios.defaults.headers.common.Authorization = `Bearer ${auth.jwt}`;
    window.localStorage.setItem("user", auth.jwt);

    Dispatch({ type: "signin", auth });
  };
  // used for logout cases
  const doSignOut = () => {
    console.log(
      "\n\n*********im going to reset all state hoooo stop me if you can\n\n"
    );
    // setting default auth for every request
    axios.defaults.headers.common.Authorization = "Bearer default_header";
    window.localStorage.clear();

    Dispatch({ type: "signout" });
  };
  // used only when user creates new group
  const addNewChatRoom = (chatroom) => {
    Dispatch({ type: "addnewchatroom", new_chatroom: chatroom });
  };
  const removeChatRoom = (chatroom_id) => {
    Dispatch({ type: "remove_chatroom", _id: chatroom_id });
  };
  const removeFriendRequest = (_id) => {
    Dispatch({ type: "removefriendrequest", _id });
  };
  const openChatRoom = (room) => {
    Dispatch({ type: "openchatroom", room });
  };
  // setting socket variable for global access
  const setSocket = (socket) => {
    Dispatch({ type: "set_socket", socket });
  };

  const setInitialState = () => {
    Dispatch({ type: "exit" });
  };

  return (
    <Context.Provider
      value={{
        Data,
        Dispatch,
        doSignIn,
        doSignOut,
        addNewChatRoom,
        removeChatRoom,
        removeFriendRequest,
        openChatRoom,
        setSocket,
        setInitialState
      }}
    >
      {children}
    </Context.Provider>
  );
}

ContextProvider.propTypes = {
  children: PropTypes.element.isRequired,
};

export default ContextProvider;
