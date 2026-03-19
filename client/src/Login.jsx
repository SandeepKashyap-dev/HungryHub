import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {

  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [showpassword, setshowpassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handlesubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter all fields");
      return;
    }

    const data = { email, password };

    try {

      const respons = await fetch("https://hungryhub-1-53st.onrender.com/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
      });

      const result = await respons.json();

      if (respons.ok) {
        localStorage.setItem("token", result.token);
        alert(result.message);
        const redirectTo = location.state?.redirectTo || "/Profile";
        navigate(redirectTo);
        setemail("");
        setpassword("");
      } else {
        alert(result.message);
      }

    } catch (error) {
      alert("Some error occurred");
    }
  };

  return (

    <div className=" min-h-screen flex items-center justify-center bg-gray-100">

      <div className="fixed bg-white p-8 rounded-xl shadow-lg w-[350px] border border-orange-400">

        <h2 className="text-3xl font-bold text-center text-orange-500 mb-6">
          Login Here
        </h2>

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
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold"
          >
            Submit
          </button>

        </form>

        <p className="text-center mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-orange-500 font-semibold">
            Register
          </Link>
        </p>

      </div>

    </div>

  );
}

export default Login;
