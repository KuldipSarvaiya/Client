import { Badge, Box, Button, Drawer, Paper, Stack } from "@mui/material";
import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useCookie } from "react-use";
import { DecodeData } from "./SecureData";
import { Context } from "../Context";

function SellerDashboard() {
  const [logs] = useCookie("logs");
  const navigate = useNavigate();
  const { Data } = React.useContext(Context);

  React.useEffect(() => {
    (async function () {
      if (logs !== null) {
        const logsInfo = await DecodeData({ token: logs });
        // console.log(logsInfo);
        if (logsInfo !== undefined)
          if (logsInfo.role !== "seller") navigate("login", { replace: true });
      } else {
        navigate("login", { replace: true });
      }
    })();
  }, []);

  return (
    <>
      {/* sidebar */}
      <Box component={"nav"}>
        <Drawer variant="permanent" open anchor="left">
          <Stack
            spacing={2}
            sx={{
              padding: "10px 20px",
            }}
          >
            <Stack
              sx={{
                writingMode: "vertical-rl",
                alignItems: "center",
              }}
            >
              <span className="h2">
                E&nbsp;-&nbsp;C&nbsp;a&nbsp;r&nbsp;t
                <br />
                <sup className="h6">Seller&nbsp;Dashboard</sup>
              </span>
              <Box
                component={"img"}
                alt="&nbsp;E-Cart"
                src="../logo.png"
                sx={{
                  height: "auto",
                  width: "130px",
                  writingMode: "horizontal-tb",
                }}
              />
            </Stack> 
            <NavLink className={"drawer-navlink"} to={"/seller_dashboard/"}>
              <Button variant="outlined">home</Button>
            </NavLink>
            <NavLink
              className={"drawer-navlink"}
              to={"/seller_dashboard/add_product"}
              replace={true}
            >
              <Button variant="outlined">add product</Button>
            </NavLink>
            <NavLink
              className={"drawer-navlink"}
              to={"/seller_dashboard/my_product"}
              replace={true}
            >
              <Button variant="outlined">my products</Button>
            </NavLink>
            <NavLink
              className={"drawer-navlink"}
              to={"/seller_dashboard/pending_order"}
              replace={true}
            >
              <Stack>
                <Badge badgeContent={Data.PendingOrdersCount} color="secondary">
                  <Button
                    variant="outlined"
                    sx={{ width: "-webkit-fill-available" }}
                  >
                    pending orders
                  </Button>
                </Badge>
              </Stack>
            </NavLink>
            <NavLink
              className={"drawer-navlink"}
              to={"/seller_dashboard/completed_order"}
              replace={true}
            >
              <Button variant="outlined">completed orders</Button>
            </NavLink>
            {/* <NavLink
              className={"drawer-navlink"}
              to={"/seller_dashboard/sells "}
              replace={true}
            >
              <Button variant="outlined">sells</Button>
            </NavLink> */}
            <NavLink
              className={"drawer-navlink"}
              to={"/seller_dashboard/account "}
              replace={true}
            >
              <Button variant="outlined">account</Button>
            </NavLink>
          </Stack>
        </Drawer>
      </Box>

      <Paper
        component={"main"}
        sx={{
          m: 1,
          width: "calc(100% - 250px)",
          marginLeft: "245px",
          height: window.innerHeight - 20,
          display: "flex",
          overflow: "auto",
          borderRadius: "10px",
          justifyContent: "center",
          scrollbarGutter: "stable",
        }}
      >
        <Outlet />
      </Paper>
    </>
  );
}

export default SellerDashboard;
