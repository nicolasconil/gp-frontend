import { Box, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const AboutUsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      component="main"
      sx={{
        px: { xs: 2, sm: 4 },
        py: { xs: 4, sm: 8 },
        maxWidth: 960,
        mx: "auto",
        textAlign: "center",
      }}
    >
      <Typography
        component="h1"
        sx={{
          fontSize: { xs: "2.4rem", sm: "3.6rem", md: "4rem" },
          fontFamily: '"Archivo Black", sans-serif',
          letterSpacing: { xs: "-0.35rem", sm: "-0.4rem", md: "-0.45rem" },
          textTransform: "uppercase",
          mb: { xs: 2, sm: 4 },
          lineHeight: 1,
          textDecoration: "underline",
        }}
      >
        Nosotros
      </Typography>

      <Box sx={{ maxWidth: 800, mx: "auto" }}>
        <Typography
          variant="body1"
          sx={{
            fontFamily: '"Archivo Black", sans-serif',
            fontSize: { xs: "0.95rem", sm: "1.05rem", md: "1.15rem" },
            lineHeight: { xs: 1.5, sm: 1.7 },
            mb: { xs: 1.5, sm: 3 },
            letterSpacing: "-0.06rem",
            textAlign: "center",
          }}
        >
          Somos una tienda online de <strong>calzado</strong>, <strong>indumentaria</strong> y{" "}
          <strong>accesorios</strong>, tanto <strong>mayorista</strong> como{" "}
          <strong>minorista</strong>.
        </Typography>

        <Typography
          variant="body1"
          sx={{
            fontFamily: '"Archivo Black", sans-serif',
            fontSize: { xs: "0.95rem", sm: "1.05rem", md: "1.15rem" },
            lineHeight: { xs: 1.5, sm: 1.7 },
            mb: { xs: 1.5, sm: 3 },
            letterSpacing: "-0.06rem",
            textAlign: "center",
          }}
        >
          Estamos ubicados en la provincia de Santa Fe, Argentina.
        </Typography>

        <Typography
          variant="body1"
          sx={{
            fontFamily: '"Archivo Black", sans-serif',
            fontSize: { xs: "0.95rem", sm: "1.05rem", md: "1.15rem" },
            lineHeight: { xs: 1.5, sm: 1.7 },
            mb: { xs: 1.5, sm: 3 },
            letterSpacing: "-0.06rem",
            textAlign: "center",
          }}
        >
          Por este medio mostramos nuestro catálogo disponible con sus precios y promociones.
          <br />
          Además, por <strong>TikTok</strong>, <strong>Instagram</strong> y{" "}
          <strong>WhatsApp</strong> podés consultar disponibilidad.
        </Typography>
      </Box>

      <Typography
        component="h2"
        sx={{
          fontSize: { xs: "1.8rem", sm: "2.4rem", md: "3rem" },
          fontFamily: '"Archivo Black", sans-serif',
          letterSpacing: { xs: "-0.3rem", md: "-0.35rem" },
          textTransform: "uppercase",
          mb: { xs: 2, sm: 4 },
          mt: { xs: 2, sm: 4 },
          lineHeight: 1,
        }}
      >
        Comprá con tranquilidad.
      </Typography>

      <Typography
        variant="body1"
        sx={{
          fontFamily: '"Archivo Black", sans-serif',
          fontSize: { xs: "0.95rem", sm: "1.05rem", md: "1.15rem" },
          lineHeight: { xs: 1.5, sm: 1.7 },
          letterSpacing: "-0.06rem",
          mb: { xs: 0, sm: 2 },
          textAlign: "center",
        }}
      >
        Ofrecemos seguridad, buena calidad y precio.
      </Typography>
    </Box>
  );
};

export default AboutUsPage;
