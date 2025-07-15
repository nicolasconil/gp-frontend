import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getOrdersForShipping, updateShippingStatus } from "../api/admin.api.js";
import { Box, Typography, Button, LinearProgress, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import ShippingDialog from "./ShippingDialog.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { LocalShippingOutlined, HourglassEmptyOutlined, CancelOutlined, DoneAllOutlined } from "@mui/icons-material";

const ShippingsPage = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const { data, isLoading } = useQuery({
        queryKey: ["ordersForShipping"],
        queryFn: () => getOrdersForShipping(user?.access_token),
    });

    const mutation = useMutation({
        mutationFn: ({ orderId, status }) =>
            updateShippingStatus(orderId, { status }, user?.access_token),
        onSuccess: () => queryClient.invalidateQueries(["ordersForShipping"]),
    });

    const handleShippingUpdate = (orderId, status) => {
        mutation.mutate({ orderId, status });
        setOpenDialog(false);
    };

    const columns = [
        { field: "id", headerName: "ID de orden", width: 150 },
        { field: "guestName", headerName: "Cliente", width: 200 },
        { field: "shippingStatus", headerName: "Estado de envío", width: 180 },
        {
            field: "actions",
            headerName: "Acciones",
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => {
                            setSelectedOrder(params.row); // Selecciona la orden
                            setOpenDialog(true); // Abre el diálogo
                        }}
                        sx={{ minWidth: 0, padding: 1 }}
                    >
                        <DoneAllOutlined />
                    </Button>
                    <Button
                        variant="outlined"
                        color="warning"
                        onClick={() => {
                            setSelectedOrder(params.row); // Selecciona la orden
                            setOpenDialog(true); // Abre el diálogo
                        }}
                        sx={{ minWidth: 0, padding: 1 }}
                    >
                        <HourglassEmptyOutlined />
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={() => {
                            setSelectedOrder(params.row); // Selecciona la orden
                            setOpenDialog(true); // Abre el diálogo
                        }}
                        sx={{ minWidth: 0, padding: 1 }}
                    >
                        <CancelOutlined />
                    </Button>
                    <Button
                        variant="outlined"
                        color="success"
                        onClick={() => {
                            setSelectedOrder(params.row); // Selecciona la orden
                            setOpenDialog(true); // Abre el diálogo
                        }}
                        sx={{ minWidth: 0, padding: 1 }}
                    >
                        <LocalShippingOutlined />
                    </Button>
                </Box>
            ),
        },
    ];

    const rows = data?.data?.map((order) => ({
        id: order._id,
        guestName: order.guestName,
        shippingStatus: order.shipping?.status || "pendiente",
    })) || [];

    return (
        <Paper
            sx={{
                p: 3,
                backgroundColor: "#fefefe",
                border: "3px solid black",
                borderRadius: 1,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        fontFamily: '"Archivo Black", sans-serif',
                        letterSpacing: "-5px",
                        textTransform: "uppercase",
                        textDecoration: "underline",
                    }}
                >
                    Gestión de envíos
                </Typography>
            </Box>

            <DataGrid
                autoHeight
                rows={rows}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                checkboxSelection
                loading={isLoading}
                components={{ LoadingOverlay: LinearProgress }}
                sx={{
                    fontFamily: '"Archivo Black", sans-serif',
                    border: "3px solid black",
                    boxShadow: 1,
                    borderRadius: 1,
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: "#f3f3f3",
                        fontSize: 16,
                    },
                    "& .MuiDataGrid-cell": {
                        fontSize: 15,
                    },
                }}
            />

            <ShippingDialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                shipping={selectedOrder || {}}
                onSubmit={handleShippingUpdate}
            />
        </Paper>
    );
};

export default ShippingsPage;
