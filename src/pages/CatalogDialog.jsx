import { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Grid, Alert } from "@mui/material";
import PropTypes from "prop-types";

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

const CatalogDialog = ({ open, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
      });
    } else {
      setFormData({ name: "", description: "" });
    }
    setError("");
  }, [initialData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{
          fontFamily: '"Archivo Black", sans-serif',
          fontSize: 22,
          textAlign: "center",
          letterSpacing: "-2px",
        }}
      >
        {initialData ? "EDITAR CATÁLOGO" : "NUEVO CATÁLOGO"}
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
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              sx={customInputStyles}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Descripción"
              name="description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
              multiline
              minRows={3}
              sx={customInputStyles}
            />
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
          onClick={handleSubmit}
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
          {initialData ? "Actualizar" : "Crear"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

CatalogDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.object,
};

export default CatalogDialog;
