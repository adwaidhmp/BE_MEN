import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


function Homepage() {
  const [categoryimages, setcategoryimages] = useState([]);
  const [alldata,setalldata] =useState([])
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPrice, setSelectedPrice] = useState("all");
 const navigate = useNavigate()

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("http://localhost:3001/products");
        const data = await response.json();
        console.log("All products:", data);
        setalldata(data)
        setFilteredProducts(data)
        
        const categories = ["sunglass", "cap", "belt", "watch", "wallet", "spray", "rings", "chains"];
        const selectedimages = [];

        for (let i = 0; i < categories.length; i++) {
          const category = categories[i];
          const product = data.find(item => item.category === category);
          if (product && product.image && product.image.length > 0) {
            selectedimages.push(product.image[0]);
          }
        }
        setcategoryimages(selectedimages);
        console.log("Selected images:", selectedimages)

      } 
      catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    fetchProducts();
  }, []);
  
useEffect(() => {
  let updated = [...alldata];

  // Apply category filter
  if (selectedCategory !== "all") {
    updated = updated.filter((p) => p.category === selectedCategory);
  }

  // Apply price filter
  if (selectedPrice === "below") {
    updated = updated.filter((p) => p.price < 100);
  } else if (selectedPrice === "equal") {
    updated = updated.filter((p) => p.price === 100);
  } else if (selectedPrice === "above") {
    updated = updated.filter((p) => p.price > 100);
  }

  setFilteredProducts(updated);
}, [selectedCategory, selectedPrice, alldata]);



  return (
    <div className="bg-gray-100 min-h-screen px-6 py-20 text-gray-800">
      <h1 className="text-3xl font-bold mb-8 text-center">Explore Men's Accessories</h1>

      {/* Moving images */}
      <div className="overflow-hidden whitespace-nowrap">

        {/* Tailwind animation styles */}
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
            <img key={idx} src={img} alt={`Category ${idx}`} className="h-32 inline-block rounded shadow" />
          ))}
        </div>
      </div>

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

      {/* All products grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 py-1">
        {filteredProducts.map((product) =>(<div key={product.id} 
        onClick={() => navigate(`/product/${product.id}`)}
        className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-lg shadow-gray-400 transition">
            <img
              src={product.image[0]}
              alt={product.name}
              className="h-40 w-full object-cover rounded mb-2"
            />
            <h2 className="font-semibold text-lg">{product.brand}</h2>
            <p className="text-gray-600">{product.category}</p>
            <p className="text-gray-800 font-bold">${product.price}</p>
            <p className="text-yellow-500 text-sm">⭐ {product.rating}</p>
          </div>
        ))}
      </div>
    </div>


  );
}

export default Homepage;
