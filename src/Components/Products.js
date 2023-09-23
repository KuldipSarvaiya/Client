import { Box, Skeleton, Paper } from "@mui/material";
import React, { useState } from "react";
import { nanoid } from "nanoid";
import ProductCard from "./ProductCard";
import { useSearchParams } from "react-router-dom";
// import { Context } from "../Context";
import Footer from "./Footer";
import axios from "axios";

function Products() {
  // const { Data } = React.useContext(Context);
  const [items, setItems] = useState(undefined);
  const [qry] = useSearchParams();
  // console.log(qry.get('category'))
  // console.log(qry.getAll('tag'))

  React.useEffect(() => {
    (async function () {
      const name = qry.get("category")
        ? "category"
        : qry.get("tag")
        ? "tag"
        : undefined;
      const val = qry.get("category")
        ? qry.get("category")
        : qry.get("tag")
        ? qry.getAll("tag")
        : undefined;
      const res = await axios.post(
        `/products${name ? "?" + name + "=" + val : ""}`
      );
      console.log("Got Products for Products", res.data);
      setItems(res.data);
    })();
  }, [qry]);

  function Skeletan() {
    const arr = [];
    for (let i = 0; i < 20; i++) {
      arr.push(
        <Paper key={nanoid()}>
          <Box
            width={{
              xs: "167px",
              sm: "250px",
              md: "180px",
              lg: "250px",
              xl: "230px",
            }}
          >
            <div className="pdiv-main">
              <Skeleton
                animation="pulse"
                variant="rectangular"
                height={150}
                width={"100%"}
              />
              <Skeleton
                animation="pulse"
                variant="text"
                height={50}
                width={"90%"}
              />
              <Skeleton
                animation="pulse"
                variant="text"
                height={50}
                width={"50%"}
              />
              <Skeleton
                animation="pulse"
                variant="text"
                height={50}
                width={"70%"}
              />
            </div>
          </Box>
        </Paper>
      );
    }
    return arr;
    // <div className='pdiv-main'>
    //   <div className='pdiv-img'>hello world</div>
    //   <p className='pp-name'>kuldip</p>
    //   <p className='pp-price'>43223</p>
    //   <p className='pp-ratting'>* * * * *</p>
    // </div>
  }

  return (
    <>
      <div className="products">
        {items === undefined ? (
          <Skeletan />
        ) : (
          <>
            {items.empty && (
              <center style={{ width: "100%" }}>
                <p>Actual Match Of Searched Keywords Does Not Found....</p>
              </center>
            )}
            {items.Products.map((item) => {
              return (
                <ProductCard
                  key={nanoid()}
                  _id={item._id}
                  img={item.thumbnail_url}
                  title={item.name}
                  subtitle={item.short_description}
                  ratings={item.ratings}
                  button_needed={true}
                  mrp={item.mrp}
                  discount={item.discount}
                  small={false}
                  color={item.color}
                  size={item.size}
                />
              );
            })}
          </>
        )}
      </div>

      {/* footer */}
      <Footer />
    </>
  );
}

export default Products; 