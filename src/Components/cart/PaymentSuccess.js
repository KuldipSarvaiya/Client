import { Forward } from "@mui/icons-material";
import { Alert, AlertTitle, Button } from "@mui/material";
import axios from "axios";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Context } from "../../Context";

function PaymentSuccess() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const [msg, setMsg] = React.useState(undefined);
  const { Dispach } = React.useContext(Context);

  React.useEffect(() => {
    console.log("This Is Payment Successful Page Directed By Stripe");
    (async function () {
      const res = await axios.put("/cart/payment_success", {
        orders: search.substring(8).split("&").slice(0, -1),
      });
      setMsg(res.data);
      Dispach({ type: "Changed", it: "Account" });
      Dispach({ type: "Changed", it: "Cart" });
    })();
  });

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

export default PaymentSuccess;
