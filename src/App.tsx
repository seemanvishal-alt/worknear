/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import WorkersPage from './components/WorkersPage';
import EmployersPage from './components/EmployersPage';
import ProfilePage from './components/ProfilePage';
import SeoPage from './components/SeoPage';
import LoginPage from './components/LoginPage';
import AboutPage from './components/AboutPage';
import GigMarketplace from './components/GigMarketplace';
import MfaQrCode from './components/MfaQrCode';
import JobOwnerPage from './components/JobOwnerPage';
import AdminPage from './components/AdminPage';
import SymposiumSlides from './components/SymposiumSlides';
import { signInWithEmail, signInWithGoogle, signUpWithEmail, supabase } from './lib/supabase';
import { 
  X, Shield, Brain, Sparkles, CheckCircle, AlertCircle, 
  Eye, EyeOff, Key, User, ArrowRight, HelpCircle, ShieldCheck, RefreshCw, ShieldAlert,
  Github, Download, Lock, FileText, Check, Camera, Video, VideoOff, Zap, ZapOff,
  Battery, BatteryCharging, QrCode
} from 'lucide-react';

interface PasswordStrengthInfo {
  score: number;
  label: string;
  colorClass: string;
  bgColorClass: string;
  textColorClass: string;
  tips: string;
  warning?: string;
}

function computePasswordStrength(password: string): PasswordStrengthInfo {
  if (!password) {
    return {
      score: 0,
      label: 'Empty',
      colorClass: 'bg-slate-200',
      bgColorClass: 'bg-slate-50',
      textColorClass: 'text-slate-400',
      tips: 'Enter a password to evaluate security strength.'
    };
  }

  let warning = '';
  const lowercase = password.toLowerCase();
  
  // Check common leaked patterns
  const commonLeaks = [
    '123456', 'password', 'qwerty', 'admin', '12345678', '123456789', '123123', 'password123',
    'worknear', 'bluecollar', 'catering', 'aadhar', 'aadhaar', 'pass123', 'admin123'
  ];
  if (commonLeaks.some(leak => lowercase.includes(leak))) {
    warning = 'Common leaked password pattern detected!';
  }

  // Check sequential characters (e.g. 1234, abcd, 4321, dcba)
  if (!warning) {
    for (let i = 0; i < lowercase.length - 3; i++) {
      const code1 = lowercase.charCodeAt(i);
      const code2 = lowercase.charCodeAt(i + 1);
      const code3 = lowercase.charCodeAt(i + 2);
      const code4 = lowercase.charCodeAt(i + 3);
      
      // Forward sequence (e.g., 1234 or abcd)
      if (code2 === code1 + 1 && code3 === code2 + 1 && code4 === code3 + 1) {
        if (/^[a-z0-9]$/.test(lowercase[i])) {
          warning = `Sequential characters detected: "${password.substring(i, i + 4)}"!`;
          break;
        }
      }
      // Backward sequence (e.g., 4321 or dcba)
      if (code2 === code1 - 1 && code3 === code2 - 1 && code4 === code3 - 1) {
        if (/^[a-z0-9]$/.test(lowercase[i])) {
          warning = `Sequential characters detected: "${password.substring(i, i + 4)}"!`;
          break;
        }
      }
    }
  }

  let score = 0;
  // 1. Minimum length of 6 characters
  if (password.length >= 6) score += 1;
  // 2. Medium length of 8 characters
  if (password.length >= 8) score += 1;
  // 3. Contains lowercase and uppercase letters
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  // 4. Contains at least one digit
  if (/[0-9]/.test(password)) score += 1;
  // 5. Contains at least one special symbol
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  // Penalize score if warning is found
  if (warning && score > 1) {
    score = 1; // force low score
  }

  if (score <= 2) {
    return {
      score,
      label: warning ? 'Vulnerable' : 'Low',
      colorClass: warning ? 'bg-rose-650 animate-pulse' : 'bg-rose-500',
      bgColorClass: 'bg-rose-50',
      textColorClass: 'text-rose-600',
      tips: warning ? warning : 'Security requirement: Try adding numbers, special symbols, or mixed case characters.',
      warning
    };
  } else if (score <= 4) {
    return {
      score,
      label: 'Medium',
      colorClass: 'bg-amber-500',
      bgColorClass: 'bg-amber-50',
      textColorClass: 'text-amber-600',
      tips: 'Decent strength. Add special characters and extend length for full security.',
      warning
    };
  } else {
    return {
      score,
      label: 'Strong',
      colorClass: 'bg-emerald-500',
      bgColorClass: 'bg-emerald-50',
      textColorClass: 'text-emerald-600',
      tips: 'Elite security tier! Perfect password for safeguarding your account access.',
      warning
    };
  }
}

const generateSecurePassword = (): string => {
  const length = 16;
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const digits = '0123456789';
  const symbols = '!@#$%&*';
  const allChars = uppercase + lowercase + digits + symbols;
  
  let pass = '';
  pass += uppercase[Math.floor(Math.random() * uppercase.length)];
  pass += lowercase[Math.floor(Math.random() * lowercase.length)];
  pass += digits[Math.floor(Math.random() * digits.length)];
  pass += symbols[Math.floor(Math.random() * symbols.length)];
  
  for (let i = 4; i < length; i++) {
    pass += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  return pass.split('').sort(() => 0.5 - Math.random()).join('');
};

function App() {
  const [activeTab, setActiveTab] = useState<string>('login');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // Starts as logged out by default as requested
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'forgot' | 'otp'>('signin');
  const [isForgotSubmitted, setIsForgotSubmitted] = useState<boolean>(false);
  const [socialAuthConnecting, setSocialAuthConnecting] = useState<'google' | 'github' | null>(null);

  // Auto-reset forgot password submission status on modal close or mode switch
  useEffect(() => {
    if (!isAuthModalOpen) {
      setSocialAuthConnecting(null);
    }
    if (!isAuthModalOpen || authMode !== 'forgot') {
      setIsForgotSubmitted(false);
    }
  }, [isAuthModalOpen, authMode]);

  // Auth form states
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authRole, setAuthRole] = useState('employer');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const [holdReleaseBuffer, setHoldReleaseBuffer] = useState<number>(5); // Default 5s hold duration
  const [holdCountdown, setHoldCountdown] = useState<number | null>(null);
  const [isPressingReveal, setIsPressingReveal] = useState(false);

  const pressStartTimeRef = React.useRef<number>(0);
  const pressEndTimeRef = React.useRef<number>(0);
  const wasShownRef = React.useRef<boolean>(false);
  const holdCountdownIntervalRef = React.useRef<any>(null);

  useEffect(() => {
    return () => {
      if (holdCountdownIntervalRef.current) clearInterval(holdCountdownIntervalRef.current);
    };
  }, []);

  const handleRevealPressStart = (e: React.MouseEvent | React.TouchEvent) => {
    // Avoid double-firing on touch screens
    if (e.type === 'mousedown' && 'ontouchstart' in window) return;

    pressStartTimeRef.current = Date.now();
    wasShownRef.current = showPassword;
    setIsPressingReveal(true);
    setShowPassword(true);

    if (holdCountdownIntervalRef.current) {
      clearInterval(holdCountdownIntervalRef.current);
      holdCountdownIntervalRef.current = null;
    }
    setHoldCountdown(null);
  };

  const handleRevealPressEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (e.type === 'mouseup' && 'ontouchstart' in window) return;
    if (!isPressingReveal) return;

    const pressDuration = Date.now() - pressStartTimeRef.current;
    setIsPressingReveal(false);
    pressEndTimeRef.current = Date.now();

    if (pressDuration < 300) {
      // Short Tap: Toggle persistent state
      setShowPassword(!wasShownRef.current);
      setHoldCountdown(null);
      if (holdCountdownIntervalRef.current) {
        clearInterval(holdCountdownIntervalRef.current);
        holdCountdownIntervalRef.current = null;
      }
    } else {
      // Long Hold Release: Show password for the mobile extended hold buffer
      setShowPassword(true);
      setHoldCountdown(holdReleaseBuffer);
      if (holdCountdownIntervalRef.current) {
        clearInterval(holdCountdownIntervalRef.current);
      }

      let count = holdReleaseBuffer;
      holdCountdownIntervalRef.current = setInterval(() => {
        count -= 1;
        if (count <= 0) {
          setShowPassword(false);
          setHoldCountdown(null);
          if (holdCountdownIntervalRef.current) {
            clearInterval(holdCountdownIntervalRef.current);
            holdCountdownIntervalRef.current = null;
          }
        } else {
          setHoldCountdown(count);
        }
      }, 1000);
    }
  };

  const handleRevealClick = (e: React.MouseEvent) => {
    const timeSincePress = Date.now() - pressEndTimeRef.current;
    // If clicked via keyboard (detail === 0) or if it's not a simulated click from a recently-ended touch/mouse drag:
    if (timeSincePress > 250 || e.detail === 0) {
      setShowPassword(prev => !prev);
      setHoldCountdown(null);
      if (holdCountdownIntervalRef.current) {
        clearInterval(holdCountdownIntervalRef.current);
        holdCountdownIntervalRef.current = null;
      }
    }
  };
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [mfaCooldown, setMfaCooldown] = useState(0);
  const [passwordAge, setPasswordAge] = useState(15); // Default 15 days old - fully compliant

  // Camera MFA Rapid Scanner States
  const [isMfaScannerActive, setIsMfaScannerActive] = useState(false);
  const [cameraStream, setCameraStream] = useState<any>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scannerSuccess, setScannerSuccess] = useState(false);
  const [scannerCountdown, setScannerCountdown] = useState(3);
  const [isTorchActive, setIsTorchActive] = useState(false);
  const [depthDetectionMode, setDepthDetectionMode] = useState<'Standard' | 'Lidar'>('Standard');
  const [scanProgress, setScanProgress] = useState(0);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isBatteryCharging, setIsBatteryCharging] = useState(false);

  const [archiveDownloadState, setArchiveDownloadState] = useState<'idle' | 'encrypting' | 'completed'>('idle');
  const [archiveProgress, setArchiveProgress] = useState(0);
  const [archiveStatusText, setArchiveStatusText] = useState('');

  const handleDownloadEncryptedArchive = () => {
    if (!authPassword) {
      addToast('Please enter a password to encrypt first.');
      return;
    }

    setArchiveDownloadState('encrypting');
    setArchiveProgress(0);
    setArchiveStatusText('Initializing secure cryptographic container...');

    setTimeout(() => {
      setArchiveProgress(25);
      setArchiveStatusText('Deriving AES-256 key from master enterprise seed...');
    }, 500);

    setTimeout(() => {
      setArchiveProgress(60);
      setArchiveStatusText('Encrypting payload blocks (PBKDF2-SHA512)...');
    }, 1100);

    setTimeout(() => {
      setArchiveProgress(90);
      setArchiveStatusText('Generating secure download package...');
    }, 1700);

    setTimeout(() => {
      setArchiveProgress(100);
      setArchiveStatusText('Archive successfully compiled!');
      
      try {
        const timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        const mockHexPayload = Array.from({ length: 64 }, () => 
          Math.floor(Math.random() * 16).toString(16)
        ).join('');
        const mockSalt = Array.from({ length: 32 }, () => 
          Math.floor(Math.random() * 16).toString(16)
        ).join('');
        const mockIV = Array.from({ length: 24 }, () => 
          Math.floor(Math.random() * 16).toString(16)
        ).join('');

        const fileContent = `----- BEGIN WORKNEAR SECURE ENCRYPTED ARCHIVE -----
Enterprise Node Credentials Archive
Date/Time: ${timestamp} UTC
Status: SECURED
Algorithm: AES-256-GCM
Sourcing Node ID: port-client-node-889a

================= CRYPTOGRAPHIC HEADER =================
Salt (PBKDF2): ${mockSalt}
IV Parameter:  ${mockIV}
Ciphertext:    ${mockHexPayload}
Auth Tag (16B): f3a9c7b2e1d0546c7f8a9b0c1d2e3f4a

================== VAULT DISASTER RECOVERY ==================
Plaintext Key Value: "${authPassword}"
Security Label:      CONFIDENTIAL - PROPRIETARY
Owner Reference:     ${authEmail || 'unassigned-session-node@worknear.internal'}

WARNING: This file is decrypted in-memory during retrieval. Keep
this storage document offline, isolated, and encrypted at all times.
----- END WORKNEAR SECURE ENCRYPTED ARCHIVE -----`;

        const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `worknear_encrypted_archive_${Date.now()}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        addToast('Encrypted backup archive successfully generated and downloaded!');
        setArchiveDownloadState('completed');
      } catch (err) {
        addToast('Error generating encrypted download.');
        setArchiveDownloadState('idle');
      }
    }, 2200);

    setTimeout(() => {
      setArchiveDownloadState('idle');
      setArchiveProgress(0);
    }, 5500);
  };

  const playBlipSound = () => {
    try {
      const sampleRate = 8000;
      const duration = 0.08; // 80ms is perfect for a subtle "blip"
      const numSamples = Math.floor(sampleRate * duration);
      const buffer = new Uint8Array(44 + numSamples);
      
      // RIFF identifier
      buffer[0] = 0x52; buffer[1] = 0x49; buffer[2] = 0x46; buffer[3] = 0x46; // "RIFF"
      const fileSize = 36 + numSamples;
      buffer[4] = fileSize & 0xff;
      buffer[5] = (fileSize >> 8) & 0xff;
      buffer[6] = (fileSize >> 16) & 0xff;
      buffer[7] = (fileSize >> 24) & 0xff;
      
      // WAVE identifier
      buffer[8] = 0x57; buffer[9] = 0x41; buffer[10] = 0x56; buffer[11] = 0x45; // "WAVE"
      
      // fmt chunk
      buffer[12] = 0x66; buffer[13] = 0x6d; buffer[14] = 0x74; buffer[15] = 0x20; // "fmt "
      buffer[16] = 16; buffer[17] = 0; buffer[18] = 0; buffer[19] = 0; // chunk size (16)
      buffer[20] = 1; buffer[21] = 0; // audio format (1 = PCM)
      buffer[22] = 1; buffer[23] = 0; // number of channels (1)
      
      // sample rate
      buffer[24] = sampleRate & 0xff;
      buffer[25] = (sampleRate >> 8) & 0xff;
      buffer[26] = (sampleRate >> 16) & 0xff;
      buffer[27] = (sampleRate >> 24) & 0xff;
      
      // byte rate
      const byteRate = sampleRate;
      buffer[28] = byteRate & 0xff;
      buffer[29] = (byteRate >> 8) & 0xff;
      buffer[30] = (byteRate >> 16) & 0xff;
      buffer[31] = (byteRate >> 24) & 0xff;
      
      buffer[32] = 1; buffer[33] = 0; // block align (1)
      buffer[34] = 8; buffer[35] = 0; // bits per sample (8)
      
      // data chunk
      buffer[36] = 0x64; buffer[37] = 0x61; buffer[38] = 0x74; buffer[39] = 0x61; // "data"
      buffer[40] = numSamples & 0xff;
      buffer[41] = (numSamples >> 8) & 0xff;
      buffer[42] = (numSamples >> 16) & 0xff;
      buffer[43] = (numSamples >> 24) & 0xff;
      
      // generate sine wave samples sliding from 950Hz to 650Hz
      for (let i = 0; i < numSamples; i++) {
        const t = i / sampleRate;
        const freq = 950 - (t / duration) * 300;
        const sample = Math.sin(2 * Math.PI * freq * t);
        const fade = 1 - (i / numSamples);
        buffer[44 + i] = Math.floor(128 + sample * 45 * fade);
      }
      
      const blob = new Blob([buffer], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.volume = 0.20;
      audio.play().catch(e => console.warn('Audio play auto-block avoided:', e));
      
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      console.warn('Could not produce audio scan confirmation:', err);
    }
  };

  const toggleFlashlight = async () => {
    const newTorchState = !isTorchActive;
    setIsTorchActive(newTorchState);

    if (cameraStream) {
      try {
        const track = cameraStream.getVideoTracks()?.[0];
        if (track) {
          const capabilities = track.getCapabilities?.();
          if (capabilities && 'torch' in capabilities) {
            await track.applyConstraints({
              advanced: [{ torch: newTorchState }]
            });
            addToast(`Flashlight ${newTorchState ? 'enabled' : 'disabled'} successfully.`);
          } else {
            addToast(`Virtual torch ${newTorchState ? 'activated' : 'deactivated'} (physical hardware unsupported in this browser).`);
          }
        }
      } catch (err) {
        console.warn('Could not control device flashlight:', err);
        addToast(`Virtual torch ${newTorchState ? 'activated' : 'deactivated'}.`);
      }
    } else {
      addToast(`Virtual torch ${newTorchState ? 'activated' : 'deactivated'} (Scanner running in virtual bypass mode).`);
    }
  };

  const handleTestBatteryToggle = () => {
    if (batteryLevel === null || batteryLevel === 64 || batteryLevel > 50) {
      setBatteryLevel(22);
      setIsBatteryCharging(false);
      addToast('Simulating LOW battery warning (22%)');
    } else if (batteryLevel === 22) {
      setBatteryLevel(14);
      setIsBatteryCharging(false);
      addToast('Simulating CRITICAL battery level (14%) with active power warning.');
    } else if (batteryLevel === 14) {
      setBatteryLevel(92);
      setIsBatteryCharging(true);
      addToast('Simulating CHARGING battery state (92% with active power source)');
    } else {
      setBatteryLevel(64);
      setIsBatteryCharging(false);
      addToast('Simulating NORMAL battery state (64%)');
    }
  };

  const renderArchiveDownloader = () => {
    if (authPassword.length === 0) return null;

    return (
      <div className="mt-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-2.5 animate-fadeIn" id="password-archive-downloader">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            <Lock className="h-3 w-3 text-blue-600 animate-pulse" />
            <span>Credentials Archive Backup</span>
          </div>
          <span className="text-[8px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider border border-blue-100">
            AES-256-GCM
          </span>
        </div>

        {archiveDownloadState === 'idle' && (
          <div className="flex flex-col space-y-1.5">
            <p className="text-[9px] text-slate-500 leading-normal font-medium">
              Generate a local password-encrypted text backup file of your credentials using simulated military-grade AES-256 algorithms.
            </p>
            <button
              type="button"
              id="download-encrypted-archive-btn"
              onClick={handleDownloadEncryptedArchive}
              className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 rounded-xl text-xs font-semibold cursor-pointer transition shadow-sm active:scale-[0.98]"
            >
              <Download className="h-3.5 w-3.5 text-blue-600" />
              <span>Download Encrypted Archive</span>
            </button>
          </div>
        )}

        {archiveDownloadState === 'encrypting' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[9px] font-bold text-slate-500">
              <span className="flex items-center space-x-1">
                <RefreshCw className="h-3 w-3 animate-spin text-blue-600" />
                <span className="animate-pulse">{archiveStatusText}</span>
              </span>
              <span>{archiveProgress}%</span>
            </div>
            
            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all duration-300 rounded-full"
                style={{ width: `${archiveProgress}%` }}
              />
            </div>
          </div>
        )}

        {archiveDownloadState === 'completed' && (
          <div className="flex flex-col space-y-1.5">
            <div className="flex items-center space-x-1.5 text-emerald-700 bg-emerald-50 border border-emerald-200 p-2 rounded-lg text-[9px] font-bold">
              <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span>{archiveStatusText}</span>
            </div>
            <p className="text-[8px] text-slate-400 font-medium">
              File downloaded. Remember to keep this document safe and do not share it with unauthorized agents.
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderCameraScannerOverlay = () => {
    if (!isMfaScannerActive) return null;

    return (
      <div 
        id="camera-mfa-scanner-overlay"
        className="absolute inset-0 z-40 bg-slate-950/95 text-white flex flex-col p-6 animate-fadeIn"
      >
        {/* Top Branding Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white animate-pulse">
              <Camera className="h-4 w-4" />
            </div>
            <span className="text-sm font-black tracking-wide">MFA Rapid Camera Pair</span>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Battery Status Indicator Widget */}
            {batteryLevel !== null ? (
              <button
                type="button"
                id="scanner-battery-indicator"
                onClick={handleTestBatteryToggle}
                title="Click to toggle battery simulation states"
                className={`flex items-center space-x-1.5 px-2 py-1 rounded-lg border transition-all duration-200 cursor-pointer ${
                  batteryLevel <= 15 && !isBatteryCharging
                    ? 'bg-red-500/20 border-red-500/40 text-red-400 animate-pulse'
                    : batteryLevel <= 25 && !isBatteryCharging
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-400 animate-pulse'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                {isBatteryCharging ? (
                  <BatteryCharging className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <Battery className={`h-3.5 w-3.5 ${
                    batteryLevel <= 15 ? 'text-red-500' : batteryLevel <= 25 ? 'text-amber-500' : 'text-emerald-400'
                  }`} />
                )}
                <span className="text-[10px] font-bold font-mono">{batteryLevel}%</span>
              </button>
            ) : (
              <div className="flex items-center space-x-1 px-2 py-1 rounded-lg border bg-white/5 border-white/10 text-slate-400">
                <Battery className="h-3.5 w-3.5 text-slate-500 animate-pulse" />
                <span className="text-[10px] font-mono">--%</span>
              </div>
            )}

            <button
              type="button"
              id="close-camera-scanner-btn"
              onClick={() => setIsMfaScannerActive(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Low power caution warning banner */}
        {batteryLevel !== null && batteryLevel <= 25 && !isBatteryCharging && (
          <div 
            id="camera-low-power-warning-banner"
            className="mb-4 p-2.5 bg-red-950/40 border border-red-500/30 rounded-xl flex items-start space-x-2.5 animate-pulse"
          >
            <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
            <div className="text-left leading-normal">
              <p className="text-[10px] font-black uppercase text-red-300 tracking-wider">Device Battery Alert ({batteryLevel}%)</p>
              <p className="text-[9.5px] text-red-200 font-semibold leading-relaxed">
                Device battery status is low. Active camera feeds and cryptographic scanners consume significant hardware power. We recommend connecting your device to a power source to prevent premature session termination.
              </p>
            </div>
          </div>
        )}

        {/* Camera Viewfinder Viewport */}
        <div className="relative flex-grow rounded-xl bg-black border border-white/10 overflow-hidden flex flex-col items-center justify-center min-h-[220px]">
          {/* Real Video Element & Backdrop Cross-Fade */}
          <AnimatePresence mode="wait">
            {cameraStream ? (
              <motion.video
                key="camera-video-feed"
                autoPlay
                playsInline
                muted
                ref={(video) => {
                  if (video && video.srcObject !== cameraStream) {
                    video.srcObject = cameraStream;
                  }
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              /* Holographic/Simulated scanner backdrop */
              <motion.div
                key="virtual-scanner-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-b from-slate-950 via-blue-950/20 to-slate-950 flex flex-col items-center justify-center p-4"
              >
                <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.05)_1px,transparent_1px)] bg-[size:10px_10px]" />
                <div className="h-16 w-16 rounded-full border-2 border-dashed border-sky-500/40 flex items-center justify-center animate-spin mb-3">
                  <RefreshCw className="h-6 w-6 text-sky-400/80" />
                </div>
                <p className="text-[10px] font-bold text-sky-400 uppercase tracking-widest text-center animate-pulse">
                  Establishing Virtual Video Ingress...
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Depth Detection Mode Selector */}
          <div className="absolute top-3 left-3 z-20 flex bg-slate-900/80 backdrop-blur-md rounded-lg border border-white/10 p-0.5" id="depth-mode-selector">
            <button
              type="button"
              id="depth-mode-standard-btn"
              onClick={() => setDepthDetectionMode('Standard')}
              className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                depthDetectionMode === 'Standard'
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-[0_0_8px_rgba(16,185,129,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Standard
            </button>
            <button
              type="button"
              id="depth-mode-lidar-btn"
              onClick={() => setDepthDetectionMode('Lidar')}
              className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center space-x-1 ${
                depthDetectionMode === 'Lidar'
                  ? 'bg-rose-500 text-white font-black shadow-[0_0_8px_rgba(244,63,94,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>LiDAR</span>
              {depthDetectionMode === 'Lidar' && <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />}
            </button>
          </div>

          {/* Torch/Flashlight Toggle Trigger */}
          <button
            type="button"
            id="flashlight-toggle-btn"
            onClick={toggleFlashlight}
            className={`absolute top-3 right-3 z-20 p-2.5 rounded-full backdrop-blur-md transition-all duration-200 border cursor-pointer ${
              isTorchActive 
                ? 'bg-amber-400 border-amber-300 text-slate-950 shadow-[0_0_12px_rgba(251,191,36,0.6)]' 
                : 'bg-slate-900/80 hover:bg-slate-900 border-white/10 text-white'
            }`}
            title="Toggle Flashlight / Torch"
          >
            {isTorchActive ? <Zap className="h-4 w-4 fill-amber-400 stroke-slate-950" /> : <ZapOff className="h-4 w-4 text-slate-400" />}
          </button>

          {/* Simulated flashlight beam / brightness overlay */}
          {isTorchActive && (
            <div 
              id="simulated-torch-overlay"
              className="absolute inset-0 z-10 bg-white/10 pointer-events-none mix-blend-color-dodge transition-all duration-300 shadow-[inset_0_0_100px_rgba(253,224,71,0.2)] animate-pulse" 
            />
          )}

          {/* Simulated Lidar Heat-Map Overlay Layer */}
          <AnimatePresence>
            {depthDetectionMode === 'Lidar' && !scannerSuccess && (
              <motion.div
                key="lidar-heatmap-overlay"
                id="lidar-heatmap-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.35 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 z-10 pointer-events-none overflow-hidden mix-blend-screen"
              >
                {/* A rich high-tech heat-map gradient mesh */}
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/40 via-emerald-500/25 to-rose-500/45 animate-pulse duration-[3000ms]" />
                {/* Animated circular pulses representing Lidar ranging scans */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.3)_0%,rgba(245,158,11,0.18)_30%,rgba(16,185,129,0.06)_60%,transparent_100%)] animate-ping duration-[4000ms]" />
                {/* Fine high-density laser point cloud grid */}
                <div className="absolute inset-0 bg-[radial-gradient(rgba(244,63,94,0.35)_1.5px,transparent_1.5px)] [background-size:14px_14px] opacity-90" />
                {/* Rotating scanner ring radar sweeps */}
                <motion.div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-rose-500/35"
                  animate={{ scale: [0.9, 1.3, 0.9], opacity: [0.25, 0.65, 0.25] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Viewfinder Overlay Frame */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 z-10 pointer-events-none">
            {/* Corner brackets with dynamic LiDAR theme shift */}
            <div className={`absolute top-8 left-8 w-6 h-6 border-t-2 border-l-2 rounded-tl transition-colors duration-300 ${depthDetectionMode === 'Lidar' ? 'border-rose-500' : 'border-emerald-500'}`} />
            <div className={`absolute top-8 right-8 w-6 h-6 border-t-2 border-r-2 rounded-tr transition-colors duration-300 ${depthDetectionMode === 'Lidar' ? 'border-rose-500' : 'border-emerald-500'}`} />
            <div className={`absolute bottom-8 left-8 w-6 h-6 border-b-2 border-l-2 rounded-bl transition-colors duration-300 ${depthDetectionMode === 'Lidar' ? 'border-rose-500' : 'border-emerald-500'}`} />
            <div className={`absolute bottom-8 right-8 w-6 h-6 border-b-2 border-r-2 rounded-br transition-colors duration-300 ${depthDetectionMode === 'Lidar' ? 'border-rose-500' : 'border-emerald-500'}`} />

            {/* Scanning Laser Line with dynamic LiDAR theme shift */}
            {!scannerSuccess && (
              <motion.div 
                className={`absolute left-6 right-6 h-[2px] transition-all duration-300 ${
                  depthDetectionMode === 'Lidar' 
                    ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e,0_0_15px_#e11d48]' 
                    : 'bg-emerald-500 shadow-[0_0_8px_#10b981,0_0_15px_#059669]'
                }`}
                animate={{
                  top: ['40px', '200px', '40px']
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            )}

            {/* Centered Auto-Focus Target Reticle with depth detection indicator, dynamic LiDAR theme shift and smooth progress ring */}
            <div 
              id="camera-autofocus-reticle"
              className={`absolute flex flex-col items-center justify-center pointer-events-none transition-all duration-[1000ms] ease-out ${
                scannerSuccess 
                  ? 'scale-[2.4] opacity-0 blur-[2px]' 
                  : 'animate-reticle-pulse'
              }`}
            >
              {/* SVG Progress Ring */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <svg className="w-28 h-28 transform -rotate-90">
                  {/* Background track */}
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    className="stroke-white/5"
                    strokeWidth="3.5"
                    fill="transparent"
                  />
                  {/* Glowing animated progress line */}
                  <motion.circle
                    cx="56"
                    cy="56"
                    r="48"
                    className={`transition-colors duration-300 ${
                      depthDetectionMode === 'Lidar' ? 'stroke-rose-500' : 'stroke-emerald-400'
                    }`}
                    strokeWidth="3.5"
                    fill="transparent"
                    strokeDasharray="301.6"
                    strokeDashoffset={301.6 - (301.6 * scanProgress) / 100}
                    strokeLinecap="round"
                    style={{
                      filter: depthDetectionMode === 'Lidar' 
                        ? 'drop-shadow(0 0 6px rgba(244, 63, 94, 0.75))' 
                        : 'drop-shadow(0 0 6px rgba(52, 211, 153, 0.75))'
                    }}
                  />
                </svg>
              </div>

              {/* Outer focal ring */}
              <div className={`relative h-20 w-20 rounded-full border border-dashed flex items-center justify-center transition-colors duration-300 ${
                depthDetectionMode === 'Lidar' ? 'border-rose-400/75' : 'border-emerald-400/75'
              }`}>
                {/* Center focus QR code scanner icon button */}
                <div className={`h-11 w-11 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg border backdrop-blur-md ${
                  depthDetectionMode === 'Lidar' 
                    ? 'bg-rose-950/65 border-rose-500/40 text-rose-300 shadow-rose-500/30' 
                    : 'bg-emerald-950/65 border-emerald-500/40 text-emerald-300 shadow-emerald-500/30'
                }`}>
                  <QrCode className="h-5 w-5 animate-pulse" />
                </div>
                
                {/* Focus grid indicators */}
                <div className={`absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-0.5 transition-colors duration-300 ${depthDetectionMode === 'Lidar' ? 'bg-rose-400' : 'bg-emerald-400'}`} />
                <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-0.5 transition-colors duration-300 ${depthDetectionMode === 'Lidar' ? 'bg-rose-400' : 'bg-emerald-400'}`} />
                <div className={`absolute top-1/2 -left-1 -translate-y-1/2 w-0.5 h-3 transition-colors duration-300 ${depthDetectionMode === 'Lidar' ? 'bg-rose-400' : 'bg-emerald-400'}`} />
                <div className={`absolute top-1/2 -right-1 -translate-y-1/2 w-0.5 h-3 transition-colors duration-300 ${depthDetectionMode === 'Lidar' ? 'bg-rose-400' : 'bg-emerald-400'}`} />
              </div>
              
              {/* Depth Detection Status Badge */}
              <div className={`mt-2.5 flex items-center space-x-1.5 backdrop-blur border px-2.5 py-1 rounded-full shadow-lg transition-all duration-300 ${
                depthDetectionMode === 'Lidar' 
                  ? 'bg-rose-950/80 border-rose-500/30' 
                  : 'bg-slate-950/85 border-emerald-500/30'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full animate-ping ${
                  depthDetectionMode === 'Lidar' ? 'bg-rose-400' : 'bg-emerald-400'
                }`} />
                <span className={`text-[8px] font-black tracking-widest uppercase font-mono transition-colors duration-300 ${
                  depthDetectionMode === 'Lidar' ? 'text-rose-400' : 'text-emerald-400'
                }`}>
                  {depthDetectionMode === 'Lidar' ? 'LIDAR DEPTH DETECTION ACTIVE' : 'DEPTH READY • AF-S'}
                </span>
              </div>
            </div>

            {/* Success feedback overlay */}
            {scannerSuccess ? (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-emerald-500/90 text-white p-4 rounded-xl flex flex-col items-center space-y-2 border border-emerald-400 backdrop-blur-sm"
              >
                <div className="h-10 w-10 rounded-full bg-white text-emerald-600 flex items-center justify-center">
                  <Check className="h-6 w-6 stroke-[3]" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest">Pairing Success</span>
                <span className="text-[9px] text-emerald-100 font-medium">Secure Node Bound</span>
              </motion.div>
            ) : (
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <span className="bg-slate-900/80 border border-white/10 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider text-slate-300">
                  Align MFA QR code inside frame
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Stats / Simulation info */}
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
            <span className="flex items-center space-x-1.5">
              {cameraStream ? (
                <Video className="h-3 w-3 text-emerald-400 animate-pulse" />
              ) : (
                <VideoOff className="h-3 w-3 text-amber-400" />
              )}
              <span>Camera Status: {cameraStream ? 'WEB_STREAM_ACTIVE' : 'VIRTUAL_BYPASS'}</span>
            </span>
            {!scannerSuccess && (
              <span className="animate-pulse text-blue-400 uppercase tracking-widest text-[9px]">
                Scanning in {scannerCountdown}s...
              </span>
            )}
          </div>

          {cameraError && (
            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-left">
              <p className="text-[9px] text-amber-400 leading-normal font-semibold">
                ⚠️ {cameraError}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsMfaScannerActive(false)}
              className="py-2 bg-white/10 hover:bg-white/15 text-white font-bold rounded-xl text-xs transition cursor-pointer"
            >
              Cancel Scan
            </button>
            <button
              type="button"
              disabled={scannerSuccess}
              onClick={() => {
                playBlipSound();
                // Instantly trigger successful pairing
                setScannerSuccess(true);
                const pairingCode = Math.floor(100000 + Math.random() * 900000).toString();
                setOtpCode(pairingCode);
                addToast(`Manual pairing triggered. Token ${pairingCode} auto-filled.`);
                setIsMfaScannerActive(false);
              }}
              className="py-2 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-wider rounded-xl text-xs transition cursor-pointer disabled:opacity-50"
            >
              Manual Bypass
            </button>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (mfaCooldown > 0) {
      const timer = setTimeout(() => {
        setMfaCooldown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [mfaCooldown]);

  useEffect(() => {
    let activeStream: any = null;
    let timer: any = null;
    let countdownInterval: any = null;
    let progressInterval: any = null;

    if (isMfaScannerActive) {
      setScannerSuccess(false);
      setScannerCountdown(3);
      setCameraError(null);
      setScanProgress(0);

      // Try to open camera
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
        .then(stream => {
          activeStream = stream;
          setCameraStream(stream);
          addToast('Webcam feed initiated. Point your camera at the MFA pairing QR code.');
        })
        .catch(err => {
          console.warn('Camera error, using virtual simulator', err);
          setCameraError('Webcam blocked or unavailable in container frame. Running virtual bypass scan...');
          addToast('Webcam unavailable. Initializing high-precision virtual scanner...');
        });

      // Countdown for simulated pairing detection
      countdownInterval = setInterval(() => {
        setScannerCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Smooth progress calculation over 3.5 seconds (3500ms)
      const startTime = Date.now();
      progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(100, (elapsed / 3500) * 100);
        setScanProgress(progress);
        if (elapsed >= 3500) {
          clearInterval(progressInterval);
        }
      }, 30);

      // Scanning complete simulation at 3.5 seconds
      timer = setTimeout(() => {
        playBlipSound();
        setScannerSuccess(true);
        const pairingCode = Math.floor(100000 + Math.random() * 900000).toString();
        setOtpCode(pairingCode);
        addToast(`MFA paired successfully via QR Code scan! Token ${pairingCode} auto-filled.`);
        
        // Stop camera tracks
        if (activeStream) {
          activeStream.getTracks().forEach((track: any) => track.stop());
        }
        setCameraStream(null);

        // Turn off scanner after a brief success display delay
        setTimeout(() => {
          setIsMfaScannerActive(false);
          setScannerSuccess(false);
          setIsTorchActive(false);
        }, 1500);
      }, 3500);
    } else {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track: any) => track.stop());
      }
      setCameraStream(null);
      setIsTorchActive(false);
      setScanProgress(0);
    }

    return () => {
      if (timer) clearTimeout(timer);
      if (countdownInterval) clearInterval(countdownInterval);
      if (progressInterval) clearInterval(progressInterval);
      if (activeStream) {
        activeStream.getTracks().forEach((track: any) => track.stop());
      }
      setIsTorchActive(false);
      setScanProgress(0);
    };
  }, [isMfaScannerActive]);

  useEffect(() => {
    let batteryObj: any = null;

    const updateBatteryInfo = (battery: any) => {
      setBatteryLevel(Math.round(battery.level * 100));
      setIsBatteryCharging(battery.charging);
    };

    if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
      (navigator as any).getBattery()
        .then((battery: any) => {
          batteryObj = battery;
          updateBatteryInfo(battery);

          const onLevelChange = () => updateBatteryInfo(battery);
          const onChargingChange = () => updateBatteryInfo(battery);

          battery.addEventListener('levelchange', onLevelChange);
          battery.addEventListener('chargingchange', onChargingChange);

          // Return cleanup references inside the outer scope
          (batteryObj as any)._cleanup = () => {
            battery.removeEventListener('levelchange', onLevelChange);
            battery.removeEventListener('chargingchange', onChargingChange);
          };
        })
        .catch((err: any) => {
          console.warn('Battery status API blocked or unsupported:', err);
          setBatteryLevel(64); // Realistic fallback state
          setIsBatteryCharging(false);
        });
    } else {
      setBatteryLevel(64); // Realistic fallback state
      setIsBatteryCharging(false);
    }

    return () => {
      if (batteryObj && batteryObj._cleanup) {
        batteryObj._cleanup();
      }
    };
  }, []);

  const [shouldShake, setShouldShake] = useState(false);

  const triggerShake = () => {
    setShouldShake(true);
    setTimeout(() => setShouldShake(false), 500);
  };

  // Floating notifications
  const [notifications, setNotifications] = useState<any[]>([]);

  // Toggle theme class on document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Simulate notification stream
  useEffect(() => {
    const alerts = [
      { id: 1, message: "AI Sourcing node: Optimal candidate matched for React Role." },
      { id: 2, message: "Global Payroll compliance audit completed for Japan EOR." }
    ];
    let counter = 0;
    const interval = setInterval(() => {
      if (counter < alerts.length) {
        addToast(alerts[counter].message);
        counter++;
      }
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const renderPasswordRequirements = (passwordStr: string) => {
    const isAtLeast12Chars = passwordStr.length >= 12;
    const hasNumber = /[0-9]/.test(passwordStr);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(passwordStr);

    return (
      <AnimatePresence>
        {passwordFocused && (
          <motion.div
            id="password-requirements-list"
            initial={{ opacity: 0, y: 15, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: 15, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="mt-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-[10px] space-y-1.5">
              <p className="font-bold text-slate-500 uppercase tracking-widest text-[8px] mb-1">
                Password Security Requirements:
              </p>
              <div className="flex items-center space-x-2">
                <div className={`h-2 w-2 rounded-full transition-colors duration-200 ${isAtLeast12Chars ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                <span className={`font-semibold transition-colors duration-200 ${isAtLeast12Chars ? 'text-emerald-700 font-bold' : 'text-slate-500'}`}>
                  Minimum 12 characters {isAtLeast12Chars && '✓'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`h-2 w-2 rounded-full transition-colors duration-200 ${hasNumber ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                <span className={`font-semibold transition-colors duration-200 ${hasNumber ? 'text-emerald-700 font-bold' : 'text-slate-500'}`}>
                  At least 1 number {hasNumber && '✓'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`h-2 w-2 rounded-full transition-colors duration-200 ${hasSpecialChar ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                <span className={`font-semibold transition-colors duration-200 ${hasSpecialChar ? 'text-emerald-700 font-bold' : 'text-slate-500'}`}>
                  At least 1 special character {hasSpecialChar && '✓'}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  const addToast = (msg: string) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, msg }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  // Auth handlers
  const handleSocialSignIn = async (provider: 'google' | 'github') => {
    if (provider !== 'google') {
      setAuthError('GitHub sign-in is not configured yet. Please continue with Google or email.');
      return;
    }

    setAuthLoading(true);
    setAuthError('');
    addToast('Redirecting to Google securely...');
    const { error } = await signInWithGoogle();
    if (error) {
      setAuthError(error.message);
      setAuthLoading(false);
      triggerShake();
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    
    // Simple validation rules
    if (!authEmail.includes('@')) {
      setAuthError('Please enter a valid executive email address.');
      triggerShake();
      return;
    }
    if (authMode !== 'forgot' && authPassword.length < 6) {
      setAuthError('Password must contain at least 6 characters.');
      triggerShake();
      return;
    }

    setAuthLoading(true);
    try {
      if (authMode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(authEmail, {
          redirectTo: window.location.origin,
        });
        if (error) throw error;
        setIsForgotSubmitted(true);
        setAuthSuccess('Password reset link sent to your registered email.');
      } else if (authMode === 'signin') {
        const { data, error } = await signInWithEmail(authEmail, authPassword);
        if (error) throw error;
        if (data.user) {
          setIsLoggedIn(true);
          setAuthSuccess('Login successful. Loading your workspace...');
          addToast('Signed in successfully.');
          setTimeout(() => setIsAuthModalOpen(false), 700);
        }
      } else if (authMode === 'signup') {
        if (!authName.trim()) {
          setAuthError('Please enter your full name.');
          triggerShake();
          return;
        }
        const { data, error } = await signUpWithEmail(authEmail, authPassword, {
          full_name: authName.trim(),
          role: authRole,
        });
        if (error) throw error;
        if (data.session) {
          setIsLoggedIn(true);
          setAuthSuccess('Account created and signed in successfully.');
          setTimeout(() => setIsAuthModalOpen(false), 700);
        } else {
          setAuthSuccess('Account created. Check your email to confirm your address, then sign in.');
          setAuthMode('signin');
        }
      }
    } catch (error: any) {
      setAuthError(error.message || 'Authentication failed. Please try again.');
      triggerShake();
    } finally {
      setAuthLoading(false);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
      setAuthError('Please enter a valid 6-digit confirmation code.');
      triggerShake();
      return;
    }
    setAuthLoading(true);
    setTimeout(() => {
      setAuthLoading(false);
      setIsLoggedIn(true);
      setAuthSuccess('Multi-factor verification secure. Session locked.');
      addToast('MFA validation complete. Session locked.');
      setTimeout(() => setIsAuthModalOpen(false), 1500);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 transition-colors duration-200">
      
      {/* Dynamic Toasts / Alerts list */}
      <div className="fixed bottom-5 right-5 z-50 space-y-2 pointer-events-none max-w-sm">
        {notifications.map(n => (
          <div 
            key={n.id} 
            className="p-4 rounded-xl bg-slate-900 text-white shadow-lg flex items-center space-x-2 animate-bounce pointer-events-auto border border-slate-800"
          >
            <Sparkles className="h-4 w-4 text-sky-400 shrink-0" />
            <span className="text-xs font-bold leading-normal">{n.msg}</span>
            <button onClick={() => setNotifications(prev => prev.filter(x => x.id !== n.id))} className="text-slate-400 hover:text-white cursor-pointer">
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>

      {/* Primary Navigation */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onLoginClick={() => {
          setActiveTab('login');
        }}
        isLoggedIn={isLoggedIn}
        onLogout={() => {
          setIsLoggedIn(false);
          setActiveTab('login');
          addToast('Platform session closed safely.');
        }}
      />

      {/* Main Viewport Router */}
      <main className="flex-grow">
        
        {/* 404 SCREEN VIEW */}
        {activeTab === '404' && (
          <div className="mx-auto max-w-md text-center py-24 px-4 space-y-4" id="view-404">
            <h1 className="text-6xl font-black text-slate-300">404</h1>
            <h2 className="text-xl font-bold text-slate-900">Dimensional Match Missing</h2>
            <p className="text-sm text-slate-500">The occupational query parameter or workspace layout you are looking for is unseeded or expired.</p>
            <button onClick={() => setActiveTab('landing')} className="inline-block rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-blue-750 transition cursor-pointer">
              Return Home
            </button>
          </div>
        )}

        {/* 500 SCREEN VIEW */}
        {activeTab === '500' && (
          <div className="mx-auto max-w-md text-center py-24 px-4 space-y-4" id="view-500">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 mb-2">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h1 className="text-4xl font-black text-slate-900">500 Server Core Fault</h1>
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest">High-Dimensional Alignment Timeout</h2>
            <p className="text-sm text-slate-500">Our neural matching grid took too long compiling localized tax rules. Try reloading the active workspace parameters.</p>
            <button onClick={() => setActiveTab('gig-marketplace')} className="inline-block rounded-xl bg-slate-900 px-6 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition cursor-pointer">
              Reset Portal
            </button>
          </div>
        )}

        <AnimatePresence mode="wait">
          {!isLoggedIn ? (
            <motion.div
              key="login-page-key"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <LoginPage 
                setIsLoggedIn={setIsLoggedIn} 
                setActiveTab={setActiveTab} 
                addToast={addToast} 
              />
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              {activeTab === 'landing' && (
                <LandingPage 
                  setActiveTab={setActiveTab} 
                  setSearchQuery={setSearchQuery} 
                />
              )}

              {activeTab === 'dashboard' && (
                <Dashboard 
                  searchQuery={searchQuery} 
                  setSearchQuery={setSearchQuery}
                  isDarkMode={isDarkMode}
                />
              )}

              {activeTab === 'gig-marketplace' && (
                <GigMarketplace />
              )}

              {activeTab === 'workers' && <WorkersPage />}

              {activeTab === 'employers' && <EmployersPage />}

              {activeTab === 'job-owner' && <JobOwnerPage />}

              {activeTab === 'admin' && <AdminPage />}

              {activeTab === 'profile' && <ProfilePage />}

              {activeTab === 'seo' && <SeoPage />}

              {activeTab === 'about' && <AboutPage />}

              {activeTab === 'symposium' && <SymposiumSlides />}

              {activeTab === 'login' && (
                <LoginPage 
                  setIsLoggedIn={setIsLoggedIn} 
                  setActiveTab={setActiveTab} 
                  addToast={addToast} 
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* Testing Utilities for 404/500 requirements (discreet line inside footer zone) */}
      <div className="bg-slate-50 border-t border-slate-150 py-3 text-center text-[10px] text-slate-400 flex items-center justify-center space-x-4">
        <span>Platform Layout Testing:</span>
        <button onClick={() => setActiveTab('404')} className="hover:underline hover:text-slate-650 font-semibold cursor-pointer">Test 404 Screen</button>
        <span>•</span>
        <button onClick={() => setActiveTab('500')} className="hover:underline hover:text-slate-650 font-semibold cursor-pointer">Test 500 Core Error</button>
        <span>•</span>
        <button onClick={() => {
          setIsLoggedIn(false);
          setAuthMode('signin');
          setIsAuthModalOpen(true);
        }} className="hover:underline hover:text-slate-650 font-semibold cursor-pointer">Test Auth modal</button>
      </div>

      <Footer setActiveTab={setActiveTab} />

      {/* AUTHENTICATION MODAL DIALOG OVERLAY */}
      {false && isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" id="auth-modal-overlay">
          <div className={`relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl overflow-hidden ${shouldShake ? 'animate-shake' : ''}`} id="auth-modal-content">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-sky-400" />
            
            {renderCameraScannerOverlay()}
            
            {/* Close Button */}
            <button 
              id="auth-close-btn"
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-700 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header branding */}
            <div className="flex items-center space-x-2 mb-6">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Brain className="h-4.5 w-4.5" />
              </div>
              <span className="text-lg font-black text-slate-900">WorkNear Port</span>
            </div>

            {passwordAge > 80 && (
              <div 
                id="password-age-warning-banner"
                className="mb-5 p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start space-x-2.5 shadow-sm text-xs animate-fadeIn"
              >
                <div className="p-1 rounded-lg bg-amber-100 text-amber-800 shrink-0 mt-0.5">
                  <ShieldAlert className="h-4 w-4" />
                </div>
                <div className="flex-grow text-left">
                  <h4 className="font-extrabold text-amber-900 text-xs">Password Rotation Required</h4>
                  <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed font-medium">
                    Your enterprise credential age is <strong className="font-extrabold">{passwordAge} days old</strong>, exceeding the recommended 80-day secure threshold.
                  </p>
                  <div className="mt-2 flex">
                    <button 
                      type="button"
                      onClick={() => {
                        setAuthMode('forgot');
                        addToast('Initiated password change process. Please provide your corporate email.');
                      }}
                      className="text-[11px] font-black text-blue-700 hover:text-blue-900 underline underline-offset-2 hover:no-underline cursor-pointer transition-colors"
                    >
                      Initiate password change process →
                    </button>
                  </div>
                </div>
              </div>
            )}

            <AnimatePresence mode="wait">
              {authMode === 'signin' && !socialAuthConnecting && (
                <motion.form
                  key="signin"
                  onSubmit={handleAuthSubmit}
                  className="space-y-4 text-left"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                  <div className="text-left mb-4">
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                      Access Enterprise Command
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Access your matched shortlists and global payroll ledgers.
                    </p>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Corporate Email</label>
                    <input
                      id="auth-email-field"
                      type="email"
                      placeholder="recruiter@company.com"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 font-semibold"
                    />
                  </div>

                  {(() => {
                    const strength = computePasswordStrength(authPassword);
                    return (
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Password</label>
                        <div className="relative">
                          <input
                            id="auth-password-field"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            value={authPassword}
                            onChange={(e) => setAuthPassword(e.target.value)}
                            onFocus={() => setPasswordFocused(true)}
                            onBlur={() => setPasswordFocused(false)}
                            required
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-18 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 font-semibold"
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1.5">
                            <button
                              type="button"
                              title="Generate Secure Password"
                              id="auth-modal-btn-generate-pass"
                              onClick={() => {
                                const securePass = generateSecurePassword();
                                setAuthPassword(securePass);
                                setShowPassword(true);
                                addToast('Secure high-entropy password generated and set.');
                              }}
                              className="text-blue-600 hover:text-blue-800 cursor-pointer p-0.5 rounded hover:bg-slate-100 transition"
                            >
                              <Sparkles className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              id="auth-btn-toggle-pass"
                              onMouseDown={handleRevealPressStart}
                              onMouseUp={handleRevealPressEnd}
                              onMouseLeave={handleRevealPressEnd}
                              onTouchStart={handleRevealPressStart}
                              onTouchEnd={handleRevealPressEnd}
                              onTouchCancel={handleRevealPressEnd}
                              onClick={handleRevealClick}
                              title="Tap to toggle persistently, or press & hold for mobile-extended peek"
                              className={`cursor-pointer p-1 rounded-lg transition-all duration-200 ${
                                showPassword 
                                  ? 'text-blue-600 bg-blue-50 border border-blue-100 hover:bg-blue-100/50' 
                                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                              } ${isPressingReveal ? 'scale-90 ring-2 ring-blue-500/20' : ''}`}
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>

                          {/* Integrated Visual Progress Bar */}
                          {authPassword.length > 0 && (
                            <div className="absolute bottom-[2px] left-[10px] right-[10px] h-1 overflow-hidden rounded-full bg-slate-100" id="auth-modal-password-progress">
                              <div 
                                className={`h-full ${strength.colorClass} transition-all duration-300`} 
                                style={{ width: `${(strength.score / 5) * 100}%` }}
                              />
                            </div>
                          )}
                        </div>

                        {renderPasswordRequirements(authPassword)}

                        {/* Live Mobile Peek Hold Visual Countdown & Mobile Accessibility Buffer Config */}
                        <div className="mt-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-left" id="accessibility-peek-config-modal">
                          <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-wider text-slate-500">
                            <span className="flex items-center space-x-1">
                              <Key className="h-3 w-3 text-blue-600 animate-pulse" />
                              <span>Mobile Extended Peek Buffer</span>
                            </span>
                            {holdCountdown !== null ? (
                              <span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded text-[8px] font-black animate-pulse">
                                Hiding in {holdCountdown}s
                              </span>
                            ) : (
                              <span className="text-[8px] text-slate-400 font-bold">
                                {showPassword ? 'Persistent' : 'Hidden'}
                              </span>
                            )}
                          </div>

                          {/* Countdown progress bar */}
                          {holdCountdown !== null && (
                            <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden" id="peek-countdown-progress-modal">
                              <div 
                                className="h-full bg-amber-500 transition-all duration-1000"
                                style={{ width: `${(holdCountdown / holdReleaseBuffer) * 100}%` }}
                              />
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-1 border-t border-slate-200/50">
                            <span className="text-[9px] font-medium text-slate-500">Hold Duration Buffer:</span>
                            <div className="flex space-x-1">
                              {[3, 5, 10, 15].map((secs) => (
                                <button
                                  key={secs}
                                  type="button"
                                  onClick={() => {
                                    setHoldReleaseBuffer(secs);
                                    addToast(`Extended hold-peek buffer adjusted to ${secs}s.`);
                                  }}
                                  className={`px-1.5 py-0.5 rounded text-[8px] font-bold border transition cursor-pointer ${
                                    holdReleaseBuffer === secs 
                                      ? 'bg-blue-600 border-blue-600 text-white font-extrabold shadow-sm' 
                                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100'
                                  }`}
                                >
                                  {secs}s
                                </button>
                              ))}
                            </div>
                          </div>
                          <p className="text-[8px] leading-relaxed text-slate-450 font-medium">
                            * Tap to toggle indefinitely. Press & hold to peek; when released, the password remains visible for the selected buffer to assist screen readers and users with hand motor limits.
                          </p>
                        </div>

                        {authPassword.length > 0 && strength.warning && (
                          <div className="mt-2 p-2.5 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-start space-x-2 text-[10px] font-bold" id="auth-modal-password-warning">
                            <ShieldAlert className="h-3.5 w-3.5 shrink-0 mt-0.5 text-red-600" />
                            <div className="text-left">
                              <span className="block font-black text-red-800">Security Warning</span>
                              <span>{strength.warning} Avoid sequential characters or common phrases.</span>
                            </div>
                          </div>
                        )}
                        
                        {authPassword.length > 0 && (
                          <motion.div 
                            className={`mt-2.5 space-y-1.5 p-3 rounded-2xl bg-white border transition-all duration-300 ${
                              strength.score >= 5 
                                ? 'border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.15)]' 
                                : 'border-slate-100 shadow-sm'
                            }`}
                            id="password-strength-container"
                            animate={strength.score >= 5 ? {
                              scale: [1, 1.015, 1],
                              borderColor: ["rgba(16, 185, 129, 0.4)", "rgba(16, 185, 129, 0.8)", "rgba(16, 185, 129, 0.4)"],
                              boxShadow: [
                                "0 0 12px rgba(16,185,129,0.15)",
                                "0 0 18px rgba(16,185,129,0.3)",
                                "0 0 12px rgba(16,185,129,0.15)"
                              ]
                            } : {}}
                            transition={strength.score >= 5 ? {
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            } : {}}
                          >
                            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                              <span className="text-slate-400">Credentials Rating</span>
                              <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold tracking-widest ${strength.textColorClass} ${strength.bgColorClass} border border-current/10`}>
                                {strength.label}
                              </span>
                            </div>
                            
                            {/* 3-Segment Progress bar */}
                            <div className="grid grid-cols-3 gap-1.5 h-1.5 w-full">
                              <div 
                                id="strength-bar-1"
                                className={`h-full rounded-full transition-all duration-300 ${
                                  strength.score >= 1 ? strength.colorClass : 'bg-slate-100 border border-slate-200'
                                }`} 
                              />
                              <div 
                                id="strength-bar-2"
                                className={`h-full rounded-full transition-all duration-300 ${
                                  strength.score >= 3 ? strength.colorClass : 'bg-slate-100 border border-slate-200'
                                }`} 
                              />
                              <div 
                                id="strength-bar-3"
                                className={`h-full rounded-full transition-all duration-300 ${
                                  strength.score >= 5 ? strength.colorClass : 'bg-slate-100 border border-slate-200'
                                }`} 
                              />
                            </div>

                            <p id="password-strength-tips" className="text-[10px] text-slate-500 leading-normal font-semibold">
                              {strength.tips}
                            </p>
                          </motion.div>
                        )}

                        {authPassword.length > 0 && (
                          <motion.div 
                            className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 mt-2 text-left" 
                            id="password-modal-compliance-indicator"
                            animate={passwordAge >= 85 ? {
                              opacity: [1, 0.5, 1],
                              borderColor: ["#e2e8f0", "#fda4af", "#e2e8f0"]
                            } : {
                              opacity: 1,
                              borderColor: "#e2e8f0"
                            }}
                            transition={passwordAge >= 85 ? {
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            } : {}}
                          >
                            <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-wider">
                              <span className="text-slate-500 flex items-center space-x-1">
                                <Shield className="h-3 w-3 text-teal-600" />
                                <span>Enterprise Rotation Compliance</span>
                              </span>
                              <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${
                                passwordAge <= 70 
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                  : passwordAge <= 85
                                  ? 'bg-amber-50 text-amber-700 border border-amber-100'
                                  : 'bg-rose-50 text-rose-700 border border-rose-100 animate-pulse'
                              }`}>
                                {passwordAge <= 70 ? 'Compliant' : passwordAge <= 85 ? 'Rotation Warning' : 'Policy Expired'}
                              </span>
                            </div>

                            {/* Progress Bar showing 90-day cycle */}
                            <div className="space-y-1">
                              <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full transition-all duration-500 ${
                                    passwordAge <= 70 ? 'bg-emerald-500' : passwordAge <= 85 ? 'bg-amber-500' : 'bg-rose-500 animate-pulse'
                                  }`}
                                  style={{ width: `${Math.min(100, (passwordAge / 90) * 100)}%` }}
                                />
                              </div>
                              <div className="flex justify-between text-[8px] text-slate-400 font-bold">
                                <span>0 Days (New Key)</span>
                                <span>90-Day SOC2 Max Limit</span>
                              </div>
                            </div>

                            {/* Interactive SVG compliance curve chart */}
                            {(() => {
                              const cappedAge = Math.min(90, Math.max(0, passwordAge));
                              let x = 10;
                              let y = 45;
                              if (cappedAge <= 70) {
                                x = 10 + (cappedAge / 70) * 180;
                                y = 45 - (cappedAge / 70) * 15;
                              } else if (cappedAge <= 85) {
                                x = 190 + ((cappedAge - 70) / 15) * 55;
                                y = 30 - ((cappedAge - 70) / 15) * 15;
                              } else {
                                x = 245 + ((cappedAge - 85) / 5) * 45;
                                y = 15 - ((cappedAge - 85) / 5) * 10;
                              }

                              return (
                                <div className="mt-2" id="password-compliance-modal-svg-chart">
                                  <svg viewBox="0 0 300 65" className="w-full bg-slate-900/5 rounded-xl p-1.5 border border-slate-200/50">
                                    <defs>
                                      <linearGradient id="chart-area-grad-modal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.12" />
                                        <stop offset="60%" stopColor="#eab308" stopOpacity="0.08" />
                                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.01" />
                                      </linearGradient>
                                      <linearGradient id="line-grad-modal" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#10b981" />
                                        <stop offset="75%" stopColor="#eab308" />
                                        <stop offset="100%" stopColor="#f43f5e" />
                                      </linearGradient>
                                    </defs>

                                    {/* Grid and threshold background markers */}
                                    <line x1="190" y1="5" x2="190" y2="48" stroke="#cbd5e1" strokeDasharray="2 2" strokeWidth="1" />
                                    <line x1="245" y1="5" x2="245" y2="48" stroke="#fecdd3" strokeDasharray="2 2" strokeWidth="1" />
                                    
                                    <text x="190" y="56" textAnchor="middle" className="text-[7px] font-bold fill-slate-400">Day 70</text>
                                    <text x="245" y="56" textAnchor="middle" className="text-[7px] font-bold fill-rose-400 animate-pulse">Day 85</text>

                                    {/* Shaded projection area under path */}
                                    <motion.path 
                                      key={`area-${passwordAge}`}
                                      d="M 10 45 L 190 30 L 245 15 L 290 5 L 290 48 L 10 48 Z" 
                                      fill="url(#chart-area-grad-modal)" 
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      transition={{ duration: 0.8 }}
                                    />

                                    {/* Trend / age curve line */}
                                    <motion.path 
                                      key={`line-${passwordAge}`}
                                      d="M 10 45 L 190 30 L 245 15 L 290 5" 
                                      fill="none" 
                                      stroke="url(#line-grad-modal)" 
                                      strokeWidth="1.75" 
                                      strokeLinecap="round" 
                                      strokeLinejoin="round"
                                      initial={{ pathLength: 0 }}
                                      animate={{ pathLength: 1 }}
                                      transition={{ duration: 1.2, ease: "easeOut" }}
                                    />

                                    {/* Landmark node dots */}
                                    <circle cx="10" cy="45" r="2.5" className="fill-emerald-500 stroke-white stroke-1" />
                                    <circle cx="190" cy="30" r="2.5" className="fill-amber-500 stroke-white stroke-1" />
                                    <circle cx="245" cy="15" r="2.5" className="fill-rose-500 stroke-white stroke-1" />
                                    <circle cx="290" cy="5" r="2.5" className="fill-rose-600 stroke-white stroke-1" />

                                    {/* Tracker position cursor */}
                                    <g>
                                      <motion.circle 
                                        animate={{ cx: x, cy: y }}
                                        transition={{ type: "spring", stiffness: 80, damping: 12 }}
                                        r="4.5" 
                                        className={`stroke-white stroke-[1.5] ${
                                          passwordAge <= 70 ? 'fill-emerald-500' : passwordAge <= 85 ? 'fill-amber-500' : 'fill-rose-600'
                                        }`} 
                                      />
                                      <motion.circle 
                                        animate={{ cx: x, cy: y }}
                                        transition={{ type: "spring", stiffness: 80, damping: 12 }}
                                        r="8.5" 
                                        fill="none" 
                                        className={`stroke-[1.5] ${
                                          passwordAge <= 70 
                                            ? 'stroke-emerald-400/50' 
                                            : passwordAge <= 85 
                                            ? 'stroke-amber-400/50' 
                                            : 'stroke-rose-400/60'
                                        }`} 
                                      />
                                    </g>
                                  </svg>
                                </div>
                              );
                            })()}

                            {/* Status Description */}
                            <div className="text-[10px] leading-relaxed text-slate-600">
                              {passwordAge <= 70 ? (
                                <span>Credential age is <strong className="text-emerald-650 font-extrabold">{passwordAge} days</strong>. <strong className="font-extrabold">{90 - passwordAge} days</strong> remaining before compliance cycle mandates rotation.</span>
                              ) : passwordAge <= 85 ? (
                                <span className="text-amber-700">
                                  Warning: Key is <strong className="font-extrabold">{passwordAge} days old</strong> (only <strong className="font-extrabold">{90 - passwordAge} days left</strong>). Enterprise security policy warning: rotate soon to ensure continuous API & Sourcing dashboard access.
                                </span>
                              ) : (
                                <span className="text-rose-700 font-extrabold flex items-start space-x-1">
                                  <span className="animate-pulse">⚠️ Expired! Key has exceeded 90-day rotation compliance (Age: {passwordAge} days). Update credentials immediately to clear authentication locks.</span>
                                </span>
                              )}
                            </div>

                            {/* Interactive Age Simulation Control */}
                            <div className="pt-2 border-t border-slate-200/65">
                              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Simulate Rotation Audit Timeframes:</p>
                              <div className="grid grid-cols-3 gap-1">
                                {[
                                  { label: '15d (Safe)', val: 15 },
                                  { label: '78d (Warning)', val: 78 },
                                  { label: '92d (Expired)', val: 92 }
                                ].map((opt) => (
                                  <button
                                    key={opt.val}
                                    type="button"
                                    onClick={() => {
                                      setPasswordAge(opt.val);
                                      addToast(`Compliance simulator set: password age of ${opt.val} days.`);
                                    }}
                                    className={`py-1 rounded text-[8px] font-black uppercase border transition cursor-pointer text-center ${
                                      passwordAge === opt.val
                                        ? 'bg-slate-900 border-slate-900 text-white'
                                        : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-550'
                                    }`}
                                  >
                                    {opt.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                        {renderArchiveDownloader()}
                      </div>
                    );
                  })()}

                  <button
                    id="auth-submit-btn"
                    type="submit"
                    disabled={authLoading}
                    className="w-full bg-blue-600 text-white py-2.5 rounded-xl text-xs font-semibold hover:bg-blue-700 transition-all flex items-center justify-center space-x-1.5 disabled:opacity-55 cursor-pointer shadow-sm"
                  >
                    {authLoading ? (
                      <>
                        <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Validating credentials securely...</span>
                      </>
                    ) : (
                      <span>Sign In Command</span>
                    )}
                  </button>

                  {authError && (
                    <div className="flex items-start space-x-1.5 text-[11px] text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-100" id="auth-error-alert">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                      <span>{authError}</span>
                    </div>
                  )}
                  {authSuccess && (
                    <div className="flex items-start space-x-1.5 text-[11px] text-emerald-600 bg-emerald-50 p-2.5 rounded-xl border border-emerald-100" id="auth-success-alert">
                      <CheckCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                      <span>{authSuccess}</span>
                    </div>
                  )}

                  {/* OAuth Social Access Options */}
                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-slate-200"></div>
                    <span className="flex-shrink mx-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">or authenticate with</span>
                    <div className="flex-grow border-t border-slate-200"></div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      id="auth-google-btn-signin"
                      onClick={() => handleSocialSignIn('google')}
                      disabled={authLoading}
                      className="group flex items-center justify-center space-x-2.5 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-750 hover:text-slate-900 py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer shadow-sm hover:shadow active:scale-[0.98] disabled:opacity-55 disabled:pointer-events-none"
                    >
                      <svg className="h-4.5 w-4.5 shrink-0 transition-transform duration-200 group-hover:scale-110 group-active:scale-95" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                      </svg>
                      <span>Google</span>
                    </button>
                    <button
                      type="button"
                      id="auth-github-btn-signin"
                      onClick={() => handleSocialSignIn('github')}
                      disabled={authLoading}
                      className="group flex items-center justify-center space-x-2.5 bg-[#24292e] hover:bg-[#2c3137] border border-[#24292e] hover:border-[#2c3137] text-white py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer shadow-sm hover:shadow active:scale-[0.98] disabled:opacity-55 disabled:pointer-events-none"
                    >
                      <svg className="h-4.5 w-4.5 shrink-0 transition-transform duration-200 group-hover:scale-110 group-active:scale-95 text-white" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                      </svg>
                      <span>GitHub</span>
                    </button>
                  </div>

                  <div className="mt-4 border-t border-slate-100 pt-4 flex items-center justify-between text-[11px] text-slate-500 font-bold">
                    <button type="button" onClick={() => setAuthMode('signup')} className="hover:underline cursor-pointer">Create Account</button>
                    <button type="button" onClick={() => setAuthMode('forgot')} className="hover:underline cursor-pointer">Forgot Password?</button>
                  </div>
                </motion.form>
              )}

              {authMode === 'signup' && !socialAuthConnecting && (
                <motion.form
                  key="signup"
                  onSubmit={handleAuthSubmit}
                  className="space-y-4 text-left"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                  <div className="text-left mb-4">
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                      Register Secure Enterprise Node
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Deploy unified sourcing workflows with premium legal templates.
                    </p>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Full Corporate Name</label>
                    <input
                      id="auth-signup-name"
                      type="text"
                      placeholder="e.g. Director of Sourcing"
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Primary Intent Role</label>
                    <select
                      id="auth-signup-role"
                      value={authRole}
                      onChange={(e) => setAuthRole(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 font-semibold"
                    >
                      <option value="worker">Non-Technical Skill Worker / Candidate</option>
                      <option value="employer">Hiring Manager (Post Jobs)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Corporate Email</label>
                    <input
                      id="auth-email-field"
                      type="email"
                      placeholder="recruiter@company.com"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 font-semibold"
                    />
                  </div>

                  {(() => {
                    const strength = computePasswordStrength(authPassword);
                    return (
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Password</label>
                        <div className="relative">
                          <input
                            id="auth-password-field"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            value={authPassword}
                            onChange={(e) => setAuthPassword(e.target.value)}
                            onFocus={() => setPasswordFocused(true)}
                            onBlur={() => setPasswordFocused(false)}
                            required
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-18 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 font-semibold"
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1.5">
                            <button
                              type="button"
                              title="Generate Secure Password"
                              id="auth-modal-btn-generate-pass"
                              onClick={() => {
                                const securePass = generateSecurePassword();
                                setAuthPassword(securePass);
                                setShowPassword(true);
                                addToast('Secure high-entropy password generated and set.');
                              }}
                              className="text-blue-600 hover:text-blue-800 cursor-pointer p-0.5 rounded hover:bg-slate-100 transition"
                            >
                              <Sparkles className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              id="auth-btn-toggle-pass"
                              onMouseDown={handleRevealPressStart}
                              onMouseUp={handleRevealPressEnd}
                              onMouseLeave={handleRevealPressEnd}
                              onTouchStart={handleRevealPressStart}
                              onTouchEnd={handleRevealPressEnd}
                              onTouchCancel={handleRevealPressEnd}
                              onClick={handleRevealClick}
                              title="Tap to toggle persistently, or press & hold for mobile-extended peek"
                              className={`cursor-pointer p-1 rounded-lg transition-all duration-200 ${
                                showPassword 
                                  ? 'text-blue-600 bg-blue-50 border border-blue-100 hover:bg-blue-100/50' 
                                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                              } ${isPressingReveal ? 'scale-90 ring-2 ring-blue-500/20' : ''}`}
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>

                          {/* Integrated Visual Progress Bar */}
                          {authPassword.length > 0 && (
                            <div className="absolute bottom-[2px] left-[10px] right-[10px] h-1 overflow-hidden rounded-full bg-slate-100" id="auth-modal-password-progress">
                              <div 
                                className={`h-full ${strength.colorClass} transition-all duration-300`} 
                                style={{ width: `${(strength.score / 5) * 100}%` }}
                              />
                            </div>
                          )}
                        </div>

                        {renderPasswordRequirements(authPassword)}

                        {/* Live Mobile Peek Hold Visual Countdown & Mobile Accessibility Buffer Config */}
                        <div className="mt-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-left" id="accessibility-peek-config-modal">
                          <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-wider text-slate-500">
                            <span className="flex items-center space-x-1">
                              <Key className="h-3 w-3 text-blue-600 animate-pulse" />
                              <span>Mobile Extended Peek Buffer</span>
                            </span>
                            {holdCountdown !== null ? (
                              <span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded text-[8px] font-black animate-pulse">
                                Hiding in {holdCountdown}s
                              </span>
                            ) : (
                              <span className="text-[8px] text-slate-400 font-bold">
                                {showPassword ? 'Persistent' : 'Hidden'}
                              </span>
                            )}
                          </div>

                          {/* Countdown progress bar */}
                          {holdCountdown !== null && (
                            <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden" id="peek-countdown-progress-modal">
                              <div 
                                className="h-full bg-amber-500 transition-all duration-1000"
                                style={{ width: `${(holdCountdown / holdReleaseBuffer) * 100}%` }}
                              />
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-1 border-t border-slate-200/50">
                            <span className="text-[9px] font-medium text-slate-500">Hold Duration Buffer:</span>
                            <div className="flex space-x-1">
                              {[3, 5, 10, 15].map((secs) => (
                                <button
                                  key={secs}
                                  type="button"
                                  onClick={() => {
                                    setHoldReleaseBuffer(secs);
                                    addToast(`Extended hold-peek buffer adjusted to ${secs}s.`);
                                  }}
                                  className={`px-1.5 py-0.5 rounded text-[8px] font-bold border transition cursor-pointer ${
                                    holdReleaseBuffer === secs 
                                      ? 'bg-blue-600 border-blue-600 text-white font-extrabold shadow-sm' 
                                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100'
                                  }`}
                                >
                                  {secs}s
                                </button>
                              ))}
                            </div>
                          </div>
                          <p className="text-[8px] leading-relaxed text-slate-450 font-medium">
                            * Tap to toggle indefinitely. Press & hold to peek; when released, the password remains visible for the selected buffer to assist screen readers and users with hand motor limits.
                          </p>
                        </div>

                        {authPassword.length > 0 && strength.warning && (
                          <div className="mt-2 p-2.5 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-start space-x-2 text-[10px] font-bold" id="auth-modal-password-warning">
                            <ShieldAlert className="h-3.5 w-3.5 shrink-0 mt-0.5 text-red-600" />
                            <div className="text-left">
                              <span className="block font-black text-red-800">Security Warning</span>
                              <span>{strength.warning} Avoid sequential characters or common phrases.</span>
                            </div>
                          </div>
                        )}
                        
                        {authPassword.length > 0 && (
                          <motion.div 
                            className={`mt-2.5 space-y-1.5 p-3 rounded-2xl bg-white border transition-all duration-300 ${
                              strength.score >= 5 
                                ? 'border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.15)]' 
                                : 'border-slate-100 shadow-sm'
                            }`}
                            id="password-strength-container"
                            animate={strength.score >= 5 ? {
                              scale: [1, 1.015, 1],
                              borderColor: ["rgba(16, 185, 129, 0.4)", "rgba(16, 185, 129, 0.8)", "rgba(16, 185, 129, 0.4)"],
                              boxShadow: [
                                "0 0 12px rgba(16,185,129,0.15)",
                                "0 0 18px rgba(16,185,129,0.3)",
                                "0 0 12px rgba(16,185,129,0.15)"
                              ]
                            } : {}}
                            transition={strength.score >= 5 ? {
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            } : {}}
                          >
                            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                              <span className="text-slate-400">Credentials Rating</span>
                              <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold tracking-widest ${strength.textColorClass} ${strength.bgColorClass} border border-current/10`}>
                                {strength.label}
                              </span>
                            </div>
                            
                            {/* 3-Segment Progress bar */}
                            <div className="grid grid-cols-3 gap-1.5 h-1.5 w-full">
                              <div 
                                id="strength-bar-1"
                                className={`h-full rounded-full transition-all duration-300 ${
                                  strength.score >= 1 ? strength.colorClass : 'bg-slate-100 border border-slate-200'
                                }`} 
                              />
                              <div 
                                id="strength-bar-2"
                                className={`h-full rounded-full transition-all duration-300 ${
                                  strength.score >= 3 ? strength.colorClass : 'bg-slate-100 border border-slate-200'
                                }`} 
                              />
                              <div 
                                id="strength-bar-3"
                                className={`h-full rounded-full transition-all duration-300 ${
                                  strength.score >= 5 ? strength.colorClass : 'bg-slate-100 border border-slate-200'
                                }`} 
                              />
                            </div>

                            <p id="password-strength-tips" className="text-[10px] text-slate-500 leading-normal font-semibold">
                              {strength.tips}
                            </p>
                          </motion.div>
                        )}

                        {authPassword.length > 0 && (
                          <motion.div 
                            className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 mt-2 text-left" 
                            id="password-modal-compliance-indicator"
                            animate={passwordAge >= 85 ? {
                              opacity: [1, 0.5, 1],
                              borderColor: ["#e2e8f0", "#fda4af", "#e2e8f0"]
                            } : {
                              opacity: 1,
                              borderColor: "#e2e8f0"
                            }}
                            transition={passwordAge >= 85 ? {
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            } : {}}
                          >
                            <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-wider">
                              <span className="text-slate-500 flex items-center space-x-1">
                                <Shield className="h-3 w-3 text-teal-600" />
                                <span>Enterprise Rotation Compliance</span>
                              </span>
                              <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${
                                passwordAge <= 70 
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                  : passwordAge <= 85
                                  ? 'bg-amber-50 text-amber-700 border border-amber-100'
                                  : 'bg-rose-50 text-rose-700 border border-rose-100 animate-pulse'
                              }`}>
                                {passwordAge <= 70 ? 'Compliant' : passwordAge <= 85 ? 'Rotation Warning' : 'Policy Expired'}
                              </span>
                            </div>

                            {/* Progress Bar showing 90-day cycle */}
                            <div className="space-y-1">
                              <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full transition-all duration-500 ${
                                    passwordAge <= 70 ? 'bg-emerald-500' : passwordAge <= 85 ? 'bg-amber-500' : 'bg-rose-500 animate-pulse'
                                  }`}
                                  style={{ width: `${Math.min(100, (passwordAge / 90) * 100)}%` }}
                                />
                              </div>
                              <div className="flex justify-between text-[8px] text-slate-400 font-bold">
                                <span>0 Days (New Key)</span>
                                <span>90-Day SOC2 Max Limit</span>
                              </div>
                            </div>

                            {/* Interactive SVG compliance curve chart */}
                            {(() => {
                              const cappedAge = Math.min(90, Math.max(0, passwordAge));
                              let x = 10;
                              let y = 45;
                              if (cappedAge <= 70) {
                                x = 10 + (cappedAge / 70) * 180;
                                y = 45 - (cappedAge / 70) * 15;
                              } else if (cappedAge <= 85) {
                                x = 190 + ((cappedAge - 70) / 15) * 55;
                                y = 30 - ((cappedAge - 70) / 15) * 15;
                              } else {
                                x = 245 + ((cappedAge - 85) / 5) * 45;
                                y = 15 - ((cappedAge - 85) / 5) * 10;
                              }

                              return (
                                <div className="mt-2" id="password-compliance-modal-svg-chart">
                                  <svg viewBox="0 0 300 65" className="w-full bg-slate-900/5 rounded-xl p-1.5 border border-slate-200/50">
                                    <defs>
                                      <linearGradient id="chart-area-grad-modal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.12" />
                                        <stop offset="60%" stopColor="#eab308" stopOpacity="0.08" />
                                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.01" />
                                      </linearGradient>
                                      <linearGradient id="line-grad-modal" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#10b981" />
                                        <stop offset="75%" stopColor="#eab308" />
                                        <stop offset="100%" stopColor="#f43f5e" />
                                      </linearGradient>
                                    </defs>

                                    {/* Grid and threshold background markers */}
                                    <line x1="190" y1="5" x2="190" y2="48" stroke="#cbd5e1" strokeDasharray="2 2" strokeWidth="1" />
                                    <line x1="245" y1="5" x2="245" y2="48" stroke="#fecdd3" strokeDasharray="2 2" strokeWidth="1" />
                                    
                                    <text x="190" y="56" textAnchor="middle" className="text-[7px] font-bold fill-slate-400">Day 70</text>
                                    <text x="245" y="56" textAnchor="middle" className="text-[7px] font-bold fill-rose-400 animate-pulse">Day 85</text>

                                    {/* Shaded projection area under path */}
                                    <motion.path 
                                      key={`area-${passwordAge}`}
                                      d="M 10 45 L 190 30 L 245 15 L 290 5 L 290 48 L 10 48 Z" 
                                      fill="url(#chart-area-grad-modal)" 
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      transition={{ duration: 0.8 }}
                                    />

                                    {/* Trend / age curve line */}
                                    <motion.path 
                                      key={`line-${passwordAge}`}
                                      d="M 10 45 L 190 30 L 245 15 L 290 5" 
                                      fill="none" 
                                      stroke="url(#line-grad-modal)" 
                                      strokeWidth="1.75" 
                                      strokeLinecap="round" 
                                      strokeLinejoin="round"
                                      initial={{ pathLength: 0 }}
                                      animate={{ pathLength: 1 }}
                                      transition={{ duration: 1.2, ease: "easeOut" }}
                                    />

                                    {/* Landmark node dots */}
                                    <circle cx="10" cy="45" r="2.5" className="fill-emerald-500 stroke-white stroke-1" />
                                    <circle cx="190" cy="30" r="2.5" className="fill-amber-500 stroke-white stroke-1" />
                                    <circle cx="245" cy="15" r="2.5" className="fill-rose-500 stroke-white stroke-1" />
                                    <circle cx="290" cy="5" r="2.5" className="fill-rose-600 stroke-white stroke-1" />

                                    {/* Tracker position cursor */}
                                    <g>
                                      <motion.circle 
                                        animate={{ cx: x, cy: y }}
                                        transition={{ type: "spring", stiffness: 80, damping: 12 }}
                                        r="4.5" 
                                        className={`stroke-white stroke-[1.5] ${
                                          passwordAge <= 70 ? 'fill-emerald-500' : passwordAge <= 85 ? 'fill-amber-500' : 'fill-rose-600'
                                        }`} 
                                      />
                                      <motion.circle 
                                        animate={{ cx: x, cy: y }}
                                        transition={{ type: "spring", stiffness: 80, damping: 12 }}
                                        r="8.5" 
                                        fill="none" 
                                        className={`stroke-[1.5] ${
                                          passwordAge <= 70 
                                            ? 'stroke-emerald-400/50' 
                                            : passwordAge <= 85 
                                            ? 'stroke-amber-400/50' 
                                            : 'stroke-rose-400/60'
                                        }`} 
                                      />
                                    </g>
                                  </svg>
                                </div>
                              );
                            })()}

                            {/* Status Description */}
                            <div className="text-[10px] leading-relaxed text-slate-600">
                              {passwordAge <= 70 ? (
                                <span>Credential age is <strong className="text-emerald-650 font-extrabold">{passwordAge} days</strong>. <strong className="font-extrabold">{90 - passwordAge} days</strong> remaining before compliance cycle mandates rotation.</span>
                              ) : passwordAge <= 85 ? (
                                <span className="text-amber-700">
                                  Warning: Key is <strong className="font-extrabold">{passwordAge} days old</strong> (only <strong className="font-extrabold">{90 - passwordAge} days left</strong>). Enterprise security policy warning: rotate soon to ensure continuous API & Sourcing dashboard access.
                                </span>
                              ) : (
                                <span className="text-rose-700 font-extrabold flex items-start space-x-1">
                                  <span className="animate-pulse">⚠️ Expired! Key has exceeded 90-day rotation compliance (Age: {passwordAge} days). Update credentials immediately to clear authentication locks.</span>
                                </span>
                              )}
                            </div>

                            {/* Interactive Age Simulation Control */}
                            <div className="pt-2 border-t border-slate-200/65">
                              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Simulate Rotation Audit Timeframes:</p>
                              <div className="grid grid-cols-3 gap-1">
                                {[
                                  { label: '15d (Safe)', val: 15 },
                                  { label: '78d (Warning)', val: 78 },
                                  { label: '92d (Expired)', val: 92 }
                                ].map((opt) => (
                                  <button
                                    key={opt.val}
                                    type="button"
                                    onClick={() => {
                                      setPasswordAge(opt.val);
                                      addToast(`Compliance simulator set: password age of ${opt.val} days.`);
                                    }}
                                    className={`py-1 rounded text-[8px] font-black uppercase border transition cursor-pointer text-center ${
                                      passwordAge === opt.val
                                        ? 'bg-slate-900 border-slate-900 text-white'
                                        : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-550'
                                    }`}
                                  >
                                    {opt.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                        {renderArchiveDownloader()}
                      </div>
                    );
                  })()}

                  <button
                    id="auth-submit-btn"
                    type="submit"
                    disabled={authLoading}
                    className="w-full bg-blue-600 text-white py-2.5 rounded-xl text-xs font-semibold hover:bg-blue-700 transition-all flex items-center justify-center space-x-1.5 disabled:opacity-55 cursor-pointer shadow-sm"
                  >
                    {authLoading ? (
                      <>
                        <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Validating credentials securely...</span>
                      </>
                    ) : (
                      <span>Register Secure Node</span>
                    )}
                  </button>

                  {authError && (
                    <div className="flex items-start space-x-1.5 text-[11px] text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-100" id="auth-error-alert">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                      <span>{authError}</span>
                    </div>
                  )}
                  {authSuccess && (
                    <div className="flex items-start space-x-1.5 text-[11px] text-emerald-600 bg-emerald-50 p-2.5 rounded-xl border border-emerald-100" id="auth-success-alert">
                      <CheckCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                      <span>{authSuccess}</span>
                    </div>
                  )}

                  {/* OAuth Social Access Options */}
                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-slate-200"></div>
                    <span className="flex-shrink mx-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">or register with</span>
                    <div className="flex-grow border-t border-slate-200"></div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      id="auth-google-btn-signup"
                      onClick={() => handleSocialSignIn('google')}
                      disabled={authLoading}
                      className="group flex items-center justify-center space-x-2.5 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-750 hover:text-slate-900 py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer shadow-sm hover:shadow active:scale-[0.98] disabled:opacity-55 disabled:pointer-events-none"
                    >
                      <svg className="h-4.5 w-4.5 shrink-0 transition-transform duration-200 group-hover:scale-110 group-active:scale-95" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                      </svg>
                      <span>Google</span>
                    </button>
                    <button
                      type="button"
                      id="auth-github-btn-signup"
                      onClick={() => handleSocialSignIn('github')}
                      disabled={authLoading}
                      className="group flex items-center justify-center space-x-2.5 bg-[#24292e] hover:bg-[#2c3137] border border-[#24292e] hover:border-[#2c3137] text-white py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer shadow-sm hover:shadow active:scale-[0.98] disabled:opacity-55 disabled:pointer-events-none"
                    >
                      <svg className="h-4.5 w-4.5 shrink-0 transition-transform duration-200 group-hover:scale-110 group-active:scale-95 text-white" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                      </svg>
                      <span>GitHub</span>
                    </button>
                  </div>

                  <div className="mt-4 border-t border-slate-100 pt-4 flex items-center justify-between text-[11px] text-slate-500 font-bold">
                    <button type="button" onClick={() => setAuthMode('signin')} className="hover:underline w-full text-center cursor-pointer">Already registered? Sign In</button>
                  </div>
                </motion.form>
              )}

              {authMode === 'forgot' && !isForgotSubmitted && (
                <motion.form
                  key="forgot-form"
                  onSubmit={handleAuthSubmit}
                  className="space-y-4 text-left"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="text-left mb-4">
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                      Credentials Retrieval
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Enter your email to dispatch a cryptographic reset covenant.
                    </p>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Corporate Email</label>
                    <input
                      id="auth-email-field"
                      type="email"
                      placeholder="recruiter@company.com"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 font-semibold"
                    />
                  </div>

                  <button
                    id="auth-submit-btn"
                    type="submit"
                    disabled={authLoading}
                    className="w-full bg-blue-600 text-white py-2.5 rounded-xl text-xs font-semibold hover:bg-blue-700 transition-all flex items-center justify-center space-x-1.5 disabled:opacity-55 cursor-pointer shadow-sm"
                  >
                    {authLoading ? (
                      <>
                        <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Validating credentials securely...</span>
                      </>
                    ) : (
                      <span>Dispatch Reset Code</span>
                    )}
                  </button>

                  {authError && (
                    <div className="flex items-start space-x-1.5 text-[11px] text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-100" id="auth-error-alert">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                      <span>{authError}</span>
                    </div>
                  )}

                  <div className="mt-4 border-t border-slate-100 pt-4 flex items-center justify-between text-[11px] text-slate-500 font-bold">
                    <button type="button" onClick={() => setAuthMode('signin')} className="hover:underline w-full text-center cursor-pointer">Back to Sign In</button>
                  </div>
                </motion.form>
              )}

              {authMode === 'forgot' && isForgotSubmitted && (
                <motion.div
                  key="forgot-success"
                  className="space-y-4 text-center py-6"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="flex justify-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 animate-pulse">
                      <CheckCircle className="h-8 w-8" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-base sm:text-lg font-black text-slate-900">
                      Covenant Dispatched
                    </h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                      A cryptographic reset link has been successfully routed to <strong className="text-slate-800 font-bold">{authEmail}</strong>. Please check your inbox and spam folders to finalize recovery.
                    </p>
                  </div>

                  {authSuccess && (
                    <div className="flex items-start space-x-1.5 text-[11px] text-emerald-600 bg-emerald-50 p-2.5 rounded-xl border border-emerald-100 text-left w-full" id="auth-success-alert">
                      <CheckCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                      <span>{authSuccess}</span>
                    </div>
                  )}

                  <div className="pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotSubmitted(false);
                        setAuthSuccess('');
                        setAuthMode('signin');
                      }}
                      className="w-full bg-slate-900 text-white py-2.5 rounded-xl text-xs font-semibold hover:bg-slate-800 transition-all cursor-pointer shadow-sm"
                    >
                      Return to Sign In
                    </button>
                  </div>
                </motion.div>
              )}

              {authMode === 'otp' && (
                <motion.form
                  key="otp"
                  onSubmit={handleVerifyOtp}
                  className="space-y-4 text-left"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                  <div className="text-left mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-base sm:text-lg font-extrabold text-slate-900 font-black">Secure MFA validation</h3>
                      <p className="text-xs text-slate-500 mt-1">Please link your authenticating device or enter the cryptographic security code.</p>
                    </div>
                    <button
                      type="button"
                      id="rapid-camera-mfa-btn"
                      onClick={() => setIsMfaScannerActive(true)}
                      className="ml-2 shrink-0 flex items-center space-x-1.5 py-1.5 px-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-750 hover:text-blue-900 rounded-lg text-[10px] font-bold uppercase tracking-wider transition cursor-pointer shadow-sm active:scale-95 animate-pulse"
                    >
                      <Camera className="h-3.5 w-3.5 text-blue-600" />
                      <span>Camera Scan</span>
                    </button>
                  </div>

                  {/* Secure MFA App QR component */}
                  <MfaQrCode onCodeGenerated={(code) => setOtpCode(code)} />

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Verification Code</label>
                    <input
                      id="auth-otp-field"
                      type="text"
                      maxLength={6}
                      placeholder={mfaCooldown > 0 ? "COOLDOWN" : "123456"}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      required
                      disabled={authLoading || mfaCooldown > 0}
                      className={`w-full border rounded-xl px-3 py-2.5 text-center text-sm outline-none font-mono tracking-[0.5em] text-slate-800 transition ${
                        mfaCooldown > 0
                          ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-75'
                          : 'bg-slate-50 border-slate-200 focus:border-blue-500'
                      }`}
                    />
                    
                    {/* Resend Verification Code Button & Cooldown */}
                    <div className="mt-2.5 flex flex-col items-center justify-center space-y-1.5" id="modal-resend-container">
                      <button
                        type="button"
                        id="modal-resend-btn"
                        disabled={authLoading || mfaCooldown > 0}
                        onClick={() => {
                          setMfaCooldown(15);
                          const newCode = Math.floor(100000 + Math.random() * 900000).toString();
                          setOtpCode(newCode);
                          addToast('Dispatched new 6-digit MFA security token.');
                        }}
                        className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg transition ${
                          mfaCooldown > 0
                            ? 'text-slate-400 bg-slate-100 border border-slate-200/50 cursor-not-allowed flex items-center space-x-1'
                            : 'text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-100/60 cursor-pointer'
                        }`}
                      >
                        {mfaCooldown > 0 ? (
                          <>
                            <RefreshCw className="h-2.5 w-2.5 animate-spin mr-1 inline-block text-slate-400" />
                            <span>Resend in {mfaCooldown}s</span>
                          </>
                        ) : (
                          <span>Resend Verification Code</span>
                        )}
                      </button>
                      {mfaCooldown > 0 && (
                        <p className="text-[9px] font-semibold text-amber-600 bg-amber-50 border border-amber-100/50 px-2 py-0.5 rounded-md text-center animate-pulse">
                          MFA Lock active. Verification field is locked during code regeneration.
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    id="auth-otp-submit-btn"
                    type="submit"
                    disabled={authLoading}
                    className="w-full bg-blue-600 text-white py-2.5 rounded-xl text-xs font-semibold hover:bg-blue-700 transition-all flex items-center justify-center space-x-1.5 disabled:opacity-55 cursor-pointer shadow-sm"
                  >
                    {authLoading ? (
                      <>
                        <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Validating MFA Code...</span>
                      </>
                    ) : (
                      <span>Complete Verification</span>
                    )}
                  </button>

                  {authError && (
                    <div className="flex items-start space-x-1.5 text-[11px] text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-100">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                      <span>{authError}</span>
                    </div>
                  )}
                  {authSuccess && (
                    <div className="flex items-start space-x-1.5 text-[11px] text-emerald-600 bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
                      <CheckCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                      <span>{authSuccess}</span>
                    </div>
                  )}

                  <div className="mt-4 border-t border-slate-100 pt-4 flex items-center justify-between text-[11px] text-slate-500 font-bold">
                    <button type="button" onClick={() => setAuthMode('signin')} className="hover:underline w-full text-center cursor-pointer">Cancel and Sign In</button>
                  </div>
                </motion.form>
              )}

              {socialAuthConnecting && (
                <motion.div
                  key="social-connecting"
                  className="space-y-6 py-4 text-center"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="relative flex justify-center items-center py-4">
                    {/* Ring background */}
                    <div className="absolute h-20 w-20 rounded-full border border-dashed border-blue-200 animate-spin" />
                    <div className="absolute h-16 w-16 rounded-full border border-blue-100 bg-blue-50/50" />
                    
                    {socialAuthConnecting === 'google' ? (
                      <svg className="h-10 w-10 relative z-10" viewBox="0 0 24 24">
                        <g transform="matrix(1, 0, 0, 1, 0, 0)">
                          <path d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.96,2.37 -2.04,3.1v2.58h3.3c1.93,-1.78 3.04,-4.4 3.04,-7.48c0,-0.64 -0.06,-1.25 -0.17,-1.82z" fill="#4285F4" />
                          <path d="M12,20.5c2.3,0 4.23,-0.76 5.64,-2.08l-3.3,-2.58c-0.91,0.61 -2.08,0.98 -3.34,0.98c-2.57,0 -4.75,-1.74 -5.53,-4.07H2.07v2.66c1.47,2.92 4.49,4.92 8.01,4.92z" fill="#34A853" />
                          <path d="M6.47,12.75a6.01,6.01,0,0,1,0,-3.5V6.59H2.07a10.02,10.02,0,0,0,0,8.82l4.4,-3.41z" fill="#FBBC05" />
                          <path d="M12,5.5c1.25,0 2.37,0.43 3.25,1.27l2.44,-2.44C16.22,2.94 14.29,2.5 12,2.5c-3.52,0 -6.54,2 -8.01,4.92l4.4,3.41c0.78,-2.33 2.96,-4.07 5.53,-4.07z" fill="#EA4335" />
                        </g>
                      </svg>
                    ) : (
                      <Github className="h-10 w-10 text-slate-900 relative z-10" />
                    )}
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-widest">
                      Establishing Federated Session
                    </h3>
                    <p className="text-xs text-slate-550 max-w-xs mx-auto leading-normal">
                      Linking securely with your {socialAuthConnecting === 'google' ? 'Google Account' : 'GitHub Authorization Node'}...
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 text-left space-y-2.5 max-w-sm mx-auto">
                    <div className="flex items-center justify-between text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                      <span>Security Ledger</span>
                      <span className="text-emerald-600 animate-pulse flex items-center space-x-1 text-[8px] font-black">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        <span>Connected</span>
                      </span>
                    </div>

                    <div className="space-y-2 text-xs text-slate-600 font-medium">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Identity</span>
                        <strong className="text-slate-800 font-bold font-mono text-[11px]">{authEmail || 'cybersubash230@gmail.com'}</strong>
                      </div>
                      <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Federation Status</span>
                        <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-[9px] font-black uppercase">Granted</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Access Key rotation</span>
                        <span className="text-slate-500 font-mono text-[10px]">SOC2 90-Day Compliant</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2.5 max-w-sm mx-auto pt-2">
                    <button
                      type="button"
                      onClick={() => setSocialAuthConnecting(null)}
                      className="flex-1 border border-slate-200 text-slate-500 py-2.5 rounded-xl text-xs font-semibold hover:bg-slate-50 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsLoggedIn(true);
                        setSocialAuthConnecting(null);
                        setIsAuthModalOpen(false);
                        addToast(`Federated secure session dispatch complete via ${socialAuthConnecting === 'google' ? 'Google' : 'GitHub'}.`);
                      }}
                      className="flex-1 bg-slate-900 text-white py-2.5 rounded-xl text-xs font-semibold hover:bg-slate-805 transition cursor-pointer shadow-sm"
                    >
                      Authorize & Proceed
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

    </div>
  );
}

// Wrap App with AuthProvider
function AppWithAuth() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

export default AppWithAuth;
