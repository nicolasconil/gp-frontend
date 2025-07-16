import { Grid, Box, Typography, Button, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Feed from '../components/Feed.jsx';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAllProducts } from '../api/public.api.js';

const ProductPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: getAllProducts,
  });

  const products = data?.data || []
  const limit = isMobile ? 4 : 8;
  const visibleProducts = products.slice(0, limit);
  const showSeeAll = products.length > limit;

  if (isLoading) return <Typography> Cargando... </Typography>
  if (isError) return <Typography> Error cargando los productos. </Typography>

  return (
    <Box sx={{ textAlign: 'center', marginTop: { xs: '-350px', sm: '0' }, borderTop: '1px solid #e0e0e0', width: '100%', mt: '150px' }}>
      <Box
        sx={{
          display: 'inline-block',
          px: 4,
          py: 2,
          position: 'relative',
          mb: 6,
          borderRadius: '5px',
          alignItems: 'center',
        }}
      >
        <Typography
          sx={{
            fontFamily: '"Archivo Black", sans-serif',
            fontSize: { xs: '5rem', sm: '7rem', md: '9rem' },
            letterSpacing: { xs: '-11.5px', sm: '-12px', md: '-19.5px' },
            fontWeight: 900,
            textTransform: 'uppercase',
            lineHeight: 1,
            zIndex: 2,
            position: 'relative',
            mt: { xs: 5, md: 10 },
            mb: { xs: 5, md: 10 },
            cursor: 'pointer',
            '&:hover': {
              transform: 'scale(1.1)',
              transition: 'transform 0.3s ease',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -5,
              left: 0,
              width: '100%',
              height: '3px',
              backgroundColor: 'black',
            },
          }}
        >
          SHOP
        </Typography>
      </Box>

      <Grid container spacing={3} justifyContent="center" sx={{ px: { xs: 2, sm: 4 }, margin: '0 auto' }}>
        {visibleProducts.map((product) => (
          <Grid key={product._id} item xs={12} sm={6} md={3}>
            <Feed
              products={[product]}
              onClick={() => navigate(`/producto/${product._id}`, { state: { product } })}
            />
          </Grid>
        ))}
      </Grid>

      {showSeeAll && (
        <Box mt={7}>
          <Typography
            component="a"
            href='#'
            sx={{
              fontFamily: '"Archivo Black", sans-serif',
              fontSize: '1rem',
              textUnderlineOffset: '4px',
              color: 'black',
              cursor: 'pointer',
              letterSpacing: '-2px',
              '&:hover': {
                opacity: 0.85,
              },
            }}
          >
            VER TODOS LOS PRODUCTOS
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ProductPage;
