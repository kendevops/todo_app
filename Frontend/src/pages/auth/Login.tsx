import { FormEvent, useState } from "react";
import api from "@/utils/api";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

// Define a Zod schema to validate login inputs (email and password)
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

const Login = () => {
  const { dispatch } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Component state to store form inputs and potential error messages
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Handle login form submission
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate inputs using Zod schema
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      // If validation fails, set the error state to the first validation issue
      setError(result.error.issues[0].message);
      return;
    }

    try {
      // Send login request to backend
      const res = await api.post("/auth/login", { email, password });
      const { token } = res.data;

      // Store token in localStorage and update auth context
      localStorage.setItem("token", token);
      toast({
        title: "Login Successful",
        description: `Welcome ${email}`,
        variant: "success",
      });
      dispatch({ type: "LOGIN", token });
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Invalid credentials");
    }
  };

  return (
    <div className="flex flex-col items-center max-w-sm mx-auto mt-20 bg-accent text-foreground p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-6">Sign In</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleLogin} className="w-full">
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
          />
        </div>
        <button
          type="submit"
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 w-full"
        >
          Login
        </button>
      </form>
      <p className="mt-4">
        Don’t have an account?{" "}
        <a href="/auth/register" className="text-blue-600 underline">
          Register
        </a>
      </p>
    </div>
  );
};

export default Login;
