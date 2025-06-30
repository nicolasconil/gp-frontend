import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { Box, Typography } from "@mui/material";

const PrivateRoute = ({ children, roles = [] }) => {
    const { isAuthenticated, user, authLoading } = useAuth();

    if (authLoading) return null;

    if (!isAuthenticated) return <Navigate to="/login" replace />;

    if (roles.length && !roles.includes(user.role)) {
        return (
            <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h5" mb={1}> Acceso denegado </Typography>
                <Typography> Necesitas permisos de administrador o moderador </Typography>
                <Navigate to="/" replace />
            </Box>
        )
    }

    return children;
};

export default PrivateRoute;