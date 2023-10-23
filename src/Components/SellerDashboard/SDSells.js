import axios from "axios";
import React from "react"; 

function SD_Sells() {
  React.useEffect(() => {
    if(axios.defaults.headers.common.Authorization !== "E-Cart this_is_JWT_loaded_by_axios")
      (async function () {
        const res = await axios.get(`/seller_dashboard/sells`);
        console.log(res);
      })();
  }, [axios.defaults.headers.common.Authorization]);

  return <div>SD_Sells</div>;
}

export default SD_Sells;
