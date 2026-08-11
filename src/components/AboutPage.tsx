/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, Code, Brain, Cpu, Database, Heart, 
  Linkedin, Github, Globe, ShieldCheck, Zap, Award,
  Instagram, Mail
} from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  skills: string[];
  avatarInitials: string;
  avatarBg: string;
  imageUrl?: string;
  tagline: string;
  links: {
    linkedin: string;
    github: string;
    website: string;
    instagram?: string;
    email?: string;
  };
}

export default function AboutPage() {
  const teamMembers: TeamMember[] = [
    {
      name: 'Seeman',
      role: 'Project Head & Principal Full-Stack Developer',
      bio: 'Seeman is the project lead of WorkNear\'s cognitive AI matching system, specialized in transformer-based semantic search algorithms, secure identity structures, and scalable multi-region microservices. As the sole development head, Seeman ensures the platform remains high-performing, secure, and visually flawless.',
      skills: ['Cognitive AI Systems', 'Distributed Databases', 'Full-Stack React Architecture', 'Infrastructure Optimization', 'Sovereign EOR Compliance'],
      avatarInitials: 'S',
      avatarBg: 'bg-gradient-to-br from-blue-600 to-indigo-700',
      imageUrl: '/assets/profile.jpeg',
      tagline: 'Empowering the high-dimensional workforce.',
      links: {
        linkedin: 'https://www.linkedin.com/in/seeman-p-3b5468380?utm_source=share_via&utm_content=profile&utm_medium=member_ios',
        github: '#',
        website: '#',
        instagram: 'https://www.instagram.com/dhe._spyro._?igsh=MXh3NHFudXVieDBkeA%3D%3D&utm_source=qrand',
        email: 'seemanvishal@gmail.com'
      }
    }
  ];

  return (
    <div className="bg-white min-h-screen text-slate-800 transition-colors duration-200">
      
      {/* Hero section */}
      <section className="relative overflow-hidden py-24 border-b border-slate-100 bg-slate-50 text-left">
        <div className="absolute inset-0 bg-grid-slate-100 bg-[size:20px_20px] opacity-30" />
        <div className="absolute top-1/4 right-10 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-10 w-96 h-96 bg-indigo-100/40 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="text-[10px] uppercase font-bold tracking-widest text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-150 inline-block mb-4">
              ABOUT THE TEAM & MISSION
            </span>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 leading-none">
              Pioneering High-Dimensional Workforce Coordination
            </h1>
            <p className="mt-6 text-slate-600 text-sm sm:text-base leading-relaxed">
              WorkNear was engineered to dismantle traditional, friction-heavy global recruitment structures. Our mission is to seamlessly connect enterprise recruiters with pre-screened elite developers, backed by sovereign EOR compliance models and zero-latency matching.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Team section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-16 flex flex-col items-center justify-center">
          <span className="text-[10px] uppercase font-bold tracking-widest text-blue-600">PROJECT CORE MINDS</span>
          <h2 className="text-3xl font-black text-slate-900 leading-none mt-2">
            Meet the Engineers Behind WorkNear
          </h2>
          <p className="mt-3 text-slate-500 text-xs sm:text-sm max-w-xl text-center">
            Introducing our project development leads, driving high-performance solutions and frontend visual harmony.
          </p>
        </div>

        <center>
          <div className="max-w-xl w-full">
            {teamMembers.map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ 
                  y: -8,
                  scale: 1.02,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.08)",
                  borderColor: "rgba(59, 130, 246, 0.5)"
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 100, 
                  damping: 15,
                  delay: idx * 0.15 
                }}
                id={`team-member-card-${idx}`}
                className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 transition-all duration-300 flex flex-col justify-between relative overflow-hidden text-left"
              >
              <div>
                {/* Header info */}
                <div className="flex items-center space-x-4 mb-6">
                  {member.imageUrl ? (
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: idx * 0.15 + 0.2, type: "spring" }}
                      className="h-24 w-24 rounded-2xl overflow-hidden shrink-0 shadow-xl border-2 border-blue-200 bg-slate-100 flex items-center justify-center relative group"
                    >
                      <img 
                        src={member.imageUrl} 
                        alt={member.name} 
                        className="h-full w-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                    </motion.div>
                  ) : (
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: idx * 0.15 + 0.2, type: "spring" }}
                      className={`h-24 w-24 rounded-2xl ${member.avatarBg} text-white font-black text-3xl flex items-center justify-center shrink-0 shadow-xl shadow-blue-600/20`}
                    >
                      {member.avatarInitials}
                    </motion.div>
                  )}
                  <div>
                    <h3 className="text-lg font-black text-slate-900 tracking-wide uppercase">{member.name}</h3>
                    <p className="text-xs font-bold text-blue-600 mt-0.5">{member.role}</p>
                    <span className="text-[10px] font-mono text-slate-400 italic block mt-1">"{member.tagline}"</span>
                  </div>
                </div>

                {/* Bio text */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  {member.bio}
                </p>

                {/* Skills tags */}
                <div className="space-y-2 mb-6">
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">Key Focus Areas</span>
                  <div className="flex flex-wrap gap-1.5">
                    {member.skills.map((skill, sIdx) => (
                      <motion.span 
                        key={sIdx} 
                        whileHover={{ scale: 1.05, backgroundColor: "rgba(59, 130, 246, 0.05)", borderColor: "rgba(59, 130, 246, 0.3)" }}
                        className="text-[10px] font-bold text-slate-700 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg cursor-default transition-colors duration-200"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Links & metadata footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Project Head</span>
                <div className="flex items-center space-x-3">
                  {member.links.linkedin && (
                    <motion.a 
                      href={member.links.linkedin} 
                      whileHover={{ scale: 1.15, y: -2 }}
                      className="text-slate-400 hover:text-blue-600 transition" 
                      aria-label="LinkedIn profile"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Linkedin className="h-4.5 w-4.5" />
                    </motion.a>
                  )}
                  {member.links.instagram && (
                    <motion.a 
                      href={member.links.instagram} 
                      whileHover={{ scale: 1.15, y: -2 }}
                      className="text-slate-400 hover:text-pink-600 transition" 
                      aria-label="Instagram profile"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Instagram className="h-4.5 w-4.5" />
                    </motion.a>
                  )}
                  {member.links.email && (
                    <motion.a 
                      href={`mailto:${member.links.email}`} 
                      whileHover={{ scale: 1.15, y: -2 }}
                      className="text-slate-400 hover:text-red-500 transition" 
                      aria-label="Email contact"
                    >
                      <Mail className="h-4.5 w-4.5" />
                    </motion.a>
                  )}
                  {member.links.github && member.links.github !== '#' && (
                    <motion.a 
                      href={member.links.github} 
                      whileHover={{ scale: 1.15, y: -2 }}
                      className="text-slate-400 hover:text-blue-600 transition" 
                      aria-label="GitHub profile"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="h-4.5 w-4.5" />
                    </motion.a>
                  )}
                  {member.links.website && member.links.website !== '#' && (
                    <motion.a 
                      href={member.links.website} 
                      whileHover={{ scale: 1.15, y: -2 }}
                      className="text-slate-400 hover:text-blue-600 transition" 
                      aria-label="Personal website"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Globe className="h-4.5 w-4.5" />
                    </motion.a>
                  )}
                </div>
              </div>

            </motion.div>
          ))}
          </div>
        </center>
      </section>

      {/* Engineering Covenant Banner */}
      <section className="py-20 bg-slate-50 border-t border-b border-slate-100 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-750 to-indigo-700 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl border border-blue-800">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
            <div className="max-w-2xl space-y-4 relative z-10">
              <span className="text-[10px] uppercase font-mono tracking-widest font-black text-sky-200">DEVELOPMENT INTEGRITY</span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">Our Frontend & System Architecture</h2>
              <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
                WorkNear is designed using a lightning-fast React + Vite toolchain, utilizing pure state orchestration without bloated external frameworks. From 3D coordinate-based visualizers to progressive multi-step verification modals, our codebase respects optimal performance constraints and visual mathematical grids.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-6 text-[11px] font-mono font-bold text-sky-200">
                <span className="flex items-center space-x-1.5">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Aadhar Secure Encryption</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <Cpu className="h-4 w-4" />
                  <span>Vite Native Bundling</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <Award className="h-4 w-4" />
                  <span>Elite Sourcing Grade</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
