/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./Authcontext";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user, setUser } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (user?.wishlist) setWishlist(user.wishlist);
  }, [user]);

  const syncToServer = async (newWishlist) => {
    await axios.patch(`http://localhost:3001/users/${user.id}`, {
      wishlist: newWishlist,
    });
    setUser({ ...user, wishlist: newWishlist });
    setWishlist(newWishlist);
  };

  const addToWishlist = async (productId) => {
    if (wishlist.includes(productId)) return;
    const updated = [...wishlist, productId];
    await syncToServer(updated);
  };

  const removeFromWishlist = async (productId) => {
    const updated = wishlist.filter((id) => id !== productId);
    await syncToServer(updated);
  };

  const toggleWishlist = async (productId) => {
    wishlist.includes(productId)
      ? await removeFromWishlist(productId)
      : await addToWishlist(productId);
  };
    const clearWishlist = () => {
    setWishlist([]); 
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, toggleWishlist,clearWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
