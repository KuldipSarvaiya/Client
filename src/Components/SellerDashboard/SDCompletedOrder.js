import React from "react";
import { CircularProgress, Paper, Stack } from "@mui/material";
import { CreditScore, Money } from "@mui/icons-material";
import axios from "axios";
import { nanoid } from "nanoid";
import { Context } from "../../Context";
import dotenv from "dotenv";
dotenv.config();

function SD_CompletedOrder() {
  const [data, setData] = React.useState(undefined);
  const { Data, Dispatch } = React.useContext(Context);
  React.useEffect(() => {
    console.log("Out of the effect = ", data, Data);
    if (
      Data.Changed.CompletedOrders &&
      Data.Changed.HeaderJWT_set &&
      axios.defaults.headers.common.Authorization !==
        process.env.HEADER_COMMON_AUTH
    ) {
      (async function () {
        const res = await axios.get(`/seller_dashboard/completed_order`);
        console.log(res);
        if (!res.data.error) {
          Dispatch({
            type: "set_completed_orders",
            completed_orders: res.data.completed_orders,
          });
          setData(res.data.completed_orders);
          console.log("inside the effect = ", data, Data);
        } else alert(res.data.message);
      })();
    } else setData(Data.CompletedOrders);
  }, [
    Data.Changed.CompletedOrders,
    Data.Changed.HeaderJWT_set,
    axios.defaults.headers.common.Authorization,
  ]);

  function Orders({
    IMAGE,
    PRODUCT_NAME,
    SHORT_DESCRIPTION,
    QUANTITY,
    TOTAL,
    ORDER_BY,
    ADDRESS,
    CONTACT,
    PAYMENT_MODE,
    ORDERED_ON,
    DELIVERED_ON,
    SIZE,
    COLOR,
  }) {
    return (
      <Paper
        elevation={10}
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-evenly",
          gap: "20px",
          padding: "15px",
          margin: "0px 10px",
        }}
      >
        <Stack
          sx={{
            maxWidth: {
              xs: "130px",
              sm: "150px",
              md: "180px",
              lg: "150px",
              xl: "150px",
            },
            alignSelf: "center",
          }}
        >
          <img src={IMAGE} alt="" />
        </Stack>
        <Stack sx={{ maxWidth: "30%", gap: "5px" }}>
          <span className="h3">{PRODUCT_NAME}</span>
          <span className="h5">
            {SHORT_DESCRIPTION.substring(0, 55) + "..."}
          </span>
          <div
            style={{
              margin: "3px 1px 0px",
              padding: "1px 1px 4px 5px",
              border: "1px solid black",
              borderRadius: "5px",
              display: "inline-block",
            }}
          >
            Qty: {QUANTITY}
            {COLOR !== "N/A" && ` | Color: ${COLOR}`}
            {SIZE !== "N/A" && ` | Size: ${SIZE}`}
          </div>
          <b
            style={{
              margin: "0px",
              padding: "1px 5px 4px 5px",
              border: "1px solid black",
              borderRadius: "5px",
            }}
          >
            &#8377;{TOTAL} | {PAYMENT_MODE}
            <sub>{PAYMENT_MODE === "COD" ? <Money /> : <CreditScore />}</sub>
          </b>
        </Stack>
        <div
          style={{
            maxWidth: "300px",
            display: "flex",
            flexDirection: "column",
            gap: "5px",
          }}
        >
          <span>
            <i>Ordered By :</i> {ORDER_BY}
          </span>
          <span>
            <i>Ordered On :</i> {new Date(ORDERED_ON).toDateString()}{" "}
          </span>
          <span>
            <i>Delivered On :</i> {new Date(DELIVERED_ON).toDateString()}{" "}
          </span>
          <span>
            <i>To :</i> {ADDRESS}
          </span>
          <span>
            <i>Contact :</i> +91 {CONTACT}
          </span>
        </div>
      </Paper>
    );
  }

  return (
    <Stack spacing={2} justifyContent={"space-evenly"} alignItems={"center"}>
      {console.log("in return", data)}
      {!data ? (
        <CircularProgress color="secondary" sx={{ margin: "auto" }} />
      ) : (
        // {console.log(data)}
        data.map((item) => {
          return (
            <Orders
              key={nanoid()}
              IMAGE={item.thumbnail}
              PRODUCT_NAME={item.name}
              SHORT_DESCRIPTION={item.short_description}
              QUANTITY={item.quantity}
              TOTAL={item.total}
              ORDER_BY={item.order_by}
              ADDRESS={item.address}
              CONTACT={item.contact}
              PAYMENT_MODE={item.payment_mode}
              ORDERED_ON={item.ordered_on}
              DELIVERED_ON={item.delivered_on}
              SIZE={item.size}
              COLOR={item.color}
            />
          );
        })
      )}
    </Stack>
  );
}

export default SD_CompletedOrder;
