import { Forward } from "@mui/icons-material";
import { Alert, AlertTitle, Button, CircularProgress } from "@mui/material";
import axios from "axios";
import React, { memo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// import { Context } from "../../Context";

function PaymentSuccess() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const [msg, setMsg] = React.useState(undefined);
  const [success, setSuccess] = React.useState(true);
  // const { Dispatch } = React.useContext(Context);

  const makeOrderComplete = useCallback(async function (signal) {
    setSuccess(false);
    const res = await axios.put(
      "/cart/payment_success",
      {
        orders: search.substring(8).split("&").slice(0, -1),
      },
      { signal: signal }
    );
    console.log("Payment sucessfull hurrray ");
    navigate("/account/panel2", { replace: true });
    setMsg(res.data);
    // Dispatch({ type: "Changed", it: "Account" });
    // Dispatch({ type: "Changed", it: "Cart" });
  }, []);

  React.useEffect(() => {
    console.log("This Is Payment Successful Page Directed By Stripe");
    const signal = new AbortController();
    if (success) makeOrderComplete(signal);
    return () => {
      signal.abort();
    };
  }, []);

  return (
    <div className="payment-result-main-div">
      <Alert color="success" elevation={10}>
        <AlertTitle>PAYMENT SUCCESSFULLY DONE 👍</AlertTitle>
        <p>
          Your Order Has Successfully Placed 🥳, It will Be Shiped To Your Place
          ASAP🚚, <br />
          Thank You.
        </p>
        {msg !== undefined && <p>{msg}*</p>}
        <CircularProgress size={"small"} color="success" />
        <Button
          variant="contained"
          onClick={() => {
            navigate("/account/panel2", { replace: true });
          }}
        >
          Check Your Order Status <Forward />
        </Button>
      </Alert>
    </div>
  );
}

export default memo(PaymentSuccess);
