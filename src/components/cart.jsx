import { useContext } from "react";
import { CartContext } from "./contexts/cartcontext";
import { OrderContext } from "./contexts/ordercontext";
import { useNavigate } from "react-router-dom";
function Cart() {
  const { cart, removeFromCart, updateQuantity } = useContext(CartContext);
const navigate = useNavigate()
const { placeOrder } = useContext(OrderContext);
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <div className="text-center py-20 text-xl text-gray-600">
        Your cart is empty 🛒
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold py-10 mb-6 text-center">My Cart 🛒</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {cart.map((product) => (
          <div
            key={product.id}
            className="relative bg-white p-3 rounded-lg shadow hover:shadow-lg transition"
          >
            <img
              src={product.image[0]}
              alt={product.name}
              className="h-40 w-full object-cover rounded mb-2"
            />
            <h2 className="font-semibold text-lg">{product.brand}</h2>
            <p className="text-gray-600">{product.category}</p>
            <p className="text-gray-800 font-bold">${product.price}</p>
            <p className="text-yellow-500 text-sm">⭐ {product.rating}</p>

            <div className="flex items-center mt-2 space-x-3">
              <button
                onClick={() => updateQuantity(product.id, -1)}
                className="bg-gray-300 px-2 rounded"
              >
                -
              </button>
              <span>{product.quantity}</span>
              <button
                onClick={() => updateQuantity(product.id, 1)}
                className="bg-gray-300 px-2 rounded"
              >
                +
              </button>

              <button
                onClick={() => removeFromCart(product.id)}
                className="ml-auto text-red-500 hover:text-red-700"
              >
                Remove
              </button>

              <button
              onClick={(e) => {
                e.stopPropagation();
                placeOrder(product); 
                navigate("/orders"); 
                }}
               className=" relative left-1  bg-black text-white py-1 px-3 rounded hover:text-green-400"
                   >
               Buy Now
            </button>
            </div>
          </div>
        ))}
      </div>

      <div className="text-left text-xl font-bold text-gray-800 mt-6">
        Total: ${totalPrice.toFixed(2)}
      </div>
    </div>
  );
}

export default Cart;
