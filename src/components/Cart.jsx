import { useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import { Box, Button, Typography, CardMedia, Drawer, IconButton, List, ListItem, ListItemText, Snackbar, Alert, CircularProgress, Badge } from "@mui/material";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBagOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { useMediaQuery, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";

const baseURL = import.meta.env.VITE_BACKEND_URL;

const Cart = () => {
    const { cartItems, removeFromCart, resetCart, getTotal } = useCart();
    const { totalQuantity, totalAmount } = getTotal();
    const [anchorEl, setAnchorEl] = useState(null);
    const [openAlert, setOpenAlert] = useState(false);
    const [loading, setLoading] = useState(false)

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();

    const handleOpen = () => setAnchorEl(true);
    const handleClose = () => setAnchorEl(false);
    const handleCloseAlert = () => setOpenAlert(false);

    const capitalizeWords = (str) => {
        return str.replace(/\b\w/g, char => char.toUpperCase());
    };

    const handleCheckout = async () => {
        try {
            setLoading(true);
            const orderSummary = {
                products: cartItems.map(item => ({
                    name: item.name,
                    product: item.productId,
                    quantity: item.quantity,
                    size: item.size,
                    color: item.color,
                    price: item.price,
                    image: item.image
                })),
                totalAmount,
                totalQuantity,
            };
            handleClose();
            navigate('/checkout', {
                state: {
                    orderSummary: {
                        products: cartItems.map(item => ({
                            productId: item.productId,
                            name: item.name,
                            quantity: item.quantity,
                            price: item.price,
                            size: item.size,
                            color: item.color,
                            image: item.image
                        })),
                        totalAmount,
                        totalQuantity
                    },
                },
                resetCart 
            });
        } catch (error) {
            console.error('Error al crear la orden:', error);
        } finally {
            setLoading(false);
        }
    };

    const totalPrice = getTotal().totalAmount;

    return (
        <>
            <IconButton
                onClick={handleOpen}
                sx={{
                    color: "black",
                    p: 1,
                    "&:hover": { backgroundColor: "transparent" },
                }}
            >
                <Badge badgeContent={totalQuantity} sx={{
                    '& .MuiBadge-badge': {
                        mt: 0.3,
                        backgroundColor: 'black',
                        color: 'white',
                        fontWeight: 300,
                        borderRadius: '100%',
                        width: 17,
                        height: 17,
                        minWidth: 0,
                    },
                }}>
                    <ShoppingBagIcon />
                </Badge>
            </IconButton>
            <Drawer
                anchor={isMobile ? "top" : "right"}
                open={anchorEl}
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        width: isMobile ? "auto" : "400px",
                        height: "100vh",
                        borderRadius: isMobile ? 0 : "1px 0 0 1px",
                        boxShadow: "0px 8px 24px rgba(0,0,0,0.2)",
                        p: 3,
                        maxHeight: "100vh",
                        display: "flex",
                        flexDirection: "column",
                        backgroundColor: "#f9f9f9",
                        justifyContent: 'center',
                    },
                }}
            >
                {cartItems.length === 0 ? (
                    <Box sx={{ textAlign: "center" }}>
                        <Typography
                            variant="h5"
                            sx={{
                                fontFamily: '"Archivo Black", sans-serif',
                                textTransform: "uppercase",
                                letterSpacing: "-0.1em",
                                mb: 2,
                                fontSize: { xs: '1.5rem', md: '1.95rem' }
                            }}
                        >
                            Tu carrito está vacío :(
                        </Typography>
                        <Button
                            variant="contained"
                            sx={{
                                mt: 2,
                                backgroundColor: "black",
                                fontFamily: '"Archivo Black", sans-serif',
                                borderRadius: "4px",
                                px: 4,
                                py: 1.5,
                                textTransform: "uppercase",
                            }}
                            onClick={handleClose}
                        >
                            Continuar comprando
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
                                    height: '98%',
                                    backgroundColor: 'black',
                                    borderRadius: '2px',
                                }}
                            />
                        </Button>
                    </Box>
                ) : (
                    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                            <Typography variant="h5" sx={{ fontFamily: '"Archivo Black", sans-serif', textTransform: "uppercase", letterSpacing: "-0.1em" }}>
                                Tu carrito
                            </Typography>
                            <IconButton onClick={handleClose} sx={{ color: 'black', '&:hover': { backgroundColor: 'transparent' } }}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                        <Box sx={{ flexGrow: 1, maxHeight: '50vh' }}>
                            <List>
                                {cartItems.map((item) => {
                                    const imageUrl = item.image?.startsWith('/uploads') ? `${baseURL}${item.image}` : item.image || "https://via.placeholder.com/80";
                                    return (
                                        <ListItem
                                            key={item.id}
                                            sx={{
                                                mt: { xs: 3, md: 2 },
                                                mb: 2,
                                                borderRadius: '4px',
                                                backgroundColor: "#fff",
                                                border: '3px solid black',
                                                p: { xs: 1.5, md: 0.5 },
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    bottom: -7,
                                                    left: 6,
                                                    width: '100%',
                                                    height: '5px',
                                                    backgroundColor: 'black',
                                                    borderRadius: '2px',
                                                }}
                                            />
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: 6,
                                                    right: -6,
                                                    width: '6px',
                                                    height: '98%',
                                                    backgroundColor: 'black',
                                                    borderRadius: '2px',
                                                }}
                                            />
                                            <CardMedia
                                                component="img"
                                                image={imageUrl}
                                                alt={item.name}
                                                sx={{
                                                    width: 80,
                                                    height: 80,
                                                    objectFit: "cover",
                                                    borderRadius: 2,
                                                    mr: 2,
                                                }}
                                            />
                                            <ListItemText
                                                primary={<Typography variant="h6" fontWeight={600} textTransform="uppercase" letterSpacing="-0.05rem"> {capitalizeWords(item.name)} </Typography>}
                                                secondary={
                                                    <Box sx={{ display: 'block' }}>
                                                        <Typography variant="caption" color="text.secondary" display="block">
                                                            ${(Number(item.price).toLocaleString("es-AR"))} x {item.quantity}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary" display="block">
                                                            Talle: {item.size || "N/A"}
                                                        </Typography>
                                                    </Box>
                                                }
                                            />
                                            <IconButton onClick={() => removeFromCart(item.id)} sx={{ color: 'black', '&:hover': { backgroundColor: 'transparent' } }} >
                                                <DeleteIcon />
                                            </IconButton>
                                        </ListItem>
                                    );
                                })}
                            </List>
                        </Box>
                        <Box sx={{ mt: { xs: 0, md: 1 }, borderTop: "1px solid #ddd", pt: 2 }}>
                            <Typography variant="h5" sx={{ color: 'rgba(0, 0, 0, 0.6)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '-0.02rem' }}> Total: </Typography>
                            <Typography variant="h6" fontWeight="bold">
                                ${totalPrice.toLocaleString("es-AR")} ARS
                            </Typography>
                            <Box sx={{ mt: 5 }}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    sx={{
                                        backgroundColor: "black",
                                        color: "white",
                                        borderRadius: "4px",
                                        py: 1.5,
                                        fontWeight: 600,
                                        "&:hover": { backgroundColor: "#111" },
                                    }}
                                    onClick={handleCheckout}
                                    disabled={loading}
                                >
                                    {loading ? <CircularProgress size={24} color="inherit" /> : "Finalizar compra"}
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            bottom: -5,
                                            left: 6,
                                            width: '99%',
                                            height: '6px',
                                            backgroundColor: 'black',
                                            borderRadius: '2.5px',
                                        }}
                                    />
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 6,
                                            right: -5,
                                            width: '6px',
                                            height: '96.7%',
                                            backgroundColor: 'black',
                                            borderRadius: '2.5px',
                                        }}
                                    />
                                </Button>

                                <Button
                                    fullWidth
                                    variant="outlined"
                                    sx={{
                                        mt: 3,
                                        border: "3px solid #ccc",
                                        borderRadius: "4px",
                                        py: 1.5,
                                        fontWeight: 600,
                                        color: "black",
                                        "&:hover": {
                                            backgroundColor: "#f5f5f5",
                                        },
                                    }}
                                    onClick={resetCart}
                                >
                                    Vaciar carrito
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            bottom: -7.5,
                                            left: 6,
                                            width: '100%',
                                            height: '6px',
                                            backgroundColor: '#ccc',
                                            borderRadius: '2.5px',
                                        }}
                                    />
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 6,
                                            right: -7.5,
                                            width: '6px',
                                            height: '100%',
                                            backgroundColor: '#ccc',
                                            borderRadius: '2.5px',
                                        }}
                                    />
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                )}
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
