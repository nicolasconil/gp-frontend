import { Grid, Box, Typography, useMediaQuery, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Feed from "../components/Feed.jsx";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "../api/public.api.js";

const AllProductsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["allProducts"],
    queryFn: getAllProducts,
  });

  const products = data?.data || [];

  if (isLoading) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "transparent",
          flexDirection: "column",
        }}
      >
        <Box
          component="img"
          src="/logo1.svg"
          alt="Cargando..."
          sx={{
            width: 120,
            height: "auto",
            opacity: 0.5,
            animation: "pulseOpacity 2s infinite ease-in-out",
          }}
        />
        <Typography
          variant="h5"
          sx={{ mt: 2, fontFamily: '"Archivo Black", sans-serif', letterSpacing: "-0.1rem" }}
        >
          Cargando productos...
        </Typography>
        <style>
          {`
            @keyframes pulseOpacity {
              0% { opacity: 0.2; }
              50% { opacity: 1; }
              100% { opacity: 0.2; }
            }
          `}
        </style>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "transparent",
          flexDirection: "column",
          textAlign: "center",
        }}
      >
        <Box
          component="img"
          src="/logo1.svg"
          alt="Error"
          sx={{
            width: 120,
            height: "auto",
            opacity: 0.3,
          }}
        />
        <Typography
          variant="h6"
          sx={{ mt: 2, fontFamily: '"Archivo Black", sans-serif', letterSpacing: "-0.1rem" }}
        >
          Error cargando los productos.
        </Typography>
        <Button
          variant="contained"
          onClick={() => window.location.reload()}
          sx={{
            mt: 2,
            fontFamily: '"Archivo Black", sans-serif',
            border: "3px solid black",
            borderRadius: "4px",
            backgroundColor: "black",
            color: "white",
          }}
        >
          Reintentar
        </Button>
      </Box>
    );
  }

  return (
    // centered container with maxWidth for a cleaner layout (matches ProductPage)
    <Box component="main" sx={{ px: { xs: 2, md: 4 }, py: 4 }}>
      <Box sx={{ maxWidth: 1280, mx: "auto" }}>
        <Box
          sx={{
            display: "inline-block",
            px: 4,
            py: 2,
            position: "relative",
            mb: 6,
            borderRadius: "5px",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontFamily: '"Archivo Black", sans-serif',
              fontSize: { xs: "5rem", sm: "7rem", md: "9rem" },
              letterSpacing: { xs: "-11.5px", sm: "-12px", md: "-19.5px" },
              fontWeight: 900,
              textTransform: "uppercase",
              lineHeight: 1,
              zIndex: 2,
              position: "relative",
              mt: { xs: 5, md: 10 },
              mb: { xs: 5, md: 10 },
              cursor: "pointer",
              "&:hover": {
                transform: "scale(1.1)",
                transition: "transform 0.3s ease",
              },
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: -5,
                left: 0,
                width: "100%",
                height: "3px",
                backgroundColor: "black",
              },
            }}
          >
            TODOS
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ px: { xs: 2, sm: 4 }, margin: "0 auto", justifyContent: { xs: "center" } }}>
          {products.map((product) => (
            <Grid key={product._id} item xs={12} sm={6} md={3}>
              <Feed
                products={[product]}
                onClick={() => navigate(`/producto/${product._id}`, { state: { product } })}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default AllProductsPage;
