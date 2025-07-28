import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Box, Button, MenuItem, Select, Snackbar, Alert } from "@mui/material";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";

const OrderDialog = ({ order, onStatusChange, onDelete, updating, onClose }) => {
    const statusOptions = ["pendiente", "procesando", "enviado", "entregado"];
    const [localStatus, setLocalStatus] = useState(order.status);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    useEffect(() => {
        setLocalStatus(order.status);
    }, [order]);

    const handleStatusSave = () => {
        if (localStatus !== order.status) {
            onStatusChange(order._id, localStatus);
            onClose();
        }
    };

    const handleDelete = () => {
        onDelete(order._id);
        setSnackbarOpen(true);
        onClose();
    };

    const capitalizeWords = (str) =>
        str.replace(/\b\w/g, (char) => char.toUpperCase());

    return (
        <>
            <Dialog open fullWidth maxWidth="sm" onClose={onClose}>
                <DialogTitle
                    sx={{
                        fontFamily: '"Archivo Black", sans-serif',
                        fontSize: 22,
                        textAlign: 'center',
                        letterSpacing: '-2px',
                        textDecoration: 'underline'
                    }}
                >
                    Orden #{order._id}
                </DialogTitle>
                <DialogContent dividers sx={{ px: 4, py: 3 }}>
                    <Box>
                        <Typography variant="h6" sx={{ fontFamily: '"Archivo Black", sans-serif', letterSpacing: '-1.25px', textDecoration: 'underline' }}>
                            Cliente:
                        </Typography>
                        <Typography variant="body1" sx={{ ml: 1 }}> <strong> Nombre: </strong> {order.guestName || "Invitado"} </Typography>
                        <Typography variant="body1" sx={{ ml: 1 }}> <strong> Email: </strong> {order.guestEmail || "No disponible"} </Typography>
                        <Typography variant="body1" sx={{ ml: 1 }}>
                            <strong> Fecha de creación de orden: </strong>{" "}
                            {order.createdAt
                                ? new Date(order.createdAt).toLocaleString("es-AR", {
                                    day: "2-digit",
                                    month: "long",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })
                                : "No disponible"}
                        </Typography>
                    </Box>
                    <Box mt={1}>
                        <Typography variant="h6" sx={{ fontFamily: '"Archivo Black", sans-serif', letterSpacing: '-1.25px', textDecoration: 'underline' }}>
                            Dirección de envío:
                        </Typography>
                        {order.guestAddress ? (
                            <>
                                <Typography variant="body1" sx={{ ml: 1 }}>
                                    {order.guestAddress.street} {order.guestAddress.number}
                                    {order.guestAddress.apartment ? `, Dpto ${order.guestAddress.apartment}` : ''}
                                    {order.guestAddress.floor ? `, Piso ${order.guestAddress.floor}` : ''}
                                </Typography>
                                <Typography variant="body1" sx={{ ml: 1 }}>
                                    {order.guestAddress.city}, {order.guestAddress.province}, CP {order.guestAddress.postalCode}
                                </Typography>
                            </>
                        ) : (
                            <Typography variant="body2" sx={{ ml: 1 }}>Sin dirección cargada.</Typography>
                        )}
                    </Box>
                    <Box mt={1}>
                        <Typography variant="h6" sx={{ fontFamily: '"Archivo Black", sans-serif', letterSpacing: '-1.25px', textDecoration: 'underline' }}>
                            Estado del envío:
                        </Typography>
                        <Typography variant="body1" sx={{ ml: 1 }}> {order.status.charAt(0).toUpperCase() + order.status.slice(1)} </Typography>
                        {order.shipping?.status && (
                            <Typography sx={{ mt: 1 }}> Estado envío: {order.shipping?.status} </Typography>
                        )}
                    </Box>
                    <Box mt={1}>
                        <Typography variant="h6" sx={{ fontFamily: '"Archivo Black", sans-serif', letterSpacing: '-1.25px', textDecoration: 'underline' }}>
                            Productos:
                        </Typography>
                        {order.products?.length ? (
                            order.products.map((p, idx) => (
                                <Box key={idx} sx={{ ml: 1 }}>
                                    <Typography variant="body1">
                                        - {p.product?.name ? capitalizeWords(p.product.name) : 'Producto no disponible'} ({p.color || 'sin color'}, {p.size || 'sin talle'}) x{p.quantity} - ${p.price}
                                    </Typography>
                                </Box>
                            ))
                        ) : (
                            <Typography variant="body2" sx={{ ml: 1 }}> Sin productos. </Typography>
                        )}
                    </Box>
                    <Box display="flex" flexDirection="column" gap={2} mt={1}>
                        <Typography
                            variant="h6"
                            sx={{
                                fontFamily: '"Archivo Black", sans-serif',
                                letterSpacing: '-1.25px',
                                textDecoration: 'underline'
                            }}
                        >
                            Cambiar estado de la orden:
                        </Typography>
                        <Select
                            value={localStatus}
                            onChange={(e) => setLocalStatus(e.target.value)}
                            size="small"
                            disabled={updating}
                            sx={{
                                fontFamily: '"Archivo Black", sans-serif',
                                minWidth: 160,
                                textAlign: 'center'
                            }}
                        >
                            {statusOptions.map((status) => (
                                <MenuItem key={status} value={status}>
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </MenuItem>
                            ))}
                        </Select>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleDelete}
                            disabled={updating}
                            sx={{
                                fontFamily: '"Archivo Black", sans-serif',
                                textTransform: 'uppercase'
                            }}
                            fullWidth
                        >
                            {updating ? <Box
                                sx={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    bgcolor: "rgba(255, 255, 255, 0.8)",
                                    zIndex: 20,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexDirection: "column",
                                    borderRadius: 2,
                                }}
                            >
                                <Box
                                    component="img"
                                    src="/logo1.svg"
                                    alt="Cargando..."
                                    sx={{
                                        width: 100,
                                        height: "auto",
                                        opacity: 0.5,
                                        animation: "pulseOpacity 2s infinite ease-in-out",
                                    }}
                                />
                                <Typography
                                    variant="h6"
                                    sx={{
                                        mt: 2,
                                        fontFamily: '"Archivo Black", sans-serif',
                                        letterSpacing: "-0.1rem",
                                        textAlign: "center",
                                    }}
                                >
                                    Actualizando orden...
                                </Typography>

                                <style>
                                    {`@keyframes pulseOpacity { 0% { opacity: 0.2; } 50% { opacity: 1; } 100% { opacity: 0.2; } }`}
                                </style>
                            </Box> : "Eliminar orden"}
                        </Button>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button onClick={onClose} sx={{ fontFamily: '"Archivo Black", sans-serif', textTransform: 'uppercase', color: 'black' }}> Cerrar </Button>
                    {localStatus !== order.status && (
                        <Button
                            onClick={handleStatusSave}
                            variant="contained"
                            sx={{
                                fontFamily: '"Archivo Black", sans-serif',
                                textTransform: 'uppercase',
                                color: 'white',
                                backgroundColor: 'black'
                            }}
                        >
                            Guardar cambios
                        </Button>
                    )}
                </DialogActions>
            </Dialog >
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    severity="success"
                    onClose={() => setSnackbarOpen(false)}
                    sx={{ width: '100%' }}
                >
                    Orden eliminada correctamente.
                </Alert>
            </Snackbar>
        </>
    );
};

OrderDialog.propTypes = {
    order: PropTypes.object.isRequired,
    onStatusChange: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    updating: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default OrderDialog;
