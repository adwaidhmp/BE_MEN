import { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Plus, X } from "lucide-react";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    id: "",
    name: "",
    category: "",
    price: "",
    image: [""],
    rating: "",
    brand: "",
  });

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortIdAsc, setSortIdAsc] = useState(true);
  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await axios.get("http://localhost:3001/products");
      setProducts(res.data);
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (confirm("Delete this product?")) {
      await axios.delete(`http://localhost:3001/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "image") {
      setNewProduct((prev) => ({ ...prev, image: [value] }));
    } else {
      setNewProduct((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const exists = products.some((p) => p.id === newProduct.id);
    if (exists) {
      alert("ID already exists.");
      return;
    }

    const payload = {
      ...newProduct,
      price: parseFloat(newProduct.price),
      rating: parseFloat(newProduct.rating),
    };

    try {
      const res = await axios.post("http://localhost:3001/products", payload);
      setProducts([res.data, ...products]);
      setNewProduct({
        id: "",
        name: "",
        category: "",
        price: "",
        image: [""],
        rating: "",
        brand: "",
      });
      setShowForm(false);
    } catch (err) {
      console.error("Error adding product:", err);
    }
  };

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const filteredProducts = products
    .filter((p) => selectedCategory === "All" || p.category === selectedCategory)
    .sort((a, b) => (sortIdAsc ? a.id - b.id : b.id - a.id));

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-xl md:text-2xl font-bold mb-4">Products</h2>

      {/* Controls */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-black text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <Plus size={16} /> Add Product
          </button>
        )}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setSortIdAsc((prev) => !prev)}
            className="bg-gray-200 px-4 py-1 rounded hover:bg-gray-300"
          >
            Sort by ID: {sortIdAsc ? "Asc" : "Desc"}
          </button>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border px-3 py-1 rounded"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleAddProduct}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 bg-white shadow p-6 rounded"
        >
          <input name="id" value={newProduct.id} onChange={handleInputChange} placeholder="ID" className="border p-2 rounded" required />
          <input name="name" value={newProduct.name} onChange={handleInputChange} placeholder="Name" className="border p-2 rounded" required />
          <select name="category" value={newProduct.category} onChange={handleInputChange} className="border p-2 rounded" required>
            <option value="" disabled>Select Category</option>
            {categories.filter((cat) => cat !== "All").map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <input name="price" type="number" value={newProduct.price} onChange={handleInputChange} placeholder="Price" className="border p-2 rounded" required />
          <input name="image" value={newProduct.image[0]} onChange={handleInputChange} placeholder="Image Path" className="border p-2 rounded" required />
          <input name="rating" type="number" step="0.1" value={newProduct.rating} onChange={handleInputChange} placeholder="Rating" className="border p-2 rounded" required />
          <input name="brand" value={newProduct.brand} onChange={handleInputChange} placeholder="Brand" className="border p-2 rounded" required />
          <div className="col-span-1 sm:col-span-2 flex flex-wrap gap-4">
            <button type="submit" className="bg-black text-white px-6 py-2 rounded hover:opacity-90">Submit</button>
            <button type="button" onClick={() => setShowForm(false)} className="bg-gray-300 text-black px-6 py-2 rounded hover:opacity-80 flex items-center gap-1">
              <X size={16} />
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      <div className="overflow-x-auto w-full">
        <table className="min-w-[800px] w-full bg-white shadow rounded-lg">
          <thead className="bg-black text-white">
            <tr>
              <th className="px-6 py-3 text-left">ID</th>
              <th className="px-6 py-3 text-left">Image</th>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Category</th>
              <th className="px-6 py-3 text-left">Price</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleProducts.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-100">
                <td className="px-6 py-3">{p.id}</td>
                <td className="px-6 py-3">
                  <img src={p.image[0]} alt={p.name} className="w-24 h-16 object-cover rounded" />
                </td>
                <td className="px-6 py-3 font-medium">{p.name}</td>
                <td className="px-6 py-3 capitalize">{p.category}</td>
                <td className="px-6 py-3">${p.price}</td>
                <td className="px-6 py-3">
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="bg-red-500 text-white px-4 py-1 rounded flex items-center gap-1 hover:opacity-80"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Load More Button */}
        {visibleCount < filteredProducts.length && (
          <div className="text-center mt-6">
            <button
              onClick={() => setVisibleCount((prev) => prev + 10)}
              className="bg-black text-white px-6 py-2 rounded hover:opacity-90"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
