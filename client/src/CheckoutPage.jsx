import React, { useState, useContext, useEffect } from "react";
import { CreateContext } from "./CartContext";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "./config/api";

function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, clearCart } = useContext(CreateContext);
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [orderType, setOrderType] = useState(localStorage.getItem("orderType") || "Delivery");
  const [manualDeliveryFee, setManualDeliveryFee] = useState(orderType === "Delivery" ? 40 : 0);

  useEffect(() => {

    if (token && user) {
      setIsAuthenticated(true);
    } else {
      alert("Please login first");
      navigate("/login", { state: { redirectTo: "/checkout" } });
    }
  }, []);

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

  // Load user profile data to pre-fill form
  useEffect(() => {
    const loadUserProfile = async () => {
      if (token) {
        try {
          const response = await fetch(API_ENDPOINTS.USER_PROFILE, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            const user = data.user;

            // Pre-fill form with profile data
            setFormData(prevData => ({
              ...prevData,
              fullName: user.fullname || prevData.fullName,
              email: user.email || prevData.email,
              phone: user.phone || prevData.phone,
              address: user.address || prevData.address,
              city: user.city || prevData.city,
              postalCode: user.postalCode || prevData.postalCode,
            }));
          }
        } catch (error) {
          console.error("Failed to load user profile:", error);
        }
      }
    };

    if (isAuthenticated) {
      loadUserProfile();
    }
  }, [isAuthenticated, token]);

  // Calculate subtotal
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const finalTotal = subtotal + Number(manualDeliveryFee || 0);

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
    try {
      const response = await fetch(API_ENDPOINTS.CREATE_ORDER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          items: cart,
          deliveryInfo: orderType === "Pickup" ? {
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            address: "Pickup from Store",
            city: "N/A",
            postalCode: "000000"
          } : formData,
          paymentMethod: formData.paymentMethod,
          orderType: orderType,
          total: finalTotal,
        }),
      });

      const responseData = await response.json();
      if (response.ok) {
        // Update user profile with delivery information (only for delivery orders)
        if (orderType === "Delivery") {
          try {
            await fetch(API_ENDPOINTS.USER_UPDATE_PROFILE, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify({
                fullname: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                city: formData.city,
                postalCode: formData.postalCode,
              }),
            });

            // Update localStorage with new profile data
            const storedUser = JSON.parse(localStorage.getItem("user"));
            const updatedUser = {
              ...storedUser,
              fullname: formData.fullName,
              email: formData.email,
              phone: formData.phone,
              address: formData.address,
              city: formData.city,
              postalCode: formData.postalCode,
            };
            localStorage.setItem("user", JSON.stringify(updatedUser));

          } catch (profileError) {
            console.error("Failed to update profile:", profileError);
          }
        }

        alert("Order placed successfully!");
        clearCart();
        navigate("/order-confirmation");
      } else {
        alert(`Failed to place order: ${responseData.message}`);
      }
    } catch (error) {
      alert("An error occurred: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

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
        {}
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

            {orderType === "Delivery" ? (
              <>
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
              </>
            ) : (
              <div className="bg-orange-50 p-4 rounded-lg mb-6 border border-orange-200">
                <p className="text-orange-700 font-medium flex items-center gap-2">
                   <span className="text-xl">🏪</span> You have selected **Pickup**. Please collect your fresh order from our main kitchen.
                </p>
              </div>
            )}

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

        {}
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
            <div className="flex justify-between font-semibold text-gray-700">
              <span>Subtotal:</span>
              <span>₹ {subtotal}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-orange-600 font-medium">
              <span>Delivery Fee:</span>
              <div className="flex items-center gap-1">
                <span>₹</span>
                <input
                  type="number"
                  value={manualDeliveryFee}
                  onChange={(e) => setManualDeliveryFee(e.target.value)}
                  className="w-16 px-1 py-0.5 border border-orange-300 rounded text-center focus:ring-1 focus:ring-orange-400 outline-none"
                  min="0"
                />
              </div>
            </div>
            <div className="flex justify-between text-xl font-bold border-t border-gray-300 pt-4 mt-4 text-green-700">
              <span>Total:</span>
              <span>₹ {finalTotal}</span>
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

