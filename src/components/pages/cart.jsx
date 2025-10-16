import { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { TrashIcon } from "@heroicons/react/24/solid";
import { toast } from "react-toastify";
import { fetchCart, removeFromCart, updateQuantity, clearCart } from "../redux/slice/cartSlice";

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cart, loading } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const totalPrice = useMemo(() => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }, [cart]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-xl">Loading...</div>;
  }

  if (cart.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl text-gray-600">
        Your cart is empty 🛒
      </div>
    );
  }

  return (
    <div className="px-4 pt-28 pb-5 sm:pt-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl pt-10 font-bold mb-6 text-center">My Cart 🛒</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left: Cart Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 cursor-pointer lg:grid-cols-3 gap-6 flex-1">
          {cart.map((item) => {
            const product = item.product; // item from Redux slice has product and quantity
            console.log("Cart Item:", product);
            return (
              <div
                key={product.id}
                className="relative bg-white p-4 rounded-lg shadow hover:shadow-gray-500 transition"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <img
                  src={product.product_image} // match your backend field
                  alt={product.name}
                  className="h-40 w-full object-cover rounded mb-2"
                />
                <h2 className="font-semibold text-lg">{product.name}</h2>
                <p className="text-gray-600">{product.category}</p>
                <p className="text-gray-800 font-bold">${product.price}</p>

                <div className="flex flex-wrap items-center mt-2 gap-2 sm:gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(updateQuantity({ productId: product.id, quantity: -1 }));
                    }}
                    className="bg-gray-300 px-2 rounded"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(updateQuantity({ productId: product.id, quantity: 1 }));
                    }}
                    className="bg-gray-300 px-2 rounded"
                  >
                    +
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(removeFromCart(product.id));
                      toast.error("Removed from cart");
                    }}
                    className="ml-auto text-red-500 hover:text-red-700"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>

                  <button
                      onClick={() =>
                        navigate("/checkout", {
                          state: {
                            items: [
                              {
                                product, // full product object
                                quantity: 1,
                                price: product.price,
                              },
                            ],
                          },
                        })
                      }
                    className="bg-black text-white py-1 px-3 rounded hover:text-green-400 text-sm sm:text-base"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Order Summary */}
        <div className="md:w-80 w-full">
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <h2 className="text-xl font-bold mb-4 text-center">Cart Summary</h2>

            <div className="space-y-2 mb-4">
              {cart.map((item) => (
                <div key={item.product.id} className="flex justify-between text-gray-800 text-sm">
                  <span className="line-clamp-1">
                    {item.product.name} × {item.quantity}
                  </span>
                  <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-300 my-4"></div>

            <div className="flex justify-between mb-4 text-lg font-semibold text-gray-900">
              <span>Total:</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>

            <button
                  onClick={() =>
                    navigate("/checkout", {
                      state: {
                        items: cart.map((c) => ({
                          product: c.product,
                          quantity: c.quantity,
                          price: c.product?.price || 0,
                        })),
                      },
                    })
                  }
              className="w-full mt-2 bg-black text-white px-6 py-2 rounded hover:text-green-400"
            >
              Buy All
            </button>
          </div>
          <button
            onClick={() => dispatch(clearCart())}
            className="w-full mt-2 bg-black text-white px-6 py-2 rounded hover:text-green-400"
          >
            Empty cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
