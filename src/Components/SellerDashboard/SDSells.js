import axios from "axios";
import React from "react";
import dotenv from "dotenv";
dotenv.config();

function SD_Sells() {
  React.useEffect(() => {
    if(axios.defaults.headers.common.Authorization !== process.env.HEADER_COMMON_AUTH)
      (async function () {
        const res = await axios.get(`/seller_dashboard/sells`);
        console.log(res);
      })();
  }, [axios.defaults.headers.common.Authorization]);

  return <div>SD_Sells</div>;
}

export default SD_Sells;
