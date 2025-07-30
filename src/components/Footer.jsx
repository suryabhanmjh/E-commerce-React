import React from "react";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

const Footer = () => (
  <footer style={styles.footer}>
    <div className="container mx-auto px-4 py-10 flex flex-col md:flex-row justify-between items-start gap-12">
      {/* Left: Brand and Description */}
      <div className="mb-4 md:mb-0 text-center md:text-left max-w-xs flex-1">
        <div className="font-bold text-2xl text-purple-400 mb-2">
          Old Bookstore
        </div>
        <div className="text-base mt-1">
          &copy; {new Date().getFullYear()} Old Bookstore. All rights reserved.
        </div>
        <div className="text-sm text-gray-400 mt-1">
          Made with ❤️ for book lovers.
        </div>
        <p className="text-sm text-gray-300 mt-4">
          Old Bookstore is your one-stop shop for new and pre-loved books. We
          believe in spreading knowledge and joy through affordable reading.
        </p>
      </div>
      {/* Divider */}
      <div className="hidden md:block h-40 border-l border-gray-700 mx-8"></div>
      {/* Middle: Services */}
      <div className="text-center flex-1">
        <div className="font-semibold text-lg text-purple-300 mb-3">
          Our Services
        </div>
        <ul className="text-sm text-gray-200 space-y-2">
          <li>• Wide range of books</li>
          <li>• Fast & secure delivery</li>
          <li>• Wishlist & save for later</li>
          <li>• Easy returns</li>
          <li>• 24/7 customer support</li>
        </ul>
      </div>
      {/* Divider */}
      <div className="hidden md:block h-40 border-l border-gray-700 mx-8"></div>
      {/* Right: Social Media */}
      <div className="flex flex-col items-center gap-3 flex-1">
        <div className="font-semibold text-lg text-purple-300 mb-1">
          Connect with us
        </div>
        <div className="flex gap-6 text-2xl mb-2">
          <a
            href="https://github.com/suryabhanmjh"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition"
            aria-label="GitHub"
          >
            <FaGithub />
          </a>
          <a
            href="https://linkedin.com/in/suryabhan-singh99"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition"
            aria-label="LinkedIn"
          >
            <FaLinkedin />
          </a>
          <a
            href="mailto:suryabhan283808@gmail.com"
            className="hover:text-white transition"
            aria-label="Mail"
          >
            <FaEnvelope />
          </a>
        </div>
        <div className="text-sm text-gray-400">
          Connect with us on social media!
        </div>
        <div className="mt-4 text-xs text-gray-500">
          Contact: +91-7987292878
          <br />
          Email: suryabhan283808@gmail.com
        </div>
      </div>
    </div>
  </footer>
);

const styles = {
  footer: {
    background: "#222",
    color: "#fff",
    textAlign: "center",
    padding: "0",
    position: "relative",
    bottom: 0,
    width: "100%",
    marginTop: "40px",
  },
};

export default Footer;
