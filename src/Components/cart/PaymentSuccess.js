import { Forward } from "@mui/icons-material";
import { Alert, AlertTitle, Button, CircularProgress } from "@mui/material";
import axios from "axios";
import React, { memo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// import { Context } from "../../Context";

function PaymentSuccess() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const [msg, setMsg] = React.useState(undefined);
  // const { Dispatch } = React.useContext(Context);

  React.useEffect(() => {
    console.log("This Is Payment Successful Page Directed By Stripe");
    (async function () {
      const res = await axios.put("/cart/payment_success", {
        orders: search.substring(8).split("&").slice(0, -1),
      });
      console.log("Payment sucessfull hurrray ");
      navigate("/account/panel2", { replace: true });
      setMsg(res.data);
      // Dispatch({ type: "Changed", it: "Account" });
      // Dispatch({ type: "Changed", it: "Cart" });
    })();
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
