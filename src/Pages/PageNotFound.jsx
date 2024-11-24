import { Link } from "react-router-dom";
import QuestionAnswerRoundedIcon from "@mui/icons-material/QuestionAnswerRounded";

function PageNotFound() {
  return (
    <>
      <div className="bg-white text-slate-700 p-10 max-sm:p-1 max-sm:w-11/12 rounded-md fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
        <div className="p-10 rounded-md">
          <span className="text-purple-500 font-bold">
            <QuestionAnswerRoundedIcon /> Chatinger
          </span>
          <div className="text-red-500 w-full mb-2 font-extrabold text-2xl">
            404 | YOU ARE LOST !!
          </div>
          <span className="font-normal text-base">This page do not exists.</span>
          <h3>
            Please Go Back To{" "}
            <Link to={"/"}>
              <span
                className="text-xl text-blue-600 font-bold underline"
                title="Home"
              >
                Home
              </span>
            </Link>{" "}
            Page
          </h3>
        </div>
      </div>
    </>
  );
}

export default PageNotFound;
