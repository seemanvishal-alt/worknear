/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Menu, X, User } from 'lucide-react';
import workNearLogo from '../assets/worknear-logo.png';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  onLoginClick: () => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  isDarkMode,
  setIsDarkMode,
  onLoginClick,
  isLoggedIn,
  onLogout
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = isLoggedIn ? [
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'employers', label: '💼 Employers' },
    { id: 'job-owner', label: '🎯 Job Owner' },
    { id: 'admin', label: '🛠️ Admin Console' },
    { id: 'gig-marketplace', label: '⚡ Hyperlocal Gigs' },
    { id: 'symposium', label: '🏆 Symposium Slides' },
    { id: 'about', label: '👥 Team' },
  ] : [
    { id: 'symposium', label: '🏆 Symposium Slides' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/95 backdrop-blur-md transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div 
            className="flex cursor-pointer items-center space-x-2" 
            onClick={() => setActiveTab(isLoggedIn ? 'dashboard' : 'login')}
            id="nav-logo"
          >
            <img
              src={workNearLogo}
              alt="WorkNear"
              className="h-11 w-11 rounded-xl object-cover shadow-md shadow-indigo-600/25"
            />
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Work<span className="text-blue-600">Near</span>
              </span>
              <span className="block text-[10px] font-bold tracking-widest uppercase text-slate-400">
                AI WORKFORCE
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-1 lg:space-x-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
                className={`relative px-3 py-2 text-sm font-semibold transition-colors duration-150 rounded-lg ${
                  activeTab === item.id
                    ? 'text-blue-600 bg-blue-50/70'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {item.label}
                {activeTab === item.id && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-blue-600" />
                )}
              </button>
            ))}
          </div>

          {/* Right Action Buttons */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <button
                  id="nav-profile-btn"
                  onClick={() => setActiveTab('profile')}
                  className="flex items-center space-x-1.5 text-sm font-semibold text-slate-700 hover:text-slate-900"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 border border-slate-200">
                    <User className="h-4 w-4 text-slate-650" />
                  </div>
                  <span className="max-w-[100px] truncate">Hiring Manager</span>
                </button>
                <button
                  id="logout-btn"
                  onClick={onLogout}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                id="login-btn"
                onClick={onLoginClick}
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 transition-colors duration-150 shadow-sm cursor-pointer"
              >
                Access Platform
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden space-x-2">
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-lg p-2 text-slate-500 hover:bg-slate-50 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-2 pt-2 pb-4 space-y-1 text-left">
          {navItems.map((item) => (
            <button
              key={item.id}
              id={`mobile-nav-item-${item.id}`}
              onClick={() => {
                setActiveTab(item.id);
                setIsOpen(false);
              }}
              className={`block w-full text-left px-4 py-2.5 rounded-lg text-base font-semibold transition-colors ${
                activeTab === item.id
                  ? 'text-blue-600 bg-blue-50/70'
                  : 'text-slate-650 hover:bg-slate-50'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-4 border-t border-slate-100 px-4">
            {isLoggedIn ? (
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => {
                    setActiveTab('profile');
                    setIsOpen(false);
                  }}
                  className="flex items-center space-x-2 text-slate-700 text-sm py-1.5"
                >
                  <User className="h-4 w-4 text-blue-600" />
                  <span>Hiring Manager Profile</span>
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setIsOpen(false);
                  }}
                  className="w-full text-center rounded-lg border border-slate-200 py-2 text-sm font-semibold text-slate-600"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onLoginClick();
                  setIsOpen(false);
                }}
                className="w-full text-center rounded-xl bg-blue-600 text-white py-2 text-sm font-semibold"
              >
                Access Platform
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
