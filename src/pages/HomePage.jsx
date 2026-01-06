import { Box, useMediaQuery } from "@mui/material";
import ProductPage from "./ProductPage.jsx";

const HomePage = () => {
  const isMobile = useMediaQuery("(max-width: 900px)");
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
          <video
            autoPlay
            muted
            loop
            playsInline
            style={{
              width: "100%",
              maxHeight: "100dvh",
              objectFit: "contain",
            }}
          >
            <source src="/IMG_5013.mp4" type="video/mp4" />
          </video>
        )}
      </Box>
      <ProductPage />
    </>
  );
};

export default HomePage;