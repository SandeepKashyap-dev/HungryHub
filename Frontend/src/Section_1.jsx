import React from "react";
import { FaMotorcycle } from "react-icons/fa";
import { FaShoppingBag } from "react-icons/fa";

function Section_1() {
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
              <h2 className="text-4xl pt-10 mb-8 ">
                Within a few clicks, find meals thatare accessible near you
              </h2>
              <div className=" bg-white md:mt-10 rounded  p-10 ">
                <div className=" h-1/2 flex gap-4 pb-2">
                  <button className="flex items-center px-4 py-2 rounded hover:bg-orange-300 hover:text-orange-500"><FaMotorcycle className="mr-2" /> Delivery</button>
                  <button className="flex items-center px-4 py-2 rounded hover:bg-orange-300 hover:text-orange-500"><FaShoppingBag className="mr-2" /> Pickup</button>
                </div>

                <div className="flex gap-3 md:flex-row mt-4">
                  <input
                    type="text"
                    placeholder="Enter Your Address"
                    className="hover:border-orange-400 px-2 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="whitespace-nowrap bg-orange-500 rounded-md px-2 py-2">Find Food</button>
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
