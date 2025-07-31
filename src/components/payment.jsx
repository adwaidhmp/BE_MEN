import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { OrderContext } from "./contexts/ordercontext";
import { useAuth } from "./contexts/Authcontext";
import { toast } from "react-toastify";
import axios from "axios";
import { CartContext } from "./contexts/cartcontext";

function Payment() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { placeOrder } = useContext(OrderContext);
  const { user } = useAuth();
  const { removeFromCart, removeMultipleFromCart } = useContext(CartContext);
  const [address, setAddress] = useState("");
  const [useOld, setUseOld] = useState(false);
  const [oldAddress, setOldAddress] = useState("");

  const product = state?.product;

  useEffect(() => {
    const fetchUserAddress = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/users/${user.id}`);
        if (res.data.address) {
          setOldAddress(res.data.address);
        }
      } catch (error) {
        console.error("Failed to fetch old address", error);
      }
    };

    if (user?.id) fetchUserAddress();
  }, [user]);

  const handlePayment = async () => {
    const finalAddress = useOld && oldAddress ? oldAddress : address;

    if (!finalAddress.trim()) {
      toast.error("Please enter a delivery address");
      return;
    }

    const productsToOrder = (Array.isArray(product) ? product : [product]).map(
      (p) => ({
        id: p.id,
        quantity: p.quantity || 1,
        price: (parseFloat(p.price) * (p.quantity || 1)).toFixed(2),
        category: p.category || "",
        address: finalAddress,
      })
    );

    try {
      await placeOrder(productsToOrder);

      if (!useOld && address.trim()) {
        await axios.patch(`http://localhost:3001/users/${user.id}`, {
          address,
        });
      }

      if (Array.isArray(product)) {
        const ids = product.map((p) => p.id);
        removeMultipleFromCart(ids);
      } else {
        removeFromCart(product.id);
      }

      navigate("/orders", { replace: true });
      toast.success("Order Placed");
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error("Something went wrong");
    }
  };

  if (!product || (Array.isArray(product) && product.length === 0)) {
    return (
      <div className="mt-24 text-center text-gray-600 text-lg">
        <Link to="/home">No items for Payment. Click here to go Home</Link>
      </div>
    );
  }

  return (
    <div className="mt-24 p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Payment Page</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Column 1 - Product Details */}
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-xl font-semibold mb-4">Your Products 🛍️</h3>
          <div className="space-y-3">
            {(Array.isArray(product) ? product : [product]).map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-4 border p-3 rounded shadow-sm"
              >
                <img
                  src={p.image[0]}
                  alt={p.name}
                  className="w-20 h-16 object-cover rounded"
                />
                <div>
                  <p className="font-semibold text-gray-800">{p.name}</p>
                  <p className="text-gray-600 text-sm">
                    ${p.price} × {p.quantity || 1} ={" "}
                    <strong>${(p.price * p.quantity).toFixed(2)}</strong>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2 - Payment Method (UI Only) */}
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-xl font-semibold mb-4">Payment Method 💳</h3>
          <div className="space-y-4 text-gray-700">
            <label className="flex items-center gap-2">
              <input type="radio" name="payment" />
              Credit / Debit Card
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="payment" />
              UPI
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="payment" />
              Cash on Delivery
            </label>
          </div>
        </div>

        {/* Column 3 - Address */}
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-xl font-semibold mb-4">Delivery Address 📦</h3>

          {oldAddress && (
            <div className="mb-4">
              <label className="font-semibold">Use saved address?</label>
              <div className="flex items-center gap-3 mt-2">
                <input
                  type="checkbox"
                  checked={useOld}
                  onChange={(e) => setUseOld(e.target.checked)}
                />
                <span className="text-gray-700">{oldAddress}</span>
              </div>
            </div>
          )}

          {!useOld && (
            <div className="mb-4">
              <label htmlFor="address" className="block font-semibold mb-1">
                Enter New Address
              </label>
              <textarea
                id="address"
                rows="4"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full h-20 border rounded p-2"
                placeholder="Enter your full delivery address"
              ></textarea>
            </div>
          )}

          <button
            onClick={handlePayment}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default Payment;
