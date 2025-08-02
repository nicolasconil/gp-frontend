import { Box, Typography } from '@mui/material';

const AboutUsPage = () => (
  <Box sx={{ p: 4, maxWidth: '100vw', mx: 'auto', }}>
    <Typography
      variant="h1"
      gutterBottom
      sx={{
        fontSize: { xs: '4rem' },
        fontFamily: '"Archivo Black", sans-serif',
        letterSpacing: { xs: '-0.45rem', md: '-0.4rem'},
        textTransform: 'uppercase',
        mb: 4,
        textAlign: 'center',
        justifyContent: 'center',
        textDecoration: 'underline'
      }}
    >
      Nosotros
    </Typography>
    <Typography
      variant="h4"
      sx={{
        fontFamily: '"Archivo Black", sans-serif',
        lineHeight: 1.8,
        mb: 3,
        letterSpacing: '-0.1rem'
      }}
    >
      Somos una tienda online de <strong>calzado</strong>, <strong>indumentaria</strong> y <strong>accesorios</strong>, tanto <strong>mayorista</strong> como <strong>minorista</strong>.
    </Typography>

    <Typography
      variant="h4"
      sx={{
        fontFamily: '"Archivo Black", sans-serif',
        lineHeight: 1.8,
        mb: 3,
        letterSpacing: '-0.1rem'
      }}
    >
      Estamos ubicados en la provincia de Santa Fe, Argentina.
    </Typography>

    <Typography
      variant="h4"
      sx={{
        fontFamily: '"Archivo Black", sans-serif',
        lineHeight: 1.8,
        mb: 3,
        letterSpacing: '-0.1rem'
      }}
    >
      Por este medio mostramos nuestro catálogo disponible con sus precios y promociones. <br />
      Además, por <strong>TikTok</strong>, <strong>Instagram</strong> y <strong>WhatsApp</strong> podés consultar disponibilidad.
    </Typography>

    <Typography
      variant="h1"
      sx={{
        fontSize: { xs: '3rem'},
        fontFamily: '"Archivo Black", sans-serif',
        letterSpacing: { xs: '-0.45rem', md: '-0.3rem' },
        textTransform: 'uppercase',
        mb: 4,
      }}
    >
      Comprá con tranquilidad.
    </Typography>

    <Typography
      variant="h4"
      sx={{
        fontFamily: '"Archivo Black", sans-serif',
        lineHeight: 1.8,
        letterSpacing: '-0.1rem'
      }}
    >
      Ofrecemos seguridad, buena calidad y precio.
    </Typography>
  </Box>
);

export default AboutUsPage;