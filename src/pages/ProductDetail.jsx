import { Box, Button, Typography, Grid, useMediaQuery, useTheme, Container } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useCart } from '../context/CartContext'
import { getAllProducts } from '../api/public.api.js';
import { ensureArray } from '../utils/array.js';

const baseURL = import.meta.env.VITE_BACKEND_URL;

const ProductDetail = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();

  const { product } = location.state ?? { product: {} };
  const variations = product.variations || [];
  const isOutOfStock = product.stock === 0;
  const allSizes = Array.from({ length: 9 }, (_, i) => 36 + i);
  const allColors = [...new Set(variations.map(v => v.color))];

  const [selectedColor, setSelectedColor] = useState(allColors[0] || null);
  const [selectedVariation, setSelectedVariation] = useState(null);

  useEffect(() => {
    const newProduct = location.state?.product || {};
    const newVariations = newProduct.variations || [];
    const newColors = [...new Set(newVariations.map(v => v.color))];
    setSelectedColor(newColors[0] || null);
    setSelectedVariation(null);
  }, [location.state?.product]);

  const isSizeAvailable = (size) => {
    return variations.some(v => v.color === selectedColor && v.size === size && v.stock > 0);
  };

  const getVariationForSize = (size) => {
    return variations.find(v => v.color === selectedColor && v.size === size && v.stock > 0);
  };

  const getImageForColor = () => {
    const variationWithImage = variations.find(v => v.color === selectedColor && v.image);
    return variationWithImage?.image || product.image || 'https://via.placeholder.com/600x600?text=Producto+no+disponible';
  };

  const { data: productsData } = useQuery({
    queryKey: ['randomProducts'],
    queryFn: getAllProducts,
    select: data => {
      const items = ensureArray(data?.data).filter(p => p._id !== product._id);
      return items.sort(() => 0.5 - Math.random()).slice(0, 3);
    },
  });

  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    if (!selectedVariation) return;
    addToCart(product, selectedVariation.size, selectedColor, 1);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Grid container spacing={6} alignItems="flex-start" justifyContent="center">
        <Grid xs={12} md={6} sx={{
          display: 'flex',
          justifyContent: 'center',
          maxWidth: { md: 600 },
          mx: 'auto'
        }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
              borderRadius: 2,
              maxWidth: { xs: '90%', md: 500 },
              minHeight: { md: 600 },
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
              src={
                getImageForColor().startsWith('/uploads')
                  ? `${baseURL}${getImageForColor()}`
                  : getImageForColor()
              }
              alt={product.name}
              style={{
                width: '100%',
                height: 'auto',
                objectFit: 'contain',
                display: 'block',
                transition: 'transform 0.3s ease',
              }}
            />
          </Box>
        </Grid>
        <Grid xs={12} md={6} sx={{
          maxWidth: { md: 600 },
          mx: 'auto',
          textAlign: { xs: 'left', md: 'left' },
          pl: { xs: 0, md: 7 }
        }}>
          <Box sx={{ pt: { xs: 3, md: 7 }, pb: 4 }}>
            <Typography
              variant="h3"
              sx={{ fontFamily: '"Archivo Black", sans-serif', fontWeight: 900, mb: 2, textTransform: 'uppercase', letterSpacing: '-2px' }}
            >
              {product.name}
            </Typography>

            <Typography variant="h6" sx={{ fontFamily: '"Archivo Black", sans-serif', fontWeight: 600, color: '#555', mb: 2 }}>
              {product.description || 'Descripción no disponible'}
            </Typography>

            <Typography variant="h5" sx={{ fontFamily: '"Archivo Black", sans-serif', fontWeight: 'bold', mb: 3 }}>
              ${product.price?.toLocaleString('es-AR')}
            </Typography>

            <Typography
              variant="caption"
              sx={{ fontFamily: '"Archivo Black", sans-serif', fontWeight: 600, textTransform: 'uppercase', mb: 1, display: 'block' }}
            >
              Color:
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
              {allColors.map(color => (
                <Button
                  key={color}
                  onClick={() => { selectedColor(color); setSelectedVariation(null); }}
                  variant={selectedColor === color ? 'contained' : 'outlined'}
                  sx={{
                    fontFamily: '"Archivo Black", sans-serif',
                    fontSize: 13,
                    fontWeight: 400,
                    textTransform: 'uppercase',
                    px: 1,
                    py: 0.5,
                    minWidth: 'auto',
                    borderRadius: 1,
                    border: '2px solid black',
                    color: selectedColor === color ? 'white' : 'black',
                    backgroundColor: selectedColor === color ? 'black' : 'white',
                    '&:hover': { backgroundColor: selectedColor === color ? 'black' : '#f0f0f0' }
                  }}
                >
                  {color}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: -4,
                      left: 4,
                      width: '100%',
                      height: '4px',
                      backgroundColor: 'black',
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
                      backgroundColor: 'black',
                      borderRadius: 1,
                    }}
                  />
                </Button>
              ))}
            </Box>
            {/* ...rest of the component remains unchanged... */}
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
            px: { xs: 0, sm: 0 },
            whiteSpace: 'nowrap',
            transition: 'transform 0.4s ease',
            '&:hover': {
              ...(isMobile ? {} : {
                transform: 'scale(1.2)',
              }),
            },
          }}
        >
          También podría gustarte
        </Typography>

        <Grid container spacing={12} sx={{ px: 0, justifyContent: 'center', pt: 5 }}>
          {productsData?.slice(0, 3).map((item) => (
            <Grid key={item._id} xs={12} sm={6} md={4} sx={{ width: 300, flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
              <Box
                sx={{
                  cursor: 'pointer',
                  position: 'relative',
                  height: 455,
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform .3s ease',
                  '&:hover': { transform: 'scale(1.05)' },
                }}
                onClick={() =>
                  navigate(`/producto/${item._id}`, { state: { product: item } })
                }
              >
                <Box sx={{ height: '70%', overflow: 'hidden' }}>
                  <img
                    src={
                      item.image?.startsWith('/uploads')
                        ? `${baseURL}${item.image}`
                        : item.image || 'https://via.placeholder.com/600x600?text=Producto+no+disponible'
                    }
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
                    minHeight: 40,
                    backgroundColor: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h6" sx={{ fontFamily: '"Archivo Black", sans-serif', fontWeight: 600, fontSize: { xs: '0.9rem', sm: '1rem', md: '1.2rem', textAlign: 'center' }, textTransform: 'uppercase' }}>
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