/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from "react";
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

  const syncToServer = async (newOrders) => {
    await axios.patch(`http://localhost:3001/users/${user.id}`, {
      order: newOrders, 
    });
    setUser({ ...user, order: newOrders });
    setOrders(newOrders);
  };

 const placeOrder = async (productOrList) => {
  const products = Array.isArray(productOrList) ? productOrList : [productOrList];

  const timestamp = Date.now();

  const newOrders = products.map((product, index) => ({
    id: product.id,
    quantity: product.quantity || 1,
    orderId: `${timestamp}-${index}`,  
    date: new Date().toLocaleString(),
  }));

  const updated = [...orders, ...newOrders];
  await syncToServer(updated);
};



  const cancelOrder = async (orderId) => {
    const updated = orders.filter((order) => order.orderId !== orderId);
    await syncToServer(updated);
  };

  return (
    <OrderContext.Provider value={{ orders, placeOrder, cancelOrder }}>
      {children}
    </OrderContext.Provider>
  );
};
