import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import {Link,useNavigate, useLocation} from "react-router-dom";
import { API_ENDPOINTS } from "./config/api";

function UserDasbord(){

const[user,setuser]=useState(null);
const[orders,setorders]=useState([]);
const Navigate =useNavigate();
const location = useLocation();
const [editMode, setEditMode] = useState(false);
const [fullname, setFullname] = useState("");
const [email, setEmail] = useState("");
const [phone, setPhone] = useState("");
const [address, setAddress] = useState("");
const [city, setCity] = useState("");
const [postalCode, setPostalCode] = useState("");
const [isLoading, setIsLoading] = useState(false);


const fetchprofile =async()=>{
  try{

  const token = localStorage.getItem("token");
const storedUser = localStorage.getItem("user");

if(!token || !storedUser){
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
  console.log("Profile fetch response:", respons.status, data);
  if(respons.ok){
    setuser(data.user);
    console.log("User data set:", data.user);
    setIsLoading(false);
  }else{
    alert(data.message);
    setIsLoading(false);
  }
  }
  catch(error){
    console.error("Profile fetch error:", error);
    setIsLoading(false);
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
  localStorage.removeItem("user");

  window.dispatchEvent(new Event("userLogout"));
  
  Navigate("/");
};

const handleEditClick = () => {
  console.log("Edit Profile button clicked");
  console.log("Current user data:", user);
  setEditMode(true);
  setFullname(user?.fullname || "");
  setEmail(user?.email || "");
  setPhone(user?.phone || "");
  setAddress(user?.address || "");
  setCity(user?.city || "");
  setPostalCode(user?.postalCode || "");
  console.log("Edit mode set to true, form populated");
};

const handleUpdate = async () => {
    console.log("handleUpdate called");
    console.log("Current form values:", { fullname, email, phone, address, city, postalCode });

    // Basic validation
    if (!fullname.trim() || !email.trim()) {
      alert("Full name and email are required");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      console.log("Token exists:", !!token);

      const res = await fetch(
        API_ENDPOINTS.USER_UPDATE_PROFILE,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ fullname, email, phone, address, city, postalCode }),
        }
      );

      console.log("API response status:", res.status);
      const data = await res.json();
      console.log("API response data:", data);

      if (res.ok) {
        alert("Profile Updated Successfully");
        setuser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        setEditMode(false);
      } else {
        alert(`Update failed: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("An error occurred while updating profile. Please try again.");
    }
  };




  useEffect(()=>{

    fetchprofile();
    if (location.pathname === "/orders") {
      fetchOrders();
    }
  }, [location.pathname]);

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

          {}
          <li>
            <button onClick={handleLogout} className="hover:text-yellow-200">
              🚪 Logout
            </button>
          </li>

        </ul>
      </div>

      <div className="flex-1 p-6 md:p-8">
        {location.pathname === "/orders" ? (
          <>
            <h1 className="text-3xl font-bold mb-6">My Orders</h1>

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
                        <p className="text-xs text-gray-600">Type</p>
                        <p className={`font-bold text-sm px-2 py-1 rounded inline-block ${order.orderType === 'Pickup' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                          {order.orderType || 'Delivery'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-600">Amount</p>
                        <p className="font-bold text-orange-600 text-lg">₹ {order.total}</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded mb-4">
                      <strong>{order.orderType === 'Pickup' ? '🏪 Pickup Details:' : '📍 Delivery Address:'}</strong>
                      <p className="text-sm mt-2 leading-relaxed">
                        <strong>{order.deliveryInfo?.fullName}</strong><br/>
                        {order.orderType === 'Pickup' ? (
                          <span className="text-purple-600 font-medium italic">Collect from our main kitchen</span>
                        ) : (
                          <>
                            {order.deliveryInfo?.address}<br/>
                            {order.deliveryInfo?.city}, {order.deliveryInfo?.postalCode}
                          </>
                        )}
                        <br/>
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
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-6">
              My Profile
            </h1>

            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">

              {editMode ? (
                <form onSubmit={(e) => e.preventDefault()}>
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
                  <div className="mb-4">
                    <label className="block text-sm font-medium">Phone</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full border px-3 py-2 rounded"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium">Address</label>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full border px-3 py-2 rounded"
                      placeholder="Enter your address"
                      rows="3"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium">City</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                        placeholder="Enter your city"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Postal Code</label>
                      <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                        placeholder="Enter postal code"
                      />
                    </div>
                  </div>
                  <button onClick={handleUpdate} type="button" className="bg-green-500 text-white px-4 py-2 rounded mr-2">
                    Save
                  </button>
                  <button onClick={() => setEditMode(false)} type="button" className="bg-gray-500 text-white px-4 py-2 rounded">
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  <p className="mb-4">
                    <strong>Full Name:</strong> {user?.fullname}
                  </p>
                  <p className="mb-4">
                    <strong>Email:</strong> {user?.email}
                  </p>
                  <p className="mb-4">
                    <strong>Phone:</strong> {user?.phone || "Not added"}
                  </p>
                  <p className="mb-4">
                    <strong>Address:</strong> {user?.address || "Not added"}
                  </p>
                  <p className="mb-4">
                    <strong>City:</strong> {user?.city || "Not added"}
                  </p>
                  <p className="mb-4">
                    <strong>Postal Code:</strong> {user?.postalCode || "Not added"}
                  </p>
                  <button 
                    onClick={handleEditClick}
                    type="button"
                    className="bg-orange-500 text-white px-4 py-2 rounded"
                  >
                    Edit Profile
                  </button>
                </>
              )}

            </div>
          </>
        )}
      </div>

    </div>



  )
}
export default UserDasbord;
