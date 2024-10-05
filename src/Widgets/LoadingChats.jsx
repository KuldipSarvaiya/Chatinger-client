import Loader from "./Loader";
import { Button } from "@mui/material";
import { RefreshOutlined } from "@mui/icons-material";

function LoadingChats() {
  return (
    <center>
      <p className="flex items-center">
        <span className="grid w-5 h-5">
          <Loader />
        </span>
        &nbsp;
        <b>Your Chat is Loading...</b>
      </p>
      <Button
        size="small"
        variant="outlined"
        color="inherit"
        startIcon={<RefreshOutlined />}
        onClick={() => {
          window.location.reload();
        }}
      >
        Refresh
      </Button>
    </center>
  );
}

export default LoadingChats;
