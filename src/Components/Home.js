import React from "react";
import axios from "axios";
import { Carousel as CardCarousel } from "react-responsive-carousel";
import Carousel from "react-multi-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "react-multi-carousel/lib/styles.css";
import { useNavigate } from "react-router-dom";
import { Box, Paper } from "@mui/material";
import { Context } from "../Context";
// import { Outlet } from "react-router-dom";
import ProductCard from "./ProductCard";
import { nanoid } from "nanoid";
import Footer from "./Footer";

function Home() {
  const navigate = useNavigate();
  const { Data, Dispatch } = React.useContext(Context);
  const [products, setProducts] = React.useState(undefined);
  React.useEffect(() => {
    (async function () {
      if (Data.Changed.Home) {
        const res = await axios.get(`/`);
        if (res.data.error) {
          alert(`Error From Landing Page = ${res.data.message}`);
        } else {
          console.log(res);
          Dispatch({ type: "set_home", home: res.data.products });
          setProducts(res.data.products);
        }
      } else setProducts(Data.Home);
    })();
  }, []);

  function TopLine() {
    return (
      <center>
        <div className="home_top_patti home_font">
          <spna className="home_top_patti_title">
            EXPLORE<div></div>
          </spna>
          <span
            className="home_top_patti_item"
            onClick={() => {
              navigate("/products?category=kid");
            }}
          >
            KID
          </span>
          <span
            className="home_top_patti_item"
            onClick={() => {
              navigate("/products?category=women");
            }}
          >
            WOMEN
          </span>
          <span
            className="home_top_patti_item"
            onClick={() => {
              navigate("/products?category=men");
            }}
          >
            MEN
          </span>
        </div>
      </center>
    );
  }

  function ImageCarousel() {
    return (
      <center>
        <CardCarousel
          className="home_image_carousel"
          showThumbs={false}
          showStatus={false}
          autoPlay
          infiniteLoop
          dynamicHeight
          ariaLabel="offer images"
          interval={5000}
          stopOnHover
          width={"90%"}
        >
          <span>
            <img
              src="footer1.jpg"
              alt=""
              style={{ maxHeight: window.innerHeight - 300 }}
            />
          </span>
          <span>
            <img
              src="footer2.jpg"
              alt=""
              style={{ maxHeight: window.innerHeight - 300 }}
            />
          </span>
          <span>
            <img
              src="footer3.jpg"
              alt=""
              style={{ maxHeight: window.innerHeight - 300 }}
            />
          </span>
        </CardCarousel>
      </center>
    );
  }

  function DisplayProduct({ title }) {
    const title_lable = {
      interested: "You Might Interested 🫣",
      sale: "SALE SALE SALE 🥳🤑",
      new: "New On E-Cart 🤩",
    };

    const responsive = {
      superLargeDesktop: {
        breakpoint: { max: 4000, min: 3000 },
        items: 6,
        slidesToSlide: 4,
      },
      desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 4,
        slidesToSlide: 3,
      },
      tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 3,
        slidesToSlide: 2,
      },
      mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 2,
        slidesToSlide: 2,
      },
    };

    return (
      <center>
        <Paper style={{ width: "90%" }}>
          <p></p>
          <p className="home_font paper-title-left h2">{title_lable[title]}</p>
          <Box style={{ padding: "5px 0px 10px 0px" }}>
            {products !== undefined && (
              <Carousel responsive={responsive} keyBoardControl={true}>
                {products[title].map((item) => {
                  return (
                    <ProductCard
                      key={nanoid()}
                      _id={item._id}
                      img={item.thumbnail}
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
              </Carousel>
            )}
          </Box>
        </Paper>
      </center>
    );
  }

  return (
    <>
      <TopLine />
      <ImageCarousel />
      <DisplayProduct title="new" />
      <DisplayProduct title="sale" />
      {/* <DisplayProduct title="interested" /> */}
      {/* <Outlet /> */}
      <Footer />
    </>
  );
}

export default Home;
