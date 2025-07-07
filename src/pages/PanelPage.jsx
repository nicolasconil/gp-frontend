import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
  Grid,
  CardActionArea,
} from "@mui/material";
import {
  PeopleAltOutlined,
  Inventory2Outlined,
  CategoryOutlined,
  ViewTimelineOutlined,
  LocalShippingOutlined,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { Outlet, useNavigate, useLocation, useNavigate as useRouterNavigate } from "react-router-dom";
import { Suspense } from "react";
import LinearProgress from "@mui/material/LinearProgress";
import { useAuth } from "../context/AuthContext.jsx";

const menu = [
  { to: "users", label: "Usuarios", icon: <PeopleAltOutlined fontSize="large" /> },
  { to: "products", label: "Productos", icon: <Inventory2Outlined fontSize="large" /> },
  { to: "catalogs", label: "Catálogos", icon: <CategoryOutlined fontSize="large" /> },
  { to: "orders", label: "Órdenes", icon: <ViewTimelineOutlined fontSize="large" /> },
  { to: "shippings", label: "Envíos", icon: <LocalShippingOutlined fontSize="large" /> },
];

const PanelPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  return (
    <Box>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{ backgroundColor: "white", color: "black" }}
      >
        <Toolbar sx={{ justifyContent: "space-between", px: { xs: 1, md: 4 }, py: { xs: 0.5, md: 1 } }}>
          <Box
            component="a"
            href="/"
            sx={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              "&:after": {
                content: '""',
                position: "absolute",
                bottom: "-2px",
                left: "10%",
                width: { xs: "94%", md: "96%" },
                height: "3px",
                backgroundColor: "#000",
              },
              "&:before": {
                content: '""',
                position: "absolute",
                top: 4,
                right: "-2px",
                width: "3px",
                height: "95%",
                backgroundColor: "#000",
              },
            }}
          >
            <img src="/logo.svg" alt="logo" style={{ height: 45 }} />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", ml: "auto" }}>
            {isAuthenticated && (
              <Tooltip title="Cerrar sesión">
                <IconButton onClick={logout} size="large" sx={{ color: "black" }}>
                  <LogoutIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ mt: 10, px: 3 }}>

        <Typography variant="h4" fontWeight={900} textAlign="center" mb={4} sx={{ fontFamily: '"Archivo Black", sans-serif', textTransform: 'uppercase', fontSize: '3rem', letterSpacing: '-6.5px', textDecoration: 'underline' }}>
          Panel administrativo
        </Typography>

        <Grid container spacing={3} justifyContent="center" sx={{ mb: 4 }}>
          {menu.map(({ to, label, icon }) => (
            <Grid key={to}>
              <CardActionArea
                onClick={() => navigate(to)}
                sx={{
                  position: "relative",
                  width: 140,
                  height: 140,
                  border: "3px solid black",
                  borderRadius: "4px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  px: 2,

                  "&:after": {
                    content: '""',
                    position: "absolute",
                    bottom: -7,
                    left: 4,
                    width: "100%",
                    height: "6px",
                    backgroundColor: "black",
                    borderRadius: "2px",
                  },
                  "&:before": {
                    content: '""',
                    position: "absolute",
                    top: 3,
                    right: -7,
                    width: "6px",
                    height: "103%",
                    backgroundColor: "black",
                    borderRadius: "2px",
                  },
                }}
              >
                {icon}
                <Typography
                  fontWeight={600}
                  fontSize="1rem"
                  mt={1.4}
                  sx={{ whiteSpace: "nowrap", fontFamily: '"Archivo Black", sans-serif', letterSpacing: '-1px' }}
                >
                  {label}
                </Typography>
              </CardActionArea>
            </Grid>
          ))}
        </Grid>

        <Suspense fallback={<LinearProgress />}> <Outlet /> </Suspense>
      </Box>
    </Box>
  );
};

export default PanelPage;
