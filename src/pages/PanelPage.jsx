import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  Paper,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  getAllUsers,
  getAllOrders,
  getAllShippings,
  getStockMovementsByProduct,
  createProduct,
  createCatalog,
  updateProduct,
  deleteProduct,
  updateCatalog,
  deleteCatalog,
} from "../api/admin.api.js";
import { useAuth } from "../context/AuthContext.jsx";

const PanelPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [shippings, setShippings] = useState([]);
  const [movements, setMovements] = useState([]);
  const [products, setProducts] = useState([]);
  const [catalogs, setCatalogs] = useState([]);

  const [openProductDialog, setOpenProductDialog] = useState(false);
  const [openCatalogDialog, setOpenCatalogDialog] = useState(false);
  const [productData, setProductData] = useState({ name: '', price: '', description: '', image: null });
  const [catalogName, setCatalogName] = useState('');
  const [editingProductId, setEditingProductId] = useState(null);
  const [editingCatalogId, setEditingCatalogId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const [usersRes, ordersRes, shippingsRes] = await Promise.all([
          getAllUsers(),
          getAllOrders(token),
          getAllShippings(token),
        ]);

        setUsers(usersRes.data);
        setOrders(ordersRes.data);
        setShippings(shippingsRes.data);

        if (ordersRes.data.length > 0) {
          const exampleProductId = ordersRes.data[0].items[0]?.productId;
          if (exampleProductId) {
            const movementsRes = await getStockMovementsByProduct(exampleProductId, token);
            setMovements(movementsRes.data);
          }
        }
      } catch (err) {
        console.error("Error al cargar datos administrativos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCreateProduct = async () => {
    try {
      const token = localStorage.getItem("token");
      if (editingProductId) {
        await updateProduct(editingProductId, productData, token);
        alert("Producto actualizado exitosamente.");
      } else {
        await createProduct(productData, token);
        alert("Producto creado exitosamente.");
      }
      setOpenProductDialog(false);
      setProductData({ name: '', price: '', description: '', image: null });
      setEditingProductId(null);
    } catch (err) {
      console.error("Error al guardar producto:", err);
    }
  };

  const handleCreateCatalog = async () => {
    try {
      const token = localStorage.getItem("token");
      if (editingCatalogId) {
        await updateCatalog(editingCatalogId, { name: catalogName }, token);
        alert("Catálogo actualizado exitosamente.");
      } else {
        await createCatalog({ name: catalogName }, token);
        alert("Catálogo creado exitosamente.");
      }
      setOpenCatalogDialog(false);
      setCatalogName('');
      setEditingCatalogId(null);
    } catch (err) {
      console.error("Error al guardar catálogo:", err);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await deleteProduct(id, token);
      alert("Producto eliminado.");
    } catch (err) {
      console.error("Error eliminando producto:", err);
    }
  };

  const handleDeleteCatalog = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await deleteCatalog(id, token);
      alert("Catálogo eliminado.");
    } catch (err) {
      console.error("Error eliminando catálogo:", err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" mb={3}>
        Panel de administración
      </Typography>

      <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
        <Button variant="contained" onClick={() => setOpenProductDialog(true)}>Crear Producto</Button>
        <Button variant="contained" onClick={() => setOpenCatalogDialog(true)}>Crear Catálogo</Button>
      </Box>

      {/* Aquí podrías listar productos y catálogos */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6">Productos</Typography>
        <Divider sx={{ my: 1 }} />
        {products.map((p) => (
          <Box key={p._id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography>{p.name}</Typography>
            <Box>
              <IconButton onClick={() => { setProductData(p); setEditingProductId(p._id); setOpenProductDialog(true); }}><EditIcon /></IconButton>
              <IconButton onClick={() => handleDeleteProduct(p._id)}><DeleteIcon /></IconButton>
            </Box>
          </Box>
        ))}
      </Paper>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6">Catálogos</Typography>
        <Divider sx={{ my: 1 }} />
        {catalogs.map((c) => (
          <Box key={c._id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography>{c.name}</Typography>
            <Box>
              <IconButton onClick={() => { setCatalogName(c.name); setEditingCatalogId(c._id); setOpenCatalogDialog(true); }}><EditIcon /></IconButton>
              <IconButton onClick={() => handleDeleteCatalog(c._id)}><DeleteIcon /></IconButton>
            </Box>
          </Box>
        ))}
      </Paper>

      <Dialog open={openProductDialog} onClose={() => setOpenProductDialog(false)}>
        <DialogTitle>{editingProductId ? 'Editar producto' : 'Crear nuevo producto'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="Nombre" value={productData.name} onChange={(e) => setProductData({ ...productData, name: e.target.value })} />
          <TextField label="Precio" value={productData.price} onChange={(e) => setProductData({ ...productData, price: e.target.value })} type="number" />
          <TextField label="Descripción" multiline rows={3} value={productData.description} onChange={(e) => setProductData({ ...productData, description: e.target.value })} />
          <Button variant="outlined" component="label">
            Cargar imagen
            <input type="file" hidden onChange={(e) => setProductData({ ...productData, image: e.target.files[0] })} />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenProductDialog(false)}>Cancelar</Button>
          <Button onClick={handleCreateProduct} variant="contained">{editingProductId ? 'Actualizar' : 'Crear'}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openCatalogDialog} onClose={() => setOpenCatalogDialog(false)}>
        <DialogTitle>{editingCatalogId ? 'Editar catálogo' : 'Crear nuevo catálogo'}</DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <TextField label="Nombre del catálogo" fullWidth value={catalogName} onChange={(e) => setCatalogName(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCatalogDialog(false)}>Cancelar</Button>
          <Button onClick={handleCreateCatalog} variant="contained">{editingCatalogId ? 'Actualizar' : 'Crear'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PanelPage;
