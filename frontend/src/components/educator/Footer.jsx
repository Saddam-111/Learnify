import React from 'react';
import { assets } from '../../assets/assets';

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 py-6 px-4 md:px-16">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Logo & Text */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2">
          <img src={assets.logo} alt="logo" className="w-32" />
          <p className="text-sm">&copy; 2025. All rights reserved.</p>
        </div>

        {/* Social Links */}
        <div className="flex gap-4">
          <a href="#" aria-label="Facebook" className="hover:scale-110 transition-transform">
            <img src={assets.facebook_icon} alt="Facebook" className="w-6 h-6" />
          </a>
          <a href="#" aria-label="Twitter" className="hover:scale-110 transition-transform">
            <img src={assets.twitter_icon} alt="Twitter" className="w-6 h-6" />
          </a>
          <a href="#" aria-label="Instagram" className="hover:scale-110 transition-transform">
            <img src={assets.instagram_icon} alt="Instagram" className="w-6 h-6" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
