import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { AddOutlined, EditOutlined, DeleteOutlined } from "@mui/icons-material";
import { Paper, Box, Button, LinearProgress, Typography } from "@mui/material";
import { createCatalog, updateCatalog, deleteCatalog } from "../api/admin.api.js";
import { getAllCatalogs } from "../api/public.api.js";
import { useAuth } from "../context/AuthContext.jsx";
import CatalogDialog from "./CatalogDialog.jsx";

const CatalogsPage = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const [openDialog, setOpenDialog] = useState(false);
    const [editingCatalog, setEditingCatalog] = useState(null);

    const { data, isLoading } = useQuery({
        queryKey: ["catalogs"],
        queryFn: getAllCatalogs,
    });

    const createMutation = useMutation({
        mutationFn: (data) => createCatalog(data, user.access_token),
        onSuccess: () => queryClient.invalidateQueries(["catalogs"]),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => updateCatalog(id, data, user.access_token),
        onSuccess: () => queryClient.invalidateQueries(["catalogs"]),
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => deleteCatalog(id, user.access_token),
        onSuccess: () => queryClient.invalidateQueries(["catalogs"]),
    });

    const handleOpen = (catalog = null) => {
        setEditingCatalog(catalog);
        setOpenDialog(true);
    };

    const handleClose = () => {
        setOpenDialog(false);
        setEditingCatalog(null);
    };

    const handleSubmit = (formData) => {
        if (editingCatalog) {
            updateMutation.mutate({ id: editingCatalog._id, data: formData });
        } else {
            createMutation.mutate(formData);
        }
        handleClose();
    };

    const handleDelete = (id) => {
        if (window.confirm("¿Eliminar este catálogo?")) {
            deleteMutation.mutate(id);
        }
    };

    const columns = [
        { field: "name", headerName: "Nombre", flex: 1 },
        { field: "description", headerName: "Descripción", flex: 2 },
        {
            field: "actions",
            type: "actions",
            getActions: (params) => [
                <GridActionsCellItem
                    icon={<EditOutlined color="black" />}
                    label="Editar"
                    onClick={() => handleOpen(params.row)}
                />,
                <GridActionsCellItem
                    icon={<DeleteOutlined color="black" />}
                    label="Eliminar"
                    onClick={() => handleDelete(params.row._id)}
                />,
            ],
        },
    ];

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
                    Gestión de catálogos
                </Typography>
                <Button
                    startIcon={<AddOutlined />}
                    variant="contained"
                    onClick={() => handleOpen()}
                    sx={{
                        fontFamily: '"Archivo Black", sans-serif',
                        borderRadius: 1,
                        backgroundColor: "black",
                        letterSpacing: "-1px",
                    }}
                >
                    Nuevo catálogo
                </Button>
            </Box>
            {!data?.data.length && !isLoading ? (
                <Box
                    sx={{
                        border: '3px solid black',
                        borderRadius: 1,
                        p: 2,
                        backgroundColor: '#fefefe',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <Typography
                        textAlign="center"
                        sx={{
                            fontFamily: '"Archivo Black", sans-serif',
                            letterSpacing: '-2px',
                            fontSize: '1.5rem',
                        }}
                    >
                        No hay catálogos registrados.
                    </Typography>
                </Box>
            ) : (
                <DataGrid
                    autoHeight
                    rows={data?.data || []}
                    columns={columns}
                    getRowId={(row) => row._id}
                    loading={isLoading}
                    components={{ LoadingOverlay: LinearProgress }}
                    pageSize={8}
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
            <CatalogDialog
                open={openDialog}
                onClose={handleClose}
                onSubmit={handleSubmit}
                initialData={editingCatalog}
            />
        </Paper>
    );
};

export default CatalogsPage;