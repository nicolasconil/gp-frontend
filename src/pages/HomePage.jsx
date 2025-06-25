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
        height: "100vh",
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
        <img
          src="/gp.svg"
          alt="GP Footwear"
          style={{
            position: "absolute",
            top: '25%',
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
            transform: 'translateY(-50%)'
          }}
        />
      )}
    </Box>
    <ProductPage />
    </>
  );
};

export default HomePage;