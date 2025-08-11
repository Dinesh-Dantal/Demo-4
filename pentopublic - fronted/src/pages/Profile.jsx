import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { getSubscriptionStatus } from "@/services/api";
import { User, Calendar, CreditCard, Shield, Star, Crown, CheckCircle, XCircle, Sparkles, ArrowRight, Zap } from "lucide-react";
import { Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const PaymentPage = ({ onPaymentComplete, onBack }) => {
  const [processing, setProcessing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('monthly');

  const handlePayment = async () => {
    setProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setProcessing(false);
    onPaymentComplete();
  };

  const plans = [
    {
      id: 'monthly',
      name: 'Monthly Plan',
      price: '₹199',
      period: '/month',
      features: ['Unlimited access', 'Premium content', 'No ads', '24/7 support'],
      popular: false
    },
    {
      id: 'yearly',
      name: 'Yearly Plan',
      price: '₹999',
      period: '/year',
      originalPrice: '₹1999',
      features: ['Unlimited access', 'Premium content', 'No ads', '24/7 support', '2 months free'],
      popular: true
    }
  ];

  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen py-8 px-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-purple-500/10 to-pink-500/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <Button
            variant="ghost"
            onClick={onBack}
            className="absolute left-0 top-0 text-slate-400 hover:text-slate-100"
          >
            ← Back to Profile
          </Button>
          
          <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full mb-6 shadow-2xl">
            <Zap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
            Choose Your Plan
          </h1>
          <p className="text-slate-400 text-lg">Unlock premium features with our subscription plans</p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              className={`relative cursor-pointer transition-all duration-300 hover:shadow-2xl bg-slate-800 border-slate-700 ${
                selectedPlan === plan.id 
                  ? 'ring-2 ring-blue-500 shadow-xl scale-105' 
                  : 'hover:scale-102'
              } ${plan.popular ? 'border-2 border-blue-500' : ''}`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1 text-sm font-semibold">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold mb-4 text-slate-100">{plan.name}</CardTitle>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-4xl font-bold text-slate-100">{plan.price}</span>
                  <span className="text-slate-400">{plan.period}</span>
                </div>
                {plan.originalPrice && (
                  <p className="text-sm text-slate-500 line-through mt-1">
                    {plan.originalPrice} {plan.period}
                  </p>
                )}
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="flex items-center justify-center">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedPlan === plan.id 
                      ? 'border-blue-500 bg-blue-500' 
                      : 'border-slate-600'
                  }`}>
                    {selectedPlan === plan.id && (
                      <CheckCircle className="w-4 h-4 text-white" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Payment Form */}
        <Card className="backdrop-blur-xl bg-slate-800 border-slate-700 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-slate-100">Payment Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Payment Method Selection */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3">Payment Method</label>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center p-4 border-2 border-blue-500/50 rounded-lg bg-blue-500/10 cursor-pointer">
                  <CreditCard className="w-5 h-5 text-blue-400 mr-3" />
                  <span className="font-medium text-blue-300">Credit Card</span>
                  <div className="ml-auto w-4 h-4 bg-blue-500 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Mock Credit Card Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Card Number</label>
                <input 
                  type="text" 
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-4 py-3 border border-slate-700 bg-slate-800 text-slate-100 placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Expiry Date</label>
                  <input 
                    type="text" 
                    placeholder="MM/YY"
                    className="w-full px-4 py-3 border border-slate-700 bg-slate-800 text-slate-100 placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">CVC</label>
                  <input 
                    type="text" 
                    placeholder="123"
                    className="w-full px-4 py-3 border border-slate-700 bg-slate-800 text-slate-100 placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                   
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Cardholder Name</label>
                <input 
                  type="text" 
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border border-slate-700 bg-slate-800 text-slate-100 placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            
                />
              </div>
            </div>

            {/* Summary */}
            <div className="bg-slate-700/50 p-6 rounded-xl border border-slate-600">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-slate-300">Selected Plan:</span>
                <span className="font-bold text-slate-100">{plans.find(p => p.id === selectedPlan)?.name}</span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold">
                <span className="text-slate-300">Total:</span>
                <span className="text-blue-400">{plans.find(p => p.id === selectedPlan)?.price}{plans.find(p => p.id === selectedPlan)?.period}</span>
              </div>
            </div>

            {/* Payment Button */}
            <Button
              onClick={handlePayment}
              disabled={processing}
              className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {processing ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Processing Payment...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Complete Payment
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </Button>

            <p className="text-xs text-slate-400 text-center">
              This is a demo payment form. No actual charges will be made.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const Profile = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPayment, setShowPayment] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const res = await getSubscriptionStatus(user?.userId);
        setSubscription(res);
      } catch (error) {
        console.error("Error fetching subscription:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === "reader") fetchSubscription();
  }, [user]);

  const handlePaymentComplete = () => {
    // Update subscription status after successful payment
    setSubscription({
      isSubscribed: true,
      endDate: "2025-09-08", // One month from now
      paymentMode: "credit card"
    });
    setShowPayment(false);
  };

  if (showPayment) {
    return (
      <PaymentPage 
        onPaymentComplete={handlePaymentComplete}
        onBack={() => setShowPayment(false)}
      />
    );
  }

  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen py-8 px-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-purple-500/10 to-pink-500/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header Section */}
       <button
      variant="ghost"
      onClick={() => navigate("/reader")}
      className="absolute left-0 top-0 text-slate-400 hover:text-slate-100"
    >
      ← Back to Profile
    </button>
        <div className="text-center mb-12">
          <div className="relative inline-flex items-center justify-center w-28 h-28 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full mb-6 shadow-2xl ring-4 ring-slate-800/20 ring-offset-4 ring-offset-transparent">
            <User className="w-14 h-14 text-white drop-shadow-sm" />
            <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg ring-4 ring-slate-800/30">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            {/* Floating particles effect */}
            <div className="absolute inset-0 rounded-full">
              <div className="absolute top-2 left-4 w-1 h-1 bg-white/40 rounded-full animate-ping"></div>
              <div className="absolute bottom-3 right-3 w-1.5 h-1.5 bg-white/30 rounded-full animate-ping animation-delay-300"></div>
              <div className="absolute top-1/2 left-1 w-1 h-1 bg-white/50 rounded-full animate-ping animation-delay-700"></div>
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3 drop-shadow-sm">
            Welcome Back
          </h1>
          <p className="text-slate-400 text-xl font-medium">Manage your profile and subscription details</p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mt-4"></div>
        </div>

        {/* Main Profile Card */}
        <Card className="backdrop-blur-xl bg-slate-800 border-slate-700 shadow-2xl ring-1 ring-slate-700/50 mb-8 overflow-hidden relative group hover:shadow-3xl transition-all duration-500">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Header with enhanced styling */}
          <CardHeader className="relative bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white pb-10 overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_1px_1px,_white_1px,_transparent_0)] bg-[length:20px_20px] animate-pulse"></div>
            </div>
            
            <div className="flex items-center gap-6 relative z-10">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm ring-2 ring-white/30 group-hover:scale-105 transition-transform duration-300">
                <User className="w-10 h-10 text-white drop-shadow-md" />
              </div>
              <div>
                <CardTitle className="text-3xl font-bold mb-2 drop-shadow-sm">Reader Profile</CardTitle>
                <p className="text-blue-100 text-lg font-medium">Your account information and settings</p>
              </div>
            </div>
            
            {/* Enhanced bottom border */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-white/40 via-white/60 to-white/40"></div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-4 bg-white/20 rounded-t-full blur-sm"></div>
          </CardHeader>
          
          <CardContent className="relative p-10 space-y-10">
            {/* Username Section */}
            <div className="group/item hover:bg-slate-700/30 p-6 rounded-2xl transition-all duration-500 border border-transparent hover:border-slate-600/50 hover:shadow-lg">
              <div className="flex items-center gap-6 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg group-hover/item:scale-110 group-hover/item:rotate-3 transition-all duration-300">
                  <User className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Username</span>
              </div>
              <span className="text-3xl font-bold text-slate-100 ml-18 bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
                {user?.userName}
              </span>
            </div>

            {/* Role Section */}
            <div className="group/item hover:bg-slate-700/30 p-6 rounded-2xl transition-all duration-500 border border-transparent hover:border-slate-600/50 hover:shadow-lg">
              <div className="flex items-center gap-6 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg group-hover/item:scale-110 group-hover/item:-rotate-3 transition-all duration-300">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Account Role</span>
              </div>
              <div className="ml-18">
                <Badge 
                  variant="outline" 
                  className="px-6 py-3 text-base font-bold capitalize bg-emerald-500/10 border-2 border-emerald-500/50 text-emerald-300 hover:shadow-xl hover:scale-105 transition-all duration-300 rounded-xl"
                >
                  <Crown className="w-5 h-5 mr-3" />
                  {user?.role}
                </Badge>
              </div>
            </div>

            {/* Subscription Section */}
            {user?.role === "reader" && !loading && (
              <div className="group/item hover:bg-slate-700/30 p-6 rounded-2xl transition-all duration-500 border border-transparent hover:border-slate-600/50 hover:shadow-lg">
                <div className="flex items-center gap-6 mb-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg group-hover/item:scale-110 transition-all duration-300 ${
                    subscription?.isSubscribed 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 group-hover/item:rotate-12' 
                      : 'bg-gradient-to-r from-red-500 to-rose-500 group-hover/item:-rotate-12'
                  }`}>
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Subscription Status</span>
                </div>
                
                <div className="ml-18 space-y-6">
                  <Badge
                    variant={subscription?.isSubscribed ? "default" : "destructive"}
                    className={`px-6 py-3 text-base font-bold transition-all duration-300 hover:shadow-xl hover:scale-105 rounded-xl ${
                      subscription?.isSubscribed
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                        : 'bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600'
                    }`}
                  >
                    {subscription?.isSubscribed ? (
                      <CheckCircle className="w-5 h-5 mr-3" />
                    ) : (
                      <XCircle className="w-5 h-5 mr-3" />
                    )}
                    {subscription?.isSubscribed ? "Active Subscription" : "Not Subscribed"}
                  </Badge>

                  {/* Subscribe Button for unsubscribed users */}
                  {!subscription?.isSubscribed && (
                    <Button
                      onClick={() => setShowPayment(true)}
                      className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300 hover:shadow-xl hover:scale-105 rounded-xl"
                    >
                      <Zap className="w-5 h-5 mr-3" />
                      Subscribe Now
                      <ArrowRight className="w-5 h-5 ml-3" />
                    </Button>
                  )}

                  {subscription?.isSubscribed && (
                    <div className="bg-slate-700/50 border-2 border-green-500/50 rounded-2xl p-8 space-y-6 shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center gap-4 p-4 bg-slate-600/40 rounded-xl backdrop-blur-sm">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-green-300 mb-1 uppercase tracking-wide">Valid Until</p>
                          <p className="text-xl font-bold text-green-400">
                            {subscription.endDate || "N/A"}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 p-4 bg-slate-600/40 rounded-xl backdrop-blur-sm">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-green-300 mb-1 uppercase tracking-wide">Payment Method</p>
                          <p className="text-xl font-bold text-green-400 capitalize">
                            {subscription.paymentMode}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Loading State */}
            {user?.role === "reader" && loading && (
              <div className="group/item hover:bg-slate-700/30 p-6 rounded-2xl transition-all duration-500 border border-transparent hover:border-slate-600/50">
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-slate-600 to-slate-700 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Loading Subscription...</span>
                </div>
                <div className="ml-18 space-y-4">
                  <div className="w-48 h-10 bg-gradient-to-r from-slate-700 to-slate-600 rounded-xl animate-pulse"></div>
                  <div className="w-32 h-6 bg-gradient-to-r from-slate-700 to-slate-600 rounded-lg animate-pulse"></div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Footer */}
        <div className="text-center p-8 bg-slate-800/60 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-700">
          <p className="text-slate-400 text-base">
            Need help? 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-semibold cursor-pointer hover:underline ml-2 transition-all duration-300 hover:scale-105 inline-block">
              Contact Support
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;