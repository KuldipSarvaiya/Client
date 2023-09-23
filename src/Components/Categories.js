import React from "react";
import { nanoid } from "nanoid";
import { Paper, Skeleton } from "@mui/material";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import axios from "axios";
import { Context } from "../Context";

function Categories() {
  const [url, setUrl] = React.useState(false);
  const { Data, Dispatch } = React.useContext(Context);
  React.useEffect(() => {
    if (!Data.CategoryImages)
      (async function () {
        const res = await axios.get(`/categories`);
        console.log(res);
        setUrl(res.data.urls);
        Dispatch({ type: "set_category_images", images: res.data.urls });
      })();
    else setUrl(Data.CategoryImages);
  }, [Data.CategoryImages, Dispatch]);

  const CategoryArray = [
    {
      name: "Fashion And Clothings..",
      categories: [
        {
          img: "hr",
          name: "Women's",
        },
        {
          img: url.women_tops,
          name: "Tops",
          query: "women_tops",
        },
        {
          img: url.women_kurtas,
          name: "Kurtas",
          query: "women_kurtas",
        },
        {
          img: url.women_bottom,
          name: "Bottom",
          query: "women_bottom",
        },
        {
          img: url.women_footwear,
          name: "FootWear",
          query: "women_footwear",
        },
        {
          img: url.women_purse,
          name: "Purse",
          query: "women_purse",
        },
        {
          img: url.women_makeup,
          name: "MakeUp",
          query: "women_makeup",
        },
        {
          img: url.women_jewellery,
          name: "Jewellery",
          query: "women_jewellery",
        },
        {
          img: url.women_skin_hair_care,
          name: "Skin-Hair Care",
          query: "women_skin_hair_care",
        },
        {
          img: "hr",
          name: "Men's",
        },
        {
          img: url.men_shirt_tshirt,
          name: "Shirt/T-Shirt",
          query: "men_shirt_tshirt",
        },
        {
          img: url.men_jeans,
          name: "Jeans",
          query: "men_jeans",
        },
        {
          img: url.men_formals,
          name: "Formals",
          query: "men_formals",
        },
        {
          img: url.men_kurtas,
          name: "Kurtas",
          query: "men_kurtals",
        },
        {
          img: url.men_footwear,
          name: "FootWear",
          query: "men_footwear",
        },
        {
          img: url.men_skin_hair_care,
          name: "Skin-Hair Care",
          query: "men_skin_hair_care",
        },
        {
          img: url.men_accessories,
          name: "Accessory",
          query: "men_accessories",
        },
        {
          img: "hr",
          name: "Kids's",
        },
        {
          img: url.kid_tops_tshirt,
          name: "Tops/T-Shirt",
          query: "kid_tops_tshirt",
        },
        {
          img: url.kid_bottoms,
          name: "Bottoms",
          query: "kid_bottoms",
        },
        {
          img: url.kid_footwear,
          name: "FootWear",
          query: "kid_footwear",
        },
        {
          img: url.kid_accessories,
          name: "Accesory",
          query: "kid_accesory",
        },
        {
          img: url.kid_toys,
          name: "Toys",
          query: "kid_toys",
        },
      ],
    },
    {
      name: "Electronics..",
      categories: [
        {
          img: url.gadgets,
          name: "Gadgets",
          query: "gadgets",
        },
        {
          img: url.tvs,
          name: "Tvs",
          query: "tvs",
        },
        {
          img: url.ac_cooler_fan,
          name: "Ac/Cooler/Fans",
          query: "ac_cooler_fan",
        },
        {
          img: url.mobile,
          name: "Mobiles",
          query: "mobile",
        },
        {
          img: url.tablet,
          name: "Tablets",
          query: "tablet",
        },
        {
          img: url.laptop,
          name: "Laptops",
          query: "laptop",
        },
        {
          img: url.cpu,
          name: "CPUs",
          query: "cpus",
        },
        {
          img: url.monitor,
          name: "Monitors",
          query: "monitor",
        },
        {
          img: url.electronic_accessories,
          name: "Electronics Accesory",
          query: "electronic_accessories",
        },
      ],
    },
    {
      name: "Foods..",
      categories: [
        {
          img: url.grossary,
          name: "Grossary",
          query: "grossary",
        },
        {
          img: url.spices,
          name: "Spices",
          query: "spices",
        },
        {
          img: url.snacks,
          name: "Snacks",
          query: "snacks",
        },
        {
          img: url.icecream,
          name: "Ice-Cream",
          query: "icecream",
        },
        {
          img: url.chocolate,
          name: "Chocolates",
          query: "chocolate",
        },
      ],
    },
    {
      name: "Home Accesory..",
      categories: [
        {
          img: url.kitchen,
          name: "Kitchen",
          query: "kitchen",
        },
        {
          img: url.furniture,
          name: "Furniture",
          query: "furniture",
        },
        {
          img: url.fresh_clean,
          name: "Fresh & Clean",
          query: "fresh_clean",
        },
        {
          img: url.tools,
          name: "Tools",
          query: "tools",
        },
      ],
    },
  ];

  function Skeletan() {
    const MaxWidth = {
      xs: "147px",
      sm: "150px",
      md: "160px",
      lg: "230px",
      xl: "250px",
    };

    return (
      <Skeleton
        animation="pulse"
        variant="circular"
        height={window.innerWidth / 5.5}
        width={window.innerWidth / 5.5}
        sx={{ maxWidth: MaxWidth, maxHeight: MaxWidth }}
      />
    );
  }

  function AllCategories() {
    function Org({ item0 }) {
      return (
        <>
          <p className="h2">{item0.name}</p>
          {item0.categories.map((item1) => {
            if (item1.img === "hr") {
              return (
                <React.Fragment key={nanoid()}>
                  <p className="h5" style={{ width: "100%" }}>
                    {item1.name}
                  </p>
                  <hr width="90%" />
                </React.Fragment>
              );
            } else {
              return (
                <div className="categories-wrapper-div" key={nanoid()}>
                  <Link to={`/products?category=${item1.query}`}>
                    {item1.img && navigator.onLine ? (
                      <img
                        src={item1.img}
                        alt={item1.name}
                        className="categories-image"
                        width={window.innerWidth / 6}
                        height={window.innerWidth / 6}
                      />
                    ) : (
                      <Skeletan />
                    )}
                  </Link>
                  <div
                    width={window.innerWidth / 6}
                    className="categories-name"
                  >
                    {item1.name}
                  </div>
                </div>
              );
            }
          })}
        </>
      );
    }

    return (
      <>
        {CategoryArray.map((item2) => {
          return (
            <React.Fragment key={nanoid()}>
              <Paper
                elevation={5}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "space-evenly",
                  gap: "20px",
                  padding: "10px",
                  marginBottom: "10px",
                }}
              >
                <Org item0={item2} />
                {/* {url ? <Org item0={item2} : <Skeletan />} */}
              </Paper>
            </React.Fragment>
          );
        })}
      </>
    );
  }

  return (
    <>
      <Paper elevation={10}>
        <center>
          <h1>SELECT CATEGORIES</h1>
        </center>
      </Paper>

      <AllCategories />

      {/* footer */}
      <Footer />
    </>
  );
}

export default Categories;
