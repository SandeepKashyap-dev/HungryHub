import React from "react";
import { useState } from "react";

function Adminpenal() {

    const [food, setfood] = useState({
        name: "",
        image: "",
        price: "",
        restaurant: "",
        category: "",
        isPopular: true

    });
    const handlechange = (e) => {
        setfood({ ...food, [e.target.name]: e.target.value })
    }
    const handelsubmit = async (e) => {
        e.preventDefault();
        try {
            const respons = await fetch("https://hungryhub-backend.onrender.com/api/food/addfood", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(food)
            } );

            const data=await respons.json();
            alert("Food added successfully");
            setfood({
                name: "",
      image: "",
      price: "",
      restaurant: "",
      category: "",
      isPopular: true

            });
            

        }
        catch(error){
            console.log("Some error", error);
        }
    

 }
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">

                <h2 className="text-2xl font-bold text-center mb-6">Add Items</h2>
                <form action="" className="space-y-4" onSubmit={handelsubmit}>
                    <input type="text" placeholder="Food Name" name="name" onChange={handlechange} value={food.name} className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                    <input type="text" placeholder="Image_URL" name="image" onChange={handlechange} value={food.image} className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
                    <input type="number" name="price" id="" placeholder="Price" onChange={handlechange} value={food.price} className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
                    <input type="text" placeholder="Restaurant" name="restaurant" onChange={handlechange} value={food.restaurant} className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
                    <input type="text" placeholder="Category" name="category" onChange={handlechange}value={food.category} className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />

                    <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition"
                    >Add Food</button>
                </form>
            </div>



        </div >

    )
}
export default Adminpenal;