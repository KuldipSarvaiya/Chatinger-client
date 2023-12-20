import { useReducer } from "react";

function useDatas() {
  console.log("Data store reloaded");

  // default state of application when loaded
  const initialState = {
    isLoggedIn: false,
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
        return {
          ...state,
          isLoggedIn: false,
          auth: {},
        };
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
      case "logout":
        return initialState;
      default:
        return state;
    }
  }

  // appliaction state defination
  const [Data, Dispatch] = useReducer(updateData, initialState);

  // console.log(Data);

  // creating small function so changing state of application can make easy
  // in whole application these functions are used to chage state
  // named function that it describes its usecase
  const doSignIn = (auth) => {
    Dispatch({ type: "signin", auth });
  };
  const doSignOut = () => {
    Dispatch({ type: "signout" });
  };
  const logOut = () => { 
    Dispatch({ type: "logout" });
  };
  const addNewChatRoom = (chatroom) => {
    Dispatch({ type: "addnewchatroom", new_chatroom: chatroom });
  };
  const removeFriendRequest = (id) =>{
    Dispatch({ type: "removefriendrequest", id });
  }
  // returning state-data and state changing functions
  return { Data, doSignIn, doSignOut, logOut, addNewChatRoom, removeFriendRequest};
}

export default useDatas;
