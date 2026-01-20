
import React from 'react';
import { LamieLogoIcon } from '../common/Icons';

export const Footer: React.FC = () => (
  <footer className="bg-mocha-900 text-cream-200 pt-20 pb-10">
    <div className="max-w-7xl mx-auto px-6 md:px-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <LamieLogoIcon className="w-8 h-8 text-cream-200" />
            <span className="font-serif text-2xl">Lamie</span>
          </div>
          <p className="font-body text-sm text-mocha-100 leading-relaxed">
            Bringing the gentle beauty of nature into every living space, with appreciation and meticulous attention to detail.
          </p>
        </div>
        
        <div>
          <h4 className="font-serif text-lg mb-6 text-white">Contact</h4>
          <ul className="space-y-4 font-body text-sm text-mocha-100">
            <li>123 Flower Road, District 1, HCMC</li>
            <li>hello@lamieflower.vn</li>
            <li>090 123 4567</li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-lg mb-6 text-white">Explore</h4>
          <ul className="space-y-4 font-body text-sm text-mocha-100 cursor-pointer">
            <li className="hover:text-white">About Us</li>
            <li className="hover:text-white">Collections</li>
            <li className="hover:text-white">Workshop</li>
            <li className="hover:text-white">Blog</li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-lg mb-6 text-white">Opening Hours</h4>
          <ul className="space-y-4 font-body text-sm text-mocha-100">
            <li>Mon - Fri: 08:00 - 20:00</li>
            <li>Sat - Sun: 09:00 - 21:00</li>
          </ul>
        </div>
      </div>
      
      <div className="border-t border-mocha-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-mocha-300 font-body uppercase tracking-widest">
        <p>&copy; 2024 Lamie Flower Shop. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <span>Facebook</span>
          <span>Instagram</span>
        </div>
      </div>
    </div>
  </footer>
);
