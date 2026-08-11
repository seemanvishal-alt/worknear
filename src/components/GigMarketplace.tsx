/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, CheckCircle, AlertCircle, Phone, Lock, Eye, EyeOff, User, 
  MapPin, Calendar, Video, Play, Pause, Send, MessageSquare, 
  CreditCard, Award, UserCheck, RefreshCw, Star, Trash2, Mic, 
  Database, Server, Compass, FileText, ArrowRight, ArrowLeft, Zap, Info, ShieldAlert
} from 'lucide-react';
import TrustScoreComponent from './TrustScoreComponent';
import GigNearbyMap from './GigNearbyMap';

// Define the available languages and translations
const TRANSLATIONS = {
  en: {
    title: 'Hyperlocal Gig-Worker Marketplace',
    subtitle: 'Connecting event & household employers with Aadhaar-verified elite workers.',
    verified: 'Aadhaar Verified',
    employerPortal: 'Employer Hub',
    workerPortal: 'Worker Portal',
    developerSandbox: 'Developer Sandbox & Specs',
    postGig: 'Post a New Gig',
    gigTitle: 'Gig Service Category',
    location: 'Job Location (Neighborhood)',
    date: 'Date of Service',
    headcount: 'Headcount Needed',
    pay: 'Pay Rate (₹ / hour)',
    duration: 'Duration (Hours)',
    submitGig: 'Post & Search Nearby',
    nearbyWorkers: 'Nearby Verified Workers (Ranked by AI Trust)',
    trustScore: 'AI Trust Score',
    invite: 'Send Invite',
    invited: 'Invited',
    skills: 'Skills',
    experience: 'Experience',
    availability: 'Availability',
    rating: 'Rating',
    distance: 'Distance',
    chatSecure: 'Secure Encrypted Chat',
    checkout: 'Attendance Check-in / Check-out',
    checkinBtn: 'Geo-Tagged Check-In',
    checkoutBtn: 'Geo-Tagged Check-Out',
    escrowPayment: 'Escrow Ledger',
    voiceInput: 'Voice Profile Input (Low-Literacy Option)',
    startVoice: 'Click to Speak (English)',
    stopVoice: 'Stop Recording',
    transcription: 'Simulated Transcription',
    backupNotice: 'AI No-Show Autopilot Backup',
    cancelSimulate: 'Simulate Worker Cancellation',
    dbSchemaTitle: 'Sovereign PostgreSQL Database Schema',
    apiRouteTitle: 'Sovereign Rate-Limited API Handlers',
    roadmapTitle: 'Phased MVP Roadmap - Phase 1: Chennai (Catering)',
    activeLanguage: 'Language Selected',
    catering: 'Catering',
    housekeeping: 'Housekeeping',
    delivery: 'Delivery',
    construction: 'Construction',
    security: 'Security Staff'
  },
  ta: {
    title: 'உள்ளூர் தற்காலிக பணியாளர் சந்தை',
    subtitle: 'ஆதார் சரிபார்க்கப்பட்ட சிறந்த பணியாளர்களுடன் முதலாளிகளை இணைக்கிறது.',
    verified: 'ஆதார் சரிபார்க்கப்பட்டது',
    employerPortal: 'முதலாளி மையம்',
    workerPortal: 'பணியாளர் தளம்',
    developerSandbox: 'டெவலப்பர் சாண்ட்பாக்ஸ் & விவரக்குறிப்புகள்',
    postGig: 'புதிய பணியை பதிவிடவும்',
    gigTitle: 'பணி வகை',
    location: 'பணி இடம் (அருகிலுள்ள பகுதி)',
    date: 'பணி தேதி',
    headcount: 'தேவைப்படும் பணியாளர்கள் எண்ணிக்கை',
    pay: 'சம்பளம் (₹ / மணிநேரம்)',
    duration: 'கால அளவு (மணிநேரம்)',
    submitGig: 'பதிவிட்டு அருகிலுள்ளோரைத் தேடு',
    nearbyWorkers: 'அருகிலுள்ள சரிபார்க்கப்பட்ட பணியாளர்கள் (AI நம்பகத்தன்மை வரிசை)',
    trustScore: 'AI நம்பகத்தன்மை மதிப்பீடு',
    invite: 'அழைப்பு அனுப்பு',
    invited: 'அழைக்கப்பட்டது',
    skills: 'திறன்கள்',
    experience: 'அனுபவம்',
    availability: 'இருப்பு நிலை',
    rating: 'மதிப்பீடு',
    distance: 'தொலைவு',
    chatSecure: 'பாதுகாப்பான மறைகுறியாக்கப்பட்ட அரட்டை',
    checkout: 'வருகை பதிவு செக்-இன் / செக்-அவுட்',
    checkinBtn: 'புவிசார் குறியிடப்பட்ட செக்-இன்',
    checkoutBtn: 'புவிசார் குறியிடப்பட்ட செக்-அவுட்',
    escrowPayment: 'எஸ்க்ரோ கணக்கு லெட்ஜர்',
    voiceInput: 'குரல் மூல சுயவிவர உள்ளீடு (எளிய வழி)',
    startVoice: 'பேச கிளிக் செய்யவும் (தமிழ்)',
    stopVoice: 'பதிவை நிறுத்தவும்',
    transcription: 'குரல்வழியாக மாற்றப்பட்ட உரை',
    backupNotice: 'AI ஆப்சென்ட் மாற்று பணியாளர் தேர்வு',
    cancelSimulate: 'பணியாளர் ரத்து செய்வதை உருவகப்படுத்து',
    dbSchemaTitle: 'PostgreSQL தரவுத்தள வடிவமைப்பு',
    apiRouteTitle: 'பாதுகாப்பான ஏபிஐ வழிகள் (API Routes)',
    roadmapTitle: 'முன்னோடி திட்ட கால அட்டவணை - சென்னை (கேட்டரிங்)',
    activeLanguage: 'தேர்ந்தெடுக்கப்பட்ட மொழி',
    catering: 'கேட்டரிங் (சமையல்)',
    housekeeping: 'வீட்டு வேலை',
    delivery: 'டெலிவரி (விநியோகம்)',
    construction: 'கட்டுமான வேலை',
    security: 'பாதுகாப்பு காவலர்'
  },
  hi: {
    title: 'हाइपरलोकल गिग-वर्कर मार्केटप्लेस',
    subtitle: 'आधार-सत्यापित विशिष्ट श्रमिकों के साथ नियोक्ताओं को जोड़ना।',
    verified: 'आधार सत्यापित',
    employerPortal: 'नियोक्ता हब',
    workerPortal: 'श्रमिक पोर्टल',
    developerSandbox: 'डेवलपर सैंडबॉक्स और स्पेक्स',
    postGig: 'नया काम पोस्ट करें',
    gigTitle: 'काम की श्रेणी',
    location: 'काम का स्थान (पड़ोस)',
    date: 'काम की तिथि',
    headcount: 'आवश्यक श्रमिक संख्या',
    pay: 'पारिश्रमिक (₹ / घंटा)',
    duration: 'अवधि (घंटे)',
    submitGig: 'पोस्ट करें और खोजें',
    nearbyWorkers: 'आसपास के सत्यापित श्रमिक (AI ट्रस्ट रैंक)',
    trustScore: 'AI ट्रस्ट स्कोर',
    invite: 'आमंत्रण भेजें',
    invited: 'आमंत्रित',
    skills: 'कौशल',
    experience: 'अनुभव',
    availability: 'उपलब्धता',
    rating: 'रेटिंग',
    distance: 'दूरी',
    chatSecure: 'सुरक्षित एन्क्रिप्टेड चैट',
    checkout: 'जियो-टैग अटेंडेंस चेक-इन / चेक-आउट',
    checkinBtn: 'जियो-टैग चेक-इन',
    checkoutBtn: 'जियो-टैग चेक-आउट',
    escrowPayment: 'एस्क्रो बहीखाता (Escrow)',
    voiceInput: 'आवाज-इनपुट प्रोफाइल सेटअप (कम साक्षरता सहायता)',
    startVoice: 'बोलने के लिए क्लिक करें (हिंदी)',
    stopVoice: 'रिकॉर्डिंग रोकें',
    transcription: 'अनुवादित टेक्स्ट विवरण',
    backupNotice: 'AI अनुपस्थिति ऑटो-बैकअप',
    cancelSimulate: 'श्रमिक रद्दीकरण का अनुकरण करें',
    dbSchemaTitle: 'सॉवरेन PostgreSQL डेटाबेस स्कीमा',
    apiRouteTitle: 'दर-सीमित एपीआई रूट विवरण',
    roadmapTitle: 'चरणबद्ध एमवीपी रोडमैप - चरण 1: चेन्नई (कैटरिंग)',
    activeLanguage: 'चयनित भाषा',
    catering: 'खान-पान (कैटरिंग)',
    housekeeping: 'हाउसकीपिंग (सफाई)',
    delivery: 'वितरण (डिलीवरी)',
    construction: 'निर्माण कार्य',
    security: 'सुरक्षा गार्ड'
  }
};

// Types for structural clarity
interface Worker {
  id: string;
  name: string;
  avatar: string;
  category: 'catering' | 'housekeeping' | 'delivery' | 'construction' | 'security';
  skills: string[];
  experience: number;
  phone: string;
  distanceKm: number;
  aiTrustScore: number;
  rating: number;
  reviewsCount: number;
  aadhaarStatus: 'verified' | 'pending';
  aadhaarMaskedRef: string;
  skillsProofVideoUrl: string;
  locationName: string;
  availableDays: string[];
  bio: string;
  lat: number;
  lng: number;
  // Trust metrics
  completionRate: number;
  cancellationRate: number;
  feedbackScore: number;
  gigsCompleted: number;
}

// Initial Mock Workers Data (Tamil Nadu / South-Indian Hub focus for high localized fidelity)
const INITIAL_WORKERS: Worker[] = [
  {
    id: 'W-001',
    name: 'Karthik Raja',
    avatar: 'KR',
    category: 'catering',
    skills: ['Biryani Master', 'South Indian Meals', 'Event Carving', 'Hygiene Standards'],
    experience: 6,
    phone: '+91 98765 XXXXX',
    distanceKm: 0.6,
    aiTrustScore: 98,
    rating: 4.9,
    reviewsCount: 38,
    aadhaarStatus: 'verified',
    aadhaarMaskedRef: 'UIDAI-XXXX-4921-APPROVED',
    skillsProofVideoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    locationName: 'Adyar, Chennai',
    availableDays: ['Mon', 'Wed', 'Fri', 'Sat', 'Sun'],
    bio: 'Professional catering supervisor with specialization in premium traditional Tamil wedding banquets.',
    lat: 13.0062,
    lng: 80.2574,
    completionRate: 98,
    cancellationRate: 2,
    feedbackScore: 98,
    gigsCompleted: 38
  },
  {
    id: 'W-002',
    name: 'Muthu Kumar',
    avatar: 'MK',
    category: 'catering',
    skills: ['Vegetarian Master', 'Tandoor Cook', 'Plating Design', 'Bulk Service'],
    experience: 4,
    phone: '+91 99542 XXXXX',
    distanceKm: 1.2,
    aiTrustScore: 94,
    rating: 4.8,
    reviewsCount: 22,
    aadhaarStatus: 'verified',
    aadhaarMaskedRef: 'UIDAI-XXXX-1188-APPROVED',
    skillsProofVideoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    locationName: 'T. Nagar, Chennai',
    availableDays: ['Fri', 'Sat', 'Sun'],
    bio: 'Experienced chef in commercial tandoor grilling and traditional banana-leaf plating systems.',
    lat: 13.0405,
    lng: 80.2337,
    completionRate: 94,
    cancellationRate: 6,
    feedbackScore: 94,
    gigsCompleted: 22
  },
  {
    id: 'W-003',
    name: 'Ranganathan S.',
    avatar: 'RS',
    category: 'security',
    skills: ['Crowd Management', 'Vanguard Patrol', 'First Aid', 'CCTV Protocol'],
    experience: 7,
    phone: '+91 91102 XXXXX',
    distanceKm: 1.8,
    aiTrustScore: 99,
    rating: 5.0,
    reviewsCount: 41,
    aadhaarStatus: 'verified',
    aadhaarMaskedRef: 'UIDAI-XXXX-5520-APPROVED',
    skillsProofVideoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    locationName: 'Velachery, Chennai',
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    bio: 'Ex-military tactical reserve security officer for high-profile public events.',
    lat: 12.9796,
    lng: 80.2215,
    completionRate: 99,
    cancellationRate: 0,
    feedbackScore: 98,
    gigsCompleted: 41
  },
  {
    id: 'W-004',
    name: 'Anjali Devi',
    avatar: 'AD',
    category: 'housekeeping',
    skills: ['Deep Cleaning', 'Eco Sanitization', 'Post-Event Clean', 'Guest Amenities'],
    experience: 3,
    phone: '+91 88432 XXXXX',
    distanceKm: 0.9,
    aiTrustScore: 92,
    rating: 4.7,
    reviewsCount: 19,
    aadhaarStatus: 'verified',
    aadhaarMaskedRef: 'UIDAI-XXXX-9904-APPROVED',
    skillsProofVideoUrl: '',
    locationName: 'Mylapore, Chennai',
    availableDays: ['Mon', 'Tue', 'Thu', 'Fri', 'Sat'],
    bio: 'Specialist in deep sanitation operations for corporate event setups and household residencies.',
    lat: 13.0330,
    lng: 80.2680,
    completionRate: 92,
    cancellationRate: 5,
    feedbackScore: 92,
    gigsCompleted: 19
  },
  {
    id: 'W-005',
    name: 'Murugan Thangavel',
    avatar: 'MT',
    category: 'construction',
    skills: ['Masonry', 'Structural Layout', 'Slab Work', 'Blueprint Reading'],
    experience: 8,
    phone: '+91 97755 XXXXX',
    distanceKm: 2.3,
    aiTrustScore: 96,
    rating: 4.9,
    reviewsCount: 30,
    aadhaarStatus: 'verified',
    aadhaarMaskedRef: 'UIDAI-XXXX-6288-APPROVED',
    skillsProofVideoUrl: '',
    locationName: 'Guindy, Chennai',
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    bio: 'Licensed structural mason specialized in premium brickwork and fast modular concrete designs.',
    lat: 13.0067,
    lng: 80.2206,
    completionRate: 96,
    cancellationRate: 3,
    feedbackScore: 95,
    gigsCompleted: 30
  },
  {
    id: 'W-006',
    name: 'Selvakumar R.',
    avatar: 'SR',
    category: 'delivery',
    skills: ['Heavy Transit', 'Route Optimization', 'Express Dispatch', 'Cargo Lashing'],
    experience: 5,
    phone: '+91 94433 XXXXX',
    distanceKm: 1.5,
    aiTrustScore: 91,
    rating: 4.6,
    reviewsCount: 25,
    aadhaarStatus: 'verified',
    aadhaarMaskedRef: 'UIDAI-XXXX-2035-APPROVED',
    skillsProofVideoUrl: '',
    locationName: 'Nungambakkam, Chennai',
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    bio: 'Reliable distribution and heavy-cargo dispatch coordinator with pristine traffic record.',
    lat: 13.0587,
    lng: 80.2417,
    completionRate: 91,
    cancellationRate: 8,
    feedbackScore: 90,
    gigsCompleted: 25
  }
];

export default function GigMarketplace() {
  const [lang, setLang] = useState<'en' | 'ta' | 'hi'>('en');
  const [currentTab, setCurrentTab] = useState<'employer' | 'worker' | 'developer'>('employer');

  const t = TRANSLATIONS[lang];

  // Global app states
  const [workers, setWorkers] = useState<Worker[]>(INITIAL_WORKERS);
  const [toasts, setToasts] = useState<string[]>([]);
  
  const addLocalToast = (msg: string) => {
    setToasts(prev => [...prev, msg]);
    setTimeout(() => {
      setToasts(prev => prev.slice(1));
    }, 4500);
  };

  // --- EMPLOYER FLOW STATES ---
  const [gigCategory, setGigCategory] = useState<'catering' | 'housekeeping' | 'delivery' | 'construction' | 'security'>('catering');
  const [gigLocation, setGigLocation] = useState('Adyar, Chennai');
  const [gigDate, setGigDate] = useState('2026-07-28');
  const [gigHeadcount, setGigHeadcount] = useState(3);
  const [gigPay, setGigPay] = useState(250);
  const [gigDuration, setGigDuration] = useState(6);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(true);

  // Invited tracking
  const [invitedWorkerIds, setInvitedWorkerIds] = useState<string[]>([]);
  // Active contract with selected worker
  const [activeBooking, setActiveBooking] = useState<{
    worker: Worker;
    category: string;
    pay: number;
    headcount: number;
    duration: number;
    location: string;
    status: 'pending' | 'accepted' | 'escrow_funded' | 'checked_in' | 'completed' | 'cancelled' | 'disputed';
    ledgerHash?: string;
  } | null>(null);

  // Escrow balance simulations
  const [escrowLedger, setEscrowLedger] = useState<{
    balanceHeld: number;
    releasedTotal: number;
    transactions: { id: string; type: string; amount: number; workerName: string; date: string; status: string }[];
  }>({
    balanceHeld: 0,
    releasedTotal: 84000,
    transactions: [
      { id: 'TX-492', type: 'Escrow Release', amount: 4500, workerName: 'Karthik Raja', date: '2026-07-15', status: 'Completed' },
      { id: 'TX-481', type: 'Escrow Release', amount: 3200, workerName: 'Anjali Devi', date: '2026-07-12', status: 'Completed' }
    ]
  });

  // AI backup suggestion modal overlay state
  const [showBackupAlert, setShowBackupAlert] = useState(false);
  const [backupWorker, setBackupWorker] = useState<Worker | null>(null);

  // --- WORKER FLOW STATES ---
  const [workerPhone, setWorkerPhone] = useState('');
  const [workerOtp, setWorkerOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [workerAadhaar, setWorkerAadhaar] = useState('');
  const [isAadhaarVerifying, setIsAadhaarVerifying] = useState(false);
  const [isWorkerLoggedIn, setIsWorkerLoggedIn] = useState(false);
  const [workerSessionProfile, setWorkerSessionProfile] = useState<Worker | null>(null);

  // Video proof preview states
  const [videoPlayingId, setVideoPlayingId] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Attendance states
  const [attendanceLogs, setAttendanceLogs] = useState<{
    type: 'check_in' | 'check_out';
    timestamp: string;
    coords: string;
    hash: string;
  }[]>([]);
  const [isCurrentlyCheckedIn, setIsCurrentlyCheckedIn] = useState(false);

  // Multi-step Rating feedback state
  const [ratedWorkerId, setRatedWorkerId] = useState<string | null>(null);
  const [ratingValue, setRatingValue] = useState(5);
  const [ratingComment, setRatingComment] = useState('');

  // Voice recording simulation states
  const [isRecording, setIsRecording] = useState(false);
  const [voiceWave, setVoiceWave] = useState<number[]>([10, 20, 10, 40, 50, 10, 20, 30, 40, 20, 10]);
  const [transcribedBio, setTranscribedBio] = useState('');

  // Chat widgets simulated
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatTarget, setChatTarget] = useState<Worker | null>(null);
  const [chatInputValue, setChatInputValue] = useState('');
  const [chatFeed, setChatFeed] = useState<{ sender: 'employer' | 'worker'; text: string; time: string; e2eHash: string }[]>([
    { sender: 'worker', text: 'Hello, I received your booking invite for the Chennai Catering slot. Is transport provided to the Adyar location?', time: '21:15', e2eHash: 'AES256-4d1a58e' }
  ]);

  // Handle language switch
  const changeLanguage = (newLang: 'en' | 'ta' | 'hi') => {
    setLang(newLang);
    addLocalToast(`Language configured to ${newLang.toUpperCase()}`);
  };

  // Run real-time distance calculations and mock search rankings
  const handlePostAndSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    addLocalToast('AI Trust Model querying location-based cache nodes...');
    
    setTimeout(() => {
      setIsSearching(false);
      setHasSearched(true);
      addLocalToast(`Discovered ${workers.filter(w => w.category === gigCategory).length} Aadhaar-verified ${gigCategory} specialists near ${gigLocation}`);
    }, 1200);
  };

  // Simulate worker invitation
  const handleInviteWorker = (worker: Worker) => {
    if (invitedWorkerIds.includes(worker.id)) return;
    setInvitedWorkerIds(prev => [...prev, worker.id]);
    addLocalToast(`Secured invitation dispatch pipeline for ${worker.name}. No phone exposed.`);
    
    // Simulate auto-acceptance by worker in 3 seconds to drive flow
    setTimeout(() => {
      addLocalToast(`Notification: ${worker.name} has ACCEPTED your invitation. Lock escrow to secure booking.`);
      setActiveBooking({
        worker,
        category: gigCategory,
        pay: gigPay,
        headcount: gigHeadcount,
        duration: gigDuration,
        location: gigLocation,
        status: 'accepted'
      });
    }, 2800);
  };

  // Escrow funding flow
  const handleFundEscrow = () => {
    if (!activeBooking) return;
    const totalAmount = activeBooking.pay * activeBooking.duration * activeBooking.headcount;
    setEscrowLedger(prev => ({
      ...prev,
      balanceHeld: prev.balanceHeld + totalAmount
    }));
    const newHash = 'AES-' + Math.random().toString(36).substring(2, 9).toUpperCase();
    setActiveBooking(prev => prev ? { ...prev, status: 'escrow_funded', ledgerHash: newHash } : null);
    addLocalToast(`Escrow Funded: ₹${totalAmount} secured in sovereign smart vault with proof-key ${newHash}`);
  };

  // Simulating cancellation & AI Backup suggestion
  const handleSimulateCancel = () => {
    if (!activeBooking) return;
    const cancelledWorker = activeBooking.worker;
    addLocalToast(`System Alert: Punctuality failure! ${cancelledWorker.name} flagged for cancellation.`);
    
    // Find backup worker of same category
    const foundBackup = workers.find(w => w.category === activeBooking.category && w.id !== cancelledWorker.id);
    if (foundBackup) {
      setBackupWorker(foundBackup);
      setShowBackupAlert(true);
    }
    
    setActiveBooking(prev => prev ? { ...prev, status: 'cancelled' } : null);
  };

  // Accept dynamic AI replacement
  const handleAcceptBackup = () => {
    if (!backupWorker || !activeBooking) return;
    setActiveBooking({
      worker: backupWorker,
      category: activeBooking.category,
      pay: activeBooking.pay,
      headcount: activeBooking.headcount,
      duration: activeBooking.duration,
      location: activeBooking.location,
      status: 'escrow_funded',
      ledgerHash: activeBooking.ledgerHash
    });
    setShowBackupAlert(false);
    addLocalToast(`Autopilot replacement engaged: ${backupWorker.name} matched instantly with inherited Escrow vault.`);
  };

  // Disbursment of Escrow Payment on complete
  const handleReleaseEscrow = () => {
    if (!activeBooking) return;
    const totalAmount = activeBooking.pay * activeBooking.duration * activeBooking.headcount;
    setEscrowLedger(prev => ({
      balanceHeld: Math.max(0, prev.balanceHeld - totalAmount),
      releasedTotal: prev.releasedTotal + totalAmount,
      transactions: [
        {
          id: 'TX-' + Math.floor(100 + Math.random() * 900),
          type: 'Escrow Release',
          amount: totalAmount,
          workerName: activeBooking.worker.name,
          date: '2026-07-22',
          status: 'Completed'
        },
        ...prev.transactions
      ]
    }));
    setRatedWorkerId(activeBooking.worker.id); // Open rating box automatically
    setActiveBooking(prev => prev ? { ...prev, status: 'completed' } : null);
    addLocalToast(`Escrow Transferred: ₹${totalAmount} successfully routed to ${activeBooking.worker.name}`);
  };

  // Simulate Geo-tagged Attendance checking with HTML5 or high accuracy coordinate generation
  const handleGeoCheckIn = () => {
    const lat = (9.9252 + (Math.random() - 0.5) * 0.01).toFixed(4);
    const lng = (78.1198 + (Math.random() - 0.5) * 0.01).toFixed(4);
    const mockCoords = `${lat}° N, ${lng}° E (Chennai High-Precision Gateway)`;
    const now = new Date().toLocaleTimeString();
    const hash = 'SHA-' + Math.random().toString(36).substring(2, 9).toUpperCase();

    const newLog = {
      type: 'check_in' as const,
      timestamp: now,
      coords: mockCoords,
      hash
    };

    setAttendanceLogs(prev => [newLog, ...prev]);
    setIsCurrentlyCheckedIn(true);
    addLocalToast(`Check-In Secured: Coordinates ${lat}, ${lng} signed to compliance ledger.`);

    if (activeBooking) {
      setActiveBooking(prev => prev ? { ...prev, status: 'checked_in' } : null);
    }
  };

  const handleGeoCheckOut = () => {
    const lat = (9.9252 + (Math.random() - 0.5) * 0.01).toFixed(4);
    const lng = (78.1198 + (Math.random() - 0.5) * 0.01).toFixed(4);
    const mockCoords = `${lat}° N, ${lng}° E (Chennai High-Precision Gateway)`;
    const now = new Date().toLocaleTimeString();
    const hash = 'SHA-' + Math.random().toString(36).substring(2, 9).toUpperCase();

    const newLog = {
      type: 'check_out' as const,
      timestamp: now,
      coords: mockCoords,
      hash
    };

    setAttendanceLogs(prev => [newLog, ...prev]);
    setIsCurrentlyCheckedIn(false);
    addLocalToast(`Check-Out Secured: Event hours successfully compiled into transaction.`);
  };

  // Voice profile input simulation
  const handleStartVoiceRecording = () => {
    setIsRecording(true);
    setTranscribedBio('');
    
    // Simulate speech transcription updating after 3.5 seconds
    setTimeout(() => {
      setIsRecording(false);
      let text = '';
      if (lang === 'en') {
        text = 'Experienced Catering assistant skilled in traditional clay oven grilling, active food safety protocols, and serving over 500 guests at Madurai and Chennai cultural banquets.';
      } else if (lang === 'ta') {
        text = 'சென்னையில் பாரம்பரிய உணவு மற்றும் கேட்டரிங் துறையில் 5 ஆண்டுகள் சிறந்த அனுபவம் உள்ள சமையல் உதவியாளர். சுகாதார வழிமுறைகளை சரியாக பின்பற்றுவேன்.';
      } else {
        text = 'चेन्नई में पारंपरिक खान-पान और कैटरिंग के क्षेत्र में 5 वर्ष का कार्य अनुभव। स्वच्छता और स्वच्छता मानकों का पूरा ध्यान रखता हूँ।';
      }
      setTranscribedBio(text);
      addLocalToast('Speech synthesized and translated successfully with native dialect parsing.');
    }, 3500);
  };

  // Voice wave pulsing interval
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setVoiceWave(prev => prev.map(() => Math.floor(Math.random() * 50) + 10));
      }, 120);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Post worker profile setup
  const handleWorkerRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workerPhone) {
      addLocalToast('Provide a valid mobile number.');
      return;
    }
    
    if (!isOtpSent) {
      setIsOtpSent(true);
      addLocalToast('OTP security payload dispatched to worker handset.');
      return;
    }

    if (workerOtp.length !== 6) {
      addLocalToast('Provide the 6-digit confirmation key.');
      return;
    }

    setIsAadhaarVerifying(true);
    addLocalToast('Interfacing secure Aadhaar bridge to UIDAI registry...');

    setTimeout(() => {
      setIsAadhaarVerifying(false);
      setIsWorkerLoggedIn(true);
      
      const newWorker: Worker = {
        id: 'W-LOCAL',
        name: 'Ramesh Krishnan',
        avatar: 'RK',
        category: 'catering',
        skills: ['Traditional Desserts', 'Food Safety', 'Buffet Logistics'],
        experience: 5,
        phone: '+91 94455 XXXXX',
        distanceKm: 0.8,
        aiTrustScore: 97,
        rating: 4.8,
        reviewsCount: 12,
        aadhaarStatus: 'verified',
        aadhaarMaskedRef: 'UIDAI-XXXX-8429-APPROVED',
        skillsProofVideoUrl: '',
        locationName: 'Adyar, Chennai',
        availableDays: ['Fri', 'Sat', 'Sun'],
        bio: transcribedBio || 'Aadhaar-verified traditional South-Indian banquet dessert master.',
        lat: 13.0075,
        lng: 80.2580,
        completionRate: 97,
        cancellationRate: 1,
        feedbackScore: 96,
        gigsCompleted: 12
      };

      setWorkerSessionProfile(newWorker);
      // Append Ramesh to the pool so employers can immediately discover him
      setWorkers(prev => [newWorker, ...prev]);
      addLocalToast('Verification secure. রমেশ কৃষ্ণন registered as Verified Catering Worker.');
    }, 2000);
  };

  // Submit worker rating
  const handleWorkerRatingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ratedWorkerId) return;
    
    // Update worker rating dynamically in local pool
    setWorkers(prev => prev.map(w => {
      if (w.id === ratedWorkerId) {
        const totalRating = w.rating * w.reviewsCount + ratingValue;
        const newCount = w.reviewsCount + 1;
        
        // Calculate new feedback score based on 1-5 rating transformed into 0-100 percentage
        const currentFeedbackFactor = w.feedbackScore * w.reviewsCount;
        const newFeedbackRating = ratingValue * 20; // 5 stars = 100%, 4 stars = 80%, etc.
        const newFeedbackScore = Math.min(100, Math.max(0, Math.round((currentFeedbackFactor + newFeedbackRating) / newCount)));
        const newGigsCompleted = w.gigsCompleted + 1;
        // Improve completion rate slightly as reward for successful checkout
        const newCompletionRate = Math.min(100, w.completionRate + 0.5);

        return {
          ...w,
          rating: Number((totalRating / newCount).toFixed(2)),
          reviewsCount: newCount,
          feedbackScore: newFeedbackScore,
          gigsCompleted: newGigsCompleted,
          completionRate: newCompletionRate
        };
      }
      return w;
    }));

    setRatedWorkerId(null);
    setRatingComment('');
    addLocalToast('Thank you! Trust metrics updated on compliance database ledger.');
  };

  // Triggering simulation of video play inside modal
  const handleTogglePlayVideo = (id: string) => {
    if (videoPlayingId === id) {
      setVideoPlayingId(null);
    } else {
      setVideoPlayingId(id);
    }
  };

  // Chat message submit
  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInputValue.trim()) return;

    const newMsg = {
      sender: 'employer' as const,
      text: chatInputValue,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      e2eHash: 'AES256-' + Math.random().toString(36).substring(2, 6)
    };

    setChatFeed(prev => [...prev, newMsg]);
    setChatInputValue('');

    // Simulate response
    setTimeout(() => {
      setChatFeed(prev => [...prev, {
        sender: 'worker',
        text: 'Understood. Yes, I have my Aadhaar compliance badge active. I will meet you at Adyar gate on time. Ready to check in!',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        e2eHash: 'AES256-R' + Math.random().toString(36).substring(2, 6)
      }]);
    }, 1800);
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 font-sans" id="gig-worker-marketplace">
      
      {/* Banner / Selector */}
      <div className="bg-white border-b border-slate-200 sticky top-14 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center space-x-3 text-left">
            <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-md shadow-blue-600/10 shrink-0">
              <Compass className="h-5 w-5 animate-spin-slow" />
            </div>
            <div>
              <h1 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-1.5">
                WorkNear Gig-Marketplace <span className="bg-blue-100 text-blue-700 font-mono text-[9px] px-1.5 py-0.5 rounded uppercase">V2</span>
              </h1>
              <p className="text-[10px] text-slate-500 font-medium">{t.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            {/* Language switches */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button 
                onClick={() => changeLanguage('en')} 
                className={`px-2 py-1 text-[10px] font-bold rounded-md transition ${lang === 'en' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
              >
                ENG
              </button>
              <button 
                onClick={() => changeLanguage('ta')} 
                className={`px-2 py-1 text-[10px] font-bold rounded-md transition ${lang === 'ta' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
              >
                தமிழ்
              </button>
              <button 
                onClick={() => changeLanguage('hi')} 
                className={`px-2 py-1 text-[10px] font-bold rounded-md transition ${lang === 'hi' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
              >
                हिंदी
              </button>
            </div>

            {/* Portal Tab selector */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                onClick={() => setCurrentTab('employer')}
                className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-md transition flex items-center gap-1 ${
                  currentTab === 'employer' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                <UserCheck className="h-3.5 w-3.5" />
                <span>{t.employerPortal}</span>
              </button>
              <button
                onClick={() => setCurrentTab('worker')}
                className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-md transition flex items-center gap-1 ${
                  currentTab === 'worker' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                <User className="h-3.5 w-3.5" />
                <span>{t.workerPortal}</span>
              </button>
              <button
                onClick={() => setCurrentTab('developer')}
                className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-md transition flex items-center gap-1 ${
                  currentTab === 'developer' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                <Database className="h-3.5 w-3.5" />
                <span>Developer Sandbox</span>
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Floating alert stream */}
      <div className="fixed bottom-5 left-5 z-40 space-y-2 max-w-xs pointer-events-none">
        {toasts.map((toast, idx) => (
          <div key={idx} className="p-3 bg-slate-900 border border-slate-800 text-white text-[10px] font-bold rounded-xl shadow-2xl flex items-center space-x-2 pointer-events-auto animate-bounce">
            <Shield className="h-4 w-4 text-sky-400 shrink-0" />
            <span>{toast}</span>
          </div>
        ))}
      </div>

      {/* Main Dynamic View Area */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 text-left">
        
        {/* VIEW 1: EMPLOYER HUB */}
        {currentTab === 'employer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Post Gig Form Panel */}
            <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
              
              <div className="border-b border-slate-100 pb-4">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block">AI-MATCHING SEARCH ENGINE</span>
                <h2 className="text-lg font-black text-slate-900 mt-1">{t.postGig}</h2>
                <p className="text-[10px] text-slate-500 mt-1">Autopilots screening based on Aadhaar status, distance, and rating profile logs.</p>
              </div>

              <form onSubmit={handlePostAndSearch} className="space-y-4 text-xs font-bold text-slate-700">
                
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1">{t.gigTitle}</label>
                  <select
                    value={gigCategory}
                    onChange={(e) => setGigCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 outline-none focus:border-blue-500 font-bold"
                  >
                    <option value="catering">🍳 {t.catering}</option>
                    <option value="housekeeping">🧹 {t.housekeeping}</option>
                    <option value="delivery">🛵 {t.delivery}</option>
                    <option value="construction">🧱 {t.construction}</option>
                    <option value="security">🛡️ {t.security}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1">{t.location}</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={gigLocation}
                      onChange={(e) => setGigLocation(e.target.value)}
                      placeholder="e.g. Adyar, Chennai"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1">{t.date}</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="date"
                        value={gigDate}
                        onChange={(e) => setGigDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1">{t.headcount}</label>
                    <input
                      type="number"
                      value={gigHeadcount}
                      onChange={(e) => setGigHeadcount(Number(e.target.value))}
                      min={1}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1">{t.pay}</label>
                    <input
                      type="number"
                      value={gigPay}
                      onChange={(e) => setGigPay(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1">{t.duration}</label>
                    <input
                      type="number"
                      value={gigDuration}
                      onChange={(e) => setGigDuration(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 font-bold"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSearching}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl uppercase tracking-wider transition cursor-pointer flex items-center justify-center space-x-2"
                >
                  {isSearching ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Matching Nearest Nodes...</span>
                    </>
                  ) : (
                    <span>{t.submitGig}</span>
                  )}
                </button>

              </form>

              {/* Escrow Wallet Widget */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mt-6">
                <span className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <CreditCard className="h-3.5 w-3.5 text-blue-600" />
                  <span>{t.escrowPayment}</span>
                </span>
                
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase tracking-wider block">Wallet Balance</span>
                    <span className="text-sm font-black text-slate-900">₹{escrowLedger.balanceHeld} <span className="text-[9px] font-mono font-bold text-emerald-600 bg-emerald-50 px-1 rounded">HELD</span></span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase tracking-wider block">Disbursed Total</span>
                    <span className="text-sm font-black text-slate-950">₹{escrowLedger.releasedTotal}</span>
                  </div>
                </div>

                {activeBooking && activeBooking.status === 'accepted' && (
                  <button
                    onClick={handleFundEscrow}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold py-2 px-3 rounded-lg mt-4 cursor-pointer uppercase tracking-wider"
                  >
                    Fund Booking Escrow (₹{activeBooking.pay * activeBooking.duration * activeBooking.headcount})
                  </button>
                )}

                {activeBooking && activeBooking.status === 'escrow_funded' && (
                  <div className="space-y-2 mt-4">
                    <div className="p-2.5 bg-emerald-50 border border-emerald-150 rounded-xl text-[10px] text-emerald-800 leading-normal">
                      🛡️ Escrow funded for <b>{activeBooking.worker.name}</b>. Awaiting geo-tagged check-in verification before checkout disbursement trigger.
                    </div>
                    <button
                      onClick={handleSimulateCancel}
                      className="w-full border border-rose-350 hover:bg-rose-50 text-rose-700 text-[10px] font-bold py-2 rounded-lg cursor-pointer uppercase tracking-wider"
                    >
                      {t.cancelSimulate}
                    </button>
                  </div>
                )}

                {activeBooking && activeBooking.status === 'checked_in' && (
                  <div className="space-y-2 mt-4">
                    <div className="p-2.5 bg-amber-50 border border-amber-150 rounded-xl text-[10px] text-amber-800 leading-normal">
                      ✓ Worker successfully checked-in. Coordinate validation handshake approved. Disburse when service concludes.
                    </div>
                    <button
                      onClick={handleReleaseEscrow}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold py-2 rounded-lg cursor-pointer uppercase tracking-wider"
                    >
                      Verify Complete & Release Escrow
                    </button>
                  </div>
                )}
              </div>

            </div>

            {/* Right Worker Results Listing & Map View */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Dynamic Rating Overlay */}
              {ratedWorkerId && (
                <div className="bg-amber-50 border border-amber-150 rounded-3xl p-6 text-left">
                  <h3 className="font-black text-slate-900 flex items-center gap-2 text-sm uppercase tracking-wide">
                    <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                    <span>Submit Compliant Worker Performance Assessment</span>
                  </h3>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Your assessment contributes to the sovereign decentralized AI Trust Score parameter. Please assess truthfully.
                  </p>
                  
                  <form onSubmit={handleWorkerRatingSubmit} className="mt-4 space-y-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] text-slate-600 font-bold">Select Stars:</span>
                      {[1, 2, 3, 4, 5].map((stars) => (
                        <button
                          type="button"
                          key={stars}
                          onClick={() => setRatingValue(stars)}
                          className="p-1 focus:outline-none cursor-pointer"
                        >
                          <Star className={`h-5 w-5 ${ratingValue >= stars ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}`} />
                        </button>
                      ))}
                    </div>

                    <input
                      type="text"
                      placeholder="e.g. Completed catering slot on-time. Highly sterile banana leaf plating hygiene."
                      value={ratingComment}
                      onChange={(e) => setRatingComment(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-800 outline-none focus:border-blue-500 font-bold"
                    />

                    <div className="flex items-center space-x-2 justify-end">
                      <button
                        type="button"
                        onClick={() => setRatedWorkerId(null)}
                        className="px-3 py-1.5 text-xs text-slate-500 font-bold uppercase cursor-pointer"
                      >
                        Skip
                      </button>
                      <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-1.5 rounded-xl uppercase tracking-wider cursor-pointer"
                      >
                        File Rating Report
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Autopilot AI Backup suggestions */}
              {showBackupAlert && backupWorker && (
                <div className="bg-blue-50 border border-blue-200 rounded-3xl p-6 text-left relative overflow-hidden">
                  <div className="absolute top-0 right-0 h-24 w-24 bg-blue-100 rounded-full blur-2xl pointer-events-none" />
                  
                  <span className="bg-blue-200 text-blue-800 font-mono text-[9px] px-2 py-0.5 rounded uppercase tracking-wider font-bold">
                    🛡️ AI BACKUP AUTOPILOT ACTIVE
                  </span>
                  <h3 className="text-sm font-black text-slate-900 mt-2 uppercase tracking-wide">
                    Engage Zero-Interruption Backup Sourcing?
                  </h3>
                  <p className="text-[11px] text-slate-600 leading-relaxed mt-1">
                    Worker canceled. Autopilot model has mapped an adjacent verified worker <b>{backupWorker.name}</b> ({backupWorker.distanceKm} km away) holding <b>{backupWorker.aiTrustScore}% Trust Rating</b>.
                  </p>

                  <div className="mt-4 flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-100 max-w-md">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                        {backupWorker.avatar}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-black text-slate-800">{backupWorker.name}</span>
                          <span className="text-[10px] text-blue-600 font-bold">{backupWorker.distanceKm} km away</span>
                        </div>
                        <span className="text-[9px] font-mono text-slate-400 block">{backupWorker.aadhaarMaskedRef}</span>
                      </div>
                    </div>
                    <div className="shrink-0 scale-90 origin-right">
                      <TrustScoreComponent
                        initialCompletionRate={backupWorker.completionRate}
                        initialCancellationRate={backupWorker.cancellationRate}
                        initialFeedbackScore={backupWorker.feedbackScore}
                        gigsCompleted={backupWorker.gigsCompleted}
                        workerName={backupWorker.name}
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center space-x-3">
                    <button
                      onClick={() => setShowBackupAlert(false)}
                      className="px-3 py-1.5 text-xs text-slate-500 font-bold uppercase tracking-wider hover:text-slate-800 cursor-pointer"
                    >
                      Dismiss Backup
                    </button>
                    <button
                      onClick={handleAcceptBackup}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl uppercase tracking-wider cursor-pointer"
                    >
                      Match & Secure Escrow Now
                    </button>
                  </div>
                </div>
              )}

              {/* Active Booking status tracker */}
              {activeBooking && (
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="text-left">
                      <span className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-widest">Active Dispatch Log</span>
                      <h3 className="font-black text-slate-900 mt-0.5">🍳 {activeBooking.worker.name} Booking Info</h3>
                    </div>
                    <span className="px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-widest bg-blue-50 text-blue-600 border border-blue-150 rounded-full">
                      STATUS: {activeBooking.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 text-xs font-bold text-slate-800">
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase tracking-wider">Assigned Skill</span>
                      <span className="text-xs capitalize">{activeBooking.category}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase tracking-wider">Aadhaar Ref</span>
                      <span className="text-[10px] font-mono text-slate-700">{activeBooking.worker.aadhaarMaskedRef}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase tracking-wider">Compliance escrow Vault</span>
                      <span className="text-[10px] font-mono text-emerald-600">{activeBooking.ledgerHash || 'Pending funding'}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase tracking-wider">Attendance Check</span>
                      <span className="text-[10px]">{activeBooking.status === 'checked_in' ? '🟢 Checked In' : '🔴 PENDING'}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => setIsChatOpen(true)}
                      className="text-xs font-bold text-blue-600 hover:underline flex items-center space-x-1.5 cursor-pointer"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>E2E Encrypted Chat Box (Active)</span>
                    </button>

                    <div className="text-[9px] font-mono font-bold text-slate-400">
                      SECURE MATCH TOKEN: GIG-{activeBooking.worker.id}
                    </div>
                  </div>
                </div>
              )}

              {/* Interactive Google Map with Nearby Search */}
              <GigNearbyMap
                workers={workers as any[]}
                selectedCategory={gigCategory}
                centerAddress={gigLocation}
                onInviteWorker={handleInviteWorker}
                invitedWorkerIds={invitedWorkerIds}
              />

              {/* Real-time Workers Pool ranked by proximity and trust */}
              <div className="space-y-4 text-left">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                    <Compass className="h-4 w-4 text-blue-600 animate-spin-slow" />
                    <span>{t.nearbyWorkers}</span>
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400">Chennai Grid Node (Active)</span>
                </div>

                {hasSearched ? (
                  <div className="space-y-4">
                    {workers
                      .filter(w => w.category === gigCategory)
                      .map((worker) => (
                        <div 
                          key={worker.id}
                          className="bg-white border border-slate-200 rounded-3xl p-5 hover:border-blue-400 hover:shadow-lg transition-all duration-200"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                            
                            {/* Profile details */}
                            <div className="flex items-start space-x-4">
                              <div className="h-12 w-12 rounded-2xl bg-blue-100 text-blue-700 font-black text-lg flex items-center justify-center shrink-0">
                                {worker.avatar}
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                  <h4 className="font-black text-slate-900 text-sm uppercase tracking-wide">{worker.name}</h4>
                                  <span className="bg-emerald-50 text-emerald-700 font-mono text-[9px] px-2 py-0.5 rounded border border-emerald-150 flex items-center space-x-1">
                                    <Shield className="h-3 w-3" />
                                    <span>{t.verified}</span>
                                  </span>
                                </div>
                                <p className="text-[10px] text-slate-500 font-mono block">Masked UIDAI Reference: {worker.aadhaarMaskedRef}</p>
                                
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1.5 text-[10px] text-slate-600 font-bold">
                                  <span className="flex items-center space-x-1">
                                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                                    <span>{worker.locationName} ({worker.distanceKm} km away)</span>
                                  </span>
                                  <span className="flex items-center space-x-1">
                                    <Award className="h-3.5 w-3.5 text-slate-400" />
                                    <span>{worker.experience} Years Exp</span>
                                  </span>
                                  <span className="flex items-center space-x-1">
                                    <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                                    <span>{worker.rating} ({worker.reviewsCount} reviews)</span>
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Trust Rating & Invite Option */}
                            <div className="text-right flex flex-col justify-between items-end gap-2 shrink-0">
                              <TrustScoreComponent
                                initialCompletionRate={worker.completionRate}
                                initialCancellationRate={worker.cancellationRate}
                                initialFeedbackScore={worker.feedbackScore}
                                gigsCompleted={worker.gigsCompleted}
                                workerName={worker.name}
                              />

                              <div className="flex items-center space-x-2 mt-2">
                                {worker.skillsProofVideoUrl && (
                                  <button
                                    onClick={() => handleTogglePlayVideo(worker.id)}
                                    className="p-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-600 transition flex items-center space-x-1 cursor-pointer"
                                    title="View Skill Proof Video"
                                  >
                                    <Video className="h-4 w-4" />
                                    <span className="text-[10px] font-bold">Proof Video</span>
                                  </button>
                                )}

                                <button
                                  onClick={() => handleInviteWorker(worker)}
                                  className={`px-4 py-2 rounded-xl text-[10px] font-extrabold uppercase tracking-widest transition cursor-pointer ${
                                    invitedWorkerIds.includes(worker.id) 
                                      ? 'bg-slate-150 text-slate-400 border border-slate-200 cursor-not-allowed'
                                      : 'bg-slate-900 hover:bg-slate-800 text-white shadow-md'
                                  }`}
                                >
                                  {invitedWorkerIds.includes(worker.id) ? t.invited : t.invite}
                                </button>
                              </div>

                            </div>

                          </div>

                          {/* Skill badges list */}
                          <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-slate-100">
                            {worker.skills.map((skill, sIdx) => (
                              <span key={sIdx} className="text-[10px] font-bold text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
                                {skill}
                              </span>
                            ))}
                          </div>

                          {/* Render Video Player if playing */}
                          {videoPlayingId === worker.id && worker.skillsProofVideoUrl && (
                            <div className="mt-4 p-4 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[9px] font-mono font-bold text-sky-400 uppercase tracking-widest">
                                  🎥 DEPLOYED GIG-SKILL EVIDENCE STREAM
                                </span>
                                <button onClick={() => setVideoPlayingId(null)} className="text-slate-400 hover:text-white text-[10px] font-bold">
                                  Close Stream
                                </button>
                              </div>
                              <video 
                                ref={videoRef}
                                controls
                                autoPlay
                                className="w-full h-48 bg-slate-900 rounded-xl"
                                src={worker.skillsProofVideoUrl}
                              />
                            </div>
                          )}

                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="bg-white border border-dashed border-slate-300 rounded-3xl p-12 text-center text-slate-400 font-bold text-xs">
                    Please submit your gig requirements query in the left panel to execute nearby search coordinates.
                  </div>
                )}

              </div>

            </div>

          </div>
        )}

        {/* VIEW 2: WORKER PORTAL */}
        {currentTab === 'worker' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Hand: Registration & Voice-Input Profile Setup */}
            <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
              
              <div className="border-b border-slate-100 pb-4">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block">WORKER REGISTRATION BRIDGE</span>
                <h2 className="text-lg font-black text-slate-900 mt-1">Aadhaar verified Profiling</h2>
                <p className="text-[10px] text-slate-500 mt-1">Includes high accuracy real-time speech-to-text synthesis for non-literate candidates.</p>
              </div>

              {!isWorkerLoggedIn ? (
                <form onSubmit={handleWorkerRegister} className="space-y-4 text-xs font-bold text-slate-700">
                  
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1">Mobile Contact (For OTP validation)</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="tel"
                        value={workerPhone}
                        onChange={(e) => setWorkerPhone(e.target.value)}
                        placeholder="+91 99000 XXXXX"
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 outline-none focus:border-blue-500 font-bold"
                      />
                    </div>
                  </div>

                  {isOtpSent && (
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1">6-Digit Verification OTP</label>
                      <input
                        type="text"
                        maxLength={6}
                        value={workerOtp}
                        onChange={(e) => setWorkerOtp(e.target.value)}
                        placeholder="123456"
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 outline-none focus:border-blue-500 font-mono tracking-widest font-black"
                      />
                    </div>
                  )}

                  {/* Low Literacy Assistive voice input option */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                    <span className="text-[10px] uppercase tracking-widest text-slate-400 block font-bold">
                      🎙️ {t.voiceInput}
                    </span>
                    <p className="text-[10px] text-slate-500 leading-normal font-semibold">
                      Speak your skills & city location in your comfortable native language (Tamil, Hindi or English). Our AI translates & formats your profile database node automatically.
                    </p>

                    {isRecording ? (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-1 justify-center h-8 bg-blue-50 rounded-xl border border-blue-100">
                          {voiceWave.map((h, index) => (
                            <div 
                              key={index} 
                              className="w-1 bg-blue-600 rounded-full transition-all duration-100" 
                              style={{ height: `${h}%` }} 
                            />
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsRecording(false)}
                          className="w-full bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold py-1.5 rounded-lg uppercase tracking-wider cursor-pointer"
                        >
                          {t.stopVoice}
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={handleStartVoiceRecording}
                        className="w-full bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-[10px] font-bold py-2 rounded-lg flex items-center justify-center space-x-1.5 cursor-pointer"
                      >
                        <Mic className="h-4 w-4 animate-bounce" />
                        <span>{t.startVoice}</span>
                      </button>
                    )}

                    {transcribedBio && (
                      <div className="p-2 bg-white border border-slate-100 rounded-xl text-[10px] text-slate-600 leading-relaxed">
                        <span className="font-bold text-slate-900 uppercase text-[9px] block mb-1">✓ Transcribed Record:</span>
                        "{transcribedBio}"
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl uppercase tracking-wider transition cursor-pointer"
                  >
                    {isOtpSent ? 'Verify & Link Aadhaar KYC' : 'Get OTP Code'}
                  </button>

                </form>
              ) : (
                <div className="space-y-6 text-left">
                  <div className="p-4 bg-emerald-50 border border-emerald-150 rounded-2xl flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-black text-slate-900 text-xs uppercase">Sovereign Profile Verified</h4>
                      <p className="text-[10px] text-emerald-800 mt-1 leading-normal">
                        Ramesh Krishnan connected via masked verification ID <b>UIDAI-XXXX-8429-APPROVED</b>.
                      </p>
                    </div>
                  </div>

                  {/* Profile Info Details card */}
                  <div className="space-y-3 font-bold text-slate-700 text-xs">
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase tracking-wider">Registered Name</span>
                      <span className="text-slate-900">Ramesh Krishnan</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase tracking-wider">Primary Skill Node</span>
                      <span className="text-slate-900 capitalize">Catering Master</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase tracking-wider">Assigned Masked ID</span>
                      <span className="text-slate-900 font-mono text-[10px]">UIDAI-XXXX-8429-APPROVED</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsWorkerLoggedIn(false);
                      setWorkerSessionProfile(null);
                      setWorkers(prev => prev.filter(w => w.id !== 'W-LOCAL'));
                      addLocalToast('Worker session logged out safely.');
                    }}
                    className="w-full border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs py-2 rounded-xl uppercase tracking-wider font-bold cursor-pointer"
                  >
                    Log Out Session
                  </button>
                </div>
              )}

            </div>

            {/* Right Hand: Invites & Attendance Geo Check-In Tracker */}
            <div className="lg:col-span-8 space-y-6 text-left">
              
              {/* Dynamic Geo check-in/out console */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="text-left">
                    <span className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-widest">{t.checkout}</span>
                    <h3 className="font-black text-slate-900 mt-0.5">Compliant Attendance verification</h3>
                  </div>
                  <span className={`px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-widest rounded-full ${
                    isCurrentlyCheckedIn ? 'bg-emerald-50 text-emerald-600 border border-emerald-150' : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}>
                    {isCurrentlyCheckedIn ? 'LIVE: ACTIVE CHECK-IN' : 'STANDBY'}
                  </span>
                </div>

                <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                  Your attendance is verified dynamically through high accuracy coordinate check handshakes. No direct phone numbers are exposed. Check-in logs write directly to secure compliance database audit systems.
                </p>

                {/* Big checkin buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  <button
                    onClick={handleGeoCheckIn}
                    disabled={isCurrentlyCheckedIn}
                    className="h-16 border border-slate-200 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50 text-slate-900 hover:text-emerald-900 rounded-2xl p-4 flex items-center justify-between transition cursor-pointer disabled:opacity-40"
                  >
                    <div className="text-left">
                      <span className="text-xs font-black uppercase block">{t.checkinBtn}</span>
                      <span className="text-[10px] text-slate-400 font-bold">Write coordinate handshake</span>
                    </div>
                    <Compass className="h-6 w-6 text-emerald-600 animate-spin-slow" />
                  </button>

                  <button
                    onClick={handleGeoCheckOut}
                    disabled={!isCurrentlyCheckedIn}
                    className="h-16 border border-slate-200 hover:border-rose-500 bg-slate-50 hover:bg-rose-50 text-slate-900 hover:text-rose-900 rounded-2xl p-4 flex items-center justify-between transition cursor-pointer disabled:opacity-40"
                  >
                    <div className="text-left">
                      <span className="text-xs font-black uppercase block">{t.checkoutBtn}</span>
                      <span className="text-[10px] text-slate-400 font-bold">Close attendance session</span>
                    </div>
                    <Compass className="h-6 w-6 text-rose-600" />
                  </button>
                </div>

                {/* Log outputs visualizer */}
                {attendanceLogs.length > 0 && (
                  <div className="mt-6 border-t border-slate-100 pt-4 space-y-3">
                    <span className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-widest block">Local Ledger Handshake History</span>
                    
                    <div className="max-h-32 overflow-y-auto space-y-2">
                      {attendanceLogs.map((log, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-[11px] font-bold text-slate-700">
                          <span className={log.type === 'check_in' ? 'text-emerald-600 font-black' : 'text-rose-600 font-black'}>
                            {log.type === 'check_in' ? '🟢 Checked In' : '🔴 Checked Out'}
                          </span>
                          <span className="text-slate-500 font-mono text-[10px]">{log.timestamp}</span>
                          <span className="text-slate-400 text-[10px] truncate max-w-xs">{log.coords}</span>
                          <span className="text-[10px] font-mono bg-white border px-1.5 py-0.5 rounded text-slate-400">{log.hash}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Simulated active invitations pipeline */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="font-black text-slate-900 text-sm uppercase tracking-wide flex items-center gap-1.5">
                  <MessageSquare className="h-4.5 w-4.5 text-blue-600" />
                  <span>Your active gig invitations pipeline</span>
                </h3>

                <div className="space-y-3">
                  <div className="p-4 border border-slate-150 rounded-2xl bg-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <span className="bg-blue-100 text-blue-700 font-mono text-[9px] px-2 py-0.5 rounded font-black uppercase">
                        RECRUITMENT BID
                      </span>
                      <h4 className="font-black text-slate-900 text-xs uppercase mt-1.5">Premium Marriage Catering Banquet</h4>
                      <p className="text-[10px] text-slate-500 mt-1 leading-normal font-semibold">
                        Location: Adyar Chennai | Hourly Pay: ₹250 | Duration: 6 Hours | Date: 2026-07-28
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={() => addLocalToast('Invite accepted successfully. Coordinate maps locked.')}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-lg cursor-pointer transition"
                      >
                        Accept Booking
                      </button>
                      <button
                        onClick={() => addLocalToast('Invite declined.')}
                        className="border border-slate-300 hover:bg-slate-100 text-slate-600 text-[10px] font-black uppercase px-3 py-1.5 rounded-lg cursor-pointer transition"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* VIEW 3: DEVELOPER SANDBOX & REQS */}
        {currentTab === 'developer' && (
          <div className="space-y-8 text-left">
            
            {/* MVP PHASING ROADMAP */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <span className="text-[10px] font-mono font-black text-blue-600 uppercase tracking-widest block">SOVEREIGN SYSTEM PLANNING</span>
              <h2 className="text-xl font-black text-slate-900 mt-1 uppercase tracking-tight">{t.roadmapTitle}</h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Strategic roadmap prioritizing catering sector deployment in Chennai to establish early compliance frameworks, localized distance calculations, and real-time OTP caching.
              </p>

              {/* Phased Visual Timeline */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 relative">
                
                {/* Connecting Lines for timelines */}
                <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-0.5 bg-slate-100 -z-0" />

                {/* Phase 1 */}
                <div className="bg-slate-50 border border-blue-200 rounded-2xl p-5 relative z-10">
                  <div className="h-8 w-8 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center mb-4 shadow">
                    01
                  </div>
                  <span className="text-[10px] font-mono text-blue-600 font-extrabold uppercase">Phase 1: Catering (Chennai Only)</span>
                  <h4 className="font-black text-slate-900 text-xs mt-1 uppercase tracking-wide">Target Sector Initialization</h4>
                  <ul className="text-[11px] text-slate-600 space-y-1.5 mt-3 font-semibold list-disc pl-4 leading-normal">
                    <li>Locking UIDAI Aadhaar verification sandbox logic.</li>
                    <li>Sourcing 100+ verified Chennai catering specialists.</li>
                    <li>Local cache clustering for Adyar, T. Nagar & Mylapore coordinates.</li>
                    <li>Low-literacy localized voice input training algorithms.</li>
                  </ul>
                </div>

                {/* Phase 2 */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 relative z-10">
                  <div className="h-8 w-8 rounded-full bg-slate-200 text-slate-600 font-black text-xs flex items-center justify-center mb-4">
                    02
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 font-extrabold uppercase">Phase 2: Horizontal Sector Scale</span>
                  <h4 className="font-black text-slate-900 text-xs mt-1 uppercase tracking-wide">Housekeeping & Delivery</h4>
                  <ul className="text-[11px] text-slate-600 space-y-1.5 mt-3 font-semibold list-disc pl-4 leading-normal">
                    <li>Unlocking security guard credentials & housekeeping pools.</li>
                    <li>Extending caching coordinates to Madurai & Coimbatore.</li>
                    <li>Upgrading video proof uploads storage nodes.</li>
                    <li>Escrow contract dispute resolution systems.</li>
                  </ul>
                </div>

                {/* Phase 3 */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 relative z-10">
                  <div className="h-8 w-8 rounded-full bg-slate-200 text-slate-600 font-black text-xs flex items-center justify-center mb-4">
                    03
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 font-extrabold uppercase">Phase 3: National Deployment</span>
                  <h4 className="font-black text-slate-900 text-xs mt-1 uppercase tracking-wide">All-India Core Expand</h4>
                  <ul className="text-[11px] text-slate-600 space-y-1.5 mt-3 font-semibold list-disc pl-4 leading-normal">
                    <li>Securing direct licensed APIs with UIDAI systems.</li>
                    <li>Full scale across tier 1 and tier 2 Indian municipalities.</li>
                    <li>Cross-region payroll EOR accounting tax integrations.</li>
                    <li>Sovereign decentralized workforce ledger validation.</li>
                  </ul>
                </div>

              </div>
            </div>

            {/* REQS: DB SCHEMA & API ROUTES GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Database Schema Panel */}
              <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                <span className="text-[10px] font-mono font-black text-blue-600 uppercase tracking-widest block">POSTGRESQL STRUCTURED CORE</span>
                <h3 className="font-black text-slate-900 text-sm uppercase tracking-tight">{t.dbSchemaTitle}</h3>
                <p className="text-xs text-slate-500 leading-normal">
                  Designed for strict compliance and zero storage of raw Aadhaar PII (storing only verification status + masked reference IDs).
                </p>

                {/* Schema visualizer code-block */}
                <div className="bg-slate-950 text-slate-200 p-4 rounded-2xl font-mono text-[10px] overflow-x-auto space-y-4 shadow-inner text-left leading-normal border border-slate-800">
                  
                  <div>
                    <span className="text-sky-400">-- 1. Verified Users & Compliance table</span><br />
                    <span className="text-pink-400">CREATE TABLE</span> users (<br />
                    &nbsp;&nbsp;id <span className="text-emerald-400">UUID PRIMARY KEY DEFAULT</span> gen_random_uuid(),<br />
                    &nbsp;&nbsp;phone_hash <span className="text-amber-400">VARCHAR(64) UNIQUE NOT NULL</span>, <span className="text-slate-500">-- HMAC of phone</span><br />
                    &nbsp;&nbsp;role <span className="text-emerald-400">VARCHAR(20) CHECK</span> (role IN ('employer', 'worker')),<br />
                    &nbsp;&nbsp;verification_status <span className="text-emerald-400">VARCHAR(20) DEFAULT</span> 'pending',<br />
                    &nbsp;&nbsp;masked_aadhaar <span className="text-amber-400">VARCHAR(30) UNIQUE</span>, <span className="text-slate-500">-- e.g. UIDAI-XXXX-8429-APPROVED</span><br />
                    &nbsp;&nbsp;created_at <span className="text-emerald-400">TIMESTAMP DEFAULT</span> CURRENT_TIMESTAMP<br />
                    );
                  </div>

                  <div>
                    <span className="text-sky-400">-- 2. Gig Workers Profiles (no phone number exposure)</span><br />
                    <span className="text-pink-400">CREATE TABLE</span> worker_profiles (<br />
                    &nbsp;&nbsp;id <span className="text-emerald-400">UUID PRIMARY KEY REFERENCES</span> users(id) ON DELETE CASCADE,<br />
                    &nbsp;&nbsp;name_cipher <span className="text-amber-400">TEXT NOT NULL</span>, <span className="text-slate-500">-- encrypted at rest</span><br />
                    &nbsp;&nbsp;skills <span className="text-emerald-400">VARCHAR(50)[]</span>, <span className="text-slate-500">-- catering, housekeeping etc</span><br />
                    &nbsp;&nbsp;experience_years <span className="text-emerald-400">INT DEFAULT</span> 0,<br />
                    &nbsp;&nbsp;gps_coords <span className="text-emerald-400">POINT</span>, <span className="text-slate-500">-- Redis geospatial caching index</span><br />
                    &nbsp;&nbsp;ai_trust_score <span className="text-emerald-400">INT CHECK</span> (ai_trust_score BETWEEN 0 AND 100),<br />
                    &nbsp;&nbsp;video_proof_url <span className="text-amber-400">VARCHAR(255)</span><br />
                    );
                  </div>

                  <div>
                    <span className="text-sky-400">-- 3. Escrow Bookings, Verification Logs & Ledger Logs</span><br />
                    <span className="text-pink-400">CREATE TABLE</span> escrow_bookings (<br />
                    &nbsp;&nbsp;id <span className="text-emerald-400">UUID PRIMARY KEY</span>,<br />
                    &nbsp;&nbsp;employer_id <span className="text-emerald-400">UUID REFERENCES</span> users(id),<br />
                    &nbsp;&nbsp;worker_id <span className="text-emerald-400">UUID REFERENCES</span> users(id),<br />
                    &nbsp;&nbsp;amount_held <span className="text-emerald-400">DECIMAL(10,2) NOT NULL</span>,<br />
                    &nbsp;&nbsp;escrow_status <span className="text-emerald-400">VARCHAR(20) CHECK</span> (status IN ('held', 'released', 'disputed')),<br />
                    &nbsp;&nbsp;geographic_handshake_hash <span className="text-amber-400">VARCHAR(64)</span><br />
                    );
                  </div>

                </div>

              </div>

              {/* API Route List Panel */}
              <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                <span className="text-[10px] font-mono font-black text-blue-600 uppercase tracking-widest block">EXPRESS API ARCHITECTURE</span>
                <h3 className="font-black text-slate-900 text-sm uppercase tracking-tight">{t.apiRouteTitle}</h3>
                <p className="text-xs text-slate-500 leading-normal">
                  System API endpoints handling encrypted telemetry payloads, OTP validation triggers, and compliance ledgers.
                </p>

                {/* API routes details tree */}
                <div className="space-y-3 font-bold text-slate-700 text-xs">
                  
                  {/* Route 1 */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono text-blue-600 font-extrabold uppercase">POST /api/auth/otp/request</span>
                      <span className="text-[9px] font-mono text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100">RATE_LIMITED</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-normal">
                      Initiates SMS gateway request with cryptographic OTP challenge signature. Imposes a lock of 3 requests per IP window.
                    </p>
                  </div>

                  {/* Route 2 */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono text-blue-600 font-extrabold uppercase">POST /api/auth/aadhaar/verify</span>
                      <span className="text-[9px] font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">TLS_SECURE_256</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-normal">
                      Hands off 12-digit input to UIDAI licensed bridge, returns reference hash, and wipes input from RAM instantly.
                    </p>
                  </div>

                  {/* Route 3 */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono text-blue-600 font-extrabold uppercase">GET /api/workers/proximity</span>
                      <span className="text-[9px] font-mono text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">GEO_CACHE_INDEX</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-normal">
                      Queries Redis GEORADIUS coordinates cache for Aadhaar-verified workers within a 5km radius, sorted by computed AI Trust Score.
                    </p>
                  </div>

                  {/* Route 4 */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono text-blue-600 font-extrabold uppercase">POST /api/escrow/payment/release</span>
                      <span className="text-[9px] font-mono text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">AUDIT_LOGGED</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-normal">
                      Releases funds after confirming GPS attendance check-out handshake mismatch of less than 10 meters. File-audit logged.
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>
        )}

      </div>

      {/* SECURE CHAT MODAL OVERLAY */}
      {isChatOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" id="encrypted-chat-overlay">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl overflow-hidden flex flex-col h-[480px]" id="encrypted-chat-content">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-sky-400" />
            
            {/* Header info */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 text-left">
              <div className="flex items-center space-x-2.5">
                <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-black text-sm shrink-0">
                  RK
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 uppercase">Secure Chat: Ramesh Krishnan</h4>
                  <span className="text-[9px] font-mono text-emerald-600 font-bold block">✓ AES-256 E2E ENCRYPTED (NO PHONE SHOWN)</span>
                </div>
              </div>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="text-slate-400 hover:text-slate-800 text-xs font-bold uppercase p-1"
              >
                Close
              </button>
            </div>

            {/* Chat Messages flow scrollable */}
            <div className="flex-grow overflow-y-auto py-4 space-y-3 pr-1 text-left">
              {chatFeed.map((msg, index) => (
                <div 
                  key={index}
                  className={`max-w-[85%] flex flex-col space-y-1 ${msg.sender === 'employer' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                >
                  <div className={`p-3 rounded-2xl text-xs font-bold ${
                    msg.sender === 'employer' 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-slate-100 text-slate-800 rounded-bl-none'
                  }`}>
                    {msg.text}
                  </div>
                  <div className="flex items-center space-x-1.5 text-[8px] text-slate-400 font-mono">
                    <span>{msg.time}</span>
                    <span>•</span>
                    <span className="uppercase">{msg.e2eHash}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Form footer */}
            <form onSubmit={handleSendChatMessage} className="pt-3 border-t border-slate-100 flex items-center space-x-2">
              <input
                type="text"
                placeholder="Type your secure message here..."
                value={chatInputValue}
                onChange={(e) => setChatInputValue(e.target.value)}
                className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 font-semibold"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-xl transition cursor-pointer"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
