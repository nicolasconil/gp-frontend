import { Grid, Box, Typography, useMediaQuery, Button, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Feed from "../components/Feed.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import queryString from "query-string";
import { getAllProducts } from "../api/public.api.js";

const AllProductsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const location = useLocation();

  // leer query params de la URL
  const qs = queryString.parse(location.search);
  const category = qs.category || null;
  const gender = qs.gender || null;
  const size = qs.size || null;
  const available = qs.available || null;
  const page = qs.page || 1;
  const perPage = qs.perPage || 24;

  // react-query: usamos getAllProducts(params)
  const { data: rawData, isLoading, isError, refetch } = useQuery({
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
    keepPreviousData: true,
    // select para normalizar la respuesta: soporta axios response y distintas formas de payload
    select: (res) => {
      // axios response -> res.data
      const body = res?.data ?? res;
      if (Array.isArray(body)) return body;
      if (Array.isArray(body?.data)) return body.data;
      // si el backend devolviera { data: [...], total: N } o similar
      return body?.data ?? body;
    },
  });

  const products = rawData || [];

  // título dinámico
  const buildTitle = () => {
    if (category && gender) return `${category.charAt(0).toUpperCase() + category.slice(1)} · ${gender}`;
    if (category) return `${category.charAt(0).toUpperCase() + category.slice(1)}`;
    return "Productos";
  };

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
        <Typography sx={{ mt: 2, fontFamily: '"Archivo Black", sans-serif' }}>Cargando productos...</Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ height: "60vh", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
        <Typography sx={{ fontFamily: '"Archivo Black", sans-serif' }}>Error cargando los productos.</Typography>
        <Button variant="contained" sx={{ mt: 2, backgroundColor: "black" }} onClick={() => refetch()}>
          Reintentar
        </Button>
      </Box>
    );
  }

  return (
    <Box component="main" sx={{ px: { xs: 2, md: 4 }, py: 4 }}>
      <Box sx={{ maxWidth: 1280, mx: "auto" }}>
        <Box sx={{ display: "inline-block", px: 4, py: 2, position: "relative", mb: 6 }}>
          <Typography
            sx={{
              fontFamily: '"Archivo Black", sans-serif',
              fontSize: { xs: "3.5rem", sm: "6rem", md: "8rem" },
              letterSpacing: { xs: "-11.5px", sm: "-12px", md: "-19.5px" },
              fontWeight: 900,
              textTransform: "uppercase",
              lineHeight: 1,
              zIndex: 2,
              position: "relative",
              mt: { xs: 3, md: 6 },
              mb: { xs: 3, md: 6 },
            }}
          >
            {buildTitle()}
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ px: { xs: 2, sm: 4 }, margin: "0 auto", justifyContent: { xs: "center" } }}>
          {products.length === 0 ? (
            <Box sx={{ width: "100%", textAlign: "center", py: 8 }}>
              <Typography sx={{ fontFamily: '"Archivo Black", sans-serif', fontSize: '1.5rem' }}>
                No se encontraron productos con esos filtros.
              </Typography>
            </Box>
          ) : (
            products.map((product) => (
              <Grid key={product._id} item xs={12} sm={6} md={3}>
                <Feed
                  products={[product]}
                  onClick={() => navigate(`/producto/${product._id}`, { state: { product } })}
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
