import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Grid,
  Alert,
  Typography,
  Box,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteIcon from "@mui/icons-material/Delete";
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

const toPreviewUrl = (file) =>
  typeof file === "string" ? file : URL.createObjectURL(file);

const ProductDialog = ({ open, onClose, onSubmit, initial = {}, title }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const thumbSize = isMobile ? 64 : 96;

  const [form, setForm] = useState({});
  const [newFiles, setNewFiles] = useState([]); // Files selected now (Array of File)
  const [existingImages, setExistingImages] = useState([]); // URLs already on product
  const [imagesToKeep, setImagesToKeep] = useState([]); // subset of existingImages to keep
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
    });

    const imgs = Array.isArray(initial.images) && initial.images.length
      ? initial.images
      : initial.image
        ? [initial.image]
        : [];

    setExistingImages(imgs);
    setImagesToKeep(imgs.slice());
    setNewFiles([]);
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
      const filesArr = Array.from(e.dataTransfer.files);
      setNewFiles((prev) => [...prev, ...filesArr]);
      e.dataTransfer.clearData();
    }
  }, []);

  const handleFilesSelected = (e) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setNewFiles((prev) => [...prev, ...files]);
  };

  const removeNewFile = (index) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (url) => {
    setExistingImages((prev) => prev.filter((u) => u !== url));
    setImagesToKeep((prev) => prev.filter((u) => u !== url));
  };

  const toggleKeepExisting = (url) => {
    setImagesToKeep((prev) =>
      prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]
    );
  };

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
    setVariations((prev) => (Array.isArray(prev) ? prev.filter((_, i) => i !== index) : []));
  };

  const submit = () => {
    if ((imagesToKeep.length === 0) && newFiles.length === 0) {
      setError("Debes seleccionar al menos una imagen (subir nueva o conservar alguna existente).");
      return;
    }
    if (variations.length === 0) {
      setError("Agregá al menos una combinación de talle y color.");
      return;
    }

    const payload = {
      ...form,
      _id: initial._id,
      variations: variations.map((v) => ({ ...v, product: initial._id })),
      newImages: newFiles,
      imagesToKeep,
    };

    onSubmit(payload);
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
        {title || (initial._id ? "EDITAR PRODUCTO" : "NUEVO PRODUCTO")}
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
                multiple
                onChange={handleFilesSelected}
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
                {newFiles.length ? `${newFiles.length} archivo(s) seleccionado(s)` : "Arrastrá imágenes o hacé click (podés subir múltiples)"}
              </Typography>
            </Box>

            {existingImages.length > 0 && (
              <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                {existingImages.map((url, idx) => (
                  <Box key={idx} sx={{ position: 'relative', width: thumbSize, height: thumbSize }}>
                    <img
                      src={toPreviewUrl(url)}
                      alt={`existing-${idx}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: 6,
                        border: imagesToKeep.includes(url) ? '2px solid #ccc' : '2px solid #ccc',
                        display: 'block',
                      }}
                    />
                    <Box sx={{ position: 'absolute', right: 2, top: 2, display: 'flex', gap: 0.5 }}>
                      <IconButton
                        size="small"
                        onClick={() => removeExistingImage(url)}
                        sx={{ backgroundColor: 'rgba(255,255,255,0.8)' }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}

            {/* new files previews */}
            {newFiles.length > 0 && (
              <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                {newFiles.map((f, i) => (
                  <Box key={i} sx={{ position: 'relative', width: thumbSize, height: thumbSize }}>
                    <img
                      src={toPreviewUrl(f)}
                      alt={`new-${i}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 6 }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => removeNewFile(i)}
                      sx={{ position: 'absolute', top: 4, right: 4, backgroundColor: 'rgba(255,255,255,0.9)' }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            )}
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
