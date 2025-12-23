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
import { motion } from "framer-motion";
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
    return "Productos";
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
        <Typography sx={{ mt: 2, fontFamily: '"Archivo Black", sans-serif' }}>
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
        <Typography sx={{ fontFamily: '"Archivo Black", sans-serif' }}>
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
        {/* Title wrapper: inline-block so underline and clipping match text width */}
        <Box
          sx={{
            display: "inline-block",
            px: { xs: 3, md: 4 },
            py: { xs: 1, md: 2 },
            mb: 6,
            // subtle backdrop for legibility on varied backgrounds
            bgcolor: "transparent",
            position: "relative",
          }}
        >
          {/* Motion container provides a tasteful entrance animation */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{ display: "inline-block" }}
            aria-hidden={false}
          >
            <Typography
              component="h1"
              sx={{
                // Archivo Black is kept as preferred; fallback to sans-serif
                fontFamily: '"Archivo Black", sans-serif',
                // Responsive type sizing using clamp: keeps sizes proportional on any screen
                fontSize: {
                  xs: "clamp(2rem, 9vw, 3.5rem)",
                  sm: "clamp(3.5rem, 14vw, 6rem)",
                  md: "clamp(5rem, 10vw, 8rem)",
                },
                lineHeight: 1,
                fontWeight: 900,
                textTransform: "uppercase",
                // letterSpacing tight on large screens, slightly looser on mobile
                letterSpacing: { xs: "-1px", sm: "-8px", md: "-12px" },
                // gradient text (minimalist) + smooth clipping
                background: `linear-gradient(90deg, ${theme.palette.mode === 'dark' ? '#ffffff' : '#000000'} 0%, ${theme.palette.primary.main} 55%)`,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                // soft lift shadow for depth — keep it subtle
                textShadow: "0 8px 24px rgba(0,0,0,0.18)",
                // slight transform for crisp pixel rendering on some devices
                transform: "translateZ(0)",
                // accessibility: ensure the heading doesn't collapse on very small screens
                whiteSpace: "nowrap",
                // keep spacing consistent
                mt: { xs: 2, md: 4 },
                mb: { xs: 2, md: 4 },
                // hover: a tiny scale to feel interactive on desktop (no effect on mobile)
                "&:hover": {
                  transform: isMobile ? undefined : "translateY(-2px) scale(1.01)",
                  transition: "transform 220ms ease",
                },
              }}
            >
              {title}
            </Typography>

            {/* Animated underline / accent bar using ::after pseudo or a sibling bar. Here we use a small bar that animates in. */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.12, ease: "easeOut" }}
              style={{
                transformOrigin: "left",
                height: 6,
                borderRadius: 6,
                marginTop: 10,
                // the bar width adjusts with text — using inline-block makes it fit the content width
                display: "inline-block",
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary ? theme.palette.secondary.main : '#888'})`,
                boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
              }}
              aria-hidden
            />
          </motion.div>

          {/* A visually-hidden accessible label (for screen-readers) could be added here if necessary */}
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
