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
import { createPaymentPreference } from '../api/public.api.js';

const products = [
  {
    _id: '1',
    name: 'Vans KNU Skool',
    imageUrl:
      'https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2024/10/2/10042258_800.jpg',
  },
  {
    _id: '2',
    name: 'Vans Speed LS',
    imageUrl:
      'https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2025/1/28/10537975_800.jpg',
  },
  {
    _id: '3',
    name: 'Vans KNU Skool',
    imageUrl:
      'https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2025/1/28/10537126_800.jpg',
  },
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

  const handleBuyNow = async () => {
    if (!selectedSize) return;

    try {
      const orderData = {
        products: [
          {
            productId: product._id,
            name: product.name,
            image: product.imageUrl,
            price: product.price || 99999,
            quantity: 1,
            size: selectedSize,
          },
        ],
        total: product.price || 99999,
        buyer: {
          name: 'Invitado',
          email: 'invitado@email.com',
        },
      };

      const response = await createPaymentPreference(orderData);
      const { init_point } = response.data;
      window.location.href = init_point;
    } catch (error) {
      console.error('Error al crear la preferencia de pago:', error);
      alert('Hubo un error al procesar el pago. Intenta nuevamente.');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
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
          <Box sx={{ position: 'relative', pl: { xs: 0, md: 7 }, pt: 3, pb: 4 }}>
            <Typography
              variant="h3"
              sx={{ fontFamily: '"Archivo Black", sans-serif', fontWeight: 900, mb: 2 }}
            >
              {product.name}
            </Typography>

            <Typography variant="h6" sx={{ fontFamily: '"Archivo Black", sans-serif', fontWeight: 600, color: '#555', mb: 2 }}>
              {product.description || 'Descripción no disponible'}
            </Typography>

            <Typography variant="h5" sx={{ fontFamily: '"Archivo Black", sans-serif', fontWeight: 'bold', mb: 3 }}>
              ${product.price?.toLocaleString('es-AR') || '9.999'}
            </Typography>

            <Typography
              variant="caption"
              sx={{ fontFamily: '"Archivo Black", sans-serif', fontWeight: 600, textTransform: 'uppercase', mb: 1, display: 'block' }}
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
                      fontFamily: '"Archivo Black", sans-serif',
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
                    {/* líneas en cada botón de talle */}
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
                onClick={handleBuyNow}
              >
                {isOutOfStock ? 'Agotado' : 'Comprar ahora'}
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

      <Box sx={{ borderTop: '1px solid #e0e0e0', width: '100%', mt: 10 }}>
        <Typography
          align="center"
          sx={{
            cursor: 'default',
            fontFamily: '"Archivo Black", sans-serif',
            fontSize: { xs: '1.8rem', sm: '2rem', md: '4rem' },
            textTransform: 'uppercase',
            mb: 5,
            letterSpacing: { xs: '-3.5px', md: '-8.5px' },
            textDecoration: 'underline',
            mt: 10,
            color: '#e4ebe8',
            mx: { xs: 0, sm: 0, md: 'auto' },
            px: { xs: 0, sm: 0},
            whiteSpace: 'nowrap',
            transition: 'transform 0.4s ease',
            '&:hover': {
              ...(isMobile ? {} : {
                transform: 'scale(1.2)'
              })
            }
          }}
        >
          También podría gustarte
        </Typography>

        <Grid container spacing={12} sx={{ px: 0, justifyContent: 'center', pt: 5 }}>
          {products.slice(0, 3).map((item) => (
            <Grid key={item._id} item xs={12} sm={6} md={4}>
              <Box
                sx={{
                  cursor: 'pointer',
                  position: 'relative',
                  height: 400,
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform .3s ease',
                  '&:hover': { transform: 'scale(1.05)' },
                }}
                onClick={() =>
                  navigate(`/producto/${item._id}`, { state: { product: item } })
                }
              >

                <Box sx={{ height: '80%', overflow: 'hidden' }}>
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>

                <Box
                  sx={{
                    position: 'relative',
                    border: '3px solid black',
                    borderRadius: 1,
                    mx: { xs: 6, sm: 1.5, md: 1.5 },
                    mb: 1,
                    px: { xs: 0.5, md: 1 },
                    py: { xs: 0.2, md: 0.5 },
                    minHeight: 50,
                    backgroundColor: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Typography variant="h6" sx={{ fontFamily: '"Archivo Black", sans-serif', fontWeight: 600, fontSize: { xs: '0.9rem', sm: '1rem', md: '1.2rem', textAlign: 'center' } }}>
                    {item.name}
                  </Typography>

                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: -6,
                      left: 6,
                      width: '100%',
                      height: '4px',
                      backgroundColor: 'black',
                      borderRadius: '2px',
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 3.5,
                      right: -6,
                      width: '5px',
                      height: '100%',
                      backgroundColor: 'black',
                      borderRadius: '2px',
                    }}
                  />
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default ProductDetail;
