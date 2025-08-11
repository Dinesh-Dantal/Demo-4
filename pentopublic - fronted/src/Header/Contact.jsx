import React, { useState } from "react";
import { CheckCircle, AlertCircle } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submissionStatus, setSubmissionStatus] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setSubmissionStatus("success");
    setFormData({ name: "", email: "", message: "" });
    setTimeout(() => {
      setSubmissionStatus(null);
    }, 3000);
  };

  return (
    <div className="bg-slate-900 text-slate-100 py-16 px-6 min-h-screen">
      <div className="max-w-xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Contact Us
        </h1>

        {/* Success Message */}
        {submissionStatus === "success" && (
          <div className="bg-green-900/30 border border-green-500/50 text-green-300 px-4 py-3 rounded-lg flex items-center space-x-2 mb-4 shadow-lg">
            <CheckCircle className="h-5 w-5 flex-shrink-0" />
            <span>Thanks for reaching out! We'll get back to you soon.</span>
          </div>
        )}

        {/* Error Message */}
        {submissionStatus === "error" && (
          <div className="bg-red-900/30 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg flex items-center space-x-2 mb-4 shadow-lg">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>Failed to send message. Please try again.</span>
          </div>
        )}

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 border rounded-lg border-slate-700 bg-slate-800 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
          <input
            type="email"
            placeholder="Your Email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 border rounded-lg border-slate-700 bg-slate-800 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
          <textarea
            placeholder="Your Message"
            required
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full px-4 py-3 border rounded-lg border-slate-700 bg-slate-800 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 h-32 resize-none"
          />
          <button
            type="submit"
            className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-purple-500/25 transform hover:scale-105"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
