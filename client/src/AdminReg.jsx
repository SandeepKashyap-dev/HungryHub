import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "./config/api";

function AdminRegister() {

    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {

        e.preventDefault();

        if (!email || !password) {
            alert("Please fill all fields");
            return;
        }

        try {

            const res = await fetch(API_ENDPOINTS.ADMIN_REGISTER, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (res.ok) {
                alert("Admin Registered Successfully");
                navigate("/adminlogin");
            }
            else {
                alert(data.message || "Registration Failed");
            }

        }

        catch (error) {
            alert("Server Error: " + error);
        }

    };


    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-100">

            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">

                <h2 className="text-2xl font-bold text-center mb-6">Admin Register</h2>

                <form onSubmit={handleRegister} className="flex flex-col gap-6">

                    <input
                        type="email"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) => setemail(e.target.value)}
                        className="border p-2 rounded"
                    />

                    <input
                        type="password"
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setpassword(e.target.value)}
                        className="border p-2 rounded"
                    />

                    <button
                        type="submit"
                        className="bg-orange-500 text-white py-2 rounded"
                    >
                        Register
                    </button>

                </form>

            </div>

        </div>

    );
}

export default AdminRegister;
