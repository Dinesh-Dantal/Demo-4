import React, { useEffect, useState } from "react";
import api, { getSubscriptionStatus } from "../services/api";
import { useAuth } from "../context/AuthContext";

const Subscription = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [razorpayKey, setRazorpayKey] = useState("rzp_test_YourKeyHere"); // Replace with real key

  useEffect(() => {
    if (user?.userId) {
      fetchSubscription();
    }
  }, [user]);

  const fetchSubscription = async () => {
    try {
      const data = await getSubscriptionStatus(user.userId);
      setSubscription(data);
    } catch (err) {
      console.error("Error fetching subscription", err);
    }
  };

  const handleRazorpayPayment = async (amount, type) => {
    setLoading(true);
    try {
      const res = await api.post("/payment/create-order", amount);
      const { orderId, currency } = res.data;

      const options = {
        key: razorpayKey,
        amount: amount * 100,
        currency,
        name: "PenToPublic",
        description: `Subscribe - ${type}`,
        order_id: orderId,
        handler: async function (response) {
          const endDate = type === "monthly"
            ? new Date(new Date().setMonth(new Date().getMonth() + 1))
            : new Date(new Date().setFullYear(new Date().getFullYear() + 1));

          await api.post("/payment/confirm", {
            userId: user.userId,
            amount,
            endDate,
            paymentMode: "Razorpay"
          });

          fetchSubscription();
        },
        prefill: {
          name: user?.reg?.userName || "User",
          email: user?.email || "test@example.com"
        },
        theme: {
          color: "#6366f1"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Error initiating payment:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubscription = async (type) => {
    try {
      const res = await api.post("/payment/subscribe", {
        userId: user.userId,
        subscriptionType: type
      });
      fetchSubscription();
    } catch (err) {
      console.error("Manual subscription failed", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Subscription Plans</h2>

      {subscription?.isSubscribed ? (
        <div className="bg-green-100 text-green-700 px-6 py-4 rounded-md mb-6">
          You are subscribed until{" "}
          <strong>{new Date(subscription?.endDate).toLocaleDateString()}</strong>
        </div>
      ) : (
        <div className="bg-red-100 text-red-700 px-6 py-4 rounded-md mb-6">
          You are not subscribed yet.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Monthly Plan */}
        <div className="border border-gray-300 rounded-lg p-6 shadow-sm">
          <h3 className="text-xl font-semibold mb-2">Monthly Plan</h3>
          <p className="text-gray-600 mb-4">₹200 / month</p>
          <div className="flex gap-4">
            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
              onClick={() => handleRazorpayPayment(200, "monthly")}
              disabled={loading}
            >
              Pay with Razorpay
            </button>
            <button
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
              onClick={() => handleManualSubscription("monthly")}
              disabled={loading}
            >
              Manual Subscribe
            </button>
          </div>
        </div>

        {/* Yearly Plan */}
        <div className="border border-gray-300 rounded-lg p-6 shadow-sm">
          <h3 className="text-xl font-semibold mb-2">Yearly Plan</h3>
          <p className="text-gray-600 mb-4">₹900 / year</p>
          <div className="flex gap-4">
            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
              onClick={() => handleRazorpayPayment(900, "yearly")}
              disabled={loading}
            >
              Pay with Razorpay
            </button>
            <button
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
              onClick={() => handleManualSubscription("yearly")}
              disabled={loading}
            >
              Manual Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
