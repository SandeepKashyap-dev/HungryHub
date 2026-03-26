import React, { useState, useEffect } from "react";
import { API_ENDPOINTS } from "./config/api";

function Adminpenal() {
  const emptyFood = {
    name: "",
    image: "",
    price: "",
    restaurant: "",
    category: "",
    isPopular: true,
  };

  const [food, setFood] = useState(emptyFood);
  const [foods, setFoods] = useState([]);
  const [users, setUsers] = useState([]);
  const [editFoodId, setEditFoodId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchFoods = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.GET_ALL_FOOD);
      const data = await res.json();
      setFoods(data);
    } catch (error) {
      console.error("fetchFoods error", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.GET_ALL_USERS);
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("fetchUsers error", error);
    }
  };

  useEffect(() => {
    fetchFoods();
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFood((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        ...food,
        price: Number(food.price),
        isPopular: food.isPopular === "true" || food.isPopular === true,
      };

      let res;
      if (editFoodId) {
        res = await fetch(API_ENDPOINTS.UPDATE_FOOD(editFoodId), {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(API_ENDPOINTS.ADD_FOOD, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "API error");
      }

      const responseData = await res.json();
      setMessage(editFoodId ? "Food updated successfully" : "Food added successfully");
      setFood(emptyFood);
      setEditFoodId(null);
      fetchFoods();
    } catch (error) {
      console.error("handleSubmit error", error);
      alert("Error: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const startEditFood = (item) => {
    setFood({
      name: item.name || "",
      image: item.image || "",
      price: item.price || "",
      restaurant: item.restaurant || "",
      category: item.category || "",
      isPopular: item.isPopular ?? true,
    });
    setEditFoodId(item._id);
  };

  const cancelEdit = () => {
    setFood(emptyFood);
    setEditFoodId(null);
    setMessage("");
  };

  const removeFood = async (id) => {
    if (!window.confirm("Delete this food item?")) return;
    try {
      const res = await fetch(API_ENDPOINTS.DELETE_FOOD(id), { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Delete failed");
      }
      setMessage("Food deleted successfully");
      fetchFoods();
    } catch (error) {
      console.error("removeFood error", error);
      alert("Error: " + error.message);
    }
  };

  const removeUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      const res = await fetch(API_ENDPOINTS.DELETE_USER(id), { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Delete failed");
      }
      setMessage("User deleted successfully");
      fetchUsers();
    } catch (error) {
      console.error("removeUser error", error);
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white p-5 rounded-xl shadow-sm">
          <div>
            <h1 className="text-3xl font-bold text-orange-500">Admin Panel</h1>
            <p className="text-sm text-gray-500">User count: {users.length}</p>
          </div>
          <div className="flex gap-2">
            <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg">Add Food</span>
            <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg">Update / Delete Food</span>
            <span className="px-4 py-2 bg-red-100 text-red-700 rounded-lg">User Control</span>
          </div>
        </div>

        {message && <p className="text-green-700 font-medium">{message}</p>}

        <div className="grid md:grid-cols-2 gap-6">
          <section className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-4">{editFoodId ? "Update Food" : "Add Food"}</h2>
            <form className="space-y-3" onSubmit={handleSubmit}>
              <input name="name" value={food.name} onChange={handleChange} placeholder="Food Name" className="w-full p-2 border rounded" />
              <input name="image" value={food.image} onChange={handleChange} placeholder="Image URL" className="w-full p-2 border rounded" />
              <input name="price" value={food.price} onChange={handleChange} type="number" placeholder="Price" className="w-full p-2 border rounded" />
              <input name="restaurant" value={food.restaurant} onChange={handleChange} placeholder="Restaurant" className="w-full p-2 border rounded" />
              <input name="category" value={food.category} onChange={handleChange} placeholder="Category" className="w-full p-2 border rounded" />
              <div className="flex gap-2">
                <button type="submit" disabled={isLoading} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg">
                  {isLoading ? "Saving..." : editFoodId ? "Update Food" : "Add Food"}
                </button>
                {editFoodId && (
                  <button type="button" onClick={cancelEdit} className="flex-1 bg-gray-300 hover:bg-gray-400 text-black py-2 rounded-lg">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>

          <section className="bg-white p-6 rounded-xl shadow-sm overflow-auto max-h-[520px]">
            <h2 className="text-xl font-semibold mb-4">Users ({users.length})</h2>
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2">Email</th>
                  <th className="p-2">Name</th>
                  <th className="p-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b">
                    <td className="p-2">{u.email}</td>
                    <td className="p-2">{u.fullname || "-"}</td>
                    <td className="p-2 text-right">
                      <button onClick={() => removeUser(u._id)} className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>

        <section className="bg-white p-6 rounded-xl shadow-sm overflow-auto max-h-[420px]">
          <h2 className="text-xl font-semibold mb-4">Food Items ({foods.length})</h2>
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Name</th>
                <th className="p-2">Price</th>
                <th className="p-2">Restaurant</th>
                <th className="p-2">Category</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {foods.map((item) => (
                <tr key={item._id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{item.name}</td>
                  <td className="p-2">₹{item.price}</td>
                  <td className="p-2">{item.restaurant}</td>
                  <td className="p-2">{item.category}</td>
                  <td className="p-2 flex gap-2">
                    <button onClick={() => startEditFood(item)} className="px-2 py-1 text-white bg-blue-500 rounded hover:bg-blue-600">
                      Edit
                    </button>
                    <button onClick={() => removeFood(item._id)} className="px-2 py-1 text-white bg-red-500 rounded hover:bg-red-600">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}

export default Adminpenal;
