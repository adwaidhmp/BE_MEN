import { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Plus, X, Pencil } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [newProduct, setNewProduct] = useState({
    id: "",
    name: "",
    category: "",
    price: "",
    image: [""],
    rating: "",
    brand: "",
    description: "",
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

  const handleEdit = (product) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setNewProduct({ ...product });
    setEditingProductId(product.id);
    setShowForm(true);
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
            onClick={() => {
              setShowForm(true);
              setEditingProductId(null);
              setNewProduct({
                id: "",
                name: "",
                category: "",
                price: "",
                image: [""],
                rating: "",
                brand: "",
                description: "",
              });
            }}
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
        <Formik
          enableReinitialize
          initialValues={newProduct}
          validationSchema={Yup.object({
            id: Yup.string().required("ID is required"),
            name: Yup.string().required("Name is required"),
            category: Yup.string().required("Category is required"),
            price: Yup.number().required("Price is required"),
            image: Yup.array().of(Yup.string().required("Image path required")).min(1, "At least one image is required"),
            rating: Yup.number().required("Rating is required"),
            brand: Yup.string().required("Brand is required"),
            description: Yup.string(),
          })}
          onSubmit={async (values) => {
          const payload = {
            ...values,
            price: parseFloat(values.price),
            rating: parseFloat(values.rating),
          };

          try {
            if (editingProductId) {
              await axios.put(
                `http://localhost:3001/products/${editingProductId}`,
                payload
              );

              setProducts((prev) =>
                prev.map((p) =>
                  p.id === editingProductId ? { ...payload, id: editingProductId } : p
                )
              );

              toast.success("Product edited"); // ✅ Toast on edit
            } else {
              const exists = products.some((p) => String(p.id) === String(values.id));
              if (exists) {
                alert("ID already exists.");
                return;
              }

              const res = await axios.post("http://localhost:3001/products", payload);

              setProducts((prev) =>
                [...prev, res.data].sort(
                  (a, b) => Number(a.id) - Number(b.id)
                )
              );

              toast.success("Product added"); // ✅ Toast on add
            }

            setNewProduct({
              id: "",
              name: "",
              category: "",
              price: "",
              image: [""],
              rating: "",
              brand: "",
              description: "",
            });

            setEditingProductId(null);
            setShowForm(false);
          } catch (err) {
            console.error("Error:", err);
            toast.error("Something went wrong");
          }
        }}
        >
          {() => (
            <Form className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 bg-white shadow p-6 rounded">
              <div>
                <Field
                  name="id"
                  placeholder="ID"
                  className="border p-2 rounded w-full"
                  disabled={!!editingProductId}
                />
                <ErrorMessage name="id" component="div" className="text-red-500 text-sm" />
              </div>

              <div>
                <Field
                  name="name"
                  placeholder="Name"
                  className="border p-2 rounded w-full"
                />
                <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
              </div>

              <div>
                <Field as="select" name="category" className="border p-2 rounded w-full">
                  <option value="" disabled>Select Category</option>
                  {categories.filter((cat) => cat !== "All").map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </Field>
                <ErrorMessage name="category" component="div" className="text-red-500 text-sm" />
              </div>

              <div>
                <Field
                  name="price"
                  type="number"
                  placeholder="Price"
                  className="border p-2 rounded w-full"
                />
                <ErrorMessage name="price" component="div" className="text-red-500 text-sm" />
              </div>

              <div>
                <Field
                  name="image[0]"
                  placeholder="Image Path"
                  className="border p-2 rounded w-full"
                />
                <ErrorMessage name="image[0]" component="div" className="text-red-500 text-sm" />
              </div>

              <div>
                <Field
                  name="rating"
                  type="number"
                  step="0.1"
                  placeholder="Rating"
                  className="border p-2 rounded w-full"
                />
                <ErrorMessage name="rating" component="div" className="text-red-500 text-sm" />
              </div>

              <div>
                <Field
                  name="brand"
                  placeholder="Brand"
                  className="border p-2 rounded w-full"
                />
                <ErrorMessage name="brand" component="div" className="text-red-500 text-sm" />
              </div>

              <Field name="image">
                    {({ field, form }) => (
                      <div className="w-full">
                        {field.value.map((img, index) => (
                          <div key={index} className="flex gap-2 mb-2">
                            <input
                              type="text"
                              value={img}
                              onChange={(e) => {
                                const updated = [...field.value];
                                updated[index] = e.target.value;
                                form.setFieldValue("image", updated);
                              }}
                              className="border p-2 rounded w-full"
                              placeholder={`Image ${index + 1}`}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updated = field.value.filter((_, i) => i !== index);
                                form.setFieldValue("image", updated);
                              }}
                              className="bg-red-500 text-white px-2 rounded hover:bg-red-600"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => form.setFieldValue("image", [...field.value, ""])}
                          className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 mt-2"
                        >
                          Add Image
                        </button>
                        {form.errors.image && typeof form.errors.image === "string" && (
                          <div className="text-red-500 text-sm mt-1">{form.errors.image}</div>
                        )}
                      </div>
                    )}
                  </Field>

              <div className="col-span-1 sm:col-span-2 flex flex-wrap gap-4">
                <button type="submit" className="bg-black text-white px-6 py-2 rounded hover:opacity-90">
                  {editingProductId ? "Update" : "Submit"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingProductId(null);
                  }}
                  className="bg-gray-300 text-black px-6 py-2 rounded hover:opacity-80 flex items-center gap-1"
                >
                  <X size={16} /> Cancel
                </button>
              </div>
            </Form>
          )}
        </Formik>
      )}

      {/* Table */}
      <div className="overflow-x-auto w-full">
        <table className="min-w-[800px] w-full bg-white shadow rounded-lg">
          <thead className="bg-black text-white">
            <tr>
              <th className="px-6 py-3 text-left">ID</th>
              <th className="px-6 py-3 text-left">Image</th>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Brand</th>
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
                <td className="px-6 py-3 font-medium">{p.brand}</td>
                <td className="px-6 py-3 capitalize">{p.category}</td>
                <td className="px-6 py-3">${p.price}</td>
                <td className="px-6 py-3 flex gap-2">
                  <button
                    onClick={() => handleEdit(p)}
                    className="bg-blue-500 text-white px-4 py-1 rounded flex items-center gap-1 hover:opacity-80"
                  >
                    <Pencil size={16} /> Edit
                  </button>
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
