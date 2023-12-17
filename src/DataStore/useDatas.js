import { useReducer } from "react";

function useDatas() {
  console.log("Data store reloaded");

  // default state of application when loaded
  const initialState = {
    isLoggedIn: false,
    auth: {
      id: "ok23ndjsaie",
      name: "kuldip sarvaiya",
      jwt: "jwt-token",
      friendrequests: [],
    },
    chatrooms: [
      { id: "111", name: "Kuldip Sarvaiya" }, 
      { id: "333", name: "Ankit Sarvaiya" },
      { id: "444", name: "Rajdeep Sarvaiya" },
      { id: "555", name: "Dharmik Sarvaiya" },
      { id: "666", name: "Vikas Sarvaiya" },
    ],
    currentopenchatroom: false,
  };

  //function that actualy chages the state of application,
  function updateData(state,props) {
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
      case "openchatroom":
        return {
          ...state,
          currentopenchatroom: props.id,
        };
      // case "closechatroom":
      default:
        return state;
    }
  }

  // appliaction state defination
  const [Data, Dispatch] = useReducer(updateData, initialState);

  console.log(Data);

  // creating small function so changing state of application can make easy
  // in whole application these functions are used to chage state
  // named function that it describes its usecase
  const doSignIn = (auth) => {
    Dispatch({ type: "signin", auth });
  };
  const doSignOut = () => {
    Dispatch({ type: "signout" });
  };
  const openChatRoom = (id) => {
    Dispatch({ type: "openchatroom", id });
  };

  // returning state-data and state changing functions
  return { Data, doSignIn, doSignOut, openChatRoom };
}

export default useDatas;
