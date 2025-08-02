import { Box, Typography } from '@mui/material';

const ShippingPolicyPage = () => (
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
      Envíos
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
      Realizamos envíos a <strong>todo el país</strong>, utilizando como medio principal <strong>Correo Argentino</strong>.
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
      También podés coordinar el envío con <strong>otros expresos</strong> de tu preferencia.
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
      En la ciudad de <strong>Santa Fe Capital</strong>, realizamos entregas dependiendo de la zona.
    </Typography>
  </Box>
);

export default ShippingPolicyPage;
