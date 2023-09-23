import axios from "axios";
import React from "react";
// import { Context } from '../Context'
import { Outlet } from "react-router-dom";

function Home() {
  React.useEffect(() => {
    (async function () {
      const res = await axios.get(`/`);
      if (res.data.error) {
        alert(`Error From Landing Page = ${res.data.message}`);
      }
      console.log(res);
    })();
  }, []);

  // const { Data } = React.useContext(Context)

  return (
    <>
      <Outlet />
    </>
  );
}

export default Home;
