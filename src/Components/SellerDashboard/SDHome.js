import React from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { Button } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import { Context } from "../../Context";

function SD_Home() {
  const { Data } = React.useContext(Context);

  React.useEffect(() => {
    console.log("sellerHome in efffect ");
    (async function () {
      const req = await axios.get("/seller_dashboard");
      if (req.data.error) alert(req.data.message);
    })();
  }, []);

  return (
    <div className="sd-home-main">
      <h1>HELLO WELCOME KULDIP SARVAIYA</h1>
      <hr width="100%" />
      <span className="sd-home-highlight">
        Make Your Business Wider With E-Cart E-Commerce{" "}
      </span>
      <hr width="100%" />
      <div>
        {Data.PendingOrdersCount > 0 && (
          <NavLink
            className={"drawer-navlink"}
            to="/seller_dashboard/pending_order"
          >
            <Button variant="contained" size="large" color="warning">
              You Have {Data.PendingOrdersCount} New Orders, Make Sure To
              Conform It
            </Button>
          </NavLink>
        )}

        <h4>
          <ArrowForward /> You Have Total {Data.MyProduts && Data.MyProduts.length} Products Live For Sell.. You Can
          Add More Products By Clicking{" "}
          <NavLink to="/seller_dashboard/add_product">Here</NavLink>
        </h4>
        <div>
          <h4>
            <ArrowForward /> Let See Some Business Tips...
          </h4>
          <ul>
            <li>Give At Least 5% Discount</li>
            <li>Offer Free Services And Warrenty</li>
            <li>Use Clear and Attractive Product Images</li>
          </ul>
        </div>
      </div>
      <br />
      <br />
      <br />
      <br />
      <center>
        <li></li>
        <b>
          <span className="h1">Good&nbsp;Bussiness&nbsp;📊📈</span>
        </b>
        <li></li>
      </center>
    </div>
  );
}

export default SD_Home;
