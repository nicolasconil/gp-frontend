import React, { useRef, useEffect } from "react";
import { Box, useMediaQuery } from "@mui/material";
import ProductPage from "./ProductPage.jsx";

const HomePage = () => {
  const isMobile = useMediaQuery("(max-width: 900px)");
  const mobileVideoRef = useRef(null);

  useEffect(() => {
    const v = mobileVideoRef.current;
    if (!v) return;
    const handleEnded = () => {
      try {
        v.currentTime = 0.05;
        const p = v.play();
        if (p && p.catch) p.catch(() => {});
      } catch (e) {}
    };
    v.addEventListener("ended", handleEnded);
    return () => v.removeEventListener("ended", handleEnded);
  }, [isMobile]);

  return (
    <>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          minHeight: "100dvh",
          overflow: "hidden",
        }}
      >
        {!isMobile && (
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
            Tu navegador no soporta la etiqueta de video.
          </video>
        )}

        {isMobile && (
          <>
            <Box
              sx={{
                position: "relative",
                width: "100%",
                maxWidth: 520, 
                margin: "12px auto",
                zIndex: 1,
              }}
            >
              <Box
                sx={{
                  border: "2.5px solid black",
                  borderRadius: 1.5,
                  overflow: "hidden",
                  boxSizing: "border-box",
                }}
              >
                <video
                  ref={mobileVideoRef}
                  autoPlay
                  muted
                  loop={false}
                  playsInline
                  preload="auto"
                  style={{
                    width: "100%",
                    height: "auto",
                    maxHeight: "70vh",
                    objectFit: "contain",
                    display: "block",
                  }}
                >
                  <source src="/IMG_5013.mp4" type="video/mp4" />
                  Tu navegador no soporta la etiqueta de video.
                </video>
              </Box>
            </Box>
          </>
        )}
      </Box>

      <ProductPage />
    </>
  );
};

export default HomePage;
