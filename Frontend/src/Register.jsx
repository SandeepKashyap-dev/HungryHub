import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import{validateEmail,validatePassword,validateFullName,validatePhoneNumber,validateAddress,getPasswordStrength} from "./utils/validation";
function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
 const passwordStrength = getPasswordStrength(formData.password);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!validateFullName(formData.fullname)) {
      setError("Please enter a valid full name");
      return false;
    }
    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!validatePassword(formData.password)) {
      setError("Password must be at least 8 characters long and contain both letters and numbers");
      return false;
    }
    if(passwordStrength < 3) {
      setError("Password is too weak. Consider adding uppercase letters, numbers, or special characters.");
      return false;
    } 
    return true;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // run frontend validation and stop if invalid
    if (!validateForm()) return;

    try {
      const response = await fetch("https://hungryhub-backend.onrender.com/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed");
        return;
      }
      localStorage.setItem("token", data.token);

      navigate("/login");

    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      
      <div className="fixed bg-white p-8 rounded-xl shadow-lg w-[350px] border border-orange-400">

        <h2 className="text-3xl font-bold text-center text-orange-500 mb-6">
          Register Here
        </h2>

        {error && (
          <p className="text-red-500 text-center mb-3">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            name="fullname"
            placeholder="Full Name"
            value={formData.fullname}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-orange-400 rounded-lg focus:outline-none"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-orange-400 rounded-lg focus:outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-orange-400 rounded-lg focus:outline-none"
          />

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold"
          >
            Submit
          </button>

        </form>

        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-orange-500 font-semibold">
            Login
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Register;
