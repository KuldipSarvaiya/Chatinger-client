import { Link } from "react-router-dom";
import QuestionAnswerRoundedIcon from '@mui/icons-material/QuestionAnswerRounded';
function PageNotFound() {
  return (
    <>
      <div className="bg-white text-slate-700 p-10 max-sm:p-1 max-sm:w-11/12 rounded-md fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2" title="Page_Not_Found">
        <div className="p-10 rounded-md">
          <QuestionAnswerRoundedIcon />
          <div className="font-extrabold text-2xl">
            404 | <span className="font-normal text-base">Page Not Found</span>
          </div>
          <h3>
            Please Go Back To{" "}
            <Link to={"/"}>
              <span className="text-xl text-blue-600 font-bold underline">Home</span>
            </Link>{" "}
            Page
          </h3>
        </div>
      </div>
    </>
  );
}

export default PageNotFound;
