import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import {Link,useNavigate} from "react-router-dom";

function UserDasbord(){

const[user,setuser]=useState(null);
const Navigate =useNavigate();


const fetchprofile =async()=>{
  try{

  const token = localStorage.getItem("token");
  if(!token){
    Navigate("/login");
    return ;

  }

  const respons = await fetch("http://localhost:3000/api/user/userprofile",{
    method:"GET",
    headers:{
      "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
    }

  })
  const data =await respons.json();
  console.log(data);
  if(respons.ok){
    setuser(data.user);
  }else{
    alert(data.message);
  }
  }
  catch(error){
    console.log(error);
  };


}
const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:3000/api/user/updateprofile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ fullname, email }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("Profile Updated Successfully");
        setuser(data.user);
        setEditMode(false);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };




  useEffect(()=>{
    fetchprofile();
  },[]);

  return(
    <div className="flex fixed left-0 top-0 h-screen">

      {/* Sidebar */}
      <div className="w-auto bg-orange-500 text-white p-6">

        <h2 className="text-2xl  font-bold">HungryHub</h2>

        {/* 🔹 Display User Name in Sidebar */}
        <p className="flex flex-row mt-10 text-2xl font-bold">Welcome {user?.fullname} !!</p>

        <ul className="mt-8 space-y-4">

          {/* 🔹 Navigation Links */}
          <li>
            <Link to="/">🏠 Dashboard</Link>
          </li>

          <li>
            <Link to="/profile">👤 Profile</Link>
          </li>

          <li>
            <Link to="/orders">📦 My Orders</Link>
          </li>

          {/* 🔹 Logout Button */}
          <li>
            <button >
              🚪 Logout
            </button>
          </li>

        </ul>
      </div>

      {/* Main Profile Section */}
      <div className="flex-1 p-8">

        <h1 className="text-3xl font-bold mb-6">
          My Profile
        </h1>

        <div className="bg-white shadow-md rounded-lg p-6 w-[400px]">

          {/* 🔹 Display User Full Name */}
          <p className="mb-4">
            <strong>Full Name:</strong> {user?.fullname}
          </p>

          {/* 🔹 Display User Email */}
          <p className="mb-4">
            <strong>Email:</strong> {user?.email}
          </p>

          {/* 🔹 Edit Profile Button (abhi function implement nahi) */}
          <button className="bg-orange-500 text-white px-4 py-2 rounded">
            Edit Profile
          </button>

        </div>

      </div>

    </div>



  )
}
export default UserDasbord;