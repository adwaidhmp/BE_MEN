import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { WishlistContext } from "./contexts/wishlistcontext";
import { CartContext } from "./contexts/cartcontext";
import { OrderContext } from "./contexts/ordercontext";
import { useAuth } from "./contexts/Authcontext";
import { toast } from "react-toastify";
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

function ProductDetails() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { wishlist, toggleWishlist } = useContext(WishlistContext);
  const { cart, addToCart } = useContext(CartContext);
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    async function fetchProduct() {
      const res = await fetch(`http://localhost:3001/products/${id}`);
      const data = await res.json();
      setProduct(data);
    }
    fetchProduct();
  }, [id]);

  if (!product) return <div className="p-6 text-center">Loading...</div>;

  const isInWishlist = wishlist.includes(product.id);
  const isInCart = cart.some((item) => item.id === product.id);

  const handleNextImage = () => {
    setImageIndex((prev) => (prev + 1) % product.image.length);
  };

  const handlePrevImage = () => {
    setImageIndex((prev) =>
      prev === 0 ? product.image.length - 1 : prev - 1
    );
  };

  return (
    <div className="min-h-screen pt-34 sm:pt-44 md:pt-18 px-4 sm:px-6 lg:px-8 bg-gray-200  text-gray-800 flex justify-center">
      <div className="w-full h-153 min-h-[700px] sm:min-h-[600px] md:min-h-[500px] max-w-3xl bg-white p-6 rounded shadow relative">
        {/* Wishlist Button */}
        <button
          className="text-2xl cursor-pointer absolute top-4 left-4"
          onClick={() => {
              navigate(-1);
          }}
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <button
          className="text-2xl cursor-pointer absolute top-4 right-4"
          onClick={() => {
            if (!user) {
              navigate("/login");
              return;
            }
            toggleWishlist(product.id);
          }}
        >
          {isInWishlist ? "❤️" : "🤍"}
        </button>

        {/* Product Image Carousel */}
        <div className="relative mt-4 mb-4">
          <img
            src={product.image[imageIndex]}
            alt={`${product.name}-${imageIndex}`}
            className="w-150 max-w-[300px] mx-auto max-h-65 object-cover rounded"
          />

          {/* Prev Button */}
          {product.image.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute top-1/2 left-2 transform -translate-y-1/2 text-black px-2 py-1 rounded"
              >
                <ChevronLeftIcon className="w-6 h-6" />
              </button>

              {/* Next Button */}
              <button
                onClick={handleNextImage}
                className="absolute top-1/2 right-2 transform -translate-y-1/2 text-black px-2 py-1 rounded"
              >
                <ChevronRightIcon className="w-6 h-6" />
              </button>
            </>
          )}
        </div>

        {/* Product Info */}
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">{product.name}</h1>
        <h3 className="text-2xl sm:text-3xl font-bold mb-2">{product.brand}</h3>
        <p className="text-base sm:text-lg text-gray-700 mb-1">
          Category: {product.category}
        </p>
        <p className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
          ${product.price}
        </p>
        <p className="text-yellow-500 mb-2">⭐ {product.rating}</p>
        <p className="text-gray-600 mb-4">
          {product.description || "No description available at the time sorry...."}
        </p>

        {/* Button Group */}
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
          {isInCart ? (
            <button
              onClick={() => navigate("/cart")}
              className="bg-black text-white py-1 px-3 rounded hover:text-blue-300"
            >
              Go to Cart
            </button>
          ) : (
            <button
              onClick={(e) => {
                toast.success("Added to cart");
                e.stopPropagation();
                if (!user) {
                  navigate("/login");
                  return;
                }
                addToCart(product);
              }}
              className="bg-black text-white py-1 px-3 rounded hover:text-blue-300"
            >
              Add to Cart
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate("/payment", {
                state: { product: { ...product, quantity: 1 } },
              });
            }}
            className="bg-black text-white py-1 px-3 rounded hover:text-green-400"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
