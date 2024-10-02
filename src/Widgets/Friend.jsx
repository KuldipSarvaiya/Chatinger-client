import { Avatar } from "@mui/material";
import PropTypes from "prop-types";
import { useNavigate, useParams } from "react-router-dom";

const alphabetColors = {
  a: "#EF4444",
  b: "#F59E0B",
  c: "#10B98",
  d: "#3B82F6",
  e: "#6366F1",
  f: "#8B5CF6",
  g: "#EC4899",
  h: "#6B7280",
  i: "#1F2937",
  j: "#D1D5DB",
  k: "#E25C52",
  l: "#93C5FD",
  m: "#A5B4FC",
  n: "#6EE7B7",
  o: "#FDE68A",
  p: "#FECACA",
  q: "#FBB6CE",
  r: "#D4CAEB",
  s: "#2563EB",
  t: "#4F46E5",
  u: "#047857",
  v: "#D97706",
  w: "#991B1B",
  x: "#BE185D",
  y: "#7C3AED",
  z: "#2563EB",
};

function Friend({ name, id, last_message, username }) {
  const activeStyle =
    "border-l-4 border-emerald-600 bg-emerald-200 text-slate-600";

  const { roomId } = useParams();
  const navigate = useNavigate();
  const isActive = roomId === id;

  return (
    <>
      <div
        className={`cursor-pointer py-2 pl-3 flex gap-3 flex-row flex-nowrap justify-start content-center  ${
          isActive ? activeStyle : "text-slate-100"
        }`}
        onClick={() => !isActive && navigate(`${id}`)}
        aria-label={name}
        title={`Click to Chat with ${name}`}
      >
        <Avatar
          variant="circular"
          sx={{ bgcolor: alphabetColors[name?.charAt(0).toLowerCase()] }}
          className="uppercase"
        >
          {name?.indexOf(" ") !== -1
            ? name?.split(" ")[0].charAt(0) + name?.split(" ")[1].charAt(0)
            : name?.split(" ")[0].charAt(0)}
        </Avatar>
        <div
          className={`capitalize text-lg font-sans font-bold ${
            isActive && "shadow-red-400 drop-shadow-md"
          } flex flex-col flex-nowrap gap-0`}
        >
          {name?.slice(0, 19)}
          <span className="text-xs lowercase font-normal overflow-hidden whitespace-nowrap">
            {`${last_message || username}`.slice(0, 28)}
          </span>
        </div>
      </div>
      <center className="">
        <hr width="90%" className="h-1" />
      </center>
    </>
  );
}

Friend.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  last_message: PropTypes.string,
  username: PropTypes.string.isRequired,
};

export default Friend;
