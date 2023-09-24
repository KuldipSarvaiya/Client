import {
  Accordion,
  AccordionSummary,
  Button,
  styled,
  Paper,
  Switch,
  Stack,
  TextField,
  AccordionActions,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";
import React from "react";
import { Context } from "../../Context";
import { ChangeCircle, ExpandMore, Save } from "@mui/icons-material";
import axios from "axios";
import { useCookie } from "react-use";
import { useNavigate } from "react-router-dom";
import dotenv from "dotenv";
dotenv.config();

function SD_Account() {
  const [expanded, setExpanded] = React.useState(false);
  const [changeProf, setChangeProf] = React.useState(false);
  // context for themeing only
  const { Data, Dispatch } = React.useContext(Context);
  const [, , deleteLogs] = useCookie("logs");
  const [, , deleteRole] = useCookie("role");
  const navigate = useNavigate();
  const [User, setUser] = React.useState({
    name: "Loading...",
    surname: "Loading...",
    gender: "Loading...",
    password: "Loading...",
    email: "Loading...",
    phone: "Loading...",
    payment_dtl: "Loading...",
    address: {
      house_no: "Loading...",
      socity: "Loading...",
      area: "Loading...",
      city: "Loading...",
      taluka: "Loading...",
      district: "Loading...",
      state: "Loading...",
      country: "Loading...",
      pincode: "Loading...",
    },
  });

  React.useEffect(() => {
    if (
      Data.Changed.Account &&
      Data.Changed.HeaderJWT_set &&
      axios.defaults.headers.common.Authorization !==
        process.env.HEADER_COMMON_AUTH
    ) {
      (async function () {
        const res = await axios.get(`/seller_dashboard/account`);
        console.log(res);
        if (!res.data.error) {
          Dispatch({ type: "set_account", account: res.data });
          setUser(res.data);
          console.log("Values of responce from account", res.data);
        } else alert(res.data.message);
      })();
    } else setUser(Data.Account);
  }, [
    Data.Changed.Account,
    Data.Changed.HeaderJWT_set,
    axios.defaults.headers.common.Authorization,
  ]);

  function handleChangeUser(event) {
    const name = event.target.name;
    const value = event.target.value;
    console.log(name, value, event);
    setUser((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  }
  function handleChangeUserAddress(event) {
    const name = event.target.name;
    const value = event.target.value;
    setUser((prev) => {
      return {
        ...prev,
        address: {
          ...prev.address,
          [name]: value,
        },
      };
    });
  }
  function handlePanelChange(isExpanded, panel) {
    setExpanded(isExpanded ? panel : false);
  }

  async function saveChangeProf() {
    //save profile details and then
    // Dispatch({ type: "change_user_dtl", new_dtl: User });
    const res = await axios.put(`/seller_dashboard/account`, { user: User });
    console.log(res);
    if (!res.data.error) {
      Dispatch({ type: "set_account", account: User });
      setChangeProf(false);
    }
    alert(res.data.message);
  }

  const ThemeSwitch = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 34,
    padding: 7,
    "& .MuiSwitch-switchBase": {
      margin: 1,
      padding: 0,
      transform: "translateX(6px)",
      "&.Mui-checked": {
        color: "#fff",
        transform: "translateX(22px)",
        "& .MuiSwitch-thumb:before": {
          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
            "#fff"
          )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
        },
        "& + .MuiSwitch-track": {
          opacity: 1,
          backgroundColor:
            theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
        },
      },
    },
    "& .MuiSwitch-thumb": {
      backgroundColor: theme.palette.mode === "dark" ? "#003892" : "#001e3c",
      width: 32,
      height: 32,
      "&:before": {
        content: "''",
        position: "absolute",
        width: "100%",
        height: "100%",
        left: 0,
        top: 0,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          "#fff"
        )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
      },
    },
    "& .MuiSwitch-track": {
      opacity: 1,
      backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
      borderRadius: 20 / 2,
    },
  }));

  return (
    <>
      <Paper
        sx={{
          width: "90%",
          margin: "20px",
          // padding: "10px",
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          marginBottom: "70px",
          boxShadow: "none",
        }}
      >
        {/* <p className="h2">
          Hello, {User.name} {User.surname}
        </p> */}

        {!(User !== undefined ? User.error : true) ? (
          <p className="h2">
            Hello👋🏻 {User.name} {User.surname}
          </p>
        ) : (
          <p className="h2">Hello👋🏻</p>
        )}

        {/* Profile details */}
        <Accordion
          elevation={10}
          expanded={expanded === "panel1"}
          onChange={(e, isexp) => handlePanelChange(isexp, "panel1")}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <p className="h3">Your Profile Details</p>
          </AccordionSummary>
          {!User ? (
            <center style={{ margin: "auto" }}>
              <CircularProgress />
            </center>
          ) : (
            <AccordionSummary>
              <Stack
                display="flex"
                flexDirection={"row"}
                justifyContent={"space-evenly"}
                gap="10px"
                flexWrap={"wrap"}
              >
                <TextField
                  label="Name"
                  value={User.name}
                  inputProps={{ readOnly: !changeProf }}
                  name="name"
                  onChange={(e) => {
                    handleChangeUser(e);
                  }}
                />
                <TextField
                  label="Surname"
                  value={User.surname}
                  inputProps={{ readOnly: !changeProf }}
                  name="surname"
                  onChange={(e) => {
                    handleChangeUser(e);
                  }}
                />
                <TextField
                  label="Password"
                  value={User.password}
                  inputProps={{ readOnly: true }}
                  type="password"
                  name="password"
                  onChange={(e) => {
                    handleChangeUser(e);
                  }}
                />
                <TextField
                  label="E-Mail"
                  value={User.email}
                  inputProps={{ readOnly: true }}
                  name="email"
                  onChange={(e) => {
                    handleChangeUser(e);
                  }}
                />
                <TextField
                  label="Phone Number"
                  value={User.phone}
                  inputProps={{ readOnly: !changeProf }}
                  name="phone"
                  onChange={(e) => {
                    handleChangeUser(e);
                  }}
                />
                <TextField
                  label="Payment Details"
                  value={User.payment_dtl}
                  inputProps={{ readOnly: !changeProf }}
                  name="payment_dtl"
                  onChange={(e) => {
                    handleChangeUser(e);
                  }}
                />

                <Stack component={"div"} width={"100%"} className="h4">
                  Address Details
                </Stack>
                <TextField
                  label="House Number"
                  value={User.address.house_no}
                  inputProps={{ readOnly: !changeProf }}
                  name="house_no"
                  onChange={(e) => {
                    handleChangeUserAddress(e);
                  }}
                />
                <TextField
                  label="Socity / Street"
                  value={User.address.socity}
                  inputProps={{ readOnly: !changeProf }}
                  name="socity"
                  onChange={(e) => {
                    handleChangeUserAddress(e);
                  }}
                />
                <TextField
                  label="Area"
                  value={User.address.area}
                  inputProps={{ readOnly: !changeProf }}
                  name="reference"
                  onChange={(e) => {
                    handleChangeUserAddress(e);
                  }}
                />
                <TextField
                  label="City / Village"
                  value={User.address.city}
                  inputProps={{ readOnly: !changeProf }}
                  name="city"
                  onChange={(e) => {
                    handleChangeUserAddress(e);
                  }}
                />
                <TextField
                  label="Taluka"
                  value={User.address.taluka}
                  inputProps={{ readOnly: !changeProf }}
                  name="taluka"
                  onChange={(e) => {
                    handleChangeUserAddress(e);
                  }}
                />
                <TextField
                  label="District"
                  value={User.address.district}
                  inputProps={{ readOnly: !changeProf }}
                  name="district"
                  onChange={(e) => {
                    handleChangeUserAddress(e);
                  }}
                />
                <TextField
                  label="State"
                  value={User.address.state}
                  inputProps={{ readOnly: !changeProf }}
                  name="state"
                  onChange={(e) => {
                    handleChangeUserAddress(e);
                  }}
                />
                <TextField
                  label="Country"
                  value={User.address.country}
                  disabled
                  name="country"
                  onChange={(e) => {
                    handleChangeUserAddress(e);
                  }}
                />
                <TextField
                  label="Pincode"
                  value={User.address.pincode}
                  inputProps={{ readOnly: !changeProf }}
                  name="pincode"
                  onChange={(e) => {
                    handleChangeUserAddress(e);
                  }}
                />
              </Stack>
            </AccordionSummary>
          )}
          <AccordionActions>
            {changeProf ? (
              <Button
                variant="contained"
                size="small"
                onClick={() => saveChangeProf()}
              >
                <Save /> Save Changes
              </Button>
            ) : (
              <Button
                variant="contained"
                size="small"
                onClick={() => setChangeProf(true)}
              >
                <ChangeCircle /> Change Profile Details
              </Button>
            )}
          </AccordionActions>
        </Accordion>

        {/* web settings */}
        <Accordion
          elevation={10}
          expanded={expanded === "panel5"}
          onChange={(e, isexp) => handlePanelChange(isexp, "panel5")}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <p className="h3">Web Settings</p>
          </AccordionSummary>
          <AccordionSummary>
            <div className="settings-main-div">
              <div className="settings-sub-div">
                <p className="h4 flexgrow">Change Theme </p>
                <FormControlLabel
                  checked={Data.DarkTheme}
                  control={<ThemeSwitch sx={{ m: 1 }} />}
                  onChange={() => {
                    Dispatch({ type: "change_theme" });
                  }}
                />
              </div>
              <hr width="90%" />
              <div className="settings-sub-div">
                <p className="h4 flexgrow">Instant Log Out </p>
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  onClick={() => {
                    deleteLogs();
                    deleteRole();
                    axios.defaults.headers.common.Authorization =
                      "E-Cart this_is_JWT_loaded_by_axios";
                    Dispatch({ type: "reset_account" });
                    navigate("/", { replace: true });
                  }}
                >
                  LogOut
                </Button>
              </div>
            </div>
          </AccordionSummary>
        </Accordion>

        {/* T & C */}
        <Accordion
          elevation={10}
          expanded={expanded === "panel6"}
          onChange={(e, isexp) => handlePanelChange(isexp, "panel6")}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <p className="h3">Terms of Use</p>
          </AccordionSummary>
          <AccordionSummary>Juk ke rehna padega mere aage</AccordionSummary>
        </Accordion>
        <br />
        <br />
        <br />
      </Paper>
    </>
  );
}

export default SD_Account;
