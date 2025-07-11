import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    async function fetchProduct() {
      const res = await fetch(`http://localhost:3001/products/${parseInt(id)}`);
      const data = await res.json();
      setProduct(data);
    }
    fetchProduct();
  }, [id]);

  if (!product) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="min-h-screen p-10 bg-gray-50 text-gray-800">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <img src={product.image[0]} alt={product.name} className="w-full h-80 object-cover rounded mb-4" />
        <h1 className="text-3xl font-bold mb-2">{product.brand}</h1>
        <p className="text-lg text-gray-700 mb-2">Category: {product.category}</p>
        <p className="text-xl font-semibold text-gray-900 mb-2">${product.price}</p>
        <p className="text-yellow-500 mb-2">⭐ {product.rating}</p>
        <p className="text-gray-600">{product.description || "No description available."}</p>
      </div>
    </div>
  );
}

export default ProductDetails;
