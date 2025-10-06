import { Box, Button, Card, CardContent, CardMedia, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const baseURL = import.meta.env.VITE_BACKEND_URL;
const PLACEHOLDER = '/logo.svg';

const Feed = ({ products = [], onClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {products.map((product) => {
        const isOutOfStock = product.stock === 0;
        const primaryImage = Array.isArray(product.images) && product.images.length
          ? product.images[0]
          : product.image;

        const imageUrl = primaryImage?.startsWith('/uploads')
          ? `${baseURL}${primaryImage}`
          : primaryImage
            ? primaryImage
            : PLACEHOLDER;

        const handleGoTODetail = () => {
          navigate(`/producto/${product._id}`, { state: { product } });
        };

        const handleImgError = (e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = PLACEHOLDER;
        };

        return (
          <Box key={product._id} onClick={onClick} sx={{ cursor: 'pointer', width: '100%' }}>
            <Card
              sx={{
                border: '1px solid rgba(0,0,0,0.06)',
                boxShadow: '0 6px 18px rgba(2,6,23,0.06)',
                borderRadius: 2,
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                width: '100%',           // fill grid cell
                height: '100%',          // fill grid cell (parent must allow)
                backgroundColor: '#fff',
                pointerEvents: isOutOfStock ? 'none' : 'auto',
                '&:hover': {
                  transform: isOutOfStock ? 'none' : 'translateY(-6px)',
                  boxShadow: isOutOfStock ? 'none' : '0 12px 30px rgba(2,6,23,0.08)',
                },
              }}
            >
              {/* IMAGE WRAPPER - fixed visual area for consistent layout */}
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  // consistent height but responsive
                  height: isMobile ? 180 : 220,
                  backgroundColor: '#fff',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  overflow: 'hidden',
                }}
              >
                <CardMedia
                  component="img"
                  src={imageUrl}
                  alt={product.name}
                  onError={handleImgError}
                  sx={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    transition: 'transform 0.45s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.06)',
                    },
                  }}
                />
              </Box>

              {/* CARD CONTENT: flexible so cards align */}
              <CardContent
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  flexGrow: 1,
                  justifyContent: 'space-between',
                  px: { xs: 2.5, sm: 3 },
                  py: { xs: 2, sm: 3 },
                }}
              >
                <Box>
                  <Box
                    sx={{
                      display: 'inline-block',
                      border: isOutOfStock ? '2px solid rgba(0,0,0,0.15)' : '2px solid rgba(0,0,0,0.9)',
                      px: 2,
                      py: 0.8,
                      borderRadius: 1,
                      mx: 'auto',
                      maxWidth: '100%',
                      textAlign: 'center',
                      mb: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: '"Archivo Black", sans-serif',
                        fontSize: 'clamp(0.95rem, 1.4vw, 1.15rem)',
                        letterSpacing: '-1px',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        lineHeight: 1.15,
                        whiteSpace: 'normal',
                        wordBreak: 'break-word',
                        color: isOutOfStock ? "rgba(0,0,0,0.45)" : 'black',
                      }}
                    >
                      {product.name}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: 'inline-block',
                      border: isOutOfStock ? '2px solid rgba(0,0,0,0.15)' : '2px solid rgba(0,0,0,0.9)',
                      px: 2,
                      py: 0.6,
                      borderRadius: 1,
                      mx: 'auto',
                      textAlign: 'center',
                      mb: 1,
                    }}
                  >
                    <Typography sx={{ fontWeight: 600, fontSize: 16, color: isOutOfStock ? 'rgba(0,0,0,0.45)' : 'black' }}>
                      ${product.price?.toLocaleString('es-AR')}
                    </Typography>
                  </Box>
                </Box>

                {/* BUTTON at bottom to keep consistent placement */}
                <Box sx={{ width: '100%' }}>
                  <Button
                    variant="contained"
                    disabled={isOutOfStock}
                    fullWidth
                    onClick={(e) => { e.stopPropagation(); handleGoTODetail(); } }
                    sx={{
                      fontSize: 15,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      backgroundColor: isOutOfStock ? '#bbb' : 'black',
                      color: 'white',
                      py: 1.1,
                      borderRadius: 0,
                      '&:hover': {
                        backgroundColor: isOutOfStock ? '#bbb' : '#222',
                      },
                    }}
                  >
                    {isOutOfStock ? 'Agotado' : 'Comprar'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        );
      })}
    </Box>
  );
};

export default Feed;
