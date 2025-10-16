import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import api from "../api"; // ✅ central axios instance
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  X, Edit2, Lock, ShoppingBag, Heart, ShoppingCart, LogOut,
  Eye, EyeOff, Save, XCircle
} from "lucide-react";
import {logoutUser, fetchUserProfile, updateUserProfile, changePassword } from "../redux/slice/authSlice"
import { clearWishlist } from "../redux/slice/wishlistSlice";
import { clearCart } from "../redux/slice/cartSlice";

function Profile({ onClose, profileRef }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, loading } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [changePwd, setChangePwd] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // ✅ Fetch user from backend
  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  // ✅ Logout
  const handleLogout = async () => {
    try {
      await api.post("logout/");
      dispatch(logoutUser());
      dispatch(clearWishlist());
      dispatch(clearCart());
      navigate("/home");
      onClose();
      toast.success("Logged out successfully");
    } catch (err) {
      console.error("Failed to logout:", err);
      toast.error("Logout failed");
    }
  };

  // ✅ Edit profile form
  const profileFormik = useFormik({
    initialValues: {
      name: user?.name || "",
      phone_number: user?.phone_number || "",
      profile_picture: null,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().min(2, "Name must be at least 2 characters").required("Name required"),
      phone_number: Yup.string().matches(/^[0-9]{10}$/, "Phone must be 10 digits").required("Phone required"),
      profile_picture: Yup.mixed().nullable(),
    }),
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("phone_number", values.phone_number);
        if (values.profile_picture) formData.append("profile_picture", values.profile_picture);

        await dispatch(updateUserProfile(formData)).unwrap();
        toast.success("Profile updated!");
        setIsEditing(false);
      } catch (err) {
        console.error("Update failed:", err);
        toast.error("Failed to update profile");
      }
    },
  });

  // ✅ Change password form
  const passwordFormik = useFormik({
    initialValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
    validationSchema: Yup.object({
      current_password: Yup.string().required("Current password is required"),
      new_password: Yup.string()
        .min(6, "New password must be at least 6 characters")
        .required("New password is required"),
      confirm_password: Yup.string()
        .oneOf([Yup.ref("new_password")], "Passwords must match")
        .required("Confirm password is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        await dispatch(
          changePassword({
            old_password: values.current_password,
            new_password: values.new_password,
          })
        ).unwrap();
        toast.success("Password changed successfully!");
        resetForm();
        setChangePwd(false);
      } catch (err) {
        console.error("Password change failed:", err);
        toast.error("Failed to change password");
      }
    },
  });

  return (
    <>
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-slide-in-right { animation: slideInRight 0.3s ease-out forwards; }
        .animate-scale-in { animation: scaleIn 0.3s ease-out forwards; }
      `}</style>

      <div
        ref={profileRef}
        className="fixed top-0 right-0 h-full w-full sm:w-110 bg-gradient-to-br from-gray-50 to-white shadow-2xl z-50 overflow-y-auto animate-slide-in-right"
      >
        <div className="sticky top-0 bg-black text-white px-6 py-4 flex items-center justify-between shadow-lg z-10">
          <h2 className="text-xl font-bold">My Profile</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : (
          user && (
            <div className="p-6">
              {/* Profile Header */}
              <div className="text-center mb-8 animate-scale-in">
                <div className="relative inline-block mb-4">
                  <img
                    src={
                      user.profile_picture ||
                      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSLU5_eUUGBfxfxRd4IquPiEwLbt4E_6RYMw&s"
                    }
                    alt="Profile"
                    className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-xl"
                  />
                  <div className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full border-4 border-white"></div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{user.name}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>

              {/* Edit / Change Password / Actions */}
              {isEditing ? (
                <div className="mb-6 animate-scale-in">
                  <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                    <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Edit2 className="w-5 h-5 text-blue-600" /> Edit Profile
                    </h4>
                    <form onSubmit={profileFormik.handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                          name="name"
                          value={profileFormik.values.name}
                          onChange={profileFormik.handleChange}
                          onBlur={profileFormik.handleBlur}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                        />
                        {profileFormik.touched.name && profileFormik.errors.name && (
                          <p className="text-red-600 text-sm mt-1">{profileFormik.errors.name}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <input
                          name="phone_number"
                          value={profileFormik.values.phone_number}
                          onChange={profileFormik.handleChange}
                          onBlur={profileFormik.handleBlur}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                        />
                        {profileFormik.touched.phone_number && profileFormik.errors.phone_number && (
                          <p className="text-red-600 text-sm mt-1">{profileFormik.errors.phone_number}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            profileFormik.setFieldValue("profile_picture", e.currentTarget.files[0])
                          }
                          className="w-full"
                        />
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button
                          type="submit"
                          className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center gap-2"
                        >
                          <Save className="w-4 h-4" /> Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 flex items-center justify-center gap-2"
                        >
                          <XCircle className="w-4 h-4" /> Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-3 mb-6">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 flex items-center justify-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" /> Edit Profile
                    </button>
                    <button
                      onClick={() => setChangePwd(!changePwd)}
                      className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-purple-700 flex items-center justify-center gap-2"
                    >
                      <Lock className="w-4 h-4" /> {changePwd ? "Cancel" : "Change Password"}
                    </button>
                  </div>

                  {changePwd && (
                    <div className="mb-6 animate-scale-in">
                      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <Lock className="w-5 h-5 text-purple-600" /> Change Password
                        </h4>
                        <form onSubmit={passwordFormik.handleSubmit} className="space-y-4">
                          {["current", "new", "confirm"].map((field, i) => {
                            const show =
                              field === "current"
                                ? showCurrent
                                : field === "new"
                                ? showNew
                                : showConfirm;
                            const toggle =
                              field === "current"
                                ? setShowCurrent
                                : field === "new"
                                ? setShowNew
                                : setShowConfirm;

                            return (
                              <div key={i}>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  {field === "current"
                                    ? "Current Password"
                                    : field === "new"
                                    ? "New Password"
                                    : "Confirm New Password"}
                                </label>
                                <div className="relative">
                                  <input
                                    name={`${field}_password`}
                                    type={show ? "text" : "password"}
                                    value={passwordFormik.values[`${field}_password`]}
                                    onChange={passwordFormik.handleChange}
                                    onBlur={passwordFormik.handleBlur}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 pr-12"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => toggle(!show)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                  >
                                    {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                  </button>
                                </div>
                              </div>
                            );
                          })}

                          <button
                            type="submit"
                            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700"
                          >
                            Update Password
                          </button>
                        </form>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3 mb-6">
                    <Link
                      to="/orders"
                      onClick={onClose}
                      className="w-full bg-white border-2 border-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:shadow-md flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4" /> My Orders
                    </Link>
                    <Link
                      to="/wishlist"
                      onClick={onClose}
                      className="w-full bg-white border-2 border-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:shadow-md flex items-center justify-center gap-2"
                    >
                      <Heart className="w-4 h-4" /> Wishlist
                    </Link>
                    <Link
                      to="/cart"
                      onClick={onClose}
                      className="w-full bg-white border-2 border-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:shadow-md flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" /> Shopping Cart
                    </Link>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </>
              )}
            </div>
          )
        )}
      </div>
    </>
  );
}

export default Profile;
