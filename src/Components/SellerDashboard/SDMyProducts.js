import { Button, CircularProgress, Paper, Rating, Stack } from "@mui/material";
import React from "react";
import { nanoid } from "nanoid";
import { Delete, Edit } from "@mui/icons-material";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Context } from "../../Context";
import dotenv from "dotenv";
dotenv.config();

function SD_MyProducts() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [data, setData] = React.useState(undefined);
  const { Data, Dispatch } = React.useContext(Context);

  React.useEffect(() => {
    if (
      Data.Changed.MyProducts &&
      Data.Changed.HeaderJWT_set &&
      axios.defaults.headers.common.Authorization !==
      process.env.HEADER_COMMON_AUTH
    )
      (async function () {
        const res = await axios.get("/seller_dashboard/my_product");
        console.log(res);
        if (!res.data.error) {
          Dispatch({
            type: "set_my_products",
            my_products: res.data.my_products,
          });
          console.log(res.data.my_products);
          setData(res.data.my_products);
        } else alert(res.data.message);
      })();
    else setData(Data.MyProducts);
  }, [Data.Changed.MyProducts, Data.Changed.HeaderJWT_set,axios.defaults.headers.common.Authorization]);

  function AllProducts({
    _OID,
    IMAGE,
    PRODUCT_NAME,
    MRP,
    RATINGS,
    QUANTITY,
    SHORT_DESCRIPTION,
    COLOR,
    SIZE,
  }) {
    async function deleteItem() {
      const res = await axios.delete(`/seller_dashboard/my_product/${_OID}`);
      console.log(res);
      if (!res.data.error)
        Dispatch({
          type: "Changed",
          it: "MyProducts",
          to: true,
        });
      alert(res.data.message);
    }

    return (
      <Stack key={nanoid()}>
        <Paper
          elevation={10}
          sx={{
            width: {
              xs: "150px",
              sm: "150px",
              md: "180px",
              lg: "220px",
              xl: "200px",
            },
            padding: "5px 2px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
            flexWrap: "nowrap",
            gap: "5px",
            alignSelf: "stretch",
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
              alignSelf: "center",
            }}
          >
            <img src={IMAGE} alt="item Immge" />
          </Stack>
          <div>
            <b>{PRODUCT_NAME}</b>
            <br />
            <span>{SHORT_DESCRIPTION.substr(0, 50) + "..."}</span> <br />
            <span>
              {COLOR !== "N/A" && `Color-${COLOR} | `}
              {SIZE !== "N/A" && `Size-${SIZE}`}
            </span>{" "}
            <br />
            <span>
              MRP <span>&#8377;{MRP}</span>
            </span>
            <br />
            <span>Quantity : {QUANTITY}</span> <br />
            <Rating value={RATINGS} readOnly precision={0.5} size="small" />
          </div>
          <Button
            variant="contained"
            size="small"
            onClick={() => {
              navigate(_OID);
            }}
          >
            Change&nbsp;Details <Edit />
          </Button>
          <Button variant="contained" size="small" onClick={() => deleteItem()}>
            delete item
            <Delete />
          </Button>
        </Paper>
      </Stack>
    );
  }

  return (
    <>
      {pathname === "/seller_dashboard/my_product" ? (
        <Stack
          display={"flex"}
          flexDirection={"row"}
          flexWrap={"wrap"}
          justifyContent={"space-evenly"}
          gap={"20px"}
          padding={"5px 30px 0px"}
        >
          {(data !== undefined ? data.error : true) ? (
            <CircularProgress color="secondary" sx={{ margin: "auto" }} />
          ) : (
            data.map((item) => {
              return (
                <AllProducts
                  key={nanoid()}
                  _OID={item._id}
                  IMAGE={item.image}
                  PRODUCT_NAME={item.product_name}
                  MRP={item.mrp}
                  RATINGS={item.ratings}
                  QUANTITY={item.quantity}
                  SHORT_DESCRIPTION={item.short_description}
                  COLOR={item.color}
                  SIZE={item.size}
                />
              );
            })
          )}
        </Stack>
      ) : (
        <Outlet />
      )}
    </>
  );
}

export default SD_MyProducts;
