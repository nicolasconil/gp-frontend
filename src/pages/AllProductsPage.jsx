import { Box, Grid, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "../api/public.api.js";
import Feed from "../components/Feed.jsx";
import { useNavigate } from "react-router-dom";

const AllProductsPage = () => {
    const { data: productsData, isLoading, isError } = useQuery({
        queryKey: ['allProducts'],
        queryFn: getAllProducts,

        select: (res) => res?.data ?? res,

        staleTime: 1000 * 60, // 1 minuto
    });

    const products = Array.isArray(productsData) ? productsData : [];
    const navigate = useNavigate();

    if (isLoading) {
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
                    component="img"
                    src="/logo1.svg"
                    alt="Cargando..."
                    sx={{
                        width: 120,
                        height: 'auto',
                        opacity: 0.5,
                        animation: 'pulseOpacity 2s infinite ease-in-out',
                    }}
                />
                <Typography variant="h5" sx={{ mt: 2, fontFamily: '"Archivo Black", sans-serif', letterSpacing: '-0.1rem' }}>
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

    if (isError) {
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
                    component="img"
                    src="/logo1.svg"
                    alt="Error"
                    sx={{
                        width: 120,
                        height: 'auto',
                        opacity: 0.3,
                    }}
                />
                <Typography variant="h6" sx={{ mt: 2, fontFamily: '"Archivo Black", sans-serif', letterSpacing: '-0.1rem' }}>
                    Error cargando los productos.
                </Typography>
                <Button
                    variant="contained"
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
        <Box sx={{ p: 4 }}>
            <Box
                sx={{
                    display: 'flex',
                    px: 4,
                    py: 2,
                    position: 'relative',
                    mb: 6,
                    borderRadius: '5px',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Typography
                    sx={{
                        fontFamily: '"Archivo Black", sans-serif',
                        fontSize: { xs: '5rem', sm: '7rem', md: '9rem' },
                        letterSpacing: { xs: '-11.5px', sm: '-12px', md: '-19.5px' },
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        lineHeight: 1,
                        zIndex: 2,
                        position: 'relative',
                        mt: { xs: 3, md: 5 },
                        mb: { xs: 3, md: 5 },
                        cursor: 'pointer',
                        '&:hover': {
                            transform: 'scale(1.1)',
                            transition: 'transform 0.3s ease',
                        },
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: -5,
                            left: 0,
                            width: '100%',
                            height: '3px',
                            backgroundColor: 'black',
                        },
                    }}
                >
                    TODOS
                </Typography>
            </Box>
            <Grid container spacing={3}>
                {products.map(product => (
                    <Grid key={product._id} xs={12} sm={6} md={3}>
                        <Feed
                            products={[product]}
                            onClick={() => navigate(`/producto/${product._id}`, { state: { product } })}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default AllProductsPage;