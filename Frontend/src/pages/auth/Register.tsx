import api from "@/utils/api";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

// Zod schema for registration validation
const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username is required with atleast 3 characters"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // State for form fields and errors
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  // Handle registration form submission
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate inputs using the Zod schema
    const result = registerSchema.safeParse({
      username,
      email,
      password,
      confirmPassword,
    });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    // Additional checks (though the schema already checks confirmPassword)
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!username.trim()) {
      setError("Username is required");
      return;
    }

    try {
      // Send registration request to backend
      await api.post("/auth/register", { username, email, password });

      // Show success toast and navigate to login page
      toast({
        title: "Registeration Successful",
        description: `Please login to access your todo`,
        variant: "success",
      });
      navigate("/auth/login");
    } catch (err) {
      // Handle registration errors
      console.error(err);
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center max-w-sm mx-auto mt-20 bg-accent text-foreground p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-6">Register</h2>
      {/* Display validation or server errors */}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleRegister} className="w-full">
        <div className="mb-4">
          <label htmlFor="username" className="block mb-1 font-medium">
            Username
          </label>
          <input
            id="username"
            type="text"
            className="border border-gray-300 rounded w-full p-2 text-black"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block mb-1 font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="border border-gray-300 rounded w-full p-2 text-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block mb-1 font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="border border-gray-300 rounded w-full p-2 text-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block mb-1 font-medium">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            className="border border-gray-300 rounded w-full p-2 text-black"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 w-full"
        >
          Register
        </button>
      </form>
      <p className="mt-4">
        Already have an account?{" "}
        <a href="/" className="text-blue-600 underline">
          Login
        </a>
      </p>
    </div>
  );
};

export default Register;
