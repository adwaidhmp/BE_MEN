/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./Authcontext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, setUser } = useAuth();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (user?.cart) setCart(user.cart);
  }, [user]);

  const syncToServer = async (newCart) => {
    await axios.patch(`http://localhost:3001/users/${user.id}`, { cart: newCart });
    setUser({ ...user, cart: newCart });
    setCart(newCart);
  };

  const addToCart = async (product) => {
    const exists = cart.find((item) => item.id === product.id);
    let updatedCart;

    if (exists) {
      updatedCart = cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [...cart, { id: product.id, quantity: 1 }];
    }

    await syncToServer(updatedCart);
  };

  const removeFromCart = async (productId) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    await syncToServer(updatedCart);
  };

  const removeMultipleFromCart = async (idsToRemove) => {
    const updatedCart = cart.filter((item) => !idsToRemove.includes(item.id));
    await syncToServer(updatedCart);
  };

  const updateQuantity = async (productId, amount) => {
    const updatedCart = cart.map((item) =>
      item.id === productId ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item
    );
    await syncToServer(updatedCart);
  };

  const clearCart = () => {
    setCart([]); // Clear client state only (not synced to DB)
  };

  return (
    <CartContext.Provider
      value={{
        cart, addToCart, removeFromCart, updateQuantity, clearCart, removeMultipleFromCart, }}
    >
      {children}
    </CartContext.Provider>
  );
};
