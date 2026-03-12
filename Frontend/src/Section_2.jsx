import React, { useContext } from "react";
import { useEffect,useState,createContext } from "react";

import { CreateContext } from "./CartContext";
import { useNavigate } from "react-router-dom";

function Section_2() {
    const [food,setfood] = useState([]);

    const {addtocart}=useContext(CreateContext);
    const Navigate =useNavigate();
    
    useEffect(()=>{
        fetch("https://hungryhub-1-53st.onrender.com/api/food/foodcard")
        .then(res=>res.json())
        .then(data=>setfood(data));
        localStorage.removeItem("adminAuth");
        localStorage.removeItem("token");

    },[])

    return (
        <>
            <section className="max-w-7xl mx-auto px-4 py-12">
                <h2 className="text-3xl font-bold text-center mb-10">Populer Items</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {food.map(food => (
                        <div 
                        key={food._id}
                        id={food._id}
                        className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300"
                        >
                            
                            <img src={food.image} alt={food.name} className="w-full h-40 object-cover rounded-t-2xl"
                            />
                            <div className="p-4">
                                <h4 className="text-lg font-semibold">
                                    {food.name}
                                </h4>
                                <p className="text-sm text-orange-500 font-medium">
                                  🍴 {food.restaurant}
                                </p>
                                <p  className="inline-block bg-gray-200 text-xs px-2 py-1 rounded-full">
                                  {food.category}
                                   
                                </p>
                                <p >
                                   ₹ {food.price}
                                </p>
                                <button onClick={()=>{addtocart(food); Navigate("/cart");}} className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-xl font-medium transition">
                                    Order Now
                                </button>
                            </div>
                        </div>
                    ))}

                </div>
            </section>
        </>
    )

}
export default Section_2