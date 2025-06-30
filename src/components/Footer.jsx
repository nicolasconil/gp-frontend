import {
  Box,
  Typography,
  TextField,
  IconButton,
  Link,
  useMediaQuery,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const Footer = () => {
  const isBelow1550 = useMediaQuery('(max-width:1550px)');

  return (
    <>
      <Box sx={{ borderTop: '1px solid #e0e0e0', width: '100%', mt: '150px' }} />

      <Box
        component="footer"
        sx={{
          color: '#000',
          mx: -1,
          pt: 6,
          pb: 0,
          textAlign: 'center',
          mb: -2,
        }}
      >

        <Typography
          variant="body2"
          sx={{
            mt: -3,
            mb: 2,
            fontSize: '12px',
            color: 'grey.600',
            '& a': {
              color: 'inherit',
              fontWeight: 400,
              transition: 'color 0.2s, font-weight 0.2s',
              textDecoration: 'none',
            },
            '@media (hover: hover) and (pointer: fine)': {
              '& a:hover': {
                color: '#000',
                fontWeight: 600,
                textDecoration: 'underline',
              },
            },
          }}
        >
          © {new Date().getFullYear()},{' '}
          <Link href="/" underline="none">
            GP FOOTWEAR
          </Link>{' '}
          –&nbsp;
          <Link href="/refund-policy" underline="hover">REFUND POLICY</Link>&nbsp;–&nbsp;
          <Link href="/terms-of-service" underline="hover">TERMS OF SERVICE</Link>&nbsp;–&nbsp;
          <Link href="/shipping-policy" underline="hover">SHIPPING POLICY</Link>
        </Typography>

        <Typography
          variant="h5"
          sx={{
            mt: 8,
            mb: 2,
            fontWeight: 600,
            fontFamily: '"Archivo Black", sans-serif',
            letterSpacing: '-2.5px',
          }}
        >
          UNITE A NUESTRA FAMILIA
        </Typography>

        <Box
          component="form"
          sx={{
            width: { xs: '90%', sm: '400px' },
            mx: 'auto',
            mb: 3,
            position: 'relative',
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="EMAIL"
            InputProps={{
              sx: {
                borderRadius: 1,
                backgroundColor: 'white',
                border: '3px solid black',
                height: '45px',
                '& input': { py: '10px', pr: '40px', pl: '10px' },
                '&:hover': { backgroundColor: '#fff' },
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { border: '1px solid white' },
                '&:hover fieldset': { border: '1px solid white' },
                '&.Mui-focused fieldset': { border: '1px solid white' },
              },
            }}
          />

          <IconButton
            sx={{
              position: 'absolute',
              top: '50%',
              right: 6,
              transform: 'translateY(-50%)',
              p: 0.5,
              color: 'darkgrey',
            }}
          >
            <ArrowForwardIcon />
          </IconButton>

          <Box
            sx={{
              position: 'absolute',
              bottom: -3,
              left: 3.5,
              width: '100%',
              height: '4px',
              backgroundColor: 'black',
              borderRadius: '4px',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 2,
              right: -3,
              width: '4px',
              height: '99%',
              backgroundColor: 'black',
              borderRadius: '2px',
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 5 }}>
          <IconButton
            href="https://www.instagram.com/gp.footwear/"
            target="_blank"
            sx={{
              p: 0,
              width: 50,
              height: 60,
              backgroundColor: 'transparent',
              '&:hover': {
                backgroundColor: 'transparent',
              },
              '& img': {
                width: '100%',
                height: '100%',
                transition: 'transform 0.3s ease',
              },
              '@media (hover: hover) and (pointer: fine)': {
                '&:hover img': {
                  transform: 'scale(1.1)',
                },
              },
            }}
          >
            <Box component="img" src="/instagram.svg" alt="Instagram" />
          </IconButton>

          <IconButton
            href="https://www.tiktok.com/@gpfootwear"
            target="_blank"
            sx={{
              p: 0,
              width: 50,
              height: 33,
              mt: 1.52,
              backgroundColor: 'transparent',
              '&:hover': {
                backgroundColor: 'transparent',
              },
              '& img': {
                width: '100%',
                height: '100%',
                transition: 'transform 0.3s ease',
              },
              '@media (hover: hover) and (pointer: fine)': {
                '&:hover img': {
                  transform: 'scale(1.1)',
                },
              },
            }}
          >
            <Box component="img" src="/tiktok.svg" alt="TikTok" />
          </IconButton>
        </Box>

        <Box sx={{ width: '100%', overflow: 'hidden', px: 0, m: 0 }}>
          {isBelow1550 ? (
            <Box
              component="img"
              src="../public/logo1.svg"
              alt="GP Footwear"
              sx={{
                width: '100%',
                maxWidth: 60,
                mx: 'auto',
                mb: 4,
                opacity: 0.1,
              }}
            />
          ) : (
            <Typography
              sx={{
                fontFamily: '"Archivo Black", sans-serif',
                fontSize: '15rem',
                letterSpacing: '-35px',
                fontWeight: 900,
                textTransform: 'uppercase',
                lineHeight: 1,
                textAlign: 'center',
                whiteSpace: 'nowrap',
                width: '100%',
                ml: '-19.5px',
                mb: -4.5,
                mt: 2,
              }}
            >
              GP&nbsp;FOOTWEAR
            </Typography>
          )}
        </Box>
      </Box>
    </>
  );
};

export default Footer;
