import React from "react";
import { useState, useEffect } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "./config/api";

function Nav() {
  const [foods, setfoods] = useState([]);
  const [search, searchupdate] = useState("");
  const [user, setUser] = useState(null);
  const [showProfileSidebar, setShowProfileSidebar] = useState(false);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();



  useEffect(() => {
    const fetchfood = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.GET_ALL_FOOD);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        if (Array.isArray(data)) {
          setfoods(data);
        } else {
          console.error("API did not return an array:", data);
          setfoods([]);
        }
      } catch (error) {
        console.error("Failed to fetch foods:", error);
        setfoods([]);
      }
    };
    fetchfood();
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedAdmin = localStorage.getItem("adminData");
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem("user");
      }
    } else if (storedAdmin) {
      try {
        const adminData = JSON.parse(storedAdmin);
        setUser({ email: adminData.email, fullname: "Admin" });
      } catch (error) {
        localStorage.removeItem("adminData");
      }
    } else {
      setUser(null);
    }

    const handleStorageChange = (e) => {
      if (e.key === "user") {
        if (e.newValue) {
          try {
            setUser(JSON.parse(e.newValue));
            setShowProfileSidebar(false);
          } catch (error) {
            setUser(null);
          }
        } else {
          setUser(null);
          setShowProfileSidebar(false);
        }
      }
    };

    const handleUserLogin = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setShowProfileSidebar(false);
        } catch (error) {
          setUser(null);
        }
      }
    };

    const handleUserLogout = () => {
      setUser(null);
      setShowProfileSidebar(false);
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("userLogin", handleUserLogin);
    window.addEventListener("userLogout", handleUserLogout);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userLogin", handleUserLogin);
      window.removeEventListener("userLogout", handleUserLogout);
    };
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserOrders();
    }
  }, [user]);

  const fetchUserOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(API_ENDPOINTS.GET_USER_ORDERS, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (response.ok) {
        setOrders(Array.isArray(data.orders) ? data.orders : []);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("adminAuth");
    localStorage.removeItem("adminData");
    setUser(null);
    setShowProfileSidebar(false);

    window.dispatchEvent(new Event("userLogout"));
    
    navigate("/login");
  };


  const filterfoods = foods.filter((food) => {
    const nameMatch = (food.name || "").toLowerCase().includes(search.toLowerCase());
    const categoryMatch = (food.category || "").toLowerCase().includes(search.toLowerCase());
    return nameMatch || categoryMatch;
  });

  // Get unique food items by name
  const uniqueFoods = filterfoods.reduce((acc, food) => {
    if (!acc.some(item => item.name === food.name)) {
      acc.push(food);
    }
    return acc;
  }, []);

  const hendleSearch = (e) => {
    e.preventDefault();
    // Keep the search value so filtered results remain visible.
    // Optionally you can use this place to direct to a search result page.
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white shadow ">
        <div className=" flex flex-wrap md:flex-row
  md:flex-nowrap flex-row items-center  justify-between md:mx-2   py-4 gap-2">
          <div className="flex md:items-center gap-2">
            <span className="flex">
              <span className="text-2xl">🍔</span>
              <h3 className="text-xl font-bold text-orange-500"> <Link to="/">HungryHub</Link> </h3>
            </span>
          </div>
          <div className="hidden md:flex items-center ">
            <span className="font-bold">Deliverd to:</span>
            <FaLocationDot className="text-orange-500 m-2 " />
            <span className="md:text-base text-gray-600 p-1">Current Location</span>
            <span className="font-bold md:inline">Thanesar Old Bus Stand, Kurukshetra</span>
          </div>

          <form className="relative flex " onSubmit={hendleSearch}>
            <div className="relative  w-full flex items-center
              border-gray-300
             rounded px-3 py-2
             focus-within:ring-2
             focus-within:ring-orange-400">
              <IoSearchSharp className="mr-2 text-orange-500 font-bold" />

              <input
                type="text"
                value={search}
                placeholder="Search Food"
                onChange={(e) => searchupdate(e.target.value)}
                className="outline-none "




              />
              {search && (<div className="absolute left-0 right-0 top-full mt-2 bg-white text-center rounded z-50 "> {uniqueFoods.length > 0 ? (uniqueFoods.map((food) => (<p key={food._id} className="p-2 cursor-pointer hover:bg-gray-100" onClick={() => {const element=document.getElementById(food._id);if(element){element.scrollIntoView({behavior:"smooth"});}searchupdate("");}} > {food.name} </p>))) : (<p className="p-2 text-gray-500 inline-block">No food found</p>)} </div>)}

            </div>
          </form>
          <Link
              to={user && user.fullname !== "Admin" ? "#" : "/register"}
              onClick={(e) => {
                if (user && user.fullname !== "Admin") {
                  e.preventDefault();
                  setShowProfileSidebar(!showProfileSidebar);
                }
              }}
              className="flex items-center gap-2 text-orange-500 px-2 py-2 ml-4 rounded font-bold cursor-pointer hover:text-orange-600"
            >
              <FaUser />
              {user && user.fullname !== "Admin" ? user.fullname : "Reg_User"}
            </Link>
        </div>
      </nav>

      {}
      {user && user.fullname !== "Admin" && (
        <>
          {}
          {showProfileSidebar && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setShowProfileSidebar(false)}
            />
          )}

          {}
          <div
            className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 z-50 ${
              showProfileSidebar ? "translate-x-0" : "translate-x-full"
            } overflow-y-auto`}
          >
            {}
            <div className="bg-orange-500 text-white p-6">
              <button
                onClick={() => setShowProfileSidebar(false)}
                className="text-2xl font-bold mb-4 float-right"
              >
                ✕
              </button>
              <h2 className="text-2xl font-bold clear-both">Profile</h2>
            </div>

            {}
            <div className="p-6 space-y-4">
              <div className="bg-gray-100 p-4 rounded-lg text-center">
                <div className="w-16 h-16 bg-orange-500 text-white rounded-full flex items-center justify-center text-3xl mx-auto mb-3">
                  <FaUser />
                </div>
                <p className="text-xl font-bold text-gray-800">{user.fullname}</p>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 font-semibold">Email</p>
                <p className="text-gray-800 break-all">{user.email}</p>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 font-semibold mb-2">Recent Orders</p>
                {orders.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {orders.slice(0, 5).map((order) => (
                      <div
                        key={order._id}
                        className="bg-gray-100 p-2 rounded text-sm"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-orange-600">
                            #{order._id?.slice(-6)}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            order.status === "completed"
                              ? "bg-green-200 text-green-800"
                              : order.status === "cancelled"
                              ? "bg-red-200 text-red-800"
                              : "bg-blue-200 text-blue-800"
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-gray-600 text-xs mt-1">
                          Rs. {order.totalPrice}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No orders yet</p>
                )}
              </div>

              <div className="border-t pt-4 space-y-2">
                <Link
                  to="/Profile"
                  onClick={() => setShowProfileSidebar(false)}
                  className="block w-full text-center bg-orange-500 text-white py-2 rounded font-semibold hover:bg-orange-600 transition"
                >
                  View Full Profile
                </Link>
                <Link
                  to="/orders"
                  onClick={() => setShowProfileSidebar(false)}
                  className="block w-full text-center bg-blue-500 text-white py-2 rounded font-semibold hover:bg-blue-600 transition"
                >
                  All Orders
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-500 text-white py-2 rounded font-semibold hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
export default Nav;
