import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useLocation, Link } from "react-router-dom";

function useQuery() {
    return new URLSearchParams(useLocation().search);
};

export default function OrderSuccessPage() {
    const query = useQuery();
    const orderId = query.get('orderId');
    const [order, setOrder] = useState(null);
    const [status, setStatus] = useState('loading');
    const [message, setMessage] = useState('');
    const pollingRef = useRef(null)
    const attemptsRef = useRef(0);

    useEffect(() => {
        if (!orderId) {
            setStatus('error');
            setMessage('Orden inválida.');
            return;
        }
        const fetchOrder = async () => {
            try {
                const res = await axios.get(`/api/orders/public/${orderId}`, { withCredentials: true });
                const o = res.data;
                setOrder(o);
                const payStatus = o.payment?.status;
                if (payStatus === 'aprobado') {
                    setStatus('approved');
                    clearInterval(pollingRef.current);
                } else if (payStatus === 'rechazado') {
                    setStatus('rejected');
                    clearInterval(pollingRef.current);
                } else if (payStatus === 'pendiente') {
                    setStatus('pending');
                } else {
                    setStatus('loading')
                }
            } catch (error) {
                console.error('Error fetching order', error);
                setStatus('error');
                setMessage('No se pudo recuperar la orden.');
                clearInterval(pollingRef.current);
            }
            attemptsRef.current++;
            if (attemptsRef.current >= 15 && status === 'loading') {
                setStatus('timeout');
                clearInterval(pollingRef.current);
            }
        };
        fetchOrder();
        pollingRef.current = setInterval(fetchOrder, 2000);
        return () => {
            if (pollingRef.current) clearInterval(pollingRef.current);
        };
    }, [orderId]);
    if (status === 'error') {
        return <div><h2> Error </h2><p> {message} </p></div>
    }
    if (status === 'timeout') {
        return (
            <div>
                <h2>Procesando pago</h2>
                <p>Estamos procesando tu pago. Puede tardar unos segundos más. Revisa tu correo en breve o contactanos si no recibes confirmación.</p>
                <p><Link to="/">Volver al inicio</Link></p>
            </div>
        );
    }
    if (status === 'loading') {
        return (
            <div>
                <h2>Procesando pago</h2>
                <p>Gracias por tu compra — estamos verificando tu pago. No cierres esta ventana.</p>
                <p>Si todo sale OK te redirigiremos en breve o te llegará un email.</p>
            </div>
        );
    }
    if (status === 'pending') {
        return (
            <div>
                <h2>Pago en revisión</h2>
                <p>Tu pago está en estado <strong>pendiente</strong>. Te enviaremos un email cuando cambie su estado.</p>
                <p>Si tenés dudas contactanos: soporte@gpfootwear.com</p>
            </div>
        );
    }
    if (status === 'rejected') {
        return (
            <div>
                <h2>Pago rechazado</h2>
                <p>Sentimos que tu pago haya sido rechazado. Podés intentar de nuevo o contactarnos para asistencia.</p>
                <p><Link to="/">Volver al inicio</Link></p>
            </div>
        );
    }
    return (
        <div>
            <h2>Pago confirmado 🎉</h2>
            <p>Gracias — tu pago fue aprobado. En breve recibirás un email con el comprobante y la información de envío.</p>
            {order && (
                <>
                    <p><strong>Orden:</strong> {order._id}</p>
                    <p><strong>Total:</strong> ${order.totalAmount}</p>
                </>
            )}
        </div>
    );
};