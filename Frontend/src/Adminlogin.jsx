import React from "react";
import { useState } from "react";

import { useNavigate } from "react-router-dom";

function Adminlogin() {

    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const navigate=useNavigate();

    const handlelogin = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            return (
                alert("Please enter all fields")
            )
        }

        try {
            const res = await fetch("http://localhost:3000/api/admin/adminlogin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            console.log(data);
            if (res.ok) {
                localStorage.setItem("adminAuth","true");
                alert("Login successful")
                navigate("/addfood")
                setemail("");
                setpassword("");
            }
            else {
                alert("Invalid email & password");
                setemail("");
                setpassword("");
            }

        }


        catch (error) {
            alert("Some error: " + error)
        }



    }

    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>
                <form onSubmit={handlelogin} className="flex flex-col gap-8" >
                    <input name="email" value={email} onChange={(e) => setemail(e.target.value)} type="text" placeholder="Enter Regsterd Email" className="border p-2 rounded w-full" />
                    <input type="password" value={password} name="password" onChange={(e) => setpassword(e.target.value)} placeholder="Enter Password" className="border p-2 rounded w-full" />
                    <button type="submit" className=" bg-orange-500 text-white  shadow-md rounded-lg  text-xl py-1 px-16" > Login</button>
                </form>

            </div>
        </div>
    )
}
export default Adminlogin;