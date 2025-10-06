import { Box, Grid, Typography, Button } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "../api/public.api.js";
import Feed from "../components/Feed.jsx";
import { useNavigate } from "react-router-dom";

const AllProductsPage = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["allProducts"],
    queryFn: getAllProducts,
  });

  const products = data?.data || [];
  const navigate = useNavigate();

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
    // centered container with maxWidth for a cleaner layout
    <Box component="main" sx={{ px: { xs: 2, md: 4 }, py: 4 }}>
      <Box sx={{ maxWidth: 1280, mx: "auto" }}>
        <Box
          sx={{
            display: "flex",
            px: 4,
            py: 2,
            position: "relative",
            mb: 6,
            borderRadius: "5px",
            alignItems: "center",
            justifyContent: "center",
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
              mt: { xs: 3, md: 5 },
              mb: { xs: 3, md: 5 },
              cursor: "pointer",
              "&:hover": {
                transform: "scale(1.03)",
                transition: "transform 0.25s ease",
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

        {/* Grid container: centered, responsive spacing */}
        <Grid
          container
          spacing={{ xs: 2, sm: 3, md: 4 }}
          justifyContent="center"
          alignItems="stretch"
        >
          {products.map((product) => (
            // IMPORTANT: use Grid item
            <Grid item key={product._id} xs={12} sm={6} md={3}>
              {/* small padding inside each grid cell to space cards visually */}
              <Box
                sx={{
                  px: { xs: 0.5, sm: 1 },
                  py: { xs: 1, sm: 1.5 },
                  height: "100%",
                  display: "flex",
                  alignItems: "stretch",
                }}
              >
                {/* Make Feed occupy full height so cards align evenly */}
                <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
                  <Feed
                    products={[product]}
                    onClick={() => navigate(`/producto/${product._id}`, { state: { product } })}
                  />
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default AllProductsPage;
