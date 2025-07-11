import { Box, Button, Card, CardContent, CardMedia, Typography, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

const Feed = ({ product, onClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const isOutOfStock = product.stock === 0;
  const imageUrl = product.imageUrl || 'https://via.placeholder.com/300x300?text=Producto';

  return (
    <Box onClick={onClick} sx={{ cursor: 'pointer' }}>
      <Card
        sx={{
          border: '3px solid #f9f9f9',
          borderRadius: '10px',
          marginTop: { xs: 1, md: 2 },
          position: 'relative',
          overflow: 'hidden',
          height: 500,
          maxHeight: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.3s ease',
          width: 350,
          maxWidth: '100%',
          mx: 'auto',
          backgroundColor: 'transparent',
          '&:hover': {
            transform: 'translateY(-4px)',
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
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              transition: 'transform 0.4s ease-in-out',
              '&:hover': {
                transform: 'scale(1.1)',
              },
            }}
          />
          {isOutOfStock && (
            <Box
              sx={{
                position: 'absolute',
                top: 10,
                right: 10,
                backgroundColor: 'error.main',
                color: 'white',
                px: 1,
                borderRadius: 1,
                fontSize: 10,
                fontWeight: 'bold',
                textTransform: 'uppercase',
              }}
            >
              Agotado
            </Box>
          )}
        </Box>

        <CardContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            flexGrow: 1,
            justifyContent: 'space-between',
            px: 3,
            py: 3,
          }}
        >
          <Tooltip title="Ver detalle" arrow>
            <Box
              sx={{
                display: 'inline-block',
                border: '2px solid black',
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
                    sm: '-2px',
                  },
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  textAlign: 'center',
                  lineHeight: 1.2,
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                  cursor: 'pointer',
                  '&:hover': {
                    color: '#444',
                  },
                }}
              >
                {product.name}
              </Typography>

              {/* Línea horizontal inferior */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -4,
                  left: 4,
                  width: '100%',
                  height: '4px',
                  backgroundColor: 'black',
                  borderRadius: '2px',
                }}
              />

              {/* Línea vertical derecha */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 2,
                  right: -4,
                  width: '4px',
                  height: { xs: '102%', md: '103%' },
                  backgroundColor: 'black',
                  borderRadius: '2px',
                }}
              />
            </Box>
          </Tooltip>

          {/* Precio estilizado */}
          <Box
            sx={{
              display: 'inline-block',
              border: '2px solid black',
              px: 2,
              py: 1,
              position: 'relative',
              borderRadius: '4px',
              mx: 'auto',
              marginTop: '-10px'
            }}
          >
            <Typography sx={{ fontWeight: 600, fontSize: 18 }}>
              ${product.price?.toLocaleString('es-AR') || '9.999'}
            </Typography>

            {/* Línea inferior */}
            <Box
              sx={{
                position: 'absolute',
                bottom: -4,
                left: 4,
                width: '99%',
                height: '4px',
                backgroundColor: 'black',
                borderRadius: '2px',
              }}
            />

            {/* Línea vertical derecha */}
            <Box
              sx={{
                position: 'absolute',
                top: 2,
                right: -4,
                width: '4px',
                height: { xs: '102%', md: '103%' },
                backgroundColor: 'black',
                borderRadius: '2px',
              }}
            />
          </Box>

          {/* Botón estilizado */}
          <Box
            sx={{
              display: 'inline-block',
              position: 'relative',
              border: '2px solid black',
              borderRadius: '4px',

              mx: 'auto',
              width: '100%',
            }}
          >
            <Button
              variant="contained"
              disabled={isOutOfStock}
              fullWidth
              startIcon={<AddShoppingCartIcon />}
              sx={{
                fontSize: 16,
                fontWeight: 600,
                textTransform: 'uppercase',
                backgroundColor: 'black',
                color: 'white',
                py: 1.2,
                borderRadius: 0,
                '&:hover': {
                  backgroundColor: '#222',
                  
                }
              }}
            >
              Agregar
            </Button>

            <Box
              sx={{
                position: 'absolute',
                bottom: -7,
                left: 5,
                width: '100%',
                height: '6px',
                backgroundColor: 'black',
                borderRadius: '2px'
              }}
            />

            <Box 
              sx={{
                position: 'absolute',
                top: 5,
                right: -6,
                width: '6px',
                height: { xs: '102%', md: '103%' },
                backgroundColor: 'black',
                borderRadius: '3px'
              }}
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Feed;
