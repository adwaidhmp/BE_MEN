import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./contexts/Authcontext";
import { toast } from "react-toastify";
import { useState } from "react";

function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);


  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email format").required("Email is required"),
      password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        const res = await axios.get("http://localhost:3001/users");
        const user = res.data.find(
          (usrdt) =>
            usrdt.email.trim().toLowerCase() === values.email.trim().toLowerCase() &&
            usrdt.password === values.password
        );

        if (!user) {
          toast.error("Invalid email or password");
          return;
        }

        if (user.blocked) {
          toast.error("Your account is blocked.");
          return;
        }

        await axios.patch(`http://localhost:3001/users/${user.id}`, {
          active: true,
        });

        setUser({ ...user, active: true });
        sessionStorage.setItem("user", JSON.stringify({ ...user, active: true }));
        toast.success("Login successful!");

        if (user.role !== "admin") {
          navigate("/home", { replace: true });
        } else {
          navigate("/admin", { replace: true });
        }
      } catch (error) {
        console.error("Login error:", error);
        toast.error("An error occurred while logging in");
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-32 sm:pt-0 px-4">
      <div className="w-full max-w-md bg-white rounded shadow p-6 sm:p-8">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            className="w-full border px-3 py-2 rounded"
          />
          {formik.touched.email && formik.errors.email && (
            <div className="text-red-500 text-sm">{formik.errors.email}</div>
          )}
          <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            className="w-full border px-3 py-2 rounded"
          />
            <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-2 flex items-center text-xl"
          >
            {showPassword ? "🔒" : "👀"}
          </button>
          </div>
          {formik.touched.password && formik.errors.password && (
            <div className="text-red-500 text-sm">{formik.errors.password}</div>
          )}

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-sm text-center">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-blue-600 cursor-pointer"
          >
            Signup here
          </span>
        </p>
        <p style={{ textAlign: "center" }}>
          <Link to="/home">Go Back</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
