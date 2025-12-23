import React from "react";
import {
  Grid,
  Box,
  Typography,
  useMediaQuery,
  Button,
  CircularProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Feed from "../components/Feed.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "../api/public.api.js";

const AllProductsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);

  const category = searchParams.get("category");
  const gender = searchParams.get("gender");
  const size = searchParams.get("size");
  const available = searchParams.get("available");
  const page = Number(searchParams.get("page") || 1);
  const perPage = Number(searchParams.get("perPage") || 24);

  const {
    data: products = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["public-products", category, gender, size, available, page, perPage],
    queryFn: () =>
      getAllProducts({
        category,
        gender,
        size,
        available,
        page,
        perPage,
      }),
    select: (res) => res.data,
    keepPreviousData: true,
  });

  const buildTitle = () => {
    if (category && gender) {
      return `${category.charAt(0).toUpperCase() + category.slice(1)} · ${gender}`;
    }
    if (category) {
      return category.charAt(0).toUpperCase() + category.slice(1);
    }
    return "PRODUCTS"; // keep uppercase like SHOP
  };

  const title = buildTitle();

  if (isLoading) {
    return (
      <Box
        sx={{
          height: "60vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <CircularProgress />
        <Typography sx={{ mt: 2, fontFamily: '"Archivo Black", sans-serif', letterSpacing: '-0.1rem' }}>
          Cargando productos...
        </Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box
        sx={{
          height: "60vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Typography sx={{ fontFamily: '"Archivo Black", sans-serif', letterSpacing: '-0.1rem' }}>
          Error cargando los productos.
        </Typography>
        <Button
          variant="contained"
          sx={{ mt: 2, backgroundColor: "black" }}
          onClick={() => refetch()}
        >
          Reintentar
        </Button>
      </Box>
    );
  }

  return (
    <Box component="main" sx={{ px: { xs: 2, md: 4 }, py: 4 }}>
      <Box sx={{ maxWidth: 1280, mx: "auto" }}>
        {/* Title area styled similarly to ProductPage SHOP */}
        <Box sx={{ textAlign: "center", mt: { xs: 2, md: 6 }, mb: 6 }}>
          <Box
            sx={{
              display: "inline-block",
              px: { xs: 3, md: 4 },
              py: { xs: 1, md: 2 },
              position: "relative",
              mb: 2,
              borderRadius: "5px",
              alignItems: "center",
            }}
          >
            <Typography
              component="h1"
              sx={{
                fontFamily: '"Archivo Black", sans-serif',
                fontSize: { xs: "5rem", sm: "7rem", md: "9rem" },
                letterSpacing: { xs: "-11.5px", sm: "-12px", md: "-19.5px" },
                fontWeight: 900,
                textTransform: "uppercase",
                lineHeight: 1,
                zIndex: 2,
                position: "relative",
                mt: { xs: 1, md: 4 },
                mb: { xs: 1, md: 4 },
                cursor: "pointer",
                whiteSpace: "nowrap",
                // subtle hover only on non-touch devices
                '&:hover': {
                  transform: isMobile ? undefined : "scale(1.05)",
                  transition: "transform 0.25s ease",
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -6,
                  left: 0,
                  width: '100%',
                  height: '4px',
                  backgroundColor: 'black',
                },
              }}
            >
              {title}
            </Typography>
          </Box>
        </Box>

        <Grid
          container
          spacing={3}
          sx={{ px: { xs: 2, sm: 4 }, justifyContent: "center" }}
        >
          {products.length === 0 ? (
            <Box sx={{ width: "100%", textAlign: "center", py: 8 }}>
              <Typography
                sx={{
                  fontFamily: '"Archivo Black", sans-serif',
                  fontSize: "1.5rem",
                }}
              >
                No se encontraron productos con esos filtros.
              </Typography>
            </Box>
          ) : (
            products.map((product) => (
              <Grid key={product._id} item xs={12} sm={6} md={3}>
                <Feed
                  products={[product]}
                  onClick={() =>
                    navigate(`/producto/${product._id}`, {
                      state: { product },
                    })
                  }
                />
              </Grid>
            ))
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default AllProductsPage;
