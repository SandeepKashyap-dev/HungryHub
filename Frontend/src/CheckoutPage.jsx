import React, { useState, useContext } from "react";
import { CreateContext } from "./CartContext";
import { useNavigate } from "react-router-dom";

function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, clearCart } = useContext(CreateContext);
  const token = localStorage.getItem("token");

  console.log("🔍 CheckoutPage Debug:", { cartLength: cart.length, token: !!token, cart });

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!token) {
      alert("Please login first");
      navigate("/login", { state: { redirectTo: "/checkout" } });
    }
  }, [token, navigate]);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    paymentMethod: "cod",
  });

  const [isLoading, setIsLoading] = useState(false);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    console.log("🛒 Submitting order:", { items: cart.length, deliveryInfo: formData, total });

    try {
      // Call your backend API to create order
      const response = await fetch("https://hungryhub-1-53st.onrender.com/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          items: cart,
          deliveryInfo: formData,
          paymentMethod: formData.paymentMethod,
          total: total,
        }),
      });

      const responseData = await response.json();
      console.log("📦 Order Response:", response.status, responseData);

      if (response.ok) {
        alert("Order placed successfully!");
        clearCart(); // Clear cart after successful order
        navigate("/order-confirmation");
      } else {
        alert(`Failed to place order: ${responseData.message}`);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("An error occurred: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-5xl mx-auto p-6 text-center">
        <p className="text-lg mb-4">Your cart is empty</p>
        <button
          onClick={() => navigate("/")}
          className="bg-green-600 text-white px-6 py-2 rounded-lg"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Checkout</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Delivery Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Delivery Information</h3>

            <div className="mb-4">
              <label className="block font-semibold mb-2">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded px-4 py-2"
              />
            </div>

            <div className="mb-4">
              <label className="block font-semibold mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded px-4 py-2"
              />
            </div>

            <div className="mb-4">
              <label className="block font-semibold mb-2">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded px-4 py-2"
              />
            </div>

            <div className="mb-4">
              <label className="block font-semibold mb-2">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                rows="3"
                className="w-full border border-gray-300 rounded px-4 py-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block font-semibold mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded px-4 py-2"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded px-4 py-2"
                />
              </div>
            </div>

            <h3 className="text-xl font-bold mb-4">Payment Method</h3>

            <div className="mb-6">
              <div className="flex items-center mb-4">
                <input
                  type="radio"
                  id="cod"
                  name="paymentMethod"
                  value="cod"
                  checked={formData.paymentMethod === "cod"}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label htmlFor="cod" className="font-semibold">
                  Cash on Delivery
                </label>
              </div>

              <div className="flex items-center mb-4">
                <input
                  type="radio"
                  id="card"
                  name="paymentMethod"
                  value="card"
                  checked={formData.paymentMethod === "card"}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label htmlFor="card" className="font-semibold">
                  Credit/Debit Card
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="radio"
                  id="upi"
                  name="paymentMethod"
                  value="upi"
                  checked={formData.paymentMethod === "upi"}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label htmlFor="upi" className="font-semibold">
                  UPI
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 disabled:bg-gray-400"
            >
              {isLoading ? "Processing..." : "Place Order"}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md h-fit">
          <h3 className="text-xl font-bold mb-4">Order Summary</h3>

          <div className="space-y-3 mb-6 border-b pb-4">
            {cart.map((item) => (
              <div key={item._id} className="flex justify-between text-sm">
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>₹ {item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between font-semibold">
              <span>Subtotal:</span>
              <span>₹ {total}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Delivery Fee:</span>
              <span>₹ 0</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-4 mt-4">
              <span>Total:</span>
              <span>₹ {total}</span>
            </div>
          </div>

          <button
            onClick={() => navigate("/cart")}
            className="w-full mt-6 border-2 border-gray-400 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200"
          >
            Back to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
