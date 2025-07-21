import { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { WishlistContext } from "./contexts/wishlistcontext";
import { CartContext } from "./contexts/cartcontext";
import { useAuth } from "./contexts/Authcontext";
import Footer from "./footer";

function Homepage() {
  const [categoryimages, setcategoryimages] = useState([]);
  const [alldata, setalldata] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPrice, setSelectedPrice] = useState("all");
  const [visibleCount, setVisibleCount] = useState(12);

  const navigate = useNavigate();
  const location = useLocation();
  const { wishlist, toggleWishlist } = useContext(WishlistContext);
  const { cart, addToCart } = useContext(CartContext);
  const { user } = useAuth();

  const searchParams = new URLSearchParams(location.search);
  const searchdata = searchParams.get("search")?.toLowerCase() || "";
//   const clearSearchParam = () => {
//   const newParams = new URLSearchParams(location.search);
//   newParams.delete("search");
//   navigate({ pathname: location.pathname, search: newParams.toString() });
// };

//moving images
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("http://localhost:3001/products");
        const data = await response.json();
        setalldata(data);
        setFilteredProducts(data);

        const categories = [
          "sunglass", "cap", "belt", "watch", "wallet", "spray", "rings", "chains"
        ];
        const selectedimages = [];
        for (let category of categories) {
          const product = data.find((item) => item.category === category);
          if (product && product.image?.length > 0) {
            selectedimages.push(product.image[0]);
          }
        }
        setcategoryimages(selectedimages);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    fetchProducts();
  }, []);

//price filter with category
  useEffect(() => {
    let updated = [...alldata];
    if (selectedCategory !== "all") {
      updated = updated.filter((p) => p.category === selectedCategory);
    }
    if (selectedPrice === "below") {
      updated = updated.filter((p) => p.price < 100);
    } else if (selectedPrice === "equal") {
      updated = updated.filter((p) => p.price === 100);
    } else if (selectedPrice === "above") {
      updated = updated.filter((p) => p.price > 100);
    }
    setFilteredProducts(updated);
  }, [selectedCategory, selectedPrice, alldata]);

  //search code
  useEffect(() => {
    // clearSearchParam()
    if (!searchdata) {
      setFilteredProducts(alldata);
    } else {
      const result = alldata.filter((product) => {
        const priceStr = product.price?.toString().toLowerCase() || "";
        return (
          product.name?.toLowerCase().includes(searchdata) ||
          product.category?.toLowerCase().includes(searchdata) ||
          product.brand?.toLowerCase().includes(searchdata) ||
          priceStr.includes(searchdata)
          
        );
      });
      setFilteredProducts(result);
    }
  }, [searchdata, alldata]);

  return (
    <>
      <div className="bg-gray-100 min-h-screen px-4 sm:px-6 pt-35 text-gray-800">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Explore Men's Accessories
        </h1>
        {/* moving images */}
        {/* Marquee */}
        <div className="overflow-hidden whitespace-nowrap">
          <style>
            {`
              @keyframes marquee {
                0% { transform: translateX(100%); }
                100% { transform: translateX(-100%); }
              }
              .animate-marquee {
                display: inline-block;
                white-space: nowrap;
                animation: marquee 20s linear infinite;
              }
            `}
          </style>
          <div className="inline-block animate-marquee space-x-6">
            {categoryimages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Category ${idx}`}
                className="h-28 sm:h-28 inline-block rounded shadow"
              />
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-center py-5 gap-4">
          <div className="flex justify-center flex-wrap gap-2">
            {["all", "sunglass", "cap", "belt", "watch", "wallet", "spray", "rings", "chains"].map((ind) => (
              <button
                key={ind}
                onClick={() => setSelectedCategory(ind)}
                className={`px-3 py-1 rounded border ${
                  selectedCategory === ind
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-gray-200"
                }`}
              >
                {ind === "all" ? "All" : ind.charAt(0).toUpperCase() + ind.slice(1) }{/* just for giving upper case for first letters */}
              </button>
            ))}
          </div>

          <div className="w-full sm:w-auto flex justify-end">
            <div className="flex items-center space-x-2">
              <label className="font-medium">Sort by Price:</label>
              <select
                onChange={(e) => setSelectedPrice(e.target.value)}
                value={selectedPrice}
                className="p-1 border rounded w-[140px]"
              >
                <option value="all">All</option>
                <option value="below">Below $100</option>
                <option value="equal">Exactly $100</option>
                <option value="above">Above $100</option>
              </select>
            </div>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center mt-20">
            <h2 className="text-xl font-semibold mb-4">Sorry, we don't have that product "{searchdata}"
              Search the right product </h2>
            <button
              onClick={() => navigate("/home")}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              Go Back Home
            </button>
          </div>
        ) : (
          <>
            {/* Product Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-4 py-2">
              {filteredProducts.slice(0, visibleCount).map((product) => {
                const isInWishlist = wishlist.includes(String(product.id));
                const isInCart = cart.some((item) => item.id === product.id); 
                return (
                  <div
                    key={product.id}
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="relative bg-white p-2 rounded-lg shadow cursor-pointer hover:shadow-lg transition"
                  >
                    <img
                      src={product.image[0]}
                      alt={product.name}
                      className="h-24 sm:h-28 w-full object-cover rounded mb-2"
                    />
                    <h2 className="font-semibold text-sm">{product.brand}</h2>
                    <p className="text-gray-600 text-xs">{product.category}</p>
                    <p className="text-gray-800 font-bold text-sm">${product.price}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-yellow-500 text-xs">⭐ {product.rating}</p>
                      <div className="flex items-center gap-2">
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!user) {
                              navigate("/login");
                              return;
                            }
                            toggleWishlist(product.id);
                          }}
                          className="text-lg cursor-pointer"
                        >
                          {isInWishlist ? "❤️" : "🤍"}
                        </div>
                        {isInCart ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate("/cart");
                            }}
                            className="bg-black text-white py-1 px-2 text-xs rounded hover:text-blue-300"
                          >
                            Go to Cart
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!user) {
                                navigate("/login");
                                return;
                              }
                              addToCart(product);
                            }}
                            className="bg-black text-white py-1 px-2 text-xs rounded hover:text-blue-300"
                          >
                            Add to Cart
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Load More */}
            {visibleCount < filteredProducts.length && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 12)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-blue-500"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </>
  );
}

export default Homepage;
