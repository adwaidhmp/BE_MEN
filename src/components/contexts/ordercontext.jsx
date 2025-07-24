/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useAuth } from "./Authcontext";

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const { user, setUser } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user?.order) setOrders(user.order);
    else setOrders([]);
  }, [user]);

  const syncToServer = useCallback(async (newOrders) => {
    if (!user?.id) return;
    await axios.patch(`http://localhost:3001/users/${user.id}`, {
      order: newOrders,
    });
    setUser((prev) => ({ ...prev, order: newOrders }));
    setOrders(newOrders);
  }, [user, setUser]);

  const placeOrder = useCallback(async (productOrList) => {
    const products = Array.isArray(productOrList) ? productOrList : [productOrList];
    const timestamp = Date.now();

    const newOrders = products.map((product, index) => ({
      id: product.id,
      quantity: product.quantity || 1,
      orderId: `${timestamp}-${index}`,
      date: new Date().toLocaleString(),
      price: product.price.toString(),
      category: product.category || "",
      status: "pending",
      address: product.address,
    }));

    const updated = [...orders, ...newOrders];
    await syncToServer(updated);
  }, [orders, syncToServer]);

const cancelOrder = useCallback(async (orderId) => {
  const updated = orders.map((order) =>
    order.orderId === orderId
      ? { ...order, status: "cancelled" }
      : order
  );
  await syncToServer(updated);
}, [orders, syncToServer]);


  return (
    <OrderContext.Provider value={{ orders, placeOrder, cancelOrder }}>
      {children}
    </OrderContext.Provider>
  );
};
 