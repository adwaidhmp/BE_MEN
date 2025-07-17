import { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { WishlistContext } from "./contexts/wishlistcontext";
import { CartContext } from "./contexts/cartcontext";
import { useAuth } from "./contexts/Authcontext";
import Footer from "./footer";
import Loader from "./Loader";

function Homepage() {
  const [categoryimages, setcategoryimages] = useState([]);
  const [alldata, setalldata] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPrice, setSelectedPrice] = useState("all");
  const [visibleCount, setVisibleCount] = useState(8);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { wishlist, toggleWishlist } = useContext(WishlistContext);
  const { cart, addToCart } = useContext(CartContext);
  const { user } = useAuth();

  console.log(cart)

  // Extract search query from URL (?search=...)
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";

  // Fetch all products and category images
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:3001/products");
        const data = await response.json();

        setalldata(data);
        setFilteredProducts(data);

        // Extract one image per category for marquee
        const categories = [
          "sunglass",
          "cap",
          "belt",
          "watch",
          "wallet",
          "spray",
          "rings",
          "chains",
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
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Filter products by category and price dropdowns
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

  // Search filter (overrides category/price filters for now)
  useEffect(() => {
    if (!searchQuery) {
      setFilteredProducts(alldata);
    } else {
      const result = alldata.filter((product) => {
        const priceStr = product.price?.toString().toLowerCase() || "";
        return (
          product.name?.toLowerCase().includes(searchQuery) ||
          product.category?.toLowerCase().includes(searchQuery) ||
          product.brand?.toLowerCase().includes(searchQuery) ||
          priceStr.includes(searchQuery)
        );
      });
      setFilteredProducts(result);
    }
  }, [searchQuery, alldata]);

  if (loading) return <Loader />;

  return (
    <>
    
      <div className="bg-gray-100 min-h-screen px-6 py-20 text-gray-800">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Explore Men's Accessories
        </h1>

        {/* Moving images marquee */}
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
          <div className="inline-block animate-marquee space-x-4">
            {categoryimages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Category ${idx}`}
                className="h-32 inline-block rounded shadow"
              />
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="flex justify-between items-center py-5">
          {/* Sort Dropdown (Left) */}
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

          {/* Filter Dropdown (Right) */}
          <div className="flex items-center space-x-2">
            <label className="font-semibold">Filter by Category:</label>
            <select
              onChange={(e) => setSelectedCategory(e.target.value)}
              value={selectedCategory}
              className="p-1 border rounded w-[120px]"
            >
              <option value="all">All</option>
              <option value="sunglass">Sunglasses</option>
              <option value="cap">Caps</option>
              <option value="belt">Belts</option>
              <option value="watch">Watches</option>
              <option value="wallet">Wallets</option>
              <option value="spray">Sprays</option>
              <option value="rings">Rings</option>
              <option value="chains">Chains</option>
            </select>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center mt-20">
            <h2 className="text-xl font-semibold mb-4">Sorry, we don't have that product.</h2>
            <button
              onClick={() => navigate("/")}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              Go Back Home
            </button>
          </div>
        ) : (
          <>
            {/* Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 py-1">
              {filteredProducts.slice(0, visibleCount).map((product) => {
                const isInWishlist = wishlist.includes(String(product.id));
                return (
                  <div
                    key={product.id}
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="relative bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-lg shadow-gray-600 transition"
                  >
                    {/* Heart Button */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!user) {
                          navigate("/login");
                          return;
                        }
                        toggleWishlist(product.id);
                      }}
                      className="absolute top-2 right-2 text-xl"
                    >
                      {isInWishlist ? "❤️" : "🤍"}
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
                        if (!user) {
                          navigate("/login");
                          return;
                        }
                        addToCart({ id: product.id });
                      }}
                      className="mt-4 bg-black text-white py-1 px-3 rounded hover:text-blue-300"
                    >
                      Add to Cart
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!user) {
                          navigate("/login");
                          return;
                        }
                        navigate("/payment", {
                          state: { product: { ...product, quantity: 1 } },
                        });
                      }}
                      className="relative left-12 mt-4 bg-black text-white py-1 px-3 rounded hover:text-green-400"
                    >
                      Buy Now
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Load More Button */}
            {visibleCount < filteredProducts.length && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 8)}
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
