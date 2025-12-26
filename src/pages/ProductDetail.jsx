import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import {
  Box,
  Button,
  Typography,
  Grid,
  useMediaQuery,
  useTheme,
  Container,
  Dialog,
  IconButton,
  Slider,
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useCart } from '../context/CartContext.jsx';
import { getAllProducts, getProductById } from '../api/public.api.js';
import { ensureArray } from '../utils/array.js';

const baseURL = import.meta.env.VITE_BACKEND_URL;
const PLACEHOLDER = '/logo.svg';

const genderLabel = (g) => {
  if (!g) return null;
  const map = {
    hombre: 'Hombre',
    mujer: 'Mujer',
    niños: 'Niños',
    ninos: 'Niños',
    unisex: 'Unisex'
  };
  return map[String(g).toLowerCase()] || String(g);
};

const MAX_SCALE = 2.0;
const MIN_SCALE = 1.0;

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

  const defaultNumericSizes = Array.from({ length: 12 }, (_, i) => 34 + i);

  const sizeOptions = useMemo(() => {
    const cat = String(product?.category || '').toLowerCase();
    if (cat === 'indumentaria') {
      return ['S', 'M', 'L', 'XL', 'XXL'];
    }
    const numericSizes = Array.from(new Set(
      (variations || [])
        .map(v => {
          const parsed = Number(v.size);
          return Number.isFinite(parsed) ? parsed : null;
        })
        .filter(Boolean)
    )).sort((a, b) => a - b);

    return numericSizes.length ? numericSizes : defaultNumericSizes;
  }, [product?.category, variations]);

  const allColors = useMemo(() => [...new Set((variations || []).map(v => v.color).filter(Boolean))], [variations]);

  const [selectedColor, setSelectedColor] = useState(allColors[0] || null);
  const [selectedVariation, setSelectedVariation] = useState(null);

  useEffect(() => {
    const newVariations = product?.variations || [];
    const newColors = [...new Set(newVariations.map(v => v.color).filter(Boolean))];
    const firstColor = newColors[0] || null;
    setSelectedColor(firstColor);

    if (firstColor) {
      const firstAvailable = newVariations.find(v => v.color === firstColor && v.stock > 0) || null;
      setSelectedVariation(firstAvailable);
    } else {
      setSelectedVariation(null);
    }
  }, [product]);

  const {
    data: fetchedProduct,
    isLoading: isFetchingProduct,
    isError: productFetchError,
  } = useQuery({
    queryKey: ['product', resolvedId],
    queryFn: () => getProductById(resolvedId),
    enabled: !!resolvedId,
    staleTime: 0,
  });

  useEffect(() => {
    if (fetchedProduct) {
      const candidate = normalizeResponseToProduct(fetchedProduct);
      setProduct(candidate || null);
    }
  }, [fetchedProduct]);

  useEffect(() => {
    if (productFromState && (productFromState._id === resolvedId || productFromState.id === resolvedId)) {
      setProduct(productFromState);
      return;
    }
    if (product && !(product._id === resolvedId || product.id === resolvedId)) {
      setProduct(null);
    }
  }, [productFromState, resolvedId]);

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

  useEffect(() => {
    if (!selectedColor) {
      setSelectedVariation(null);
      return;
    }
    const firstAvailable = variations.find(v => v.color === selectedColor && v.stock > 0) || null;
    setSelectedVariation(firstAvailable);
  }, [selectedColor, variations]);

  const displayImage = useMemo(() => {
    if (images.length) {
      const img = images[mainIndex];
      return img && typeof img === 'string' && img.startsWith('/uploads') ? `${baseURL}${img}` : img;
    }
    const variationWithImage = variations.find(v => v.color === selectedColor && v.image);
    const fallback = variationWithImage?.image || product?.image || PLACEHOLDER;
    return fallback && typeof fallback === 'string' && fallback.startsWith('/uploads') ? `${baseURL}${fallback}` : fallback;
  }, [images, mainIndex, selectedColor, product, variations]);

  const sizeEquals = (a, b) => String(a).toLowerCase() === String(b).toLowerCase();

  const isSizeAvailable = (size) =>
    variations.some(v => v.color === selectedColor && sizeEquals(v.size, size) && v.stock > 0);

  const getVariationForSize = (size) =>
    variations.find(v => v.color === selectedColor && sizeEquals(v.size, size) && v.stock > 0);

  const { data: productsData } = useQuery({
    queryKey: ['randomProducts', product?.gender],
    queryFn: () => getAllProducts({ gender: product?.gender }),
    enabled: !!product,
    select: data => {
      const items = ensureArray(data?.data).filter(p => p._id !== product?._id);
      if (product?.gender) {
        const sameGender = items.filter(p => String(p.gender).toLowerCase() === String(product.gender).toLowerCase());
        if (sameGender.length >= 3) return sameGender.sort(() => 0.5 - Math.random()).slice(0, 3);
        const others = items.filter(p => String(p.gender).toLowerCase() !== String(product.gender).toLowerCase());
        return [...sameGender, ...others].slice(0, 3);
      }
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

  const [zoomOpen, setZoomOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const isPanningRef = useRef(false);
  const panStartRef = useRef({ x: 0, y: 0 });
  const translateStartRef = useRef({ x: 0, y: 0 });

  const pinchStartDistanceRef = useRef(null);
  const pinchStartScaleRef = useRef(1);
  const pinchStartMidpointRef = useRef({ x: 0, y: 0 });
  const pinchStartTranslateRef = useRef({ x: 0, y: 0 });

  const containerRef = useRef(null);
  const imgRef = useRef(null);

  const openZoom = () => {
    setZoomOpen(true);
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  };
  const closeZoom = () => {
    setZoomOpen(false);
    setScale(1);
    setTranslate({ x: 0, y: 0 });
    pinchStartDistanceRef.current = null;
    pinchStartScaleRef.current = 1;
    pinchStartMidpointRef.current = { x: 0, y: 0 };
    pinchStartTranslateRef.current = { x: 0, y: 0 };
  };

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  const clampTranslate = useCallback((tx, ty, currentScale = scale) => {
    const container = containerRef.current;
    const img = imgRef.current;
    if (!container || !img) return { x: tx, y: ty };

    const containerRect = container.getBoundingClientRect();
    const imgRect = img.getBoundingClientRect();

    const prevScale = scale || 1;
    const baseW = imgRect.width / prevScale;
    const baseH = imgRect.height / prevScale;

    const effW = baseW * currentScale;
    const effH = baseH * currentScale;

    const maxX = Math.max(0, (effW - containerRect.width) / 2);
    const maxY = Math.max(0, (effH - containerRect.height) / 2);

    const clampedX = clamp(tx, -maxX, maxX);
    const clampedY = clamp(ty, -maxY, maxY);
    return { x: clampedX, y: clampedY };
  }, [scale]);

  const handleWheel = (e) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.08 : 1 / 1.08;
    setScale(prev => {
      const next = clamp(prev * factor, MIN_SCALE, MAX_SCALE);
      setTranslate(t => clampTranslate(t.x, t.y, next));
      return next;
    });
  };

  const handleZoomIn = () => {
    setScale(prev => {
      const next = clamp(prev + 0.15, MIN_SCALE, MAX_SCALE);
      setTranslate(t => clampTranslate(t.x, t.y, next));
      return next;
    });
  };
  const handleZoomOut = () => {
    setScale(prev => {
      const next = clamp(prev - 0.15, MIN_SCALE, MAX_SCALE);
      setTranslate(t => clampTranslate(t.x, t.y, next));
      return next;
    });
  };
  const handleResetZoom = () => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  };

  const onMouseDownZoom = (e) => {
    if (scale <= 1) return;
    e.preventDefault();
    isPanningRef.current = true;
    panStartRef.current = { x: e.clientX, y: e.clientY };
    translateStartRef.current = { ...translate };
  };
  const onMouseMoveZoom = (e) => {
    if (!isPanningRef.current) return;
    e.preventDefault();
    const dx = e.clientX - panStartRef.current.x;
    const dy = e.clientY - panStartRef.current.y;
    const candidate = {
      x: translateStartRef.current.x + dx,
      y: translateStartRef.current.y + dy,
    };
    setTranslate(prev => {
      const clamped = clampTranslate(candidate.x, candidate.y, scale);
      return clamped;
    });
  };
  const onMouseUpZoom = () => {
    if (!isPanningRef.current) return;
    isPanningRef.current = false;
  };

  const getDistance = (t1, t2) => {
    const dx = t2.clientX - t1.clientX;
    const dy = t2.clientY - t1.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getMidpoint = (t1, t2, containerRect) => {
    const mx = (t1.clientX + t2.clientX) / 2;
    const my = (t1.clientY + t2.clientY) / 2;
    return {
      x: mx - (containerRect.left + containerRect.width / 2),
      y: my - (containerRect.top + containerRect.height / 2),
    };
  };

  const onTouchStartZoom = (e) => {
    e.preventDefault?.();
    if (e.touches.length === 1 && scale > 1) {
      const t = e.touches[0];
      isPanningRef.current = true;
      panStartRef.current = { x: t.clientX, y: t.clientY };
      translateStartRef.current = { ...translate };
    } else if (e.touches.length === 2) {
      const container = containerRef.current;
      const containerRect = container ? container.getBoundingClientRect() : { left: 0, top: 0, width: 0, height: 0 };
      pinchStartDistanceRef.current = getDistance(e.touches[0], e.touches[1]);
      pinchStartScaleRef.current = scale || 1;
      pinchStartTranslateRef.current = { ...translate };
      pinchStartMidpointRef.current = getMidpoint(e.touches[0], e.touches[1], containerRect);
    }
  };

  const onTouchMoveZoom = (e) => {
    e.preventDefault?.();
    if (e.touches.length === 1 && isPanningRef.current && scale > 1) {
      const t = e.touches[0];
      const dx = t.clientX - panStartRef.current.x;
      const dy = t.clientY - panStartRef.current.y;
      const candidate = {
        x: translateStartRef.current.x + dx,
        y: translateStartRef.current.y + dy,
      };
      setTranslate(prev => {
        const clamped = clampTranslate(candidate.x, candidate.y, scale);
        return clamped;
      });
    } else if (e.touches.length === 2 && pinchStartDistanceRef.current) {
      const dist = getDistance(e.touches[0], e.touches[1]);
      const newScale = clamp(pinchStartScaleRef.current * (dist / pinchStartDistanceRef.current), MIN_SCALE, MAX_SCALE);

      const k = newScale / (pinchStartScaleRef.current || 1);
      const P = pinchStartMidpointRef.current || { x: 0, y: 0 }; 
      const T0 = pinchStartTranslateRef.current || { x: 0, y: 0 };
      const candidate = {
        x: T0.x + (1 - k) * (P.x - T0.x),
        y: T0.y + (1 - k) * (P.y - T0.y),
      };
      const clamped = clampTranslate(candidate.x, candidate.y, newScale);
      setScale(newScale);
      setTranslate(clamped);
    }
  };

  const onTouchEndZoom = (e) => {
    if (e.touches.length === 0) {
      isPanningRef.current = false;
      pinchStartDistanceRef.current = null;
      pinchStartScaleRef.current = scale;
      pinchStartMidpointRef.current = { x: 0, y: 0 };
      pinchStartTranslateRef.current = { x: 0, y: 0 };
    } else if (e.touches.length === 1) {
      isPanningRef.current = false;
      pinchStartDistanceRef.current = null;
      pinchStartScaleRef.current = scale;
    }
  };

  const preventImgDrag = (e) => e.preventDefault();

  const onDoubleClick = (e) => {
    const container = containerRef.current;
    const containerRect = container ? container.getBoundingClientRect() : null;
    const clientX = e?.clientX ?? (containerRect ? containerRect.left + containerRect.width / 2 : 0);
    const clientY = e?.clientY ?? (containerRect ? containerRect.top + containerRect.height / 2 : 0);

    const P = containerRect ? {
      x: clientX - (containerRect.left + containerRect.width / 2),
      y: clientY - (containerRect.top + containerRect.height / 2),
    } : { x: 0, y: 0 };

    if (Math.abs(scale - 1) < 0.05) {
      const newScale = Math.min(1.5, MAX_SCALE);
      const k = newScale / (scale || 1);
      const T0 = { ...translate };
      const target = {
        x: T0.x + (1 - k) * (P.x - T0.x),
        y: T0.y + (1 - k) * (P.y - T0.y),
      };
      const clamped = clampTranslate(target.x, target.y, newScale);
      setScale(newScale);
      setTranslate(clamped);
    } else {
      handleResetZoom();
    }
  };

  useEffect(() => {
    setTranslate(prev => clampTranslate(prev.x, prev.y, scale));
  }, [scale]);

  const sliderValue = Math.round(((scale - 1) / (MAX_SCALE - 1)) * 100);

  const onSliderChange = (e, v) => {
    const newScale = clamp(1 + (v / 100) * (MAX_SCALE - 1), MIN_SCALE, MAX_SCALE);
    setScale(newScale);
    setTranslate(t => clampTranslate(t.x, t.y, newScale));
  };

  useEffect(() => {
    if (zoomOpen) {
      const prev = { overflow: document.body.style.overflow };
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev.overflow || '';
      };
    }
    return undefined;
  }, [zoomOpen]);

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
              bottom: -5.5,
              left: 4,
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
              cursor: 'zoom-in',
              ...(isMobile
                ? {}
                : {
                  '&:hover img': {
                    transform: 'scale(1.03)',
                    transition: 'transform 0.2s ease',
                  },
                }),
            }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            role="region"
            aria-label={`Galería de imágenes del producto ${displayName}`}
            onClick={(e) => { e.preventDefault(); openZoom(); }}
          >
            <img
              src={displayImage}
              alt={displayName}
              onError={handleImgError}
              onDragStart={preventImgDrag}
              style={{
                width: '100%',
                height: 'auto',
                objectFit: 'contain',
                display: 'block',
                transition: 'transform 0.2s ease',
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Typography
                variant="h3"
                sx={{ fontFamily: '"Archivo Black", sans-serif', fontWeight: 900, fontSize: 'clamp(2.5rem, 3.75vw, 4.2rem)', mb: 0, textTransform: 'uppercase', letterSpacing: '-2px' }}
              >
                {displayName}
              </Typography>
            </Box>

            {product?.gender && (
              <Box sx={{ mt: 1, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  component="span"
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: '"Archivo Black", sans-serif',
                    fontSize: 14,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    px: 0.75,
                    py: 0.35,
                    minWidth: 'auto',
                    borderRadius: 1,
                    border: '2px solid black',
                    position: 'relative',
                    color: 'black',
                    backgroundColor: 'white',
                    lineHeight: 1,
                    userSelect: 'none',
                  }}
                >
                  {genderLabel(product.gender)}

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
                </Box>
              </Box>
            )}

            <Typography variant="h6" sx={{ fontFamily: '"Archivo Black", sans-serif', fontWeight: 600, fontSize: 'clamp(0.7rem, 1.2vw, 1rem)', color: '#555', mb: 2, mt: 2, whiteSpace: 'pre-line', lineHeight: 1.4 }}>
              {displayDescription || 'Descripción no disponible'}
            </Typography>

            <Typography variant="h5" sx={{ fontFamily: '"Archivo Black", sans-serif', fontWeight: 'bold', fontSize: 'clamp(1.5rem, 2vw, 2.5rem)', mb: 3 }}>
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
              {sizeOptions.map((size) => {
                const available = isSizeAvailable(size);
                const isSelected = selectedVariation && sizeEquals(selectedVariation.size, size);
                return (
                  <Button
                    key={String(size)}
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
                  position: 'relative',
                }}
                onClick={handleAddToCart}
              >
                {isOutOfStock ? 'Agotado' : 'Agregar al carrito'}

                <Box
                  sx={{
                    position: 'absolute',
                    bottom: -5.7,
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

            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'left', mt: 3, overflowX: 'auto', flexWrap: 'nowrap' }}>
              {images.map((img, idx) => {
                const src = img?.startsWith?.('/uploads') ? `${baseURL}${img}` : img || PLACEHOLDER;
                return (
                  <Box key={idx} onClick={() => setMainIndex(idx)} sx={{
                    cursor: 'pointer',
                    border: '2px solid #f1f1f1ff',
                    borderRadius: 1,
                    overflow: 'hidden',
                    width: { xs: 64, sm: 80, md: 80 },
                    height: { xs: 64, sm: 80, md: 80 },
                    position: 'relative',
                    flex: '0 0 auto',
                  }}>
                    <img src={src} alt={`thumb-${idx}`} onError={handleImgError} style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
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
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
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

                  <Box sx={{ position: 'absolute', bottom: -5.5, left: 6, width: '100%', height: '4px', backgroundColor: 'black', borderRadius: '2px' }} />
                  <Box sx={{ position: 'absolute', top: 3.5, right: -6, width: '5px', height: '100%', backgroundColor: 'black', borderRadius: '2px' }} />
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Dialog
        open={zoomOpen}
        onClose={closeZoom}
        fullScreen
        PaperProps={{ sx: { backgroundColor: 'rgba(0,0,0,0.95)', overflow: 'hidden' } }}
      >
        <Box
          ref={containerRef}
          sx={{
            position: 'relative',
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            p: 2,
            touchAction: 'none',
            overscrollBehavior: 'none',
          }}
          onWheel={handleWheel}
          onMouseDown={onMouseDownZoom}
          onMouseMove={onMouseMoveZoom}
          onMouseUp={onMouseUpZoom}
          onMouseLeave={onMouseUpZoom}
          onTouchStart={onTouchStartZoom}
          onTouchMove={onTouchMoveZoom}
          onTouchEnd={onTouchEndZoom}
        >
          <IconButton
            onClick={closeZoom}
            size={isMobile ? 'large' : 'medium'}
            sx={{
              position: 'fixed',
              top: { xs: 'env(safe-area-inset-top, 10px)', sm: 16 },
              right: { xs: 'env(safe-area-inset-right, 12px)', sm: 16, md: 24, lg: 32 },
              color: 'white',
              zIndex: 1400,
              bgcolor: 'rgba(255,255,255,0.04)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' },
              borderRadius: 1,
              border: '1px solid rgba(255,255,255,0.06)',
            }}
            aria-label="Cerrar"
          >
            <CloseIcon />
          </IconButton>

          {!isMobile && (
            <Box sx={{
              position: 'absolute',
              bottom: 24,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 20,
              width: { xs: '85%', md: '40%' },
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}>
              <Typography sx={{ color: 'white', fontSize: 12 }}>{Math.round(((scale - 1) / (MAX_SCALE - 1)) * 100)}%</Typography>
              <Slider
                value={sliderValue}
                onChange={onSliderChange}
                sx={{ color: 'white' }}
              />
            </Box>
          )}

          <Box sx={{
            maxWidth: '100%',
            maxHeight: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            width: '100%',
            height: '100%',
          }}>
            <img
              ref={imgRef}
              src={displayImage || PLACEHOLDER}
              alt={displayName}
              onError={handleImgError}
              onDragStart={preventImgDrag}
              onDoubleClick={onDoubleClick}
              style={{
                transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
                transformOrigin: 'center center',
                transition: isPanningRef.current ? 'none' : 'transform 0.08s linear',
                maxWidth: '90%',
                maxHeight: '85%',
                width: 'auto',
                height: 'auto',
                userSelect: 'none',
                touchAction: 'none',
                cursor: scale > 1 ? (isPanningRef.current ? 'grabbing' : 'grab') : 'zoom-out',
                display: 'block',
                objectFit: 'contain',
              }}
            />
          </Box>
        </Box>
      </Dialog>
    </Container>
  );
};

export default ProductDetail;
