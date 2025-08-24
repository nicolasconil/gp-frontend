import { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();

const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cartItems');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        if (cartItems.length > 0) {
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
        } else {
            localStorage.removeItem('cartItems');
        }
    }, [cartItems]);

    const addToCart = (product, size, color, quantity) => {
        const variationId = `${product._id}_${size}_${color}`;
        const cartItem = {
            id: variationId,
            productId: product._id,
            name: product.name,
            size,
            color,
            quantity,
            price: product.price,
            image: product.image
        };
        setCartItems((prevItems) => {
            const prev = Array.isArray(prevItems) ? prevItems : [];
            const existingProductIndex = prev.findIndex(item => item.id === variationId);
            if (existingProductIndex > -1) {
                const updatedCartItems = [...prev];
                updatedCartItems[existingProductIndex].quantity += quantity;
                return updatedCartItems;
            } else {
                return [...prev, cartItem];
            }
        });
    };

    const removeFromCart = (variationId) => {
        setCartItems(prevItems => {
            const prev = Array.isArray(prevItems) ? prevItems : [];
            const updatedCartItems = prev.filter(item => item.id !== variationId);
            localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
            return updatedCartItems;
        });
    };

    const updateQuantity = (variationId, quantity) => {
        setCartItems((prevItems) => {
            const prev = Array.isArray(prevItems) ? prevItems : [];
            const updatedCartItems = prev.map(item => {
                if (item.id === variationId) {
                    return { ...item, quantity };
                }
                return item;
            });
            return updatedCartItems;
        });
    };

    const getTotal = () => {
        const totalAmount = cartItems.reduce((total, item) => {
            const cleanPrice = parseFloat(String(item.price).replace(/\./g, '').replace(/,/g, '.'));
            const validQuantity = Number(item.quantity) || 0; 
            return total + (cleanPrice * validQuantity);
        }, 0);

        const totalQuantity = cartItems.reduce((total, item) => {
            return total + (Number(item.quantity) || 0); 
        }, 0);

        return { totalAmount, totalQuantity };
    };

    const resetCart = () => {
        setCartItems([]);
        localStorage.removeItem('cartItems');
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, getTotal, resetCart }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartProvider;

export const useCart = () => {
    return useContext(CartContext);
};
