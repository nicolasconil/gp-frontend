import { useState, useEffect } from "react";
import {  Dialog, DialogTitle, DialogContent, IconButton, Table, TableHead, TableBody, TableRow, TableCell, CircularProgress, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { getStockMovementsByProduct } from "../api/admin.api.js";
import { useAuth } from "../context/AuthContext.jsx";

const movementColors = {
    venta: '#f44336',
    ingreso: '#4caf50',
};

const StockMovementDialog = ({ open, onClose, productId }) => {
    const [movements, setMovements] = useState([]);
    const [loading, setLoading] = useState(false);

    const { user } = useAuth();
    const token = user?.access_token;
    
    useEffect(() => {
        if (open && productId) {
            setLoading(true);
            getStockMovementsByProduct(productId, token)
            .then((res) => setMovements(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
        }
    }, [open, productId]);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>
                Historial de stock
                <IconButton onClick={onClose} sx={{ position: 'absolute', right: 16, top: 16 }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                {loading ? (
                    <CircularProgress />
                ) : movements.length === 0 ? (
                    <Typography> No hay movimientos registrados. </Typography>
                ) : (
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell> Fecha </TableCell>
                                <TableCell> Tipo </TableCell>
                                <TableCell> Cantidad </TableCell>
                                <TableCell> Talle </TableCell>
                                <TableCell> Color </TableCell>
                                <TableCell> Nota </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {movements.map((m) => (
                                <TableRow key={m._id}>
                                    <TableCell> {new Date(m.createdAt).toLocaleString()} </TableCell>
                                    <TableCell sx={{ color: movementColors[m.movementType] }}> {m.movementType} </TableCell>
                                    <TableCell> {m.quantity} </TableCell>
                                    <TableCell> {m.size} </TableCell>
                                    <TableCell> {m.color} </TableCell>
                                    <TableCell> {m.note || '-'} </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default StockMovementDialog;