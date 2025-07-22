import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./contexts/Authcontext";
import { toast } from "react-toastify";
function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  //checking user from db
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.get("http://localhost:3001/users");
      const user = res.data.find(
        (usrdt) =>
          usrdt.email.trim().toLowerCase() === form.email.trim().toLowerCase() &&
          usrdt.password === form.password
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
      //setting in context and session storage
      setUser({ ...user, active: true });
      sessionStorage.setItem("user", JSON.stringify({ ...user, active: true }));
      toast.success("Login successful!");
      console.log(user)

      if (user.role !== "admin") {
        navigate("/home", { replace: true });
      } else {
        navigate("/admin", { replace: true });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred while logging in");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-32 sm:pt-0 px-4">
      <div className="w-full max-w-md bg-white rounded shadow p-6 sm:p-8">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            type="email"
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            type="password"
            className="w-full border px-3 py-2 rounded"
            required
          />
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
        <p style={{textAlign:"center"}}><Link to ="/home">
        Go Back
         </Link> </p>
      </div>
    </div>
  );
}

export default Login;
