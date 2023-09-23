import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "./Components/Home";
import Account from "./Components/Account";
import Login from "./Components/Login";
import Products from "./Components/Products";
import Product from "./Components/Product";
import Cart from "./Components/cart/Cart";
import Categories from "./Components/Categories";
import Navbar from "./Components/Navbar";
import { ThemeProvider, createTheme } from "@mui/material";
import { Context } from "./Context";
import SellerDashboard from "./Components/SellerDashboard";
import SDHome from "./Components/SellerDashboard/SDHome";
import SDAddProduct from "./Components/SellerDashboard/SDAddProduct";
import SDMyProducts from "./Components/SellerDashboard/SDMyProducts";
import SDAccount from "./Components/SellerDashboard/SDAccount";
import SDCompletedOrder from "./Components/SellerDashboard/SDCompletedOrder";
import SDPendingOrder from "./Components/SellerDashboard/SDPendingOrder";
import SDSells from "./Components/SellerDashboard/SDSells";
import CgProductDetails from "./Components/SellerDashboard/CgProductDetails";
import axios from "axios";
import { useCookie, useLocation } from "react-use";
import { DecodeData } from "./Components/SecureData";
import NoPageFound from "./NoPageFound";
import PaymentSuccess from "./Components/cart/PaymentSuccess";
import PaymentFailed from "./Components/cart/PaymentFailed";

axios.defaults.baseURL = "http://localhost:8080";
axios.defaults.headers.common.Authorization =
  "E-Cart this_is_JWT_loaded_by_axios";

function App() {
  const { Data, Dispatch } = React.useContext(Context);
  const [logs] = useCookie("logs");
  const navigate = useNavigate();
  const { pathname } = useLocation();

  React.useEffect(() => {
    if (logs !== null && !Data.Changed.HeaderJWT_set) {
      (async function () {
        const logsInfo = await DecodeData({ token: logs });
        // console.log("logsInfo app = ", logsInfo, logs);
        if (logsInfo !== undefined) {
          axios.defaults.headers.common.Authorization = `E-Cart ${logsInfo.jwt}`;
          Dispatch({ type: "Header_Set", role: logsInfo.role });
          if (
            logsInfo.role === "seller" &&
            !pathname.startsWith("/seller_dashboard")
          ) {
            navigate("/seller_dashboard", { replace: true });
          }
        }
      })();
    }
  }, [logs]);

  const theme = createTheme({
    palette: {
      mode: Data.DarkTheme === true ? "dark" : "light",
    },
  });

  // console.log(Data);

  return (
    <>
      <ThemeProvider theme={theme}>
        {Data.Role !== "seller" && <Navbar />}
        <Routes>
          <Route exact path="/" element={<Home />}>
            <Route index element={<Products />} />
          </Route>
          <Route path="/products" element={<Products />} />
          <Route path="/product/:oid" element={<Product />} />
          <Route exact path="/login" element={<Login />} />
          <Route path="/account/" element={<Account />} />
          <Route path="/account/:panel" element={<Account />} />
          <Route path="/cart">
            <Route index element={<Cart />} />
            <Route path="success" element={<PaymentSuccess />} />
            <Route path="failed" element={<PaymentFailed />} />
          </Route>
          <Route path="/categories" element={<Categories />} />
          <Route path="/seller_dashboard" element={<SellerDashboard />}>
            <Route index element={<SDHome />} />
            <Route path="login" element={<Login />} />
            <Route path="add_product" element={<SDAddProduct />} />
            <Route path="my_product" element={<SDMyProducts />}>
              <Route path=":oid" element={<CgProductDetails />} />
            </Route>
            <Route path="account" element={<SDAccount />} />
            <Route path="completed_order" element={<SDCompletedOrder />} />
            <Route path="pending_order" element={<SDPendingOrder />} />
            <Route path="sells" element={<SDSells />} />
          </Route>
          <Route path="*" element={<NoPageFound />} />
        </Routes>
      </ThemeProvider>
    </>
  );
}

export default App;
