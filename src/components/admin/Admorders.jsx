import { useEffect, useState } from "react";
import axios from "axios";

function AdmOrders() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [expandedUsers, setExpandedUsers] = useState({});
  const [filters, setFilters] = useState({});

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

  const toggleUserOrders = (userId) => {
    setExpandedUsers((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  const changeFilter = (userId, filter) => {
    setFilters((prev) => ({
      ...prev,
      [userId]: filter,
    }));
  };

  const allusers = users.filter((u) => u.role !== "admin");

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">All User Orders</h1>

      {allusers.length === 0 && (
        <p className="text-center text-gray-500">No users found.</p>
      )}

      {allusers.map((user) => (
        <div key={user.id} className="mb-6 bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
            <h2 className="text-xl font-semibold text-blue-700">
              {user.name}{" "}
              <span className="text-sm text-gray-600">({user.email})</span>
            </h2>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => toggleUserOrders(user.id)}
                className="text-sm px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
              >
                {expandedUsers[user.id] ? "Hide Orders" : "Show Orders"}
              </button>

              {expandedUsers[user.id] && (
                <>
                  <button
                    onClick={() => changeFilter(user.id, "all")}
                    className="text-sm px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 transition"
                  >
                    All
                  </button>
                  <button
                    onClick={() => changeFilter(user.id, "pending")}
                    className="text-sm px-3 py-1 rounded bg-orange-400 hover:bg-orange-500 text-white transition"
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => changeFilter(user.id, "shipped")}
                    className="text-sm px-3 py-1 rounded bg-yellow-500 hover:bg-yellow-600 text-white transition"
                  >
                    Shipped
                  </button>
                  <button
                    onClick={() => changeFilter(user.id, "delivered")}
                    className="text-sm px-3 py-1 rounded bg-green-500 hover:bg-green-600 text-white transition"
                  >
                    Delivered
                  </button>
                  <button
                    onClick={() => changeFilter(user.id, "cancelled")}
                    className="text-sm px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white transition"
                  >
                    Cancelled
                  </button>
                </>
              )}
            </div>
          </div>

          {expandedUsers[user.id] && (
            <>
              {user.order && user.order.length > 0 ? (
                <div className="flex flex-col gap-5 mt-4">
                  {user.order
                    .filter((order) => {
                      const currentFilter = filters[user.id] || "all";
                      if (currentFilter === "all") return true;
                      return order.status === currentFilter;
                    })
                    .map((order) => {
                      const product = products.find((p) => p.id === order.id);
                      if (!product) return null;

                      return (
                        <div
                          key={order.orderId}
                          className="bg-gray-50 p-4 rounded shadow-sm border hover:shadow-md transition"
                        >
                          <div className="flex items-center gap-6 flex-wrap">
                            <img
                              src={product.image[0]}
                              alt={product.name}
                              className="w-28 h-20 object-cover rounded"
                            />
                            <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-700">
                              <p>
                                <span className="font-semibold">Name:</span>{" "}
                                {product.name}
                              </p>
                              <p>
                                <span className="font-semibold">Qty:</span>{" "}
                                {order.quantity}
                              </p>
                              <p>
                                <span className="font-semibold">Total:</span> $ {order.price}
                              </p>
                              <p>
                                <span className="font-semibold">Date:</span> {order.date}
                              </p>
                              <p>
                                <span className="font-semibold">Status:</span>{" "}
                                <span
                                  className={`font-semibold ${
                                    order.status === "delivered"
                                      ? "text-green-600"
                                      : order.status === "shipped"
                                      ? "text-yellow-600"
                                      : order.status === "pending"
                                      ? "text-orange-500"
                                      : "text-red-600"
                                  }`}
                                >
                                  {order.status || "pending"}
                                </span>
                              </p>
                            </div>

                            <p className="text-sm text-gray-700">
                              <span className="font-semibold">Address:</span> {order.address}
                            </p>
                          </div>

                          <div className="flex gap-3 mt-3">
                            {order.status === "pending" && (
                              <button
                                onClick={() =>
                                  updateOrderStatus(
                                    user.id,
                                    order.orderId,
                                    "shipped"
                                  )
                                }
                                className="text-sm px-4 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                              >
                                Mark as Shipped
                              </button>
                            )}
                            {order.status === "shipped" && (
                              <button
                                onClick={() =>
                                  updateOrderStatus(
                                    user.id,
                                    order.orderId,
                                    "delivered"
                                  )
                                }
                                className="text-sm px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                              >
                                Mark as Delivered
                              </button>
                            )}
                            {/* No cancel button shown here */}
                          </div>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <p className="text-gray-500 mt-4">
                  No orders placed by this user.
                </p>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default AdmOrders;
