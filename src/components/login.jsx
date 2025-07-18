import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./contexts/Authcontext";
import { toast } from "react-toastify";


function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth(); 
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.get("http://localhost:3001/users");
    const user = res.data.find(
    (u) =>
    u.email.trim().toLowerCase() === form.email.trim().toLowerCase() &&
    u.password === form.password
    );

    if (!user) {
      toast.error("Invalid email or password");
      return;
    }

    if (user.blocked) {
      toast.error("Your account is blocked.");
      return;
    }

    await axios.patch(`http://localhost:3001/users/${user.id}`, { active: true });

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
};

  return (
    <div className="p-8 max-w-md mx-auto bg-white rounded shadow mt-20">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
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
        <button type="submit" className="w-full bg-black text-white py-2 rounded">
          Login
        </button>
      </form>

      <p className="mt-4 text-sm">
        Don't have an account?{" "}
        <span
          onClick={() => navigate("/signup")}
          className="text-blue-600 cursor-pointer"
        >
          Signup here
        </span>
      </p>
    </div>
  );
}

export default Login;
