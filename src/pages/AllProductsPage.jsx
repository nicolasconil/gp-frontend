import { Box, Grid, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "../api/public.api.js";
import Feed from "../components/Feed.jsx";
import { useNavigate } from "react-router-dom";

const AllProductsPage = () => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['allProducts'],
        queryFn: getAllProducts,
    });

    const products = data?.data || [];
    const navigate = useNavigate();
    
    if (isLoading) {
        return <Typography> Cargando todos los productos... </Typography>
    };

    if (isError) {
        return <Typography> Error al cargar los productos. </Typography>
    };

    return (
        <Box sx={{ p: 4 }}>
            <Typography sx={{ mb: 6, fontFamily: '"Archivo Black", sans-serif', fontSize: '2rem', letterSpacing: '-0.3rem', textDecoration: 'underline' }}>
                TODOS LOS PRODUCTOS
            </Typography>
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