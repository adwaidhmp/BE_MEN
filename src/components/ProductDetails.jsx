import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { WishlistContext } from "./contexts/wishlistcontext";
import { CartContext } from "./contexts/cartcontext";
import { OrderContext } from "./contexts/ordercontext";
import { useAuth } from "./contexts/Authcontext";

function ProductDetails() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { wishlist, toggleWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  const { id } = useParams(); // string by default
  const [product, setProduct] = useState(null);

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

  return (
    <div className="min-h-screen p-20 bg-gray-200 text-gray-800">
      <div className="max-w-100 max-h-110 mx-auto bg-white p-6 rounded shadow relative">
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

        <img
          src={product.image[0]}
          alt={product.name}
          className="w-full h-40 object-cover rounded mb-4"
        />
        <h1 className="text-3xl font-bold mb-2">{product.brand}</h1>
        <p className="text-lg text-gray-700 mb-2">Category: {product.category}</p>
        <p className="text-xl font-semibold text-gray-900 mb-2">${product.price}</p>
        <p className="text-yellow-500 mb-2">⭐ {product.rating}</p>
        <p className="text-gray-600">
          {product.description || "No description available at the time sorry...."}
        </p>

        <button
          onClick={(e) => {
            e.stopPropagation();
            if (!user) {
              navigate("/login");
              return;
            }
            addToCart(product);
          }}
          className="mt-4 bg-black text-white py-1 px-3 rounded hover:text-blue-300"
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
          className="relative left-40 mt-4 bg-black text-white py-1 px-3 rounded hover:text-green-400"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}

export default ProductDetails;
