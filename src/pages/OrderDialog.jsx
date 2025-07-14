import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Box, Button, MenuItem, Select, CircularProgress } from "@mui/material";
import PropTypes from "prop-types";

const OrderDialog = ({ order, onStatusChange, onDelete, updating, onClose }) => {
    const statusOptions = ["pendiente", "procesando", "enviado", "entregado"];

    return (
        <Dialog open fullWidth maxWidth="sm" onClose={onClose}>
            <DialogTitle 
                sx={{
                    fontFamily: '"Archivo Black", sans-serif',
                    fontSize: 22,
                    textAlign: 'center',
                    letterSpacing: '-2px'
                }}
            > 
                Orden: {order._id}
            </DialogTitle>
            <DialogContent dividers sx={{ px: 4, py: 3 }}>
                <Typography> Cliente: {order.user?.email || "Invitado"} </Typography>
                <Typography sx={{ mt: 1 }}> Estado actual: {order.status} </Typography>
                <Box mt={2}>
                    <Typography variant="h6" sx={{ fontFamily: '"Archivo Black", sans-serif', letterSpacing: '-1.25px' }}> Productos: </Typography>
                    {order.products?.map((p) => (
                        <Box key={p.productId} sx={{ ml: 1}}>
                            <Typography variant="body2"> {p.name} - {p.quantity} u. - ${p.price} </Typography>
                        </Box>
                    ))}
                </Box>
                <Box display="flex" gap={1} alignItems="center" mt={2}>
                    <Select
                        value={order.status}
                        onChange={(e) => onStatusChange(order._id, e.target.value)}
                        size="small"
                        disabled={updating}
                        sx={{
                            fontFamily: '"Archivo Black", sans-serif',
                            minWidth: 160
                        }}
                    >
                        {statusOptions.map((status) => (
                            <MenuItem key={status} value={status}> {status} </MenuItem>
                        ))}
                    </Select>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={() => onDelete(order._id)}
                        disabled={updating}
                        sx={{
                            fontFamily: '"Archivo Black", sans-serif',
                            textTransform: 'uppercase'
                        }}
                    >
                        {updating ? <CircularProgress size={20} /> : "Eliminar"}
                    </Button>
                </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={onClose} sx={{ fontFamily: '"Archivo Black", sans-serif', textTransform: 'uppercase', color: 'black' }}> Cerrar </Button>
            </DialogActions>
        </Dialog>
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