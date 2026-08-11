/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Candidate, Job, BlogPost, FAQItem } from '../types';

export const mockCandidates: Candidate[] = [
  {
    id: 'cand-1',
    name: 'Sarah Jenkins',
    role: 'Hospitality & Operations Supervisor',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    location: 'San Francisco, CA',
    skills: ['Guest Services', 'Shift Management', 'Event Planning', 'Staff Training', 'EHR Systems', 'Facility Auditing'],
    experience: 8,
    expectedSalary: '$60k - $75k',
    bio: 'Experienced guest services lead dedicated to running smooth lodging operations, employee schedules, and high-fidelity client satisfaction.',
    status: 'Available'
  },
  {
    id: 'cand-2',
    name: 'Marcus Chen',
    role: 'Licensed Journeyman Electrician',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    location: 'Seattle, WA',
    skills: ['Wiring & Circuits', 'Blueprints', 'HVAC Electrical', 'OSHA 30', 'Troubleshooting', 'Local Code Compliance'],
    experience: 6,
    expectedSalary: '$75k - $90k',
    bio: 'Highly meticulous technician specialized in complex industrial electrical wiring, power generation diagnostics, and safety protocol enforcement.',
    status: 'Interviewing'
  },
  {
    id: 'cand-3',
    name: 'Elena Rostova',
    role: 'Executive Catering Chef',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    location: 'New York, NY',
    skills: ['Kitchen Logistics', 'Menu Engineering', 'Food Safety', 'High-Volume Catering', 'Inventory Auditing'],
    experience: 7,
    expectedSalary: '$65k - $80k',
    bio: 'Creative culinarian specialized in premium corporate events, menu scaling, kitchen safety compliance, and team mentoring.',
    status: 'Available'
  },
  {
    id: 'cand-4',
    name: 'David Kalu',
    role: 'Warehouse Logistics Coordinator',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    location: 'Austin, TX',
    skills: ['Inventory Management', 'Forklift Certified', 'Fleet Routing', 'OSHA Safety', 'Supply Chain Auditing'],
    experience: 9,
    expectedSalary: '$55k - $70k',
    bio: 'Veteran warehouse coordinator focused on high-efficiency picking systems, inventory auditing, zero-incident safety, and fleet dispatch.',
    status: 'Available'
  },
  {
    id: 'cand-5',
    name: 'Aria Takahashi',
    role: 'Certified Senior Caregiver',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face',
    location: 'Chicago, IL',
    skills: ['Elder Care', 'Patient Mobilization', 'First Aid / CPR', 'Medical Scheduling', 'Compassionate Support'],
    experience: 5,
    expectedSalary: '$48k - $58k',
    bio: 'Compassionate care professional providing dedicated daily support, non-clinical medical coordination, and visual progress reporting for seniors.',
    status: 'Available'
  }
];

export const mockJobs: Job[] = [
  {
    id: 'job-1',
    title: 'Hospitality & Operations Supervisor',
    company: 'WorkNear Premium Lodging',
    logo: '🏨',
    location: 'San Francisco, CA (Onsite)',
    type: 'Full-time',
    salary: '$62,000 - $74,000',
    description: 'We are seeking an operational leader who obsesses over visual and structural presentation, check-in schedules, and guest comfort. You will supervise front desk personnel, coordinate housekeeping shifts, and maintain high standards.',
    requirements: [
      '4+ years of supervisory hospitality experience.',
      'Excellent organizational, scheduling, and staff-management skills.',
      'Familiarity with local health codes and safety compliance.',
      'Meticulous eye for pristine visual environment standards.'
    ],
    skills: ['Guest Services', 'Shift Management', 'Event Planning', 'Facility Auditing'],
    postedAt: '2 days ago',
    applicantsCount: 14
  },
  {
    id: 'job-2',
    title: 'Licensed Journeyman Electrician',
    company: 'VoltTech Repairs',
    logo: '⚡',
    location: 'Seattle, WA (Onsite)',
    type: 'Full-time',
    salary: '$78,000 - $92,000',
    description: 'VoltTech is expanding its industrial electrical support teams. As a Journeyman Electrician, you will lead panel upgrades, system troubleshooting, blueprint analysis, and ensure absolute compliance with regional electrical codes.',
    requirements: [
      'Active Journeyman Electrician license.',
      'Fluency in blueprint reading, industrial circuit installations, and OSHA safety standards.',
      'Expertise in diagnostics, power distribution, and commercial repairs.',
      'Excellent safety record and collaborative team attitude.'
    ],
    skills: ['Wiring & Circuits', 'Blueprints', 'HVAC Electrical', 'OSHA 30'],
    postedAt: '1 day ago',
    applicantsCount: 22
  },
  {
    id: 'job-3',
    title: 'Warehouse Logistics Coordinator',
    company: 'CoreStack Logistics',
    logo: '📦',
    location: 'New York, NY (Onsite)',
    type: 'Contract',
    salary: '$30 - $42 / hr',
    description: 'Help CoreStack manage and coordinate incoming supply chain inventory at our regional fulfillment depot. This role requires auditing shipments, coordinating container packing, and leading daily safety checks.',
    requirements: [
      'Deep knowledge of inventory management databases and scanners.',
      'Current Forklift Certification.',
      'Proven experience leading zero-incident safety huddles.',
      'Ability to lift up to 50 lbs and work standard commercial hours.'
    ],
    skills: ['Inventory Management', 'Forklift Certified', 'OSHA Safety', 'Supply Chain Auditing'],
    postedAt: '4 days ago',
    applicantsCount: 8
  },
  {
    id: 'job-4',
    title: 'Executive Catering Chef',
    company: 'Bloom Fine Catering',
    logo: '🍳',
    location: 'Austin, TX (Onsite)',
    type: 'Full-time',
    salary: '$68,000 - $82,000',
    description: 'Bloom Fine Catering is seeking an energetic, highly organized chef. You will curate custom seasonal menus for events, manage ingredient sourcing and vendor agreements, and direct a crew of 8 kitchen helpers.',
    requirements: [
      'Degree in Culinary Arts or equivalent practical experience.',
      'Superb leadership, menu scaling, and budgeting skillsets.',
      'Strict adherence to ServSafe or regional health safety certifications.',
      'Expertise in high-volume banqueting and event presentation.'
    ],
    skills: ['Kitchen Logistics', 'Menu Engineering', 'Food Safety', 'High-Volume Catering'],
    postedAt: 'Just now',
    applicantsCount: 1
  }
];

export const mockBlogPosts: BlogPost[] = [
  {
    id: 'post-1',
    title: 'Designing the Perfect Hyperlocal Job Matching Engine',
    excerpt: 'How nearby AI models analyze availability, travel distance, and background verification to deliver matching workers in minutes.',
    content: 'The old paradigm of traditional corporate job boards is broken for local, urgent operations. Traditional sites filter resumes by keyword syntax (e.g. looking for degrees or corporate jargon), completely disregarding reliable local workers. Today, WorkNear relies on high-dimensional location intelligence and verified background credentials. By interpreting a worker’s actual travel radius, available schedule huddles, and historic rating reliability, the matching engine establishes optimal connections instantly. In this article, we break down the localized routing and verification formulas that power our 98% hiring success rate.',
    category: 'Operations & AI',
    author: 'Elena Rostova',
    authorRole: 'Head of Match Intelligence, WorkNear',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&h=50&fit=crop&crop=face',
    date: 'July 18, 2026',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'post-2',
    title: 'The Rise of the Local Flexible General Workforce',
    excerpt: 'Why local hotels, catering agencies, and warehouses are shifting to instant, direct-on-demand workers.',
    content: 'As local hospitality and logistical demands surge, the cost of keeping highly variable shift positions staffed with expensive recruiters is unsustainable. Top-tier hotels and banquet facilities are increasingly choosing an on-demand workforce lifestyle—securing 4-8 hours of surgical, high-fidelity help for events or shipping rushes. This guide details how WorkNear facilitates seamless shift scheduling, Aadhaar-verified check-ins, and instant local dispatching without messy intermediary agency fees.',
    category: 'Workforce Trends',
    author: 'Marcus Chen',
    authorRole: 'Hospitality Lead Partner',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
    date: 'July 12, 2026',
    readTime: '3 min read',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'post-3',
    title: 'Establishing Real-Time Operations Without the WhatsApp Noise',
    excerpt: 'How direct Apply → Accept → Call workflows replace messy messaging threads and quicken onsite huddles.',
    content: 'Maintaining speed across event operations isn’t about monitoring active chats or maintaining long back-and-forth messaging lists. Our partners have shown that direct voice or direct telephone communication is the ultimate leverage. In this post, we explore how removing in-app messaging and replacing it with a clean Apply → Accept → Direct Contact flow decreases hiring time from 8 hours to less than 5 minutes.',
    category: 'Local Logistics',
    author: 'Sarah Jenkins',
    authorRole: 'Operations Lead, WorkNear',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop&crop=face',
    date: 'July 05, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800&auto=format&fit=crop&q=80'
  }
];

export const mockFAQs: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'How does the WorkNear AI Matching Engine work?',
    answer: 'WorkNear uses proximity matching and verified worker scores. It sorts workers by real-time distance, rating, available shifts (morning/afternoon/night), and certified practical skills (like serving, loading, electrical compliance) so employers find matching help in minutes.',
    category: 'general'
  },
  {
    id: 'faq-2',
    question: 'Is WorkNear free for Job Seekers (Workers)?',
    answer: 'Yes! Workers can register, build an interactive AI profile of previous gigs, undergo background verification, and apply to unlimited local jobs completely free. We only charge employers.',
    category: 'workers'
  },
  {
    id: 'faq-3',
    question: 'How do employers verify worker competence and safety?',
    answer: 'Workers can upload Aadhaar verification, face verification checkpoints, or certificates. Furthermore, employers can review previous employer ratings, response speeds, and job completion histories directly on the worker’s profile.',
    category: 'employers'
  },
  {
    id: 'faq-4',
    question: 'Why is there NO messaging or chat in the app?',
    answer: 'To ensure extreme speed. Messaging causes delays. Instead, WorkNear uses a direct workflow: Workers Apply → Employer reviews profile and Accepts → Worker’s direct phone number is instantly shared for direct calls or video calls.',
    category: 'general'
  },
  {
    id: 'faq-5',
    question: 'How do payments and attendance work?',
    answer: 'WorkNear offers automated shift timers, GPS-verified check-ins, and QR-code attendance. Payments can be routed directly through UPI, card, or wallet with instant payouts upon task completion.',
    category: 'employers'
  }
];
