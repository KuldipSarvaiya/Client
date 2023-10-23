import React, { useContext } from "react";
import {
  AccountCircle,
  Category,
  Home,
  // MobiledataOff,
  // Refresh,
  Search,
  ShoppingCart,
} from "@mui/icons-material";
import {
  AppBar,
  Toolbar,
  Stack,
  IconButton,
  useMediaQuery,
  useTheme,
  Tooltip,
  TextField,
  InputAdornment,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Badge,
  // Dialog,
  // DialogTitle,
  // DialogContent,
} from "@mui/material";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Context } from "../Context";

function Navbar() {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const smallTitles = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const location = useLocation();
  const [navValue, setNavValue] = React.useState(null);
  // const [hasNet, setHasNet] = React.useState(navigator.onLine);
  const [searchTag, setSearchTag] = React.useState("");
  const { Data } = useContext(Context);

  // setting searched text after navigating from search page to another page
  React.useEffect(() => {
    console.log(navigator.onLine);
    if (location.pathname !== "/products") setSearchTag("");
    // setHasNet(navigator.onLine);
  }, [location.pathname]);

  // This  Margin set to Display hidden part behind Bottom Navigation
  if (isSmall === true) {
    document.querySelector("body").style.margin = " 0px 0px 60px 0px";
  }

  function Controls() {
    return (
      <Stack direction={"row"} gap={2}>
        <Tooltip title="Categories">
          <NavLink
            to={"/categories"}
            style={({ isActive }) => ({
              color: "inherit",
              borderBottom: isActive && "3px solid whitesmoke",
            })}
          >
            <IconButton
              // onClick={() => {
              //   navigate("/categories");
              // }}
              color="inherit"
              size={smallTitles ? "small" : "medium"}
            >
              Categories
            </IconButton>
          </NavLink>
        </Tooltip>
        {/* <hr /> */}
        <Tooltip title="Cart">
          <NavLink
            to={"/cart"}
            style={({ isActive }) => ({
              color: "inherit",
              borderBottom: isActive && "3px solid whitesmoke",
            })}
          >
            <Badge badgeContent={Data.CartItemsCount} color={"secondary"}>
              <IconButton
                color="inherit"
                size={smallTitles ? "small" : "medium"}
                // onClick={() => navigate("/cart")}
              >
                Cart
              </IconButton>
            </Badge>
          </NavLink>
        </Tooltip>
        {/* <hr /> */}
        <Tooltip title="Account">
          <NavLink
            to={"/account"}
            style={({ isActive }) => ({
              color: "inherit",
              borderBottom: isActive && "3px solid whitesmoke",
            })}
          >
            <IconButton
              // onClick={() => {
              //   navigate("/account");
              // }}
              color="inherit"
              size={smallTitles ? "small" : "medium"}
            >
              Account
            </IconButton>
          </NavLink>
        </Tooltip>
      </Stack>
    );
  }

  return (
    <>
      <AppBar color="primary" position="static" sx={{ padding: 0, margin: 0 }}>
        <Toolbar sx={{ padding: "0px 2px 0px 5px", margin: 0 }}>
          {/* Logo Title */}
          <Stack direction={"row"} sx={{ flexGrow: 1 }}>
            <Tooltip title="Home">
              <Link
                to={"/"}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className="logo-div">
                  <img src="logo.png" className="navLogo" alt="" />
                  <h2>E~Cart&nbsp;</h2>
                </div>
              </Link>
            </Tooltip>
          </Stack>
          {/* Search Field */}
          <Tooltip title="Search for Item's Keyword">
            <TextField
              type="search"
              size="small"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{
                maxWidth: window.innerWidth / 1.7,
                borderRadius: "8px",
                backgroundColor: "whitesmoke", 
              }}
              value={searchTag}
              onChange={(e) => setSearchTag(e.target.value)}
              onKeyUp={(e) => {
                if (e.keyCode === 13) {
                  navigate(`/products?tag=${searchTag}`);
                }
              }}
            />
          </Tooltip>
          &nbsp;
          {/* NavBar Navigation */}
          {!isSmall && <Controls />}
        </Toolbar>
      </AppBar>

      {/* BottomNAvigation */}
      {isSmall && (
        <Paper
          elevation={5}
          sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1 }}
        >
          <BottomNavigation
            value={navValue}
            onChange={(event, newValue) => {
              console.log(newValue);
              setNavValue(newValue);
            }}
            sx={{
              backfaceVisibility: "visible",
            }}
          >
            <BottomNavigationAction
              label="HOME"
              onClick={() => navigate("/")}
              icon={<Home />}
            />
            <BottomNavigationAction
              label="CATEGORIES"
              onClick={() => navigate("/categories")}
              icon={<Category />}
            />
            <BottomNavigationAction
              label="ACCOUNT"
              onClick={() => navigate("/account")}
              icon={<AccountCircle />}
            />
            <BottomNavigationAction
              label="CART"
              onClick={() => navigate("/cart")}
              icon={
                <Badge
                  badgeContent={Data.CartItemsCount}
                  showZero
                  color="primary"
                >
                  <ShoppingCart />
                </Badge>
              }
            />
          </BottomNavigation>
        </Paper>
      )}

      {/* No Internet Warning Dialog */}
      {/* <Dialog open={!navigator.onLine} sx={{ zIndex: 10000 }}>
        <DialogTitle color={"error"}>
          <sub>
            <MobiledataOff />
          </sub>
          No Internet Connection
        </DialogTitle>
        <DialogContent>
          <span className="h5">
            <sub>
              <Refresh />
            </sub>
            Make Sure You Are Connected To Internet And Refresh Again &nbsp;
            <br />
            <li style={{ marginLeft: "20px" }}>
              You Can Not Have Best User Experience Without Active Internet
              Connection
            </li>
          </span>
        </DialogContent>
      </Dialog> */}
    </>
  );
}

export default Navbar;
