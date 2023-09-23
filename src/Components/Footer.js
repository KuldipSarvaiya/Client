import React from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Rating,
  Stack,
  TextField,
} from "@mui/material";
import {
  ArrowOutward,
  Call,
  DoubleArrow,
  Email,
  Facebook,
  GitHub,
  InfoRounded,
  Instagram,
  Link,
  LinkedIn,
  LocationOn,
  Send,
  SentimentNeutral,
  SentimentVerySatisfied,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useCookie } from "react-use";
import axios from "axios";

function Footer() {
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = React.useState({
    open: false,
    title: "",
    msg: "",
  });
  const [logedIn, setLogedIn] = React.useState(false);
  const [logs] = useCookie("logs");

  React.useEffect(() => {
    if (logs !== null) setLogedIn(true);
  }, [logs]);

  function FeedBack() {
    const [value, setValue] = React.useState(0);
    const [desc, setDesc] = React.useState("");

    const labels = {
      0: "Make Us Happy",
      0.5: "Useless😑",
      1: "Not Useless🫥",
      1.5: "Too Poor😪",
      2: "Poor😕",
      2.5: "Not Bad🙄",
      3: "Not So Bad👍",
      3.5: "Good😇",
      4: "Very Good😃",
      4.5: "Excellent🤩",
      5: "Mind Blowing🤯",
    };

    function getLabelText(value) {
      return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
    }

    async function submitFeedback() {
      if (value !== 0 && desc.length !== 0) {
        const res = await axios.post("/feedback", {
          rating: value,
          feedback: desc,
        });
        alert(res.data);
        setShowDialog({ open: false });
      } else alert("Make Sure To Fill Proper Details Before Submiting..");
    }

    if (logs === null) navigate("/login");
    else
      return (
        <>
          <br />
          <br />
          <Rating
            getLabelText={getLabelText}
            size="large"
            value={value}
            max={5}
            onChange={(e, nv) => setValue(nv)}
            precision={0.5}
            emptyIcon={<SentimentNeutral />}
            icon={<SentimentVerySatisfied />}
          />
          {value !== null && (
            <span>
              <sup>
                <b> :- {labels[value]}</b>
              </sup>
            </span>
          )}
          <br />
          <br />
          <TextField
            value={desc}
            onChange={(e) => {
              setDesc(e.target.value);
            }}
            multiline
            type="text"
            variant="filled"
            label="Share Your Experience"
            color="info"
            rows={4}
            fullWidth
          />
          <br />
          <br />
          <center>
            <Button
              onClick={submitFeedback}
              variant="outlined"
              color="secondary"
            >
              Send FeedBack &nbsp; <Send />
            </Button>
          </center>
        </>
      );
  }

  return (
    <>
      <footer className="footer">
        {/* become seller part */}
        <Paper
          elevation={10}
          sx={{
            margin: "5px",
            display: "flex",
            justifyContent: "center",
            borderRadius: "20px",
            padding: "0px 20px",
          }}
        >
          <span className="become-seller-span">
            Become{" "}
            <Button
              size="large"
              color="warning"
              sx={{ margin: 0 }}
              onClick={() => navigate("/seller_dashboard")}
            >
              <span className="become-seller-btn">
                E-CART SELLER
                <ArrowOutward />
              </span>
            </Button>{" "}
            And Grow Your Business Online With Us👨🏻‍💼.
          </span>
        </Paper>
        {/* actual footer informations part */}
        <Paper
          elevation={10}
          sx={{
            padding: "20px",
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: "5px",
            justifyContent: "space-around",
            // backgroundImage: "url(main_footer2.jpg)",
            // backgroundRepeat: "repeat-y",
            // backgroundBlendMode: "multiply",
            // // backgroundColor:'rgba(0,0,0,0.8)',
            // backgroundSize: "100%",
          }}
        >
          {/* image part */}
          <Stack
            component={"div"}
            sx={{
              maxWidth: {
                xs: "150px",
                sm: "230px",
                md: "160px",
                lg: "230px",
                xl: "210px",
              },
            }}
          >
            <img src="../logo.png" alt="logo of ecart" />
            <span className="footer-name-span">
              <center>E-CART</center>
            </span>
            <span className="footer-subname-span">
              <center>E-COMMERCE</center>
            </span>
            {/* <center>
              <p
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "nowrap",
                  fontFamily: "cursive",
                }}
              >
                #SellMore_GrowMore_EarnMore
                <TrendingUp />
              </p>
            </center> */}
          </Stack>
          {/* about us */}
          <Stack
            spacing={0}
            display={"flex"}
            flexDirection={"column"}
            width={{
              xs: "95%",
              sm: "45%",
              md: "30%",
              lg: "25%",
            }}
          >
            <span className="footer-header">About Us</span>
            <span className="footer-content">
              <IconButton href="tel:9724924494" color="success" size="small">
                <Call />
              </IconButton>{" "}
              +91 9724924494
            </span>
            <span className="footer-content">
              <IconButton href="mailto:ecart.shop.business@gmail.com" color="error" size="small">
                <Email />
              </IconButton>{" "}
              ecart.shop.business@gmail.com
            </span>
            <span className="footer-content">
              <IconButton color="default" size="small">
                <LocationOn />
              </IconButton>{" "}
              surat, gujarat, india.
            </span>
            <span className="footer-content">
              <IconButton color="primary" size="small">
                <InfoRounded />
              </IconButton>{" "}
              this site is developed by KULDIP SARVAIYA{" "}
              <Button
                size="small"
                color="primary"
                onClick={() =>
                  setShowDialog({
                    open: true,
                    title: "Helloo, from DEVELOPER",
                    msg: "hey there, \nhows all going?\nall good\nnice",
                  })
                }
              >
                see details
                <ArrowOutward />
              </Button>
            </span>
          </Stack>
          {/* useful links */}
          <Stack
            width={{
              xs: "95%",
              sm: "45%",
              md: "30%",
              lg: "25%",
            }}
            spacing={0}
            display={"flex"}
            flexDirection={"column"}
          >
            <span className="footer-header">Useful Links</span>
            <span
              className="footer-content cursor-pointer"
              onClick={() => navigate("/")}
            >
              <IconButton color="default" size="small">
                <DoubleArrow />
              </IconButton>{" "}
              home
            </span>
            <span
              className="footer-content cursor-pointer"
              onClick={() => navigate("/account")}
            >
              <IconButton color="default" size="small">
                <DoubleArrow />
              </IconButton>{" "}
              my account
            </span>
            <span
              className="footer-content cursor-pointer"
              onClick={() => navigate(logedIn ? "/account/panel5" : "/login")}
            >
              <IconButton color="default" size="small">
                <DoubleArrow />
              </IconButton>{" "}
              {logedIn ? "signOut" : "signIn/signUp"}
            </span>
            <span
              className="footer-content cursor-pointer"
              onClick={() =>
                setShowDialog({
                  open: true,
                  title: "hey kd,",
                  msg: "This is Privacy Policy Dialog",
                })
              }
            >
              <IconButton color="default" size="small">
                <DoubleArrow />
              </IconButton>{" "}
              privacy policy
            </span>
            <span
              className="footer-content cursor-pointer"
              onClick={() =>
                setShowDialog({
                  open: true,
                  title: "hey kd,",
                  msg: "This is term & condition Dialog",
                })
              }
            >
              <IconButton color="default" size="small">
                <DoubleArrow />
              </IconButton>{" "}
              term & condition
            </span>
            <span
              className="footer-content cursor-pointer"
              onClick={() =>
                setShowDialog({
                  open: true,
                  title: "Your Feedback Holds Value For Us.",
                  msg: <FeedBack />,
                })
              }
            >
              <IconButton color="default" size="small">
                <DoubleArrow />
              </IconButton>{" "}
              feedback
            </span>
          </Stack>
          {/* social media part */}
          <Stack
            width={{
              xs: "95%",
              sm: "45%",
              md: "30%",
              lg: "25%",
            }}
            spacing={0}
            display={"flex"}
            flexDirection={"column"}
          >
            <span className="footer-header">Follow Us</span>
            <span className="footer-content">
              <IconButton
                color="primary"
                size="small"
                href="https://kuldipsarvaiya.github.io/KDs-Portfolio/"
              >
                <Link />
              </IconButton>{" "}
              Portfolio
            </span>
            <span className="footer-content">
              <IconButton
                color="secondary"
                size="small"
                href="https://www.instagram.com/kd_sarvaiya_/"
              >
                <Instagram />
              </IconButton>{" "}
              instagram
            </span>
            <span className="footer-content">
              <IconButton
                color="default"
                size="small"
                href="https://github.com/KuldipSarvaiya"
              >
                <GitHub />
              </IconButton>{" "}
              github
            </span>
            <span className="footer-content">
              <IconButton
                color="primary"
                size="small"
                href="https://www.linkedin.com/in/kuldip-sarvaiya-2592a425b/"
              >
                <LinkedIn />
              </IconButton>{" "}
              linedIn
            </span>
            <span className="footer-content">
              <IconButton
                color="info"
                size="small"
                href="https://www.facebook.com/kuldip.sarvaiya.376?mibextid=ZbWKwL"
              >
                <Facebook />
              </IconButton>{" "}
              facebook
            </span>
          </Stack>
          {/* copy right part */}
          <hr width="100%" />
          <span className="footer-content copy-right">
            e-cart Copyright © 2023 - All rights reserved <br /> developed By:
            KULDIP SARVAIYA
          </span>
        </Paper>
      </footer>

      {/* Information Dialog */}
      <Dialog
        open={showDialog.open}
        onClose={() => setShowDialog({ open: false, title: "", msg: "" })}
      >
        <DialogTitle>{showDialog.title}</DialogTitle>
        <DialogContent>{showDialog.msg}</DialogContent>
      </Dialog>
    </>
  );
}

export default Footer;
