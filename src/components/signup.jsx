import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useState } from "react";

function Signup() {

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  //validation
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, "Name must be at least 2 characters")
      .required("Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  //posting user with axios
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const res = await axios.get("http://localhost:3001/users");
        const userExists = res.data.find((u) => u.email === values.email);
        if (userExists) {
          toast.success("You already have an account");
          navigate("/login");
          return;
        }
        await axios.post("http://localhost:3001/users", {
          ...values,
          role: "user",
          wishlist: [],
          cart: [],
          order: [],
          blocked: false,
          active: false,
        });
        toast.success("Signed up successfully");
        navigate("/login");
      } catch (error) {
        console.error("Signup error:", error);
        toast.error("Signup failed");
      }
    },
  });

  return (
    <div className="min-h-screen flex items-start sm:items-center justify-center bg-gray-100 pt-40 sm:pt-36 md:pt-32 lg:pt-28 px-4">
      <div className="w-full max-w-md bg-white rounded shadow p-6 sm:p-8">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <input
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Name"
            className="w-full border px-3 py-2 rounded"
          />
          {formik.touched.name && formik.errors.name && (
            <div className="text-red-600 text-sm">{formik.errors.name}</div>
          )}

          <input
            name="email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Email"
            className="w-full border px-3 py-2 rounded"
          />
          {formik.touched.email && formik.errors.email && (
            <div className="text-red-600 text-sm">{formik.errors.email}</div>
          )}
          <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Password"
            className="w-full border px-3 py-2 rounded"
          />
            <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-2 flex items-center text-gray-700 hover:text-black"
          >
            {showPassword ? "🔒" : "👀"}
          </button>
          </div>
          {formik.touched.password && formik.errors.password && (
            <div className="text-red-600 text-sm">
              {formik.errors.password}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-sm text-center">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 cursor-pointer"
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
}

export default Signup;
