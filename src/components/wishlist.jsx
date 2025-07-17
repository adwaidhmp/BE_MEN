import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { WishlistContext } from "./contexts/wishlistcontext";
import { CartContext } from "./contexts/cartcontext";
import axios from "axios";

function Wishlist() {
  const { wishlist, removeFromWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);
  const [allProducts, setAllProducts] = useState([]);
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await axios.get("http://localhost:3001/products");
      setAllProducts(res.data);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const matched = allProducts.filter((p) => wishlist.includes(p.id));
    setWishlistProducts(matched);
  }, [wishlist, allProducts]);

  if (wishlistProducts.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl text-gray-600">
        Your wishlist is empty 💔
      </div>
    );
  }

  return (
    <div className="px-4 py-10 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold py-6 text-center">My Wishlist ❤️</h1>

      {/* 2 cards per row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {wishlistProducts.map((product) => (
          <div
            key={product.id}
            className="relative flex items-start bg-white p-3 rounded-md shadow hover:shadow-gray-500 transition cursor-pointer"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            {/* Remove Icon */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                removeFromWishlist(product.id);
              }}
              className="absolute top-2 right-2 text-lg text-red-500 hover:text-gray-400"
              title="Remove from Wishlist"
            >
              ❤️
            </div>

            {/* Image */}
            <img
              src={product.image[0]}
              alt={product.name}
              className="w-40 h-24 object-cover rounded mr-4"
            />

            {/* Info and Buttons */}
            <div className="flex flex-col justify-between flex-1 h-full">
              {/* Product Info */}
              <div>
                <h2 className="text-base font-semibold text-gray-800">{product.brand}</h2>
                <p className="text-sm text-gray-500 capitalize">{product.category}</p>
                <p className="text-sm font-bold text-gray-900">$ {product.price}</p>
                <p className="text-sm text-yellow-500">⭐ {product.rating}</p>
              </div>

              {/* Bottom Buttons */}
              <div className="flex justify-between mt-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product);
                  }}
                  className="bg-black text-white text-xs px-3 py-1 rounded hover:text-blue-300"
                >
                  Add to Cart
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/payment", {
                      state: { product: { ...product, quantity: 1 } },
                    });
                  }}
                  className="bg-black rounded text-white text-xs px-3 py-1 hover:text-green-400"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Wishlist;
