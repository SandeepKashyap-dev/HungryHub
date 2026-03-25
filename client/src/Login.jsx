import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { API_ENDPOINTS } from "./config/api";

function Login() {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [showpassword, setshowpassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handlesubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter all fields");
      return;
    }

    setIsLoading(true);

    try {
      console.log("🔐 Login attempting with email:", email);
      console.log("📡 API endpoint:", API_ENDPOINTS.UNIFIED_LOGIN);
      
      const response = await fetch(API_ENDPOINTS.UNIFIED_LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password })
      });

      console.log("📊 Response status:", response.status);
      console.log("📊 Response type:", response.headers.get('content-type'));

      if (!response.ok && response.status === 404) {
        alert("API endpoint not found. Server might not be running.");
        setIsLoading(false);
        return;
      }

      // Check content-type before parsing JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("❌ Server returned non-JSON response:", contentType);
        const text = await response.text();
        console.error("Response body:", text.substring(0, 200));
        alert("Server error: Expected JSON but got " + (contentType || "HTML"));
        setIsLoading(false);
        return;
      }

      const result = await response.json();
      
      console.log("✅ API Response:", result);

      if (response.ok) {
        // Check if it's admin or user
        if (result.role === "admin") {
          localStorage.setItem("adminAuth", result.token);
          localStorage.setItem("adminData", JSON.stringify(result.admin));
          alert("Admin login successful");
          window.dispatchEvent(new Event("userLogin"));
          navigate("/addfood");
        } else if (result.role === "user") {
          localStorage.setItem("token", result.token);
          localStorage.setItem("user", JSON.stringify(result.user));
          alert("User login successful");
          window.dispatchEvent(new Event("userLogin"));
          const redirectTo = location.state?.redirectTo || "/Profile";
          navigate(redirectTo);
        } else {
          alert("Unknown role received from server");
          console.error("❌ Unknown role:", result.role);
        }
        setemail("");
        setpassword("");
        setIsLoading(false);
      } else {
        const errorMsg = result.message || "Invalid credentials";
        alert("❌ " + errorMsg);
        console.error("Login error:", errorMsg);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("❌ Catch error:", error);
      alert("Connection error: " + error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="fixed bg-white p-8 rounded-xl shadow-lg w-[350px] border border-orange-400">
        <h2 className="text-3xl font-bold text-center text-orange-500 mb-2">
          Login Here
        </h2>
        <p className="text-center text-gray-600 text-sm mb-6">
          Admin or User
        </p>

        <form onSubmit={handlesubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setemail(e.target.value)}
            className="w-full px-4 py-2 border border-orange-400 rounded-lg focus:outline-none"
          />
          <div className="relative">
            <input
              type={showpassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
              className="w-full px-4 py-2 border border-orange-400 rounded-lg focus:outline-none"
            />
            <span
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
              onClick={() => setshowpassword(!showpassword)}
            >
              {showpassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white py-2 rounded-lg font-semibold transition"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-orange-500 font-semibold">
            Register as User
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
