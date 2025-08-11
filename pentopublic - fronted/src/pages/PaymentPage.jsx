import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PaymentPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    accountNumber: "",
    expiry: "",
    cvv: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Only allow numbers for accountNumber and cvv
    if (name === "accountNumber") {
      if (/^\d*$/.test(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
      return;
    }

    if (name === "cvv") {
      if (/^\d*$/.test(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
      return;
    }

    // Expiry date can contain only digits and slash
    if (name === "expiry") {
      if (/^[0-9/]*$/.test(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    let newErrors = {};

    // Account number: exactly 12 digits
    if (!/^\d{12}$/.test(formData.accountNumber)) {
      newErrors.accountNumber = "Account number must be exactly 12 digits";
    }

    // CVV: exactly 3 digits
    if (!/^\d{3}$/.test(formData.cvv)) {
      newErrors.cvv = "CVV must be exactly 3 digits";
    }

    // Expiry date: MM/YY and in the future
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiry)) {
      newErrors.expiry = "Expiry must be in MM/YY format";
    } else {
      const [month, year] = formData.expiry.split("/").map(Number);
      const fullYear = 2000 + year;
      const now = new Date();
      const expiryDate = new Date(fullYear, month - 1, 1);
      const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      if (expiryDate < currentMonth) {
        newErrors.expiry = "Card has expired";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Simulating payment processing
      const paymentSuccess = true; // Replace with real payment logic
      if (paymentSuccess) {
        navigate("/payment-success");
      } else {
        navigate("/payment-failure");
      }
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
      <h2>Payment</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Account Number:</label>
          <input
            type="text"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleChange}
            maxLength="12"
          />
          {errors.accountNumber && (
            <p style={{ color: "red" }}>{errors.accountNumber}</p>
          )}
        </div>

        <div>
          <label>Expiry (MM/YY):</label>
          <input
            type="text"
            name="expiry"
            value={formData.expiry}
            onChange={handleChange}
            placeholder="MM/YY"
            maxLength="5"
          />
          {errors.expiry && <p style={{ color: "red" }}>{errors.expiry}</p>}
        </div>

        <div>
          <label>CVV:</label>
          <input
            type="text"
            name="cvv"
            value={formData.cvv}
            onChange={handleChange}
            maxLength="3"
          />
          {errors.cvv && <p style={{ color: "red" }}>{errors.cvv}</p>}
        </div>

        <button type="submit">Pay Now</button>
      </form>
    </div>
  );
};

export default PaymentPage;