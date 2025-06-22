import { Grid, Box, Typography } from '@mui/material';
import Feed from '../components/Feed';

const products = [
  { _id: '1', name: 'Vans KNU Skool', imageUrl: 'https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2024/10/2/10042258_800.jpg' },
  { _id: '2', name: 'Vans Speed LS', imageUrl: 'https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2025/1/28/10537975_800.jpg' },
  { _id: '3', name: 'Vans KNU Skool', imageUrl: 'https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2025/1/28/10537126_800.jpg' },
  { _id: '5', name: 'Vans Hylane', imageUrl: 'https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2025/1/28/10537450_800.jpg' },
];

const ProductPage = () => {
  return (
    <Box sx={{ textAlign: 'center', marginTop: { xs: '-350px', sm: '0' } }}>

      <Box
        sx={{
          display: 'inline-block',
          border: '4px solid black',
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
            letterSpacing: {
              xs: '-10px',
              sm: '-12px',
              md: '-18px',
            },
            fontWeight: 900,
            textTransform: 'uppercase',
            lineHeight: 1,
            zIndex: 2,
            position: 'relative',
            textShadow: { xs: '2px 2px 0 darkgrey', sm: '2px 2px 0 darkgrey', md: '4px 4px 0 darkgrey' }
          }}
        >
          SHOP
        </Typography>

        <Box
          sx={{
            position: 'absolute',
            bottom: -9,
            left: 8,
            width: '100%',
            height: '7px',
            backgroundColor: 'black',
            borderRadius: '2px'
          }}
        />

        <Box
          sx={{
            position: 'absolute',
            top: 3,
            right: -9,
            width: '6px',
            height: { xs: '104%', md: '103%' },
            backgroundColor: 'black',
            borderRadius: '2px'
          }}
        />
      </Box>

      <Grid
        container
        spacing={3}
        justifyContent="center"
        sx={{ px: { xs: 2, sm: 4 }, margin: '0 auto' }}
      >
        {products.map((product) => (
          <Grid item key={product._id} xs={12} sm={6} md={3}>
            <Feed product={product} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProductPage;
