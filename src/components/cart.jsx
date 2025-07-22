import { useContext, useEffect, useState } from "react";
import { CartContext } from "./contexts/cartcontext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TrashIcon } from "@heroicons/react/24/solid";
import { toast } from "react-toastify";

function Cart() {
  const { cart, removeFromCart, updateQuantity, removeMultipleFromCart } =
    useContext(CartContext);
  const [allProducts, setAllProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await axios.get("http://localhost:3001/products");
      setAllProducts(res.data);
    };
    fetchProducts();
  }, []);

  const cartProducts = cart
    .map((cartItem) => {
      const product = allProducts.find((p) => p.id === cartItem.id);
      if (!product) return null;
      return {
        ...product,
        quantity: cartItem.quantity,
      };
    })
    .filter(Boolean);

  const totalPrice = cartProducts.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleBuyAll = () => {
    const productsToBuy = [...cartProducts];
    const ids = productsToBuy.map((p) => p.id);
    navigate("/payment", { state: { product: productsToBuy } });
    removeMultipleFromCart(ids);
  };

  if (cartProducts.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl text-gray-600">
        Your cart is empty 🛒
      </div>
    );
  }

  return (
    <div className="px-4 pt-28 pb-5 sm:pt-6  bg-gray-100 min-h-screen">
      <h1 className="text-3xl pt-10 font-bold mb-6 text-center">My Cart 🛒</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left: Cart Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 cursor-pointer lg:grid-cols-3 gap-6 flex-1">
          {cartProducts.map((product) => (
            <div
              key={product.id}
              className="relative bg-white p-4 rounded-lg shadow hover:shadow-gray-500 transition"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <img
                src={product.image[0]}
                alt={product.name}
                className="h-40 w-full object-cover rounded mb-2"
              />
              <h2 className="font-semibold text-lg">{product.name}</h2>
              <h2 className="font-semibold text-lg">{product.brand}</h2>
              <p className="text-gray-600">{product.category}</p>
              <p className="text-gray-800 font-bold">${product.price}</p>
              <p className="text-yellow-500 text-sm">⭐ {product.rating}</p>

              <div className="flex flex-wrap items-center mt-2 gap-2 sm:gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateQuantity(product.id, -1);
                  }}
                  className="bg-gray-300 px-2 rounded"
                >
                  -
                </button>
                <span>{product.quantity}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateQuantity(product.id, 1);
                  }}
                  className="bg-gray-300 px-2 rounded"
                >
                  +
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toast.error("Removed from cart");
                    removeFromCart(product.id);
                  }}
                  className="ml-auto text-red-500 hover:text-red-700"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromCart(product.id);
                    navigate("/payment", { state: { product } });
                  }}
                  className="bg-black text-white py-1 px-3 rounded hover:text-green-400 text-sm sm:text-base"
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Order Summary */}
        <div className="md:w-80 w-full">
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <h2 className="text-xl font-bold mb-4 text-center">Cart Summary</h2>

            {/* List products in cart */}
            <div className="space-y-2 mb-4">
              {cartProducts.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between text-gray-800 text-sm"
                >
                  <span className="line-clamp-1">
                    {item.name} × {item.quantity}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-300 my-4"></div>

            {/* Total */}
            <div className="flex justify-between mb-4 text-lg font-semibold text-gray-900">
              <span>Total:</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>

            <button
              onClick={handleBuyAll}
              className="w-full mt-2 bg-black text-white px-6 py-2 rounded hover:text-green-400"
            >
              Buy All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
