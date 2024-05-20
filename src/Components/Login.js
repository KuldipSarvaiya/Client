import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Link,
  Modal,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  CircularProgress,
} from "@mui/material";
import { ArrowOutward, LoginOutlined, Warning } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { useCookie } from "react-use";
import { DecodeData, EncodeData } from "./SecureData";
import { Context } from "../Context";

function Login() {
  const [isLoading, setIsLoding] = useState(false);
  const { Dispatch } = useContext(Context);
  const [hasAcc, setHasAcc] = React.useState(true);
  const [rememberMe, setRememberMe] = React.useState(true);
  const [gender, setGender] = React.useState(null);
  const [validDtl, setValidDtl] = React.useState(false);
  const [forgotPass, setForgotPass] = React.useState(false);
  const [changePass, setChangePass] = React.useState(false);
  const [Alert, setAlert] = React.useState({ open: false, title: "", msg: "" });
  const DATA = React.useRef({});
  const navigate = useNavigate();
  const [logs, setLogs] = useCookie("logs");
  const { pathname } = useLocation();
  const seller = pathname !== "/login";

  // indexedDB.open('logs')

  useEffect(() => {
    if (logs !== null) {
      const logsInfo = DecodeData({ token: logs });
      Dispatch({ type: "set_user_role", role: logsInfo.role });
      logsInfo.role === "user" &&
        !seller &&
        navigate("/account", { replace: true });
      logsInfo.role === "seller" &&
        navigate("/seller_dashboard", { replace: true });
    }
  }, []);

  async function handleLoginSubmit(event) {
    event.preventDefault();

    //forgot password
    if (forgotPass === true) {
      const email = event.target[0].value.replaceAll(" ", "");
      if (validDtl === false) {
        const url = !seller
          ? "/user_login/forgot_password"
          : "/seller_dashboard/forgot_password";
        const res = await axios.post(url, { email });
        console.log(res);
        if (res.data.error) alert(res.data.message);
        else {
          DATA.current = { otp: parseInt(res.data.otp) };
          setValidDtl(true);
        }
      } else if (validDtl === true && changePass === false) {
        const otp = parseInt(event.target[1].value);
        if (DATA.current.otp === otp) {
          setChangePass(true);
        } else {
          setAlert({
            open: true,
            title: (
              <>
                <sub>
                  <Warning />
                </sub>
                Invalid OTP!
              </>
            ),
            msg: <b>OTP Is Incorrect Please ReType OTP</b>,
          });
        }
      } else if (changePass === true) {
        const fpass1 = event.target[3].value.replaceAll(" ", "");
        const fpass2 = event.target[4].value.replaceAll(" ", "");
        if (fpass1 === fpass2) {
          const url = !seller
            ? "/user_login/change_password"
            : "/seller_dashboard/change_password";
          const res = await axios.post(url, {
            email,
            password: fpass1,
          });
          console.log(res);
          alert("Password Sucessfuly RECOVERED");
          //setting axios header
          axios.defaults.headers.common.Authorization = `E-Cart ${res.data.jwt}`;
          // saving cookie
          const roles = seller ? "seller" : "user";
          const info = await EncodeData({
            jwt: res.data.jwt,
            role: roles,
            email: email,
            pass: fpass1,
            _oid: res.data.oid,
          });
          const expiryDate = new Date();
          expiryDate.setMonth(expiryDate.getMonth() + 1);

          if (rememberMe) {
            setLogs(info, {
              path: "/",
              expires: expiryDate,
              secure: true,
              // httpOnly: true,
            });
          } else {
            setLogs(info, {
              path: "/",
              secure: true,
              // httpOnly: true,
            });
          }

          Dispatch({ type: "set_user_role", role: roles });
          // navigate after succesful login
          seller
            ? navigate("/seller_dashboard", { replace: true })
            : navigate("/account", { replace: true });
        } else {
          alert("Both Password Are Not SAME");
        }
      }
    }
    // login with password
    else {
      const email = event.target[0].value.replaceAll(" ", "");
      const pass = event.target[1].value.replaceAll(" ", "");
      const otp = parseInt(event.target[2].value);
      if (validDtl === false) {
        if (pass.length >= 8) {
          const role = seller ? "seller" : "user";
          const url = seller ? "/seller_dashboard/login" : "/user_login/login";
          setIsLoding(true);
          const res = await axios.post(url, {
            role: role,
            email: email,
            password: pass,
          });
          console.log(res);
          if (res.data.error)
            alert(`Authentication Failed = ${res.data.message}`);
          else {
            DATA.current = {
              otp: parseInt(res.data.otp),
              jwt: res.data.jwt,
              oid: res.data.oid,
            };
            setValidDtl(true);
          }
          setIsLoding(false);
        } else
          setAlert({
            open: true,
            title: (
              <>
                <sub>
                  <Warning />
                </sub>
                Invalid Password!
              </>
            ),
            msg: (
              <>
                <b>Password Must Contain 8 Characters,</b>
                <br /> Use Numbers and Special Character for more secure
                password.
              </>
            ),
          });
      } else {
        if (otp !== DATA.current.otp) {
          setAlert({
            open: true,
            title: (
              <>
                <sub>
                  <Warning />
                </sub>
                Invalid OTP!
              </>
            ),
            msg: <b>OTP Is Incorrect Please ReType OTP</b>,
          });
        } else {
          // set state of user in context
          alert("Login Succesful");
          axios.defaults.headers.common.Authorization = `E-Cart ${DATA.current.jwt}`;
          // saving cookie
          const roles = seller ? "seller" : "user";
          const info = await EncodeData({
            jwt: DATA.current.jwt,
            role: roles,
            email: email,
            pass: pass,
            _oid: DATA.current.oid,
          });
          const expiryDate = new Date();
          expiryDate.setMonth(expiryDate.getMonth() + 1);

          console.log("From Login = ", info);
          if (rememberMe) {
            setLogs(info, {
              path: "/",
              expires: expiryDate,
              secure: true,
              // httpOnly: true,
            });
          } else {
            setLogs(info, {
              path: "/",
              secure: true,
              // httpOnly: true,
            });
          }

          Dispatch({ type: "set_user_role", role: roles });
          // navigate after succesful login
          seller
            ? navigate("/seller_dashboard", { replace: true })
            : navigate("/account", { replace: true });
        }
      }
    }
  }

  async function handleRegisterSubmit(event) {
    event.preventDefault();
    const name = event.target[0].value; //name
    const surname = event.target[1].value; //surname
    const email = event.target[2].value.replaceAll(" ", ""); //email
    const phone = Number(event.target[3].value); //mobile number
    const password = event.target[4].value.replaceAll(" ", ""); //password
    const sex = gender; //gender
    //// console.log(event.target[7].value);male
    // // console.log(event.target[8].value);female
    const payment = event.target[5].value; //payment
    const address = event.target[6].value; //address
    const otp = Number(event.target[10].value); //otp

    console.log({
      role: seller ? "seller" : "user",
      name: name,
      surname: surname,
      email: email,
      number: phone,
      password: password,
      gender: sex,
      payment: payment,
      address: address,
    });

    if (validDtl === false) {
      // make server requext and send mail otp
      // also save detalis of that user
      const Tel = parseInt(event.target[3].value);
      if (Tel > 9999999999 || Tel < 999999999) {
        setAlert({
          open: true,
          title: (
            <>
              {" "}
              <sub>
                {" "}
                <Warning />{" "}
              </sub>{" "}
              Invalid Mobile Number!
            </>
          ),
          msg: (
            <>
              {" "}
              <b>Mobile Number Must Contain 10 Digits,</b>{" "}
            </>
          ),
        });
      } else {
        // checking password
        if (password.replaceAll(" ", "").length >= 8) {
          // checking address
          if (address.split(",").length === 9 && address.length > 40) {
            const add = seller ? "shop_address" : "address";
            const role = seller ? "seller" : "user";
            const url = !seller
              ? "/user_login/register"
              : "/seller_dashboard/register";
            setIsLoding(true);
            const res = await axios.post(url, {
              role: role,
              name: name,
              surname: surname,
              password: password,
              email: email,
              phone: phone,
              [add]: address,
              payment_dtl: payment,
              gender: sex,
            });
            console.log(res);
            if (res.data.error)
              alert(`Server Side Error In Register = ${res.data.message}`);
            else {
              DATA.current = parseInt(res.data.otp);
              setValidDtl(true);
            }
            setIsLoding(false);
          } else {
            setAlert({
              open: true,
              title: (
                <>
                  <sub>
                    <Warning />
                  </sub>
                  Invalid Address Formate!
                </>
              ),
              msg: (
                <>
                  <b>Please Follow The Address Formate,</b>
                  <br />
                  Put 8 ',' Signs To Saperate Information in Address
                  <br /> As Show In Place Holder
                  <br />
                  <b>
                    -{"> "}
                    Hno,socity/street,area,city/village,Taluka,Dist,State,India,PIN
                  </b>
                  <br /> <center>or</center>
                  <br />
                  <b>Fill Enough Details (At Least 40 Characters)</b>
                </>
              ),
            });
          }
        } else
          setAlert({
            open: true,
            title: (
              <>
                <sub>
                  <Warning />
                </sub>
                Invalid Password!
              </>
            ),
            msg: (
              <>
                <b>Password Must Contain 8 Characters,</b>
                <br /> Use Numbers and Special Character for more secure
                password.
              </>
            ),
          });
      }
    } else {
      if (otp === DATA.current) {
        alert("Successfuly registered");

        const role = seller ? "seller" : "user";
        const url = !seller
          ? "/user_login/confirm_user"
          : "/seller_dashboard/confirm_user";
        const add = seller ? "shop_address" : "address";

        const res = await axios.post(url, {
          role: role,
          name: name,
          surname: surname,
          password: password,
          email: email,
          phone: phone,
          [add]: address,
          payment_dtl: payment,
          gender: sex,
        });

        if (!res.error) {
          axios.defaults.headers.common.Authorization = `E-Cart ${res.data.jwt}`;
          // saving cookie
          const roles = seller ? "seller" : "user";
          const info = await EncodeData({
            jwt: res.data.jwt,
            role: roles,
            email: email,
            pass: password,
            _oid: res.data._id,
          });
          const expiryDate = new Date();
          expiryDate.setMonth(expiryDate.getMonth() + 1);

          console.log("From Register Confirm = ", res);
          if (rememberMe) {
            setLogs(info, {
              path: "/",
              expires: expiryDate,
              secure: true,
              // httpOnly: true,
            });
          } else {
            setLogs(info, {
              path: "/",
              secure: true,
              // httpOnly: true,
            });
          }

          Dispatch({ type: "set_user_role", role: roles });
          // navigate after succesful login
          seller
            ? navigate("/seller_dashboard", { replace: true })
            : navigate("/account", { replace: true });
        } else {
          alert(`Can Not Registered bcuzz.. ${res.message}`);
        }
      } else {
        // console.log(typeof otp, typeof DATA.current);
        setAlert({
          open: true,
          title: (
            <>
              <sub>
                <Warning />
              </sub>
              Invalid OTP!
            </>
          ),
          msg: <b>OTP Is Incorrect Please ReType OTP</b>,
        });
      }
    }
  }

  const Style = {
    padding: "20px",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    display: "block",
    minWidth: "25%",
    maxWidth: "95%",
    textAlign: "center",
    maxHeight: window.innerHeight - 120,
    overflow: "auto",
  };

  return (
    <>
      <Modal open>
        {hasAcc ? (
          <Paper sx={Style}>
            <h1 style={{ textAlign: "center" }} className="footer-content">
              Sign In
            </h1>
            <br />
            <form method="GET" onSubmit={(e) => handleLoginSubmit(e)}>
              <TextField
                disabled={validDtl || changePass}
                // defaultValue={logs.email || " "}
                name={"email"}
                variant="filled"
                type="email"
                color="info"
                label="E-MAIL"
                helperText=""
                required
                sx={{ margin: "20px 0px", width: "300px", maxWidth: "90%" }}
              />
              <br />
              {!forgotPass && (
                <TextField
                  disabled={validDtl}
                  name={"password"}
                  // defaultValue={logs.pass || " "}
                  variant="filled"
                  type="password"
                  color="info"
                  label="PASSWORD"
                  helperText="#we will ignore all whitespaces"
                  required
                  sx={{ margin: "20px 0px", width: "300px", maxWidth: "90%" }}
                />
              )}
              <br />
              {validDtl && (
                <TextField
                  disabled={changePass}
                  name={"otp"}
                  variant="outlined"
                  type="number"
                  color="info"
                  label="OTP"
                  helperText=""
                  required
                  sx={{ margin: "20px 0px" }}
                />
              )}
              <br />
              {changePass && (
                <>
                  <TextField
                    name={"fpassword1"}
                    variant="filled"
                    type="password"
                    color="info"
                    label="CREATE PASSWORD"
                    helperText="#we will ignore all whitespaces"
                    required
                    sx={{ margin: "20px 0px", width: "300px", maxWidth: "90%" }}
                  />
                  <br />
                  <TextField
                    name={"fpassword2"}
                    variant="filled"
                    type="password"
                    color="info"
                    label="CONFIRM PASSWORD"
                    helperText="#we will ignore all whitespaces"
                    required
                    sx={{ margin: "20px 0px", width: "300px", maxWidth: "90%" }}
                  />
                  <br />
                </>
              )}

              {isLoading ? (
                <CircularProgress />
              ) : (
                <Button
                  type="submit"
                  variant="outlined"
                  sx={{ margin: "20px 0px" }}
                >
                  sign in <LoginOutlined />
                </Button>
              )}
            </form>
            {!forgotPass && (
              <span>
                oops.. Password Out Of Mind!👉🏻
                <Button size={"small"} onClick={() => setForgotPass(true)}>
                  recover password?
                </Button>
              </span>
            )}
            <br />
            <span>
              <Checkbox
                checked={rememberMe}
                onChange={() => {
                  setRememberMe((prev) => !prev);
                }}
              />
              Do You Want Us To Remember You?✔️
            </span>
            <br />
            {(!validDtl || !changePass) && (
              <span className="footer-content cursor-pointer">
                Need An Account?{" "}
                <Link
                  onClick={() => {
                    setHasAcc(false);
                    if (isLoading) setIsLoding(false);
                    setValidDtl(false);
                  }}
                >
                  Get Now
                  <sub>
                    <ArrowOutward />
                  </sub>
                </Link>
              </span>
            )}
          </Paper>
        ) : (
          <Paper sx={Style}>
            <h1 style={{ textAlign: "center" }} className="footer-content">
              Sign Up
            </h1>
            <form
              method="GET"
              onSubmit={(e) => handleRegisterSubmit(e)}
              className="register-form"
            >
              <TextField
                disabled={validDtl}
                name={"name"}
                variant="filled"
                type="text"
                color="info"
                label="NAME"
                helperText=""
                required
                sx={{ width: "300px", maxWidth: "90%" }}
              />
              <TextField
                disabled={validDtl}
                name={"surname"}
                variant="filled"
                type="text"
                color="info"
                label="SURNAME"
                helperText=""
                required
                sx={{ width: "300px", maxWidth: "90%" }}
              />
              <TextField
                disabled={validDtl}
                name={"email"}
                variant="filled"
                type="email"
                color="info"
                label="E-MAIL"
                helperText=""
                required
                sx={{ width: "300px", maxWidth: "90%" }}
              />
              <TextField
                disabled={validDtl}
                name={"phone"}
                variant="filled"
                type="tel"
                color="info"
                label="MOBILE NO."
                helperText="Only Used For Your Product Delivery Purpose"
                required
                sx={{ width: "300px", maxWidth: "90%" }}
              />
              <TextField
                disabled={validDtl}
                name={"password"}
                variant="filled"
                type="password"
                color="info"
                label="PASSWORD"
                helperText="#we will ignore all whitespaces"
                required
                sx={{ width: "300px", maxWidth: "90%" }}
              />
              <TextField
                disabled={validDtl}
                name={"payment-details"}
                variant="filled"
                type="text"
                color="info"
                label="PAYMENT DETAILS"
                required
                sx={{ width: "300px", maxWidth: "90%" }}
              />
              <TextField
                disabled={validDtl}
                name={"address"}
                variant="filled"
                type="text"
                color="info"
                label="Address"
                helperText="Follow The Shown Address Formate"
                placeholder={
                  "Hno,socity/street,area,city/village,Taluka,Dist,State,India,PIN"
                }
                required
                multiline
                sx={{ width: "300px", maxWidth: "90%" }}
              />
              GENDER :
              <sup>
                <RadioGroup
                  row
                  value={gender}
                  onChange={(e) => {
                    setGender(e.target.value);
                  }}
                >
                  <FormControlLabel
                    value="male"
                    disabled={validDtl}
                    control={<Radio />}
                    label="Male"
                    required
                  />
                  <FormControlLabel
                    disabled={validDtl}
                    value="female"
                    control={<Radio />}
                    label="Female"
                    required
                  />
                </RadioGroup>
              </sup>
              {validDtl && (
                <TextField
                  name={"otp"}
                  variant="outlined"
                  type="number"
                  color="info"
                  label="OTP"
                  helperText=""
                  required
                />
              )}
              {isLoading ? (
                <CircularProgress />
              ) : (
                <Button
                  type="submit"
                  variant="outlined"
                  sx={{ margin: "20px 0px" }}
                >
                  sign up <LoginOutlined />
                </Button>
              )}
            </form>
            <span>
              <Checkbox
                checked={rememberMe}
                onChange={() => {
                  setRememberMe((prev) => !prev);
                }}
              />
              Do You Want Us To Remember You?✔️
            </span>
            <br />
            {!validDtl && (
              <span className="footer-content cursor-pointer">
                Just Remembered!,Already Have An Account?{" "}
                <Link
                  onClick={() => {
                    setHasAcc(true);
                    if (isLoading) setIsLoding(false);
                    setValidDtl(false);
                  }}
                >
                  Sign In
                  <sub>
                    <ArrowOutward />
                  </sub>
                </Link>
              </span>
            )}
          </Paper>
        )}
      </Modal>
      {/* Alert Dialog Box */}
      <Dialog
        open={Alert.open}
        onClose={() =>
          setAlert((prev) => {
            return { ...prev, open: false };
          })
        }
      >
        <DialogTitle>{Alert.title}</DialogTitle>
        <DialogContent>{Alert.msg}</DialogContent>
      </Dialog>
    </>
  );
}

export default Login;
