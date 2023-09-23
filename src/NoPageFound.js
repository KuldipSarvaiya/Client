import { ArrowBack } from "@mui/icons-material";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

function NoPageFound() {
  return (
    <Dialog open>
      <DialogTitle>404 - Page Not Found {":("}</DialogTitle>
      <DialogContent>
        The Page You Are Tring To Reach Is Unavailable.
        <br />
        May You Have Entered Wrong URL.
      </DialogContent>
      <DialogContent>
        <sub>
          <ArrowBack />
        </sub>{" "}
        Go Back To{" "}
        <Link to={"/"}>
          <span style={{ color: "red" }}>
            <b>Home</b>
          </span>
        </Link>{" "}
        Page
      </DialogContent>
    </Dialog>
  );
}

export default NoPageFound;
