import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slice/authSlice";
import api from "../api";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email format").required("Email is required"),
      password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        const res = await api.post("login/",
          { email: values.email, password: values.password },
          { withCredentials: true }
        );

        const user = res.data.user || res.data;
        dispatch(setUser(user));

        toast.success("Login successful!");
        navigate(user?.is_staff ? "/admin" : "/home", { replace: true });
      } catch (error) {
        console.error(error.response?.data || error);
        toast.error(error.response?.data?.detail || "Login failed");
      }
    }
  });

  return (
    <div className="min-h-screen w-full flex bg-black overflow-hidden">
      <style>{`
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-100px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(100px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-left { animation: fadeInLeft 0.8s ease-out forwards; }
        .animate-slide-right { animation: fadeInRight 0.8s ease-out forwards; }
      `}</style>

      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white animate-slide-left">
        <div className="max-w-md w-full">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign in</h2>
            <p className="text-gray-600">
              New to Be Men?{" "}
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Create an account
              </button>
            </p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="you@example.com"
              />
              {formik.touched.email && formik.errors.email && (
                <p className="mt-2 text-sm text-red-600">{formik.errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="mt-2 text-sm text-red-600">{formik.errors.password}</p>
              )}
            </div>

            {/* Remember me / Forgot password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>

      {/* Right Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-black items-center justify-center p-12 opacity-0 translate-x-12 animate-[fadeInRight_0.8s_ease-out_forwards]">
        <div className="max-w-md text-center">
          <div className="mb-8">
            <div className="w-40 h-40 mx-auto bg-white rounded-2xl flex items-center justify-center shadow-2xl">
              <span className="text-4xl font-bold text-black">BE MEN</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Welcome Back</h1>
          <p className="text-gray-400 text-lg">
            Sign in to access your premium men's accessories collection
          </p>
          <div className="mt-8 text-gray-500 text-sm">
            Watches • Caps • Perfume • Sunglasses • More
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
