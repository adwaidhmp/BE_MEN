import { useContext, useEffect, useState } from "react";
import { OrderContext } from "./contexts/ordercontext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Orders() {
  const { orders, cancelOrder } = useContext(OrderContext);
  const [allProducts, setAllProducts] = useState([]);
  const navigate = useNavigate();

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      const res = await axios.get("http://localhost:3001/products");
      setAllProducts(res.data);
    };
    fetchProducts();
  }, []);

  // Match orders with product data and sort by date (latest first)
  const orderProducts = orders
    .map((order) => {
      const product = allProducts.find((p) => p.id === order.id);
      if (!product) return null;
      return {
        ...product,
        orderId: order.orderId,
        date: order.date,
        quantity: order.quantity || 1,
        status: order.status || "pending",
      };
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // sort latest first

  if (orderProducts.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl text-gray-600">
        No orders yet 🧾
      </div>
    );
  }

  return (
    <div className="px-4 py-20 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Orders 🧾</h1>
      <div className="flex flex-col items-center gap-6">
        {orderProducts.map((order) => (
          <div
            key={order.orderId}
            onClick={() => navigate(`/product/${order.id}`)}
            className="w-full max-w-3xl bg-white p-3 rounded-lg shadow hover:shadow-md transition cursor-pointer flex gap-4 items-center"
          >
            <img
              src={order.image[0]}
              alt={order.name}
              className="w-50 h-24 object-cover rounded"
            />
            <div className="flex-1">
              <h2 className="font-semibold text-md">{order.brand}</h2>
              <p className="text-sm text-gray-600">{order.category}</p>
              <p className="text-sm text-gray-700">Quantity: {order.quantity}</p>
              <p className="text-sm text-gray-700">
                Total: <strong>${(order.price * order.quantity).toFixed(2)}</strong>
              </p>
              <p className="text-xs text-gray-500">🕒 {order.date}</p>
              <p
                className={`text-sm font-medium ${
                  order.status === "pending"
                    ? "text-yellow-600"
                    : order.status === "delivered"
                    ? "text-green-600"
                    : "text-gray-500"
                }`}
              >
                Status: {order.status}
              </p>
            </div>

            {order.status !== "delivered" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  cancelOrder(order.orderId);
                }}
                className="bg-red-500 text-white text-sm px-2 py-1 rounded hover:bg-red-600"
              >
                Cancel Order
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;
