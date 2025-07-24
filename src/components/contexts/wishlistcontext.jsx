/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useAuth } from "./Authcontext";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user, setUser } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (user?.wishlist) setWishlist(user.wishlist);
  }, [user]);

  const syncToServer = useCallback(async (newWishlist) => {
    if (!user?.id) return;
    await axios.patch(`http://localhost:3001/users/${user.id}`, {
      wishlist: newWishlist,
    });
    setUser((prev) => ({ ...prev, wishlist: newWishlist }));
    setWishlist(newWishlist);
  }, [user, setUser]);

  const addToWishlist = useCallback(async (productId) => {
    if (wishlist.includes(productId)) return;
    const updated = [...wishlist, productId];
    await syncToServer(updated);
  }, [wishlist, syncToServer]);

  const removeFromWishlist = useCallback(async (productId) => {
    const updated = wishlist.filter((id) => id !== productId);
    await syncToServer(updated);
  }, [wishlist, syncToServer]);

  const toggleWishlist = useCallback(async (productId) => {
    if (wishlist.includes(productId)) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }
  }, [wishlist, addToWishlist, removeFromWishlist]);

  const clearWishlist = useCallback(() => {
    setWishlist([]);
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
