import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Alert,
  TextField,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const rolesToPanel = ["administrador", "moderador"];

const LoginPage = () => {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  if (isAuthenticated) {
    return rolesToPanel.includes(user?.role)
      ? <Navigate to="/panel" replace />
      : <Navigate to="/" replace />;
  }

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const loggedUser = await login(form);
      const dest = rolesToPanel.includes((loggedUser || user)?.role)
        ? "/panel"
        : "/";
      navigate(dest);
    } catch (err) {
      setError(err?.response?.data?.message || "Error al iniciar sesión");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ width: "90%", maxWidth: 400, mx: "auto", mt: 6 }}
    >
      <Typography variant="h4"
        mb={5}
        fontWeight={900}
        sx={{
          fontFamily: '"Archivo Black", sans-serif',
          letterSpacing: '-4.5px',
          textTransform: 'uppercase',
          color: 'black',
          cursor: 'default',
          textDecoration: 'underline',
          fontSize: { xs: '3.05rem', md: '3.25rem' }
        }}
      >
        INICIAR SESIÓN
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Campo Email */}
      <Box sx={{ position: "relative", mb: 4 }}>
        <TextField
          name="email"
          placeholder="CORREO ELECTRÓNICO"
          variant="outlined"
          fullWidth
          value={form.email}
          onChange={handleChange}
          required
          InputProps={{
            sx: {
              border: '3px solid black',
              borderRadius: 1,
              backgroundColor: 'white',
              height: '45px',
              '& input': {
                py: '10px',
                pr: '40px',
                pl: '10px',
              },
            },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': { border: '1px solid white' },
              '&:hover fieldset': { border: '1px solid white' },
              '&.Mui-focused fieldset': { border: '1px solid white' },
            },
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -4,
            left: 6,
            width: "99.5%",
            height: "5px",
            backgroundColor: "black",
            borderRadius: "2px",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: 5,
            right: -4,
            width: "5px",
            height: "98%",
            backgroundColor: "black",
            borderRadius: "2px",
          }}
        />
      </Box>

      {/* Campo Contraseña con botón de mostrar/ocultar */}
      <Box sx={{ position: "relative", mb: 5 }}>
        <TextField
          name="password"
          placeholder="CONTRASEÑA"
          type={showPassword ? "text" : "password"}
          variant="outlined"
          fullWidth
          value={form.password}
          onChange={handleChange}
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword((prev) => !prev)}
                  edge="end"
                  sx={{ color: 'lightgrey' }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
            sx: {
              border: '3px solid black',
              borderRadius: 1,
              backgroundColor: 'white',
              height: '45px',
              paddingRight: '15px', 
              '& input': {
                py: '10px',
                pl: '10px',
              },
            },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': { border: '1px solid white' },
              '&:hover fieldset': { border: '1px solid white' },
              '&.Mui-focused fieldset': { border: '1px solid white' },
            },
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -4,
            left: 6,
            width: "99.5%",
            height: "5px",
            backgroundColor: "black",
            borderRadius: "2px",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: 5,
            right: -4,
            width: "5px",
            height: "98%",
            backgroundColor: "black",
            borderRadius: "2px",
          }}
        />
      </Box>

      <Button
        variant="contained"
        type="submit"
        fullWidth
        sx={{
          mt: 1,
          color: 'white',
          backgroundColor: 'black',
          position: 'relative',
          '&:hover': { backgroundColor: '#333' },
          border: '2px solid black',
          borderRadius: '3px'
        }}
      >
        Entrar
        <Box
          sx={{
            position: "absolute",
            bottom: -7,
            left: 6,
            width: "99.5%",
            height: "7px",
            backgroundColor: "black",
            borderRadius: "2px",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: 5,
            right: -7,
            width: "7px",
            height: "105%",
            backgroundColor: "black",
            borderRadius: "2px",
          }}
        />
      </Button>
    </Box>
  );
};

export default LoginPage;
