import React, { useContext, useEffect, useState } from "react";
import { API_ENDPOINTS } from "./config/api";
import { CreateContext } from "./CartContext";
import { useNavigate } from "react-router-dom";

function Section_2() {
  const [food, setFood] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState([]);
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
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.category || "").toLowerCase().includes(search.toLowerCase());
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
                    <p className="text-sm text-orange-500 font-medium">🍴 {item.restaurant}</p>
                    <p className="inline-block bg-gray-200 text-xs px-2 py-1 rounded-full mt-2">{item.category || "Unknown"}</p>
                    <p className="mt-2">₹ {item.price}</p>
                    <button
                      onClick={() => handleOrderNow(item)}
                      className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-xl font-medium transition"
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
    </section>
  );
}

export default Section_2;
