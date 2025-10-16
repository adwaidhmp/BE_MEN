// pages/ForgotPassword.jsx
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/v1/forgot-password/", { email });
      toast.success(res.data.message || "Check your email for reset link!");
      setEmail("");
    } catch (err) {
      toast.error(err.response?.data?.error || "Something went wrong!");
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
        <h2 className="text-2xl font-semibold text-center text-gray-800">Forgot Password</h2>
        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border border-gray-300 p-2 rounded-lg focus:ring focus:ring-blue-200"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
}

export default ForgotPassword;
