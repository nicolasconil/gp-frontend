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
                  borderRadius: 3,
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
              <Box
                sx={{
                  position: "absolute",
                  bottom: -10, 
                  left: 8,
                  transform: "translateX(-50%)",
                  width: "60%", 
                  height: "6px",
                  backgroundColor: "black",
                  borderRadius: "4px",
                  zIndex: 20,
                  pointerEvents: "none",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8, 
                  width: "6px",
                  height: "calc(100% - 16px)", 
                  backgroundColor: "black",
                  borderRadius: "2px",
                  zIndex: 20,
                  pointerEvents: "none",
                }}
              />
            </Box>
          </>
        )}
      </Box>

      <ProductPage />
    </>
  );
};

export default HomePage;
