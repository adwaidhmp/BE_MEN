import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import api from "../api";

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const validationSchema = Yup.object({
  name: Yup.string().min(2).required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone_number: Yup.string()
    .matches(/^\d{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
  password: Yup.string().min(6).required("Password is required"),
  password2: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
  profile_picture: Yup.mixed()
    .nullable() 
    .test(
      "fileSize",
      "File too large (max 5MB)",
      (value) => !value || (value && value.size <= 5 * 1024 * 1024)
    )
    .test(
      "fileType",
      "Unsupported format (only JPG, JPEG, PNG)",
      (value) =>
        !value ||
        (value &&
          ["image/jpg", "image/jpeg", "image/png"].includes(value.type))
    ),
});

const formik = useFormik({
  initialValues: {
    name: "",
    email: "",
    phone_number: "",
    password: "",
    password2: "",
    profile_picture: null,
  },
  validationSchema,
  onSubmit: async (values) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("phone_number", values.phone_number);
      formData.append("password", values.password);
      formData.append("password2", values.password2);
      formData.append("profile_picture", values.profile_picture);

        for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
         }

        await api.post("signup/",formData,
          {headers: { "Content-Type": "multipart/form-data" },withCredentials: true});

      toast.success("Signed up successfully");
      navigate("/login");
    } catch (error) {
      if (error.response?.data?.email) {
        toast.error(error.response.data.email[0]);
      } else {
        toast.error("Signup failed");
      }
    }
  },
});


  return (
    <>
      <style>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-slide-in-left {
          animation: slideInLeft 0.8s ease-out;
        }
        
        .animate-slide-in-right {
          animation: slideInRight 0.8s ease-out;
        }
      `}</style>
      
      <div className="min-h-screen flex bg-black">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-black items-center justify-center p-12 animate-slide-in-left">
          <div className="max-w-md text-center">
            <div className="mb-8">
              <div className="w-40 h-40 mx-auto bg-white rounded-2xl flex items-center justify-center shadow-2xl">
                <span className="text-4xl font-bold text-black">BE MEN</span>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Welcome to Be Men</h1>
            <p className="text-gray-400 text-lg">
              Your ultimate destination for premium men's accessories
            </p>
            <div className="mt-8 text-gray-500 text-sm">
              Watches • Wallets • Belts • Sunglasses • More
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 flex items-center justify-center p-8 bg-white animate-slide-in-right">
          <div className="max-w-2xl w-full">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Create your account
              </h2>
              <p className="text-gray-600">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Sign in
                </button>
              </p>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-6">
              {/* Row 1: Full Name & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={formik.values.full_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                  {formik.touched.full_name && formik.errors.full_name && (
                    <p className="mt-2 text-sm text-red-600">{formik.errors.full_name}</p>
                  )}
                </div>

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
              </div>

              {/* Row 2: Phone & Profile Picture */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    id="phone_number"
                    name="phone_number"
                    type="tel"
                    autoComplete="tel"
                    value={formik.values.phone_number}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="1234567890"
                  />
                  {formik.touched.phone_number && formik.errors.phone_number && (
                    <p className="mt-2 text-sm text-red-600">{formik.errors.phone_number}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="profile_picture" className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Picture
                  </label>
                  <input
                    id="profile_picture"
                    name="profile_picture"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={(e) =>
                      formik.setFieldValue("profile_picture", e.currentTarget.files[0])
                    }
                    className="block w-full px-4 py-3 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {formik.touched.profile_picture && formik.errors.profile_picture && (
                    <p className="mt-2 text-sm text-red-600">{formik.errors.profile_picture}</p>
                  )}
                </div>
              </div>

              {/* Row 3: Password & Confirm Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="••••••••"
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

                <div>
                  <label htmlFor="password2" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="password2"
                      name="password2"
                      type={showConfirm ? "text" : "password"}
                      autoComplete="new-password"
                      value={formik.values.confirm_password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirm ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {formik.touched.confirm_password && formik.errors.confirm_password && (
                    <p className="mt-2 text-sm text-red-600">{formik.errors.confirm_password}</p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Sign up
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;