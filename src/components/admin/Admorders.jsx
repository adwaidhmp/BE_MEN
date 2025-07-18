import { useEffect, useState } from "react";
import axios from "axios";

function AdmOrders() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, productsRes] = await Promise.all([
          axios.get("http://localhost:3001/users"),
          axios.get("http://localhost:3001/products"),
        ]);
        setUsers(usersRes.data);
        setProducts(productsRes.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  const updateOrderStatus = async (userId, orderId, newStatus) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    const updatedOrders = user.order.map((order) =>
      order.orderId === orderId ? { ...order, status: newStatus } : order
    );

    await axios.patch(`http://localhost:3001/users/${userId}`, {
      order: updatedOrders,
    });

    setUsers((prevUsers) =>
      prevUsers.map((u) =>
        u.id === userId ? { ...u, order: updatedOrders } : u
      )
    );
  };

  const otherUsers = users.filter((u) => u.role !== "admin");

  return (
  <div className="p-6 bg-gray-100 min-h-screen">
    <h1 className="text-3xl font-bold text-center mb-8">All User Orders</h1>

    {otherUsers.length === 0 && (
      <p className="text-center text-gray-500">No non-admin users found.</p>
    )}

    {otherUsers.map((user) => (
      <div key={user.id} className="mb-10 bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-blue-700 mb-4">
          {user.name}{" "}
          <span className="text-sm text-gray-600">({user.email})</span>
        </h2>

        {user.order && user.order.length > 0 ? (
          <div className="flex flex-col gap-5">
            {user.order.map((order) => {
              const product = products.find((p) => p.id === order.id);
              if (!product) return null;

              return (
                <div
                  key={order.orderId}
                  className="bg-gray-50 p-4 rounded shadow-sm border hover:shadow-md transition"
                >
                  {/* Image + all details in one row */}
                  <div className="flex items-center gap-6">
                    <img
                      src={product.image[0]}
                      alt={product.name}
                      className="w-28 h-20 object-cover rounded"
                    />
                    <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-700">
                      <p><span className="font-semibold">Name:</span> {product.name}</p>
                      <p><span className="font-semibold">Qty:</span> {order.quantity}</p>
                      <p><span className="font-semibold">Total:</span> ${order.price}</p>
                      <p><span className="font-semibold">Date:</span> {order.date}</p>
                      <p>
                        <span className="font-semibold">Status:</span>{" "}
                        <span
                          className={`font-semibold ${
                            order.status === "delivered"
                              ? "text-green-600"
                              : "text-orange-500"
                          }`}
                        >
                          {order.status || "pending"}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Button below details */}
                  {order.status !== "delivered" && (
                    <button
                      onClick={() =>
                        updateOrderStatus(user.id, order.orderId, "delivered")
                      }
                      className="mt-3 text-sm px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Mark as Delivered
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500">No orders placed by this user.</p>
        )}
      </div>
    ))}
  </div>
);

}

export default AdmOrders;
