import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Heart } from "lucide-react";

import {
  fetchWishlist,
  removeFromWishlist,
  clearWishlist,
} from "../redux/slice/wishlistSlice";
import { addToCart } from "../redux/slice/cartSlice";

function Wishlist() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { wishlist, loading, error } = useSelector((state) => state.wishlist);
  const cart = useSelector((state) => state.cart?.cart || []);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleClearWishlist = () => {
    if (wishlist.length === 0) {
      toast.info("Wishlist is already empty");
      return;
    }
    dispatch(clearWishlist());
    toast.info("Wishlist cleared");
  };

  if (loading) {
    return <p className="text-center pt-20">Loading wishlist...</p>;
  }

  if (error) {
    return <p className="text-center pt-20 text-red-500">{error}</p>;
  }

  if (wishlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-xl text-gray-600">
        <p>Your wishlist is empty 💔</p>
      </div>
    );
  }

  return (
    <div className="px-5 mt-10 pt-30 pb-5 sm:pt-10 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex-1">
          Your Wishlist
        </h1>
        <button
          onClick={handleClearWishlist}
          className="ml-4 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm px-4 py-2 rounded-lg font-medium shadow-md hover:shadow-lg hover:from-red-600 hover:to-red-700 transition-all duration-300"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {wishlist.map((item) => {
          console.log("Wishlist Item:", item);
          const product = item.product;
          console.log("Product in Wishlist:", product);
          const isInCart = cart.some((c) => c.product.id === product.id);

          return (
            <div
              key={product.id}
              className="relative flex items-start bg-white p-3 rounded-md shadow hover:shadow-gray-500 transition cursor-pointer"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              {/* ❤️ Remove from Wishlist */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(removeFromWishlist(product.id));
                  toast.info("Removed from wishlist");
                }}
                className="absolute top-2 right-2 text-lg text-red-500 hover:text-gray-400"
                title="Remove from Wishlist"
              >
                <Heart className="w-6 h-6 fill-red-500 text-red-500" />
              </div>

              {/* 🖼 Product Image */}
              <img
                src={product.product_image}
                alt={product.name}
                className="w-60 h-30 object-cover rounded mr-4"
              />

              {/* 📦 Product Details */}
              <div className="flex flex-col justify-between flex-1 h-full">
                <div>
                  <h2 className="text-base font-semibold text-gray-800">
                    {product.name}
                  </h2>
                  <h3 className="text-sm text-gray-600">{product.brand}</h3>
                  <p className="text-sm text-gray-500 capitalize">
                    {product.category}
                  </p>
                  <p className="text-sm font-bold text-gray-900">
                    $ {product.price}
                  </p>
                </div>

                <div className="flex justify-between mt-4">
                  {/* 🛒 Add to Cart */}
                  {isInCart ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/cart");
                      }}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs px-3 py-2 rounded-lg font-medium shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
                    >
                      Go to Cart
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(
                          addToCart({ productId: product.id, quantity: 1 })
                        );
                        toast.success("Added to cart");
                      }}
                      className="bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs px-3 py-2 rounded-lg font-medium shadow-md hover:shadow-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300"
                    >
                      Add to Cart
                    </button>
                  )}

                  {/* 💳 Buy Now */}
                  <button
                      onClick={(e) =>{
                        e.stopPropagation(),
                        navigate("/checkout", {
                          state: {
                            items: [
                              {
                                product, 
                                quantity: 1,
                                price: product.price,
                              },
                            ],
                          },
                        })
                      }}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs px-3 py-2 rounded-lg font-medium shadow-md hover:shadow-lg hover:from-green-600 hover:to-green-700 transition-all duration-300"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Wishlist;
