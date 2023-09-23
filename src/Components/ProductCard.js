import React from "react";
import axios from "axios";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Rating,
  ButtonGroup,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { FavoriteBorderOutlined, FavoriteOutlined } from "@mui/icons-material";
// import { Context } from "../Context";

function ProductCard(props) {
  const navigate = useNavigate();
  const [isFav, setIsFav] = React.useState(false);
  const [notify, setNotify] = React.useState({ open: false, msg: "" });
  // const { Dispatch } = React.useContext(Context);

  //make proper action on favourite , cant update context state
  async function handleFavourite() {
    if (isFav === false) {
      const res = await axios.post(`/favourite_product/${props._id}`);
      if (!res.data.error) setIsFav(true);
      setNotify({ open: true, msg: res.data.message });
    } else {
      const res = await axios.delete(`/favourite_product/${props._id}`);
      if (!res.data.error) setIsFav(false);
      setNotify({ open: true, msg: res.data.message });
    }
    // Dispatch({ type: "Changed", it: "Account", to: true });
  }
  // console.log(notify,isFav,props._id,Data.Favourites.length);

  const MaxWidth =
    props.small === true
      ? {
          xs: "135px",
          sm: "215px",
          md: "148px",
          lg: "217px",
          xl: "200px",
        }
      : {
          xs: "167px",
          sm: "250px",
          md: "180px",
          lg: "250px",
          xl: "230px",
        };

  function ratingCounts() {
    const len = props.ratings.length - 1;
    const total = props.ratings.map((a) => {
      return a.value;
    });

    return (
      total.reduce((a, b) => {
        return a + b;
      }) / len
    );
  }
  const sell_price =
    props.discount === 0
      ? props.mrp
      : props.mrp - (props.mrp * props.discount) / 100;

  const NavTo = () => {
    navigate(
      `/product/${props._id}${
        props.color !== "N/A" && props.size !== "N/A"
          ? "?color=" + props.color + "&size=" + props.size
          : props.color !== "N/A"
          ? "?color=" + props.color
          : props.size !== "N/A" && "?size=" + props.size
      }`
    );
  };

  return (
    <>
      <Card
        elevation={10}
        className="pointer"
        sx={{
          padding: "5px",
          alignSelf: "stretch",
          flexGrow: 1,
          maxWidth: MaxWidth,
          position: "relative", 
        }}
      >
        <CardMedia
          component={"img"}
          image={props.img}
          loading="lazy"
          alt="product image"
          sx={{
            height: "inherit",
            margin: "auto",
            maxWidth: MaxWidth,
          }}
          onClick={NavTo}
        />
        <CardHeader
          sx={{ padding: "2px", fontFamily: "serif" }}
          title={props.title.substr(0, 18) + ".."}
          subheader={`${props.color !== "N/A" ? props.color : ""}  ${
            props.size !== "N/A" ? props.size : ""
          } -${props.subtitle.substr(0, 45)}...`}
          onClick={NavTo}
        />
        <CardContent
          sx={{ padding: "2px", fontFamily: "serif" }}
          className="h6"
          onClick={NavTo}
        >
          {props.discount !== 0 && `Extra  ${props.discount}% Of`}
          <br />
          <s>{props.mrp > sell_price && props.mrp}</s>{" "}
          <b>
            <big>&#8377;{sell_price}</big>
          </b>
          {" + TAX"}
        </CardContent>
        <CardContent
          sx={{
            padding: "2px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
          }}
        >
          {props.button_needed && props.ratings.length + "|"}
          <Rating
            value={props.ratings.length === 0 ? 0 : ratingCounts()}
            max={5}
            precision={0.5}
            readOnly
            size="small"
            sx={{ flexGrow: 1 }}
          />
          <IconButton
            className="favourite-icon"
            size="small"
            onClick={() => handleFavourite()}
          >
            {isFav ? <FavoriteOutlined /> : <FavoriteBorderOutlined />}
          </IconButton>
        </CardContent>
        <CardActions
          sx={{
            justifyContent: "center",
          }}
        >
          {props.button_needed && (
            <ButtonGroup variant="contained" size="small">
              <Button
                onClick={async () => {
                  const res = await axios.post(`/cart_product/${props._id}`);
                  setNotify({ open: true, msg: res.data.message });
                  if (!res.data.error) navigate("/cart");
                }}
              >
                Buy Now
              </Button>
              <Button
                onClick={async () => {
                  const res = await axios.post(`/cart_product/${props._id}`);
                  setNotify({ open: true, msg: res.data.message });
                }}
              >
                Add to Cart
              </Button>
            </ButtonGroup>
          )}
        </CardActions>
      </Card>

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

export default ProductCard;
