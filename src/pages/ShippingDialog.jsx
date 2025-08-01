import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button,
  Alert,
  Typography,
  Box,
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

const ShippingDialog = ({ open, onClose, shipping, onSubmit, order }) => {
  const [form, setForm] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    if (open && shipping) {
      setForm({
        status: shipping.status || "pendiente",
        shippingTrackingNumber: shipping.shippingTrackingNumber || "",
        carrier: shipping.carrier || "",
        method: shipping.method || "",
      });
      setError("");
    }
  }, [open, shipping]);

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
    if (form.status === "en camino" && !form.shippingTrackingNumber?.trim()) {
      setError("Debes ingresar el número de seguimiento para marcar como 'en camino'.");
      return;
    }
    const payload = {
      status: form.status,
      shippingTrackingNumber: form.shippingTrackingNumber,
      carrier: form.carrier,
      method: form.method,
    };
    onSubmit(order._id, payload);
  };

  if (!order) {
    return null;
  }

  const capitalizeWords = (str) =>
    str.replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          fontFamily: '"Archivo Black", sans-serif',
          fontSize: 22,
          textAlign: "center",
          letterSpacing: "-2px",
          textDecoration: 'underline'
        }}
      >
        Estado de envío
      </DialogTitle>
      <DialogContent dividers sx={{ px: 4, py: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2, fontFamily: '"Archivo Black", sans-serif' }}>
            {error}
          </Alert>
        )}
        <Box>
          <Typography variant="h5" sx={{ fontFamily: '"Archivo Black", sans-serif', letterSpacing: "-1.25px" }}>
            Orden #{order._id}
          </Typography>
          <Typography variant="h6" sx={{ fontFamily: '"Archivo Black", sans-serif', letterSpacing: "-1.25px", mt: 2, textDecoration: 'underline' }}>
            Cliente:
          </Typography>
          <Typography variant="body1" sx={{ ml: 1 }}>
            <strong>Nombre:</strong> {order.guestName || "Invitado"}
          </Typography>
          <Typography variant="body1" sx={{ ml: 1 }}>
            <strong>Email:</strong> {order.guestEmail || "Invitado"}
          </Typography>
          <Typography variant="body1" sx={{ ml: 1 }}> <strong> Teléfono: </strong> {order.guestPhone || "No disponible"} </Typography>
          <Typography variant="body1" sx={{ ml: 1 }}>
            <strong> Fecha de creación de orden: </strong>{" "}
            {order.createdAt
              ? new Date(order.createdAt).toLocaleString("es-AR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
              : "No disponible"}
          </Typography>
          {order.guestAddress ? (
            <Box mt={1}>
              <Typography variant="h6" sx={{ fontFamily: '"Archivo Black", sans-serif', letterSpacing: "-1.25px", textDecoration: "underline" }}>
                Dirección de envío:
              </Typography>
              <Typography variant="body1" sx={{ ml: 1 }}>
                {order.guestAddress.street} {order.guestAddress.number}
                {order.guestAddress.apartment ? `, Dpto ${order.guestAddress.apartment}` : ""}
                {order.guestAddress.floor ? `, Piso ${order.guestAddress.floor}` : ""}
              </Typography>
              <Typography variant="body1" sx={{ ml: 1 }}>
                {order.guestAddress.city}, {order.guestAddress.province}, CP {order.guestAddress.postalCode}
              </Typography>
            </Box>
          ) : (
            <Typography variant="body2" sx={{ ml: 1 }}>Sin dirección cargada.</Typography>
          )}
        </Box>
        <Box mt={1}>
          <Typography variant="h6" sx={{ fontFamily: '"Archivo Black", sans-serif', letterSpacing: '-1.25px', textDecoration: 'underline' }}>
            Productos:
          </Typography>
          {order.products?.length ? (
            order.products.map((p, idx) => (
              <Box key={idx} sx={{ ml: 1 }}>
                <Typography variant="body1">
                  - {p.product?.name ? capitalizeWords(p.product.name) : 'Producto no disponible'} ({p.color || 'sin color'}, {p.size || 'sin talle'}) x{p.quantity} - ${p.price}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography variant="body2" sx={{ ml: 1 }}> Sin productos. </Typography>
          )}
        </Box>
        <Box mt={1}>
          <Typography variant="h6" sx={{ fontFamily: '"Archivo Black", sans-serif', letterSpacing: "-1.25px", textDecoration: "underline" }}>
            Estado de la orden:
          </Typography>
          <Typography variant="body1" sx={{ ml: 1 }}>
            {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : "Estado no disponible"}
          </Typography>
        </Box>
        <Box mt={1}>
          <Typography variant="h6" sx={{ fontFamily: '"Archivo Black", sans-serif', letterSpacing: "-1.25px", textDecoration: "underline" }}>
            Detalles del envío:
          </Typography>
        </Box>
        <TextField
          label="Transportista"
          name="carrier"
          value={form.carrier}
          onChange={handleChange}
          fullWidth
          sx={{ ...customInputStyles, mt: 2 }}
          placeholder="Ej: Correo Argentino"
          disabled={form.status !== "en camino"}
        />
        <TextField
          label="Método de envío"
          name="method"
          value={form.method}
          onChange={handleChange}
          fullWidth
          sx={{ ...customInputStyles, mt: 3 }}
          placeholder="Ej: Estándar, Express, Sucursal, etc."
          disabled={form.status !== "en camino"}
        />
        <Box mt={1}>
          <Typography variant="h6" sx={{ fontFamily: '"Archivo Black", sans-serif', letterSpacing: "-1.25px", textDecoration: "underline" }}>
            Cambiar estado del envío:
          </Typography>
        </Box>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Estado del envío"
            name="status"
            select
            value={form.status}
            onChange={handleChange}
            fullWidth
            sx={{ ...customInputStyles, mt: 2 }}
          >
            {["pendiente", "preparando", "en camino", "entregado", "rechazado", "devuelto"].map((option) => (
              <MenuItem key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </MenuItem>
            ))}
          </TextField>

          {form.status === "en camino" && (
            <TextField
              label="Código de seguimiento"
              name="shippingTrackingNumber"
              value={form.shippingTrackingNumber}
              onChange={handleChange}
              fullWidth
              sx={{ ...customInputStyles, mt: 3 }}
            />
          )}
          <DialogActions sx={{ px: 0, mt: 5 }}>
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
  order: PropTypes.object.isRequired,
};

export default ShippingDialog;
