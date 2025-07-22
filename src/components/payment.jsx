import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { OrderContext } from "./contexts/ordercontext";
import { useAuth } from "./contexts/Authcontext";
import { toast } from "react-toastify";
import axios from "axios";

function Payment() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { placeOrder } = useContext(OrderContext);
  const { user } = useAuth();

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

  if (!product) {
    return (
      <div className="text-center py-20 text-xl">
        No product selected for payment
      </div>
    );
  }

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

      // optionally update user's address in JSON DB if it's a new address
      if (!useOld && address.trim()) {
        await axios.patch(`http://localhost:3001/users/${user.id}`, {
          address,
        });
      }

      navigate("/orders", { replace: true });
      toast.success("Order Placed");
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="p-6 mt-24 max-w-xl mx-auto bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Payment Details 💳</h2>

      <div className="space-y-3">
        {(Array.isArray(product) ? product : [product]).map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-4 border p-3 rounded shadow-sm"
          >
            <img
              src={p.image[0]}
              alt={p.name}
              className="w-25 h-16 object-cover rounded"
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

      {/* Old or New Address */}
      {oldAddress && (
        <div className="mt-6">
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

      {/* New Address Input */}
      {!useOld && (
        <div className="mt-4">
          <label htmlFor="address" className="block font-semibold mb-1">
            Enter New Address
          </label>
          <textarea
            id="address"
            rows="3"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border rounded p-2"
            placeholder="Enter your full delivery address"
          ></textarea>
        </div>
      )}

      <div className="mt-6">
        <button
          onClick={handlePayment}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Pay Now
        </button>
      </div>
    </div>
  );
}

export default Payment;
