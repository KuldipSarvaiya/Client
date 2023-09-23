import { Check, Close, CreditScore, Money } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
} from "@mui/material";
import axios from "axios";
import React from "react";
import { nanoid } from "nanoid";
import { Context } from "../../Context";

function SD_PendingOrder() {
  const [data, setData] = React.useState(undefined);
  const { Data, Dispatch } = React.useContext(Context);

  React.useEffect(() => {
    console.log(
      Data.Changed.PendingOrders,
      Data.Changed.HeaderJWT_set,
      axios.defaults.headers.common.Authorization !==
        "E-Cart this_is_JWT_loaded_by_axios"
    );
    if (
      Data.Changed.PendingOrders &&
      Data.Changed.HeaderJWT_set &&
      axios.defaults.headers.common.Authorization !==
        "E-Cart this_is_JWT_loaded_by_axios"
    ) {
      (async function () {
        const res = await axios.get(`/seller_dashboard/pending_order`);
        console.log(res);
        Dispatch({
          type: "set_pending_orders",
          pending_orders: res.data.pending_orders,
          count: res.data.pending_orders.length,
        });
        if (!res.data.error) setData(res.data.pending_orders);
        else alert(res.data.message);
      })();
    } else setData(Data.PendingOrders);
  }, [Data.Changed.PendingOrders, Data.Changed.HeaderJWT_set]);

  function Orders({
    IMAGE,
    PRODUCT_NAME,
    SHORT_DESCRIPTION,
    QUANTITY,
    SIZE,
    COLOR,
    TOTAL,
    // DELIVERY_CHARGE,
    ORDER_BY,
    ADDRESS,
    CONTACT,
    PAYMENT_MODE,
    DELIVERY_STATUS,
  }) {
    const [delivery_status, setDelivery_status] =
      React.useState(DELIVERY_STATUS);

    console.log(delivery_status);

    return (
      <Paper
        elevation={6}
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-evenly",
          alignItems: "center",
          gap: "5px",
          padding: "15px 0px 15px",
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
            justifySelf: "center",
            padding: "10px",
            margin: 0,
            placeContent: "center",
            // backgroundImage: `url(${IMAGE})`,
          }}
        >
          <img src={IMAGE} alt="" />
        </Stack>
        <Stack sx={{ maxWidth: "30%", gap: "5px" }}>
          <span className="h3">{PRODUCT_NAME}</span>
          <span className="h5">
            {SHORT_DESCRIPTION.substring(0, 60) + "..."}
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
            Quantity : {QUANTITY}
            {SIZE !== "N/A" && <>&nbsp;|&nbsp;Size : {SIZE}</>}
            {COLOR !== "N/A" && <>&nbsp;|&nbsp;Color : {COLOR}</>}
          </div>
          <b
            style={{
              margin: "0px",
              padding: "1px 5px 4px 5px",
              border: "1px solid black",
              borderRadius: "5px",
              display: "inline-block",
            }}
          >
            Total : &#8377;{TOTAL} &nbsp;| {PAYMENT_MODE}
            <sub>{PAYMENT_MODE === "COD" ? <Money /> : <CreditScore />}</sub>
          </b>
        </Stack>
        {/* Delivery Status */}
        {delivery_status === "order_pending" ? (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Button
              size="small"
              variant="outlined"
              onClick={async () => {
                setDelivery_status("order_accepted");
                const res = await axios.put(`/seller_dashboard/pending_order`, {
                  value: "order_accepted",
                });
                console.log(res);
                Dispatch({
                  type: "Changed",
                  it: "PendingOrders",
                  to: true,
                });
              }}
            >
              <Check />
              Conform
            </Button>
            <br />
            <br />
            {/* delete the order from db after thinking about payment return &
      let inform user */}
            <Button
              size="small"
              variant="outlined"
              onClick={async () => {
                console.log(
                  'cancel order from ures"s and seller"s order and Send Notificaaation To user in Order"s place'
                );
                const res = await axios.put(`/seller_dashboard/pending_order`, {
                  value: "order_cancel",
                });
                console.log(res);
                Dispatch({
                  type: "Changed",
                  it: "PendingOrders",
                  to: true,
                });
              }}
            >
              <Close />
              cancle
            </Button>
          </div>
        ) : (
          <div>
            <FormControl variant="filled" sx={{ minWidth: "150px" }}>
              <InputLabel>Delivery Status</InputLabel>
              <Select
                value={delivery_status}
                onChange={async (e) => {
                  setDelivery_status(e.target.value);
                  Dispatch({
                    type: "Changed",
                    it: "PendingOrders",
                    to: true,
                  });
                  // updating data on the server
                  const res = await axios.put(
                    `/seller_dashboard/pending_order`,
                    { value: e.target.value }
                  );
                  console.log(res);
                  if (e.target.value === "delivered")
                    Dispatch({
                      type: "Changed",
                      it: "CompletedOrders",
                      to: true,
                    });
                }}
              >
                {delivery_status === "order_accepted" && (
                  <MenuItem value={"order_accepted"}>Accept Order</MenuItem>
                )}
                {(delivery_status === "order_accepted" ||
                  delivery_status === "order_shiped") && (
                  <MenuItem value={"order_shiped"}>Order Shiped</MenuItem>
                )}
                {(delivery_status === "order_shiped" ||
                  delivery_status === "out_for_delivery") && (
                  <MenuItem value={"out_for_delivery"}>
                    Out For Delivery
                  </MenuItem>
                )}
                {(delivery_status === "out_for_delivery" ||
                  delivery_status === "delivered") && (
                  <MenuItem value={"delivered"}>Delivered</MenuItem>
                )}
              </Select>
            </FormControl>
            <br />
            <br />
            <br />
            {delivery_status !== "delivered" && (
              <Button
                size="small"
                variant="outlined"
                onClick={async () => {
                  console.log(
                    'cancel order from ures"s and seller"s order and Send Notificaaation To user in Order"s place'
                  );
                  const res = await axios.put(
                    `/seller_dashboard/pending_order`,
                    {
                      value: "order_cancel",
                    }
                  );
                  console.log(res);
                  Dispatch({
                    type: "Changed",
                    it: "PendingOrders",
                    to: true,
                  });
                }}
              >
                <Close />
                cancle order
              </Button>
            )}
          </div>
        )}
        {/*  */}
        <div
          style={{
            maxWidth: "270px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <span>
            <i>Order By </i>:{ORDER_BY}
          </span>
          <span>
            <i>Address </i>:{ADDRESS}
          </span>
          <span>
            <i>Contact </i> : +91 {CONTACT}
          </span>
        </div>
      </Paper>
    );
  }
  return (
    <Stack
      component={"div"}
      sx={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-evenly",
        gap: "10px",
        placeItems: "center",
        padding: "10px",
        overflow: "auto",
      }}
    >
      {(data === undefined ? true : data.error || !data) ? (
        <CircularProgress color="secondary" sx={{ margin: "auto" }} />
      ) : (
        data.map((item) => {
          return (
            <Orders
              key={nanoid()}
              IMAGE={item.thumbnail}
              PRODUCT_NAME={item.name}
              SHORT_DESCRIPTION={item.short_description}
              QUANTITY={item.quantity}
              SIZE={item.size}
              COLOR={item.color}
              TOTAL={item.total}
              DELIVERY_CHARGE={item.delivery_charge}
              ORDER_BY={item.order_by}
              ADDRESS={item.address}
              CONTACT={item.contact}
              PAYMENT_MODE={item.payment_mode}
              DELIVERY_STATUS={item.delivery_status}
            />
          );
        })
      )}
    </Stack>
  );
}

export default SD_PendingOrder;
