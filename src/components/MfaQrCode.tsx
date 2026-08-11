import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Key, Copy, Check, Sparkles, RefreshCw, Smartphone, Mail, Info } from 'lucide-react';

interface MfaQrCodeProps {
  onCodeGenerated: (code: string) => void;
  onSelectMethod?: (method: 'qr' | 'email') => void;
}

export default function MfaQrCode({ onCodeGenerated, onSelectMethod }: MfaQrCodeProps) {
  const [activeMethod, setActiveMethod] = useState<'qr' | 'email'>('qr');
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentCode, setCurrentCode] = useState('482931');
  const securitySecret = 'WN-SEC-MFA-99F7-41E2-A3B9-82CC';

  // Generate a random 6-digit number that stays constant for 30s
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Generate new code
          const newCode = Math.floor(100000 + Math.random() * 900000).toString();
          setCurrentCode(newCode);
          onCodeGenerated(newCode);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onCodeGenerated]);

  // Initial code notification
  useEffect(() => {
    onCodeGenerated(currentCode);
  }, []);

  const handleCopySecret = () => {
    navigator.clipboard.writeText(securitySecret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAutoFill = () => {
    onCodeGenerated(currentCode);
  };

  const selectMethod = (method: 'qr' | 'email') => {
    setActiveMethod(method);
    if (onSelectMethod) {
      onSelectMethod(method);
    }
  };

  return (
    <div className="space-y-4" id="mfa-visual-qr-component">
      {/* Tab Selector */}
      <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200/60" id="mfa-tabs-container">
        <button
          type="button"
          onClick={() => selectMethod('qr')}
          className={`flex-1 flex items-center justify-center space-x-1.5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeMethod === 'qr'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          id="mfa-tab-qr"
        >
          <Smartphone className="h-3.5 w-3.5" />
          <span>Authenticator App</span>
        </button>
        <button
          type="button"
          onClick={() => selectMethod('email')}
          className={`flex-1 flex items-center justify-center space-x-1.5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeMethod === 'email'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          id="mfa-tab-email"
        >
          <Mail className="h-3.5 w-3.5" />
          <span>Email Passcode</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeMethod === 'qr' ? (
          <motion.div
            key="qr-panel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4 text-center"
            id="mfa-qr-panel"
          >
            {/* Instruction Banner */}
            <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl text-left flex items-start space-x-2">
              <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-[11px] text-slate-600 leading-normal font-semibold">
                Link WorkNear to your authenticator app (such as Google Authenticator, Microsoft Authenticator, or Duo) by scanning the QR code below.
              </p>
            </div>

            {/* Premium Interactive QR Code Area */}
            <div className="relative inline-block p-4 bg-slate-50 border border-slate-200/80 rounded-2xl shadow-inner group">
              
              {/* High-Fidelity Professional SVG QR Code Container */}
              <div className="w-36 h-36 relative bg-white rounded-xl p-2 border border-slate-100 flex items-center justify-center shadow-sm overflow-hidden" id="mfa-qr-container">
                {/* Subtle high-tech background grid overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.04)_1px,transparent_1px)] bg-[size:6px_6px] pointer-events-none z-10" />

                {/* Animated high-tech cyber holographic sheen */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-tr from-sky-400/0 via-sky-400/5 to-blue-400/0 pointer-events-none z-10"
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />

                {/* Dynamic Sharp Laser Scan Line with outer glow */}
                <motion.div
                  className="absolute left-1 right-1 h-[2px] bg-sky-500 z-20 pointer-events-none shadow-[0_0_8px_#38bdf8,0_0_15px_#0284c7]"
                  animate={{
                    top: ['6px', '136px', '6px'],
                  }}
                  transition={{
                    duration: 2.0,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />

                {/* Trailing scan gradient sweep */}
                <motion.div
                  className="absolute left-1 right-1 h-14 bg-gradient-to-b from-sky-400/15 via-sky-400/5 to-transparent pointer-events-none z-10"
                  animate={{
                    top: ['-50px', '136px', '-50px'],
                  }}
                  transition={{
                    duration: 2.0,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />

                {/* High-tech Viewfinder / Scanner target corner brackets */}
                <div className="absolute top-1 left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-sky-500 rounded-tl-[3px] pointer-events-none z-25 opacity-80" />
                <div className="absolute top-1 right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-sky-500 rounded-tr-[3px] pointer-events-none z-25 opacity-80" />
                <div className="absolute bottom-1 left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-sky-500 rounded-bl-[3px] pointer-events-none z-25 opacity-80" />
                <div className="absolute bottom-1 right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-sky-500 rounded-br-[3px] pointer-events-none z-25 opacity-80" />

                <svg viewBox="0 0 100 100" className="w-full h-full select-none" id="mfa-qr-svg">
                  {/* Background */}
                  <rect width="100" height="100" fill="white" />
                  
                  {/* Finder Pattern Top Left */}
                  <rect x="2" y="2" width="22" height="22" fill="#0f172a" rx="2" />
                  <rect x="5" y="5" width="16" height="16" fill="white" rx="1" />
                  <rect x="8" y="8" width="10" height="10" fill="#0f172a" rx="1" />

                  {/* Finder Pattern Top Right */}
                  <rect x="76" y="2" width="22" height="22" fill="#0f172a" rx="2" />
                  <rect x="79" y="5" width="16" height="16" fill="white" rx="1" />
                  <rect x="82" y="8" width="10" height="10" fill="#0f172a" rx="1" />

                  {/* Finder Pattern Bottom Left */}
                  <rect x="2" y="76" width="22" height="22" fill="#0f172a" rx="2" />
                  <rect x="5" y="79" width="16" height="16" fill="white" rx="1" />
                  <rect x="8" y="82" width="10" height="10" fill="#0f172a" rx="1" />

                  {/* Alignment Pattern Bottom Right */}
                  <rect x="80" y="80" width="8" height="8" fill="#0f172a" rx="1" />
                  <rect x="82" y="82" width="4" height="4" fill="white" rx="0.5" />
                  <rect x="83.5" y="83.5" width="1" height="1" fill="#0f172a" />

                  {/* QR Dots Pattern representing corporate secure hashes */}
                  <g fill="#0f172a">
                    {/* Top-middle pattern */}
                    <rect x="28" y="2" width="6" height="3" rx="0.5" />
                    <rect x="38" y="2" width="12" height="3" rx="0.5" />
                    <rect x="54" y="2" width="6" height="10" rx="0.5" />
                    <rect x="64" y="2" width="8" height="3" rx="0.5" />
                    
                    <rect x="28" y="8" width="16" height="3" rx="0.5" />
                    <rect x="48" y="8" width="3" height="3" rx="0.5" />
                    <rect x="64" y="8" width="8" height="10" rx="0.5" />

                    <rect x="28" y="14" width="3" height="14" rx="0.5" />
                    <rect x="34" y="14" width="12" height="3" rx="0.5" />
                    <rect x="50" y="14" width="10" height="3" rx="0.5" />
                    
                    <rect x="38" y="20" width="20" height="3" rx="0.5" />
                    <rect x="64" y="20" width="8" height="3" rx="0.5" />

                    {/* Left-middle pattern */}
                    <rect x="2" y="28" width="3" height="16" rx="0.5" />
                    <rect x="8" y="28" width="12" height="3" rx="0.5" />
                    <rect x="24" y="28" width="12" height="3" rx="0.5" />
                    <rect x="40" y="28" width="3" height="16" rx="0.5" />

                    <rect x="8" y="34" width="3" height="12" rx="0.5" />
                    <rect x="14" y="34" width="8" height="3" rx="0.5" />
                    <rect x="24" y="34" width="12" height="3" rx="0.5" />

                    <rect x="2" y="44" width="16" height="3" rx="0.5" />
                    <rect x="24" y="44" width="14" height="3" rx="0.5" />

                    <rect x="2" y="52" width="3" height="12" rx="0.5" />
                    <rect x="8" y="52" width="12" height="3" rx="0.5" />
                    <rect x="24" y="52" width="12" height="3" rx="0.5" />

                    {/* Right-middle pattern */}
                    <rect x="76" y="28" width="14" height="3" rx="0.5" />
                    <rect x="94" y="28" width="4" height="3" rx="0.5" />

                    <rect x="76" y="34" width="3" height="16" rx="0.5" />
                    <rect x="82" y="34" width="10" height="3" rx="0.5" />

                    <rect x="82" y="44" width="3" height="16" rx="0.5" />
                    <rect x="88" y="44" width="10" height="3" rx="0.5" />

                    <rect x="76" y="52" width="3" height="3" rx="0.5" />
                    <rect x="88" y="52" width="3" height="12" rx="0.5" />

                    {/* Bottom-middle pattern */}
                    <rect x="28" y="76" width="16" height="3" rx="0.5" />
                    <rect x="48" y="76" width="3" height="16" rx="0.5" />
                    <rect x="54" y="76" width="18" height="3" rx="0.5" />

                    <rect x="28" y="82" width="3" height="12" rx="0.5" />
                    <rect x="34" y="82" width="10" height="3" rx="0.5" />
                    <rect x="54" y="82" width="3" height="12" rx="0.5" />

                    <rect x="28" y="94" width="18" height="3" rx="0.5" />
                    <rect x="54" y="94" width="3" height="3" rx="0.5" />

                    {/* Center Cutout for secure look */}
                    <rect x="42" y="42" width="16" height="16" fill="white" rx="1" />
                    
                    {/* SVG Shield/Key Logo at exact center */}
                    <path 
                      d="M45 46.5 C45 45 50 43.5 50 43.5 C50 43.5 55 45 55 46.5 C55 52 50 56 50 56 C50 56 45 52 45 46.5 Z" 
                      fill="#2563eb" 
                    />
                    <circle cx="50" cy="48" r="1.5" fill="white" />
                    <rect x="49.2" y="49" width="1.6" height="3" fill="white" />
                  </g>
                </svg>
              </div>
            </div>

            {/* Secret setup key fallback */}
            <div className="flex flex-col items-center space-y-1.5 bg-slate-50 border border-slate-200/60 p-2.5 rounded-xl">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Secret Setup Code</span>
              <div className="flex items-center space-x-2">
                <code className="text-xs font-mono font-bold text-slate-700 bg-white px-2 py-1 rounded border border-slate-200 select-all">
                  {securitySecret}
                </code>
                <button
                  type="button"
                  onClick={handleCopySecret}
                  className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  title="Copy secret setup key"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            {/* Interactive Token Generation Preview */}
            <div className="p-3 bg-slate-900 text-white rounded-xl text-left relative overflow-hidden flex items-center justify-between border border-slate-850 shadow-lg">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-1.5">
                  <Smartphone className="h-3.5 w-3.5 text-sky-400" />
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Dynamic App Token</span>
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-xl font-mono font-black text-white tracking-widest">{currentCode}</span>
                  <span className="text-[10px] text-emerald-400 font-bold flex items-center">
                    <RefreshCw className="h-2.5 w-2.5 animate-spin mr-1" />
                    {timeLeft}s
                  </span>
                </div>
              </div>

              {/* Auto fill simulated code action */}
              <button
                type="button"
                onClick={handleAutoFill}
                className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold uppercase tracking-wider cursor-pointer shadow-sm shadow-blue-500/20 active:scale-95 transition"
              >
                <Sparkles className="h-3 w-3 text-sky-200" />
                <span>Auto-Fill Token</span>
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="email-panel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3 text-left"
            id="mfa-email-panel"
          >
            <div className="flex items-start space-x-2.5">
              <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
                <Mail className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">Enterprise Email Backup</h4>
                <p className="text-[11px] text-slate-500 leading-normal font-semibold">
                  A verification code has been dispatched to your corporate inbox.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Dispatched Token</span>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {currentCode}
                </span>
                <button
                  type="button"
                  onClick={handleAutoFill}
                  className="text-[9px] font-bold text-blue-600 hover:underline cursor-pointer"
                >
                  Use this passcode
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
