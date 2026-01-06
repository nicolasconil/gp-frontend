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
            <video
              ref={mobileVideoRef}
              autoPlay
              muted
              loop={false}
              playsInline
              preload="auto"
              style={{
                width: "100%",
                maxHeight: "100dvh",
                objectFit: "contain",
                boxSizing: "border-box",
                border: "3px solid black", 
                borderRadius: 1,
                zIndex: 1,
                display: "block",
                margin: "0 auto",
              }}
            >
              <source src="/IMG_5013.mp4" type="video/mp4" />
              Tu navegador no soporta la etiqueta de video.
            </video>
            <Box
              sx={{
                position: "absolute",
                bottom: 6,           
                left: 12,            
                width: "calc(100% - 24px)", 
                height: "6px",       
                backgroundColor: "black",
                borderRadius: "4px",
                zIndex: 10,
                pointerEvents: "none",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                top: 12,                       
                right: 6,                      
                width: "6px",                  
                height: "calc(100% - 24px)",   
                backgroundColor: "black",
                borderRadius: "2px",
                zIndex: 10,
                pointerEvents: "none",
              }}
            />
          </>
        )}
      </Box>
      <ProductPage />
    </>
  );
};

export default HomePage;
