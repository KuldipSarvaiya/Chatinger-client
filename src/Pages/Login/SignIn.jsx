import QuestionAnswerRounded from "@mui/icons-material/QuestionAnswerRounded";
import { Button, CircularProgress, TextField } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Context } from "../../ContextProvider";

function SignIn() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { Data, doSignIn } = useContext(Context);
  const {
    // getValues,
    handleSubmit,
    register,
    setError,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (Data.isLoggedIn) {
      navigate("/");
    }
  }, []);

  async function handleSubmitSignin(data) {
    console.log(data);

    if (/\s/.test(data.username)) {
      setError("username", { message: "no whitespace character is allowed" });
      return;
    }

    setLoading(true);
    if (data) {
      try {
        const signinRes = await axios.post("/auth/signin", { ...data });
        console.log(signinRes.data);
        setLoading(false);
        if (signinRes.data.error)
          return setError("password", {
            message: "username or password is wrong",
          });

        doSignIn({ ...signinRes.data.user, jwt: signinRes.data.jwt });
        navigate("/", { replace: true });
      } catch (err) {
        setLoading(false);
        if (err?.response?.data?.error)
          setError("password", { message: "username or password is wrong" });
        else
          setError("password", {
            message: "Failed to signin, please try again",
          });
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <div className="flex flex-col flex-nowrap gap-2 justify-evenly py-5 items-center w-96 bg-white text-slate-700 p-6 max-sm:p-4 rounded-md fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
      <span className="text-sx font-semibold mb-5">
        <Link
          to={"/"}
          className="uppercase text-purple-500 text-xl no-underline font-extrabold"
        >
          <QuestionAnswerRounded />
          chatinger
        </Link>
        <br />
        <i>
          <u>SignIn</u>
        </i>
      </span>
      <form
        onSubmit={handleSubmit(handleSubmitSignin)}
        className="grid grid-cols-1 gap-2 justify-evenly items-center w-full"
      >
        <TextField
          disabled={loading}
          type="text"
          variant="filled"
          color="secondary"
          label="Username"
          helperText={
            errors?.username ? (
              <span className="text-red-500">{errors.username.message}</span>
            ) : (
              ""
            )
          }
          {...register("username", {
            required: "enter username to signin",
            pattern: {
              value: /^[a-z0-9_]{1,50}$/,
              message: "use small alpha-numeric values (1 to 50 chars)",
            },
          })}
        />

        <TextField
          disabled={loading}
          type="password"
          variant="filled"
          color="secondary"
          label="Password"
          helperText={
            errors?.password ? (
              <span className="text-red-500">{errors.password.message}</span>
            ) : (
              ""
            )
          }
          {...register("password", {
            required: "please enter the valid password",
            minLength: {
              value: 8,
              message: "password is wrong",
            },
          })}
        />

        {loading ? (
          <span className="max-w-fit place-self-center">
            <CircularProgress color="secondary" />
          </span>
        ) : (
          <Button
            variant="contained"
            color="secondary"
            type="submit"
            className="max-w-fit place-self-center"
            sx={{ marginBottom: "15px" }}
          >
            SignIn
          </Button>
        )}
      </form>

      {!loading && (
        <span className="text-lg capitalize text-gray-600 mb-2">
          need a new account?{" "}
          <Link to={"/signup"}>
            <i className="text-purple-500 font-semibold">
              <u>SignUp</u>
            </i>
          </Link>
        </span>
      )}
    </div>
  );
}

export default SignIn;
