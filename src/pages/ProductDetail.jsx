import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Box, Button, Typography, Grid, useMediaQuery, useTheme, Container, CircularProgress } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useCart } from '../context/CartContext.jsx'
import { getAllProducts, getProductById } from '../api/public.api.js';
import { ensureArray } from '../utils/array.js';

const baseURL = import.meta.env.VITE_BACKEND_URL;
const PLACEHOLDER = '/logo.svg';

const ProductDetail = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const resolvedId = id || (() => {
    try {
      const parts = location.pathname.split('/').filter(Boolean);
      return parts.length ? parts[parts.length - 1] : undefined;
    } catch {
      return undefined;
    }
  })();

  const productFromState = location.state?.product || null;
  const [product, setProduct] = useState(productFromState || null);

  const normalizeResponseToProduct = (res) => {
    let candidate = null;
    try {
      if (res && typeof res === 'object') {
        if (res.data && res.data.data) {
          candidate = Array.isArray(res.data.data) ? res.data.data[0] : res.data.data;
        } else if (res.data && res.data.product) {
          candidate = res.data.product;
        } else if (res.data && (res.data._id || res.data.id || res.data.name || res.data.title)) {
          candidate = res.data;
        } else if (res._id || res.id) {
          candidate = res;
        } else if (Array.isArray(res.data)) {
          candidate = res.data.find(p => p._id === resolvedId || p.id === resolvedId) || res.data[0];
        }
      }
    } catch (e) {
      return e;
    }

    if (!candidate) {
      const maybe = res?.data ?? res;
      if (maybe && typeof maybe === 'object') {
        const values = Object.values(maybe).filter(v => v && typeof v === 'object');
        candidate = values.find(v => v._id === resolvedId || v.id === resolvedId) || values[0] || null;
      }
    }

    if (candidate && !candidate._id && candidate.id) {
      candidate._id = candidate.id;
    }

    return candidate;
  };

  const variations = product?.variations || [];
  const isOutOfStock = product?.stock === 0;
  const allSizes = Array.from({ length: 12 }, (_, i) => 34 + i);
  const allColors = [...new Set(variations.map(v => v.color))];

  const [selectedColor, setSelectedColor] = useState(allColors[0] || null);
  const [selectedVariation, setSelectedVariation] = useState(null);

  useEffect(() => {
    const newVariations = product?.variations || [];
    const newColors = [...new Set(newVariations.map(v => v.color))];
    setSelectedColor(newColors[0] || null);
    setSelectedVariation(null);
  }, [product]);

  const {
    isLoading: isFetchingProduct,
    isError: productFetchError,
  } = useQuery({
    queryKey: ['product', resolvedId],
    queryFn: () => getProductById(resolvedId),
    enabled: !productFromState && !!resolvedId,
    onSuccess: (res) => {
      const candidate = normalizeResponseToProduct(res);
      if (candidate) setProduct(candidate);
      else setProduct(null);
    },
    onError: (err) => {
      setProduct(null);
    },
  });

  useEffect(() => {
    if (product && (product._id || product.id)) return;
    if (!resolvedId) return;

    let mounted = true;
    (async () => {
      try {
        const res = await getProductById(resolvedId);
        const candidate = normalizeResponseToProduct(res);
        if (mounted) setProduct(candidate || null);
      } catch (err) {
        if (mounted) setProduct(null);
      }
    })();

    return () => { mounted = false; };
  }, [resolvedId]);

  useEffect(() => {
    if (productFromState) setProduct(productFromState);
  }, [productFromState]);

  const images = useMemo(() => {
    const imgs = product?.images || product?.photos || (product?.image ? [product.image] : []);
    if (Array.isArray(imgs) && imgs.length) return imgs;
    const varImgs = variations.map(v => v.image).filter(Boolean);
    if (varImgs.length) return Array.from(new Set(varImgs));
    return [];
  }, [product, variations]);

  const [mainIndex, setMainIndex] = useState(0);
  useEffect(() => setMainIndex(0), [product?._id]);

  const touchStartX = useRef(null);
  const touchDelta = useRef(0);

  const onTouchStart = (e) => {
    touchStartX.current = e.touches?.[0]?.clientX ?? null;
    touchDelta.current = 0;
  };
  const onTouchMove = (e) => {
    if (touchStartX.current == null) return;
    const x = e.touches?.[0]?.clientX ?? 0;
    touchDelta.current = x - touchStartX.current;
  };
  const onTouchEnd = () => {
    if (touchStartX.current == null) return;
    const dx = touchDelta.current;
    if (Math.abs(dx) > 50 && images.length > 1) {
      if (dx < 0) setMainIndex(i => (i + 1) % images.length);
      else setMainIndex(i => (i - 1 + images.length) % images.length);
    }
    touchStartX.current = null;
    touchDelta.current = 0;
  };

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight' && images.length > 1) setMainIndex(i => (i + 1) % images.length);
      if (e.key === 'ArrowLeft' && images.length > 1) setMainIndex(i => (i - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [images.length]);

  const displayImage = useMemo(() => {
    if (images.length) {
      const img = images[mainIndex];
      return img && typeof img === 'string' && img.startsWith('/uploads') ? `${baseURL}${img}` : img;
    }
    const variationWithImage = variations.find(v => v.color === selectedColor && v.image);
    const fallback = variationWithImage?.image || product?.image || PLACEHOLDER;
    return fallback && typeof fallback === 'string' && fallback.startsWith('/uploads') ? `${baseURL}${fallback}` : fallback;
  }, [images, mainIndex, selectedColor, product, variations]);

  const isSizeAvailable = (size) =>
    variations.some(v => v.color === selectedColor && v.size === size && v.stock > 0);

  const getVariationForSize = (size) =>
    variations.find(v => v.color === selectedColor && v.size === size && v.stock > 0);

  const { data: productsData } = useQuery({
    queryKey: ['randomProducts'],
    queryFn: getAllProducts,
    select: data => {
      const items = ensureArray(data?.data).filter(p => p._id !== product?._id);
      return items.sort(() => 0.5 - Math.random()).slice(0, 3);
    },
  });

  const { addToCart } = useCart();
  const handleAddToCart = () => {
    if (!selectedVariation) return;
    addToCart(product, selectedVariation.size, selectedColor, 1);
  };

  const handleImgError = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = PLACEHOLDER;
  };

  const displayName = product?.name || product?.title || product?.productName || product?.nombre || '';
  const displayDescription = product?.description || product?.desc || product?.detalle || '';
  const displayPrice = (() => {
    const p = product?.price ?? product?.precio ?? product?.amount;
    if (p == null) return '';
    const n = typeof p === 'number' ? p : Number(p) || 0;
    try { return n.toLocaleString('es-AR'); } catch { return String(n); }
  })();

  if (isFetchingProduct) {
    return (
      <Box sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        flexDirection: 'column'
      }}
      >
        <Box
          component='img'
          src='/logo1.svg'
          alt='Cargando...'
          sx={{
            width: 120,
            height: 'auto',
            opacity: 0.5,
            animation: 'pulseOpacity 2s infinite ease-in-out',
          }}
        />
        <Typography variant='h5' sx={{ mt: 2, fontFamily: '"Archivo Black", sans-serif', letterSpacing: '-0.1rem' }}>
          Cargando productos...
        </Typography>
        <style>
          {`
            @keyframes pulseOpacity {
              0% { opacity: 0.2; }
              50% { opacity: 1; }
              100% { opacity: 0.2; }
            }
          `}
        </style>
      </Box>
    );
  }

  if (productFetchError) {
    return (
      <Box sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        flexDirection: 'column',
        textAlign: 'center',
      }}
      >
        <Box
          component='img'
          src='/logo1.svg'
          alt='Error'
          sx={{
            width: 120,
            height: 'auto',
            opacity: 0.3,
          }}
        />
        <Typography variant='h6' sx={{ mt: 2, fontFamily: '"Archivo Black", sans-serif', letterSpacing: '-0.1rem' }}>
          Error cargando los productos.
        </Typography>
        <Button
          variant='contained'
          onClick={() => window.location.reload()}
          sx={{ mt: 2, fontFamily: '"Archivo Black", sans-serif', border: '3px solid black', borderRadius: '4px', backgroundColor: 'black', color: 'white' }}
        >
          Reintentar
          <Box
            sx={{
              position: 'absolute',
              bottom: -5,
              left: 6,
              width: '98%',
              height: '6px',
              backgroundColor: 'black',
              borderRadius: '2px',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 6,
              right: -5,
              width: '6px',
              height: { xs: '95%', md: '97%' },
              backgroundColor: 'black',
              borderRadius: '2px',
            }}
          />
        </Button>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Grid container spacing={6} alignItems="flex-start" justifyContent="center">
        <Grid xs={12} md={6} sx={{
          display: 'flex',
          justifyContent: 'center',
          maxWidth: { md: 600 },
          mx: 'auto'
        }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
              borderRadius: 2,
              maxWidth: { xs: '90%', md: 500 },
              minHeight: { md: 600 },
              ...(isMobile
                ? {}
                : {
                  '&:hover img': {
                    transform: 'scale(1.07)',
                    transition: 'transform 0.3s ease',
                  },
                }),
            }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            role="region"
            aria-label={`Galería de imágenes del producto ${displayName}`}
          >
            <img
              src={displayImage}
              alt={displayName}
              onError={handleImgError}
              style={{
                width: '100%',
                height: 'auto',
                objectFit: 'contain',
                display: 'block',
                transition: 'transform 0.3s ease',
              }}
            />
          </Box>
        </Grid>

        <Grid xs={12} md={6} sx={{
          maxWidth: { md: 600 },
          mx: 'auto',
          textAlign: { xs: 'left', md: 'left' },
          pl: { xs: 0, md: 7 }
        }}>
          <Box sx={{ pt: { xs: 3, md: 7 }, pb: 4 }}>
            <Typography
              variant="h3"
              sx={{ fontFamily: '"Archivo Black", sans-serif', fontWeight: 900, mb: 2, textTransform: 'uppercase', letterSpacing: '-2px' }}
            >
              {displayName}
            </Typography>

            <Typography variant="h6" sx={{ fontFamily: '"Archivo Black", sans-serif', fontWeight: 600, color: '#555', mb: 2 }}>
              {displayDescription || 'Descripción no disponible'}
            </Typography>

            <Typography variant="h5" sx={{ fontFamily: '"Archivo Black", sans-serif', fontWeight: 'bold', mb: 3 }}>
              ${displayPrice}
            </Typography>

            <Typography
              variant="caption"
              sx={{ fontFamily: '"Archivo Black", sans-serif', fontWeight: 600, textTransform: 'uppercase', mb: 1, display: 'block' }}
            >
              Color:
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
              {allColors.map(color => (
                <Button
                  key={color}
                  onClick={() => {
                    setSelectedColor(color);
                    setSelectedVariation(null);
                    if (images.length) {
                      const idx = images.findIndex(img => {
                        if (typeof img !== 'string') return false;
                        return img.toLowerCase().includes(String(color).toLowerCase());
                      });
                      if (idx > -1) setMainIndex(idx);
                      else setMainIndex(0);
                    }
                  }}
                  variant={selectedColor === color ? 'contained' : 'outlined'}
                  sx={{
                    fontFamily: '"Archivo Black", sans-serif',
                    fontSize: 13,
                    fontWeight: 400,
                    textTransform: 'uppercase',
                    px: 1,
                    py: 0.5,
                    minWidth: 'auto',
                    borderRadius: 1,
                    border: '2px solid black',
                    color: selectedColor === color ? 'white' : 'black',
                    backgroundColor: selectedColor === color ? 'black' : 'white',
                    '&:hover': { backgroundColor: selectedColor === color ? 'black' : '#f0f0f0' },
                    position: 'relative',
                  }}
                >
                  {color}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: -4,
                      left: 4,
                      width: '100%',
                      height: '4px',
                      backgroundColor: 'black',
                      borderRadius: 4,
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 2,
                      right: -4,
                      width: '4px',
                      height: { xs: '102%', md: '103%' },
                      backgroundColor: 'black',
                      borderRadius: 1,
                    }}
                  />
                </Button>
              ))}
            </Box>

            <Typography variant="caption" sx={{ fontFamily: '"Archivo Black", sans-serif', fontWeight: 600, textTransform: 'uppercase', mb: 1, display: 'block' }}>
              Talles:
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(3, 1fr)', sm: 'repeat(5, 1fr)', md: 'repeat(3, 1fr)' },
                gap: 1,
                mb: 3,
                justifyContent: { xs: 'center', md: 'flex-start' }
              }}
            >
              {allSizes.map((size) => {
                const available = isSizeAvailable(size);
                const isSelected = selectedVariation && selectedVariation.size === size;
                return (
                  <Button
                    key={size}
                    onClick={() => available && setSelectedVariation(getVariationForSize(size))}
                    variant="outlined"
                    sx={{
                      fontFamily: '"Archivo Black", sans-serif',
                      fontSize: 14,
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      px: 0.5,
                      py: 0.25,
                      minWidth: 'auto',
                      borderRadius: 1,
                      border: available ? '2px solid black' : '2px solid #777',
                      position: 'relative',
                      color: available ? (isSelected ? 'white' : 'black') : '#777',
                      backgroundColor: isSelected ? 'black' : available ? 'transparent' : '#f0f0f0',
                      textDecoration: available ? 'none' : 'line-through',
                      '&:hover': {
                        backgroundColor: isSelected
                          ? 'black'
                          : available
                            ? '#f0f0f0'
                            : '#d1d1d1',
                      },
                    }}
                  >
                    {size}
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: -4,
                        left: 4,
                        width: '100%',
                        height: '4px',
                        backgroundColor: available ? 'black' : '#777',
                        borderRadius: 4,
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 2,
                        right: -4,
                        width: '4px',
                        height: { xs: '102%', md: '103%' },
                        backgroundColor: available ? 'black' : '#777',
                        borderRadius: 1,
                      }}
                    />
                  </Button>
                );
              })}
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="contained"
                disabled={isOutOfStock || !variations.length}
                startIcon={isOutOfStock || !variations.length ? null : <AddShoppingCartIcon />}
                sx={{
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  fontSize: 16,
                  color: selectedVariation ? 'white' : isOutOfStock || !variations.length ? '#777' : 'black',
                  backgroundColor: selectedVariation
                    ? 'black'
                    : isOutOfStock || !variations.length
                      ? '#d1d1d1'
                      : 'white',
                  border: '3px solid',
                  borderColor: selectedVariation
                    ? 'black'
                    : isOutOfStock || !variations.length
                      ? '#777'
                      : 'black',
                  '&:hover': {
                    backgroundColor: selectedVariation
                      ? 'black'
                      : isOutOfStock || !variations.length
                        ? '#d1d1d1'
                        : '#f0f0f0',
                  },
                  position: 'relative',
                }}
                onClick={handleAddToCart}
              >
                {isOutOfStock ? 'Agotado' : 'Agregar al carrito'}

                <Box
                  sx={{
                    position: 'absolute',
                    bottom: -5.5,
                    left: 4,
                    width: '100%',
                    height: '4px',
                    backgroundColor: selectedVariation ? 'black' : (isOutOfStock || !variations.length ? '#777' : 'black'),
                    borderRadius: 4,
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 2,
                    right: -5.5,
                    width: '4px',
                    height: { xs: '108%', md: '109%' },
                    backgroundColor: selectedVariation ? 'black' : (isOutOfStock || !variations.length ? '#777' : 'black'),
                    borderRadius: 1,
                  }}
                />
              </Button>
            </Box>

            <Box
              sx={{
                display: 'flex',
                gap: 1,
                justifyContent: 'left',
                mt: 3,
                overflowX: 'auto',
                flexWrap: 'nowrap',
              }}
            >
              {images.map((img, idx) => {
                const src = img?.startsWith?.('/uploads') ? `${baseURL}${img}` : img || PLACEHOLDER;
                return (
                  <Box
                    key={idx}
                    onClick={() => setMainIndex(idx)}
                    sx={{
                      cursor: 'pointer',
                      border: '2px solid #ddd',
                      borderRadius: 1,
                      overflow: 'hidden',
                      width: { xs: 64, sm: 80, md: 80 },
                      height: { xs: 64, sm: 80, md: 80 },
                      position: 'relative',
                      flex: '0 0 auto',
                    }}
                  >
                    <img
                      src={src}
                      alt={`thumb-${idx}`}
                      onError={handleImgError}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ borderTop: '1px solid #e0e0e0', width: '100%', mt: 10 }}>
        <Typography
          align="center"
          sx={{
            cursor: 'default',
            fontFamily: '"Archivo Black", sans-serif',
            fontSize: { xs: '2.4rem', sm: '2rem', md: '4rem' },
            textTransform: 'uppercase',
            mb: 5,
            letterSpacing: { xs: '-1.5px', md: '-8.5px' },
            textDecoration: 'underline',
            mt: 10,
            color: '#e4ebe8',
            mx: 'auto',
            px: { xs: 2, sm: 0 },
            whiteSpace: { xs: 'normal', md: 'nowrap' },
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            transition: 'transform 0.4s ease',
            '&:hover': {
              ...(isMobile ? {} : {
                transform: 'scale(1.2)',
              }),
            },
          }}
        >
          Sugerencias
        </Typography>

        <Grid container spacing={12} sx={{ px: 0, justifyContent: 'center', pt: 5 }}>
          {productsData?.slice(0, 3).map((item) => (
            <Grid key={item._id} xs={12} sm={6} md={4} sx={{ width: 300, flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
              <Box
                sx={{
                  cursor: 'pointer',
                  position: 'relative',
                  height: 455,
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform .3s ease',
                  '&:hover': { transform: 'scale(1.05)' },
                }}
                onClick={() =>
                  navigate(`/producto/${item._id}`, { state: { product: item } })
                }
              >
                <Box sx={{ height: '70%', overflow: 'hidden' }}>
                  <img
                    src={
                      item.image?.startsWith('/uploads')
                        ? `${baseURL}${item.image}`
                        : item.image || PLACEHOLDER
                    }
                    alt={item.name}
                    onError={handleImgError}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>

                <Box
                  sx={{
                    position: 'relative',
                    border: '3px solid black',
                    borderRadius: 1,
                    mx: { xs: 6, sm: 1.5, md: 1.5 },
                    mb: 1,
                    px: { xs: 0.5, md: 1 },
                    py: { xs: 0.2, md: 0.5 },
                    minHeight: 40,
                    backgroundColor: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h6" sx={{ fontFamily: '"Archivo Black", sans-serif', fontWeight: 600, fontSize: { xs: '0.9rem', sm: '1rem', md: '1.2rem', textAlign: 'center' }, textTransform: 'uppercase' }}>
                    {item.name}
                  </Typography>

                  <Box sx={{ position: 'absolute', bottom: -6, left: 6, width: '100%', height: '4px', backgroundColor: 'black', borderRadius: '2px' }} />
                  <Box sx={{ position: 'absolute', top: 3.5, right: -6, width: '5px', height: '100%', backgroundColor: 'black', borderRadius: '2px' }} />
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default ProductDetail;
