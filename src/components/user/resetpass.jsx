// pages/ResetPassword.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function ResetPassword() {
  const { uid, token } = useParams();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Passwords do not match!");
      return;
    }
    setLoading(true);

    try {
      const res = await axios.post(
        `http://127.0.0.1:8000/api/v1/reset-password/${uid}/${token}/`,
        { password, confirm_password: confirm }
      );
      toast.success(res.data.message || "Password reset successful!");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.error || "Invalid or expired link!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-lg w-96 space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-800">Reset Password</h2>
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border border-gray-300 p-2 rounded-lg focus:ring focus:ring-blue-200"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          className="w-full border border-gray-300 p-2 rounded-lg focus:ring focus:ring-blue-200"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
        >
          {loading ? "Updating..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;
