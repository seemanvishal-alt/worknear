/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Candidate {
  id: string;
  name: string;
  role: string;
  avatar: string;
  location: string;
  skills: string[];
  experience: number; // in years
  expectedSalary: string;
  bio: string;
  matchScore?: number;
  matchReason?: string;
  status: 'Available' | 'Interviewing' | 'Placed';
}

export interface Job {
  id: string;
  title: string;
  company: string;
  logo: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  salary: string;
  description: string;
  requirements: string[];
  skills: string[];
  postedAt: string;
  applicantsCount: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  authorRole: string;
  authorAvatar: string;
  date: string;
  readTime: string;
  image: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'employers' | 'workers' | 'pricing';
}
