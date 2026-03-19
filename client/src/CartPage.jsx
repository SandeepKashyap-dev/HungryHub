import React, { useContext } from "react";
import { CreateContext } from "./CartContext";
import { useNavigate } from "react-router-dom";

function Cart() {

  const {
    cart,
    incearsqty,
    decreaseQty,
    removeitem
  } = useContext(CreateContext);

  const Navigate = useNavigate();

  
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="max-w-5xl mx-auto p-6">

      <h2 className="text-2xl font-bold mb-6">Your Cart</h2>

      {cart.length === 0 && <p>Cart is empty</p>}

      {cart.map(item => (
        <div
          key={item._id}
          className="flex items-center justify-between border-b py-4"
        >

          <img
            src={item.image}
            className="w-20 h-20 object-cover rounded"
          />

          <h3 className="w-40">{item.name}</h3>

          
          <p>₹ {item.price}</p>

          
          <div className="flex items-center gap-2">
            <button onClick={() => decreaseQty(item._id)}>-</button>
            <span>{item.quantity}</span>
            <button onClick={() => incearsqty(item._id)}>+</button>
          </div>

          
          <p className="font-semibold">
            ₹ {item.price * item.quantity}
          </p>

          <button
            onClick={() => removeitem(item._id)}
            className="text-red-500"
          >
            Remove
          </button>

        </div>
      ))}

      
      {cart.length > 0 && (
        <div className="mt-6 flex justify-between items-center">
          <h3 className="text-xl font-bold">
            Total: ₹ {total}
          </h3>

          <button
            onClick={() => {
              const token = localStorage.getItem("token");
              if (!token) {
                alert("Please login first");
                Navigate("/login", { state: { redirectTo: "/checkout" } });
              } else {
                Navigate("/checkout");
              }
            }}
            className="bg-green-600 text-white px-6 py-2 rounded-lg"
          >
            Checkout
          </button>
        </div>
      )}

    </div>
  );
}

export default Cart;
