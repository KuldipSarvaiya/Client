import { ArrowBack, Cancel } from "@mui/icons-material";
import { Alert, AlertTitle, Button } from "@mui/material";
import axios from "axios";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function PaymentFailed() {
  const [msg, setMsg] = React.useState(undefined);
  const navigate = useNavigate();
  const { search } = useLocation();
  console.log(search.substring(8).split("&").slice(0, -1));

  React.useEffect(() => {
    console.log("This Is Payment Failed Page Directed By Stripe"); 
    (async function () {
      const res = await axios.put("/cart/payment_failed", {
        orders: search.substring(8).split("&").slice(0, -1),
      });
      setMsg(res.data);
    })();
  });

  return (
    <div className="payment-result-main-div">
      <div>
        <Alert icon={<Cancel />} color="error" elevation={10}>
          <AlertTitle>PAYMENT FAILED 👎</AlertTitle>
          <p>
            Your Payment Has Failed, There May Be Wrong Details Inputed or
            Network Issue <br />
            Try Again.
          </p>
          {msg !== undefined && <p>{msg}*</p>}
          <Button
            variant="contained"
            onClick={() => {
              navigate("/cart", { replace: true });
            }}
          >
            <ArrowBack /> go back & try again
          </Button>
        </Alert>
      </div>
    </div>
  );
}

export default PaymentFailed;
