import { Box, Typography } from '@mui/material';

const TermsOfServicePage = () => (
  <Box
    sx={{
      px: { xs: 2, sm: 4 },
      py: { xs: 3, sm: 6 },
      maxWidth: 1280,
      mx: 'auto',
      textAlign: 'center',
    }}
  >
    <Typography
      variant="h1"
      gutterBottom
      sx={{
        fontSize: { xs: '3rem', sm: '4rem' },
        fontFamily: '"Archivo Black", sans-serif',
        letterSpacing: { xs: '-0.35rem', sm: '-0.45rem' },
        textTransform: 'uppercase',
        mb: { xs: 3, sm: 4 },
        textDecoration: 'underline',
      }}
    >
      Cómo comprar
    </Typography>

    <Typography
      variant="h5"
      sx={{
        fontFamily: '"Archivo Black", sans-serif',
        lineHeight: 1.7,
        mb: 3,
        letterSpacing: '-0.05rem',
      }}
    >
      En nuestra web, elegí un producto y hacé click en “Ver más” para acceder a la información detallada del producto seleccionado. Luego, elegí el talle y color, y hacé click en “Agregar al carrito”.  
      Desde el carrito, si estás por finalizar tu pedido, hacé click en “Finalizar compra” para completar tus datos personales y de envío antes de realizar el pago.
    </Typography>

    <Typography
      variant="h5"
      sx={{
        fontFamily: '"Archivo Black", sans-serif',
        lineHeight: 1.7,
        mb: { xs: 4, sm: 6 },
        letterSpacing: '-0.05rem',
      }}
    >
      Una vez confirmado el pedido, te enviaremos un correo electrónico con toda la información y gestión del envío para tu tranquilidad.
    </Typography>

    <Typography
      variant="h1"
      gutterBottom
      sx={{
        fontSize: { xs: '3rem', sm: '4rem' },
        fontFamily: '"Archivo Black", sans-serif',
        letterSpacing: { xs: '-0.35rem', sm: '-0.45rem' },
        textTransform: 'uppercase',
        mb: { xs: 3, sm: 4 },
        textDecoration: 'underline',
      }}
    >
      Medios de pago
    </Typography>

    <Typography
      variant="h5"
      sx={{
        fontFamily: '"Archivo Black", sans-serif',
        lineHeight: 1.7,
        mb: 3,
        letterSpacing: '-0.05rem',
      }}
    >
      Aceptamos pagos en <strong>efectivo</strong> desde los puntos de pago de Mercado Pago,  
      <strong>transferencia</strong> a través de Mercado Pago, y también <strong>tarjetas de débito</strong> y <strong>crédito</strong> proporcionadas por esta plataforma.
    </Typography>

    <Typography
      variant="h5"
      sx={{
        fontFamily: '"Archivo Black", sans-serif',
        lineHeight: 1.7,
        letterSpacing: '-0.05rem',
      }}
    >
      El envío entrará en proceso una vez confirmado el pago.
    </Typography>
  </Box>
);

export default TermsOfServicePage;
