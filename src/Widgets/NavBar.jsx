import QuestionAnswerRounded from "@mui/icons-material/QuestionAnswerRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import { IconButton } from "@mui/material";
import { useState } from "react";
import SideBar from "../Widgets/SideBar";
import { useParams } from "react-router-dom";

function NavBar() {
  const [showSideBar, setShowSideBar] = useState(false);
  const { videoId } = useParams();
  console.log("Navbar reloaded");
  return (
    <>
      <div className="w-full border-b-2 px-0 absolute top-0 left-0 bg-purple-500 h-fit p-2 flex flex-row flex-nowrap align-middle gap-10 justify-center z-50">
        {!videoId && (
          <span className="absolute left-2 sm:hidden hover:text-green-500">
            <IconButton
              onClick={() => setShowSideBar((prev) => !prev)}
              color="inherit"
              size="large"
              style={{ padding: 3, margin: 0 }}
              aria-label="open friends menu"
            >
              {showSideBar ? <CloseRoundedIcon /> : <GroupsRoundedIcon />}
            </IconButton>
          </span>
        )}
        <span className="font-sans text-xl font-bold">
          <QuestionAnswerRounded /> Chatinger
        </span>
      </div>
      {/* side bar  */}
      {showSideBar && <SideBar />}
      {/* temporary */}
    </>
  );
}

export default NavBar;
