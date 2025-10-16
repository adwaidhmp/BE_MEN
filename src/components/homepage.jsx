import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Search } from "lucide-react";
import Footer from "./footer";
import { addToCart, fetchCart } from "../components/redux/slice/cartSlice"
import { toast } from "react-toastify";

function Homepage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceSort, setPriceSort] = useState("normal");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cart } = useSelector((state) => state.cart); // Redux cart state

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("http://localhost:8000/api/v1/products/");
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    fetchProducts();
    dispatch(fetchCart()); // Load cart from server on mount
  }, [dispatch]);

  useEffect(() => {
    let updated = [...products];

    if (selectedCategory !== "all") {
      updated = updated.filter((p) => p.category.toLowerCase() === selectedCategory);
    }

    if (searchQuery.trim()) {
      updated = updated.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (priceSort === "low-high") {
      updated.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (priceSort === "high-low") {
      updated.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    }

    setFilteredProducts(updated);
  }, [selectedCategory, priceSort, products, searchQuery]);

  const getStockDisplay = (stock) => {
    if (stock === 0) return { text: "Out of Stock", color: "text-red-600 bg-red-50" };
    if (stock === 1) return { text: "Only 1 Left!", color: "text-orange-600 bg-orange-50" };
    if (stock <= 5) return { text: `Only ${stock} Left`, color: "text-yellow-600 bg-yellow-50" };
    return { text: "In Stock", color: "text-green-600 bg-green-50" };
  };

  const handleAddToCart = (product) => {
    // Check if product is already in cart
    const inCart = cart.find((item) => item.product.id === product.id);
    const quantity = inCart ? inCart.quantity + 1 : 1;

    dispatch(addToCart({ productId: product.id, quantity }));
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 to-black text-white py-12 px-4 mt-13">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Premium Men's Collection</h1>
          <p className="text-lg text-gray-300 mb-8">Discover timeless style and quality</p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-full px-2 sm:px-4 py-4">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            {/* Category Filters */}
            <div className="w-full lg:w-auto">
              <h3 className="text-xs font-semibold text-gray-700 mb-2">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {["all", "sunglass", "watch", "perfume", "cap"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      selectedCategory === cat
                        ? "bg-black text-white shadow-lg scale-105"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {cat === "all" ? "All Products" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Sort */}
            <div className="w-full lg:w-auto">
              <h3 className="text-xs font-semibold text-gray-700 mb-2">Sort by Price</h3>
              <select
                onChange={(e) => setPriceSort(e.target.value)}
                value={priceSort}
                className="w-full lg:w-auto px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="normal">Featured</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No products found</h2>
            <p className="text-gray-600 text-sm">Try adjusting your filters or search query</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {filteredProducts.map((product) => {
              const stockInfo = getStockDisplay(product.product_stock);
              return (
                <div
                  key={product.id}
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer transform transition-all hover:scale-105 hover:shadow-md group relative"
                >
                  {/* Stock Badge */}
                  <div className={`absolute top-2 right-2 z-10 px-2 py-0.5 rounded-full text-xs font-semibold ${stockInfo.color}`}>
                    {stockInfo.text}
                  </div>

                  {/* Image */}
                  <div className="relative h-40 bg-gray-100 overflow-hidden">
                    <img
                      src={product.product_image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {product.old_price && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                        SALE
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-3">
                    <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                      {product.category}
                    </p>
                    <h2 className="font-semibold text-sm text-gray-900 mb-1.5 line-clamp-1">
                      {product.name}
                    </h2>

                    {/* Price */}
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="text-lg font-bold text-gray-900">
                        ${product.price}
                      </span>
                      {product.old_price && (
                        <span className="text-xs text-gray-400 line-through">
                          ${product.old_price}
                        </span>
                      )}
                    </div>

                    {product.old_price && (
                      <div className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded mb-2 inline-block">
                        {Math.round(((product.old_price - product.price) / product.old_price) * 100)}% OFF
                      </div>
                    )}

                   {/* Add to Cart / Go to Cart Button */}
                    {cart.find((item) => item.product.id === product.id) ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/cart");
                        }}
                        className="w-full py-1.5 text-sm rounded-md font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                      >
                        Go to Cart
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        disabled={product.product_stock === 0}
                        className={`w-full py-1.5 text-sm rounded-md font-semibold transition-colors ${
                          product.product_stock === 0
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-black text-white hover:bg-gray-800"
                        }`}
                      >
                        {product.product_stock === 0 ? "Out of Stock" : "Add to Cart"}
                      </button>
                    )}

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Homepage;
