/* eslint-disable react-refresh/only-export-components */
// src/contexts/ordercontext.js
import { createContext, useState } from "react";

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  const placeOrder = (product) => {
    const newOrder = {
      ...product,
      orderId: Date.now(),
      date: new Date().toLocaleString(),
    };
    setOrders((prev) => [...prev, newOrder]);
  };

  const cancelOrder = (orderId) => {
    setOrders((prev) => prev.filter((order) => order.orderId !== orderId));
  };

  return (
    <OrderContext.Provider value={{ orders, placeOrder, cancelOrder }}>
      {children}
    </OrderContext.Provider>
  );
};
