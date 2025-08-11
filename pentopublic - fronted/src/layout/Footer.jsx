const Footer = () => (
  <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-center text-sm py-6 border-t border-gray-700 backdrop-blur-sm">
    <div className="container mx-auto px-4">
      {/* Main Text */}
      <p className="text-gray-300 font-medium">
        © {new Date().getFullYear()}{" "}
        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent font-bold">
          PenToPublic
        </span>
        . All rights reserved.
      </p>

      {/* Decorative Line */}
      <div className="mt-3 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent opacity-50"></div>

      {/* Optional Links */}
      <div className="mt-3 flex flex-wrap justify-center gap-4 text-gray-400 text-xs">
        <a href="/privacy" className="hover:text-blue-400 transition-colors">
          Privacy Policy
        </a>
        <a href="/terms" className="hover:text-blue-400 transition-colors">
          Terms of Service
        </a>
        <a href="/contact" className="hover:text-blue-400 transition-colors">
          Contact Us
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
