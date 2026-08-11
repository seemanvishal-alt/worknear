/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, Sparkles, Eye, EyeOff, AlertCircle, CheckCircle, 
  Key, Mail, User, Building, ArrowRight, ArrowLeft, Lock, FileText,
  ShieldAlert, RefreshCw, Cpu, ShieldCheck, Phone, MessageSquare, Camera, Scan, Fingerprint, Check
} from 'lucide-react';
import { signInWithEmail, signUpWithEmail, getCurrentUser } from '../lib/supabase';
import workNearLogo from '../assets/worknear-logo.png';

interface LoginPageProps {
  setIsLoggedIn: (login: boolean) => void;
  setActiveTab: (tab: string) => void;
  addToast: (msg: string) => void;
}

export default function LoginPage({ setIsLoggedIn, setActiveTab, addToast }: LoginPageProps) {
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [loginStep, setLoginStep] = useState<1 | 2>(1); // Step 1: Login, Step 2: Aadhaar Card Verification
  
  // Fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('employer');
  const [rememberMe, setRememberMe] = useState(true);

  // Aadhaar States
  const [aadharNumber, setAadharNumber] = useState('');
  const [aadharValid, setAadharValid] = useState(false);
  const [isAadharVerifying, setIsAadharVerifying] = useState(false);

  // Extra Verification States
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [isPhoneVerifying, setIsPhoneVerifying] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [isOtpVerifying, setIsOtpVerifying] = useState(false);

  const [selfieTaken, setSelfieTaken] = useState(false);
  const [isSelfieScanning, setIsSelfieScanning] = useState(false);
  const [selfieMatchScore, setSelfieMatchScore] = useState<number | null>(null);
  const [activeVerifyChannel, setActiveVerifyChannel] = useState<'aadhaar' | 'otp' | 'face' | 'phone'>('aadhaar');

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [shouldShake, setShouldShake] = useState(false);

  const triggerShake = () => {
    setShouldShake(true);
    setTimeout(() => setShouldShake(false), 500);
  };

  // Check for Supabase auth state on mount
  useEffect(() => {
    // Only check if not already trying to login/logout
    const checkAuth = async () => {
      try {
        const { user, error } = await getCurrentUser();
        
        // Only auto-login if user exists and no error
        if (user && !error) {
          setIsLoggedIn(true);
          addToast(`Welcome back, ${user.email}!`);
          setActiveTab('dashboard');
        }
      } catch (err) {
        // User not logged in, stay on login page
        console.log('No active session');
      }
    };

    // Only check on initial mount, not on every render
    checkAuth();

    // Also check for OAuth callback success (legacy support)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('login') === 'success') {
      fetch('/api/user')
        .then(res => res.json())
        .then(data => {
          if (data.authenticated) {
            setIsLoggedIn(true);
            addToast(`Welcome ${data.user.name}! Successfully authenticated via Google.`);
            setActiveTab('dashboard');
            window.history.replaceState({}, document.title, '/');
          }
        })
        .catch(err => {
          console.error('Failed to fetch user:', err);
        });
    }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  const handleAadharChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    let raw = e.target.value.replace(/\D/g, '');
    if (raw.length > 12) raw = raw.slice(0, 12);

    let formatted = '';
    for (let i = 0; i < raw.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formatted += ' ';
      }
      formatted += raw[i];
    }
    setAadharNumber(formatted);

    if (raw.length === 12) {
      setIsAadharVerifying(true);
      setAadharValid(false);
      setTimeout(() => {
        setIsAadharVerifying(false);
        setAadharValid(true);
        addToast('Aadhaar database verified successfully.');
      }, 1000);
    } else {
      setAadharValid(false);
    }
  };

  // OTP Countdown hook
  useEffect(() => {
    if (otpCountdown > 0) {
      const timer = setTimeout(() => setOtpCountdown(otpCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpCountdown]);

  // Send OTP handler
  const handleSendOtp = () => {
    if (!phoneNumber || phoneNumber.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      triggerShake();
      return;
    }
    setError('');
    setIsPhoneVerifying(true);
    addToast('Deploying secure OTP SMS challenge payload...');
    setTimeout(() => {
      setIsPhoneVerifying(false);
      setOtpSent(true);
      setOtpCountdown(30);
      addToast('SMS OTP Challenge delivered! Enter code 982161 to verify phone.');
    }, 1200);
  };

  // Verify OTP
  const handleVerifyOtp = () => {
    if (!otpCode) {
      setError('Please enter the 6-digit OTP code.');
      triggerShake();
      return;
    }
    setIsOtpVerifying(true);
    setTimeout(() => {
      setIsOtpVerifying(false);
      if (otpCode === '982161' || otpCode === '123456') {
        setOtpVerified(true);
        setPhoneVerified(true);
        setError('');
        addToast('Mobile number and SMS verification approved.');
      } else {
        setError('Invalid OTP code. Please enter 982161.');
        triggerShake();
      }
    }, 800);
  };

  // Run Face Scanning
  const handleFaceMatching = () => {
    setIsSelfieScanning(true);
    setSelfieTaken(false);
    addToast('Powering up high-fidelity visual biometric camera...');
    setTimeout(() => {
      setIsSelfieScanning(false);
      setSelfieTaken(true);
      setSelfieMatchScore(99.2);
      addToast('Liveness check approved: 99.2% Facial Landmark Match with government registry.');
    }, 2200);
  };

  // Login handler with Supabase
  const handleNextStep = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (authMode === 'signin') {
      // Sign In with Supabase
      const loginIdentifier = username || email;
      if (!loginIdentifier) {
        setError('Please enter your username or email address.');
        triggerShake();
        return;
      }

      if (password.length < 6) {
        setError('Password must contain at least 6 characters.');
        triggerShake();
        return;
      }

      setIsLoading(true);
      try {
        const { data, error } = await signInWithEmail(loginIdentifier, password);
        
        if (error) {
          setError(error.message || 'Login failed. Please check your credentials.');
          setIsLoading(false);
          triggerShake();
          return;
        }

        if (data.user) {
          setIsLoading(false);
          setSuccess('Login successful! Welcome back.');
          addToast(`Welcome back, ${data.user.email}!`);
          setTimeout(() => {
            setIsLoggedIn(true);
            setActiveTab('dashboard');
          }, 800);
        }
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.');
        setIsLoading(false);
        triggerShake();
      }

    } else if (authMode === 'signup') {
      // Sign Up with Supabase
      if (!email.includes('@')) {
        setError('Please enter a valid corporate email address.');
        triggerShake();
        return;
      }

      if (password.length < 6) {
        setError('Password must contain at least 6 characters.');
        triggerShake();
        return;
      }

      if (!name) {
        setError('Please enter your full name.');
        triggerShake();
        return;
      }

      setIsLoading(true);
      try {
        const { data, error } = await signUpWithEmail(email, password, {
          full_name: name,
          company: company,
          role: role,
        });

        if (error) {
          // Check if email signups are disabled
          if (error.message?.includes('Email signups are disabled') || 
              error.message?.includes('Signups not allowed')) {
            setError('Email signup is currently disabled. Please use "Continue with Google" to sign in.');
            addToast('Please use Google Sign-In instead.');
            setIsLoading(false);
            triggerShake();
            return;
          }
          
          setError(error.message || 'Sign up failed. Please try again.');
          setIsLoading(false);
          triggerShake();
          return;
        }

        if (data.user) {
          setIsLoading(false);
          setSuccess('Account created successfully! Please check your email to verify.');
          addToast('Account created! Check your email for verification link.');
          setTimeout(() => {
            setAuthMode('signin');
            setSuccess('');
          }, 2000);
        }
      } catch (err: any) {
        // Handle email signup disabled error
        if (err.message?.includes('Email signups are disabled') || 
            err.message?.includes('Signups not allowed')) {
          setError('Email signup is currently disabled. Please use "Continue with Google" to sign in.');
          addToast('Please use Google Sign-In instead.');
        } else {
          setError(err.message || 'An unexpected error occurred.');
        }
        setIsLoading(false);
        triggerShake();
      }
    }
  };

  // Step 2 Submission (Verification Multi-channel)
  const handleAadharSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Require at least one verification channel to succeed
    if (activeVerifyChannel === 'aadhaar' && !aadharValid) {
      setError('UIDAI Aadhaar registry check is pending or incomplete.');
      triggerShake();
      return;
    }
    if (activeVerifyChannel === 'otp' && !otpVerified) {
      setError('Please complete the SMS OTP challenge first.');
      triggerShake();
      return;
    }
    if (activeVerifyChannel === 'face' && !selfieTaken) {
      setError('Please complete the Facial Biometric Selfie match scan first.');
      triggerShake();
      return;
    }
    if (activeVerifyChannel === 'phone' && !phoneVerified) {
      setError('Please verify your phone number via OTP channel.');
      triggerShake();
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsLoggedIn(true);
      setSuccess('All sovereign verification channels authenticated. Access granted!');
      addToast('MFA Handshake Complete. Session established.');
      setTimeout(() => setActiveTab('dashboard'), 1000);
    }, 1000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 text-left" id="login-full-page">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-2xl min-h-[640px]">
        
        {/* LEFT PANE (Nucleus / WorkNear Brand Info & Interactivity) */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-slate-50 via-teal-50/40 to-indigo-50/50 text-slate-800 p-12 flex-col justify-between relative overflow-hidden border-r border-slate-200">
          <div className="absolute inset-0 bg-grid-slate-200/50 bg-[size:16px_16px] pointer-events-none" />
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-sky-200/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-indigo-200/25 rounded-full blur-3xl pointer-events-none" />

          {/* Brand Header */}
          <div className="flex items-center space-x-3 z-10">
            <img
              src={workNearLogo}
              alt="WorkNear logo"
              className="h-12 w-12 rounded-xl object-cover shadow-md shadow-indigo-600/25"
            />
            <div>
              <span className="text-xl font-black tracking-tight block text-slate-900">WorkNear Portal</span>
              <span className="text-[10px] uppercase tracking-widest font-mono text-teal-800">Sovereign Employment Platform</span>
            </div>
          </div>

          {/* Brand Logo */}
          <div className="my-6 space-y-4 z-10 relative">
            <div className="h-[220px] rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm bg-slate-950 flex items-center justify-center p-3">
              <img src={workNearLogo} alt="WorkNear — Work smarter. Build together." className="h-full w-full object-contain" />
            </div>
          </div>

          {/* Testimonial Quote */}
          <div className="z-10 text-left space-y-3 pb-4">
            <p className="text-sm font-semibold italic text-slate-600 leading-relaxed">
              "Simply all the tools that my team and I need to hire pre-screened talent near our location. The Google maps coordination is exceptional."
            </p>
            <div>
              <span className="block text-xs font-black uppercase tracking-wider text-slate-950">Seeman</span>
              <span className="block text-[10px] font-semibold text-teal-800 uppercase">Founder of WorkNear</span>
            </div>
          </div>

          {/* Footer TLS */}
          <div className="z-10 pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span className="flex items-center space-x-1">
              <Shield className="h-3.5 w-3.5 text-emerald-600 animate-pulse" />
              <span>TLS_SECURE_AES256</span>
            </span>
            <span>NODE: WN_761A</span>
          </div>
        </div>

        {/* RIGHT CONTROL PANE (Polished Login Interface from Image) */}
        <div className={`lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center bg-slate-50 ${shouldShake ? 'animate-shake' : ''}`} id="login-control-pane">
          <div className="max-w-md w-full mx-auto space-y-6">
            
            {/* Header / Titles */}
            <div className="space-y-2 text-left">
              <div className="flex items-center space-x-2 text-blue-600 text-xs font-black uppercase tracking-widest mb-1.5">
                <ShieldCheck className="h-4.5 w-4.5 text-blue-600 animate-pulse" />
                <span>Identity Gateway</span>
              </div>
              
              <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                {loginStep === 1 ? 'Welcome back' : 'Verify Aadhaar ID'}
              </h2>
              <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                {loginStep === 1 
                  ? 'Access your unified hiring, payroll compliance, and team metrics dashboard.' 
                  : 'UIDAI registry cross-check required to validate payroll EOR status.'}
              </p>
            </div>

            {/* Error & Success Notification Boxes */}
            {error && (
              <div className="flex items-start space-x-2.5 text-xs text-red-700 bg-red-50 p-4 rounded-2xl border border-red-150 text-left animate-bounce" id="login-error-alert">
                <ShieldAlert className="h-4.5 w-4.5 shrink-0 mt-0.5 text-red-650" />
                <span className="font-bold leading-normal">{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-start space-x-2.5 text-xs text-emerald-800 bg-emerald-50 p-4 rounded-2xl border border-emerald-150 text-left" id="login-success-alert">
                <CheckCircle className="h-4.5 w-4.5 shrink-0 mt-0.5 text-emerald-600" />
                <span className="font-bold leading-normal">{success}</span>
              </div>
            )}

            <AnimatePresence mode="wait">
              {loginStep === 1 ? (
                <motion.div
                  key="form-step1"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  <form onSubmit={handleNextStep} className="space-y-4 text-left">
                    
                    {/* Signup Fields */}
                    {authMode === 'signup' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Full Name</label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                              type="text"
                              required
                              placeholder="Sarah Jenkins"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-blue-600"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Company Name</label>
                          <div className="relative">
                            <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                              type="text"
                              required
                              placeholder="Bloom Corp"
                              value={company}
                              onChange={(e) => setCompany(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-blue-600"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Email/Username field */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                        Username or Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          id="login-field-email"
                          type="text"
                          required
                          placeholder="e.g. admin or executive@company.com"
                          value={authMode === 'signin' ? username || email : email}
                          onChange={(e) => {
                            if (authMode === 'signin') {
                              setUsername(e.target.value);
                              setEmail(e.target.value);
                            } else {
                              setEmail(e.target.value);
                            }
                          }}
                          className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-blue-600"
                        />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          Password
                        </label>
                        {authMode === 'signin' && (
                          <button
                            type="button"
                            onClick={() => { setAuthMode('forgot'); setError(''); setSuccess(''); }}
                            className="text-[10px] font-bold text-blue-600 hover:underline cursor-pointer uppercase tracking-wider"
                          >
                            Forgot password?
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          id="auth-password-field"
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-blue-600"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded transition"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Remember me switch */}
                    {authMode === 'signin' && (
                      <div className="flex items-center space-x-2 py-1">
                        <input
                          type="checkbox"
                          id="remember-me-checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                        <label htmlFor="remember-me-checkbox" className="text-[11px] font-bold text-slate-500 cursor-pointer select-none">
                          Remember sign in details
                        </label>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 disabled:opacity-55 cursor-pointer shadow-lg shadow-blue-600/10 mt-6 uppercase tracking-wider"
                    >
                      {isLoading ? (
                        <RefreshCw className="h-4 w-4 animate-spin text-white" />
                      ) : (
                        <span>Log In</span>
                      )}
                    </button>

                    {/* Bottom Toggler */}
                    <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500 font-bold">
                      {authMode === 'signin' ? (
                        <>
                          <span>Don't have an account?</span>
                          <button
                            type="button"
                            onClick={() => { setAuthMode('signup'); setError(''); setSuccess(''); }}
                            className="text-blue-600 hover:underline cursor-pointer uppercase tracking-wider text-[10px]"
                          >
                            Sign Up
                          </button>
                        </>
                      ) : (
                        <>
                          <span>Already have an account?</span>
                          <button
                            type="button"
                            onClick={() => { setAuthMode('signin'); setError(''); setSuccess(''); }}
                            className="text-blue-600 hover:underline cursor-pointer uppercase tracking-wider text-[10px]"
                          >
                            Sign In
                          </button>
                        </>
                      )}
                    </div>

                  </form>
                </motion.div>
              ) : (
                /* STEP 2: SECURE WORKFORCE IDENTITY VERIFICATION PHASE */
                <motion.div
                  key="form-step2"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4 text-left"
                >
                  {/* Selector tabs for Verification Channels */}
                  <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-xl mb-1 border border-slate-200">
                    <button
                      type="button"
                      onClick={() => { setActiveVerifyChannel('aadhaar'); setError(''); }}
                      className={`py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition flex flex-col items-center justify-center space-y-1 cursor-pointer ${
                        activeVerifyChannel === 'aadhaar'
                          ? 'bg-white text-blue-600 shadow-sm border border-slate-200/50'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <Fingerprint className="h-3.5 w-3.5" />
                      <span>UIDAI</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { setActiveVerifyChannel('phone'); setError(''); }}
                      className={`py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition flex flex-col items-center justify-center space-y-1 cursor-pointer ${
                        activeVerifyChannel === 'phone'
                          ? 'bg-white text-blue-600 shadow-sm border border-slate-200/50'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <Phone className="h-3.5 w-3.5" />
                      <span>Phone</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { setActiveVerifyChannel('otp'); setError(''); }}
                      className={`py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition flex flex-col items-center justify-center space-y-1 cursor-pointer ${
                        activeVerifyChannel === 'otp'
                          ? 'bg-white text-blue-600 shadow-sm border border-slate-200/50'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>SMS OTP</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { setActiveVerifyChannel('face'); setError(''); }}
                      className={`py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition flex flex-col items-center justify-center space-y-1 cursor-pointer ${
                        activeVerifyChannel === 'face'
                          ? 'bg-white text-blue-600 shadow-sm border border-slate-200/50'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <Camera className="h-3.5 w-3.5" />
                      <span>Biometric</span>
                    </button>
                  </div>

                  <form onSubmit={handleAadharSubmit} className="space-y-4">
                    
                    {/* Header Details */}
                    <div className="bg-blue-50 border border-blue-150 p-3.5 rounded-2xl flex items-start space-x-3">
                      <ShieldCheck className="h-5 w-5 text-blue-600 shrink-0 mt-0.5 animate-pulse" />
                      <div className="space-y-1">
                        <span className="block text-[10px] font-black text-blue-700 uppercase tracking-widest font-mono">
                          {activeVerifyChannel === 'aadhaar' && 'Aadhaar Handshake Verification'}
                          {activeVerifyChannel === 'phone' && 'Secure Mobile Synchronization'}
                          {activeVerifyChannel === 'otp' && 'SMS OTP Passcode Handshake'}
                          {activeVerifyChannel === 'face' && 'Biometric Facial Landmark Scan'}
                        </span>
                        <p className="text-[10px] text-blue-800 leading-relaxed font-semibold">
                          {activeVerifyChannel === 'aadhaar' && 'Verify your 12-digit Indian National Aadhaar Number connected to digital UIDAI registries.'}
                          {activeVerifyChannel === 'phone' && 'Link your corporate phone number to establish a persistent location-aware notification grid.'}
                          {activeVerifyChannel === 'otp' && 'Enter the 6-digit cryptographic challenge payload dispatched to your primary hand-device.'}
                          {activeVerifyChannel === 'face' && 'Authenticates high-dimensional spatial landmarks to verify legal EOR contractor liveness.'}
                        </p>
                      </div>
                    </div>

                    {/* CHANNEL 1: AADHAAR */}
                    {activeVerifyChannel === 'aadhaar' && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                            Indian Aadhaar Card Number
                          </label>
                          <div className="relative">
                            <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                              type="text"
                              required
                              placeholder="0000 0000 0000"
                              value={aadharNumber}
                              onChange={handleAadharChange}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 outline-none focus:border-blue-650 font-mono text-sm tracking-widest font-black shadow-inner"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
                              {isAadharVerifying && <RefreshCw className="h-4.5 w-4.5 text-blue-600 animate-spin" />}
                              {!isAadharVerifying && aadharValid && <Check className="h-4.5 w-4.5 text-emerald-500 font-bold" />}
                            </div>
                          </div>
                          <p className="text-[9px] text-slate-400 mt-1 font-semibold leading-none">
                            Format matches 12-digit spacing payload automatically.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* CHANNEL 2: PHONE */}
                    {activeVerifyChannel === 'phone' && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                            Mobile Contact Number
                          </label>
                          <div className="flex space-x-2">
                            <div className="w-20 bg-slate-100 border border-slate-200 rounded-xl text-center flex items-center justify-center text-xs font-bold text-slate-600 select-none">
                              🇮🇳 +91
                            </div>
                            <div className="relative flex-1">
                              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                              <input
                                type="tel"
                                placeholder="98765 43210"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 outline-none focus:border-blue-650 font-mono text-sm tracking-wide font-black shadow-inner"
                              />
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleSendOtp}
                          disabled={isPhoneVerifying || phoneVerified}
                          className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-black uppercase tracking-wider transition border border-slate-250 cursor-pointer flex items-center justify-center space-x-1.5 disabled:opacity-50"
                        >
                          {isPhoneVerifying ? (
                            <>
                              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                              <span>Delivering OTP challenge...</span>
                            </>
                          ) : phoneVerified ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-emerald-600" />
                              <span>Phone Number Logged</span>
                            </>
                          ) : (
                            <>
                              <Lock className="h-3.5 w-3.5 text-slate-500" />
                              <span>Link & Send Verification Challenge</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {/* CHANNEL 3: SMS OTP */}
                    {activeVerifyChannel === 'otp' && (
                      <div className="space-y-3">
                        <div className="bg-slate-50 border border-slate-150 p-3 rounded-xl flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-500 uppercase font-mono">Channel Connection:</span>
                          <span className="text-[10px] font-bold text-emerald-600 flex items-center">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                            Live Gateway Active
                          </span>
                        </div>

                        <div>
                          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                            Enter SMS Challenge Code
                          </label>
                          <div className="relative">
                            <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                              type="text"
                              maxLength={6}
                              placeholder="982161"
                              value={otpCode}
                              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-24 py-2.5 text-xs text-slate-900 outline-none focus:border-blue-650 font-mono text-sm tracking-widest font-black shadow-inner"
                            />
                            
                            <button
                              type="button"
                              onClick={handleVerifyOtp}
                              disabled={isOtpVerifying || otpVerified}
                              className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase transition disabled:opacity-50 cursor-pointer"
                            >
                              {isOtpVerifying ? 'Verifying...' : otpVerified ? 'Approved' : 'Verify'}
                            </button>
                          </div>
                          
                          <div className="flex items-center justify-between mt-1.5 px-0.5">
                            <span className="text-[9px] text-slate-400 font-bold">
                              Demo Passcode: <code className="bg-slate-100 font-bold px-1 rounded text-blue-600">982161</code> or <code className="bg-slate-100 font-bold px-1 rounded text-blue-600">123456</code>
                            </span>
                            {otpCountdown > 0 ? (
                              <span className="text-[9px] text-slate-500 font-bold font-mono">Resend in {otpCountdown}s</span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setOtpCountdown(30)}
                                className="text-[9px] text-blue-600 font-bold hover:underline"
                              >
                                Resend SMS code
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* CHANNEL 4: BIOMETRIC FACE MATCH */}
                    {activeVerifyChannel === 'face' && (
                      <div className="space-y-3">
                        <div className="relative aspect-video w-full rounded-2xl bg-slate-950 overflow-hidden border border-slate-800 flex flex-col items-center justify-center p-4">
                          
                          {/* Animated futuristic facial mesh scanner target */}
                          <div className="absolute inset-0 bg-radial-gradient-scanner opacity-20 pointer-events-none" />
                          
                          {isSelfieScanning ? (
                            <>
                              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scanner-laser shadow-[0_0_15px_#22d3ee]" />
                              <Scan className="h-10 w-10 text-cyan-400 animate-pulse" />
                              <span className="text-[9px] text-cyan-400 uppercase tracking-widest font-mono font-bold mt-2 animate-bounce">Evaluating Biometric Depth...</span>
                            </>
                          ) : selfieTaken ? (
                            <>
                              <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none flex items-center justify-center border-2 border-emerald-500/40 rounded-2xl" />
                              <Check className="h-10 w-10 text-emerald-500 animate-scale-up" />
                              <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-mono font-bold mt-2">Liveness Face Mesh Synced</span>
                              <span className="text-[9px] text-slate-400 font-semibold mt-1">Accuracy Factor: {selfieMatchScore}% (UIDAI matched)</span>
                            </>
                          ) : (
                            <>
                              <Camera className="h-8 w-8 text-slate-500 mb-2" />
                              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono font-bold">Biometric Camera Standby</span>
                              <p className="text-[9px] text-slate-500 text-center max-w-xs mt-1 leading-normal font-semibold">
                                System will map 128 unique spatial landmarks on front selfie frame for anti-spoof compliance.
                              </p>
                            </>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={handleFaceMatching}
                          disabled={isSelfieScanning}
                          className="w-full py-2 bg-slate-900 hover:bg-black text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition cursor-pointer flex items-center justify-center space-x-1.5 disabled:opacity-50"
                        >
                          <Scan className="h-3.5 w-3.5" />
                          <span>{isSelfieScanning ? 'Liveness mesh tracking...' : selfieTaken ? 'Re-scan Face mesh' : 'Scan Biometric Face Mesh'}</span>
                        </button>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setLoginStep(1)}
                        className="py-3 border border-slate-250 hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs transition uppercase tracking-wider cursor-pointer text-center"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={
                          isLoading || 
                          (activeVerifyChannel === 'aadhaar' && !aadharValid) ||
                          (activeVerifyChannel === 'phone' && !phoneVerified) ||
                          (activeVerifyChannel === 'otp' && !otpVerified) ||
                          (activeVerifyChannel === 'face' && !selfieTaken)
                        }
                        className="py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold rounded-xl text-xs transition uppercase tracking-wider cursor-pointer text-center shadow-md shadow-blue-600/10"
                      >
                        Verify & Access
                      </button>
                    </div>

                  </form>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>

      </div>
    </div>
  );
}
