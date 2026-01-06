import { Grid, Box, Typography, useMediaQuery, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Feed from '../components/Feed.jsx';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAllProducts } from '../api/public.api.js';

const ProductPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const category = searchParams.get('category') || undefined;
  const gender = searchParams.get('gender') || undefined;
  const name = searchParams.get('name') || undefined;

  const { data, isLoading, isError } = useQuery({

    queryKey: ['products', { category, gender, name }],
    queryFn: () => getAllProducts({ category, gender, name }),
    keepPreviousData: true,
  });

  const products = data?.data ?? data ?? [];
  const limit = isMobile ? 4 : 8;
  const visibleProducts = products.slice(0, limit);
  const showSeeAll = products.length > limit;

  if (isLoading) {
    return (
      <Box sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        flexDirection: 'column'
      }}
      >
        <Box
          component='img'
          src='/logo1.svg'
          alt='Cargando...'
          sx={{
            width: 120,
            height: 'auto',
            opacity: 0.5,
            animation: 'pulseOpacity 2s infinite ease-in-out',
          }}
        />
        <Typography variant='h5' sx={{ mt: 2, fontFamily: '"Archivo Black", sans-serif', letterSpacing: '-0.1rem' }}>
          Cargando productos...
        </Typography>
        <style>
          {`
            @keyframes pulseOpacity {
            0% { opacity: 0,2; }
            50% { opacity: 1; }
            100% { opacity: 0.2; }
            }
          `}
        </style>
      </Box>
    )
  }
  if (isError) {
    return (
      <Box sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        flexDirection: 'column',
        textAlign: 'center',
      }}
      >
        <Box
          component='img'
          src='/logo1.svg'
          alt='Error'
          sx={{
            width: 120,
            height: 'auto',
            opacity: 0.3,
          }}
        />
        <Typography variant='h6' sx={{ mt: 2, fontFamily: '"Archivo Black", sans-serif', letterSpacing: '-0.1rem' }}>
          Error cargando los productos.
        </Typography>
        <Button
          variant='contained'
          onClick={() => window.location.reload()}
          sx={{ mt: 2, fontFamily: '"Archivo Black", sans-serif', border: '3px solid black', borderRadius: '4px', backgroundColor: 'black', color: 'white' }}
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
    )
  };

  return (
    <Box sx={{ textAlign: 'center', marginTop: { xs: '-400px', sm: '0' }, borderTop: '1px solid #e0e0e0', width: '100%', mt: '150px' }}>
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

      <Grid container spacing={3} sx={{ px: { xs: 2, sm: 4 }, margin: '0 auto', justifyContent: { xs: 'center' } }}>
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
          <Button
            onClick={() => navigate('/productos')}
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
              textDecoration: 'underline'
            }}
          >
            VER TODOS LOS PRODUCTOS
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ProductPage;
