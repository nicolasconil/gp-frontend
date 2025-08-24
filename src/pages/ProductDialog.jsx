import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, MenuItem, Grid, Alert, Typography, Box, IconButton } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useState, useEffect, useCallback } from "react";

const genderOptions = [
  { value: "hombre", label: "Hombre" },
  { value: "mujer", label: "Mujer" },
  { value: "niños", label: "Niños" },
  { value: "unisex", label: "Unisex" },
];

const customInputStyles = {
  fontFamily: '"Archivo Black", sans-serif',
  "& label": {
    color: "black",
    fontFamily: '"Archivo Black", sans-serif',
  },
  "& label.Mui-focused": {
    color: "black",
  },
  "& .MuiInputLabel-outlined": {
    backgroundColor: "white",
    padding: "0 4px",
    transform: "translate(14px, 12px) scale(1)",
  },
  "& .MuiInputLabel-outlined.MuiInputLabel-shrink": {
    transform: "translate(14px, -9px) scale(0.75)",
  },
  "& .MuiOutlinedInput-root": {
    borderRadius: "3px",
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
    "& input::placeholder": {
      color: "black",
    },
  },
};

const ProductDialog = ({ open, onClose, onSubmit, initial = {}, title }) => {
  const [form, setForm] = useState({});
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const [variations, setVariations] = useState([]);
  const [currentSize, setCurrentSize] = useState("");
  const [currentColor, setCurrentColor] = useState("");
  const [currentStock, setCurrentStock] = useState("");

  useEffect(() => {
    if (!open) return;

    setForm({
      name: initial.name || "",
      brand: initial.brand || "",
      price: initial.price || 0,
      description: initial.description || "",
      gender: initial.gender || "hombre",
      catalog: initial.catalog || "",
      isActive: initial.isActive ?? true,
      image: initial.image || null,
    });

    setFile(null);
    setError("");
    setVariations(initial.variations || []);
    setCurrentSize("");
    setCurrentColor("");
    setCurrentStock("");
  }, [open, initial]);

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  }, []);

  const addVariation = () => {
    if (!currentSize || !currentColor || !currentStock) {
      setError("Completá talle, color y stock para agregar la combinación.");
      return;
    }

    const exists = variations.some(
      (v) =>
        v.size === Number(currentSize) &&
        v.color.toLowerCase() === currentColor.toLowerCase()
    );
    if (exists) {
      setError("Esa combinación ya fue agregada.");
      return;
    }

    const newVar = {
      size: Number(currentSize),
      color: currentColor.trim().toLowerCase(),
      stock: Number(currentStock),
      product: initial._id,
    };
    setVariations((prev) => [...(Array.isArray(prev) ? prev : []), newVar]);
    setCurrentSize("");
    setCurrentColor("");
    setCurrentStock("");
    setError("");
  };

  const removeVariation = (index) => {
    setVariations((prev) => Array.isArray(prev) ? prev.filter((_, i) => i !== index) : []);
  };

  const submit = () => {
    if (!file && !form.image) {
      setError("Debes seleccionar una imagen.");
      return;
    }
    if (variations.length === 0) {
      setError("Agregá al menos una combinación de talle y color.");
      return;
    };

    onSubmit({
      ...form,
      _id: initial._id,
      variations: variations.map((v) => ({
        ...v,
        product: initial._id,
      })),
      image: file || form.image,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          fontFamily: '"Archivo Black", sans-serif',
          fontSize: 22,
          textAlign: "center",
          letterSpacing: '-2px',
        }}
      >
        {title || "EDITAR PRODUCTO"} 
      </DialogTitle>

      <DialogContent dividers sx={{ px: 4, py: 3 }}>
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2, fontFamily: '"Archivo Black", sans-serif' }}
          >
            {error}
          </Alert>
        )}

        <Grid container spacing={3} direction="column">
          <Grid item xs={12}>
            <TextField
              label="Nombre"
              fullWidth
              value={form.name}
              onChange={handleChange("name")}
              sx={customInputStyles}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Marca"
              fullWidth
              value={form.brand}
              onChange={handleChange("brand")}
              sx={customInputStyles}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Precio"
              type="number"
              fullWidth
              value={form.price}
              onChange={handleChange("price")}
              sx={customInputStyles}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Género"
              select
              fullWidth
              value={form.gender}
              onChange={handleChange("gender")}
              sx={customInputStyles}
            >
              {genderOptions.map((o) => (
                <MenuItem key={o.value} value={o.value}>
                  {o.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Descripción"
              multiline
              minRows={3}
              fullWidth
              value={form.description}
              onChange={handleChange("description")}
              sx={customInputStyles}
            />
          </Grid>

          <Grid item xs={12}>
            <Box
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              sx={{
                border: "2px dashed #bbb",
                borderRadius: 2,
                p: 2,
                textAlign: "center",
                cursor: "pointer",
                backgroundColor: "#fafafa",
              }}
              onClick={() => document.getElementById("product-img-input").click()}
            >
              <input
                id="product-img-input"
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => setFile(e.target.files[0])}
              />
              <IconButton disableRipple>
                <UploadFileIcon fontSize="large" />
              </IconButton>
              <Typography
                sx={{
                  fontFamily: '"Archivo Black", sans-serif',
                  letterSpacing: "-1.25px",
                }}
              >
                {file ? file.name : "Arrastrá una imagen o hacé click"}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                fontFamily: '"Archivo Black", sans-serif',
                letterSpacing: "-1.25px",
              }}
            >
              Combinaciones de talle y color
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Color"
              fullWidth
              value={currentColor}
              onChange={(e) => setCurrentColor(e.target.value)}
              sx={customInputStyles}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Talle"
              type="number"
              fullWidth
              value={currentSize}
              onChange={(e) => setCurrentSize(e.target.value)}
              sx={customInputStyles}
              inputProps={{ min: 0 }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Stock"
              type="number"
              fullWidth
              value={currentStock}
              onChange={(e) => setCurrentStock(e.target.value)}
              sx={customInputStyles}
              inputProps={{ min: 0 }}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              onClick={addVariation}
              fullWidth
              sx={{
                fontFamily: '"Archivo Black", sans-serif',
                backgroundColor: "black",
                color: "white",
                textTransform: "none",
                ":hover": { backgroundColor: "#222" },
                ":focus": {
                  outline: "2px solid black",
                  outlineOffset: "0px",
                },
              }}
            >
              Agregar combinación de talle y color
            </Button>
          </Grid>

          <Grid item xs={12}>
            {variations.map((v, i) => (
              <Box
                key={i}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                border="1px solid #ccc"
                borderRadius={2}
                px={2}
                py={1}
                mb={1}
              >
                <Typography sx={{ fontFamily: '"Archivo Black", sans-serif' }}>
                  Talle {v.size} - Color {v.color} - Stock: {v.stock}
                </Typography>
                <Button
                  size="small"
                  color="error"
                  onClick={() => removeVariation(i)}
                  sx={{ fontFamily: '"Archivo Black", sans-serif' }}
                >
                  Eliminar
                </Button>
              </Box>
            ))}
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={onClose}
          sx={{
            fontFamily: '"Archivo Black", sans-serif',
            textTransform: "none",
            color: "black",
          }}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={submit}
          sx={{
            fontFamily: '"Archivo Black", sans-serif',
            backgroundColor: "black",
            color: "white",
            textTransform: "none",
            ":hover": { backgroundColor: "#222" },
            ":focus": {
              outline: "2px solid black",
              outlineOffset: "0px",
            },
          }}
        >
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductDialog;