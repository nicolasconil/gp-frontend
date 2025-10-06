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
                // softened border + subtle shadow for a cleaner, more professional look
                border: '1px solid rgba(0,0,0,0.06)',
                boxShadow: '0 6px 18px rgba(2,6,23,0.06)',
                borderRadius: '10px',
                marginTop: { xs: 1, md: 2 },
                position: 'relative',
                overflow: 'hidden',
                // make cards fluid so the Grid can control sizing/centering
                height: '100%',
                maxHeight: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s ease, box-shadow 0.25s ease',
                width: '100%',
                maxWidth: '100%',
                mx: 'auto',
                backgroundColor: 'transparent',
                pointerEvents: isOutOfStock ? 'none' : 'auto',
                '&:hover': {
                  transform: isOutOfStock ? 'none' : 'translateY(-4px)',
                  boxShadow: isOutOfStock ? 'none' : '0 12px 30px rgba(2,6,23,0.08)',
                },
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  height: isMobile ? 200 : 220,
                  backgroundColor: 'white',
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
                    // use max constraints so image stays centered and doesn't distort grid
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    transition: 'transform 0.4s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.06)',
                    },
                  }}
                />
              </Box>
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
                <Box
                  sx={{
                    display: 'inline-block',
                    border: isOutOfStock ? '2px solid rgba(0,0,0,0.15)' : '2px solid rgba(0,0,0,0.9)',
                    px: 2,
                    py: 1,
                    position: 'relative',
                    mx: 'auto',
                    borderRadius: '4px',
                    maxWidth: '100%',
                    marginTop: '-10px'
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: '"Archivo Black", sans-serif',
                      fontSize: 'clamp(1rem, 1.5vw, 1.3rem)',
                      letterSpacing: {
                        xs: '-1px',
                        sm: isOutOfStock ? '-1.5px' : '-2px',
                      },
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      textAlign: 'center',
                      lineHeight: 1.2,
                      whiteSpace: 'normal',
                      wordBreak: 'break-word',
                      cursor: 'pointer',
                      '&:hover': {
                        color: '#222',
                      },
                      color: isOutOfStock ? "rgba(0,0,0,0.45)" : 'black',
                    }}
                  >
                    {product.name}
                  </Typography>
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: -5,
                      left: 4,
                      width: '100%',
                      height: '4px',
                      backgroundColor: isOutOfStock ? 'grey' : 'black',
                      borderRadius: '2px',
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 2.5,
                      right: -5,
                      width: '4px',
                      height: '104.5%',
                      backgroundColor: isOutOfStock ? 'grey' : 'black',
                      borderRadius: '2px',
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    display: 'inline-block',
                    border: isOutOfStock ? '2px solid rgba(0,0,0,0.15)' : '2px solid rgba(0,0,0,0.9)',
                    px: 2,
                    py: 1,
                    position: 'relative',
                    borderRadius: '4px',
                    mx: 'auto',
                    marginTop: '-10px'
                  }}
                >
                  <Typography sx={{ fontWeight: 600, fontSize: 18, color: isOutOfStock ? 'rgba(0,0,0,0.45)' : 'black' }}>
                    ${product.price?.toLocaleString('es-AR')}
                  </Typography>
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: -5,
                      left: 4,
                      width: '100%',
                      height: '4px',
                      backgroundColor: isOutOfStock ? 'grey' : 'black',
                      borderRadius: '2px',
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 4,
                      right: -5,
                      width: '4px',
                      height: '100%',
                      backgroundColor: isOutOfStock ? 'grey' : 'black',
                      borderRadius: '2px',
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    display: 'inline-block',
                    position: 'relative',
                    border: isOutOfStock ? '2px solid rgba(0,0,0,0.15)' : '2px solid rgba(0,0,0,0.9)',
                    borderRadius: '4px',
                    mx: 'auto',
                    width: '100%',
                  }}
                >
                  <Button
                    variant="contained"
                    disabled={isOutOfStock}
                    fullWidth
                    onClick={(e) => { e.stopPropagation(); handleGoTODetail(); } }
                    sx={{
                      fontSize: 16,
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      backgroundColor: isOutOfStock ? '#aaa' : 'black',
                      color: 'white',
                      py: 1.2,
                      borderRadius: 0,
                      '&:hover': {
                        backgroundColor: '#222',
                      }
                    }}
                  >
                    {isOutOfStock ? 'Agotado' : 'Comprar'}
                  </Button>
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: -6,
                      left: 4,
                      width: '100%',
                      height: '5px',
                      backgroundColor: isOutOfStock ? 'grey' : 'black',
                      borderRadius: '2px',
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 4,
                      right: { xs: -5, md: -6.5 },
                      width: '5px',
                      height: '103.5%',
                      backgroundColor: isOutOfStock ? 'grey' : 'black',
                      borderRadius: '2px',
                    }}
                  />
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
