import { Outlet, useParams } from "react-router-dom";
import NavBar from "../Widgets/NavBar";
import SideBar from "../Widgets/SideBar";

function Home() {
  const { roomId } = useParams();
  return (
    <>
      <NavBar />

      <span className="max-sm:hidden h-full">
        <SideBar />
      </span>

      <section className="absolute left-0 top-0 sm:pl-64 pt-12 w-full message-body flex justify-center items-center ">
        {roomId ? (
          <Outlet />
        ) : (
          <img
            src="assets/hey_user.svg"
            width={"700px"}
            height={"auto"} 
            alt=""
            className="drop-shadow-[0_25px_50px_rgba(255,255,255,1)]"
          />
        )}
      </section>
    </>
  );
}

export default Home;
