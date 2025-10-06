import { Box, Typography } from "@mui/material";

const AboutUsPage = () => (
  <Box
    sx={{
      px: { xs: 2, sm: 4 },
      py: { xs: 3, sm: 6 },
      maxWidth: 1280,
      mx: "auto",
      textAlign: "center",
    }}
  >
    <Typography
      variant="h1"
      gutterBottom
      sx={{
        fontSize: { xs: "3rem", sm: "4rem" },
        fontFamily: '"Archivo Black", sans-serif',
        letterSpacing: { xs: "-0.35rem", sm: "-0.45rem" },
        textTransform: "uppercase",
        mb: { xs: 3, sm: 4 },
        textDecoration: "underline",
      }}
    >
      Nosotros
    </Typography>

    <Typography
      variant="h5"
      sx={{
        fontFamily: '"Archivo Black", sans-serif',
        lineHeight: 1.7,
        mb: 3,
        letterSpacing: "-0.05rem",
      }}
    >
      Somos una tienda online de <strong>calzado</strong>, <strong>indumentaria</strong> y{" "}
      <strong>accesorios</strong>, tanto <strong>mayorista</strong> como{" "}
      <strong>minorista</strong>.
    </Typography>

    <Typography
      variant="h5"
      sx={{
        fontFamily: '"Archivo Black", sans-serif',
        lineHeight: 1.7,
        mb: 3,
        letterSpacing: "-0.05rem",
      }}
    >
      Estamos ubicados en la provincia de Santa Fe, Argentina.
    </Typography>

    <Typography
      variant="h5"
      sx={{
        fontFamily: '"Archivo Black", sans-serif',
        lineHeight: 1.7,
        mb: { xs: 4, sm: 6 },
        letterSpacing: "-0.05rem",
      }}
    >
      Por este medio mostramos nuestro catálogo disponible con sus precios y promociones.
      <br />
      Además, por <strong>TikTok</strong>, <strong>Instagram</strong> y{" "}
      <strong>WhatsApp</strong> podés consultar disponibilidad.
    </Typography>

    <Typography
      variant="h1"
      gutterBottom
      sx={{
        fontSize: { xs: "3rem", sm: "4rem" },
        fontFamily: '"Archivo Black", sans-serif',
        letterSpacing: { xs: "-0.35rem", sm: "-0.45rem" },
        textTransform: "uppercase",
        mb: { xs: 3, sm: 4 },
        mt: { xs: 2, sm: 4 },
        textDecoration: "underline",
      }}
    >
      Comprá con tranquilidad
    </Typography>

    <Typography
      variant="h5"
      sx={{
        fontFamily: '"Archivo Black", sans-serif',
        lineHeight: 1.7,
        letterSpacing: "-0.05rem",
        mb: { xs: 0, sm: 2 },
      }}
    >
      Ofrecemos seguridad, buena calidad y precio.
    </Typography>
  </Box>
);

export default AboutUsPage;
