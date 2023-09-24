import React, { useContext } from "react";
import axios from "axios";
// import { Context } from "../Context";
import {
  Button,
  IconButton,
  Paper,
  Rating,
  Stack,
  Skeleton,
  Stepper,
  Step,
  styled,
  StepLabel,
  CircularProgress,
  Chip,
  Box,
} from "@mui/material";
import {
  Add,
  AddShoppingCart,
  ArrowBack,
  ArrowDropDown,
  ArrowDropUp,
  ArrowForward,
  Delete,
  LocalShipping,
  LocationOn,
  Payment,
  Payments,
  ReceiptLong,
  TaskAlt,
} from "@mui/icons-material";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { nanoid } from "nanoid";
import { useNavigate } from "react-router-dom";
import { useCookie } from "react-use";
import { Context } from "../../Context";
import dotenv from "dotenv";
dotenv.config();

function Cart() {
  // const { Data } = React.useContext(Context);
  const [orderState, setOrderState] = React.useState(0);
  const [cart, setCart] = React.useState(undefined);
  const cart_product_ref = React.useRef({});
  const navigate = useNavigate();
  const [logs] = useCookie("logs");
  const { Data, Dispatch } = useContext(Context);

  React.useEffect(() => {
    if (logs === null) {
      navigate("/login", { replace: true });
    } else
      (async function () {
        if (orderState === 0) {
          if (
            Data.Changed.Cart &&
            axios.defaults.headers.common.Authorization !==
              process.env.HEADER_COMMON_AUTH
          ) {
            const res = await axios.get("/cart/cart_product");
            if (res.data.error) {
              alert(res.data.message);
              cart_product_ref.current = [];
            } else {
              console.log(res.data);
              cart_product_ref.current = res.data.cart_product;
              //setting state to refresh component else not required
              Dispatch({
                type: "set_cart_product",
                count: res.data.cart_product.length,
                cart_product: res.data.cart_product,
              });
            }
            setCart(res.data.cart_product);
          } else {
            cart_product_ref.current = Data.CartProduct;
            setCart(Data.CartProduct);
          }
        } else if (orderState === 1) {
          if (Data.Changed.Cart) {
            const res = await axios.get("/cart/order_summary");
            if (res.data.error) {
              alert(res.data.message);
            } else {
              console.log(res.data);
              Dispatch({
                type: "set_cart_summary",
                cart_summary: res.data,
              });
            }
            setCart(res.data);
          } else setCart(Data.CartSummary);
        } else if (orderState === 2) {
          const res = await axios.get("/cart/payment_details");
          console.log(res.data);
          if (res.data.error) {
            alert(`TRY AGAIN. Error = ${res.data.message}`);
            setCart(res.data);
          } else ReadyForPayment();
        }
      })();
  }, [orderState, axios.defaults.headers.common.Authorization]);

  console.log(cart);
  console.log(orderState);

  // Cart Items
  function CartList() {
    function CartProduct({
      _id,
      p_id,
      image,
      name,
      short_description,
      ratings,
      mrp,
      discount,
      sell_price,
      size,
      color,
      delivery_charge,
      quantity,
      tax,
    }) {
      // Rating Count
      function ratingCounts() {
        if (ratings.length === 0) return 0;

        const len = ratings.length - 1;
        const total = ratings.map((a) => {
          return a.value;
        });

        return (
          total.reduce((a, b) => {
            return a + b;
          }) / len
        );
      }

      async function handleQuantityChange(qty) {
        const res = await axios.put(`/cart_product/${_id}`, {
          quantity: qty,
        });
        if (res.data.error)
          alert(`Error in Changing Quantity = ${res.data.message}`);
        else {
          alert(res.data.message);
          Dispatch({ type: "Changed", it: "Cart", to: true });
          window.location.reload();
        }
      }

      function NavigateTo() {
        navigate(
          `/product/${p_id}${
            color !== "N/A" && size !== "N/A"
              ? "?color=" + color + "&size=" + size
              : color !== "N/A"
              ? "?color=" + color
              : size !== "N/A" && "?size=" + size
          }`
        );
      }

      return (
        <Paper
          className="cart-item-paper"
          key={nanoid()}
          sx={{
            width: {
              xs: "95%",
              sm: "95%",
              md: "48%",
              lg: "48%",
              xl: "48%",
            },
            padding: "5px 2px",
          }}
        >
          <Stack
            sx={{
              width: {
                xs: "130px",
                sm: "150px",
                md: "180px",
                lg: "150px",
                xl: "150px",
              },
              display: "flex",
              justifyContent: "center",
            }}
            className="cursor-pointer"
            onClick={NavigateTo}
          >
            <img src={image} alt="item Immge" loading="lazy" />
          </Stack>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flexWrap: "nowrap",
              justifyContent: "space-evenly",
            }}
          >
            <b className="cursor-pointer" onClick={NavigateTo}>
              {name}
            </b>
            <span className="cursor-pointer" onClick={NavigateTo}>
              {short_description.substr(0, 30) + "..."}
            </span>
            <span className="cursor-pointer" onClick={NavigateTo}>
              <Rating
                value={ratingCounts()}
                readOnly
                precision={0.5}
                size="small"
              />
            </span>
            <span className="cursor-pointer" onClick={NavigateTo}>
              {console.log(delivery_charge)}
              {delivery_charge > 0 ? (
                <>
                  <span>
                    Delivery Charge &#8377;{delivery_charge}{" "}
                    <sub>
                      <LocalShipping />
                    </sub>
                  </span>
                </>
              ) : (
                <>
                  <sup>No Delivery Charge</sup> <LocalShipping />
                </>
              )}
            </span>
            <span>
              <Button
                variant="contained"
                size="small"
                onClick={async () => {
                  const res = await axios.delete(`/cart_product/${_id}`);
                  alert(res.data.message);
                  if (!res.data.erorr) {
                    Dispatch({ type: "Changed", it: "Cart", to: true });
                    window.location.reload();
                  }
                }}
              >
                remove item <Delete />
              </Button>
            </span>
          </div>
          <div
            className="cursor-pointer"
            style={{
              display: "flex",
              flexDirection: "column",
              flexWrap: "nowrap",
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            <span onClick={NavigateTo}>
              &nbsp;&nbsp;MRP &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8377;
              {mrp}
              <br />
              +Tax &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8377;
              {tax}
              <br />
              <u>-Discount &nbsp;&nbsp;&#8377;{discount}&nbsp;&nbsp;&nbsp;</u>
            </span>
            <span>
              <b>Total &nbsp;&nbsp;:&nbsp; &nbsp;&#8377;{sell_price}</b>
            </span>
            <div>
              Qty :
              <IconButton onClick={() => handleQuantityChange(quantity + 1)}>
                <ArrowDropUp />
              </IconButton>
              {quantity}
              <IconButton
                disabled={quantity === 1}
                onClick={() => handleQuantityChange(quantity - 1)}
              >
                <ArrowDropDown />
              </IconButton>
            </div>
            {(color || size) && (
              <span onClick={NavigateTo}>
                <b
                  style={{
                    padding: "1px 5px 4px 5px",
                    border: "1px solid black",
                    borderRadius: "5px",
                  }}
                >
                  {size !== "N/A" && <>Size : {size}</>}{" "}
                  {size !== "N/A" && color !== "N/A" && " | "}
                  {color !== "N/A" && <>Color : {color}</>}
                </b>
              </span>
            )}
          </div>
        </Paper>
      );
    }

    return (
      <>
        {cart_product_ref.current.map((item, index) => (
          <CartProduct
            key={nanoid()}
            _id={item._id}
            p_id={item.p_id}
            image={item.thumbnail}
            name={item.name}
            short_description={item.short_description}
            ratings={item.ratings}
            mrp={item.mrp_total}
            tax={item.tax_total}
            discount={item.discount_total}
            sell_price={item.total}
            size={item.size}
            color={item.color}
            delivery_charge={item.delivery_charge_total}
            quantity={item.quantity}
          />
        ))}
        <center>
          <Paper
            elevation={20}
            sx={{
              width: window.innerWidth,
              padding: "20px",
              margin: "30px",
              display: "flex",
              flexDirection: "row",
              flexWrap: "nowrap",
              justifyContent: "center",
              gap: "50px",
            }}
          >
            <Button
              variant="contained"
              onClick={() => {
                navigate("/");
              }}
            >
              <Add />
              Add Items
            </Button>
            <Button
              variant="contained"
              color="info"
              onClick={() => {
                Dispatch({ type: "Changed", it: "Cart", to: true });
                setOrderState(1);
              }}
            >
              Proceed To checkout
              <ArrowForward />
            </Button>
          </Paper>
        </center>
      </>
    );
  }

  function Skeletan() {
    const arr = [];
    for (let i = 0; i <= 3; i++) {
      arr.push(
        <Paper
          key={nanoid()}
          className="cart-item-paper"
          sx={{
            width: {
              xs: "95%",
              sm: "95%",
              md: "48%",
              lg: "48%",
              xl: "48%",
            },
            padding: "5px 2px",
          }}
        >
          <Skeleton
            key={nanoid()}
            variant="rectangular"
            animation="wave"
            sx={{ width: "150px", height: "150px" }}
          />
          <Skeleton
            key={nanoid()}
            variant="rectangular"
            animation="wave"
            sx={{ width: "150px", height: "150px" }}
          />
          <Skeleton
            key={nanoid()}
            variant="rectangular"
            animation="wave"
            sx={{ width: "150px", height: "150px" }}
          />
        </Paper>
      );
    }
    arr.push(
      <Paper sx={{ width: "95%" }} key={nanoid()}>
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{ width: "100%", height: "250px" }}
        />
      </Paper>
    );
    return arr;
  }

  // Order State Colored Icon and Lines
  const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 22,
    },
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundImage:
          "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
      },
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundImage:
          "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
      },
    },
    [`& .${stepConnectorClasses.line}`]: {
      height: 3,
      border: 0,
      backgroundColor:
        theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
      borderRadius: 1,
    },
  }));
  const ColorlibStepIconRoot = styled("div")(({ theme, ownerState }) => ({
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
    zIndex: 1,
    color: "#fff",
    width: 50,
    height: 50,
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
    ...(ownerState.active && {
      backgroundImage:
        "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
      boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
    }),
    ...(ownerState.completed && {
      backgroundImage:
        "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
    }),
  }));
  function ColorlibStepIcon(props) {
    const { active, completed, className } = props;
    const icons = {
      1: <AddShoppingCart />,
      2: <ReceiptLong />,
      3: <Payment />,
    };

    if (completed === false) {
      return (
        <ColorlibStepIconRoot
          ownerState={{ completed, active }}
          className={className}
        >
          {icons[String(props.icon)]}
        </ColorlibStepIconRoot>
      );
    } else {
      return (
        <ColorlibStepIconRoot
          ownerState={{ completed, active }}
          className={className}
        >
          <TaskAlt />
        </ColorlibStepIconRoot>
      );
    }
  }

  // Oreder State
  function OrderState() {
    return (
      <Paper
        sx={{
          width: "100%",
          padding: "10px 0px",
        }}
      >
        <Stepper
          activeStep={orderState}
          alternativeLabel
          connector={<ColorlibConnector />}
        >
          <Step completed={orderState > 0}>
            <StepLabel StepIconComponent={ColorlibStepIcon}>
              <b>Add Items</b>
            </StepLabel>
          </Step>
          <Step completed={orderState > 1}>
            <StepLabel StepIconComponent={ColorlibStepIcon}>
              <b>Order Summary</b>
            </StepLabel>
          </Step>
          <Step completed={orderState > 2}>
            <StepLabel StepIconComponent={ColorlibStepIcon}>
              <b>Payment</b>
            </StepLabel>
          </Step>
        </Stepper>
      </Paper>
    );
  }

  // Order Summary
  function OrderSummary() {
    return (
      <>
        <Paper
          sx={{
            width: "100%",
            padding: "10px",
          }}
        >
          <center>
            <h3>ORDER SUMMARY</h3>
          </center>
          <Stack
            direction={"row"}
            justifyContent={"space-evenly"}
            flexWrap={"wrap"}
            gap={"5px"}
            width={"100%"}
            padding={"10px 0px"}
          >
            <div>
              <p>
                <LocationOn /> {cart.address.house_no}, {cart.address.socity}
              </p>
              <p>{cart.address.reference}</p>
              <p>
                City : {cart.address.city}, Taluka : {cart.address.taluka},
                District : {cart.address.district},
              </p>
              <p>
                State : {cart.address.state}, PIN - {cart.address.pincode}
              </p>
              <Button
                variant="contained"
                onClick={() => {
                  navigate("/account/panel1");
                }}
              >
                Change Address
              </Button>
            </div>

            <Stack
              direction={"row"}
              justifyContent={"center"}
              flexWrap={"nowrap"}
            >
              <div>
                <p>
                  {" "}
                  MRP Total
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                  &#8377;{cart.orders_summary.grand_mrp}
                </p>
                <p>
                  + Tax (GST)
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                  &#8377;{cart.orders_summary.grand_tax}
                </p>
                <p>
                  + Delivery Charge
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                  &#8377;{cart.orders_summary.grand_delivery_charge}
                </p>
                <hr />
                <p>
                  {" "}
                  SubTotal
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                  &#8377;{cart.orders_summary.grand_subtotal}
                </p>
                <hr />
                <p>
                  - Discount
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                  &#8377;{cart.orders_summary.grand_discount}
                </p>
                <hr />
                <p>
                  {" "}
                  &nbsp;
                  <b>
                    TOTAL
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                    &#8377;{cart.orders_summary.grand_total}
                  </b>
                </p>
              </div>
            </Stack>

            <div
              style={{
                display: "flex",
                gap: "20px",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Button
                variant="contained"
                color="info"
                onClick={() => {
                  Dispatch({ type: "Changed", it: "Cart", to: true });
                  setOrderState(2);
                }}
              >
                continue payment <ArrowForward />
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  setOrderState(0);
                }}
              >
                <ArrowBack />
                go back and add more items
              </Button>
            </div>
          </Stack>
        </Paper>
      </>
    );
  }

  async function ReadyForPayment() {
    const res = await axios.get("/cart/place_order");
    console.log(res.data);
    if (res.data.error)
      alert(`Do Refresh, Error In Payment Gateway = ${res.data.message}`);
    else window.location = res.data.url;
  }

  function PaymentScreen() {
    console.log("into paysrc");
    const [loading, setLoading] = React.useState(false);
    const ImReadyForPayment = () => {
      setLoading(true);
      ReadyForPayment();
    };

    return (
      <Paper elevation={0} sx={{ margin: "auto", padding: "10px" }}>
        <center style={{ margin: "auto" }}>
          {cart.message === "NoQTY" ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <h2>
                The Quantity Of Following Products Are Not Available Of Your
                ORDER.
              </h2>
              <Box>
                <Paper
                  elevation={8}
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    margin: "10px 0px",
                  }}
                >
                  <span>NAME</span>
                  <span>SIZE</span>
                  <span>COLOR</span>
                  <span>QUANTITY</span>
                </Paper>
                {cart.not_available_orders.map((item) => (
                  <Paper
                    key={nanoid()}
                    elevation={2}
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-around",
                      margin: "2px 0px",
                    }}
                  >
                    <span>{item.name.substr(0, 15)}</span>
                    {item.size !== "N/A" && <span>{item.size}</span>}
                    {item.color !== "N/A" && <span>{item.color}</span>}
                    <span>{item.available_quantity}</span>
                  </Paper>
                ))}
              </Box>
              <br />
              Click Continue To Buy Available Products{" "}
              <Button
                disabled={loading}
                variant="contained"
                color="info"
                size="large"
                onClick={() => ImReadyForPayment()}
              >
                {loading ? (
                  <>
                    Just A Moment. <CircularProgress />
                  </>
                ) : (
                  <>
                    continue <Payments />
                  </>
                )}
              </Button>
              <br />
              <Chip
                label={
                  <Button
                    variant="text"
                    color="inherit"
                    onClick={() => {
                      setOrderState(1);
                    }}
                  >
                    <ArrowBack />
                    Go Back
                  </Button>
                }
                variant="filled"
                color="info"
                sx={{ display: "block" }}
              />
            </Box>
          ) : (
            <>
              <h4>Just A Moment..</h4>
              <CircularProgress />
            </>
          )}
        </center>
      </Paper>
    );
  }

  function LoadedData() {
    if (!(cart !== undefined ? cart.error : true)) {
      //if cart is not empty
      if (cart_product_ref.current.length > 0) {
        if (orderState === 0) return <CartList />;
      } else {
        setOrderState(-1);
        return (
          <center>
            <h1>
              <h1>
                <h1 style={{ writingMode: "vertical-lr" }}>{" :("}</h1>
              </h1>
            </h1>
            <h1>
              <h1 style={{ textOrientation: "sideways" }}>
                Add Some Products To CART
              </h1>
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
              <Add />
              Add Items
            </Button>
          </center>
        );
      }
      if (orderState === 1)
        if (cart.address !== undefined && cart.error === false)
          return <OrderSummary />;
    }
    if (cart !== undefined && orderState === 2) {
      console.log("status 2");
      if (cart.url !== undefined && cart.error === true)
        console.log("error true");
      return <PaymentScreen />;
    } else if (cart.url !== undefined && cart.error === false) {
      window.location = cart.url;
      console.log("error false");
    }
  }

  return (
    <>
      <div className="Cart">
        {cart === undefined ? (
          <Skeletan />
        ) : (
          <>
            <OrderState />
            <LoadedData />
          </>
        )}
      </div>
    </>
  );
}

export default Cart;
