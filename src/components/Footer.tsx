/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Brain, Github, Linkedin, Mail, Phone, MapPin, Instagram } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export default function Footer({ setActiveTab }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-150 bg-slate-50 text-slate-600 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          
          {/* Logo & Info */}
          <div className="space-y-4 text-left">
            <div 
              className="flex cursor-pointer items-center space-x-2"
              onClick={() => setActiveTab('landing')}
              id="footer-logo"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Brain className="h-4.5 w-4.5" />
              </div>
              <span className="text-lg font-bold text-slate-900">
                WorkNear
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-500">
              High-dimensional semantic AI workforce matching for elite technology teams. Reimagining global recruitment with speed, compliance, and perfect coordination.
            </p>
            <div className="flex space-x-3 pt-2">
              <a 
                href="https://www.linkedin.com/in/seeman-p-3b5468380?utm_source=share_via&utm_content=profile&utm_medium=member_ios" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-blue-600 transition-colors" 
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a 
                href="https://www.instagram.com/dhe._spyro._?igsh=MXh3NHFudXVieDBkeA%3D%3D&utm_source=qrand" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-pink-600 transition-colors" 
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="mailto:seemanvishal@gmail.com" 
                className="text-slate-400 hover:text-red-500 transition-colors" 
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-slate-400 hover:text-blue-600 transition-colors" 
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Solutions & Navigation */}
          <div className="text-left">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-850">
              Platform
            </h3>
            <ul className="mt-4 space-y-2 text-xs font-semibold">
              <li>
                <button 
                  onClick={() => setActiveTab('gig-marketplace')} 
                  className="hover:text-blue-600 cursor-pointer"
                  id="footer-link-matching"
                >
                  ⚡ Hyperlocal Gigs
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('workers')} 
                  className="hover:text-blue-600 cursor-pointer"
                  id="footer-link-workers"
                >
                  For Tech Talent
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('employers')} 
                  className="hover:text-blue-600 cursor-pointer"
                  id="footer-link-employers"
                >
                  For Hiring Managers
                </button>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="text-left">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-850">
              Resources
            </h3>
            <ul className="mt-4 space-y-2 text-xs font-semibold">
              <li>
                <a href="#faq-section" className="hover:text-blue-600">
                  Help Center & FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Global EOR Compliance
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Developer API
                </a>
              </li>
            </ul>
          </div>

          {/* WorkNear Contact Information */}
          <div className="text-left" id="footer-contact-section">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-850">
              WorkNear Contact
            </h3>
            <ul className="mt-4 space-y-2 text-xs text-slate-500 font-semibold">
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                <span>R&D Hub: Sri Sai Ranganathan Engineering College, Coimbatore, India</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-blue-600 shrink-0" />
                <span className="text-slate-400">Email:</span>
                <a href="mailto:seemanvishal@gmail.com" className="hover:text-blue-600 font-mono">
                  seemanvishal@gmail.com
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-blue-600 shrink-0" />
                <span className="text-slate-400">Phone:</span>
                <a href="tel:8838039681" className="hover:text-blue-600 font-mono">
                  8838039681
                </a>
              </li>
            </ul>
            
            <div className="mt-4 space-y-2 pt-3 border-t border-slate-200/60">
              <a
                href="tel:8838039681"
                id="footer-call-support-btn"
                className="flex items-center justify-center space-x-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-xs font-bold transition-all duration-200 shadow-sm"
              >
                <Phone className="h-3.5 w-3.5" />
                <span>Call Support</span>
              </a>
              <a
                href="mailto:seemanvishal@gmail.com"
                id="footer-email-support-btn"
                className="flex items-center justify-center space-x-2 w-full bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 py-2 px-3 rounded-lg text-xs font-bold transition-all duration-200 shadow-sm"
              >
                <Mail className="h-3.5 w-3.5 text-blue-600" />
                <span>Email Support</span>
              </a>
            </div>
          </div>

        </div>

        {/* Legal & Fine print */}
        <div className="mt-8 border-t border-slate-150 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
          <p>© {currentYear} WorkNear Technologies, Inc. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 sm:mt-0 font-medium">
            <a href="#" className="hover:text-slate-650">Privacy Policy</a>
            <a href="#" className="hover:text-slate-650">Terms of Service</a>
            <a href="#" className="hover:text-slate-650">EOR Liability Statement</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
