import React from "react";
import { useState, useEffect } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { Link } from "react-router-dom";

function Nav() {
  const [foods, setfoods] = useState([]);
  const [search, searchupdate] = useState("");



  useEffect(() => {
    const fetchfood = async () => {
      try {
        const res =await fetch("https://hungryhub-backend.onrender.com/api/food/allfood");
        const data = await res.json();
        setfoods(data);
      }
      catch (error) {
        console.log("some food fetch error", error);
      }

    };
    fetchfood();

  }, []);


  const filterfoods = foods.filter((food) =>
    food.name.toLowerCase().includes(search.toLowerCase()));

  const hendleSearch = (e) => {
    e.preventDefault();
    //console.log("search are", search);
    searchupdate("");
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
            <span className="font-bold"> Deliverd to:</span>
            <FaLocationDot className="text-orange-500 m-2 " />
            <span className="md:text-base text-gray-600 p-1">Current Location</span>
            <span className="font-bold  md:inline ">Thanesar Old Bus Stand, Kurukshetra</span>

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
              {search && (<div className="absolute left-0 right-0 top-full mt-2 bg-white text-center rounded z-50 "> {filterfoods.length > 0 ? (filterfoods.map((food) => (<p key={food._id} className="p-2 cursor-pointer hover:bg-gray-100" onClick={() => {const element=document.getElementById(food._id);if(element){element.scrollIntoView({behavior:"smooth"});}searchupdate("");}} > {food.name} </p>))) : (<p className="p-2 text-gray-500 inline-block">No food found</p>)} </div>)}

            </div>
          </form>
          <Link
              to="/register"
              className="flex items-center gap-2 text-orange-500 px-2 py-2 ml-4 rounded font-bold"
            >
              <FaUser />
             Reg_User
            </Link>
        </div>
      </nav>
    </>
  );
}
export default Nav;