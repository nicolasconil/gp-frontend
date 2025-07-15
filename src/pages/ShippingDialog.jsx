import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  Button,
  Typography,
  Alert,
} from "@mui/material";

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

const ShippingDialog = ({ open, onClose, shipping, onSubmit }) => {
  const [form, setForm] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    if (shipping) {
      setForm({
        shippingCarrier: shipping.shippingCarrier || "",
        shippingMethod: shipping.shippingMethod || "",
        shippingTrackingNumber: shipping.shippingTrackingNumber || "",
        destinationPostalCode: shipping.destinationPostalCode || "",
        fullName: shipping.deliveryAddress?.fullName || "",
        phone: shipping.deliveryAddress?.phone || "",
        street: shipping.deliveryAddress?.street || "",
        number: shipping.deliveryAddress?.number || "",
        apartment: shipping.deliveryAddress?.apartment || "",
        city: shipping.deliveryAddress?.city || "",
        province: shipping.deliveryAddress?.province || "",
        notes: shipping.notes || "",
        shippingCost: shipping.shippingCost || "",
        status: shipping.status || "",
      });
      setError("");
    }
  }, [shipping]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.status) {
      setError("Debes seleccionar un estado de envío.");
      return;
    }
    onSubmit(shipping._id, form.status);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          fontFamily: '"Archivo Black", sans-serif',
          fontSize: 22,
          textAlign: "center",
          letterSpacing: "-2px",
        }}
      >
        Editar Envío
      </DialogTitle>

      <DialogContent dividers sx={{ px: 4, py: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2, fontFamily: '"Archivo Black", sans-serif' }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {Object.entries(form).map(([key, value]) => (
              key !== "status" && (
                <Grid item xs={12} sm={key === "street" || key === "city" || key === "province" ? 6 : 12} key={key}>
                  <TextField
                    label={key.replace(/([A-Z])/g, ' $1').toUpperCase()}
                    name={key}
                    value={value}
                    onChange={handleChange}
                    fullWidth
                    sx={customInputStyles}
                  />
                </Grid>
              )
            ))}
            <Grid item xs={12}>
              <TextField
                label="Estado"
                name="status"
                select
                value={form.status}
                onChange={handleChange}
                fullWidth
                sx={customInputStyles}
              >
                {["pendiente", "preparando", "en camino", "entregado", "rechazado", "devuelto"].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
          <DialogActions sx={{ px: 0, py: 2 }}>
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
              type="submit"
              variant="contained"
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
        </form>
      </DialogContent>
    </Dialog>
  );
};

ShippingDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  shipping: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
};

export default ShippingDialog;
