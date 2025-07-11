import { useContext } from "react";
import { OrderContext } from "./contexts/ordercontext";

function Orders() {
  const { orders, cancelOrder } = useContext(OrderContext);

  if (orders.length === 0) {
    return (
      <div className="text-center py-20 text-xl text-gray-600">
        No orders yet 🧾
      </div>
    );
  }

  return (
    <div className=" px-5 py-20 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Orders 🧾</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {orders.map((order) => (
          <div
            key={order.orderId}
            className="relative bg-white p-4 rounded-lg shadow"
          >
            <img
              src={order.image[0]}
              alt={order.name}
              className="h-40 w-full object-cover rounded mb-2"
            />
            <h2 className="font-semibold text-lg">{order.brand}</h2>
            <p className="text-gray-600">{order.category}</p>
            <p className="text-gray-800 font-bold">${order.price}</p>
            <p className="text-yellow-500 text-sm">⭐ {order.rating}</p>
            <p className="text-sm text-gray-500">🕒 {order.date}</p>

            {/* Cancel Order Button */}
            <button
              onClick={() => cancelOrder(order.orderId)}
              className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Cancel Order
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;
