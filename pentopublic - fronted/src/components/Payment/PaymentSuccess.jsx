import React from 'react';
import { Link } from 'react-router-dom';

const PaymentSuccess = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdf4e4] text-[#5a4231]">
      <div className="bg-white shadow-2xl rounded-2xl p-10 max-w-md w-full text-center">
        <h1 className="text-3xl font-serif font-bold mb-4">Payment Successful 🎉</h1>
        <p className="mb-6 text-lg">Thank you for subscribing to PenToPublic!</p>
        <Link
          to="/dashboard"
          className="inline-block px-6 py-3 bg-black text-white rounded-lg hover:opacity-90 transition"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
