import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/utils/api";
import { ToastContainer, toast } from "react-toastify";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      await api.post("/auth/register", { email, password });
      toast.success("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/auth/login"), 2000);
    } catch (error) {
      toast.error("Registration failed! Please try again.");
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4">Register</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />
        <button
          onClick={handleRegister}
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Register
        </button>
        <p className="mt-4 text-sm">
          Already have an account?{" "}
          <a href="/auth/login" className="text-blue-500 hover:underline">
            Login here
          </a>
        </p>
        <ToastContainer />
      </div>
    </div>
  );
}
