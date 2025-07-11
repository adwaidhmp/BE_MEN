import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { WishlistContext } from "./contexts/wishlistcontext";
import { CartContext } from "./contexts/cartcontext";
import { OrderContext } from "./contexts/ordercontext";

function Wishlist() {
  const { wishlist, removeFromWishlist } = useContext(WishlistContext);
  const navigate = useNavigate();
    const { cart, addToCart } = useContext(CartContext);
    const { placeOrder } = useContext(OrderContext);
    console.log(cart)

  if (wishlist.length === 0) {
    return (
      <div className="text-center py-20 text-xl text-gray-600">
        Your wishlist is empty 💔
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold py-10 mb-6 text-center">My Wishlist ❤️</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {wishlist.map((product) => (
          <div
            key={product.id}
            className="relative bg-white p-4 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            {/* Remove Heart Icon */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                removeFromWishlist(product.id);
              }}
              className="absolute top-2 right-2 text-xl text-red-500 hover:text-gray-400"
            >
              ❤️
            </div>

            <img
              src={product.image[0]}
              alt={product.name}
              className="h-40 w-full object-cover rounded mb-2"
            />
            <h2 className="font-semibold text-lg">{product.brand}</h2>
            <p className="text-gray-600">{product.category}</p>
            <p className="text-gray-800 font-bold">${product.price}</p>
            <p className="text-yellow-500 text-sm">⭐ {product.rating}</p>

            <button
                  onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product);
                   }}
                  className="mt-4 bg-black text-white py-1 px-3 rounded hover:text-blue-300"
                  >
                Add to Cart
                </button>

                <button
              onClick={(e) => {
                e.stopPropagation();
                placeOrder(product); 
                navigate("/orders"); 
                }}
               className=" relative left-12 mt-4 bg-black text-white py-1 px-3 rounded hover:text-green-400"
                   >
               Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Wishlist;
