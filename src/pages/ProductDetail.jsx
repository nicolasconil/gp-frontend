import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Button, Typography, Grid, useMediaQuery, useTheme, Container, IconButton } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useCart } from '../context/CartContext';
import { getAllProducts } from '../api/public.api.js';
import { ensureArray } from '../utils/array.js';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules/pagination';
import { A11y } from 'swiper/modules/a11y';
import { Keyboard } from 'swiper/modules/keyboard';
import 'swiper/css';
import 'swiper/css/pagination';

const baseURL = import.meta.env.VITE_BACKEND_URL;

export default function ProductDetail() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();

  const { product = {} } = location.state ?? {};
  const variations = product.variations || [];
  const isOutOfStock = product.stock === 0;
  const allSizes = Array.from({ length: 9 }, (_, i) => 36 + i);
  const allColors = [...new Set(variations.map((v) => v.color))];

  const [selectedColor, setSelectedColor] = useState(allColors[0] || null);
  const [selectedVariation, setSelectedVariation] = useState(null);

  useEffect(() => {
    const newProduct = location.state?.product || {};
    const newVariations = newProduct.variations || [];
    const newColors = [...new Set(newVariations.map((v) => v.color))];
    setSelectedColor(newColors[0] || null);
    setSelectedVariation(null);
  }, [location.state?.product]);

  const images = useMemo(() => {
    if (Array.isArray(product.images) && product.images.length) return product.images;
    if (product.image) return [product.image];
    const varImgs = variations.map((v) => v.image).filter(Boolean);
    if (varImgs.length) return Array.from(new Set(varImgs));
    return [];
  }, [product, variations]);

  const [mainIndex, setMainIndex] = useState(0);

  useEffect(() => {
    setMainIndex(0);
  }, [product._id]);

  const isSizeAvailable = (size) => {
    return variations.some((v) => v.color === selectedColor && v.size === size && v.stock > 0);
  };

  const getVariationForSize = (size) => {
    return variations.find((v) => v.color === selectedColor && v.size === size && v.stock > 0);
  };

  const getImageForColor = () => {
    const variationWithImage = variations.find((v) => v.color === selectedColor && v.image);
    return variationWithImage?.image || (product.image || 'https://via.placeholder.com/600x600?text=Producto+no+disponible');
  };

  const displayImage = useMemo(() => {
    if (images.length) {
      const img = images[mainIndex];
      return img && typeof img === 'string' && img.startsWith('/uploads') ? `${baseURL}${img}` : img;
    }
    const img = getImageForColor();
    return img && typeof img === 'string' && img.startsWith('/uploads') ? `${baseURL}${img}` : img;
  }, [images, mainIndex, selectedColor, product]);

  useEffect(() => {
    if (document.getElementById('product-detail-swiper-css')) return;
    const style = document.createElement('style');
    style.id = 'product-detail-swiper-css';
    style.innerHTML = `
      /* bullets */
      .custom-swiper-pagination { display:flex; gap:8px; justify-content:center; align-items:center; padding:12px 0 0 0; }
      .custom-bullet { width:10px; height:10px; opacity:0.55; transform:scale(1); border-radius:999px; background:#111; display:inline-block; transition:transform .22s ease, opacity .22s ease; }
      .custom-bullet.custom-bullet-active { transform:scale(1.5); opacity:1; }

      @media (max-width: 600px) {
        .custom-bullet { width:12px; height:12px; }
        .custom-bullet.custom-bullet-active { transform:scale(1.65); }
      }

      .product-detail-image { transition: transform .35s ease, opacity .28s ease; }
      .product-detail-image--anim { transform: translateY(-4px); }
      .swiper-container-wrap { background: transparent; }
    `;
    document.head.appendChild(style);
  }, []);

  const { data: productsData } = useQuery({
    queryKey: ['randomProducts'],
    queryFn: getAllProducts,
    select: (data) => {
      const items = ensureArray(data?.data).filter((p) => p._id !== product._id);
      return items.sort(() => 0.5 - Math.random()).slice(0, 3);
    },
  });

  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    if (!selectedVariation) return;
    addToCart(product, selectedVariation.size, selectedColor, 1);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Grid container spacing={6} alignItems="flex-start" justifyContent="center">
        <Grid
          xs={12}
          md={6}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            maxWidth: { md: 600 },
            mx: 'auto',
          }}
        >
          <Box
            role={`region`}
            aria-label={`Galería de imágenes del producto ${product.name || ''}`}
            sx={{ width: '100%', position: 'relative', display: 'flex', justifyContent: 'center' }}
            className="swiper-container-wrap"
          >
            <Swiper
              modules={[Pagination, A11y, Keyboard]}
              spaceBetween={8}
              slidesPerView={1}
              onSlideChange={(s) => setMainIndex(s.activeIndex % Math.max(images.length, 1))}
              loop={images.length > 1}
              pagination={{
                el: '.custom-swiper-pagination',
                clickable: true,
                bulletClass: 'custom-bullet',
                bulletActiveClass: 'custom-bullet-active',
              }}
              keyboard={{ enabled: true }}
              a11y={{
                enabled: true,
                prevSlideMessage: 'Imagen anterior',
                nextSlideMessage: 'Siguiente imagen',
                slideLabelMessage: 'Imagen {{index}} de {{slidesLength}}',
              }}
              style={{ width: '100%' }}
            >
              {images.length ? (
                images.map((img, idx) => {
                  const src = img?.startsWith?.('/uploads') ? `${baseURL}${img}` : img;
                  return (
                    <SwiperSlide key={idx} aria-label={`Imagen ${idx + 1} de ${images.length}`}>
                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                        <img
                          src={src}
                          alt={product.name ? `${product.name} - imagen ${idx + 1}` : `producto imagen ${idx + 1}`}
                          className={`product-detail-image ${idx === mainIndex ? 'product-detail-image--anim' : ''}`}
                          style={{
                            width: '100%',
                            height: isMobile ? 'auto' : 600,
                            maxHeight: isMobile ? '65vh' : 600,
                            objectFit: 'contain',
                            display: 'block',
                            userSelect: 'none',
                          }}
                          draggable={false}
                        />
                      </Box>
                    </SwiperSlide>
                  );
                })
              ) : (
                <SwiperSlide>
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                    <img
                      src={getImageForColor()}
                      alt={product.name || 'producto'}
                      className="product-detail-image product-detail-image--anim"
                      style={{ width: '100%', height: isMobile ? 'auto' : 600, maxHeight: isMobile ? '65vh' : 600, objectFit: 'contain', display: 'block' }}
                      draggable={false}
                    />
                  </Box>
                </SwiperSlide>
              )}

              <div className="custom-swiper-pagination" aria-hidden="false" role="tablist" style={{ width: '100%' }} />
            </Swiper>
          </Box>
        </Grid>

        <Grid
          xs={12}
          md={6}
          sx={{
            maxWidth: { md: 600 },
            mx: 'auto',
            textAlign: { xs: 'left', md: 'left' },
            pl: { xs: 0, md: 7 },
          }}
        >
          <Box sx={{ pt: { xs: 3, md: 7 }, pb: 4 }}>
            <Typography
              variant="h3"
              sx={{ fontFamily: '"Archivo Black", sans-serif', fontWeight: 900, mb: 2, textTransform: 'uppercase', letterSpacing: '-2px' }}
            >
              {product.name}
            </Typography>

            <Typography variant="h6" sx={{ fontFamily: '"Archivo Black", sans-serif', fontWeight: 600, color: '#555', mb: 2 }}>
              {product.description || 'Descripción no disponible'}
            </Typography>

            <Typography variant="h5" sx={{ fontFamily: '"Archivo Black", sans-serif', fontWeight: 'bold', mb: 3 }}>
              ${product.price?.toLocaleString('es-AR')}
            </Typography>

            <Typography variant="caption" sx={{ fontFamily: '"Archivo Black", sans-serif', fontWeight: 600, textTransform: 'uppercase', mb: 1, display: 'block' }}>
              Color:
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
              {allColors.map((color) => (
                <Button
                  key={color}
                  onClick={() => {
                    setSelectedColor(color);
                    setSelectedVariation(null);
                    if (!images.length) {
                      const variationForColor = variations.find(v => v.color === color && v.stock > 0) || null;
                      setSelectedVariation(variationForColor);
                    } else {
                      const idx = images.findIndex(img => {
                        if (typeof img !== 'string') return false;
                        return img.toLowerCase().includes(String(color).toLowerCase());
                      });
                      if (idx > -1) {
                        setMainIndex(idx);
                      } else {
                        setMainIndex(0);
                      }
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
                  <Box sx={{ position: 'absolute', bottom: -4, left: 4, width: '100%', height: '4px', backgroundColor: 'black', borderRadius: 4 }} />
                  <Box sx={{ position: 'absolute', top: 2, right: -4, width: '4px', height: { xs: '102%', md: '103%' }, backgroundColor: 'black', borderRadius: 1 }} />
                </Button>
              ))}
            </Box>

            <Typography variant="caption" sx={{ fontFamily: '"Archivo Black", sans-serif', fontWeight: 600, textTransform: 'uppercase', mb: 1, display: 'block' }}>
              Talles:
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(3, 1fr)', sm: 'repeat(5, 1fr)', md: 'repeat(3, 1fr)' }, gap: 1, mb: 3, justifyContent: { xs: 'center', md: 'flex-start' } }}>
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
                        backgroundColor: isSelected ? 'black' : available ? '#f0f0f0' : '#d1d1d1',
                      },
                    }}
                  >
                    {size}

                    <Box sx={{ position: 'absolute', bottom: -4, left: 4, width: '100%', height: '4px', backgroundColor: available ? 'black' : '#777', borderRadius: 4 }} />
                    <Box sx={{ position: 'absolute', top: 2, right: -4, width: '4px', height: { xs: '102%', md: '103%' }, backgroundColor: available ? 'black' : '#777', borderRadius: 1 }} />
                  </Button>
                );
              })}
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ position: 'relative' }}>
                <Button
                  variant="contained"
                  disabled={isOutOfStock || !variations.length}
                  startIcon={isOutOfStock || !variations.length ? null : <AddShoppingCartIcon />}
                  sx={{
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    fontSize: 16,
                    color: selectedVariation ? 'white' : isOutOfStock || !variations.length ? '#777' : 'black',
                    backgroundColor: selectedVariation ? 'black' : isOutOfStock || !variations.length ? '#d1d1d1' : 'white',
                    border: '3px solid',
                    borderColor: selectedVariation ? 'black' : isOutOfStock || !variations.length ? '#777' : 'black',
                    '&:hover': { backgroundColor: selectedVariation ? 'black' : isOutOfStock || !variations.length ? '#d1d1d1' : '#f0f0f0' },
                    position: 'relative',
                  }}
                  onClick={handleAddToCart}
                >
                  {isOutOfStock ? 'Agotado' : 'Agregar al carrito'}
                </Button>

                <Box sx={{ position: 'absolute', bottom: -5.5, left: 4, width: '100%', height: '4px', backgroundColor: selectedVariation ? 'black' : (isOutOfStock || !variations.length ? '#777' : 'black'), borderRadius: 4 }} />
                <Box sx={{ position: 'absolute', top: 2, right: -5.5, width: '4px', height: { xs: '108%', md: '109%' }, backgroundColor: selectedVariation ? 'black' : (isOutOfStock || !variations.length ? '#777' : 'black'), borderRadius: 1 }} />
              </Box>
            </Box>

            {images.length > 1 && (
              <Box sx={{ display: 'flex', gap: 1, mt: 3, flexWrap: 'wrap', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                {images.map((img, idx) => {
                  const src = img?.startsWith?.('/uploads') ? `${baseURL}${img}` : img;
                  return (
                    <Box
                      key={idx}
                      onClick={() => setMainIndex(idx)}
                      sx={{
                        cursor: 'pointer',
                        border: idx === mainIndex ? '3px solid black' : '2px solid #ddd',
                        borderRadius: 1,
                        overflow: 'hidden',
                        width: { xs: 64, sm: 80, md: 80 },
                        height: { xs: 64, sm: 80, md: 80 },
                      }}
                    >
                      <img src={src} alt={`thumb-${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </Box>
                  );
                })}
              </Box>
            )}
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
              ...(isMobile ? {} : { transform: 'scale(1.2)' }),
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
                onClick={() => navigate(`/producto/${item._id}`, { state: { product: item } })}
              >
                <Box sx={{ height: '70%', overflow: 'hidden' }}>
                  <img
                    src={
                      (Array.isArray(item.images) && item.images.length ? item.images[0] : item.image)?.startsWith?.('/uploads')
                        ? `${baseURL}${(Array.isArray(item.images) && item.images.length ? item.images[0] : item.image)}`
                        : (Array.isArray(item.images) && item.images.length ? item.images[0] : item.image) || 'https://via.placeholder.com/600x600?text=Producto+no+disponible'
                    }
                    alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>

                <Box sx={{ position: 'relative', border: '3px solid black', borderRadius: 1, mx: { xs: 6, sm: 1.5, md: 1.5 }, mb: 1, px: { xs: 0.5, md: 1 }, py: { xs: 0.2, md: 0.5 }, minHeight: 40, backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
}
