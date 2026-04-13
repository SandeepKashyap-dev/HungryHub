import React from "react";
import { useState, useEffect } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { FaUser, FaBars, FaTimes } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "./config/api";

function Nav() {
  const [foods, setfoods] = useState([]);
  const [search, searchupdate] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showProfileSidebar, setShowProfileSidebar] = useState(false);
  const [orders, setOrders] = useState([]);
  const [location, setLocation] = useState("Click to Detect...");
  const navigate = useNavigate();

  const getUserLocation = () => {
    if (navigator.geolocation) {
      setLocation("Fetching...");
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
            );
            const data = await response.json();
            const city = data.address.city || data.address.town || data.address.village || "";
            const area = data.address.suburb || data.address.neighbourhood || "";
            const formattedLocation = area && city ? `${area}, ${city}` : (area || city || "Location Found");
            setLocation(formattedLocation);
          } catch (error) {
            setLocation("Location not found");
          }
        },
        () => {
          setLocation("Permission Denied");
        }
      );
    } else {
      setLocation("Not Supported");
    }
  };



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
        setIsAdmin(false);
      } catch (error) {
        localStorage.removeItem("user");
      }
    } else if (storedAdmin) {
      try {
        const adminData = JSON.parse(storedAdmin);
        setUser({ email: adminData.email, fullname: "Admin" });
        setIsAdmin(true);
      } catch (error) {
        localStorage.removeItem("adminData");
      }
    } else {
      setUser(null);
      setIsAdmin(false);
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
      const storedAdmin = localStorage.getItem("adminData");
      
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setIsAdmin(false);
          setShowProfileSidebar(false);
        } catch (error) {
          setUser(null);
        }
      } else if (storedAdmin) {
        try {
          const adminData = JSON.parse(storedAdmin);
          setUser({ email: adminData.email, fullname: "Admin" });
          setIsAdmin(true);
          setShowProfileSidebar(false);
        } catch (error) {
          setUser(null);
        }
      }
    };

    const handleUserLogout = () => {
      setUser(null);
      setIsAdmin(false);
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
    setMobileMenuOpen(false);

    window.dispatchEvent(new Event("userLogout"));
    
    navigate("/");
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
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20 gap-4">
            
            {/* Brand Logo */}
            <div className="flex items-center shrink-0">
              <Link to="/" className="flex items-center gap-2 group">
                <span className="text-2xl md:text-3xl group-hover:scale-110 transition-transform">🍔</span>
                <h3 className="text-xl md:text-2xl font-black text-orange-500 tracking-tight">HungryHub</h3>
              </Link>
            </div>

            {/* Desktop Location Pill */}
            <div className="hidden lg:flex items-center cursor-pointer group bg-orange-50 hover:bg-orange-100 px-4 py-2 rounded-full transition-colors border border-orange-100" onClick={getUserLocation}>
              <span className="font-semibold text-xs text-gray-500 mr-2 uppercase tracking-wider">Deliver To:</span>
              <FaLocationDot className="text-orange-500 mr-1 group-hover:animate-bounce" />
              <span className="font-bold text-sm text-orange-600 truncate max-w-[200px]">
                {location === "Click to Detect..." ? "Detect Location" : location}
              </span>
            </div>

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 max-w-md ml-auto">
              <form className="w-full relative" onSubmit={hendleSearch}>
                <div className="relative flex items-center bg-gray-100 hover:bg-gray-200 transition-colors rounded-full px-4 py-2.5 border border-transparent focus-within:bg-white focus-within:border-orange-400 focus-within:ring-4 focus-within:ring-orange-100 shadow-inner">
                  <IoSearchSharp className="text-xl text-gray-500 mr-2" />
                  <input
                    type="text"
                    value={search}
                    placeholder="Search for delicious food..."
                    onChange={(e) => searchupdate(e.target.value)}
                    className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder-gray-500 font-medium"
                  />
                  {search && (
                    <div className="absolute left-0 right-0 top-full mt-3 bg-white text-left rounded-2xl z-50 p-2 shadow-xl border border-gray-100">
                      {uniqueFoods.length > 0 ? (
                        uniqueFoods.map((food) => (
                          <div
                            key={food._id}
                            className="flex items-center gap-3 p-3 cursor-pointer hover:bg-orange-50 rounded-xl transition-colors"
                            onClick={() => {
                              const element = document.getElementById(food._id);
                              if (element) {
                                element.scrollIntoView({ behavior: "smooth" });
                              }
                              searchupdate("");
                            }}
                          >
                            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0">
                               <img src={food.image} alt={food.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-gray-800 text-sm">{food.name}</span>
                              <span className="text-xs text-gray-500">{food.category}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="p-4 text-gray-500 text-center font-medium text-sm">No food found 😢</p>
                      )}
                    </div>
                  )}
                </div>
              </form>
            </div>

            {/* Desktop Profile Button */}
            <div className="hidden md:flex items-center shrink-0 ml-2">
              <button
                onClick={(e) => {
                  if (user) {
                    e.preventDefault();
                    setShowProfileSidebar(!showProfileSidebar);
                  } else {
                    navigate("/login");
                  }
                }}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-full font-semibold transition-all shadow-md shadow-orange-200 hover:shadow-lg hover:-translate-y-0.5"
              >
                <FaUser className="text-sm" />
                <span>{user ? (isAdmin ? "Admin" : user.fullname.split(' ')[0]) : "Sign In"}</span>
              </button>
            </div>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden p-2 text-2xl text-gray-700 hover:text-orange-500 transition-colors rounded-full hover:bg-gray-100"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? "opacity-100 max-h-[600px] border-b" : "opacity-0 max-h-0 overflow-hidden border-transparent"} bg-white shadow-xl absolute w-full`}>
          <div className="px-4 py-5 space-y-5 bg-gray-50">
            
            {/* Mobile Location Header */}
            <div 
              className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-sm border border-gray-100 cursor-pointer hover:border-orange-300 transition-colors" 
              onClick={getUserLocation}
            >
              <div className="flex items-center gap-4">
                <div className="bg-orange-100 p-3 rounded-full shrink-0">
                  <FaLocationDot className="text-orange-500 text-xl" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-0.5">Current Location</span>
                  <span className="text-sm font-black text-gray-800 line-clamp-1">
                    {location === "Click to Detect..." ? "Tap to detect location" : location}
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile Search */}
            <form className="relative" onSubmit={hendleSearch}>
              <div className="relative flex items-center bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-200 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-200 transition-all">
                <IoSearchSharp className="mr-3 text-orange-500 text-xl" />
                <input
                  type="text"
                  value={search}
                  placeholder="What are you craving?"
                  onChange={(e) => searchupdate(e.target.value)}
                  className="w-full outline-none text-sm font-medium text-gray-800 placeholder-gray-400"
                />
              </div>

              {search && (
                <div className="absolute left-0 right-0 top-full z-50 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden max-h-60 overflow-y-auto">
                  {uniqueFoods.length > 0 ? (
                    uniqueFoods.map((food) => (
                      <div
                        key={food._id}
                        className="flex items-center gap-3 p-3 border-b border-gray-50 cursor-pointer hover:bg-orange-50"
                        onClick={() => {
                          const element = document.getElementById(food._id);
                          if (element) {
                            element.scrollIntoView({ behavior: "smooth" });
                          }
                          searchupdate("");
                          setMobileMenuOpen(false);
                        }}
                      >
                         <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0">
                             <img src={food.image} alt={food.name} className="w-full h-full object-cover" />
                         </div>
                         <div className="flex flex-col">
                           <span className="text-sm font-bold text-gray-800">{food.name}</span>
                           <span className="text-xs text-gray-500">{food.category}</span>
                         </div>
                      </div>
                    ))
                  ) : (
                    <p className="p-4 text-gray-500 text-sm font-medium text-center">No food found</p>
                  )}
                </div>
              )}
            </form>

            {/* Mobile Buttons */}
            <div className="pt-2 pb-2 space-y-3">
              <button
                onClick={() => {
                  if (user) {
                    setShowProfileSidebar((prev) => !prev);
                  } else {
                    setMobileMenuOpen(false);
                    navigate("/register");
                  }
                }}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3.5 rounded-2xl font-bold text-base transition-colors shadow-md shadow-orange-200 flex justify-center items-center gap-2"
              >
                <FaUser />
                {user ? "My Profile" : "Register / Login"}
              </button>

              {user && (
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 py-3.5 rounded-2xl font-bold text-base transition-colors flex justify-center items-center gap-2"
                >
                  🚀 Logout Account
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {}
      {}
      {user && (
        <>
          {}
          {showProfileSidebar && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
              onClick={() => setShowProfileSidebar(false)}
            />
          )}
          
          <div
            className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 z-50 ${
              showProfileSidebar ? "translate-x-0" : "translate-x-full"
            } overflow-y-auto`}
          >
            <div className={`${isAdmin ? "bg-orange-600" : "bg-orange-500"} text-white p-6 relative`}>
              <button
                onClick={() => setShowProfileSidebar(false)}
                className="absolute top-4 right-4 text-2xl font-bold hover:scale-110 transition-transform"
              >
                ✕
              </button>
              <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-black">{isAdmin ? "Admin Control" : "Profile"}</h2>
                <p className="text-orange-100 text-xs font-semibold uppercase tracking-widest">
                  {isAdmin ? "HungryHub Management" : "Standard Customer"}
                </p>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-gray-50 p-6 rounded-3xl text-center border border-gray-100 shadow-inner">
                <div className={`w-20 h-20 ${isAdmin ? "bg-orange-600" : "bg-orange-500"} text-white rounded-full flex items-center justify-center text-4xl mx-auto mb-4 shadow-lg ring-4 ring-white`}>
                  {isAdmin ? "🔑" : <FaUser />}
                </div>
                <p className="text-xl font-black text-gray-800">{isAdmin ? "System Admin" : user.fullname}</p>
                <p className="text-sm text-gray-500 font-medium">{user.email}</p>
              </div>

              {isAdmin ? (
                <div className="space-y-3">
                   <p className="text-xs font-bold text-gray-400 uppercase ml-1">Dashboard Links</p>
                   <Link
                     to="/addfood"
                     onClick={() => setShowProfileSidebar(false)}
                     className="flex items-center gap-3 w-full bg-white border border-gray-100 p-4 rounded-2xl font-bold text-gray-700 hover:bg-orange-50 hover:border-orange-200 transition-all shadow-sm"
                   >
                     <span className="text-xl">🛠️</span> Admin Panel
                   </Link>
                   <Link
                     to="/adminreg"
                     onClick={() => setShowProfileSidebar(false)}
                     className="flex items-center gap-3 w-full bg-white border border-gray-100 p-4 rounded-2xl font-bold text-gray-700 hover:bg-orange-50 hover:border-orange-200 transition-all shadow-sm"
                   >
                     <span className="text-xl">➕</span> Add New Admin
                   </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100">
                    <p className="text-xs text-orange-600 font-bold uppercase mb-2">Order Activity</p>
                    {orders.length > 0 ? (
                      <div className="space-y-2">
                        {orders.slice(0, 3).map((order) => (
                          <div key={order._id} className="bg-white p-2 rounded-xl text-xs flex justify-between items-center shadow-sm">
                            <span className="font-bold">#{order._id?.slice(-6)}</span>
                            <span className="text-gray-400">₹{order.total}</span>
                            <span className="text-green-600 font-black uppercase text-[10px]">{order.status}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-xs italic">No orders yet</p>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Link to="/Profile" onClick={() => setShowProfileSidebar(false)} className="w-full text-center bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition">View Dashboard</Link>
                    <Link to="/orders" onClick={() => setShowProfileSidebar(false)} className="w-full text-center bg-orange-100 text-orange-700 py-3 rounded-xl font-bold hover:bg-orange-200 transition">My Orders</Link>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-gray-100">
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-500 text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-red-100 hover:bg-red-600 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                   🚀 Logout
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
