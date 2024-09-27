import QuestionAnswerRounded from "@mui/icons-material/QuestionAnswerRounded";
import { Button, CircularProgress, TextField } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
// import useDatas from "../../DataStore/useDatas";
import axios from "axios";
import { Context } from "../../ContextProvider";

function SignUp() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // const { Data, doSignIn } = useDatas();
  const { Data, doSignIn } = useContext(Context);
  const {
    // getValues,
    handleSubmit,
    register,
    setError,
    formState: { errors },
  } = useForm();

  async function handleSaveUser(data) {
    console.log(data);
    if (data.username.length < 5 || data.username.length > 50) {
      setError("username", { message: "use atleast 5 to 50 characters" });
      return;
    }

    setLoading(true);
    if (data) {
      const signupRes = await axios.post("/auth/signup", { ...data });
      console.log(signupRes);
      setLoading(false);

      if (signupRes.data.type === "duplication") {
        return setError("username", {
          message: "Username already Exist",
        });
      }

      doSignIn({...signupRes.data.user, jwt: signupRes.data.jwt});

      navigate("/", { replace: true });
    }
  }

  useEffect(() => {
    if (Data.isLoggedIn) {
      navigate("/");
    }
  }, []);

  return (
    <div className="flex flex-col flex-nowrap gap-2 justify-evenly py-5 items-center w-96 bg-white text-slate-700 p-6 max-sm:p-4  rounded-md fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
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
          <u>SignUp</u>
        </i>
      </span>
      <form
        onSubmit={handleSubmit(handleSaveUser)}
        className="grid grid-cols-1 gap-2 justify-evenly items-center w-full"
      >
        <TextField
          disabled={loading}
          type="text"
          variant="filled"
          color="secondary"
          label="Display Name"
          placeholder="name to display in app"
          helperText={
            errors?.display_name ? (
              <span className="text-red-500">
                {errors.display_name.message}
              </span>
            ) : (
              ""
            )
          }
          {...register("display_name", {
            required: "enter name you want to display",
            maxLength: {
              value: 18,
              message: "please set name under 18 char",
            },
          })}
        />

        <TextField
          disabled={loading}
          type="text"
          variant="filled"
          color="secondary"
          label="Username"
          placeholder="register with unique username"
          helperText={
            errors?.username ? (
              <span className="text-red-500">{errors.username.message}</span>
            ) : (
              ""
            )
          }
          {...register("username", {
            required: "username is required to find you",
            pattern: {
              value: /^[a-z0-9_]{1,50}$/,
              message: "use small alpha-numeric values (1 to 50 chars)",
            },
            // setValueAs: (v) => v.toLowerCase(),
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
              message: "minimum 8 charecters are required",
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
            Signup
          </Button>
        )}
      </form>

      {!loading && (
        <span className="text-lg capitalize text-gray-600 mb-2">
          already have an account?{" "}
          <Link to={"/signin"}>
            <i className="text-purple-500 font-semibold">
              <u>SignIn</u>
            </i>
          </Link>
        </span>
      )}
    </div>
  );
}

export default SignUp;
