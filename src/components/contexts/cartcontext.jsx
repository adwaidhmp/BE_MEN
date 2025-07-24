import { createContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useAuth } from "./Authcontext";

// eslint-disable-next-line react-refresh/only-export-components
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, setUser } = useAuth();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (user?.cart) setCart(user.cart);
  }, [user]);

  const syncToServer = useCallback(async (newCart) => {
    if (!user?.id) return;
    await axios.patch(`http://localhost:3001/users/${user.id}`, { cart: newCart });
    setUser((prev) => ({ ...prev, cart: newCart }));
    setCart(newCart);
  }, [user, setUser]);

  const addToCart = useCallback(async (product) => {
    const updatedCart = [...cart, { id: product.id, quantity: 1 }];
    await syncToServer(updatedCart);
  }, [cart, syncToServer]);

  const removeFromCart = useCallback(async (productId) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    await syncToServer(updatedCart);
  }, [cart, syncToServer]);

  const removeMultipleFromCart = useCallback(async (idsToRemove) => {
    const updatedCart = cart.filter((item) => !idsToRemove.includes(item.id));
    await syncToServer(updatedCart);
  }, [cart, syncToServer]);

  const updateQuantity = useCallback(async (productId, quant) => {
    const updatedCart = cart.map((item) =>
      item.id === productId ? { ...item, quantity: Math.max(1, item.quantity + quant) } : item
    );
    await syncToServer(updatedCart);
  }, [cart, syncToServer]);

  const clearCart = useCallback(() => {
    setCart([]); // Local only — does not sync
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        removeMultipleFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
