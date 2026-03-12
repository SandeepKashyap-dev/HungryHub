import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import {Link,useNavigate} from "react-router-dom";

function UserDasbord(){

const[user,setuser]=useState(null);
const[orders,setorders]=useState([]);
const Navigate =useNavigate();


const fetchprofile =async()=>{
  try{

  const token = localStorage.getItem("token");
  if(!token){
    Navigate("/login");
    return ;

  }

  const respons = await fetch("https://hungryhub-backend.onrender.com/api/user/userprofile",{
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

const fetchOrders = async () => {
  try {
    const token = localStorage.getItem("token");
    console.log("📦 Fetching orders with token:", token?.slice(0, 20) + "...");
    
    const response = await fetch("https://hungryhub-backend.onrender.com/api/orders/user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    console.log("📦 Orders Response:", response.status, data);
    
    if (response.ok) {
      console.log("✅ Orders fetched successfully:", data.orders?.length);
      setorders(Array.isArray(data.orders) ? data.orders : []);
    } else {
      console.error("❌ Failed to fetch orders:", data.message);
      setorders([]);
    }
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    setorders([]);
  }
}

const handleLogout = () => {
  localStorage.removeItem("token");
  Navigate("/login");
};

const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "https://hungryhub-backend.onrender.com/api/user/updateprofile",
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
    console.log("📊 UserDashboard mounted, fetching data...");
    fetchprofile();
    fetchOrders();
  }, []);

  return(
    <div className="flex  left-0 top-0 h-screen">

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
            <button onClick={handleLogout} className="hover:text-yellow-200">
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

        {/* My Orders Section */}
        <h2 className="text-2xl font-bold mt-12 mb-6">My Orders</h2>

        {orders.length === 0 ? (
          <p className="text-gray-600">No orders yet.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white shadow-md rounded-lg p-6 border-l-4 border-orange-500">
                <div className="grid grid-cols-4 gap-4 mb-6 pb-4 border-b">
                  <div>
                    <p className="text-xs text-gray-600">Order ID</p>
                    <p className="font-bold text-lg">#{order._id?.slice(-8)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Status</p>
                    <p><span className="capitalize px-3 py-1 bg-blue-100 text-blue-700 rounded font-semibold text-sm">{order.status}</span></p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Order Date</p>
                    <p className="font-semibold">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600">Amount</p>
                    <p className="font-bold text-orange-600 text-lg">₹ {order.total}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded mb-4">
                  <strong>📍 Delivery Address:</strong>
                  <p className="text-sm mt-2 leading-relaxed">
                    <strong>{order.deliveryInfo?.fullName}</strong><br/>
                    {order.deliveryInfo?.address}<br/>
                    {order.deliveryInfo?.city}, {order.deliveryInfo?.postalCode}<br/>
                    📞 {order.deliveryInfo?.phone}<br/>
                    📧 {order.deliveryInfo?.email}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded mb-4">
                  <strong>🍔 Order Items:</strong>
                  <div className="mt-2 space-y-2 border-t pt-2">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="text-sm flex justify-between items-center">
                        <span>{item.name}</span>
                        <span className="text-gray-600">x {item.quantity}</span>
                        <span className="font-semibold">₹ {item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-200 p-4 rounded flex justify-between items-center">
                  <div>
                    <strong>💳 Payment Method:</strong> <span className="capitalize ml-2 bg-orange-100 px-3 py-1 rounded text-orange-700 font-semibold">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod.toUpperCase()}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600">Total Amount</p>
                    <p className="text-2xl font-bold text-orange-600">₹ {order.total}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>



  )
}
export default UserDasbord;