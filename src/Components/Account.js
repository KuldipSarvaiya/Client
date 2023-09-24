import React from "react";
import axios from "axios";
import {
  Accordion,
  AccordionActions,
  AccordionSummary,
  Button,
  CircularProgress,
  FormControlLabel,
  Paper,
  Rating,
  Stack,
  Switch,
  TextField,
  styled,
} from "@mui/material";
import {
  // ArrowCircleUp,
  Cancel,
  ChangeCircle,
  CreditScore,
  ExpandMore,
  Money,
  Save,
} from "@mui/icons-material";
import ProductCard from "./ProductCard";
import { Context } from "../Context";
import { nanoid } from "nanoid";
import { useParams } from "react-router-dom";
import Footer from "./Footer";
import { useCookie } from "react-use";
import { useNavigate } from "react-router-dom";
// import { DecodeData } from "./SecureData";
import dotenv from "dotenv";
dotenv.config();

function Account() {
  //for panel expand
  const [expanded, setExpanded] = React.useState(false);
  const [changeProf, setChangeProf] = React.useState(false);
  const { Data, Dispatch } = React.useContext(Context);
  const { panel } = useParams();
  // const [User, setUser] = React.useState(Data.User);
  const [Datas, setDatas] = React.useState(undefined);
  const [logs, , deleteLogs] = useCookie("logs");
  const [, , deleteRole] = useCookie("role");
  const navigate = useNavigate();

  React.useEffect(() => {
    if (panel !== undefined) {
      setExpanded(panel);
    }
  }, [panel]);

  React.useEffect(() => {
    if (logs !== null)
      (async function () {
        if (
          Data.Changed.Account &&
          axios.defaults.headers.common.Authorization !==
            process.env.HEADER_COMMON_AUTH
        ) {
          const res = await axios.get("/account");
          console.log("account Responce  = ", res);
          if (res.data.error === true) {
            alert(res.data.message);
          } else {
            setDatas(res.data);
            Dispatch({ type: "set_account", account: res.data });
          }
        } else {
          setDatas(Data.Account);
        }
      })();
    else navigate("/login", { replace: true });
  }, [axios.defaults.headers.common.Authorization]);

  function handleChangeUser(event) {
    const name = event.target.name;
    const value = event.target.value;
    console.log(name, value, event);
    setDatas((prev) => {
      return {
        ...prev,
        User: {
          ...prev.User,
          [name]: value,
        },
      };
    });
  }
  function handleChangeUserAddress(event) {
    const name = event.target.name;
    const value = event.target.value;
    setDatas((prev) => {
      return {
        ...prev,
        User: {
          ...prev.User,
          address: {
            ...prev.User.address,
            [name]: value,
          },
        },
      };
    });
  }

  function handlePanelChange(isExpanded, panel) {
    setExpanded(isExpanded ? panel : false);
  }

  async function saveChangeProf() {
    //save profile details and then
    const res = await axios.put("/account", { User: Datas.User });
    console.log(res);
    if (!res.data.error) {
      Dispatch({ type: "set_account", account: Datas });
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

  function Orders({
    _ID,
    P_ID,
    IMAGE,
    PRODUCT_NAME,
    TOTAL,
    QUANTITY,
    // SHORT_DESCRIPTION,
    PAYMENT_MODE,
    DELIVERY_STATUS,
    SELLER_NAME,
    SELLER_CONTECT,
    COLOR,
    SIZE,
    // AVAILABLE_COLOR,
    // AVAILABLE_SIZE,
    createdAt,
    updatedAt,
    order_completed,
    // ratinged,
  }) {
    const [rev, setRev] = React.useState(false);
    const review = React.useRef();
    const rating = React.useRef();

    function handleClick() {
      navigate(
        `/product/${P_ID}${
          COLOR !== "N/A" && SIZE !== "N/A"
            ? "?color=" + COLOR + "&size=" + SIZE
            : COLOR !== "N/A"
            ? "?color=" + COLOR
            : SIZE !== "N/A" && "?size=" + SIZE
        }`
      );
    }

    return (
      <Paper
        elevation={10}
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-evenly",
          gap: "3px",
          width: {
            xs: "100%",
            sm: "100%",
            md: "90%",
            lg: "50%",
            xl: "48%",
          },
          padding: "5px",
        }}
      >
        <Stack
          sx={{
            width: {
              xs: "230px",
              sm: "150px",
              md: "180px",
              lg: "150px",
              xl: "150px",
            },
            alignSelf: "center",
            // flexShrink:1
          }}
          onClick={handleClick}
        >
          <img src={IMAGE} alt="item Immge" />
        </Stack>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flexWrap: "nowrap",
            placeContent: "space-evenly",
          }}
        >
          <span className="h3" onClick={handleClick}>
            {PRODUCT_NAME || "This Is Product Name"}
          </span>
          <span>
            <div
              style={{
                margin: "0px",
                padding: "0px 5px 0px 5px",
                border: "1px solid black",
                borderRadius: "5px",
              }}
              onClick={handleClick}
            >
              Qty : {QUANTITY}
              {COLOR !== "N/A" && <> | Color : {COLOR}</>}
              {SIZE !== "N/A" && <> | Size : {SIZE}</>}
            </div>
          </span>
          <span>
            <b
              style={{
                margin: "0px",
                padding: "0px 5px 0px 5px",
                border: "1px solid black",
                borderRadius: "5px",
              }}
              onClick={handleClick}
            >
              &#8377;Total : {TOTAL} &nbsp;|&nbsp; {PAYMENT_MODE}
              <sub>{PAYMENT_MODE === "COD" ? <Money /> : <CreditScore />}</sub>
            </b>
          </span>
          <span>
            <Button
              variant="contained"
              size="small"
              color="info"
              disabled={rev || order_completed}
              sx={{ padding: "3px 10px", verticalAlign: "middle" }}
              onClick={async () => {
                // const verify = confirm("Are You Sure ?\n Do You Want To Cancel An Order ??");
                // if (verify === true) {
                const res = await axios.delete(`/account?order_id=${_ID}`);
                alert(res.data.message);
                if (!res.data.error)
                  Dispatch({ type: "Changed", it: "Account", to: true });
                // }
              }}
            >
              <Cancel />
              cancel order?
            </Button>
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            placeContent: "space-evenly",
            gap: "3px",
          }}
        >
          <span onClick={handleClick}>
            Delivery Status :
            <b
              style={{
                margin: "0px 0px 0px 5px",
                padding: "1px 5px 4px 5px",
                border: "1px solid black",
                borderRadius: "5px",
              }}
            >
              {DELIVERY_STATUS}
            </b>
          </span>
          {order_completed && rating === null && (
            <span>
              Give Rating :
              <sub>
                <Rating
                  precision={1}
                  defaultValue={0}
                  size="medium"
                  readOnly={rev}
                  onChange={async (e) => {
                    rating.current = Number(e.target.value);
                  }}
                />
                <br />
                <TextField
                  size="small"
                  variant="outlined"
                  label="REVIEW"
                  multiline
                  inputProps={{ readOnly: rev }}
                  onChange={(e) => {
                    review.current = e.target.value;
                  }}
                />
                <br />
                {!rev && (
                  <Button
                    sx={{ padding: "2px" }}
                    variant="contained"
                    size="small"
                    color="success"
                    onClick={async () => {
                      if (rating.current > 0 && review.current.length > 0) {
                        const res = await axios.patch("/account", {
                          value: rating.current,
                          review: review.current,
                          product: P_ID,
                        });
                        alert(res.data.message);
                        if (!res.data.error) {
                          setRev(true);
                        }
                      } else alert("Give Proper Ratings And Review");
                      console.log("review submit");
                    }}
                  >
                    Submit review
                  </Button>
                )}
              </sub>
            </span>
          )}
          {DELIVERY_STATUS !== "delivered" ? (
            <>
              <span onClick={handleClick}>Seller : {SELLER_NAME}</span>
              <span onClick={handleClick}>
                Seller Contact : +91 {SELLER_CONTECT}
              </span>
            </>
          ) : (
            <>
              <span onClick={handleClick}>
                Order Placed On : {new Date(createdAt).toDateString()}
              </span>
              <span onClick={handleClick}>
                Order Delivered On : {new Date(updatedAt).toDateString()}
              </span>
            </>
          )}
        </div>
      </Paper>
    );
  }

  return (
    <>
      <Paper
        sx={{
          maxWidth: "92%",
          margin: "20px auto",
          padding: "10px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginBottom: "70px",
        }}
      >
        {!(Datas !== undefined
          ? Datas.error || Datas.User === undefined
          : true) ? (
          <p className="h2">
            Hello, {Datas.User.name} {Datas.User.surname}
          </p>
        ) : (
          <p className="h2">Hello,</p>
        )}

        {/* Profile details */}
        <Accordion
          elevation={5}
          expanded={expanded === "panel1"}
          onChange={(e, isexp) => handlePanelChange(isexp, "panel1")}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <p className="h3">Your Profile Details</p>
          </AccordionSummary>
          <AccordionSummary>
            {(
              Datas !== undefined
                ? Datas.error || Datas.User === undefined
                : true
            ) ? (
              <center style={{ margin: "auto" }}>
                <CircularProgress />
              </center>
            ) : (
              <Stack
                display="flex"
                flexDirection={"row"}
                justifyContent={"space-evenly"}
                gap="10px"
                flexWrap={"wrap"}
              >
                <TextField
                  label="Name"
                  value={Datas.User.name}
                  inputProps={{ readOnly: !changeProf }}
                  name="name"
                  onChange={(e) => {
                    handleChangeUser(e);
                  }}
                />
                <TextField
                  label="Surname"
                  value={Datas.User.surname}
                  inputProps={{ readOnly: !changeProf }}
                  name="surname"
                  onChange={(e) => {
                    handleChangeUser(e);
                  }}
                />
                <TextField
                  label="Password"
                  value={Datas.User.password}
                  inputProps={{ readOnly: true }}
                  type="password"
                  name="password"
                  onChange={(e) => {
                    handleChangeUser(e);
                  }}
                />
                <TextField
                  label="Gender"
                  disabled
                  value={Datas.User.gender}
                  inputProps={{ readOnly: true }}
                  name="gender"
                  onChange={(e) => {
                    handleChangeUser(e);
                  }}
                />
                <TextField
                  label="E-Mail"
                  value={Datas.User.email}
                  inputProps={{ readOnly: true }}
                  name="email"
                  onChange={(e) => {
                    handleChangeUser(e);
                  }}
                />
                <TextField
                  label="Phone Number"
                  value={Datas.User.phone}
                  inputProps={{ readOnly: !changeProf }}
                  name="phone"
                  onChange={(e) => {
                    handleChangeUser(e);
                  }}
                />
                <TextField
                  label="Payment Details"
                  value={Datas.User.payment_dtl}
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
                  value={Datas.User.address.house_no}
                  inputProps={{ readOnly: !changeProf }}
                  name="house_no"
                  onChange={(e) => {
                    handleChangeUserAddress(e);
                  }}
                />
                <TextField
                  label="Socity / Street"
                  value={Datas.User.address.socity}
                  inputProps={{ readOnly: !changeProf }}
                  name="socity"
                  onChange={(e) => {
                    handleChangeUserAddress(e);
                  }}
                />
                <TextField
                  label="Nearby Reference"
                  value={Datas.User.address.area}
                  inputProps={{ readOnly: !changeProf }}
                  name="area"
                  onChange={(e) => {
                    handleChangeUserAddress(e);
                  }}
                />
                <TextField
                  label="City / Village"
                  value={Datas.User.address.city}
                  inputProps={{ readOnly: !changeProf }}
                  name="city"
                  onChange={(e) => {
                    handleChangeUserAddress(e);
                  }}
                />
                <TextField
                  label="Taluka"
                  value={Datas.User.address.taluka}
                  inputProps={{ readOnly: !changeProf }}
                  name="taluka"
                  onChange={(e) => {
                    handleChangeUserAddress(e);
                  }}
                />
                <TextField
                  label="District"
                  value={Datas.User.address.district}
                  inputProps={{ readOnly: !changeProf }}
                  name="district"
                  onChange={(e) => {
                    handleChangeUserAddress(e);
                  }}
                />
                <TextField
                  label="State"
                  value={Datas.User.address.state}
                  inputProps={{ readOnly: !changeProf }}
                  name="state"
                  onChange={(e) => {
                    handleChangeUserAddress(e);
                  }}
                />
                <TextField
                  label="Country"
                  value={Datas.User.address.country}
                  disabled
                  name="country"
                  onChange={(e) => {
                    handleChangeUserAddress(e);
                  }}
                />
                <TextField
                  label="Pincode"
                  value={Datas.User.address.pincode}
                  inputProps={{ readOnly: !changeProf }}
                  name="pincode"
                  onChange={(e) => {
                    handleChangeUserAddress(e);
                  }}
                />
              </Stack>
            )}
          </AccordionSummary>
          {!(Datas ? Datas.error : true) && (
            <AccordionActions>
              {changeProf ? (
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => saveChangeProf(false)}
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
          )}
        </Accordion>

        {/* Orders */}
        <Accordion
          elevation={5}
          expanded={expanded === "panel2"}
          onChange={(e, isexp) => handlePanelChange(isexp, "panel2")}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <p className="h3">Orders</p>
          </AccordionSummary>
          <AccordionSummary>
            {(Datas ? Datas.error || Datas.Orders === undefined : true) ? (
              <center style={{ margin: "auto" }}>
                <CircularProgress />
              </center>
            ) : Datas.Orders.length > 0 ? (
              <Stack
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "space-evenly",
                  gap: "10px",
                }}
              >
                {Datas.Orders.map((item, index) => {
                  return (
                    <Orders
                      key={nanoid()}
                      _ID={item._id}
                      P_ID={item.product_id}
                      IMAGE={Datas.thumbnails_orders[index]}
                      PRODUCT_NAME={item.product_name}
                      TOTAL={item.total}
                      DELIVERY_CHARGE={item.delivery_charge}
                      QUANTITY={item.quantity}
                      SHORT_DESCRIPTION={item.short_description}
                      PAYMENT_MODE={item.payment_mode}
                      DELIVERY_STATUS={item.delivery_status}
                      SELLER_NAME={item.seller_name}
                      SELLER_CONTECT={item.seller_contact}
                      COLOR={item.color}
                      SIZE={item.size}
                      AVAILABLE_COLOR={item.available_color}
                      AVAILABLE_SIZE={item.available_size}
                      createdAt={item.createdAt}
                      updatedAt={item.updatedAt}
                      ratinged={item.rating}
                      order_completed={item.order_completed}
                    />
                  );
                })}
              </Stack>
            ) : (
              <center style={{ margin: "auto" }}>
                <h1>
                  <h1>
                    <h1 style={{ writingMode: "vertical-lr" }}>{" :("}</h1>
                  </h1>
                </h1>
                <h1 style={{ textOrientation: "sideways" }}>
                  Make Some ORDERS
                </h1>
                <Button
                  variant="contained"
                  size="large"
                  color="warning"
                  sx={{ padding: "10px 50px" }}
                  onClick={() => {
                    navigate("/cart");
                  }}
                >
                  place orders
                </Button>
              </center>
            )}
          </AccordionSummary>
        </Accordion>

        {/* Favourite Products */}
        <Accordion
          elevation={5}
          expanded={expanded === "panel3"}
          onChange={(e, isexp) => handlePanelChange(isexp, "panel3")}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <p className="h3">Favourite Products</p>
          </AccordionSummary>
          <AccordionSummary>
            <Stack
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-evenly",
                gap: "10px",
              }}
            >
              {(
                Datas ? Datas.error || Datas.Favourites === undefined : true
              ) ? (
                <center style={{ margin: "auto" }}>
                  <CircularProgress />
                </center>
              ) : Datas.Favourites.length > 0 ? (
                Datas.Favourites.map((item, index) => {
                  return (
                    <ProductCard
                      key={nanoid()}
                      _id={item._id}
                      img={Datas.thumbnails_favourite[index]}
                      title={item.name}
                      subtitle={item.short_description}
                      ratings={item.ratings}
                      button_needed={false}
                      mrp={item.mrp}
                      discount={item.discount}
                      sell_price={item.sell_price}
                      small={true}
                      color={item.color}
                      size={item.size}
                    />
                  );
                })
              ) : (
                <center style={{ margin: "auto" }}>
                  <h1>
                    <h1>
                      <h1 style={{ writingMode: "vertical-lr" }}>{" :("}</h1>
                    </h1>
                  </h1>
                  <h1 style={{ textOrientation: "sideways" }}>
                    No Any Favourite Products
                  </h1>
                  <Button
                    variant="contained"
                    size="large"
                    color="warning"
                    sx={{ padding: "10px 50px" }}
                    onClick={() => {
                      navigate("/");
                    }}
                  >
                    Take a look at some
                  </Button>
                </center>
              )}
            </Stack>
          </AccordionSummary>
        </Accordion>

        {/* recently viewed products */}
        <Accordion
          elevation={5}
          expanded={expanded === "panel4"}
          onChange={(e, isexp) => handlePanelChange(isexp, "panel4")}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <p className="h3">Recently Viewed Products</p>
          </AccordionSummary>
          <AccordionSummary>
            <Stack
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-evenly",
                gap: "10px",
              }}
            >
              {(
                Datas
                  ? Datas.error || Datas.Recently_Viewed === undefined
                  : true
              ) ? (
                <center style={{ margin: "auto" }}>
                  <CircularProgress />
                </center>
              ) : Datas.Recently_Viewed.length > 0 ? (
                Datas.Recently_Viewed.map((item, index) => {
                  return (
                    <ProductCard
                      key={nanoid()}
                      _id={item._id}
                      img={Datas.thumbnails_recently_viewed[index]}
                      title={item.name}
                      subtitle={item.short_description}
                      ratings={item.ratings}
                      button_needed={false}
                      mrp={item.mrp}
                      discount={item.discount}
                      sell_price={item.sell_price}
                      small={true}
                      color={item.color}
                      size={item.size}
                    />
                  );
                })
              ) : (
                <center style={{ margin: "auto" }}>
                  <h1>
                    <h1>
                      <h1 style={{ writingMode: "vertical-lr" }}>{" :("}</h1>
                    </h1>
                  </h1>
                  <h1 style={{ textOrientation: "sideways" }}>
                    Still Not Any Product Have Been Visited
                  </h1>
                  <Button
                    variant="contained"
                    size="large"
                    color="warning"
                    sx={{ padding: "10px 50px" }}
                    onClick={() => {
                      navigate("/");
                    }}
                  >
                    check some
                  </Button>
                </center>
              )}
            </Stack>
          </AccordionSummary>
        </Accordion>

        {/* web settings */}
        <Accordion
          elevation={5}
          expanded={expanded === "panel5"}
          onChange={(e, isexp) => handlePanelChange(isexp, "panel5")}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <p className="h3">Web Settings</p>
          </AccordionSummary>
          <AccordionSummary>
            <div className="settings-main-div">
              <hr width="100%" />
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
              <hr width="100%" />
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
              <hr width="100%" />
            </div>
          </AccordionSummary>
        </Accordion>

        {/* T & C */}
        <Accordion
          elevation={5}
          expanded={expanded === "panel6"}
          onChange={(e, isexp) => handlePanelChange(isexp, "panel6")}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <p className="h3">Terms of Use</p>
          </AccordionSummary>
          <AccordionSummary>Juk ke rehna padega mere aage</AccordionSummary>
        </Accordion>
      </Paper>

      {/* footer */}
      <Footer />
    </>
  );
}

export default Account;
