import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

function Signup() {
  const navigate = useNavigate();

  // Yup validation schema
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
          toast.success("You have already have account")
          return;
        }
        await axios.post("http://localhost:3001/users", {...values,role:"user",wishlist:[],cart:[],order:[]});
        toast.success("signed up succesfully")
        navigate("/login");
      } catch (error) {
        console.error("Signup error:", error);
      }
    },
  });

  return (
    <div className="p-8 max-w-md mx-auto bg-white rounded shadow mt-20">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
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

        <input
          name="password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Password"
          className="w-full border px-3 py-2 rounded"
        />
        {formik.touched.password && formik.errors.password && (
          <div className="text-red-600 text-sm">{formik.errors.password}</div>
        )}

        <button type="submit" className="w-full bg-black text-white py-2 rounded">
          Sign Up
        </button>
      </form>

      <p className="mt-4 text-sm">
        Already have an account?{" "}
        <span
          onClick={() => navigate("/login")}
          className="text-blue-600 cursor-pointer"
        >
          Login here
        </span>
      </p>
    </div>
  );
}

export default Signup;
