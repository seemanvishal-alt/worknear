/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User, Shield, Bell, Key, Globe, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';

export default function ProfilePage() {
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'security' | 'notifications'>('profile');
  
  // Profile settings
  const [name, setName] = useState('Hiring Manager');
  const [company, setCompany] = useState('Bloom Ventures');
  const [industry, setIndustry] = useState('Artificial Intelligence');
  const [email, setEmail] = useState('recruiter@bloom.ai');
  const [isSaved, setIsSaved] = useState(false);

  // Notifications
  const [notifyMatches, setNotifyMatches] = useState(true);
  const [notifyCompliance, setNotifyCompliance] = useState(true);
  const [notifyNewsletter, setNotifyNewsletter] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-8" id="profile-settings-page">
      
      <div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-stone-900 dark:text-stone-50">
          Account Control & Settings
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Review your enterprise tokens, setup notification loops, and audit global hiring variables.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left Side Selector */}
        <div className="w-full md:w-1/4 flex flex-col space-y-1 bg-stone-100 p-1.5 rounded-xl dark:bg-stone-900 h-fit border border-stone-200 dark:border-stone-800">
          {[
            { id: 'profile', label: 'Organization Info', icon: <User className="h-4 w-4" /> },
            { id: 'security', label: 'Platform Security', icon: <Shield className="h-4 w-4" /> },
            { id: 'notifications', label: 'Notification Loops', icon: <Bell className="h-4 w-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              id={`setting-subtab-${tab.id}`}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center space-x-2 px-3 py-2 text-xs font-semibold rounded-lg text-left transition ${
                activeSubTab === tab.id
                  ? 'bg-stone-50 text-teal-800 dark:bg-stone-850 dark:text-teal-400 shadow-sm font-bold'
                  : 'text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Right Side form displayer */}
        <div className="flex-1 rounded-2xl border border-stone-200 bg-stone-50 p-6 dark:border-stone-800 dark:bg-stone-900/40 shadow-sm">
          
          {/* PROFILE / INFO FORM */}
          {activeSubTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4" id="settings-profile-form">
              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-500 mb-4">Enterprise Demographics</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider dark:text-stone-400 mb-1.5">Your Full Name</label>
                  <input
                    id="settings-name-input"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-stone-100 border border-stone-200 dark:bg-stone-900 dark:border-stone-800 rounded-xl px-3 py-2 text-sm text-stone-900 dark:text-stone-100 outline-none focus:border-teal-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider dark:text-stone-400 mb-1.5">Corporate Email Address</label>
                  <input
                    id="settings-email-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-stone-100 border border-stone-200 dark:bg-stone-900 dark:border-stone-800 rounded-xl px-3 py-2 text-sm text-stone-900 dark:text-stone-100 outline-none focus:border-teal-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider dark:text-stone-400 mb-1.5">Company / Host Entity</label>
                  <input
                    id="settings-company-input"
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full bg-stone-100 border border-stone-200 dark:bg-stone-900 dark:border-stone-800 rounded-xl px-3 py-2 text-sm text-stone-900 dark:text-stone-100 outline-none focus:border-teal-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider dark:text-stone-400 mb-1.5">Industry Segment</label>
                  <input
                    id="settings-industry-input"
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full bg-stone-100 border border-stone-200 dark:bg-stone-900 dark:border-stone-800 rounded-xl px-3 py-2 text-sm text-stone-900 dark:text-stone-100 outline-none focus:border-teal-700"
                  />
                </div>
              </div>

              <button
                id="settings-save-btn"
                type="submit"
                className="rounded-xl bg-teal-700 px-5 py-2.5 text-xs font-semibold text-stone-50 hover:bg-teal-800 transition dark:bg-teal-600 dark:hover:bg-teal-500 cursor-pointer"
              >
                Save Demographics
              </button>

              {isSaved && (
                <div className="mt-3 flex items-center space-x-1.5 text-xs text-emerald-800 dark:text-emerald-400" id="settings-save-success">
                  <CheckCircle className="h-4 w-4" />
                  <span>Demographics successfully synced across our secure cloud nodes.</span>
                </div>
              )}
            </form>
          )}

          {/* SECURITY & CREDENTIALS */}
          {activeSubTab === 'security' && (
            <div className="space-y-4" id="settings-security-section">
              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-500 mb-4">Platform & Sourcing Secrets</h3>
              
              <div className="p-4 border border-stone-200 rounded-xl dark:border-stone-800 bg-stone-100 dark:bg-stone-950/20">
                <div className="flex items-center space-x-2 mb-2">
                  <Key className="h-4.5 w-4.5 text-teal-700 dark:text-teal-400" />
                  <span className="text-xs font-bold font-mono text-stone-700 dark:text-stone-300">GEMINI_API_KEY</span>
                </div>
                <p className="text-[11px] text-stone-500 leading-relaxed mb-3">
                  Sovereign API key used to route high-dimensional candidate sorting queries directly through Gemini 3.6-flash engines. Provided and protected automatically.
                </p>
                <div className="bg-stone-200 dark:bg-stone-950 px-3 py-1.5 rounded text-[11px] font-mono text-stone-600 dark:text-stone-400 select-all overflow-x-auto">
                  ••••••••••••••••••••••••••••••••••••••••
                </div>
              </div>

              <div className="p-4 border border-stone-200 rounded-xl dark:border-stone-800 bg-stone-100 dark:bg-stone-950/20">
                <div className="flex items-center space-x-2 mb-2">
                  <Globe className="h-4.5 w-4.5 text-teal-700 dark:text-teal-400" />
                  <span className="text-xs font-bold font-mono text-stone-700 dark:text-stone-300">Compliance Audit logs</span>
                </div>
                <p className="text-[11px] text-stone-500 leading-relaxed">
                  Last login: Today 08:31 UTC from 54.210.33.155 (US-East-1 Ingress). Reciprocal EU non-disclosure and EOR audit signatures verified perfectly.
                </p>
              </div>
            </div>
          )}

          {/* NOTIFICATION PREFERENCES */}
          {activeSubTab === 'notifications' && (
            <div className="space-y-4" id="settings-notifications-section">
              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-500 mb-4">Notification Loops & Webhooks</h3>
              
              <div className="space-y-3">
                {[
                  { state: notifyMatches, setter: setNotifyMatches, title: 'AI Match Alerts', desc: 'Notify immediately when specialized talent compatibility index scores exceed 95%.' },
                  { state: notifyCompliance, setter: setNotifyCompliance, title: 'Compliance & EOR Audits', desc: 'Notify when regional tax profiles or statutory benefits schedules are locked or modified.' },
                  { state: notifyNewsletter, setter: setNotifyNewsletter, title: 'WorkNear Premium Dispatches', desc: 'Receive bi-weekly engineering, recruitment, and sovereign platform reports.' }
                ].map((item, idx) => (
                  <label key={idx} className="flex items-start space-x-3 cursor-pointer p-2.5 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-900 transition-all">
                    <input
                      type="checkbox"
                      checked={item.state}
                      onChange={(e) => item.setter(e.target.checked)}
                      className="mt-1 h-4.5 w-4.5 rounded border-stone-300 text-teal-700 focus:ring-teal-500 dark:border-stone-800 accent-teal-700"
                    />
                    <div>
                      <span className="block text-xs font-extrabold text-stone-950 dark:text-stone-100">{item.title}</span>
                      <span className="text-[11px] text-stone-500 leading-normal">{item.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
