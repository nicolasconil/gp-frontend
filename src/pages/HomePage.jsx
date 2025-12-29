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
          height: isMobile ? "60vh" : "100vh",
          overflow: "hidden",
          px: 0,
          mx: 0,
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
              display: "block",
            }}
          >
            <source src="/video.mp4" type="video/mp4" />
            Tu navegador no soporta la etiqueta de video.
          </video>
        )}

        {isMobile && (
          <img
            src="/celu.jpg"
            alt="GP Footwear"
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              width: "100vw",
              height: "100%",
              objectFit: "cover",
              transform: "translateX(-50%)",
              display: "block",
            }}
          />
        )}
      </Box>

      <Box sx={{ mt: isMobile ? 1 : 6 }}>
        <ProductPage />
      </Box>
    </>
  );
};

export default HomePage;
