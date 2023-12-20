import QuestionAnswerRounded from "@mui/icons-material/QuestionAnswerRounded";
import { Button, CircularProgress, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import useDatas from "../../DataStore/useDatas";

function SignIn() {
  const [loading, setLoading] = useState(false);
  const [detailsVerifyed, setDetailsVerifyed] = useState(false);
  const navigate = useNavigate();
  const { Data } = useDatas();
  const {
    // getValues,
    handleSubmit,
    register,
    // setError,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (Data.isLoggedIn) {
      navigate("/");
    }
  }, [Data.isLoggedIn]);

  function handleSubmitAndSendOtp(data) {
    console.log(data);

    setLoading(true);
    if (data && !detailsVerifyed) {
      // do api request here
      setTimeout(() => {
        setDetailsVerifyed(true);
        setLoading(false);
      }, 2000);
    } else {
      // verify otp and set cookie and state here
      console.log("verify OTP", data.otp);
    }
  }

  return (
    <div
      className="flex flex-col flex-nowrap gap-2 justify-evenly py-5 items-center w-fit bg-white text-slate-700 p-6 max-sm:p-4 max-sm:w-10/12 rounded-md fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2"
      title="sign up"
    >
      <span className="text-sx font-semibold mb-5">
        <span className="uppercase text-purple-500 text-xl no-underline font-extrabold">
          <QuestionAnswerRounded />
          chatinger
        </span>
        <br />
        <i>
          <u>SignIn</u>
        </i>
      </span>
      <form
        onSubmit={handleSubmit(handleSubmitAndSendOtp)}
        className="flex flex-col flex-nowrap gap-2 justify-evenly items-center w-fit"
      >
        {!detailsVerifyed ? (
          <>
            <TextField
              disabled={loading}
              type="text"
              variant="filled"
              color="secondary"
              label="Username"
              helperText={
                errors?.username ? (
                  <span className="text-red-500">
                    {errors.username.message}
                  </span>
                ) : (
                  ""
                )
              }
              {...register("username", {
                required: "enter username to signin",
                pattern: {
                  value: /[a-z0-9]{10,50}/,
                  message: "username does not exists",
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
                  <span className="text-red-500">
                    {errors.password.message}
                  </span>
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
          </>
        ) : (
          <TextField
            type="number"
            variant="outlined"
            color="secondary"
            label="Email Verification OTP"
            helperText={
              errors?.otp ? (
                <span className="text-red-500">{errors.otp.message}</span>
              ) : (
                ""
              )
            }
            {...register("otp", {
              required: "OTP is Invalid",
              valueAsNumber: true,
              min: { value: 100000, message: "OTP is Invalid" },
              max: { value: 999999, message: "OTP is Invalid" },
            })}
          />
        )}
        {loading ? (
          <CircularProgress color="secondary" />
        ) : (
          <Button
            variant="contained"
            color="secondary"
            type="submit"
            sx={{ marginBottom: "15px" }}
          >
            SignIn
          </Button>
        )}
      </form>

      {!detailsVerifyed && (
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
