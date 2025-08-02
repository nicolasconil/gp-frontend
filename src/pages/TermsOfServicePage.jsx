import { Box, Typography } from '@mui/material';

const TermsOfServicePage = () => (
  <Box sx={{ p: 4, maxWidth: '100vw', mx: 'auto' }}>
    <Typography
      variant="h1"
      gutterBottom
      sx={{
        fontSize: { xs: '3rem', sm: '4rem' },
        fontFamily: '"Archivo Black", sans-serif',
        letterSpacing: { xs: '-0.35rem', sm: '-0.5rem', md: '-0.4rem' },
        textTransform: 'uppercase',
        mb: 4,
        textAlign: 'center',
        textDecoration: 'underline',
      }}
    >
      Cómo comprar
    </Typography>

    <Typography
      variant="h4"
      sx={{
        fontFamily: '"Archivo Black", sans-serif',
        lineHeight: 1.8,
        mb: 3,
        letterSpacing: '-0.05rem',
      }}
    >
      En nuestra web, elegí un producto, hace click en "Ver más" dónde vas a acceder a la información detallada del producto seleccionado. Luego de elegido el talle y el color, hace click en "Agregar al carrito". A continuación, desde el carrito, si estás por finalizar tu pedido, hace click en "Finalizar compra", lo cual automáticamente te enviará al Checkout dónde completarás tus datos personales y de envíos para poder dirigirte al pago.
    </Typography>

    <Typography
      variant="h4"
      sx={{
        fontFamily: '"Archivo Black", sans-serif',
        lineHeight: 1.8,
        mb: 3,
        letterSpacing: '-0.05rem',
      }}
    >
      Una vez confirmado el pedido, te estaremos enviando un correo electrónico con toda la información y gestión del envío para tu tranquilidad.
    </Typography>

    <Typography
      variant="h1"
      gutterBottom
      sx={{
        fontSize: { xs: '3rem', sm: '4rem' },
        fontFamily: '"Archivo Black", sans-serif',
        letterSpacing: { xs: '-0.35rem', sm: '-0.5rem', md: '-0.4rem' },
        textTransform: 'uppercase',
        mt: 6,
        mb: 4,
        textAlign: 'center',
        textDecoration: 'underline',
      }}
    >
      Medios de pago
    </Typography>

    <Typography
      variant="h4"
      sx={{
        fontFamily: '"Archivo Black", sans-serif',
        lineHeight: 1.8,
        mb: 3,
        letterSpacing: '-0.05rem',
      }}
    >
      Aceptamos pagos en <strong>efectivo</strong> desde sus puntos de pago proporcionados por Mercado Pago, <strong>transferencia</strong> a través de Mercado Pago y tanto <strong>tarjetas de débito</strong> como <strong>tarjetas de crédito</strong> (únicamente en 1 pago) también proporcionadas por Mercado Pago.
    </Typography>

    <Typography
      variant="h4"
      sx={{
        fontFamily: '"Archivo Black", sans-serif',
        lineHeight: 1.8,
        mb: 3,
        letterSpacing: '-0.05rem',
      }}
    >
      El envío entrará en proceso una vez confirmado el pago.
    </Typography>
  </Box>
);

export default TermsOfServicePage;