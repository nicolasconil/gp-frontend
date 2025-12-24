import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useLocation, Link } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function OrderSuccessPage() {
  const query = useQuery();

  const orderId = query.get("external_reference");
  const mpStatus = query.get("status"); 

  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  const pollingRef = useRef(null);
  const attemptsRef = useRef(0);

  useEffect(() => {
    if (!orderId) {
      setStatus("error");
      setMessage("Orden inválida.");
      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await axios.get(`/api/orders/public/${orderId}`);
        const o = res.data;

        setOrder(o);
        const payStatus = o.payment?.status;

        if (payStatus === "aprobado") {
          setStatus("approved");
          clearInterval(pollingRef.current);
        } else if (payStatus === "rechazado") {
          setStatus("rejected");
          clearInterval(pollingRef.current);
        } else if (payStatus === "pendiente") {
          setStatus("pending");
        } else {
          setStatus("loading");
        }
      } catch (err) {
        console.error("Error fetching order", err);
        setStatus("error");
        setMessage("No se pudo recuperar la orden.");
        clearInterval(pollingRef.current);
      }

      attemptsRef.current++;
      if (attemptsRef.current >= 15 && status === "loading") {
        setStatus("timeout");
        clearInterval(pollingRef.current);
      }
    };

    fetchOrder();
    pollingRef.current = setInterval(fetchOrder, 2000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
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
      <Box sx={{ maxWidth: 520, width: "100%", textAlign: "center" }}>
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
    <Typography sx={{ fontSize: "1rem", mb: 1.5 }}>
      {children}
    </Typography>
  );


  if (status === "loading") {
    return (
      <Wrapper>
        <HourglassBottomIcon sx={{ fontSize: 60, opacity: 0.6 }} />
        <Title>Procesando pago</Title>
        <Text>Gracias por tu compra. Estamos verificando tu pago.</Text>
        <Text>No cierres esta ventana.</Text>
      </Wrapper>
    );
  }

  if (status === "timeout") {
    return (
      <Wrapper>
        <Title>Pago en proceso</Title>
        <Text>
          Estamos procesando tu pago. Puede tardar unos segundos más.
        </Text>
        <Text>
          Revisá tu correo o contactanos si no recibís confirmación.
        </Text>
        <Button
          component={Link}
          to="/"
          sx={{
            mt: 3,
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

  if (status === "pending") {
    return (
      <Wrapper>
        <HourglassBottomIcon color="warning" sx={{ fontSize: 60 }} />
        <Title>Pago pendiente</Title>
        <Text>
          Tu pago está siendo revisado por MercadoPago.
        </Text>
        <Text>
          Te avisaremos por email cuando se confirme.
        </Text>
        <Text>gpkickslab@gmail.com</Text>
      </Wrapper>
    );
  }

  if (status === "rejected") {
    return (
      <Wrapper>
        <CancelIcon color="error" sx={{ fontSize: 60 }} />
        <Title>Pago rechazado</Title>
        <Text>
          El pago no pudo completarse.
        </Text>
        <Text>
          Podés intentarlo nuevamente o contactarnos.
        </Text>
        <Button
          component={Link}
          to="/"
          sx={{
            mt: 3,
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

  if (status === "error") {
    return (
      <Wrapper>
        <Title>Error</Title>
        <Text>{message}</Text>
      </Wrapper>
    );
  }


  return (
    <Wrapper>
      <CheckCircleIcon color="success" sx={{ fontSize: 70 }} />
      <Title>Pago confirmado</Title>

      <Text>
        Gracias por tu compra. Tu pago fue aprobado correctamente.
      </Text>
      <Text>
        Te enviamos un email con el comprobante y los datos de envío.
      </Text>

      {order && (
        <Box sx={{ mt: 3 }}>
          <Text>
            <strong>Orden:</strong> {order._id}
          </Text>
          <Text>
            <strong>Total:</strong>{" "}
            ${Number(order.totalAmount).toLocaleString("es-AR")} ARS
          </Text>
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
