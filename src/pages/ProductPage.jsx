import { Grid, Box, Typography, Button, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Feed from '../components/Feed.jsx';

const products = [
  { _id: '1', name: 'Vans KNU Skool', imageUrl: 'https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2024/10/2/10042258_800.jpg' },
  { _id: '2', name: 'Vans Speed LS', imageUrl: 'https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2025/1/28/10537975_800.jpg' },
  { _id: '3', name: 'Vans KNU Skool', imageUrl: 'https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2025/1/28/10537126_800.jpg' },
  { _id: '4', name: 'Vans Hylane', imageUrl: 'https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2025/1/28/10537450_800.jpg' },
  { _id: '5', name: 'Vans Classic Slip-On', imageUrl: 'https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2024/9/24/10017940_800.jpg' },
  { _id: '6', name: 'Vans Upland', imageUrl: 'https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2025/3/7/10629462_800.jpg' },
  { _id: '7', name: 'Vans Old Skool', imageUrl: 'https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2025/1/24/10528620_800.jpg' },
  { _id: '8', name: 'Vans SK8-Low', imageUrl: 'https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2025/1/28/10537065_800.jpg' },
  { _id: '9', name: 'Vans SK8-Hi', imageUrl: 'https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2024/9/20/10008921_800.jpg' },
];

const ProductPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const limit = isMobile ? 4 : 8;
  const visibleProducts = products.slice(0, limit);
  const showSeeAll = products.length > limit;

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
          <Grid item key={product._id} xs={12} sm={6} md={3}>
            <Feed product={product} />
          </Grid>
        ))}
      </Grid>

      {showSeeAll && (
        <Box mt={20}>
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
