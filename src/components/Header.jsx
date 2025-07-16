import { useState, useRef, useEffect } from "react";
import { AppBar, Toolbar, IconButton, Box, InputBase, ClickAwayListener, useMediaQuery, Card, CardMedia, CardContent, Tooltip, Typography, Badge } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";
import AdminPanelIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import Cart from "./Cart.jsx";
import { getAllProducts } from "../api/public.api.js";
import { useQuery } from "@tanstack/react-query";

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const isMobile = useMediaQuery('(max-width:1024px)');
  const isXs = useMediaQuery('(max-width:600px)');
  const inputRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);

  const { logout, isAuthenticated } = useAuth();
  const { getTotal } = useCart();
  const { totalQuantity } = getTotal();

  const baseURL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { data: productsData } = useQuery({
    queryKey: ['products'],
    queryFn: getAllProducts,
    select: (data) => data.data,
  });

  const filteredResults = productsData?.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const renderSearchResults = () => {
    if (searchTerm.length <= 0 || filteredResults.length === 0) return null;
    if (isMobile) {
      return (
        <Box
          sx={{
            width: '110%',
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
            px: 1,
            boxSizing: 'border-box',
            borderBottom: '1px solid #ccc',
            '&::-webkit-scrollbar': {
              width: 2,
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'white',
            },
          }}
        >
          {filteredResults.map((product) => (
            <Card
              key={product._id}
              sx={{
                border: '2px solid white',
                overflow: 'hidden',
                backgroundColor: 'white',
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                height: '100%',
                position: 'relative',
              }}
            >
              <CardMedia
                component="img"
                src={product.image?.startsWith('/uploads') ? `${baseURL}${product.image}` : product.image}
                alt={product.name}
                sx={{
                  height: 160,
                  objectFit: 'contain',
                  width: '100%',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              />
              <CardContent sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                <Box
                  sx={{
                    display: 'inline-block',
                    border: '2px solid black',
                    px: 1.5,
                    py: 1,
                    position: 'relative',
                    borderRadius: '4px',
                    width: '100%',
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: '"Archivo Black", sans-serif',
                      fontSize: '0.9rem',
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      textAlign: 'center',
                      lineHeight: 1.2,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      '&:hover': {
                        color: 'primary.main',
                      },
                    }}
                  >
                    {product.name}
                  </Typography>
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
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 2,
                      right: -4,
                      width: '4px',
                      height: '103%',
                      backgroundColor: 'black',
                      borderRadius: '2px',
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      );
    }

    return (
      <Box
        sx={{
          position: 'fixed',
          top: scrolled ? '81px' : '89px',
          left: 0,
          width: '100%',
          backgroundColor: 'white',
          py: 3,
          px: { xs: 2, sm: 4, md: 6 },
          zIndex: 1200,
          overflowY: 'hidden',
          overflowX: 'auto',
          display: 'flex',
          gap: 3,
          minHeight: '250px',
          boxSizing: 'border-box',
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': { height: 6 },
          '&::-webkit-scrollbar-thumb': { backgroundColor: 'black', borderRadius: 3 },
        }}
      >
        {filteredResults.map(product => (
          <Card
            key={product._id}
            sx={{
              border: '2px solid white',
              position: 'relative',
              overflow: 'hidden',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.3s ease',
              width: 220,
              minWidth: 220,
              backgroundColor: 'white',
              '&:hover': {
                transform: 'translateY(-4px)',
              },
            }}
          >
            <CardMedia
              component="img"
              src={product.image?.startsWith('/uploads') ? `${baseURL}${product.image}` : product.image}
              alt={product.name}
              sx={{
                width: '100%',
                height: 180,
                objectFit: 'contain',
                transition: 'transform 0.4s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            />
            <CardContent
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexGrow: 1,
                py: 2,
              }}
            >
              <Box
                sx={{
                  display: 'inline-block',
                  border: '2px solid black',
                  px: 1.5,
                  py: 1,
                  position: 'relative',
                  borderRadius: '4px',
                  width: '100%',
                }}
              >
                <Typography
                  sx={{
                    fontFamily: '"Archivo Black", sans-serif',
                    fontSize: '0.9rem',
                    letterSpacing: '-1px',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    textAlign: 'center',
                    lineHeight: 1.2,
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    cursor: 'pointer',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                >
                  {product.name}
                </Typography>

                <Box
                  sx={{
                    position: 'absolute',
                    bottom: -4,
                    left: 3,
                    width: '100%',
                    height: '4px',
                    backgroundColor: 'black',
                    borderRadius: '2px',
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 2,
                    right: -4,
                    width: '4px',
                    height: '103%',
                    backgroundColor: 'black',
                    borderRadius: '2px',
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  };

  return (
    <>
      <AppBar position="sticky" elevation={0} sx={{ backgroundColor: 'white', color: 'black', borderBottom: '1px solid #eee' }}>
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 1, md: 4 }, py: { xs: 0.5, md: 1 } }}>
          <Box
            component="a"
            href="/"
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
                bottom: '-2px',
                left: '10%',
                width: '92%',
                height: '3px',
                backgroundColor: '#000',
              },
              '&:before': {
                content: '""',
                position: 'absolute',
                top: 4,
                right: '-2px',
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
                      '&:focus-within': {
                        borderColor: '#111',
                        boxShadow: 'none',
                      },
                      '&:after': {
                        content: '""',
                        position: 'absolute',
                        bottom: '-5px',
                        left: '1%',
                        width: '100%',
                        height: '5px',
                        backgroundColor: '#000',
                        borderRadius: '3px',
                      },
                      '&:before': {
                        content: '""',
                        position: 'absolute',
                        top: 2,
                        right: '-5px',
                        width: '5px',
                        height: '105%',
                        backgroundColor: '#000',
                        borderRadius: '3px',
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

            {isAuthenticated ? (
              <>
                <Tooltip title="Panel administrativo">
                  <IconButton onClick={() => window.location.href = '/panel'} size="large" sx={{ color: 'black' }}>
                    <AdminPanelIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Cerrar sesión">
                  <IconButton onClick={logout} size="large" sx={{ color: 'black' }}>
                    <LogoutIcon />
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              <IconButton sx={{ color: 'black', backgroundColor: 'transparent', '&:hover': { backgroundColor: 'transparent' } }}>
                <Badge
                  badgeContent={totalQuantity}
                  color="default"
                >
                  <Cart />
                </Badge>
              </IconButton>
            )}
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
                '&:focus-within': {
                  borderColor: '#111',
                  boxShadow: 'none',
                },
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-5px',
                  left: '0.67%',
                  width: '100%',
                  height: '5px',
                  backgroundColor: '#000',
                  borderRadius: '3px',
                },
                '&:before': {
                  content: '""',
                  position: 'absolute',
                  top: 2,
                  right: '-5px',
                  width: '5px',
                  height: '106%',
                  backgroundColor: '#000',
                  borderRadius: '3px',
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
