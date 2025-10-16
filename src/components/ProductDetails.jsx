import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Heart, ShoppingCart, Zap } from "lucide-react";

import {
  addToWishlist,
  removeFromWishlist,
  fetchWishlist,
} from "../components/redux/slice/wishlistSlice";
import { addToCart, fetchCart } from "../components/redux/slice/cartSlice";
import { selectUser } from "../components/redux/slice/authSlice";

function ProductDetails() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const user = useSelector(selectUser);
  const wishlist = useSelector((state) => state.wishlist.wishlist);
  const cart = useSelector((state) => state.cart.cart);

  const [product, setProduct] = useState(null);
  const [isImageLoading, setIsImageLoading] = useState(true);

  // ✅ Fetch product + cart + wishlist
  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`http://localhost:8000/api/v1/products/${id}/`);
        const data = await res.json();

        setProduct({
          id: data.id,
          name: data.name,
          category: data.category,
          description: data.description,
          price: parseFloat(data.price),
          brand: data.brand,
          rating: data.rating,
          image: data.product_image || "",
          product_stock: data.product_stock,
        });
      } catch (err) {
        console.error(err);
        toast.error("Failed to load product");
      }
    }

    fetchProduct();
    dispatch(fetchCart());
    dispatch(fetchWishlist());
  }, [id, dispatch]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-gray-600 text-lg">Loading product...</p>
        </div>
      </div>
    );
  }

  // ✅ Works for both array of IDs or array of product objects
  const isInWishlist = wishlist.some(
    (item) => item.product?.id === product.id || item.id === product.id
  );
  const isInCart = cart.some((item) => item.product.id === product.id);

  // ✅ Toggle wishlist
  const handleWishlist = () => {
    if (!user) {
      toast.error("Please login to manage wishlist");
      navigate("/login");
      return;
    }

    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id))
        .unwrap()
        .then(() => toast.info("Removed from wishlist"))
        .catch(() => toast.error("Failed to remove from wishlist"));
    } else {
      dispatch(addToWishlist(product.id))
        .unwrap()
        .then(() => toast.success("Added to wishlist"))
        .catch(() => toast.error("Failed to add to wishlist"));
    }
  };

  // ✅ Add to cart
  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login to add to cart");
      navigate("/login");
      return;
    }

    if (!isInCart) {
      dispatch(addToCart({ productId: product.id, quantity: 1 }))
        .unwrap()
        .then(() => toast.success("Added to cart"))
        .catch(() => toast.error("Failed to add to cart"));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 relative">
            <button
              onClick={handleWishlist}
              className="absolute top-6 right-6 z-10 bg-white rounded-full p-3 shadow-md hover:shadow-lg transition-all hover:scale-110"
            >
              <Heart
                className={`w-6 h-6 ${
                  isInWishlist ? "fill-red-500 text-red-500" : "text-gray-400"
                }`}
              />
            </button>

            <div className="relative aspect-square bg-gray-50 rounded-xl overflow-hidden mb-4">
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  onLoad={() => setIsImageLoading(false)}
                  className={`w-full h-full object-contain transition-opacity duration-300 ${
                    isImageLoading ? "opacity-0" : "opacity-100"
                  }`}
                />
              )}
              {isImageLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 flex-1">
              <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                {product.brand}
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {product.name}
              </h1>
              <div className="inline-block bg-gray-100 px-4 py-2 rounded-lg mb-6">
                <span className="text-sm font-medium text-gray-700">
                  {product.category}
                </span>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-gray-900">
                    ${product.price}
                  </span>
                  <span className="text-gray-500 text-lg">USD</span>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Description
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {isInCart ? (
                  <button
                    onClick={() => navigate("/cart")}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white py-4 px-6 rounded-xl font-semibold hover:bg-gray-800 transition-all hover:shadow-lg"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Go to Cart
                  </button>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white py-4 px-6 rounded-xl font-semibold hover:bg-gray-800 transition-all hover:shadow-lg"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </button>
                )}

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
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all hover:shadow-lg"
                >
                  <Zap className="w-5 h-5" />
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
