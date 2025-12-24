import React from "react";
import {
  Grid,
  Box,
  Typography,
  useMediaQuery,
  Button,
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
    data: productsData,
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

  const products = Array.isArray(productsData) ? productsData : (productsData?.data ?? productsData ?? []);

  const buildTitle = () => {
    const path = location.pathname.replace(/\/+$/, "");
    if (path === "/productos" && !category && !gender) {
      return "TODOS LOS PRODUCTOS";
    }
    if (category && gender) {
      return `${category.charAt(0).toUpperCase() + category.slice(1)} · ${gender}`;
    }
    if (category) {
      return category.charAt(0).toUpperCase() + category.slice(1);
    }
    return "INDUMENTARIA";
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
        <Typography sx={{ mt: 2, fontFamily: '"Archivo Black", sans-serif', letterSpacing: '-0.1rem' }}>
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
          height: "60vh",
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
        <Typography sx={{ mt: 2, fontFamily: '"Archivo Black", sans-serif', letterSpacing: '-0.1rem' }}>
          Error cargando los productos.
        </Typography>
        <Button
          variant="contained"
          onClick={() => refetch()}
          sx={{
            mt: 2,
            fontFamily: '"Archivo Black", sans-serif',
            border: '3px solid black',
            borderRadius: '4px',
            backgroundColor: 'black',
            color: 'white',
            position: 'relative',
            overflow: 'visible'
          }}
        >
          Reintentar
          <Box
            sx={{
              position: 'absolute',
              bottom: -5,
              left: 6,
              width: '98%',
              height: '6px',
              backgroundColor: 'black',
              borderRadius: '2px',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 6,
              right: -5,
              width: '6px',
              height: { xs: '95%', md: '97%' },
              backgroundColor: 'black',
              borderRadius: '2px',
            }}
          />
        </Button>
      </Box>
    );
  }

  return (
    <Box component="main" sx={{ px: { xs: 2, md: 4 }, py: 4 }}>
      <Box sx={{ maxWidth: 1280, mx: "auto" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: { xs: 2, md: 6 },
            mb: 6,
            px: { xs: 0, md: 2 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "fit-content",
              maxWidth: "95vw",
              mx: "auto",
              px: { xs: 1, md: 4 },
            }}
          >
            <Typography
              component="h1"
              aria-label={title}
              sx={{
                fontFamily: '"Archivo Black", sans-serif',
                fontSize: "clamp(2.1rem, 8.5vw, 6rem)",
                letterSpacing: { xs: "-1px", sm: "-4px", md: "-10px" },
                fontWeight: 900,
                textTransform: "uppercase",
                lineHeight: { xs: 0.88, sm: 0.95, md: 1 },
                zIndex: 2,
                mt: { xs: 0.5, md: 2 },
                mb: { xs: 0.5, md: 2 },
                cursor: "default",
                whiteSpace: "normal",
                overflowWrap: "break-word",
                wordBreak: "break-word",
                display: "block",
                textAlign: "center",
                px: { xs: 0, sm: 2 },
                '&:hover': {
                  transform: isMobile ? undefined : "translateY(-2px)",
                  transition: "transform 200ms ease",
                },
              }}
            >
              {title}
            </Typography>
            <Box
              sx={{
                height: 3,
                borderRadius: 2,
                mt: 0.75,
                width: "100%",
                maxWidth: "900px",
                backgroundColor: "black",
                boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
              }}
            />
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
