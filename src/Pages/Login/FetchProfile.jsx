import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../ContextProvider";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../../Widgets/Loader";

function FetchProfile({ children }) {
  const { Data, doSignIn } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    const token = window.localStorage.getItem("user");
    if (!token || Data.isLoggedIn) return;

    setLoading(true);
    await axios
      .get("/auth/profile")
      .then((data) => {

        console.clear()
        console.log("\n\n*********** profile = ",data);

        if (!data.data.error) {
          doSignIn({ ...data.data.user, jwt: token });
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);

        setLoading(false);
        navigate("/signin");
      })
      .finally(() => {
        if (loading) setLoading(false);
      });
  }

  if (loading)
    return (
      <div className="grid w-screen h-screen place-content-center">
        <Loader />
      </div>
    );

  return <React.Fragment>{children}</React.Fragment>;
}

export default FetchProfile;
