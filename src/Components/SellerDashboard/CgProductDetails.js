import React from "react";
import { Button, TextField } from "@mui/material";
import { useParams } from "react-router-dom";
import { Save, Update } from "@mui/icons-material";
import axios from "axios";
import { Context } from "../../Context";

function CgProductDetails() {
  const [isUpdtble, setIsUpdtble] = React.useState(false);
  const { Dispatch } = React.useContext(Context);

  // fetch data and update this state to display all information about product
  const [data, setData] = React.useState({
    PRODUCT_NAME: "Loading...",
    BRAND_NAME: "Loading...",
    MRP: 1,
    TAX_GST: 1,
    DELIVERY_CHARGE: 1,
    DISCOUNT: 1,
    QUANTITY: 1,
    CATEGORY: "",
    TAGS: "Loading...",
    SHORT_DESCRIPTION: "Loading...",
    LONG_DESCRIPTION: "Loading...",
    SIZE: "Loading...",
    COLOR: "Loading...",
  });
  const { oid } = useParams();
  const pref = React.useRef(null);

  React.useEffect(() => {
    (async function () {
      const res = await axios.get(`/seller_dashboard/my_product/${oid}`);
      console.log(res);
      if (!res.data.error) {
        pref.current = res.data;
        setData(res.data);
      } else alert(res.data.message);
    })();
    const noReload = (event) => {
      event.preventDefault();
      // event.abort();
      console.log("cnh loaded",event)
    };
    window.addEventListener("load", noReload);

    return () => {
      window.removeEventListener("load", noReload);
      console.log("cng loaded removed")
    };
  }, [oid]);

  function handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;

    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });

    console.log(data);
  }

  async function handleSubmit() {
    if (data !== pref.current) {
      const res = await axios.put(`/seller_dashboard/my_product/${oid}`, data);
      console.log(res);
      if (!res.data.error)
        Dispatch({ type: "Changed", it: "MyProducts", to: true });
      alert(res.data.message);
    } else console.log("is data === pref : ", data === pref.current);
    setIsUpdtble(false);
  }

  return (
    <div className="sd-addproduct-main">
      <center>
        <span className="h2">
          These Are Editable Details Of &nbsp;&nbsp;
          <br /> {data.PRODUCT_NAME}
        </span>
      </center>
      <hr width="95%" className="hr" />
      <form
        method="POST"
        encType="multipart/form-data"
        onSubmit={() => {
          alert("new product added");
        }}
      >
        <div className="sd-product-dtl">
          <TextField
            value={data.PRODUCT_NAME}
            disabled={!isUpdtble}
            onChange={(e) => {
              handleChange(e);
            }}
            name="PRODUCT_NAME"
            label="PRODUCT NAME"
            variant="outlined"
            type="text"
            required
            helperText="Use Shorter Name As Possible"
          />
          <TextField
            value={data.BRAND_NAME}
            disabled={!isUpdtble}
            onChange={(e) => {
              handleChange(e);
            }}
            name="BRAND_NAME"
            label="BRAND NAME"
            variant="outlined"
            type="text"
            required
            helperText="Include The Name of Manufacturer"
          />
          <TextField
            value={data.MRP}
            disabled={!isUpdtble}
            onChange={(e) => {
              handleChange(e);
            }}
            name="MRP"
            label="MRP"
            variant="outlined"
            type="number"
            required
            helperText="MRP Without any Charge or Discount"
          />
          <TextField
            value={data.TAX_GST}
            disabled={!isUpdtble}
            onChange={(e) => {
              handleChange(e);
            }}
            name="TAX_GST"
            label="TAX / GST"
            variant="outlined"
            type="number"
            required
            helperText="Include Tax in Percentage(%)"
          />
          <TextField
            value={data.DELIVERY_CHARGE}
            disabled={!isUpdtble}
            onChange={(e) => {
              handleChange(e);
            }}
            name="DELIVERY_CHARGE"
            label="DELIVERY CHARGE"
            variant="outlined"
            type="number"
            required
            helperText="This Charge Should As Per One Product"
          />
          <TextField
            value={data.DISCOUNT}
            disabled={!isUpdtble}
            onChange={(e) => {
              handleChange(e);
            }}
            name="DISCOUNT"
            label="DISCOUNT"
            variant="outlined"
            type="number"
            helperText="In Percentage(%), Calculated On MRP"
          />
          {/* <TextField
            value={data.SELL_PRICE} 
            disabled={!isUpdtble}
            onChange={(e) => {
              handleChange(e);
            }}
            name="SELL_PRICE"
            label="SELL PRICE"
            variant="outlined"
            type="number"
            helperText="Calculated Based On MRP,Discount and Tax"
          /> */}
          <TextField
            value={data.QUANTITY}
            disabled={!isUpdtble}
            onChange={(e) => {
              handleChange(e);
            }}
            name="QUANTITY"
            label="QUANTITY"
            variant="outlined"
            type="number"
            required
            helperText="Number of Quantity You Have"
          />
          <TextField label="categories" value={data.CATEGORY} disabled={true} />
          <TextField
            value={data.SIZE}
            disabled={!isUpdtble}
            name="SIZE"
            label="SIZE"
            variant="outlined"
            type="text"
            onChange={(e) => {
              handleChange(e);
            }}
            placeholder={"Leave Empty If Not Applicable"}
            helperText=" name of Option , ex-color,size etc..."
          />
          <TextField
            value={data.COLOR}
            disabled={!isUpdtble}
            name="COLOR"
            label="COLOR"
            variant="outlined"
            type="text"
            onChange={(e) => {
              handleChange(e);
            }}
            placeholder={"Leave Empty If Not Applicable"}
            helperText="seperate with (#)sign, ex-shoes_size : 8#9#10"
          />
          <TextField
            value={data.TAGS}
            disabled={!isUpdtble}
            onChange={(e) => {
              handleChange(e);
            }}
            name="TAGS"
            label="TAGS"
            variant="outlined"
            type="text"
            required
            helperText="That TAGS will help Customer to Find Your Product Easly,Use '#' ex-#one#two#three"
          />
          <TextField
            value={data.SHORT_DESCRIPTION}
            disabled={!isUpdtble}
            onChange={(e) => {
              handleChange(e);
            }}
            name="SHORT_DESCRIPTION"
            label="SHORT DESCRIPTION"
            multiline
            variant="outlined"
            type="text"
            required
            helperText="Short Product Specifications to Display on Product Card"
          />
          <TextField
            value={data.LONG_DESCRIPTION}
            disabled={!isUpdtble}
            onChange={(e) => {
              handleChange(e);
            }}
            name="LONG_DESCRIPTION"
            label="LONG DESCRIPTION"
            multiline
            fullWidth
            variant="outlined"
            type="text"
            required
            helperText="Write Point Wise ,Use '#' Sign to Seperate Points of Description"
          />
        </div>
      </form>
      {!isUpdtble ? (
        <>
          <Button
            variant="contained"
            size="large"
            color={"info"}
            onClick={() => {
              setIsUpdtble(true);
            }}
          >
            <Update /> &nbsp;update the details of product
          </Button>
        </>
      ) : (
        <>
          <Button
            variant="contained"
            size="large"
            color={"secondary"}
            onClick={handleSubmit}
          >
            <Save /> &nbsp; Save product details
          </Button>
        </>
      )}
      <br />
      <span>Note :- Fields with "*" Sign Is Required</span>
    </div>
  );
}

export default CgProductDetails;
