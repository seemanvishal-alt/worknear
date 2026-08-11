/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Smartphone, Gift, Users, Copy, CheckCircle, Award, SmartphoneIcon, PlayCircle, AppWindow } from 'lucide-react';

export default function ReferralAndMobile() {
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitedEmails, setInvitedEmails] = useState<string[]>([]);
  const [copiedLink, setCopiedLink] = useState(false);
  const [successInvite, setSuccessInvite] = useState(false);

  const referralLink = 'https://worknear.com/join/WN-908A72';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !inviteEmail.includes('@')) return;

    setInvitedEmails(prev => [...prev, inviteEmail]);
    setInviteEmail('');
    setSuccessInvite(true);
    setTimeout(() => setSuccessInvite(false), 3000);
  };

  return (
    <section className="py-20 bg-slate-50 border-b border-slate-100 transition-colors duration-200 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Card: Referral Program console */}
          <div className="lg:col-span-7 bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2.5 mb-4">
                <Gift className="h-5 w-5 text-blue-600" />
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-800">Executive Referral Covenant</h3>
              </div>

              <h4 className="text-lg sm:text-xl font-black text-slate-900 leading-tight uppercase tracking-wider">
                Invite Specialists & Earn Financial Rewards
              </h4>
              
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Unlock ongoing monetization streams. When a candidate you invite completes their compliance verification on WorkNear, you earn a <b>$500 USD</b> placement reward.
              </p>

              {/* Action area */}
              <div className="mt-6 space-y-4">
                {/* Copy link */}
                <div className="space-y-1.5">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Your Private Invite Link</span>
                  <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 p-2 rounded-xl">
                    <span className="flex-1 text-xs font-mono font-medium text-slate-700 overflow-x-auto truncate pl-2">
                      {referralLink}
                    </span>
                    <button
                      onClick={copyToClipboard}
                      id="btn-copy-ref-link"
                      className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold uppercase cursor-pointer transition shrink-0"
                    >
                      {copiedLink ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                {/* Email form */}
                <form onSubmit={handleInviteSubmit} className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dispatch invite directly</label>
                  <div className="flex space-x-2">
                    <input
                      id="referral-email-input"
                      type="email"
                      placeholder="specialist@network.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      required
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-blue-500 text-slate-800 font-medium"
                    />
                    <button
                      type="submit"
                      id="btn-send-ref-invite"
                      className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-sm"
                    >
                      Invite
                    </button>
                  </div>
                  {successInvite && (
                    <div className="flex items-center space-x-1 text-[10px] text-emerald-600 font-bold" id="ref-invite-alert">
                      <CheckCircle className="h-3.5 w-3.5" />
                      <span>Invite dispatched to private queue successfully.</span>
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* Micro Dashboard */}
            <div className="mt-8 pt-5 border-t border-slate-150 grid grid-cols-3 gap-4 text-center">
              <div>
                <span className="block text-[9px] text-slate-400 font-mono font-bold uppercase">INVITED_NODES</span>
                <span className="block text-sm font-black text-slate-900 mt-1">
                  {invitedEmails.length + 3} Specialists
                </span>
              </div>
              <div>
                <span className="block text-[9px] text-slate-400 font-mono font-bold uppercase">CONSOLIDATED_PAYOUTS</span>
                <span className="block text-sm font-black text-blue-600 mt-1">$1,500 USD</span>
              </div>
              <div>
                <span className="block text-[9px] text-slate-400 font-mono font-bold uppercase">REWARD_STATUS</span>
                <span className="block text-[9px] font-extrabold uppercase text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-200 mt-1 inline-block">
                  ELITE PARTNER
                </span>
              </div>
            </div>
          </div>

          {/* Right Card: Mobile App download with QR code (Redesigned to white/blue card) */}
          <div className="lg:col-span-5 bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center space-x-2.5">
                <Smartphone className="h-5 w-5 text-blue-650" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-blue-650 font-mono">Mobile App Deployment</span>
              </div>

              <h4 className="text-lg sm:text-xl font-black leading-tight uppercase tracking-wider text-slate-900">
                WorkNear Sourcing App
              </h4>

              <p className="text-xs text-slate-600 leading-relaxed">
                Approve global payroll, sign EOR covenants, and review top candidates on the fly. Experience zero latency with our native mobile platform.
              </p>
            </div>

            <div className="flex items-center space-x-6 py-6 border-y border-slate-150 my-4">
              {/* Fake QR code using CSS art */}
              <div className="h-20 w-20 bg-slate-50 border border-slate-200 p-1.5 rounded-xl flex flex-wrap shrink-0 shadow-inner justify-center items-center">
                <div className="h-16 w-16 bg-[linear-gradient(45deg,#1e3a8a_25%,transparent_25%),linear-gradient(-45deg,#1e3a8a_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#1e3a8a_75%),linear-gradient(-45deg,transparent_75%,#1e3a8a_75%)] bg-[size:8px_8px]" />
              </div>
              
              <div className="space-y-1.5 text-left">
                <span className="block text-[10px] font-bold text-blue-600 uppercase tracking-widest font-mono">QUICK DEPLOYMENT</span>
                <p className="text-[11px] text-slate-650 leading-normal font-medium">
                  Scan the secure QR code using your smartphone device to instantly pull latest binaries.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button className="flex-1 min-w-[120px] bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 font-bold text-[11px] uppercase py-3 px-4 rounded-xl flex items-center justify-center space-x-2 transition cursor-pointer">
                <AppWindow className="h-4 w-4 text-blue-600" />
                <span>iOS App Store</span>
              </button>
              
              <button className="flex-1 min-w-[120px] bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 font-bold text-[11px] uppercase py-3 px-4 rounded-xl flex items-center justify-center space-x-2 transition cursor-pointer">
                <PlayCircle className="h-4 w-4 text-sky-550" />
                <span>Android Play</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
