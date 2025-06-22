import { useState, useRef, useEffect, use } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  InputBase,
  ClickAwayListener,
  useMediaQuery,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBagOutlined";
import AccountIcon from "@mui/icons-material/PersonOutlineOutlined";
import CloseIcon from "@mui/icons-material/Close";

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const isMobile = useMediaQuery('(max-width:900px)');
  const isXs = useMediaQuery('(max-width:600px)');
  const inputRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
 
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const products = [
    { _id: '1', name: 'Vans KNU Skool', imageUrl: 'https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2024/10/2/10042258_800.jpg' },
    { _id: '2', name: 'Vans Speed LS', imageUrl: 'https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2025/1/28/10537975_800.jpg' },
    { _id: '3', name: 'Vans KNU Skool', imageUrl: 'https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2025/1/28/10537126_800.jpg' },
    { _id: '5', name: 'Vans Hylane', imageUrl: 'https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2025/1/28/10537450_800.jpg' },
  ];

  const filteredResults = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderSearchResults = () => {
    if (searchTerm.length <= 0 || filteredResults.length === 0) return null;

    if (isMobile) {
      return (
        <Box
          sx={{
            width: '100%',
            maxWidth: '600px',
            mt: 2,
            maxHeight: '70vh',
            overflowY: 'auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 2,
            backgroundColor: 'white',
            zIndex: 10,
            pb: 2,
          }}
        >
          {filteredResults.map(product => (
            <Box
              key={product._id}
              sx={{ textAlign: 'center', cursor: 'pointer', '&:hover': { opacity: 0.85 }, px: 1 }}
            >
              <img src={product.imageUrl} alt={product.name} style={{ width: '100%', borderRadius: 8 }} />
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 'bold', mt: 1, color: 'black' }}>
                {product.name}
              </Typography>
            </Box>
          ))}
        </Box>
      );
    }

    return (
      <Box
        sx={{
          position: 'fixed',
          top: scrolled ? '81px' : '90px',
          left: 0,
          backgroundColor: 'white',
          display: 'flex',
          gap: 3,
          py: 3,
          px: 5,
          zIndex: 1200,
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': { height: 6 },
          '&::-webkit-scrollbar-thumb': { backgroundColor: '#ccc', borderRadius: 3 },
        }}
      >
        {filteredResults.map(product => (
          <Box
            key={product._id}
            sx={{
              flex: '0 0 auto',
              width: 220,
              textAlign: 'center',
              cursor: 'pointer',
              '&:hover': { opacity: 0.85 },
            }}
          >
            <img src={product.imageUrl} alt={product.name} style={{ width: '100%', borderRadius: 8 }} />
            <Typography
              sx={{
                fontSize: '1rem',
                fontWeight: 'bold',
                mt: 1,
                color: 'black',
                whiteSpace: 'normal',
              }}
            >
              {product.name}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <>
      <AppBar position="sticky" elevation={0} sx={{ backgroundColor: 'white', color: 'black', borderBottom: '1px solid #eee' }}>
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 1, md: 4 }, py: { xs: 0.5, md: 1 } }}>

          <Box
            sx={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              '&:after': {
                content: '""',
                position: 'absolute',
                bottom: '-2px', // Espaciado debajo de la barra
                left: '10%',
                width: '92%',
                height: '3px',
                backgroundColor: '#000',
              },
              '&:before': {
                content: '""',
                position: 'absolute',
                top: 4,
                right: '-2px', // Espaciado a la derecha de la barra
                width: '3px',
                height: '95%',
                backgroundColor: '#000',
              },

            }}
          >
            <img
              src="/logo.svg"
              alt="logo"
              style={{
                height: isXs ? '40px' : '50px',
                transition: 'height 0.3s ease-in-out',
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 'auto', mr: { sm: 1, md: 2 } }}>
            {!isMobile && (
              <ClickAwayListener onClickAway={() => setSearchTerm('')}>
                <Box sx={{ width: { sm: '240px', md: '300px', lg: '400px' }, position: 'relative', mr: { sm: 1, md: 4 } }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      width: '100%',
                      padding: '8px 16px',
                      backgroundColor: '#fff',
                      border: '2.5px solid black',
                      borderRadius: '3px',
                      position: 'relative',
                      transition: 'none',
                      '&:focus-within': {
                        borderColor: '#111',
                        boxShadow: 'none',
                      },
                      '&:after': {
                        content: '""',
                        position: 'absolute',
                        bottom: '-5px',
                        left: '0.5%',
                        width: '100%',
                        height: '5px',
                        backgroundColor: '#000',
                        borderRadius: '3px'
                      },
                      '&:before': {
                        content: '""',
                        position: 'absolute',
                        top: 2,
                        right: '-5px',
                        width: '5px',
                        height: '106%',
                        backgroundColor: '#000',
                        borderRadius: '3px'
                      },
                    }}
                  >
                    <SearchIcon sx={{ position: 'absolute', left: 14, color: '#111', fontSize: 20 }} />
                    <InputBase
                      fullWidth
                      placeholder="Buscar"
                      value={searchTerm}
                      inputRef={inputRef}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      sx={{ fontSize: '15px', pl: 4.5, pr: 4, height: 32 }}
                    />
                    {searchTerm.length > 0 && (
                      <IconButton onClick={() => setSearchTerm('')} sx={{ position: 'absolute', right: 5, p: '4px', color: '#111' }}>
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                  {renderSearchResults()}
                </Box>
              </ClickAwayListener>
            )}

            <IconButton sx={{ color: 'black' }}><AccountIcon /></IconButton>
            <IconButton sx={{ color: 'black' }}><ShoppingBagIcon /></IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {isMobile && (
        <Box sx={{ px: 2, py: 2, display: 'flex', backgroundColor: 'white', flexDirection: 'column', alignItems: 'center' }}>
          <ClickAwayListener onClickAway={() => setSearchTerm('')}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                maxWidth: '600px',
                padding: '8px 16px',
                backgroundColor: '#fff',
                border: '2.5px solid black',
                borderRadius: '3px',
                position: 'relative',
                transition: 'none', // Eliminamos la transición
                '&:focus-within': {
                  borderColor: '#111',
                  boxShadow: 'none', // Eliminamos el efecto de sombra
                },
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-5px', // Espaciado debajo de la barra
                  left: '0.5%',
                  width: '100%',
                  height: '5px',
                  backgroundColor: '#000',
                  borderRadius: '3px'
                },
                '&:before': {
                  content: '""',
                  position: 'absolute',
                  top: 2,
                  right: '-5px', // Espaciado a la derecha de la barra
                  width: '5px',
                  height: '106%',
                  backgroundColor: '#000',
                  borderRadius: '3px'
                },
              }}
            >
              <SearchIcon sx={{ position: 'absolute', left: 14, color: '#111', fontSize: 20 }} />
              <InputBase
                fullWidth
                placeholder="Buscar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ fontSize: '15px', pl: 4.5, pr: 4, height: 32 }}
              />
              {searchTerm.length > 0 && (
                <IconButton onClick={() => setSearchTerm('')} sx={{ position: 'absolute', right: 5, p: '4px', color: '#111' }}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          </ClickAwayListener>
          {renderSearchResults()}
        </Box>
      )}
    </>
  );
};

export default Header;
