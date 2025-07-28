import { useState, useEffect } from "react";
import { Box, Typography, MenuItem, Select, InputLabel, FormControl, TextField, Pagination, Button, Paper } from "@mui/material";
import { getAllOrders, updateOrderStatus, deleteOrder } from "../api/admin.api.js";
import { useAuth } from "../context/AuthContext.jsx";
import OrderDialog from "./OrderDialog.jsx";

const OrdersPage = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);
    const [filterStatus, setFilterStatus] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const perPage = 50;
    const [dialog, setDialog] = useState({ open: false, order: null });

    useEffect(() => {
        if (!user) return;
        fetchOrders();
    }, [user]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError(false);
            const { data } = await getAllOrders(user.access_token);
            setOrders(data.orders || []);
        } catch (error) {
            console.error("Error buscando órdenes:", error);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            setUpdatingId(orderId);
            await updateOrderStatus(orderId, { status: newStatus }, user.access_token);
            await fetchOrders();
        } catch (error) {
            console.error("Error actualizando el estado de la orden:", error);
        } finally {
            setUpdatingId(null);
        }
    };

    const handleDeleteOrder = async (orderId) => {
        if (!window.confirm("¿Estás seguro que querés eliminar esta orden?")) return;
        try {
            setUpdatingId(orderId);
            await deleteOrder(orderId, user.access_token);
            setOrders(orders.filter((order) => order._id !== orderId));
        } catch (error) {
            console.error("Error eliminando la orden:", error);
        } finally {
            setUpdatingId(null);
        }
    };

    const filteredOrders = Array.isArray(orders) ? orders.filter((o) => {
        const matchStatus = filterStatus ? o.status === filterStatus : true;
        const matchSearch = search ? (o._id.includes(search) || (o.guestEmail || "").toLowerCase().includes(search.toLowerCase())) : true;
        return matchStatus && matchSearch;
    }) : [];

    const paginatedOrders = filteredOrders.slice((page - 1) * perPage, page * perPage);

    const customInputStyles = {
        fontFamily: '"Archivo Black", sans-serif',
        "& label": {
            color: "light gray",
            fontFamily: '"Archivo Black", sans-serif',
            backgroundColor: "white",
            padding: "0 4px",
            transform: "translate(14px, 12px) scale(1)",
        },
        "& label.Mui-focused": {
            color: "black",
        },
        "& .MuiInputLabel-outlined": {
            transform: "translate(14px, 12px) scale(1)",
        },
        "& .MuiInputLabel-outlined.MuiInputLabel-shrink": {
            transform: "translate(14px, -9px) scale(0.75)",
        },
        "& .MuiOutlinedInput-root": {
            borderRadius: "3px",
            backgroundColor: "white",
            fontFamily: '"Archivo Black", sans-serif',
            "& fieldset": {
                borderColor: "black",
                borderWidth: "2px",
            },
            "&:hover fieldset": {
                borderColor: "black",
            },
            "&.Mui-focused fieldset": {
                borderColor: "black",
            },
            "& input": {
                padding: "10.5px 14px",
                textAlign: "center",
            },
        },
        "& .MuiSelect-select": {
            padding: "10.5px 14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
        },
    };

    if (loading) {
        return (
            <Box sx={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'transparent',
                flexDirection: 'column'
            }}>
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
                    Cargando órdenes...
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
        )
    }

    if (error) {
        return (
            <Box sx={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                textAlign: 'center'
            }}>
                <Box component='img' src='/logo1.svg' alt='Error' sx={{ width: 120, height: 'auto', opacity: 0.3 }} />
                <Typography variant='h6' sx={{ mt: 2, fontFamily: '"Archivo Black", sans-serif', letterSpacing: '-0.1rem' }}>
                    Error cargando las órdenes.
                </Typography>
                <Button
                    variant='contained'
                    onClick={() => window.location.reload()}
                    sx={{ mt: 2, fontFamily: '"Archivo Black", sans-serif', border: '3px solid black', backgroundColor: 'black', color: 'white' }}
                >
                    Reintentar
                </Button>
            </Box>
        );
    }

    return (
        <Paper sx={{ p: 3, backgroundColor: '#fefefe', border: '3px solid black', borderRadius: 1 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" sx={{ fontFamily: '"Archivo Black", sans-serif', letterSpacing: '-5px', textTransform: 'uppercase', textDecoration: 'underline' }}>
                    Gestión de órdenes
                </Typography>
            </Box>
            <Box display="flex" gap={2} mb={2}>
                <FormControl sx={{ minWidth: 200, ...customInputStyles }} size="small">
                    <InputLabel> Filtrar por estado </InputLabel>
                    <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} label="Filtrar por estado">
                        <MenuItem value=""> Todas </MenuItem>
                        <MenuItem value="pendiente"> Pendiente </MenuItem>
                        <MenuItem value="procesando"> Procesando </MenuItem>
                        <MenuItem value="enviado"> Enviado </MenuItem>
                        <MenuItem value="entregado"> Entregado </MenuItem>
                    </Select>
                </FormControl>
                <TextField size="small" label="Buscar por ID o email" value={search} onChange={(e) => setSearch(e.target.value)} sx={customInputStyles} />
            </Box>
                <Box display="grid" gap={2}>
                    {paginatedOrders.map((order) => (
                        <Button key={order._id} onClick={() => setDialog({ open: true, order })} variant="outlined" color="inherit" sx={{ justifyContent: 'space-between', fontFamily: '"Archivo Black", sans-serif', textTransform: 'none', color: 'black', border: '2px solid black' }}>
                           Orden #{order._id} - Cliente: {order.guestName || 'Invitado'} - Email: {order.guestEmail || 'Invitado'} - Envío {order.status}
                            {order.shipping?.status && ` - Envío: ${order.shipping.status ?? 'No disponible'}`}
                        </Button>
                    ))}
                    {!filteredOrders.length && (
                        <Box sx={{ border: '3px solid black', borderRadius: 1, p: 2, backgroundColor: '#fefefe', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Typography textAlign="center" sx={{ fontFamily: '"Archivo Black", sans-serif', letterSpacing: '-2px', fontSize: '1.5rem' }}>
                                No hay órdenes registradas.
                            </Typography>
                        </Box>
                    )}
                    {filteredOrders.length > perPage && (
                        <Box sx={{ border: '3px solid black', borderRadius: 1, p: 2, backgroundColor: "#fefefe", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Pagination count={Math.ceil(filteredOrders.length / perPage)} page={page} onChange={(_, value) => setPage(value)} sx={{ mt: 2, mx: "auto" }} />
                        </Box>
                    )}
                </Box>
            {dialog.open && (
                <OrderDialog order={dialog.order} onClose={() => setDialog({ open: false, order: null })} onStatusChange={handleStatusChange} onDelete={handleDeleteOrder} updating={updatingId === dialog.order._id} />
            )}
        </Paper>
    );
};

export default OrdersPage;
