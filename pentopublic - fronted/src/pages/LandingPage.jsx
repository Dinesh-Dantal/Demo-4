import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, PenTool, Star, ArrowRight, Check } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const currentUserId = 1;

  const handlePlanSelect = (planType) => {
    navigate("/subscription", {
      state: {
        selectedPlan: planType,
        userId: currentUserId,
        fromRegister: false,
      }
    });
  };

  const features = [
    {
      icon: BookOpen,
      title: "Discover Amazing Stories",
      description: "Explore thousands of books from talented authors worldwide"
    },
    {
      icon: PenTool,
      title: "Publish Your Work",
      description: "Share your stories with readers who appreciate great literature"
    },
    {
      icon: Users,
      title: "Join Our Community",
      description: "Connect with fellow readers and authors in our vibrant community"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Published Author",
      content: "PenToPublic gave me the platform to reach thousands of readers. It's been an incredible journey!",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Avid Reader",
      content: "I've discovered so many amazing stories here. The quality of content is outstanding!",
      rating: 5
    },
    {
      name: "Emma Davis",
      role: "New Author",
      content: "The community support and feedback helped me improve my writing tremendously.",
      rating: 5
    }
  ];

  const plans = [
    {
      name: "Reader",
      price: "Free",
      planType: "reader",
      features: [
        "Access to free books",
        "Basic community features",
        "Reading progress tracking",
        "Book recommendations"
      ]
    },
    {
      name: "Premium Reader",
      price: "₹199/month",
      planType: "monthly",
      features: [
        "Access to all premium content",
        "Early access to new releases",
        "Ad-free reading experience",
        "Exclusive author interviews",
        "Advanced reading analytics"
      ],
      popular: true
    },
    {
      name: "Author",
      price: "Free",
      planType: "author",
      features: [
        "Publish unlimited books",
        "Author analytics dashboard",
        "Reader engagement tools",
        "Community access"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            From Pen to Public
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            The ultimate platform where authors share their stories and readers discover their next favorite book.
            Join thousands of writers and readers in our vibrant literary community.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onClick={() => navigate("/register")}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg font-semibold rounded-2xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-purple-500/25 transform hover:scale-105 flex items-center space-x-2"
            >
              <span>Start Your Journey</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-8 py-4 bg-slate-800 border border-slate-700 text-slate-100 text-lg font-semibold rounded-2xl hover:bg-slate-700 transition-all duration-200 shadow-lg"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Why Choose PenToPublic?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-slate-900/80 border border-slate-700 rounded-2xl p-8 shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-slate-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            What Our Community Says
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-slate-800/80 border border-slate-700 rounded-2xl p-8 shadow-lg hover:shadow-purple-500/25 transition-all duration-300">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-purple-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-300 text-lg mb-6 leading-relaxed italic">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-slate-400">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Choose Your Plan
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div key={index} className={`relative bg-slate-900/80 border border-slate-700 rounded-2xl p-8 shadow-lg hover:shadow-purple-500/25 transition-all duration-300 ${plan.popular ? 'ring-4 ring-purple-500 scale-105' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold text-purple-400 mb-2">{plan.price}</div>
                  {plan.price !== "Free" && <p className="text-slate-400">per month</p>}
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <Check className="h-5 w-5 text-green-400" />
                      <span className="text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => {
                    if (plan.planType === "monthly") {
                      handlePlanSelect("monthly");
                    } else {
                      alert("You’re already on this free plan!");
                    }
                  }}
                  className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-purple-500/25 transform hover:scale-105'
                      : 'bg-slate-800 text-slate-100 border border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {plan.planType === "monthly" ? "Change Plan" : "My Plan"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Ready to Begin Your Story?
          </h2>
          <p className="text-xl text-slate-300 mb-12 leading-relaxed">
            Join thousands of authors and readers who have already discovered the magic of PenToPublic.
            Your next great adventure in literature starts here.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={() => navigate("/register")}
              className="px-10 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg font-semibold rounded-2xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-purple-500/25 transform hover:scale-105"
            >
              Join Now - It's Free!
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-10 py-4 bg-slate-800 border border-slate-700 text-slate-100 text-lg font-semibold rounded-2xl hover:bg-slate-700 transition-all duration-200 shadow-lg"
            >
              Already a Member?
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white">PenToPublic ✍️</h3>
          </div>
          <p className="mb-6">
            Connecting authors and readers through the power of storytelling.
          </p>
          <p className="text-sm">
            © 2025 PenToPublic. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
