import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import {Link,useNavigate} from "react-router-dom";
import { API_ENDPOINTS } from "./config/api";

function UserDasbord(){

const[user,setuser]=useState(null);
const[orders,setorders]=useState([]);
const Navigate =useNavigate();
const [editMode, setEditMode] = useState(false);
const [fullname, setFullname] = useState("");
const [email, setEmail] = useState("");


const fetchprofile =async()=>{
  try{

  const token = localStorage.getItem("token");
  if(!token){
    Navigate("/login");
    return ;

  }

  const respons = await fetch(API_ENDPOINTS.USER_PROFILE,{
    method:"GET",
    headers:{
      "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
    }

  })
  const data =await respons.json();
  if(respons.ok){
    setuser(data.user);
  }else{
    alert(data.message);
  }
  }
  catch(error){
  };


}

const fetchOrders = async () => {
  try {
    const token = localStorage.getItem("token");
    
    const response = await fetch(API_ENDPOINTS.GET_USER_ORDERS, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (response.ok) {
      setorders(Array.isArray(data.orders) ? data.orders : []);
    } else {
      setorders([]);
    }
  } catch (error) {
  }
}

const handleCancelOrder = async (orderId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(API_ENDPOINTS.CANCEL_ORDER(orderId), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      alert("Order cancelled successfully");
      setorders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: "cancelled" } : order
        )
      );
    } else {
      alert(`Failed to cancel order: ${data.message}`);
    }
  } catch (error) {
    alert("An error occurred while cancelling the order.");
  }
};

const handleLogout = () => {
  localStorage.removeItem("token");
  Navigate("/login");
};

const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        API_ENDPOINTS.USER_UPDATE_PROFILE,
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
    }
  };




  useEffect(()=>{

    fetchprofile();
    fetchOrders();
  }, []);

  return(
    <div className="flex flex-col md:flex-row min-h-screen">

      <div className="w-full md:w-72 bg-orange-500 text-white p-6 md:min-h-screen">

        <h2 className="text-2xl font-bold">HungryHub</h2>

        <p className="flex flex-row mt-8 text-xl md:text-2xl font-bold">Welcome {user?.fullname} !!</p>

        <ul className="mt-8 space-y-4">
          <li>
            <Link to="/" className="block hover:text-yellow-200">🏠 Dashboard</Link>
          </li>

          <li>
            <Link to="/profile" className="block hover:text-yellow-200">👤 Profile</Link>
          </li>

          <li>
            <Link to="/orders" className="block hover:text-yellow-200">📦 My Orders</Link>
          </li>

          {/* 🔹 Logout Button */}
          <li>
            <button onClick={handleLogout} className="hover:text-yellow-200">
              🚪 Logout
            </button>
          </li>

        </ul>
      </div>

      <div className="flex-1 p-6 md:p-8">
        <h1 className="text-3xl font-bold mb-6">
          My Profile
        </h1>

        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">

          {editMode ? (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium">Full Name</label>
                <input
                  type="text"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <button onClick={handleUpdate} className="bg-green-500 text-white px-4 py-2 rounded mr-2">
                Save
              </button>
              <button onClick={() => setEditMode(false)} className="bg-gray-500 text-white px-4 py-2 rounded">
                Cancel
              </button>
            </>
          ) : (
            <>
              <p className="mb-4">
                <strong>Full Name:</strong> {user?.fullname}
              </p>
              <p className="mb-4">
                <strong>Email:</strong> {user?.email}
              </p>
              <button onClick={() => { setEditMode(true); setFullname(user?.fullname || ""); setEmail(user?.email || ""); }} className="bg-orange-500 text-white px-4 py-2 rounded">
                Edit Profile
              </button>
            </>
          )}

        </div>

        <h2 className="text-2xl font-bold mt-12 mb-6">My Orders</h2>

        {orders.length === 0 ? (
          <p className="text-gray-600">No orders yet.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white shadow-md rounded-lg p-6 border-l-4 border-orange-500">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 pb-4 border-b">
                  <div>
                    <p className="text-xs text-gray-600">Order ID</p>
                    <p className="font-bold text-lg">#{order._id?.slice(-8)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Status</p>
                    <p>
                      <span className="capitalize px-3 py-1 bg-blue-100 text-blue-700 rounded font-semibold text-sm">
                        {order.status}
                      </span>
                    </p>
                    {['pending', 'processing'].includes(order.status) && (
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        className="mt-2 inline-block bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                      >
                        Cancel Order
                      </button>
                    )}
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