import { createContext, useState, useContext } from "react";

const CartContext = createContext();

const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (product) => {
        setCartItems((prevItems) => {
            const existingProductIndex = prevItems.findIndex(item => item.id === product.id);
            if (existingProductIndex > -1) {
                const updatedCartItems = [...prevItems];
                updatedCartItems[existingProductIndex].quantity += product.quantity;
                return updatedCartItems;
            } else {
                return [...prevItems, product];
            }
        });
    };

    const removeFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, quantity) => {
        setCartItems((prevItems) => {
            const updatedCartItems = prevItems.map(item => {
                if (item.id === productId) {
                    return { ...item, quantity };
                }
                return item;
            });
            return updatedCartItems;
        });
    };

    const getTotal = () => {
        const totaltAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
        const totalQuantity = cartItems.reduce((total, item) =>  total + item.quantity, 0);
        return { totaltAmount, totalQuantity};
    };

    const resetCart = () => {
        setCartItems([]);
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
