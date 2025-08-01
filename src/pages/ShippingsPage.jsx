import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dispatchShipping, getOrdersForShipping, updateShippingStatus, createShippingForOrder } from "../api/admin.api.js";
import { Box, Typography, Button, LinearProgress, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import ShippingDialog from "./ShippingDialog.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { EditOutlined } from "@mui/icons-material";
import { getOrderById } from "../api/user.api.js";

const ShippingsPage = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const { data, isLoading } = useQuery({
        queryKey: ["ordersForShipping"],
        queryFn: getOrdersForShipping,
    });

    const mutation = useMutation({
        mutationFn: async ({ orderId, payload }) => {
            await updateShippingStatus(orderId, payload, user?.access_token);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["ordersForShipping"]);
            setOpenDialog(false);
            setSelectedOrder(null);
        },
        onError: (error) => {
            console.error('Error al actualizar el estado:', error);
        }
    });

    const handleShippingUpdate = (orderId, form) => {
        const payload = {
            status: form.status,
            shippingTrackingNumber: form.shippingTrackingNumber,
            carrier: form.carrier,
            method: form.method,
        };
        mutation.mutate({ orderId, payload });
    };

    const handleShippingDialogClose = async () => {
        setOpenDialog(false);
        if (selectedOrder) {
            try {
                if (!selectedOrder.shipping) {
                    await createShippingForOrder(selectedOrder._id, user?.access_token);
                }
                const refreshed = await getOrderById(selectedOrder._id, user?.access_token);
                setSelectedOrder(refreshed.order);
                await queryClient.invalidateQueries(["ordersForShipping"]);
            } catch (error) {
                console.error('Error al actualizar la orden:', error);
            }
        }
    };

    const capitalize = (text) =>
        text ? text.charAt(0).toUpperCase() + text.slice(1) : "";

    const columns = [
        { field: "id", headerName: "ID de orden", width: 600 },
        { field: "guestName", headerName: "Cliente", width: 400 },
        { field: "shippingStatus", headerName: "Estado de envío", width: 250 },
        {
            field: "actions",
            headerName: "Acciones",
            width: 160,
            renderCell: (params) => (
                <Button
                    variant="outlined"
                    onClick={() => {
                        setSelectedOrder(params.row.originalOrder);
                        setOpenDialog(true);
                    }}
                    sx={{ minWidth: 0, padding: 1, border: 'none', color: 'black', backgroundColor: 'transparent' }}
                >
                    <EditOutlined />
                </Button>
            ),
        },
    ];

    const rows =
        data?.data?.map((order) => {
            const updatedStatus = order?.shipping?.status || "pendiente";
            return {
                id: order._id,
                guestName: order.guestName,
                shippingStatus: capitalize(updatedStatus),
                originalOrder: order,
            };
        }) || [];

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

            {!rows.length && !isLoading ? (
                <Box
                    sx={{
                        border: "3px solid black",
                        borderRadius: 1,
                        p: 2,
                        backgroundColor: "#fefefe",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Typography
                        textAlign="center"
                        sx={{
                            fontFamily: '"Archivo Black", sans-serif',
                            letterSpacing: "-2px",
                            fontSize: "1.5rem",
                        }}
                    >
                        No hay envíos registrados.
                    </Typography>
                </Box>
            ) : (
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
            )}

            <ShippingDialog
                open={openDialog}
                onClose={handleShippingDialogClose}
                shipping={selectedOrder?.shipping ?? {}}
                onSubmit={handleShippingUpdate}
                order={selectedOrder}
            />
        </Paper>
    );
};

export default ShippingsPage;