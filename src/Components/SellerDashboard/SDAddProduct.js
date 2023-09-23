import { ArrowForward, Celebration } from "@mui/icons-material";
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React from "react";
import axios from "axios";
import { Context } from "../../Context";
import { useNavigate } from "react-router-dom";

function SD_AddProduct() {
  const { Dispatch } = React.useContext(Context);
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  // const [data, setData] = React.useState({
  //   PRODUCT_NAME: undefined,
  //   BRAND_NAME: undefined,
  //   MRP: undefined,
  //   TAX_GST: undefined,
  //   DELIVERY_CHARGE: undefined,
  //   DISCOUNT: undefined,
  //   SELL_PRICE: 123,
  //   QUANTITY: undefined,
  //   IMAGES: undefined,
  //   MAIN_IMAGE: undefined,
  //   CATEGORY: "",
  //   TAGS: undefined,
  //   SHORT_DESCRIPTION: undefined,
  //   LONG_DESCRIPTION: undefined,
  //   SIZE: undefined,
  //   COLOR: undefined,
  // });

  // function handleChange(event) {
  //   const name = event.target.name;
  //   const value = event.target.value;

  //   setData((prev) => {
  //     return {
  //       ...prev,
  //       [name]:
  //         name === "IMAGES" || name === "MAIN_IMAGE"
  //           ? event.target.files
  //           : value,
  //     };
  //   });
  // }
  // console.log(data);

  async function handleSubmit(event) {
    // staring whole data of form into one Object to send to server
    let data = {};
    for (let i of event.target) {
      if (i.name === "") continue;
      data[i.name.toLowerCase()] =
        i.name === "IMAGES" || i.name === "MAIN_IMAGE" ? i.files : i.value;
    }

    //sending pdata to server
    const responce = await axios.post("/seller_dashboard/add_product", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log(responce);
    Dispatch({ type: "Changed", it: "MyProducts", to: true });
    if (!responce.data.error) setOpen(true);
  }

  return (
    <div className="sd-addproduct-main">
      <center>
        <span className="h2">
          To&nbsp;Add&nbsp;New&nbsp;Product&nbsp;On&nbsp;ECart,&nbsp;Tell&nbsp;Me&nbsp;About&nbsp;Your&nbsp;Product&nbsp;🫣&nbsp;🤔
        </span>
      </center>
      <hr width="95%" className="hr" />
      <form
        method="POST"
        id="product-form"
        encType="multipart/form-data"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(e);
        }}
      >
        <div className="sd-product-dtl">
          <TextField
            name="PRODUCT_NAME"
            label="PRODUCT NAME"
            variant="outlined"
            type="text"
            required
            helperText="Use Name in Max 20 Leters"
          />
          <TextField
            name="BRAND_NAME"
            label="BRAND NAME"
            variant="outlined"
            type="text"
            required
            helperText="Include The Name of Manufacturer"
          />
          <TextField
            name="MRP"
            label="MRP"
            variant="outlined"
            type="number"
            required
            helperText="MRP Without any Charge or Discount"
          />
          <TextField
            name="TAX_GST"
            label="TAX / GST"
            variant="outlined"
            type="number"
            required
            helperText="Include Tax in Percentage(%)"
          />
          <TextField
            name="DELIVERY_CHARGE"
            label="DELIVERY CHARGE"
            variant="outlined"
            type="number"
            defaultValue={0}
            required
            helperText="This Charge Should As Per One Product"
          />
          <TextField
            name="DISCOUNT"
            label="DISCOUNT"
            variant="outlined"
            type="number"
            defaultValue={0}
            helperText="In Percentage(%), Calculated On MRP"
          />
          {/* <TextField 
            name="SELL_PRICE"
            label="SELL PRICE"
            variant="outlined"
            type="number"
            defaultValue={10101}
            disabled
            helperText="Calculated Based On MRP,Discount and Tax"
          /> */}
          <TextField
            name="QUANTITY"
            label="QUANTITY"
            variant="outlined"
            type="number"
            required
            helperText="No of Quantity per color*size (Edit Later)"
          />
          <TextField
            inputProps={{ accept: "image/*" }}
            name="MAIN_IMAGE"
            label="THUMBNAIL IMAGE"
            variant="outlined"
            type="file"
            required
            helperText="this is thumbnail image"
          />
          <TextField
            inputProps={{ multiple: true, accept: ["image/*", "video/mp4"] }}
            name="IMAGES"
            label="IMAGES"
            variant="outlined"
            type="file"
            required
            helperText="Select Images Only"
          />
          {/* Categories */}
          <FormControl sx={{ minWidth: 250 }} required>
            <InputLabel>Category</InputLabel>
            <Select label="categories" name="CATEGORY">
              <MenuItem value={""}>None</MenuItem>
              <ListSubheader>WOMEN's</ListSubheader>
              <MenuItem value={"women_tops"}>
                <Chip
                  variant="outlined"
                  sx={{ mixBlendMode: "luminosity" }}
                  color="primary"
                  label="Tops"
                />
              </MenuItem>
              <MenuItem value={"women_kurtas"}>
                <Chip
                  variant="outlined"
                  sx={{ mixBlendMode: "luminosity" }}
                  color="primary"
                  label="Kurtas"
                />
              </MenuItem>
              <MenuItem value={"women_bottoms"}>
                <Chip
                  variant="outlined"
                  sx={{ mixBlendMode: "luminosity" }}
                  color="primary"
                  label="Bottoms"
                />
              </MenuItem>
              <MenuItem value={"women_foowear"}>
                <Chip
                  variant="outlined"
                  sx={{ mixBlendMode: "luminosity" }}
                  color="primary"
                  label="Foowear"
                />
              </MenuItem>
              <MenuItem value={"women_makeup"}>
                <Chip
                  variant="outlined"
                  sx={{ mixBlendMode: "luminosity" }}
                  color="primary"
                  label="Makeup"
                />
              </MenuItem>
              <MenuItem value={"women_purse"}>
                <Chip
                  variant="outlined"
                  sx={{ mixBlendMode: "luminosity" }}
                  color="primary"
                  label="Purse"
                />
              </MenuItem>
              <MenuItem value={"women_jwellary"}>
                <Chip
                  variant="outlined"
                  sx={{ mixBlendMode: "luminosity" }}
                  color="primary"
                  label="Jwellary"
                />
              </MenuItem>
              <MenuItem value={"women_skin_hair_cares"}>
                Skin/Hair Cares
              </MenuItem>
              <ListSubheader>MEN's</ListSubheader>
              <MenuItem value={"men_shirt_tshirt"}>
                <Chip
                  variant="outlined"
                  sx={{ mixBlendMode: "luminosity" }}
                  color="primary"
                  label="Shirt/T-Shirt"
                />
              </MenuItem>
              <MenuItem value={"men_jeans"}>
                <Chip
                  variant="outlined"
                  sx={{ mixBlendMode: "luminosity" }}
                  color="primary"
                  label="Jeans"
                />
              </MenuItem>
              <MenuItem value={"men_formals"}>
                <Chip
                  variant="outlined"
                  sx={{ mixBlendMode: "luminosity" }}
                  color="primary"
                  label="Formals"
                />
              </MenuItem>
              <MenuItem value={"men_kurtas"}>
                <Chip
                  variant="outlined"
                  sx={{ mixBlendMode: "luminosity" }}
                  color="primary"
                  label="Kurtas"
                />
              </MenuItem>
              <MenuItem value={"men_foowear"}>
                <Chip
                  variant="outlined"
                  sx={{ mixBlendMode: "luminosity" }}
                  color="primary"
                  label="Foowear"
                />
              </MenuItem>
              <MenuItem value={"men_skin_hair_cares"}>
                /Hair Cares
                <Chip
                  variant="outlined"
                  sx={{ mixBlendMode: "luminosity" }}
                  color="primary"
                  label="Skin"
                />
              </MenuItem>
              <MenuItem value={"men_accesory"}>
                <Chip
                  variant="outlined"
                  sx={{ mixBlendMode: "luminosity" }}
                  color="primary"
                  label="Accesory"
                />
              </MenuItem>
              <ListSubheader>KID's</ListSubheader>
              <MenuItem value={"kids_shirt_tshirt"}>
                <Chip
                  variant="outlined"
                  sx={{ mixBlendMode: "luminosity" }}
                  color="primary"
                  label="Shirt/T-Shirt"
                />
              </MenuItem>
              <MenuItem value={"kids_bottoms"}>
                <Chip
                  variant="outlined"
                  sx={{ mixBlendMode: "luminosity" }}
                  color="primary"
                  label="Bottoms"
                />
              </MenuItem>
              <MenuItem value={"kids_foowear"}>
                <Chip
                  variant="outlined"
                  sx={{ mixBlendMode: "luminosity" }}
                  color="primary"
                  label="Foowear"
                />
              </MenuItem>
              <MenuItem value={"kids_accesory"}>
                <Chip
                  variant="outlined"
                  sx={{ mixBlendMode: "luminosity" }}
                  color="primary"
                  label="Accesory"
                />
              </MenuItem>
              <MenuItem value={"kids_toys"}>
                <Chip
                  variant="outlined"
                  sx={{ mixBlendMode: "luminosity" }}
                  color="primary"
                  label="Toys"
                />
              </MenuItem>
              <ListSubheader>ELECTRONICS</ListSubheader>
              <MenuItem value={"gadgets"}>
                <Chip
                  variant="outlined"
                  sx={{ mixBlendMode: "luminosity" }}
                  color="primary"
                  label="Gadgets"
                />
              </MenuItem>
              <MenuItem value={"tvs"}>TVs</MenuItem>
              <MenuItem value={"ac_cooler_fans"}>
                <Chip
                  variant="outlined"
                  sx={{ mixBlendMode: "luminosity" }}
                  color="primary"
                  label="Ac/Cooler/Fans"
                />
              </MenuItem>
              <MenuItem value={"mobile"}>
                <Chip
                  variant="outlined"
                  sx={{ mixBlendMode: "luminosity" }}
                  color="primary"
                  label="Mobile"
                />
              </MenuItem>
              <MenuItem value={"tablet"}>
                <Chip
                  variant="outlined"
                  sx={{ mixBlendMode: "luminosity" }}
                  color="primary"
                  label="Tablet"
                />
              </MenuItem>
              <MenuItem value={"laptop"}>
                <Chip
                  variant="outlined"
                  sx={{ mixBlendMode: "luminosity" }}
                  color="primary"
                  label="Laptop"
                />
              </MenuItem>
              <MenuItem value={"cpus"}>
                <Chip
                  variant="outlined"
                  sx={{ mixBlendMode: "luminosity" }}
                  color="primary"
                  label="CPUs"
                />
              </MenuItem>
              <MenuItem value={"monitor"}>
                <Chip
                  variant="outlined"
                  sx={{ mixBlendMode: "luminosity" }}
                  color="primary"
                  label="Monitor"
                />
              </MenuItem>
              <MenuItem value={"electronics_accesory"}>
                Electronics Accesory
              </MenuItem>
              <ListSubheader>FOODS</ListSubheader>
              <MenuItem value={"grossary"}>
                <Chip
                  variant="outlined"
                  sx={{ mixBlendMode: "luminosity" }}
                  color="primary"
                  label="Grossary"
                />
              </MenuItem>
              <MenuItem value={"spices"}>
                <Chip
                  variant="outlined"
                  sx={{ mixBlendMode: "luminosity" }}
                  color="primary"
                  label="Spices"
                />
              </MenuItem>
              <MenuItem value={"snacks"}>
                <Chip
                  variant="outlined"
                  sx={{ mixBlendMode: "luminosity" }}
                  color="primary"
                  label="Snacks"
                />
              </MenuItem>
              <MenuItem value={"icecream"}>
                <Chip
                  variant="outlined"
                  sx={{ mixBlendMode: "luminosity" }}
                  color="primary"
                  label="Ice-Cream"
                />
              </MenuItem>
              <MenuItem value={"chocolates"}>
                <Chip
                  variant="outlined"
                  sx={{ mixBlendMode: "luminosity" }}
                  color="primary"
                  label="Chocolates"
                />
              </MenuItem>
              <ListSubheader>HOME ACCESORY</ListSubheader>
              <MenuItem value={"kitchen"}>
                <Chip
                  variant="outlined"
                  sx={{ mixBlendMode: "luminosity" }}
                  color="primary"
                  label="Kitchen"
                />
              </MenuItem>
              <MenuItem value={"furniture"}>
                <Chip
                  variant="outlined"
                  sx={{ mixBlendMode: "luminosity" }}
                  color="primary"
                  label="Furniture"
                />
              </MenuItem>
              <MenuItem value={"freash_clean"}>
                <Chip
                  variant="outlined"
                  sx={{ mixBlendMode: "luminosity" }}
                  color="primary"
                  label="Freash & Clean"
                />
              </MenuItem>
              <MenuItem value={"tools"}>
                <Chip
                  variant="outlined"
                  sx={{ mixBlendMode: "luminosity" }}
                  color="primary"
                  label="Tolls"
                />
              </MenuItem>
            </Select>
          </FormControl>
          <TextField
            name="COLOR"
            label="COLOR"
            variant="outlined"
            defaultValue={"N/A"}
            type="text"
            placeholder={"put N/A If Not Applicable"}
            helperText="seperate with (#)sign, ex-shoes_size : red#green#blue"
          />
          <TextField
            name="SIZE"
            label="SIZE"
            variant="outlined"
            defaultValue={"N/A"}
            type="text"
            placeholder={"put N/A If Not Applicable"}
            helperText="seperate with (#)sign, ex-size1#size9"
          />
          <TextField
            name="TAGS"
            label="TAGS"
            variant="outlined"
            type="text"
            required
            helperText="tag'll use to search Product,Use (#)sign ex-tag1#tag2#tag3"
          />
          <TextField
            name="SHORT_DESCRIPTION"
            label="SHORT DESCRIPTION"
            multiline
            variant="outlined"
            type="text"
            required 
            helperText="Short Product Specifications to Display on Product Card"
          />
          <TextField
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
        <center>
          <Button
            type="submit"
            color="info"
            variant="contained"
            size="large"
            sx={{ margin: "20px auto 10px" }}
          >
            Add this product to your e-cart store
            <ArrowForward />
          </Button>
        </center>
      </form>
      <span>Note :- Fields with "*" Sign Is Required</span>
      <Dialog open={open}>
        <DialogTitle>
          <Celebration />
          Product Has Published Succesfuly
        </DialogTitle>
        <DialogContent>
          Set Quantity Of These Products , it is Set 0 by Default
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={() => {
              navigate("/seller_dashboard/my_product");
            }}
            onChange={() => {
              setOpen(true);
            }}
          >
            set quantity
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default SD_AddProduct;
