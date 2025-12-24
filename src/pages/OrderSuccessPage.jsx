import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useLocation, Link } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Divider,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function OrderSuccessPage() {
  const query = useQuery();
  const orderId = query.get("external_reference");

  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("loading"); 
  const [message, setMessage] = useState("");

  const pollingRef = useRef(null);
  const attemptsRef = useRef(0);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  useEffect(() => {
    if (!orderId) {
      setStatus("error");
      setMessage("Orden inválida.");
      return;
    }

    attemptsRef.current = 0;
    setStatus("loading");

    let cancelTokenSource = axios.CancelToken.source();

    const fetchOrder = async () => {
      try {
        const res = await axios.get(`/api/orders/public/${orderId}`, {
          cancelToken: cancelTokenSource.token,
        });
        const o = res.data;

        if (!isMountedRef.current) return;

        setOrder(o);

        const payStatus = o?.payment?.status || o?.paymentStatus || o?.status;

        if (payStatus === "aprobado" || payStatus === "approved") {
          setStatus("approved");
          if (pollingRef.current) clearInterval(pollingRef.current);
        } else if (payStatus === "rechazado" || payStatus === "rejected") {
          setStatus("rejected");
          if (pollingRef.current) clearInterval(pollingRef.current);
        } else if (payStatus === "pendiente" || payStatus === "pending") {
          setStatus("pending");
        } else {
          setStatus("loading");
        }
      } catch (err) {
        if (axios.isCancel(err)) return;
        console.error("Error fetching order", err);
        if (!isMountedRef.current) return;
        setStatus("error");
        setMessage("No se pudo recuperar la orden.");
        if (pollingRef.current) clearInterval(pollingRef.current);
      }

      attemptsRef.current++;

      if (attemptsRef.current >= 15) {
        if (isMountedRef.current && (status === "loading" || status === "pending")) {
          setStatus("timeout");
        }
        if (pollingRef.current) clearInterval(pollingRef.current);
      }
    };

    fetchOrder();
    pollingRef.current = setInterval(fetchOrder, 2000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
      cancelTokenSource.cancel("Component unmounted");
    };
  }, [orderId]); 

  const Wrapper = ({ children }) => (
    <Box
      sx={{
        minHeight: "70vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
      }}
    >
      <Box sx={{ maxWidth: 760, width: "100%", textAlign: "center" }}>
        {children}
      </Box>
    </Box>
  );

  const Title = ({ children }) => (
    <Typography
      sx={{
        fontFamily: '"Archivo Black", sans-serif',
        fontSize: "clamp(1.8rem, 6vw, 3rem)",
        letterSpacing: "-3px",
        textTransform: "uppercase",
        mb: 2,
      }}
    >
      {children}
    </Typography>
  );

  const Text = ({ children }) => (
    <Typography sx={{ fontSize: "1rem", mb: 1.5 }}>{children}</Typography>
  );

  if (status === "loading") {
    return (
      <Box
        sx={{
          height: "60vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Box
          component="img"
          src="/logo1.svg"
          alt="Procesando pago"
          sx={{
            width: 120,
            opacity: 0.5,
            animation: "pulseOpacity 2s infinite ease-in-out",
          }}
        />
        <Typography
          sx={{
            mt: 2,
            fontFamily: '"Archivo Black", sans-serif',
            letterSpacing: "-0.1rem",
          }}
        >
          Procesando pago...
        </Typography>

        <style>
          {`
            @keyframes pulseOpacity {
              0% { opacity: 0.2; }
              50% { opacity: 1; }
              100% { opacity: 0.2; }
            }
          `}
        </style>
      </Box>
    );
  }

  if (status === "timeout") {
    return (
      <Wrapper>
        <Title>Pago en proceso</Title>
        <Text>Estamos procesando tu pago.</Text>
        <Text>Revisá tu correo en breve.</Text>
        <Button component={Link} to="/" sx={{ mt: 3, textDecoration: "underline", color: "black" }}>
          Volver al inicio
        </Button>
      </Wrapper>
    );
  }

  if (status === "pending") {
    return (
      <Wrapper>
        <HourglassBottomIcon color="warning" sx={{ fontSize: 60 }} />
        <Title>Pago pendiente</Title>
        <Text>Tu pago está siendo revisado.</Text>
        <Text>Te avisaremos por email.</Text>
      </Wrapper>
    );
  }

  if (status === "rejected") {
    return (
      <Wrapper>
        <CancelIcon color="error" sx={{ fontSize: 60 }} />
        <Title>Pago rechazado</Title>
        <Text>El pago no pudo completarse.</Text>
        <Button component={Link} to="/" sx={{ mt: 3, textDecoration: "underline", color: "black" }}>
          Volver al inicio
        </Button>
      </Wrapper>
    );
  }

  if (status === "error") {
    return (
      <Wrapper>
        <Title>Error</Title>
        <Text>{message}</Text>
      </Wrapper>
    );
  }

  const computeTotal = (order) => {
    if (!order) return 0;
    const tCandidates = [
      order?.totalAmount,
      order?.total?.amount,
      order?.total,
      order?.amount,
      order?.payment?.amount,
    ];

    for (const t of tCandidates) {
      const n = Number(t);
      if (!Number.isNaN(n) && n > 0) return n;
    }

    const sum = (order?.products || []).reduce((acc, item) => {
      const prod = item?.product || item || {};
      const price = Number(prod?.price ?? prod?.unitPrice ?? item?.price ?? 0) || 0;
      const qty = Number(item?.quantity ?? item?.qty ?? 1) || 1;
      return acc + price * qty;
    }, 0);

    return sum;
  };

  const total = computeTotal(order);

  return (
    <Wrapper>
      <CheckCircleIcon color="success" sx={{ fontSize: 70 }} />
      <Title>Pago confirmado</Title>

      <Text>Gracias por tu compra.</Text>
      <Text>Te enviamos un email con los datos del pedido.</Text>

      <Box sx={{ mt: 3 }}>
        <Text>
          <strong>Orden:</strong> {order?._id || order?.id || "—"}
        </Text>
        <Text>
          <strong>Total:</strong> ${Number(total || 0).toLocaleString("es-AR")} ARS
        </Text>
      </Box>

      {order?.products?.length > 0 && (
        <Box sx={{ mt: 4, textAlign: "left" }}>
          <Divider sx={{ mb: 2 }} />
          <Typography
            sx={{
              fontFamily: '"Archivo Black", sans-serif',
              textTransform: "uppercase",
              letterSpacing: "-0.08rem",
              mb: 2,
            }}
          >
            Productos
          </Typography>

          {order.products.map((item, idx) => {
            const prod = item?.product || item || {};
            const name =
              prod?.name || prod?.title || item?.name || "Producto";
            const price = Number(
              prod?.price ?? prod?.unitPrice ?? item?.price ?? 0
            ) || 0;
            const quantity = Number(item?.quantity ?? item?.qty ?? 1) || 1;

            let image =
              prod?.image ||
              prod?.images?.[0] ||
              (Array.isArray(prod?.images) && prod.images?.[0]?.url) ||
              null;

            if (image && typeof image === "object") {
              image = image?.url || image?.secure_url || null;
            }

            if (image && typeof image === "string" && !image.startsWith("http")) {
              const base = process.env.REACT_APP_API_URL || "";
              image = base.replace(/\/$/, "") + "/" + image.replace(/^\//, "");
            }

            const lineTotal = price * quantity;

            return (
              <Box
                key={idx}
                sx={{
                  display: "flex",
                  gap: 2,
                  mb: 2,
                  alignItems: "center",
                }}
              >
                <Box
                  component="img"
                  src={image || "https://via.placeholder.com/80"}
                  alt={name}
                  sx={{
                    width: 80,
                    height: 80,
                    objectFit: "cover",
                    borderRadius: 1,
                    border: "1px solid #ddd",
                  }}
                />

                <Box sx={{ flexGrow: 1 }}>
                  <Typography sx={{ fontWeight: 600 }}>{name}</Typography>
                  <Typography variant="body2">Cantidad: {quantity}</Typography>
                  {item?.size && (
                    <Typography variant="body2">Talle: {item.size}</Typography>
                  )}
                  {item?.color && (
                    <Typography variant="body2">Color: {item.color}</Typography>
                  )}
                </Box>

                <Box sx={{ textAlign: "right" }}>
                  <Typography sx={{ fontWeight: 600 }}>
                    ${Number(lineTotal).toLocaleString("es-AR")}
                  </Typography>
                  <Typography variant="caption" display="block">
                    (${Number(price).toLocaleString("es-AR")} c/u)
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      )}

      <Button
        component={Link}
        to="/"
        sx={{
          mt: 4,
          fontFamily: '"Archivo Black", sans-serif',
          textDecoration: "underline",
          color: "black",
        }}
      >
        Volver al inicio
      </Button>
    </Wrapper>
  );
}
