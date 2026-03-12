import React from "react";
import { useNavigate } from "react-router-dom";

function OrderConfirmation() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white p-12 rounded-lg shadow-lg text-center max-w-md">
        <div className="text-6xl mb-4">✅</div>
        
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Order Placed Successfully!
        </h1>

        <p className="text-gray-600 text-lg mb-8">
          Your order has been confirmed. You can track your order status in your dashboard.
        </p>

        <div className="space-y-4">
          <button
            onClick={() => navigate("/Profile")}
            className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700"
          >
            View My Orders
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-400"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;
