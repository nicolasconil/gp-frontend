import React, { useEffect, useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import ProductPage from "./ProductPage.jsx";

const HomePage = () => {
  const isMobile = useMediaQuery("(max-width: 900px)");
  const [headerHeight, setHeaderHeight] = useState(120); // fallback

  useEffect(() => {
    const getHeaderHeight = () => {
      const header = document.querySelector("header"); 
      if (header) return header.offsetHeight;
      return 120; 
    };

    setHeaderHeight(getHeaderHeight());

    let ro;
    const headerEl = document.querySelector("header");
    if (headerEl && typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => setHeaderHeight(getHeaderHeight()));
      ro.observe(headerEl);
    }

    const onResize = () => setHeaderHeight(getHeaderHeight());
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      if (ro) ro.disconnect();
    };
  }, []);

  const heroHeight = isMobile ? "100vh" : `calc(100vh - ${headerHeight}px - 8px)`;

  return (
    <>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: heroHeight,
          overflow: "hidden",
        }}
      >
        {!isMobile ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          >
            <source src="/video.mp4" type="video/mp4" />
          </video>
        ) : (
          <video
            autoPlay
            muted
            loop
            playsInline
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          >
            <source src="/IMG_5013.mp4" type="video/mp4" />
          </video>
        )}
      </Box>

      <Box sx={{ position: "relative", zIndex: 1 }}>
        <ProductPage />
      </Box>
    </>
  );
};

export default HomePage;
