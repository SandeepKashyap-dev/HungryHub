import React, { useContext, useEffect, useState } from "react";
import { API_ENDPOINTS } from "./config/api";
import { CreateContext } from "./CartContext";
import { useNavigate } from "react-router-dom";
import Toast from "./Toast";
import { FaStar, FaRegStar } from "react-icons/fa";

function Section_2() {
  const [food, setFood] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState([]);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const { addtocart } = useContext(CreateContext);
  const navigate = useNavigate();

  const fetchFood = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.GET_ALL_FOOD);
      const data = await res.json();
      setFood(Array.isArray(data) ? data : []);
      const uniqueCategories = [
        "All",
        ...new Set((Array.isArray(data) ? data : []).map((item) => item.category?.trim() || "Unknown")),
      ];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Failed fetching food items", error);
    }
  };

  useEffect(() => {
    fetchFood();
  }, []);

  const handleRateFood = async (foodId, ratingValue) => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      alert("Please login to rate this food item");
      navigate("/login", { state: { redirectTo: "/" } });
      return;
    }

    try {
      const res = await fetch(API_ENDPOINTS.RATE_FOOD(foodId), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ rating: ratingValue })
      });

      if (res.ok) {
        setToastMessage("Thanks for your rating! ⭐");
        setShowToast(true);
        fetchFood();
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Failed to submit rating");
      }
    } catch (error) {
      console.error("Error rating food", error);
      alert("An error occurred");
    }
  };

  const handleAddToCart = (foodItem) => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      alert("Please login to add items to cart");
      navigate("/login", { state: { redirectTo: "/" } });
      return;
    }

    addtocart(foodItem);
    setToastMessage(`${foodItem.name} added to cart!`);
    setShowToast(true);
  };

  const handleOrderNow = (foodItem) => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      alert("Please login to place an order");
      navigate("/login", { state: { redirectTo: "/cart" } });
      return;
    }

    addtocart(foodItem);
    navigate("/cart");
  };

  const filteredFood = food.filter((item) => {
    if (!item) return false;
    const name = item.name || "";
    const category = item.category || "";
    const matchesCategory = selectedCategory === "All" || category === selectedCategory;
    const matchesSearch = name.toLowerCase().includes(search.toLowerCase()) ||
      category.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const groupedFood = filteredFood.reduce((acc, item) => {
    const cat = item.category || "Unknown";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-6">Food Categories</h2>

      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`px-4 py-2 rounded-full border ${selectedCategory === cat ? "bg-orange-500 text-white" : "bg-white text-gray-700 hover:bg-orange-100"}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex justify-center mb-8">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by food name or category"
          className="w-full max-w-xl px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-400 focus:border-orange-400"
        />
      </div>

      {Object.keys(groupedFood).length === 0 ? (
        <div className="text-center text-gray-500 py-10">No items found for the selected filter.</div>
      ) : (
        Object.keys(groupedFood).map((cat) => (
          <div key={cat} className="mb-12">
            <h3 className="text-2xl font-semibold mb-4 text-center">{cat}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {groupedFood[cat].map((item) => (
                <div key={item._id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300" id={item._id}>
                  <img src={item.image} alt={item.name} className="w-full h-40 object-cover rounded-t-2xl" />
                  <div className="p-4">
                    <h4 className="text-lg font-semibold">{item.name}</h4>
                    <div className="flex items-center gap-1 mt-1 mb-2">
                       {[1, 2, 3, 4, 5].map((star) => (
                          <span 
                             key={star} 
                             className="cursor-pointer text-yellow-500 text-lg hover:scale-125 transition-transform"
                             onClick={() => handleRateFood(item._id, star)}
                             title={`Rate ${star} star${star > 1 ? 's' : ''}`}
                          >
                             {star <= Math.round(item.rating || 0) ? <FaStar /> : <FaRegStar />}
                          </span>
                       ))}
                       <span className="text-xs text-gray-500 ml-1 font-medium">({item.numReviews || 0} reviews)</span>
                    </div>
                    <p className="inline-block bg-orange-100 text-orange-600 font-bold text-xs px-2 py-1 rounded-full">{item.category || "Unknown"}</p>
                    <p className="mt-2">₹ {item.price}</p>
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl font-medium transition"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleOrderNow(item)}
                      className="mt-2 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-xl font-medium transition"
                    >
                      Order Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
      {showToast && (
        <Toast message={toastMessage} onClose={() => setShowToast(false)} />
      )}
    </section>
  );
}

export default Section_2;
