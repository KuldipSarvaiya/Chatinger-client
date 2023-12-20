import { useReducer } from "react";

function useDatas() {
  console.log("Data store reloaded");

  // default state of application when loaded
  const initialState = {
    isLoggedIn: true,
    auth: {
      id: "ok23ndjsaie",
      username: "kd_sarvaiya_",
      display_name: "kuldip sarvaiya",
      email: "kuldipsarvaiya94@gmail.com",
      jwt: "jwt-token",
      friendrequests: [
        { id: "111", name: "Kuldip Sarvaiya", type: "personal" },
        { id: "333", name: "Ankit Sarvaiya", type: "personal" },
        { id: "444", name: "Rajdeep Sarvaiya", type: "group" },
        { id: "555", name: "Dharmik Sarvaiya", type: "personal" },
        { id: "666", name: "Vikas Sarvaiya", type: "group" },
      ],
    },
    chatrooms: [
      { id: "111", name: "Kuldip Sarvaiya", type: "personal" },
      { id: "333", name: "Ankit Sarvaiya", type: "personal" },
      { id: "444", name: "Rajdeep Sarvaiya", type: "group" },
      { id: "555", name: "Dharmik Sarvaiya", type: "personal" },
      { id: "666", name: "Vikas Sarvaiya", type: "group" },
    ],
    opened_chatrooms: new Map(),
    open_chatroom: new Map(),
  };

  //function that actualy chages the state of application,
  function updateData(state, props) {
    switch (props.type) {
      case "signin":
        return {
          ...state,
          isLoggedIn: true,
          auth: props.auth,
        };
      case "signout":
        console.log("signout function has called");
        return initialState;
      case "addnewchatroom":
        return {
          ...state,
          chatrooms: [...state.chatrooms, props.new_chatroom],
        };
      case "removefriendrequest":
        return {
          ...state,
          auth: {
            ...state.auth,
            friendrequests: state.auth.friendrequests.filter(
              (item) => item.id !== props.id
            ),
          },
        };
      case "openchatroom":
        return {
          ...state,
          opened_chatrooms: state.opened_chatrooms.set(
            props.room.id,
            props.room.IO
          ),
          open_chatroom: new Map().set(props.room.id, props.room.IO),
        };
      case "closechatroom":
      default:
        return state;
    }
  }

  // appliaction state defination
  const [Data, Dispatch] = useReducer(updateData, initialState);

  console.log(Data);

  // creating small function so changing state of application can make easy
  // in whole application these functions are used to change state
  // named function that it describes its usecase
  const doSignIn = (auth) => {
    Dispatch({ type: "signin", auth });
  };
  const doSignOut = () => {
    Dispatch({ type: "signout" });
  };
  const addNewChatRoom = (chatroom) => {
    Dispatch({ type: "addnewchatroom", new_chatroom: chatroom });
  };
  const removeFriendRequest = (id) => {
    Dispatch({ type: "removefriendrequest", id });
  };
  const openChatRoom = (room) => {
    Dispatch({ type: "openchatroom", room });
  };
  // returning state-data and state changing functions
  return {
    Data,
    Dispatch,
    doSignIn,
    doSignOut,
    addNewChatRoom,
    removeFriendRequest,
    openChatRoom,
  };
}

export default useDatas;
