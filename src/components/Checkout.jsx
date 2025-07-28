import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { createOrder, createPaymentPreference } from "../api/public.api.js";
import { Box, Button, CircularProgress, TextField, Typography } from "@mui/material";

const customInputStyles = {
    fontFamily: '"Archivo Black", sans-serif',
    '& label': {
        color: 'black',
        fontFamily: '"Archivo Black", sans-serif',
    },
    '& label.Mui-focused': {
        color: 'black',
    },
    '& .MuiInputLabel-outlined': {
        backgroundColor: 'white',
        padding: '0 4px',
        transform: 'translate(14px, 12px) scale(1)',
    },
    '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
        transform: 'translate(14px, -9px) scale(0.75)',
    },
    '& .MuiOutlinedInput-root': {
        borderRadius: '3px',
        '& fieldset': {
            borderColor: 'black',
            borderWidth: '2px',
        },
        '&:hover fieldset': {
            borderColor: 'black',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'black',
        },
        '& input::placeholder': {
            color: 'black',
        },
    },
};

const capitalizeWords = (str) => {
    return str.replace(/\b\w/g, char => char.toUpperCase());
};

const Checkout = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const orderSummary = state?.orderSummary;
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        street: '',
        province: '',
        postalCode: '',
        city: '',
        number: '',
        apartment: '',
        floor: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Limpieza de los datos (eliminando espacios al inicio y final)
        const cleanedFormData = {
            street: formData.street.trim(),
            city: formData.city.trim(),
            province: formData.province.trim(),
            postalCode: formData.postalCode.trim(),
            fullName: formData.fullName.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            number: formData.number.trim(),
            apartment: formData.apartment.trim(),
            floor: formData.floor.trim(),
        };

        // Verificar qué campo está vacío
        if (!cleanedFormData.street) {
            console.log("Campo street está vacío");
        }
        if (!cleanedFormData.city) {
            console.log("Campo city está vacío");
        }
        if (!cleanedFormData.province) {
            console.log("Campo province está vacío");
        }
        if (!cleanedFormData.postalCode) {
            console.log("Campo postalCode está vacío");
        }

        // Validación de los campos obligatorios
        if (!cleanedFormData.street || !cleanedFormData.city || !cleanedFormData.province || !cleanedFormData.postalCode) {
            alert("Por favor, completa todos los campos requeridos.");
            setLoading(false);
            return;
        }

        try {
            const orderPayload = {
                guestEmail: cleanedFormData.email,
                guestName: cleanedFormData.fullName,
                guestPhone: cleanedFormData.phone,
                guestAddress: {
                    street: cleanedFormData.street,
                    number: cleanedFormData.number || 'S/N',
                    apartment: cleanedFormData.apartment || 'S/N',
                    floor: cleanedFormData.floor || 'S/N',
                    city: cleanedFormData.city,
                    province: cleanedFormData.province,
                    postalCode: cleanedFormData.postalCode,
                },
                products: orderSummary.products.map(p => ({
                    product: p.productId,
                    quantity: p.quantity,
                    price: p.price,
                    size: p.size,
                    color: p.color,
                }))
            };
            console.log("Payload que se envía al backend:", orderPayload);
            const { data: order } = await createOrder(orderPayload);
            const { data: preference } = await createPaymentPreference(order);
            window.location.href = `https://www.mercadopago.com.ar/checkout/v1/redirect?preference-id=${preference.id}`;
        } catch (error) {
            console.error('Error al procesar el pago:', error);
        } finally {
            setLoading(false);
        }
    };
    if (!orderSummary) return <Typography> No hay datos de la orden. </Typography>

    return (
        <Box maxWidth="600px" mx="auto" mt={4} p={2} mb={-4} sx={{ border: '3px solid black', borderRadius: '4px' }}>
            <Typography variant="h3" gutterBottom sx={{ fontFamily: '"Archivo Black", sans-serif', letterSpacing: '-0.25rem', textDecoration: 'underline', mt: 2 }}>
                Datos de envío
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label='Nombre completo'
                    name='fullName'
                    value={formData.fullName}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                    sx={customInputStyles}
                />
                <TextField
                    label='Email'
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                    sx={customInputStyles}
                />
                <TextField
                    label='Telefóno'
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                    sx={customInputStyles}
                />
                <TextField
                    label='Dirección'
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                    sx={customInputStyles}
                />
                <TextField
                    label='Número'
                    name="number"
                    value={formData.number}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                    sx={customInputStyles}
                />
                <TextField
                    label='Departamento'
                    name="apartment"
                    value={formData.apartment}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                    sx={customInputStyles}
                />
                <TextField
                    label='Piso'
                    name="floor"
                    value={formData.floor}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                    sx={customInputStyles}
                />
                <TextField
                    label='Ciudad'
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                    sx={customInputStyles}
                />
                <TextField
                    label='Provincia'
                    name="province"
                    value={formData.province}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                    sx={customInputStyles}
                />
                <TextField
                    label='Código postal'
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                    sx={customInputStyles}
                />
                <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 3, mb: 3, width: '100%', color: 'white', backgroundColor: 'black', fontFamily: '"Archivo Black", sans-serif', fontWeight: 300, fontSize: '1rem' }}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Ir a pagar'}
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: { xs: -5, mt: -6 },
                            left: 6,
                            width: { xs: '99%', md: '99.4%' },
                            height: '6px',
                            backgroundColor: 'black',
                            borderRadius: '1.75px',
                        }}
                    />
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 6,
                            right: -3.9,
                            width: '6px',
                            height: '99%',
                            backgroundColor: 'black',
                            borderRadius: '1.75px',
                        }}
                    />
                </Button>
            </form>
        </Box >
    );
};

export default Checkout;