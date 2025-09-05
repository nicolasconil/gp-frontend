import React, { cloneElement, Suspense, useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
  Grid,
  CardActionArea,
  useMediaQuery,
  useTheme,
  LinearProgress,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  PeopleAltOutlined,
  Inventory2Outlined,
  CategoryOutlined,
  ViewTimelineOutlined,
  LocalShippingOutlined,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { Outlet, useNavigate } from "react-router-dom";
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
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  return (
    <Box>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{ backgroundColor: "white", color: "black" }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            px: { xs: 1, md: 4 },
            py: { xs: 0.5, md: 1 },
          }}
        >
          {!isMdUp ? (
            <IconButton
              edge="start"
              aria-label="Abrir menú"
              onClick={openDrawer}
              size="large"
              sx={{ color: "black" }}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ width: 48, display: "flex", alignItems: "center" }} />
          )}

          <Box
            component="a"
            href="/"
            sx={{
              position: isMdUp ? "absolute" : "relative",
              left: isMdUp ? "50%" : "0",
              transform: isMdUp ? "translateX(-50%)" : "none",
              zIndex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mx: isMdUp ? 0 : 1,
              "&:after": isMdUp
                ? {
                    content: '""',
                    position: "absolute",
                    bottom: "-2px",
                    left: { md: "10%" },
                    width: { md: "95%" },
                    height: "3px",
                    backgroundColor: "#000",
                  }
                : undefined,
              "&:before": isMdUp
                ? {
                    content: '""',
                    position: "absolute",
                    top: 4,
                    right: "-2px",
                    width: "3px",
                    height: "95%",
                    backgroundColor: "#000",
                  }
                : undefined,
            }}
          >
            <img
              src="/logo.svg"
              alt="logo"
              style={{
                height: isMdUp ? 45 : 36,
                display: "block",
                objectFit: "contain",
              }}
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", ml: "auto" }}>
            {isAuthenticated && (
              <Tooltip title="Cerrar sesión">
                <IconButton
                  onClick={logout}
                  size="large"
                  sx={{ color: "black" }}
                  aria-label="Cerrar sesión"
                >
                  <LogoutIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={closeDrawer}
        ModalProps={{ keepMounted: true }}
      >
        <Box sx={{ width: 260 }} role="presentation">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 2,
              py: 1.5,
            }}
          >
            <Typography variant="h6" sx={{ fontFamily: '"Archivo Black", sans-serif' }}>
              Panel
            </Typography>
            <IconButton onClick={closeDrawer} aria-label="Cerrar menú" size="large">
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider />

          <List>
            {menu.map(({ to, label, icon }) => (
              <ListItemButton
                key={to}
                onClick={() => {
                  navigate(to);
                  closeDrawer();
                }}
                aria-label={`Ir a ${label}`}
              >
                <ListItemIcon>
                  {icon}
                </ListItemIcon>
                <ListItemText primary={label} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ mt: { xs: 9, md: 10 }, px: { xs: 2, md: 3 } }}>
        <Typography
          variant="h4"
          fontWeight={400}
          textAlign="center"
          mb={4}
          sx={{
            fontFamily: '"Archivo Black", sans-serif',
            fontSize: { xs: "1.05rem", sm: "1.6rem", md: "3rem" },
            textTransform: { xs: "none", md: "uppercase" },
            letterSpacing: { xs: "0px", md: "-6px" },
            lineHeight: { xs: 1.15, md: 1 },
            whiteSpace: "normal",
            wordBreak: "break-word",
            maxWidth: { xs: "100%", sm: "80%", md: "auto" },
            mx: "auto",
            textDecoration: "underline",
            textDecorationThickness: { xs: "2px", md: "auto" },
            textUnderlineOffset: { xs: "6px", md: "3px" },
          }}
        >
          {isSmDown ? "Panel" : "Panel administrativo"}
        </Typography>

        <Grid
          container
          spacing={2}
          justifyContent="center"
          sx={{ mb: 4 }}
          alignItems="stretch"
        >
          {menu.map(({ to, label, icon }) => {
            const tileIcon = cloneElement(icon, {
              sx: { mb: 1 },
              "aria-hidden": true,
            });

            return (
              <Grid
                key={to}
                item
                xs={6} 
                sm={4} 
                md={2} 
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <CardActionArea
                  onClick={() => navigate(to)}
                  aria-label={`Ir a ${label}`}
                  sx={{
                    position: "relative",
                    width: { xs: 110, sm: 140, md: 160 },
                    height: { xs: 110, sm: 140, md: 160 },
                    minWidth: { xs: 110 },
                    border: "3px solid black",
                    borderRadius: "6px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    px: 2,
                    py: 1,
                    backgroundColor: "transparent",
                    "& .MuiTouchRipple-root": { borderRadius: "6px" },
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
                  {tileIcon}
                  <Typography
                    component="span"
                    fontWeight={400}
                    fontSize={{ xs: "0.85rem", sm: "1rem" }}
                    mt={0.8}
                    sx={{
                      whiteSpace: "nowrap",
                      fontFamily: '"Archivo Black", sans-serif',
                      letterSpacing: "-1px",
                    }}
                  >
                    {label}
                  </Typography>
                </CardActionArea>
              </Grid>
            );
          })}
        </Grid>

        <Suspense fallback={<LinearProgress />}>
          <Outlet />
        </Suspense>
      </Box>
    </Box>
  );
};

export default PanelPage;
