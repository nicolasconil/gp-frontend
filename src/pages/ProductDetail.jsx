import {
  Box,
  Button,
  Typography,
  Grid,
  useMediaQuery,
  useTheme,
  Container,
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

const products = [
  { _id: '1', name: 'Vans KNU Skool', imageUrl: 'https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2024/10/2/10042258_800.jpg' },
  { _id: '2', name: 'Vans Speed LS', imageUrl: 'https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2025/1/28/10537975_800.jpg' },
  { _id: '3', name: 'Vans KNU Skool', imageUrl: 'https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2025/1/28/10537126_800.jpg' },
  { _id: '4', name: 'Vans Hylane', imageUrl: 'https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2025/1/28/10537450_800.jpg' },
];

const ProductDetail = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();

  const { product } = location.state ?? { product: {} };
  const sizeStock = product.sizeStock || {};
  const sizes = [36, 37, 38, 39, 40, 41, 42, 43, 44];
  const isOutOfStock = product.stock === 0;
  const [selectedSize, setSelectedSize] = useState(null);

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      {/* ---------- DETALLE ---------- */}
      <Grid container spacing={6} alignItems="center">
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
              borderRadius: 2,
              ...(isMobile
                ? {}
                : {
                    '&:hover img': {
                      transform: 'scale(1.07)',
                      transition: 'transform 0.3s ease',
                    },
                  }),
            }}
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              style={{
                width: isMobile ? '90%' : '100%',
                height: isMobile ? 'auto' : '600px',
                objectFit: 'contain',
                display: 'block',
                transition: 'transform 0.3s ease',
              }}
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ position: 'relative', pl: { xs: 0, md: 6 }, pt: 3, pb: 4 }}>
            <Typography
              variant="h3"
              sx={{ fontFamily: '"Archivo Black", sans-serif', fontWeight: 900, mb: 2 }}
            >
              {product.name}
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 600, color: '#555', mb: 2 }}>
              {product.description || 'Descripción no disponible'}
            </Typography>

            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
              ${product.price?.toLocaleString('es-AR') || '9.999'}
            </Typography>

            <Typography
              variant="caption"
              sx={{ fontWeight: 600, textTransform: 'uppercase', mb: 1, display: 'block' }}
            >
              Talles:
            </Typography>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 1,
                mb: 3,
              }}
            >
              {sizes.map((size) => {
                const outOfStock = sizeStock[size] === 0;
                const isSelected = selectedSize === size;

                return (
                  <Button
                    key={size}
                    disabled={outOfStock}
                    onClick={() => !outOfStock && setSelectedSize(size)}
                    variant="outlined"
                    sx={{
                      fontSize: 12,
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      px: 0.5,
                      py: 0.25,
                      minWidth: 'auto',
                      borderRadius: 1,
                      border: '2px solid black',
                      position: 'relative',
                      color: outOfStock ? '#777' : isSelected ? 'white' : 'black',
                      backgroundColor: isSelected ? 'black' : outOfStock ? '#d1d1d1' : 'transparent',
                      textDecoration: outOfStock ? 'line-through' : 'none',
                      '&:hover': {
                        backgroundColor: isSelected
                          ? 'black'
                          : outOfStock
                          ? '#d1d1d1'
                          : '#f0f0f0',
                      },
                    }}
                  >
                    {size}
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: -4,
                        left: 4,
                        width: '100%',
                        height: '4px',
                        backgroundColor: outOfStock ? '#777' : 'black',
                        borderRadius: 4,
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 2,
                        right: -4,
                        width: '4px',
                        height: { xs: '102%', md: '103%' },
                        backgroundColor: outOfStock ? '#777' : 'black',
                        borderRadius: 1,
                      }}
                    />
                  </Button>
                );
              })}
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="contained"
                disabled={isOutOfStock || !selectedSize}
                startIcon={<AddShoppingCartIcon />}
                sx={{
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  fontSize: 16,
                  backgroundColor: 'black',
                  color: 'white',
                  '&:hover': { backgroundColor: '#222' },
                }}
                onClick={() => {
                  console.log(`Producto agregado (talle ${selectedSize})`);
                }}
              >
                {isOutOfStock ? 'Agotado' : 'Agregar al carrito'}
              </Button>

              {isOutOfStock && (
                <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                  Este producto está agotado
                </Typography>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* ---------- SUGERENCIAS ---------- */}
      <Box sx={{ mt: 10 }}>
        <Typography
          align="center"
          sx={{
            fontFamily: '"Archivo Black", sans-serif',
            fontSize: { xs: '2rem', md: '3rem' },
            textTransform: 'uppercase',
            mb: 5,
            letterSpacing: '-2px',
          }}
        >
          Podría gustarte
        </Typography>

        <Grid container spacing={3}>
          {products.slice(0, 4).map((item) => (
            <Grid key={item._id} item xs={12} sm={6} md={3}>
              <Box
                sx={{
                  overflow: 'hidden',
                  borderRadius: 2,
                  cursor: 'pointer',
                  '&:hover img': {
                    transform: 'scale(1.07)',
                    transition: 'transform 0.3s ease',
                  },
                }}
                onClick={() =>
                  navigate(`/producto/${item._id}`, {
                    state: { product: item },
                  })
                }
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  style={{
                    width: '100%',
                    height: '250px',
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'transform 0.3s ease',
                  }}
                />
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 1 }}>
                {item.name}
              </Typography>
              <Typography variant="body2" sx={{ color: '#555' }}>
                $99.999
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default ProductDetail;
