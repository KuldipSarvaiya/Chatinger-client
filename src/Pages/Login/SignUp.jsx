import QuestionAnswerRounded from "@mui/icons-material/QuestionAnswerRounded";
import { Button, CircularProgress, TextField } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
// import useDatas from "../../DataStore/useDatas";
import axios from "axios";
import { Context } from "../../ContextProvider";

function SignUp() {
  const [loading, setLoading] = useState(false);
  const [detailsVerifyed, setDetailsVerifyed] = useState(false);
  const navigate = useNavigate();
  // const { Data, doSignIn } = useDatas();
  const { Data, doSignIn } = useContext(Context);
  const Temp = useRef(null);
  const {
    // getValues,
    handleSubmit,
    register,
    setError,
    formState: { errors },
  } = useForm();

  async function handleSubmitAndSendOtp(data) {
    console.log(data);

    // if username is not valid
    if (data.username.length < 10 || data.username.length > 50) {
      setError("username", { message: "use atleast 10 to 50 characters" });
      return;
    }
    
    // check for data is valid and otp sending state
    setLoading(true);
    if (data && !detailsVerifyed) {
      // do api request here
      const signupRes = await axios.post("/auth/signup", { ...data });
      console.log(signupRes);
      setLoading(false);

      // if no problem faced in sigin process
      if (!signupRes.data.error) {
        Temp.current = { ...signupRes.data };
        setDetailsVerifyed(true);
      } else if (signupRes.data.type === "duplication") {
        // if there any user with same username or email found then....
        setError("email", {
          message: "Email/Username already Exist",
        });
        setError("username", {
          message: "Email/Username already Exist",
        });
      }
      // if email verification otp not properly sent
      else alert(signupRes.data.message);
    } else {
      // verify otp and set cookie and state here
      if (Temp.current.otp === data.otp) {
        console.log("verify OTP", data.otp);
        alert("Email OTP Verified✅ : Welcome to Chatinger🗨️");

        // now, set this user acc to mongodb
        const regRes = await axios.post("/auth/register", {
          ...data,
          jwt: Temp.current.jwt,
          otp: undefined,
        });
        setLoading(false);
        console.log(regRes);

        // if there is any error while creating account in mongodb for this user
        if (regRes.data.error)
          setError("otp", {
            message: "can't register your account, please create new account",
          });
        //if no error then....
        console.log(regRes.data.user);
        doSignIn(regRes.data.user);
        navigate("/");
      } else {
        console.log("wrong otp");
        setError("otp", { message: "WRONG OTP SUBMITED !!" });
      }
    }
  }

  useEffect(() => {
    if (Data.isLoggedIn) {
      navigate("/");
    }
  }, []);

  return (
    <div
      className="flex flex-col flex-nowrap gap-2 justify-evenly py-5 items-center w-fit bg-white text-slate-700 p-6 max-sm:p-4 max-md:w-7/12 max-sm:w-10/12  rounded-md fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2"
      title="sign up"
    >
      <span className="text-sx font-semibold mb-5">
        <span className="uppercase text-purple-500 text-xl no-underline font-extrabold">
          <QuestionAnswerRounded />
          chatinger
        </span>
        <br />
        <i>
          <u>SignUp</u>
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
              label="Display Name"
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
                required: "username is required to find you",
                pattern: {
                  value: /[a-z0-9_-~@#^&|*.]{10,50}/,
                  message: "use small alphabets & numbers only",
                },
                // setValueAs: (v) => v.toLowerCase(),
              })}
            />

            <TextField
              disabled={loading}
              type="email"
              variant="filled"
              color="secondary"
              label="Email Address"
              helperText={
                errors?.email ? (
                  <span className="text-red-500">{errors.email.message}</span>
                ) : (
                  ""
                )
              }
              {...register("email", {
                required: "please enter valid email address",
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
                  message: "minimum 8 charecters are required",
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
            Signup
          </Button>
        )}
      </form>

      {!detailsVerifyed && (
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
