import { Avatar, Badge, styled } from "@mui/material";
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

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

function Friend({ name, id, last_message, username, hideSidebar, is_online }) {
  const activeStyle =
    "border-l-4 border-emerald-600 bg-emerald-200 text-slate-600";

  const { roomId } = useParams();
  const navigate = useNavigate();
  const isActive = roomId === id;

  return (
    <>
      <div
        className={`cursor-pointer py-1 pl-3 flex gap-3 flex-row flex-nowrap justify-start content-center  ${
          isActive ? activeStyle : "text-slate-100"
        }`}
        onClick={() => {
          if (!isActive) {
            hideSidebar && hideSidebar();
            navigate(`chat/${id}`);
          }
        }}
        aria-label={name}
        title={`Click to Chat with ${name}`}
      >
        <StyledBadge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          variant={is_online ? "dot" : ""}
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
        </StyledBadge>
        <div
          className={`capitalize overflow-hidden text-lg font-sans font-bold ${
            isActive && "shadow-red-400 drop-shadow-md"
          } flex flex-col flex-nowrap gap-0`}
        >
          {name?.slice(0, 19)}

          <span
            className={`${
              username.length > 1 ? "marquee" : ""
            } text-xs lowercase font-normal overflow-hidden whitespace-nowrap`}
          >
            {`${last_message || username.join(", ") || ""}`}
          </span>
        </div>
      </div>
      <center className="pt-1">
        <hr width="90%" className="h-1" />
      </center>
    </>
  );
}

Friend.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  last_message: PropTypes.string,
  username: PropTypes.arrayOf(PropTypes.string),
  hideSidebar: PropTypes.func,
  is_online: PropTypes.bool,
};

export default Friend;
