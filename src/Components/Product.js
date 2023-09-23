import React from "react";
import axios from "axios";
import { nanoid } from "nanoid";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  Alert,
  Button,
  IconButton,
  Paper,
  Rating,
  Skeleton,
  Snackbar,
  Stack,
} from "@mui/material";
import { ArrowBackIos, ArrowForwardIos, Circle } from "@mui/icons-material";
// import { Context } from "../Context";
import ProductCard from "./ProductCard";
import Footer from "./Footer";

function Product() {
  const { oid } = useParams();
  const [qry] = useSearchParams();
  // const { Data } = React.useContext(Context);
  const [img, setImg] = React.useState(0);
  const [ratingNO, setRatingNo] = React.useState(8);
  const [item, setItem] = React.useState(undefined);
  const [similarItem, setSimilarItem] = React.useState(undefined);
  const [notify, setNotify] = React.useState({ open: false, msg: "" });
  const [isFav, setIsFav] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    (async function () {
      const size = qry.get("size");
      const color = qry.get("color");
      const res = await axios.get(
        `/product/${oid}${
          color !== null && size !== null
            ? "?color=" + color + "&size=" + size
            : color !== null
            ? "?color=" + color
            : size !== null && "?size=" + size
        }`
      );
      console.log(res);
      if (res.error) alert(res.message);
      else {
        setItem(res.data);
        const similar_products = await axios.patch(
          `/product/${oid}${
            color !== null && size !== null
              ? "?color=" + color + "&size=" + size
              : color !== null
              ? "?color=" + color
              : size !== null && "?size=" + size
          }`
        );
        console.log("similar products", similar_products);
        if (similar_products.error) alert(similar_products.message);
        else setSimilarItem(similar_products.data);
      }
    })();
  }, [oid, qry]);

  // Average Ratings
  const ratingValues = !(item !== undefined ? item.error : true)
    ? item.ratings.length > 0
      ? item.ratings.map((a) => a.value)
      : [0]
    : [0];

  const AvgRating =
    !(item !== undefined ? item.error : true) &&
    ratingValues.reduce((a, b) => a + b) / item.ratings.length;
  console.log(ratingValues, AvgRating);
  // rating paper
  function Ratings() {
    if (!(item !== undefined ? item.error : true)) {
      const arr = [];
      for (let i = 0; i < item.ratings.length; i++) {
        if (ratingNO > i)
          arr.push(
            <Paper
              className="cart-item-paper"
              elevation={5}
              key={nanoid()}
              sx={{
                width: "auto",
                padding: "5px 2px",
              }}
            >
              <p className="h4">
                {item.ratings[i].given_by_name} &nbsp;
                <sub>
                  <Rating
                    value={item.ratings[i].value}
                    readOnly
                    precision={0.5}
                  />
                </sub>
              </p>
              <p className="h5">{item.ratings[i].review}</p>
            </Paper>
          );
      }
      return arr;
    } else return <></>;
  }

  function goToColor(color) {
    const size = qry.get("size");
    navigate(
      `/product/${item._id}${
        size ? "?color=" + color + "&size=" + size : "?color=" + color
      }`
    );
  }
  function goToSize(size) {
    const color = qry.get("color");
    navigate(
      `/product/${item._id}${
        color ? "?color=" + color + "&size=" + size : "?size=" + size
      }`
    );
  }

  return (
    <>
      <Paper padding="10px 20px 10px 20px">
        <Stack
          display={"flex"}
          direction={"row"}
          flexWrap={"wrap"}
          justifyContent={"space-evenly"}
          alignContent={"center"}
        >
          {/* images stack */}
          <Stack
            sx={{
              width: {
                xs: "99%",
                sm: "99%",
                md: "50%",
                lg: "45%",
                xl: "40%",
              },
              minWidth: {
                xs: "99%",
                sm: "99%",
                md: "50%",
                lg: "45%",
                xl: "40%",
              },
              padding: "2px 5px",
              margin: "1px 5px",
              display: "flex",
              flexDirection: "row",
              flexWrap: "nowrap",
              justifyContent: "center",
            }}
          >
            <IconButton
              onClick={() => {
                setImg((prev) => prev - 1);
              }}
              disabled={img === 0}
            >
              <ArrowBackIos />
            </IconButton>
            <div style={{ margin: "auto" }}>
              {(item !== undefined ? item.error : true) ? (
                <Skeleton
                  animation="pulse"
                  variant="rectangular"
                  height={
                    window.innerWidth > 500
                      ? window.innerWidth / 2.5
                      : window.innerWidth / 1.5
                  }
                  width={
                    window.innerWidth > 500
                      ? window.innerWidth / 2.5
                      : window.innerWidth / 1.5
                  }
                />
              ) : (
                <img
                  loading="lazy"
                  className="main-image-div"
                  src={`${item.images[img]}`}
                  alt="Product Images is Broken Due to Network Problem"
                />
              )}
            </div>
            <IconButton
              onClick={() => {
                setImg((prev) => prev + 1);
              }}
              disabled={
                img ===
                (!(item !== undefined ? item.error : true)
                  ? item.images.length - 1
                  : 0)
              }
            >
              <ArrowForwardIos />
            </IconButton>
          </Stack>
          {/* Short Description */}
          {!(item !== undefined ? item.error : true) ? (
            <Stack
              component={"div"}
              sx={{
                width: {
                  xs: "97%",
                  sm: "97%",
                  md: "45%",
                  lg: "50%",
                  xl: "55%",
                },
              }}
            >
              <p className="h2">{item.name}</p>
              <p className="h3">{item.short_description}</p>
              <p className="h3">Brand Name</p>
              {item.discount !== 0 && (
                <p className="h4">Offer : {item.discount}% instant Discount</p>
              )}
              <p className="h3">
                Price : {item.discount !== 0 && <s>{item.mrp}</s>}{" "}
                <b>
                  &#8377;
                  {item.discount === 0
                    ? item.mrp
                    : item.mrp - (item.mrp * item.discount) / 100}
                </b>{" "}
                + {item.tax}% GST
              </p>
              <p className="h4">
                {item.color !== "N/A" && (
                  <>
                    Color : {item.color.toUpperCase()} | Available :{" "}
                    {item.available_color.map((colors) => {
                      return (
                        <IconButton
                          key={nanoid()}
                          size="small"
                          sx={{ color: colors }}
                          onClick={() => {
                            goToColor(colors);
                          }}
                        >
                          <Circle />
                        </IconButton>
                      );
                    })}
                  </>
                )}
                <br />
                {item.size !== "N/A" && (
                  <>
                    Size : {item.size} | Available :{" "}
                    {item.available_size.map((sizes) => {
                      return (
                        <IconButton
                          key={nanoid()}
                          size="small"
                          color="primary"
                          onClick={() => {
                            goToSize(sizes);
                          }}
                        >
                          {sizes}
                        </IconButton>
                      );
                    })}
                  </>
                )}
              </p>
              <p className="h4">
                {item.ratings.length} Ratings |{" "}
                <sub>
                  <Rating
                    value={item.ratings.length > 0 ? AvgRating : 0}
                    max={5}
                    precision={0.5}
                    size="medium"
                    readOnly
                  />
                </sub>{" "}
                {AvgRating > 0 ? `(${AvgRating.toPrecision(2)})` : ""}
              </p>
              <p className="h4">
                <b>&#8377;{item.delivery_charge}</b> - Delivery Charge
              </p>
              {item.quantity <= 10 && (
                <div className="h4">
                  <p className="red">
                    Hurry Up, Only {item.quantity} Pieces Left...
                  </p>
                </div>
              )}
              <p>
                <Button
                  disabled={item.quantity === 0}
                  variant="contained"
                  size="large"
                  sx={{ margin: "5px 10px" }}
                  onClick={async () => {
                    const res = await axios.post(`/cart_product/${item._id}`);
                    setNotify({ open: true, msg: res.data.message });
                    if (!res.data.error) navigate("/cart");
                  }}
                >
                  Buy Now
                </Button>
                <Button
                  disabled={item.quantity === 0}
                  variant="contained"
                  size="large"
                  sx={{ margin: "5px 10px" }}
                  onClick={async () => {
                    const res = await axios.post(`/cart_product/${item._id}`);
                    setNotify({ open: true, msg: res.data.message });
                  }}
                >
                  Add to cart
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  sx={{ margin: "5px 10px" }}
                  onClick={async () => {
                    if (isFav === false) {
                      const res = await axios.post(
                        `/favourite_product/${item._id}`
                      );
                      setNotify({ open: true, msg: res.data.message });
                      if (!res.data.error) setIsFav(true);
                    } else {
                      const res = await axios.delete(
                        `/favourite_product/${item._id}`
                      );
                      setNotify({ open: true, msg: res.data.message });
                      if (!res.data.error) setIsFav(false);
                    }
                  }}
                >
                  {!isFav ? "Add To" : "Remove From "}favourites
                </Button>
              </p>
            </Stack>
          ) : (
            <div>
              <br />
              <Skeleton
                animation="pulse"
                variant="rectangular"
                height={50}
                width={window.innerWidth / 2.5}
              />
              <br />
              <Skeleton
                animation="pulse"
                variant="rectangular"
                height={50}
                width={window.innerWidth / 2.5}
              />
              <br />
              <Skeleton
                animation="pulse"
                variant="rectangular"
                height={50}
                width={window.innerWidth / 2.5}
              />
              <br />
              <Skeleton
                animation="pulse"
                variant="rectangular"
                height={50}
                width={window.innerWidth / 2.5}
              />
              <br />
              <Skeleton
                animation="pulse"
                variant="rectangular"
                height={50}
                width={window.innerWidth / 2.5}
              />
              <br />
              <Skeleton
                animation="pulse"
                variant="rectangular"
                height={50}
                width={window.innerWidth / 2.5}
              />
              <br />
              <Skeleton
                animation="pulse"
                variant="rectangular"
                height={50}
                width={window.innerWidth / 2.5}
              />
              <br />
              <Skeleton
                animation="pulse"
                variant="rectangular"
                height={50}
                width={window.innerWidth / 2.5}
              />
              <br />
              <Skeleton
                animation="pulse"
                variant="rectangular"
                height={50}
                width={window.innerWidth / 2.5}
              />
              <br />
            </div>
          )}
        </Stack>

        <Stack
          sx={{
            width: "100%",
            padding: "20px 10px", 
          }}
        >
          <br />
          <p className="h2">Product Description</p>
          {!(item !== undefined ? item.error : true) ? (
            <ul>
              {item.long_description.map((line) => {
                return (
                  <li key={nanoid()}>
                    <p className="h4">{line}</p>
                  </li>
                );
              })}
            </ul>
          ) : (
            <>
              <Skeleton
                animation="pulse"
                variant="rectangular"
                height={50}
                width={window.innerWidth / 1.2}
              />
              <br />
              <Skeleton
                animation="pulse"
                variant="rectangular"
                height={50}
                width={window.innerWidth / 1.2}
              />
              <br />
              <Skeleton
                animation="pulse"
                variant="rectangular"
                height={50}
                width={window.innerWidth / 1.2}
              />
              <br />
              <Skeleton
                animation="pulse"
                variant="rectangular"
                height={50}
                width={window.innerWidth / 1.2}
              />
              <br />
              <Skeleton
                animation="pulse"
                variant="rectangular"
                height={50}
                width={window.innerWidth / 1.2}
              />
              <br />
              <Skeleton
                animation="pulse"
                variant="rectangular"
                height={50}
                width={window.innerWidth / 1.2}
              />
              <br />
              <Skeleton
                animation="pulse"
                variant="rectangular"
                height={50}
                width={window.innerWidth / 1.2}
              />
              <br />
            </>
          )}
          <br />
          <p className="h2">Ratings And Reviews</p>
          {!(item !== undefined ? item.error : true) && (
            <Stack
              display="flex"
              gap="10px"
              flexWrap="wrap"
              justifyContent="space-evenly"
              flexDirection={"row"}
              padding={"20px 10px"}
            >
              <p className="h5">{item.ratings.length} Ratings & Reviews</p>
              {item.ratings.length > 0 && (
                <>
                  <Button
                    style={{ width: "100%" }}
                    disabled={ratingNO <= 8}
                    onClick={() => {
                      setRatingNo(8);
                    }}
                  >
                    {"<<"}view less
                  </Button>
                  <Ratings />
                  <Button
                    style={{ width: "100%" }}
                    disabled={
                      ratingNO >
                      (!(item !== undefined ? item.error : true)
                        ? item.ratings.length
                        : 1)
                    }
                    onClick={() => {
                      setRatingNo((pre) => pre + 4);
                    }}
                  >
                    view more{">>"}
                  </Button>
                </>
              )}
            </Stack>
          )}
          <br />
          <p className="h2">See some Similar Products..</p>
          {!(similarItem !== undefined ? similarItem.error : true) && (
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
              {similarItem.Products.map((item, index) => (
                <ProductCard
                  key={nanoid()}
                  _id={item._id}
                  img={`${similarItem.thumbnails}`}
                  title={item.name}
                  subtitle={item.short_description}
                  ratings={item.ratings}
                  button_needed={true}
                  mrp={item.mrp}
                  discount={item.discount}
                  sell_price={item.sell_price}
                  small={false}
                  color={item.color}
                  size={item.size}
                />
              ))}
            </Stack>
          )}
        </Stack>
      </Paper>

      {/* footer */}
      <Footer />

      {/* notification bar */}
      <Snackbar
        open={notify.open}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        onClose={() => setNotify({ open: false, msg: "" })}
      >
        <Alert severity="success">{notify.msg}</Alert>
      </Snackbar>
    </>
  );
}

export default Product;
