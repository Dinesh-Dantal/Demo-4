import React, { useState, useEffect } from 'react';
import { BookOpen, Check, ArrowRight, CreditCard, Shield, Zap, Star, Crown } from 'lucide-react';

// Mock API service for demonstration
const mockAPI = {
  processPayment: async (paymentData) => {
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate 90% success rate
    if (Math.random() > 0.1) {
      return {
        success: true,
        transactionId: 'TXN' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        message: 'Payment successful!'
      };
    } else {
      throw new Error('Payment failed. Please try again.');
    }
  },
  
  updateSubscription: async (userId, planData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, message: 'Subscription updated successfully!' };
  }
};

const SubscriptionPage = () => {
  // Mock user data - in real app this would come from routing/context
  const [userId] = useState('user123');
  const [cameFromRegister] = useState(false);
  
  const [currentStep, setCurrentStep] = useState('plan'); // 'plan', 'payment', 'processing', 'success'
  const [selectedPlan, setSelectedPlan] = useState('premium');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolder: ''
  });
  const [transactionDetails, setTransactionDetails] = useState(null);

  const plans = {
    reader: {
      name: 'Reader',
      originalPrice: 0,
      monthlyPrice: 0,
      yearlyPrice: 0,
      description: 'Perfect for casual readers',
      features: [
        'Access to free books',
        'Basic community features', 
        'Reading progress tracking',
        'Book recommendations'
      ],
      color: 'gray',
      icon: BookOpen
    },
    premium: {
      name: 'Premium Reader',
      originalPrice: { monthly: 299, yearly: 2999 },
      monthlyPrice: 199,
      yearlyPrice: 1999,
      description: 'Best value for book lovers',
      features: [
        'Access to all premium content',
        'Early access to new releases',
        'Ad-free reading experience', 
        'Exclusive author interviews',
        'Advanced reading analytics',
        'Download books offline',
        'Priority customer support'
      ],
      color: 'amber',
      icon: Crown,
      popular: true,
      discount: '33% OFF'
    },
    author: {
      name: 'Author Pro',
      originalPrice: { monthly: 599, yearly: 5999 },
      monthlyPrice: 399,
      yearlyPrice: 3999,
      description: 'Everything for serious authors',
      features: [
        'Publish unlimited books',
        'Advanced author analytics',
        'Promotional tools & campaigns',
        'Reader engagement insights',
        'Priority listing in searches',
        'Custom author branding',
        'Revenue analytics & reports',
        'Dedicated author support'
      ],
      color: 'purple',
      icon: Star
    }
  };

  const getCurrentPrice = (planKey) => {
    const plan = plans[planKey];
    if (planKey === 'reader') return 0;
    return billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
  };

  const getOriginalPrice = (planKey) => {
    const plan = plans[planKey];
    if (planKey === 'reader') return 0;
    return billingCycle === 'monthly' ? plan.originalPrice.monthly : plan.originalPrice.yearly;
  };

  const getSavings = (planKey) => {
    const current = getCurrentPrice(planKey);
    const original = getOriginalPrice(planKey);
    return original - current;
  };

  const handlePlanSelect = (planKey) => {
    setSelectedPlan(planKey);
  };

  const handleContinueToPayment = () => {
    if (selectedPlan === 'reader') {
      // Free plan - skip payment
      handleFreeSubscription();
    } else {
      setCurrentStep('payment');
    }
  };

  const handleFreeSubscription = async () => {
    setLoading(true);
    try {
      await mockAPI.updateSubscription(userId, {
        plan: selectedPlan,
        billingCycle: 'free'
      });
      
      setTransactionDetails({
        plan: plans[selectedPlan].name,
        amount: 0,
        transactionId: 'FREE-' + Date.now()
      });
      
      setCurrentStep('success');
    } catch (error) {
      alert('Failed to activate free plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv || !paymentData.cardHolder) {
      alert('Please fill in all payment details.');
      return;
    }

    setCurrentStep('processing');
    setLoading(true);

    try {
      // Process payment
      const paymentResult = await mockAPI.processPayment({
        ...paymentData,
        amount: getCurrentPrice(selectedPlan),
        plan: selectedPlan,
        billingCycle
      });

      // Update subscription
      await mockAPI.updateSubscription(userId, {
        plan: selectedPlan,
        billingCycle,
        transactionId: paymentResult.transactionId
      });

      setTransactionDetails({
        plan: plans[selectedPlan].name,
        amount: getCurrentPrice(selectedPlan),
        billingCycle,
        transactionId: paymentResult.transactionId,
        savings: getSavings(selectedPlan)
      });

      setCurrentStep('success');
    } catch (error) {
      alert(error.message);
      setCurrentStep('payment');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessNavigation = () => {
    alert(cameFromRegister ? 'Registration complete! Please log in to access your account.' : 'Redirecting to dashboard...');
    setCurrentStep('plan'); // Reset for demo
  };

  const formatCardNumber = (value) => {
    return value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').trim();
  };

  const formatExpiryDate = (value) => {
    return value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').substr(0, 5);
  };

  // Render different steps
  if (currentStep === 'plan') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm shadow-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  PenToPublic ✍️
                </h1>
              </div>
              <button 
                onClick={() => setCurrentStep('plan')}
                className="text-gray-600 hover:text-gray-800 font-medium"
              >
                ← Back
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Choose Your{" "}
              <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Perfect Plan
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Unlock the full potential of PenToPublic with our premium features
            </p>

            {/* Billing Toggle */}
            <div className="flex justify-center items-center space-x-4 mb-8">
              <span className={`font-medium ${billingCycle === 'monthly' ? 'text-gray-800' : 'text-gray-500'}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${
                  billingCycle === 'yearly' ? 'bg-amber-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`font-medium ${billingCycle === 'yearly' ? 'text-gray-800' : 'text-gray-500'}`}>
                Yearly
              </span>
              {billingCycle === 'yearly' && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                  Save 33%!
                </span>
              )}
            </div>
          </div>

          {/* Plans Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {Object.entries(plans).map(([planKey, plan]) => {
              const IconComponent = plan.icon;
              const isSelected = selectedPlan === planKey;
              const currentPrice = getCurrentPrice(planKey);
              const originalPrice = getOriginalPrice(planKey);
              const savings = getSavings(planKey);
              
              return (
                <div
                  key={planKey}
                  className={`relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer ${
                    isSelected ? 'ring-4 ring-amber-500 scale-105' : 'hover:scale-105'
                  } ${plan.popular ? 'ring-2 ring-amber-300' : ''}`}
                  onClick={() => handlePlanSelect(planKey)}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                        Most Popular
                      </span>
                    </div>
                  )}

                  {plan.discount && (
                    <div className="absolute -top-3 -right-3">
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        {plan.discount}
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-br from-${plan.color}-500 to-${plan.color}-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-4">{plan.description}</p>
                    
                    <div className="mb-4">
                      {planKey === 'reader' ? (
                        <div className="text-4xl font-bold text-gray-800">Free</div>
                      ) : (
                        <div>
                          <div className="flex items-center justify-center space-x-2 mb-2">
                            {originalPrice > currentPrice && (
                              <span className="text-lg text-gray-500 line-through">
                                ₹{originalPrice}
                              </span>
                            )}
                            <span className="text-4xl font-bold text-amber-600">
                              ₹{currentPrice}
                            </span>
                          </div>
                          <p className="text-gray-600">
                            per {billingCycle === 'monthly' ? 'month' : 'year'}
                          </p>
                          {savings > 0 && (
                            <p className="text-green-600 font-medium text-sm mt-1">
                              Save ₹{savings}!
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className={`w-full py-3 rounded-xl font-semibold text-center transition-all duration-200 ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}>
                    {isSelected ? 'Selected' : 'Select Plan'}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Continue Button */}
          <div className="text-center">
            <button
              onClick={handleContinueToPayment}
              disabled={!selectedPlan || loading}
              className="px-12 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-lg font-semibold rounded-2xl hover:from-amber-600 hover:to-orange-700 transition-all duration-200 shadow-2xl hover:shadow-3xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
            >
              <span>
                {selectedPlan === 'reader' ? 'Activate Free Plan' : 'Continue to Payment'}
              </span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'payment') {
    const currentPrice = getCurrentPrice(selectedPlan);
    const plan = plans[selectedPlan];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Complete Your Payment
            </h1>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {plan.name} - {billingCycle === 'monthly' ? 'Monthly' : 'Yearly'}
              </h3>
              <div className="text-3xl font-bold text-indigo-600 mb-2">
                ₹{currentPrice}
              </div>
              {getSavings(selectedPlan) > 0 && (
                <p className="text-green-600 font-medium">
                  You're saving ₹{getSavings(selectedPlan)}!
                </p>
              )}
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
            <div className="flex items-center space-x-2 mb-6">
              <CreditCard className="h-6 w-6 text-indigo-600" />
              <h2 className="text-xl font-semibold text-gray-800">Payment Details</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Holder Name
                </label>
                <input
                  type="text"
                  value={paymentData.cardHolder}
                  onChange={(e) => setPaymentData({...paymentData, cardHolder: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  value={paymentData.cardNumber}
                  onChange={(e) => setPaymentData({...paymentData, cardNumber: formatCardNumber(e.target.value)})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    value={paymentData.expiryDate}
                    onChange={(e) => setPaymentData({...paymentData, expiryDate: formatExpiryDate(e.target.value)})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    value={paymentData.cvv}
                    onChange={(e) => setPaymentData({...paymentData, cvv: e.target.value.replace(/\D/g, '')})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="123"
                    maxLength={4}
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t">
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="h-5 w-5 text-green-600" />
                <span className="text-sm text-gray-600">
                  Your payment information is secure and encrypted
                </span>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep('plan')}
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Back to Plans
                </button>
                <button
                  type="button"
                  onClick={handlePaymentSubmit}
                  disabled={loading}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <span>Pay ₹{currentPrice}</span>
                  <Zap className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'processing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-indigo-600 mx-auto mb-8"></div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Processing Payment...</h2>
          <p className="text-gray-600">Please wait while we process your payment securely.</p>
        </div>
      </div>
    );
  }

  if (currentStep === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center bg-white rounded-2xl p-8 shadow-xl">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="h-10 w-10 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Payment Successful! 🎉
          </h2>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">Subscription Details</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p><span className="font-medium">Plan:</span> {transactionDetails?.plan}</p>
              {transactionDetails?.amount > 0 && (
                <>
                  <p><span className="font-medium">Amount:</span> ₹{transactionDetails?.amount}</p>
                  <p><span className="font-medium">Billing:</span> {transactionDetails?.billingCycle}</p>
                  {transactionDetails?.savings > 0 && (
                    <p className="text-green-600"><span className="font-medium">Savings:</span> ₹{transactionDetails?.savings}</p>
                  )}
                  <p><span className="font-medium">Transaction ID:</span> {transactionDetails?.transactionId}</p>
                </>
              )}
            </div>
          </div>
          
          <p className="text-gray-600 mb-8">
            {transactionDetails?.amount > 0 
              ? "Your subscription has been activated successfully!"
              : "Welcome to PenToPublic! Your free plan is now active."
            }
          </p>
          
          <button
            onClick={handleSuccessNavigation}
            className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 font-semibold"
          >
            {cameFromRegister ? 'Continue to Login' : 'Go to Dashboard'}
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default SubscriptionPage;