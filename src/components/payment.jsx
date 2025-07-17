import { useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { OrderContext } from "./contexts/ordercontext";

function Payment() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { placeOrder } = useContext(OrderContext);

  const product = state?.product;

  if (!product) {
    return <div className="text-center py-20 text-xl">No product selected for payment</div>;
  }

  const handlePayment = async () => {
  const productsToOrder = Array.isArray(product) ? product : [product];

  await placeOrder(productsToOrder); 
  navigate("/orders", { replace: true });
};


  return (
      <div className="p-6 mt-24 max-w-xl mx-auto bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Payment Details 💳</h2>

      <div className="space-y-3">
        {(Array.isArray(product) ? product : [product]).map((p) => (
        <div key={p.id} className="flex items-center gap-4 border p-3 rounded shadow-sm">
         <img
              src={p.image[0]}
              alt={p.name}
              className="w-25 h-16  object-cover rounded"
         />
         <div>
              <p className="font-semibold text-gray-800">{p.brand}</p>
              <p className="text-gray-600 text-sm">
                    ${p.price} × {p.quantity||1} = <strong>${(p.price * p.quantity).toFixed(2)}</strong>
              </p>
         </div>
        </div>
            ))}
      </div>

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
