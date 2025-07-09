import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import {
  AddOutlined,
  EditOutlined,
  DeleteOutlined,
  History as HistoryIcon,
} from "@mui/icons-material";
import {
  createProduct,
  updateProduct,
  deleteProduct,
} from "../api/admin.api.js";
import { getAllProducts } from "../api/public.api.js";
import { useAuth } from "../context/AuthContext.jsx";
import ProductDialog from "./ProductDialog.jsx";
import StockMovementDialog from "./StockMovementDialog.jsx";
import {
  Paper,
  Box,
  Button,
  LinearProgress,
  Typography,
} from "@mui/material";

const ProductsPage = () => {
  const qc = useQueryClient();
  const { user } = useAuth();
  const token = user.access_token;

  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
  });

  const mCreate = useMutation({
    mutationFn: (payload) => createProduct(payload, token),
    onSuccess: () => qc.invalidateQueries(["products"]),
  });

  const mUpdate = useMutation({
    mutationFn: ({ id, payload }) => updateProduct(id, payload, token),
    onSuccess: () => qc.invalidateQueries(["products"]),
  });

  const mDelete = useMutation({
    mutationFn: (id) => deleteProduct(id, token),
    onSuccess: () => qc.invalidateQueries(["products"]),
    onError: (err) => {
      alert(err?.response?.data?.message || "Error al eliminar el producto.");
    },
  });

  const sanitizeCatalog = (obj) => {
    if (!obj.catalog?.trim()) {
      const { catalog, ...rest } = obj;
      return rest;
    }
    return { ...obj, catalog: obj.catalog.trim() };
  };

  const handleCreateProduct = (data) => {
    const payload = sanitizeCatalog(data);
    mCreate.mutate(payload);
  };

  const handleUpdateProduct = (id, data) => {
    const payload = sanitizeCatalog(data);
    mUpdate.mutate({ id, payload });
  };

  const [dlg, setDlg] = useState({ open: false });
  const open = (cfg) => setDlg({ open: true, ...cfg });
  const close = () => setDlg({ open: false });

  const [stockDialog, setStockDialog] = useState({ open: false, productId: null });
  const openStockDialog = (productId) =>
    setStockDialog({ open: true, productId });
  const closeStockDialog = () =>
    setStockDialog({ open: false, productId: null });

  const cols = [
    { field: "_id", headerName: "ID", width: 220 },
    { field: "name", headerName: "Nombre", flex: 1 },
    { field: "price", headerName: "Precio", type: "number", width: 120 },
    { field: "stock", headerName: "Stock", type: "number", width: 100 },
    { field: "brand", headerName: "Marca", width: 130 },
    { field: "gender", headerName: "Género", width: 120 },
    {
      field: "actions",
      type: "actions",
      headerName: "Acciones",
      width: 180,
      getActions: ({ id, row }) => [
        <GridActionsCellItem
          icon={<EditOutlined color="black" />}
          label="Editar"
          onClick={() =>
            open({
              title: "Editar Producto",
              initial: row,
              onSubmit: (d) => handleUpdateProduct(id, d),
            })
          }
        />,
        <GridActionsCellItem
          icon={<DeleteOutlined color="black" />}
          label="Eliminar"
          onClick={() => mDelete.mutate(id)}
        />,
        <GridActionsCellItem
          icon={<HistoryIcon color="black" />}
          label="Historial"
          onClick={() => openStockDialog(id)}
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
          Gestión de productos
        </Typography>
        <Button
          startIcon={<AddOutlined />}
          variant="contained"
          sx={{
            fontFamily: '"Archivo Black", sans-serif',
            borderRadius: 1,
            backgroundColor: "black",
            letterSpacing: "-1px",
          }}
          onClick={() =>
            open({
              title: "NUEVO PRODUCTO",
              initial: {
                name: "",
                brand: "",
                price: "",
                description: "",
                gender: "hombre",
                catalog: "",
                isActive: true,
                image: null,
              },
              onSubmit: handleCreateProduct,
            })
          }
        >
          Nuevo producto
        </Button>
      </Box>

      <DataGrid
        autoHeight
        rows={data?.data || []}
        getRowId={(r) => r._id}
        columns={cols}
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

      <ProductDialog {...dlg} open={dlg.open} onClose={close} />

      <StockMovementDialog
        open={stockDialog.open}
        onClose={closeStockDialog}
        productId={stockDialog.productId}
      />
    </Paper>
  );
};

export default ProductsPage;
