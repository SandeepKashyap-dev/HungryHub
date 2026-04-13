import React, { useState } from "react";
import { FaMotorcycle } from "react-icons/fa";
import { FaShoppingBag } from "react-icons/fa";

function Section_1() {
  const [orderType, setOrderType] = useState(() => localStorage.getItem("orderType") || "Delivery");
  const [address, setAddress] = useState("");
  const [mapAddress, setMapAddress] = useState("");
  const rawGoogleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const googleMapsApiKey = rawGoogleMapsApiKey && rawGoogleMapsApiKey !== "YOUR_GOOGLE_MAPS_API_KEY" ? rawGoogleMapsApiKey : null;

  const handleFindFood = () => {
    if (!address.trim()) {
      alert("Please enter your delivery address first!");
      return;
    }

    setMapAddress(address.trim());
    localStorage.setItem("orderType", orderType);

    alert(`Checking delivery availability for "${address}"... \nGreat news, we deliver freshly cooked meals here! 🎉`);

    window.scrollBy({ top: 700, behavior: "smooth" });
  };

  const toggleOrderType = (type) => {
    setOrderType(type);
    localStorage.setItem("orderType", type);
  };

  return (
    <>
      <main>
        <section className="bg-yellow-500 w-full ">
          <div className="flex flex-col-reverse md:flex-row-reverse w-full mx-auto md:px-20 md:items-end gap-6">
            <div className="w-full flex md:w-1/2 justify-center mt-12">
              <img
                src="/images/hero-header.png"
                alt="hero-header"
                className=" w-full  max-w-md transition-all duration-500 ease-in-out hover:-translate-y-4 hover:scale-105"
              />
            </div>

            <div className=" md:flex-wrap md:items-start w-full text-center md:w-1/2 ">
              <h1 className="md:text-6xl text-4xl font-bold mt-12  text-white">
                
                Are you starving?
              </h1>
              <h2 className="text-4xl pt-10 mb-8 font-medium">
                Order freshly cooked premium meals directly from our kitchen to your doorstep.
              </h2>
              <div className=" bg-white md:mt-10 rounded  p-10 ">
                <div className=" h-1/2 flex gap-4 pb-2">
                  <button 
                    onClick={() => toggleOrderType("Delivery")} 
                    className={`flex items-center px-4 py-2 rounded font-semibold transition-all ${
                      orderType === "Delivery" 
                      ? "bg-orange-100 text-orange-600 border border-orange-500" 
                      : "text-gray-600 hover:bg-orange-50 hover:text-orange-500"
                    }`}
                  >
                    <FaMotorcycle className="mr-2" /> Delivery
                  </button>
                  <button 
                    onClick={() => toggleOrderType("Pickup")} 
                    className={`flex items-center px-4 py-2 rounded font-semibold transition-all ${
                      orderType === "Pickup" 
                      ? "bg-orange-100 text-orange-600 border border-orange-500" 
                      : "text-gray-600 hover:bg-orange-50 hover:text-orange-500"
                    }`}
                  >
                    <FaShoppingBag className="mr-2" /> Pickup
                  </button>
                </div>

                <div className="flex gap-3 md:flex-row mt-4">
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter Your Address"
                    className="border hover:border-orange-400 px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500 rounded"
                  />
                  <button 
                    onClick={handleFindFood} 
                    className="whitespace-nowrap bg-orange-500 text-white font-semibold rounded px-6 py-2 hover:bg-orange-600 transition-all font-bold"
                  >
                    Find Food
                  </button>
                </div>
                <div className="mt-8 pt-6 border-t border-gray-100">

                  <div className="rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 h-[200px] md:h-[240px] bg-slate-50 relative group">
                    <iframe
                      title="Google Map"
                      src={
                        mapAddress
                          ? googleMapsApiKey
                            ? `https://www.google.com/maps/embed/v1/search?key=${googleMapsApiKey}&q=${encodeURIComponent(mapAddress)}`
                            : `https://maps.google.com/maps?q=${encodeURIComponent(mapAddress)}&output=embed`
                          : `https://maps.google.com/maps?q=New+Delhi,India&output=embed`
                      }
                      className="w-full h-full transition-transform duration-700 group-hover:scale-[1.02]"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                    <div className="absolute inset-0 pointer-events-none rounded-2xl ring-1 ring-inset ring-black/5"></div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default Section_1;

