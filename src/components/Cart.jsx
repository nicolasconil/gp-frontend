import { useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import { Box, Button, Typography, CardMedia, Drawer, IconButton, List, ListItem, ListItemText, Snackbar, Alert, CircularProgress, Card } from "@mui/material";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBagOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { useMediaQuery, useTheme } from "@mui/material";
import axios from "axios";

const Cart = () => {
    const { cartItems, removeFromCart, resetCart, getTotal } = useCart();
    const [anchorEl, setAnchorEl] = useState(null);
    const [openAlert, setOpenAlert] = useState(false);
    const [loading, setLoading] = useState(false)

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleOpen = () => {
        setAnchorEl(true);
    };

    const handleClose = () => {
        setAnchorEl(false);
    };

    const handleCloseAlert = () => {
        setOpenAlert(false);
    };

    const handleCheckout = async () => {
        try {
            setLoading(true);
            const orderData = {
                cartItems: cartItems,
                totalAmount: getTotal().totalAmount,
                totalQuantity: getTotal().totalQuantity,
            };
            const response = await axios.post('/api/mercadopago/preference', orderData);
            const preferenceId = response.data.id;
            window.location.href = `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${preferenceId}`;
        } catch (error) {
            console.error('Error al crear la preferencia de pago:', error);
        } finally {
            setLoading(false)
        }
    };

    const totalPrice = getTotal().totalAmount || 0;

    return (
        <>
            <IconButton onClick={handleOpen} sx={{ color: 'black', backgroundColor: 'transparent', '&:hover': { backgroundColor: 'transparent' } }}>
                <ShoppingBagIcon />
            </IconButton>
            <Drawer
                anchor={isMobile ? 'top' : 'right'}
                open={anchorEl}
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        width: isMobile ? '100%' : '400px',
                        height: '100vh',
                        borderRadius: isMobile ? 0 : '8px 0 0 8px',
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '16px'
                    }
                }}
            >
                <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <IconButton onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <Typography variant="h6" sx={{ mt: 2, mb: 2, fontFamily: '"Archivo Black", sans-serif' }}>
                        Tu carrito
                    </Typography>
                    {cartItems.length === 0 ? (
                        <Box sx={{ textAlign: 'center', mt: 5 }}>
                            <Typography variant="body1" fontWeight="bold" fontFamily='"Archivo Black", sans-serif'> Tu carrito está vacío </Typography>
                            <Button variant="contained" sx={{ mt: 2, backgroundColor: 'black', fontFamily: '"Archivo Black", sans-serif' }} onClick={handleClose}>
                                Continuar comprando
                            </Button>
                        </Box>
                    ) : (
                        <Box>
                            <List>
                                {cartItems.map((item) => (
                                    <ListItem key={item.id} sx={{ display: 'flex', alignItems: 'center' }}>
                                        <CardMedia 
                                            component="img"
                                            image={item.imageUrl || 'https://via.placeholder.com/80'}
                                            alt={item.name}
                                            sx={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 2, mr: 2 }}
                                        />
                                        <ListItemText 
                                            primary={<Typography variant="body2" fontWeight="bold"> {item.name} </Typography>}
                                            secondary={`$${(item.price || 0).toLocaleString('es-AR')} x ${item.quantity}`}
                                        />
                                        <IconButton onClick={() => removeFromCart(item.id)} color="error">
                                            <DeleteIcon />
                                        </IconButton>
                                    </ListItem>
                                ))}
                            </List>
                            <Box sx={{ mt: 3 }}>
                                <Typography variant="h6" fontWeight="bold">
                                    Total: ${totalPrice.toLocaleString('es-AR')}
                                </Typography>
                                <Box sx={{ mt: 2 }}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                        onClick={handleCheckout}
                                        disabled={loading}
                                    >
                                        {loading ? <CircularProgress /> : 'Finalizar compra'}
                                    </Button>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        color="secondary"
                                        sx={{ mt: 2 }}
                                        onClick={resetCart}
                                    >
                                        Vaciar carrito
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    )}
                </Box>
            </Drawer>
            <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
                <Alert onClose={handleCloseAlert} severity="success" variant="filled">
                    ¡Pedido enviado con éxito!
                </Alert>
            </Snackbar>
        </>
    );
};

export default Cart;
