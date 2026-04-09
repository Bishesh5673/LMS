import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedin,
  FaTiktok,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa6";

function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-emerald-900/50">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand Column */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <img
                src="https://codeit.com.np/storage/01KE9MC5P5YCRYWVW7HQ7JVDEK.png"
                width={160}
                alt="Code Academy Logo"
              />
            </div>
            <p className="text-emerald-400 text-xl font-bold mb-4">
              Nepal's #1 IT Training Center
            </p>
            <p className="text-zinc-400 leading-relaxed max-w-md">
              We are more than just a training center. Code Academy is a 
              community of creators, developers, and innovators building 
              the next generation of tech solutions in Nepal.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <h5 className="text-emerald-400 text-xl font-bold mb-6">Quick Links</h5>
            <div className="flex flex-col gap-4 text-zinc-300">
              <NavLink to="/courses" className="hover:text-emerald-400 transition-colors">All Courses</NavLink>
              <NavLink to="/blog" className="hover:text-emerald-400 transition-colors">Blog</NavLink>
              <NavLink to="/about" className="hover:text-emerald-400 transition-colors">About Us</NavLink>
              <NavLink to="/contact" className="hover:text-emerald-400 transition-colors">Contact Us</NavLink>
              <NavLink to="/jobs" className="hover:text-emerald-400 transition-colors">Jobs</NavLink>
            </div>
          </div>

          {/* Follow Us */}
          <div className="md:col-span-2">
            <h5 className="text-emerald-400 text-xl font-bold mb-6">Follow Us</h5>
            <div className="flex flex-wrap gap-6 text-3xl text-zinc-400">
              <a href="#" className="hover:text-emerald-400 transition-colors"><FaFacebookF /></a>
              <a href="#" className="hover:text-emerald-400 transition-colors"><FaInstagram /></a>
              <a href="#" className="hover:text-emerald-400 transition-colors"><FaLinkedin /></a>
              <a href="#" className="hover:text-emerald-400 transition-colors"><FaTwitter /></a>
              <a href="#" className="hover:text-emerald-400 transition-colors"><FaYoutube /></a>
              <a href="#" className="hover:text-emerald-400 transition-colors"><FaTiktok /></a>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="md:col-span-2">
            <h5 className="text-emerald-400 text-xl font-bold mb-6">Secure Payment</h5>
            <div className="flex flex-wrap gap-6 items-center">
              <img
                src="https://codeit.com.np/images/esewa.png"
                width={110}
                className="bg-white rounded-lg p-1"
                alt="eSewa"
              />
              <img
                src="https://codeit.com.np/images/fonepay.png"
                width={130}
                className="bg-white rounded-lg p-1"
                alt="Fonepay"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-emerald-900/30 py-6">
        <div className="max-w-7xl mx-auto px-6 text-center text-zinc-500 text-sm">
          Copyright © {new Date().getFullYear()} Code Academy. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;