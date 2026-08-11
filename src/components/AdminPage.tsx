/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, ShieldCheck, ShieldAlert, Cpu, Database, 
  Activity, Users, FileText, CheckCircle, Clock, 
  AlertTriangle, RefreshCw, Server, Settings, Terminal, Search,
  Download, GitCommit, Compass, Calendar, ArrowRight
} from 'lucide-react';
import * as d3 from 'd3';
import { jsPDF } from 'jspdf';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, BarChart, Bar, LineChart, Line
} from 'recharts';

interface AuditLog {
  id: string;
  timestamp: string;
  event: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  module: string;
  severity: 'Low' | 'Medium' | 'Critical';
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur border border-slate-200 p-3.5 rounded-2xl shadow-xl text-left font-sans text-[11px] font-semibold">
        <p className="font-black text-slate-800 uppercase tracking-wider text-[10px] mb-2 font-mono">{label}</p>
        <div className="space-y-1.5">
          {payload.map((item: any, idx: number) => (
            <div key={idx} className="flex items-center justify-between space-x-6">
              <span className="flex items-center space-x-1.5 text-slate-500">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.stroke || item.fill }} />
                <span>{item.name}:</span>
              </span>
              <span className="font-black text-slate-900">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

interface RoadmapMilestone {
  id: string;
  quarter: string;
  title: string;
  description: string;
  category: 'Feature' | 'Security' | 'Compliance';
  status: 'Completed' | 'In-Progress' | 'Upcoming';
  owner: string;
  details: string[];
}

const roadmapMilestones: RoadmapMilestone[] = [
  {
    id: 'milestone-1',
    quarter: 'Q1 2026',
    title: 'Sovereign EOR Gateway',
    description: 'Establish localized automated payroll ledgers and statutory tax calculations across 14 EU regulatory districts.',
    category: 'Compliance',
    status: 'Completed',
    owner: 'seeman2628',
    details: [
      'Multi-currency settlement pipeline (EUR/GBP/USD)',
      'Automated local tax bracket updates via API proxy',
      'Unified pension and healthcare allocation framework'
    ]
  },
  {
    id: 'milestone-2',
    quarter: 'Q2 2026',
    title: 'Biometric Liveness V2',
    description: 'Upgrade the active scanner framework with neural-network liveness feedback and custom 3D coordinate-based head position checks.',
    category: 'Security',
    status: 'Completed',
    owner: 'seeman2628',
    details: [
      '3D face mapping mesh integrated into mobile UI',
      'Anti-spoofing photo detection model upgrade',
      'Integration with public UIDAI Aadhaar verification pipeline'
    ]
  },
  {
    id: 'milestone-3',
    quarter: 'Q3 2026',
    title: 'LiDAR GPS Radar Mesh',
    description: 'Integrate active focal depth detection and sub-meter GPS radar mappings to secure physical handshake coordinates in hypergigs.',
    category: 'Feature',
    status: 'In-Progress',
    owner: 'seeman2628',
    details: [
      'Dual-camera distance matching algorithms',
      'Sub-meter high-density visual check-ins',
      'Offline matching support with Bluetooth beacons'
    ]
  },
  {
    id: 'milestone-4',
    quarter: 'Q4 2026',
    title: 'Cryptographic Ledger Audit',
    description: 'Develop a non-repudiation logging ledger for storing compliance contracts and biometric handshakes.',
    category: 'Security',
    status: 'In-Progress',
    owner: 'Security Committee',
    details: [
      'AES-256 block-sealed log structure',
      'SHA-256 verification hash per ledger record',
      'Secure telemetry dashboard with real-time audit filters'
    ]
  },
  {
    id: 'milestone-5',
    quarter: 'Q1 2027',
    title: 'ISO 27001 Certification',
    description: 'Conduct comprehensive penetration testing and secure code audit review for global enterprise deployment.',
    category: 'Compliance',
    status: 'Upcoming',
    owner: 'Audit Board',
    details: [
      'Vulnerability scanning automation',
      'Third-party security review team integration',
      'Policy automation documents built in secure vaults'
    ]
  },
  {
    id: 'milestone-6',
    quarter: 'Q2 2027',
    title: 'SOC2 Type II Attestation',
    description: 'Continuous validation of security controls, system availability, and customer data confidentiality.',
    category: 'Compliance',
    status: 'Upcoming',
    owner: 'Audit Board',
    details: [
      'Continuous compliance telemetry feeds',
      'Automated security alarm escalation thresholds',
      'Multi-tenant isolated vault container reviews'
    ]
  },
  {
    id: 'milestone-7',
    quarter: 'Q3 2027',
    title: 'Cognitive Vector Match Engine',
    description: 'Deep neural embeddings for contextual recruiter-candidate matching on high-dimensional semantic spaces.',
    category: 'Feature',
    status: 'Upcoming',
    owner: 'seeman2628',
    details: [
      'Transformer-based parsing models',
      'Skill weight semantic scoring vectors',
      'Automated job listing translation and enrichment'
    ]
  }
];

interface D3TimelineProps {
  milestones: RoadmapMilestone[];
  onSelectMilestone: (m: RoadmapMilestone) => void;
  selectedMilestoneId: string | null;
}

function D3RoadmapTimeline({ milestones, onSelectMilestone, selectedMilestoneId }: D3TimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 280 });

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width } = entries[0].contentRect;
      setDimensions({
        width: Math.max(width, 400),
        height: 280
      });
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const { width, height } = dimensions;
    const margin = { top: 40, right: 60, bottom: 60, left: 60 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const xScale = d3.scaleLinear()
      .domain([0, milestones.length - 1])
      .range([0, chartWidth]);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Draw main timeline line
    g.append('line')
      .attr('x1', 0)
      .attr('y1', chartHeight / 2)
      .attr('x2', chartWidth)
      .attr('y2', chartHeight / 2)
      .attr('stroke', '#e2e8f0')
      .attr('stroke-width', 4)
      .attr('stroke-linecap', 'round');

    const colors = {
      Feature: { stroke: '#2563eb', fill: '#eff6ff' },
      Security: { stroke: '#0d9488', fill: '#f0fdfa' },
      Compliance: { stroke: '#7c3aed', fill: '#f5f3ff' }
    };

    const nodesG = g.selectAll('.milestone-node')
      .data(milestones)
      .enter()
      .append('g')
      .attr('class', 'milestone-node')
      .attr('transform', (d, i) => `translate(${xScale(i)}, ${chartHeight / 2})`)
      .style('cursor', 'pointer');

    // Pulsing background ring for selected or in-progress
    nodesG.append('circle')
      .attr('r', (d) => d.id === selectedMilestoneId ? 22 : 14)
      .attr('fill', 'transparent')
      .attr('stroke', (d) => colors[d.category].stroke)
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', (d) => d.status === 'Upcoming' ? '4, 4' : 'none')
      .attr('opacity', (d) => d.id === selectedMilestoneId ? 0.9 : 0.2)
      .style('transition', 'all 0.3s ease-in-out');

    // Pulse animation element for in-progress nodes
    nodesG.filter(d => d.status === 'In-Progress')
      .append('circle')
      .attr('r', 14)
      .attr('fill', 'none')
      .attr('stroke', d => colors[d.category].stroke)
      .attr('stroke-width', 1.5)
      .attr('opacity', 0.6)
      .append('animate')
      .attr('attributeName', 'r')
      .attr('values', '14;25;14')
      .attr('dur', '2s')
      .attr('repeatCount', 'indefinite');

    // Central core node circle
    nodesG.append('circle')
      .attr('r', (d) => d.id === selectedMilestoneId ? 10 : 8)
      .attr('fill', (d) => d.status === 'Completed' ? colors[d.category].stroke : '#ffffff')
      .attr('stroke', (d) => colors[d.category].stroke)
      .attr('stroke-width', 3)
      .style('transition', 'all 0.3s ease-in-out');

    // Quarter Label
    nodesG.append('text')
      .attr('y', -24)
      .attr('text-anchor', 'middle')
      .attr('fill', '#94a3b8')
      .attr('font-size', '10px')
      .attr('font-weight', '700')
      .attr('font-family', 'monospace')
      .text((d) => d.quarter);

    // Title label
    nodesG.append('text')
      .attr('y', 26)
      .attr('text-anchor', 'middle')
      .attr('fill', (d) => d.id === selectedMilestoneId ? '#1e293b' : '#64748b')
      .attr('font-size', '11px')
      .attr('font-weight', (d) => d.id === selectedMilestoneId ? '800' : '600')
      .text((d) => d.title.length > 13 ? d.title.substring(0, 11) + '..' : d.title);

    // Status Label
    nodesG.append('text')
      .attr('y', 38)
      .attr('text-anchor', 'middle')
      .attr('fill', (d) => d.status === 'Completed' ? '#059669' : d.status === 'In-Progress' ? '#d97706' : '#64748b')
      .attr('font-size', '8px')
      .attr('font-weight', '800')
      .text((d) => d.status.toUpperCase());

    nodesG.on('mouseover', function(event, d) {
      d3.select(this).select('circle:first-child')
        .attr('r', 24)
        .attr('opacity', 0.9);
    });

    nodesG.on('mouseout', function(event, d) {
      if (d.id !== selectedMilestoneId) {
        d3.select(this).select('circle:first-child')
          .attr('r', 14)
          .attr('opacity', 0.2);
      }
    });

    nodesG.on('click', function(event, d) {
      onSelectMilestone(d);
    });

  }, [milestones, dimensions, selectedMilestoneId]);

  return (
    <div ref={containerRef} className="w-full bg-slate-50/60 border border-slate-150 rounded-2xl flex items-center justify-center p-3 relative min-h-[290px]">
      <svg ref={svgRef} width={dimensions.width} height={dimensions.height} className="overflow-visible" />
    </div>
  );
}

export default function AdminPage() {
  const [isVerifiedOwner, setIsVerifiedOwner] = useState(false);
  const [securityKey, setSecurityKey] = useState('');
  const [securityError, setSecurityError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const [logs, setLogs] = useState<AuditLog[]>([
    { id: 'log-1001', timestamp: '2026-08-08 10:39:22', event: 'UIDAI Aadhar Verification Request Handshake Complete', status: 'SUCCESS', module: 'AuthService', severity: 'Low' },
    { id: 'log-1002', timestamp: '2026-08-08 10:38:14', event: 'Google Maps API Token Validation Secure', status: 'SUCCESS', module: 'LocationEngine', severity: 'Low' },
    { id: 'log-1003', timestamp: '2026-08-08 10:35:01', event: 'Minor discrepancy in high-density location coordinates', status: 'WARNING', module: 'MatchingService', severity: 'Medium' },
    { id: 'log-1004', timestamp: '2026-08-08 10:31:45', event: 'AES-256 backup archive decrypted session check', status: 'SUCCESS', module: 'VaultEngine', severity: 'Medium' },
    { id: 'log-1005', timestamp: '2026-08-08 10:28:12', event: 'Liveness fail count limit exceeded for worker-7128', status: 'FAILED', module: 'IdentityAudit', severity: 'Critical' }
  ]);

  const [activeTab, setActiveTab] = useState<'audit' | 'metrics' | 'roadmap'>('audit');
  const [selectedMilestone, setSelectedMilestone] = useState<RoadmapMilestone>(roadmapMilestones[2]);
  const [roadmapCategoryFilter, setRoadmapCategoryFilter] = useState<string>('All');

  const filteredMilestones = useMemo(() => {
    if (roadmapCategoryFilter === 'All') return roadmapMilestones;
    return roadmapMilestones.filter(m => m.category === roadmapCategoryFilter);
  }, [roadmapCategoryFilter]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModule, setSelectedModule] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedSeverity, setSelectedSeverity] = useState('All');
  const [sortKey, setSortKey] = useState<'timestamp' | 'event' | 'module' | 'severity' | 'status'>('timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Recharts Activity Overview Datasets
  const [timeRange, setTimeRange] = useState<'7days' | '30days'>('7days');
  const [chartStyle, setChartStyle] = useState<'area' | 'bar' | 'line'>('area');

  const data7Days = [
    { day: 'Mon', postings: 145, matches: 92 },
    { day: 'Tue', postings: 182, matches: 124 },
    { day: 'Wed', postings: 210, matches: 156 },
    { day: 'Thu', postings: 195, matches: 148 },
    { day: 'Fri', postings: 245, matches: 198 },
    { day: 'Sat', postings: 130, matches: 85 },
    { day: 'Sun', postings: 115, matches: 78 },
  ];

  const data30Days = [
    { day: 'Wk 1', postings: 980, matches: 680 },
    { day: 'Wk 2', postings: 1120, matches: 810 },
    { day: 'Wk 3', postings: 1250, matches: 930 },
    { day: 'Wk 4', postings: 1497, matches: 1061 },
  ];

  const selectedData = timeRange === '7days' ? data7Days : data30Days;

  const filteredLogs = logs.filter(l => {
    const matchesKeyword = 
      l.event.toLowerCase().includes(searchTerm.toLowerCase()) || 
      l.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.id.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesModule = selectedModule === 'All' || l.module === selectedModule;
    const matchesStatus = selectedStatus === 'All' || l.status === selectedStatus;
    const matchesSeverity = selectedSeverity === 'All' || l.severity === selectedSeverity;
    
    return matchesKeyword && matchesModule && matchesStatus && matchesSeverity;
  }).sort((a, b) => {
    const valA = a[sortKey].toLowerCase();
    const valB = b[sortKey].toLowerCase();
    if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    // Header Accent Bar
    doc.setFillColor(15, 23, 42); // slate-900: RGB 15, 23, 42
    doc.rect(0, 0, 210, 40, 'F');
    
    // Header Title
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('WORKNEAR WORKFORCE INTELLIGENCE', 15, 18);
    
    // Header Subtitle
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text('OFFLINE SECURE AUDIT & IDENTITY CREDENTIALS REPORT', 15, 25);
    
    // Timestamp in Header
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    const timeString = new Date().toISOString().replace('T', ' ').substring(0, 19);
    doc.text(`GENERATED: ${timeString} UTC`, 140, 18);
    doc.text('STATUS: VERIFIED SECURE (TLS 1.3)', 140, 25);
    
    // Content body
    doc.setTextColor(30, 41, 59); // slate-800
    
    // Section 1: SECURITY DOCK & IDENTITY INTEGRITY
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(13, 148, 136); // teal-600
    doc.text('1. IDENTITY VERIFICATION STATUS & PLATFORM CREDENTIALS', 15, 52);
    
    // Horizontal divider
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.setLineWidth(0.5);
    doc.line(15, 55, 195, 55);
    
    // Credentials Details Grid
    doc.setTextColor(71, 85, 105); // slate-600
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    
    const credentials = [
      { label: 'Authorized Auditor ID', value: 'seeman2628' },
      { label: 'Identity Protocol', value: 'UIDAI Aadhar Secure Handshake' },
      { label: 'Compliance Grade', value: 'Class-III Enterprise (SOX/GDPR)' },
      { label: 'Biometrics Feed', value: 'Holographic Face Mesh Synced (AF-S)' },
      { label: 'Ranging Technology', value: 'LiDAR-Enhanced High-Density Scan' },
      { label: 'Encryption Standard', value: 'AES-256 Symmetric Session Cipher' }
    ];
    
    let yPos = 62;
    credentials.forEach((cred, i) => {
      // 2 columns
      const col = i % 2;
      const xPos = col === 0 ? 15 : 110;
      
      doc.setFont('helvetica', 'bold');
      doc.text(`${cred.label}:`, xPos, yPos);
      
      doc.setFont('helvetica', 'normal');
      doc.text(cred.value, xPos + 42, yPos);
      
      if (col === 1) {
        yPos += 7;
      }
    });
    
    // Section 2: COMPLIANCE LEDGER EVENTS
    yPos = 90;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(13, 148, 136); // teal-600
    doc.text('2. AUDITED EVENTS & TELEMETRY LEDGER', 15, yPos);
    
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.line(15, yPos + 3, 195, yPos + 3);
    
    yPos = 100;
    // Draw table headers
    doc.setFillColor(248, 250, 252); // slate-50
    doc.rect(15, yPos, 180, 8, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.rect(15, yPos, 180, 8, 'S');
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text('TIME NODE', 18, yPos + 5.5);
    doc.text('EVENT DETAIL', 58, yPos + 5.5);
    doc.text('MODULE', 140, yPos + 5.5);
    doc.text('SEVERITY', 165, yPos + 5.5);
    doc.text('STATUS', 182, yPos + 5.5);
    
    yPos += 8;
    
    // Draw table rows
    filteredLogs.forEach((log) => {
      // Check if page overflow
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
        // Table Header again on new page
        doc.setFillColor(248, 250, 252);
        doc.rect(15, yPos, 180, 8, 'F');
        doc.setDrawColor(226, 232, 240);
        doc.rect(15, yPos, 180, 8, 'S');
        
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(71, 85, 105);
        doc.text('TIME NODE', 18, yPos + 5.5);
        doc.text('EVENT DETAIL', 58, yPos + 5.5);
        doc.text('MODULE', 140, yPos + 5.5);
        doc.text('SEVERITY', 165, yPos + 5.5);
        doc.text('STATUS', 182, yPos + 5.5);
        
        yPos += 8;
      }
      
      // Draw background cell frame
      doc.setDrawColor(241, 245, 249); // slate-100
      doc.rect(15, yPos, 180, 12, 'S');
      
      // Text styling
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139); // slate-500
      
      // Time Node
      doc.text(log.timestamp.substring(5), 18, yPos + 7.5); // skip year for spacing
      
      // Event description (wrapped to prevent overflow)
      const maxDescWidth = 78;
      const wrappedDesc = doc.splitTextToSize(log.event, maxDescWidth);
      doc.setTextColor(15, 23, 42); // slate-900
      doc.setFont('helvetica', 'bold');
      doc.text(wrappedDesc, 58, yPos + 5.5);
      
      // Module
      doc.setTextColor(37, 99, 235); // blue-600
      doc.setFont('helvetica', 'bold');
      doc.text(log.module, 140, yPos + 7.5);
      
      // Severity
      doc.setFont('helvetica', 'normal');
      if (log.severity === 'Critical') {
        doc.setTextColor(225, 29, 72); // rose-600
      } else if (log.severity === 'Medium') {
        doc.setTextColor(217, 119, 6); // amber-600
      } else {
        doc.setTextColor(71, 85, 105);
      }
      doc.text(log.severity, 165, yPos + 7.5);
      
      // Status
      if (log.status === 'SUCCESS') {
        doc.setTextColor(5, 150, 105); // emerald-600
      } else if (log.status === 'WARNING') {
        doc.setTextColor(217, 119, 6);
      } else {
        doc.setTextColor(225, 29, 72);
      }
      doc.setFont('helvetica', 'bold');
      doc.text(log.status, 182, yPos + 7.5);
      
      yPos += 12;
    });
    
    // Add page numbers footer to all pages
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184); // slate-400
      doc.text(`Page ${i} of ${pageCount}`, 175, 285);
      doc.text('WorkNear Workforce Cryptographic Audit. Confidential - Authorized Auditors Only.', 15, 285);
    }
    
    // Save report
    doc.save(`Security_Credentials_Audit_Report_${Date.now()}.pdf`);
  };

  const handleDownloadProposalPDF = () => {
    const doc = new jsPDF();
    const nowString = new Date().toISOString().replace('T', ' ').substring(0, 19);

    // ==========================================
    // PAGE 1: TITLE & EXECUTIVE PROPOSAL
    // ==========================================
    
    // Top Banner Background Accent
    doc.setFillColor(15, 23, 42); // slate-900 (RGB: 15, 23, 42)
    doc.rect(0, 0, 210, 60, 'F');

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('WORKNEAR TECHNOLOGIES', 15, 25);
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(20, 184, 166); // teal-400 (RGB: 20, 184, 166)
    doc.text('COGNITIVE WORKFORCE ARCHITECTURE & SECURITY PROPOSAL', 15, 33);
    
    // Divider
    doc.setDrawColor(30, 41, 59); // slate-800
    doc.setLineWidth(1);
    doc.line(15, 38, 195, 38);

    doc.setTextColor(148, 163, 184); // slate-400
    doc.setFontSize(8.5);
    doc.text(`PROPOSAL DOCKET: WN-2026-PROP`, 15, 45);
    doc.text(`COMPILED BY: WorkNear Executive Committee & Auditor seeman2628`, 15, 51);

    // Document Metadata Panel
    doc.setFillColor(248, 250, 252); // slate-50
    doc.rect(15, 70, 180, 30, 'F');
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.rect(15, 70, 180, 30, 'S');

    doc.setTextColor(15, 23, 42); // slate-900
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('1. EXECUTIVE BRIEF & PROPOSAL COGNITION', 20, 78);

    doc.setTextColor(71, 85, 105); // slate-600
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    const briefText = "WorkNear dismantles traditional global staffing overhead, directly pairing sovereign employers with pre-vetted nearby expert engineers. Bypassing commission-hungry agencies, the platform establishes localized Employer of Record (EOR) payroll conduits, secure biometric verifications, and real-time ledger auditing. This proposal outlines the integration of cognitive search, high-density radar coordinates, and verified security handshakes into a unified enterprise docket.";
    const wrappedBrief = doc.splitTextToSize(briefText, 170);
    doc.text(wrappedBrief, 20, 84);

    // Section: Platform Strengths
    doc.setTextColor(15, 23, 42); // slate-900
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.text('2. ARCHITECTURAL PILLARS & STRATEGIC ADAPTATION', 15, 115);
    doc.setDrawColor(226, 232, 240);
    doc.line(15, 118, 195, 118);

    // Pillar columns
    const pillars = [
      { title: "High-Dimensional Semantic Matches", desc: "Replaces traditional word-matching with contextual vector search, delivering a 71.8% success match index rate." },
      { title: "Statutory EOR Compliance Models", desc: "No local subsidiary required. Unified system handles pensions, localized contracts, multi-currency ledger taxes, and local healthcare." },
      { title: "LiDAR & GPS Verification Mesh", desc: "Utilizes sub-meter GPS radar mappings combined with offline active focal depth detection to secure physical handshake coordinates." },
      { title: "Cryptographic Telemetry Registry", desc: "All core access controls, UIDAI Aadhaar handshakes, and ledger approvals are stored in a secure local, non-repudiation log ledger." }
    ];

    let yPos = 126;
    pillars.forEach((p, index) => {
      doc.setFillColor(250, 250, 250);
      doc.rect(15, yPos, 180, 18, 'F');
      doc.setDrawColor(241, 245, 249);
      doc.rect(15, yPos, 180, 18, 'S');

      // Index indicator
      doc.setFillColor(20, 184, 166); // teal-500
      doc.rect(18, yPos + 4, 10, 10, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.text(`0${index + 1}`, 21, yPos + 11);

      // Title & Desc
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text(p.title, 32, yPos + 8);

      doc.setTextColor(100, 116, 139);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      const wrappedPillarDesc = doc.splitTextToSize(p.desc, 158);
      doc.text(wrappedPillarDesc, 32, yPos + 13);

      yPos += 22;
    });

    // Signature Block on Page 1
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('PREPARED FOR:', 15, 225);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text('Enterprise Recruitment Advisory Board', 15, 230);
    doc.text('Global EOR Statutory Directors', 15, 235);

    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.text('ENDORSED BY:', 110, 225);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text('Seeman, Lead Cognitive Workforce Architect', 110, 230);
    doc.text('WorkNear Global Infrastructure Group', 110, 235);

    // ==========================================
    // PAGE 2: MARKET METRICS & DEPLOYMENT CODES
    // ==========================================
    doc.addPage();

    // Top Header Banner
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, 210, 25, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('WORKNEAR COGNITIVE WORKFORCE ARCHITECTURE PROPOSAL', 15, 16);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(20, 184, 166); // teal-400
    doc.text('SECTION 2: MARKET OPERATIONS & STATUTORY METRICS', 125, 16);

    // Content body Page 2
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(13, 148, 136); // teal-600
    doc.text('3. ACTIVE MARKETPLACE PERFORMANCE SUMMARY', 15, 42);
    doc.setDrawColor(226, 232, 240);
    doc.line(15, 45, 195, 45);

    // 2x2 Stats Grid
    const stats = [
      { title: "Total Job Postings Logged", value: timeRange === '7days' ? '1,119 Postings' : '4,847 Postings', trend: "+12.4% Week-on-Week Growth" },
      { title: "Sovereign Matches Secured", value: timeRange === '7days' ? '811 Verified Matches' : '3,481 Verified Matches', trend: "+14.8% Handshake Efficiency" },
      { title: "Aadhaar Identity Syncs", value: "12,492 Sync Handshakes", trend: "100% Cryptographic Success" },
      { title: "Average GPS Match Density", value: "0.15 km Search Diameter", trend: "Hyperlocal Proximity Calibration" }
    ];

    let gridY = 52;
    stats.forEach((st, i) => {
      const col = i % 2;
      const xPos = col === 0 ? 15 : 110;

      doc.setFillColor(248, 250, 252);
      doc.rect(xPos, gridY, 85, 22, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.rect(xPos, gridY, 85, 22, 'S');

      // Title
      doc.setTextColor(148, 163, 184); // slate-400
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.text(st.title.toUpperCase(), xPos + 4, gridY + 6);

      // Value
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text(st.value, xPos + 4, gridY + 12);

      // Trend
      doc.setTextColor(20, 184, 166); // teal-500
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.text(st.trend, xPos + 4, gridY + 18);

      if (col === 1) {
        gridY += 27;
      }
    });

    // Chart Data representation text table
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(13, 148, 136); // teal-600
    doc.text('4. SYSTEM ACTIVITY TIMELINE METRIC POINTS', 15, 115);
    doc.setDrawColor(226, 232, 240);
    doc.line(15, 118, 195, 118);

    doc.setTextColor(71, 85, 105);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('The following high-fidelity coordinate metrics correspond directly with active dashboard telemetry charts:', 15, 124);

    // Chart Data Grid Header
    gridY = 130;
    doc.setFillColor(241, 245, 249);
    doc.rect(15, gridY, 180, 7, 'F');
    doc.setTextColor(71, 85, 105);
    doc.setFont('helvetica', 'bold');
    doc.text('NODE ID / TIMELINE', 18, gridY + 5);
    doc.text('DISPATCHED JOB POSTINGS', 75, gridY + 5);
    doc.text('COMPLIANT HANDSHAKE MATCHES', 140, gridY + 5);

    gridY += 7;
    const activeData = timeRange === '7days' ? data7Days : data30Days;
    activeData.forEach((row, i) => {
      if (i % 2 === 0) {
        doc.setFillColor(248, 250, 252);
        doc.rect(15, gridY, 180, 7, 'F');
      }
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'normal');
      doc.text(row.day, 18, gridY + 5);
      doc.text(`${row.postings} Dispatch Actions`, 75, gridY + 5);
      doc.text(`${row.matches} Verification Handshakes`, 140, gridY + 5);
      gridY += 7;
    });

    // Technical Standards Sub-panel
    gridY += 6;
    doc.setFillColor(254, 254, 254);
    doc.rect(15, gridY, 180, 22, 'F');
    doc.setDrawColor(20, 184, 166); // teal-500
    doc.rect(15, gridY, 180, 22, 'S');

    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text('DOCKET HANDSHAKE INTEGRITY CALIBRATION', 20, gridY + 6);
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text('All recruitment streams, identity verification parameters, and telemetry records are continuously processed', 20, gridY + 11);
    doc.text('under AES-256 secure encryption layers. GPS map distances are constrained by high-density, real-time localized nodes.', 20, gridY + 16);

    // ==========================================
    // PAGE 3: INTEGRITY AUDIT TELEMETRY LEDGER
    // ==========================================
    doc.addPage();

    // Top Header Banner
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, 210, 25, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('WORKNEAR COGNITIVE WORKFORCE ARCHITECTURE PROPOSAL', 15, 16);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(20, 184, 166); // teal-400
    doc.text('SECTION 3: CRYPTOGRAPHIC LOGS & AUDIT LEDGER', 125, 16);

    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(13, 148, 136); // teal-600
    doc.text('5. CRYPTOGRAPHIC LOGS & IDENTITY VALIDATION DOCKET', 15, 42);
    doc.setDrawColor(226, 232, 240);
    doc.line(15, 45, 195, 45);

    doc.setTextColor(71, 85, 105);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('Consolidated live ledger of system-level audit logs for tracking identity integrity across recruitment hubs:', 15, 52);

    // Render Table
    gridY = 58;
    doc.setFillColor(248, 250, 252); // slate-50
    doc.rect(15, gridY, 180, 8, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.rect(15, gridY, 180, 8, 'S');
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text('TIME NODE', 18, gridY + 5.5);
    doc.text('EVENT DETAIL', 58, gridY + 5.5);
    doc.text('MODULE', 140, gridY + 5.5);
    doc.text('SEVERITY', 165, gridY + 5.5);
    doc.text('STATUS', 182, gridY + 5.5);
    
    gridY += 8;
    
    // Draw table rows
    filteredLogs.forEach((log) => {
      // Check if page overflow
      if (gridY > 265) {
        doc.addPage();
        gridY = 30;
        // Table Header again on new page
        doc.setFillColor(248, 250, 252);
        doc.rect(15, gridY, 180, 8, 'F');
        doc.setDrawColor(226, 232, 240);
        doc.rect(15, gridY, 180, 8, 'S');
        
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(71, 85, 105);
        doc.text('TIME NODE', 18, gridY + 5.5);
        doc.text('EVENT DETAIL', 58, gridY + 5.5);
        doc.text('MODULE', 140, gridY + 5.5);
        doc.text('SEVERITY', 165, gridY + 5.5);
        doc.text('STATUS', 182, gridY + 5.5);
        
        gridY += 8;
      }
      
      // Draw background cell frame
      doc.setDrawColor(241, 245, 249); // slate-100
      doc.rect(15, gridY, 180, 11, 'S');
      
      // Text styling
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139); // slate-500
      
      // Time Node
      doc.text(log.timestamp.substring(5), 18, gridY + 7); 
      
      // Event description
      const maxDescWidth = 78;
      const wrappedDesc = doc.splitTextToSize(log.event, maxDescWidth);
      doc.setTextColor(15, 23, 42); // slate-900
      doc.setFont('helvetica', 'bold');
      doc.text(wrappedDesc, 58, gridY + 5.5);
      
      // Module
      doc.setTextColor(37, 99, 235); // blue-600
      doc.setFont('helvetica', 'bold');
      doc.text(log.module, 140, gridY + 7);
      
      // Severity
      doc.setFont('helvetica', 'normal');
      if (log.severity === 'Critical') {
        doc.setTextColor(225, 29, 72); // rose-600
      } else if (log.severity === 'Medium') {
        doc.setTextColor(217, 119, 6); // amber-600
      } else {
        doc.setTextColor(71, 85, 105);
      }
      doc.text(log.severity, 165, gridY + 7);
      
      // Status
      if (log.status === 'SUCCESS') {
        doc.setTextColor(5, 150, 105); // emerald-600
      } else if (log.status === 'WARNING') {
        doc.setTextColor(217, 119, 6);
      } else {
        doc.setTextColor(225, 29, 72);
      }
      doc.setFont('helvetica', 'bold');
      doc.text(log.status, 182, gridY + 7);
      
      gridY += 11;
    });

    // Add page numbers footer to all pages
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184); // slate-400
      doc.text(`Page ${i} of ${pageCount}`, 175, 288);
      doc.text('WorkNear Workforce Enterprise Proposal & Cryptographic Audit. Confidential.', 15, 288);
    }
    
    // Save report
    doc.save(`WorkNear_Consolidated_Project_Proposal_${Date.now()}.pdf`);
  };

  if (!isVerifiedOwner) {
    return (
      <div className="bg-slate-50 min-h-[80vh] flex items-center justify-center p-4 sm:p-6" id="owner-verification-panel">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/80 shadow-2xl p-8 space-y-6 text-left relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-teal-100/30 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-100/20 rounded-full blur-2xl pointer-events-none" />
          
          <div className="space-y-2 relative z-10">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 border border-teal-100/50 mb-2">
              <Shield className="h-6 w-6 animate-pulse" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
              Website Owner Authorization
            </h2>
            <p className="text-xs text-slate-500 font-semibold leading-relaxed">
              This panel is restricted to the primary website owner. Secure verification required to establish credentials.
            </p>
          </div>

          {securityError && (
            <div className="p-3.5 bg-rose-50 border border-rose-150 rounded-xl text-xs text-rose-700 font-bold flex items-center space-x-2 animate-pulse">
              <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{securityError}</span>
            </div>
          )}

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              setSecurityError('');
              if (!securityKey.trim()) {
                setSecurityError('Please enter your Website Owner Security Key.');
                return;
              }
              setIsVerifying(true);
              setTimeout(() => {
                const normalized = securityKey.trim().toLowerCase();
                if (normalized === 'seeman2628' || normalized === 'owner2026' || normalized === 'cybersubash230@gmail.com' || normalized === 'admin') {
                  setIsVerifiedOwner(true);
                } else {
                  setSecurityError('Invalid Website Owner Security credentials. Access Denied.');
                }
                setIsVerifying(false);
              }, 800);
            }} 
            className="space-y-4 relative z-10"
          >
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-550">
                Website Owner Security Key
              </label>
              <input
                id="owner-security-key-input"
                type="password"
                placeholder="Enter seeman2628 to authorize"
                value={securityKey}
                onChange={(e) => setSecurityKey(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-teal-600 text-slate-800 transition shadow-inner"
              />
              <p className="text-[9px] text-slate-400 font-semibold italic leading-relaxed">
                Demo Key Hint: <code className="bg-slate-100 text-teal-800 font-mono font-bold px-1.5 py-0.5 rounded">seeman2628</code> or email passcode
              </p>
            </div>

            <button
              id="owner-verify-submit-button"
              type="submit"
              disabled={isVerifying}
              className="w-full bg-slate-900 hover:bg-black text-white text-xs font-black uppercase tracking-wider py-3 rounded-xl transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Validating Credentials...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4.5 w-4.5" />
                  <span>Request Secure Handshake</span>
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[9px] text-slate-400 font-mono font-semibold">
            <span className="flex items-center space-x-1">
              <Server className="h-3 w-3 text-teal-600" />
              <span>TLS_VERIFICATION_PASS</span>
            </span>
            <span>OWNER_ROLE_POLICIES</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="bg-slate-50 min-h-screen text-slate-800 transition-colors duration-200"
      id="admin-page-container"
    >
      {/* Banner */}
      <section className="bg-white border-b border-slate-200/80 py-12 text-left relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 bg-[size:16px_16px] opacity-30" />
        <div className="absolute top-1/2 right-10 -translate-y-1/2 w-80 h-80 bg-blue-50/50 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <span className="text-[10px] uppercase font-bold tracking-widest text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100 inline-block mb-3">
            System Administration Center
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 leading-none">
            Unified Security Console
          </h1>
          <p className="mt-3 text-slate-500 text-xs sm:text-sm max-w-xl">
            Monitor background microservice handshakes, audit UIDAI Aadhaar registry queries, manage global matching states, and enforce strict regulatory EOR compliance metrics.
          </p>
        </div>
      </section>

      {/* Main stats layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Metric Cards Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm text-left flex items-start space-x-4">
            <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 shrink-0">
              <Server className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Server Ingress</span>
              <span className="text-xl font-black text-slate-900 block mt-1 leading-none">100% Online</span>
              <span className="text-[9px] text-emerald-600 font-bold mt-1.5 block">0% latency drops</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm text-left flex items-start space-x-4">
            <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600 shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Aadhaar Vault</span>
              <span className="text-xl font-black text-slate-900 block mt-1 leading-none">12,492 Syncs</span>
              <span className="text-[9px] text-emerald-600 font-bold mt-1.5 block">UIDAI Registry Connected</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm text-left flex items-start space-x-4">
            <div className="p-3 bg-amber-50 rounded-2xl text-amber-600 shrink-0">
              <Activity className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Active Nodes</span>
              <span className="text-xl font-black text-slate-900 block mt-1 leading-none">586 Clusters</span>
              <span className="text-[9px] text-amber-600 font-bold mt-1.5 block">Auto-rebalancing load</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm text-left flex items-start space-x-4">
            <div className="p-3 bg-rose-50 rounded-2xl text-rose-600 shrink-0">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Blocked Alerts</span>
              <span className="text-xl font-black text-slate-900 block mt-1 leading-none">2 Prevented</span>
              <span className="text-[9px] text-rose-600 font-bold mt-1.5 block">Non-compliant blocks active</span>
            </div>
          </div>

        </section>

        {/* Activity Overview Recharts Chart Section */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm text-left mb-8 relative overflow-hidden" id="admin-activity-overview-chart">
          {/* Subtle decorative background gradients */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />

          {/* Title and Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 relative z-10">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-100 inline-block mb-1.5">
                Market Activity Monitoring
              </span>
              <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center space-x-2">
                <Activity className="h-4.5 w-4.5 text-teal-600" />
                <span>Activity Overview</span>
              </h2>
              <p className="text-[11px] text-slate-500 font-semibold leading-relaxed mt-1">
                Visualizing daily job postings dispatched versus successful biometrically-secured contractor handshakes.
              </p>
            </div>

            {/* Interactive Selectors */}
            <div className="flex items-center space-x-2.5 self-stretch sm:self-auto">
              <div className="space-y-0.5">
                <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest">Time range</span>
                <select 
                  id="chart-time-range-select"
                  value={timeRange} 
                  onChange={(e) => setTimeRange(e.target.value as '7days' | '30days')}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-teal-600 transition cursor-pointer"
                >
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                </select>
              </div>

              <div className="space-y-0.5">
                <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest">Visual Style</span>
                <select 
                  id="chart-visual-style-select"
                  value={chartStyle} 
                  onChange={(e) => setChartStyle(e.target.value as 'area' | 'bar' | 'line')}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-teal-600 transition cursor-pointer"
                >
                  <option value="area">Gradated Area</option>
                  <option value="bar">Contrast Bar</option>
                  <option value="line">Precision Line</option>
                </select>
              </div>
            </div>
          </div>

          {/* Quick Metrics within the Chart Section */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-150 mb-6 relative z-10">
            <div>
              <span className="block text-[9px] font-black text-slate-400 uppercase tracking-wider">Total Postings</span>
              <span className="text-lg font-black text-slate-900 mt-0.5 block">{timeRange === '7days' ? '1,119' : '4,847'}</span>
              <span className="text-[9px] text-emerald-600 font-bold mt-0.5 flex items-center">
                <span>+12.4%</span>
                <span className="text-slate-400 font-normal ml-1">v. last week</span>
              </span>
            </div>
            <div>
              <span className="block text-[9px] font-black text-slate-400 uppercase tracking-wider">Approved Matches</span>
              <span className="text-lg font-black text-slate-900 mt-0.5 block">{timeRange === '7days' ? '811' : '3,481'}</span>
              <span className="text-[9px] text-emerald-600 font-bold mt-0.5 flex items-center">
                <span>+14.8%</span>
                <span className="text-slate-400 font-normal ml-1">v. last week</span>
              </span>
            </div>
            <div>
              <span className="block text-[9px] font-black text-slate-400 uppercase tracking-wider">Match-to-Post Ratio</span>
              <span className="text-lg font-black text-teal-700 mt-0.5 block">
                {timeRange === '7days' ? '72.47%' : '71.82%'}
              </span>
              <span className="text-[9px] text-teal-600 font-bold mt-0.5 flex items-center">
                <span>Biometric locked</span>
              </span>
            </div>
            <div>
              <span className="block text-[9px] font-black text-slate-400 uppercase tracking-wider">Avg. Settlement Time</span>
              <span className="text-lg font-black text-slate-900 mt-0.5 block">4.2 min</span>
              <span className="text-[9px] text-blue-650 font-bold mt-0.5 flex items-center">
                <span>Real-time payouts</span>
              </span>
            </div>
          </div>

          {/* Recharts Canvas Container */}
          <div className="h-80 w-full relative z-10 select-none">
            <ResponsiveContainer width="100%" height="100%">
              {chartStyle === 'area' ? (
                <AreaChart data={selectedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPostings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.01}/>
                    </linearGradient>
                    <linearGradient id="colorMatches" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d9488" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#0d9488" stopOpacity={0.01}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="day" 
                    tickLine={false} 
                    axisLine={false} 
                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                  />
                  <YAxis 
                    tickLine={false} 
                    axisLine={false} 
                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    verticalAlign="top" 
                    height={36} 
                    iconType="circle"
                    formatter={(value) => <span className="text-[10px] font-black uppercase tracking-wider text-slate-600">{value}</span>}
                  />
                  <Area 
                    name="Daily Job Postings"
                    type="monotone" 
                    dataKey="postings" 
                    stroke="#3b82f6" 
                    strokeWidth={2.5}
                    fillOpacity={1} 
                    fill="url(#colorPostings)" 
                  />
                  <Area 
                    name="Successful Matches"
                    type="monotone" 
                    dataKey="matches" 
                    stroke="#0d9488" 
                    strokeWidth={2.5}
                    fillOpacity={1} 
                    fill="url(#colorMatches)" 
                  />
                </AreaChart>
              ) : chartStyle === 'bar' ? (
                <BarChart data={selectedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="day" 
                    tickLine={false} 
                    axisLine={false} 
                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                  />
                  <YAxis 
                    tickLine={false} 
                    axisLine={false} 
                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    verticalAlign="top" 
                    height={36} 
                    iconType="circle"
                    formatter={(value) => <span className="text-[10px] font-black uppercase tracking-wider text-slate-600">{value}</span>}
                  />
                  <Bar 
                    name="Daily Job Postings"
                    dataKey="postings" 
                    fill="#3b82f6" 
                    radius={[4, 4, 0, 0]} 
                    maxBarSize={32}
                  />
                  <Bar 
                    name="Successful Matches"
                    dataKey="matches" 
                    fill="#0d9488" 
                    radius={[4, 4, 0, 0]} 
                    maxBarSize={32}
                  />
                </BarChart>
              ) : (
                <LineChart data={selectedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="day" 
                    tickLine={false} 
                    axisLine={false} 
                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                  />
                  <YAxis 
                    tickLine={false} 
                    axisLine={false} 
                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    verticalAlign="top" 
                    height={36} 
                    iconType="circle"
                    formatter={(value) => <span className="text-[10px] font-black uppercase tracking-wider text-slate-600">{value}</span>}
                  />
                  <Line 
                    name="Daily Job Postings"
                    type="monotone" 
                    dataKey="postings" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 1.5 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line 
                    name="Successful Matches"
                    type="monotone" 
                    dataKey="matches" 
                    stroke="#0d9488" 
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 1.5 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </section>

        {/* Dashboard Panels Split */}
        <section className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm text-left">
          
          {/* Section Navigation Tabs */}
          <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('audit')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'audit'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Security Audit Log
              </button>
              <button
                onClick={() => setActiveTab('metrics')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'metrics'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Compliance Engine
              </button>
              <button
                onClick={() => setActiveTab('roadmap')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                  activeTab === 'roadmap'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <GitCommit className="h-3.5 w-3.5" />
                <span>Enterprise Roadmap</span>
              </button>
            </div>

            {/* Live Status indicator */}
            <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full text-[10px] font-bold text-emerald-700">
              <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-ping" />
              <span>LOG STREAM SECURE (TLS 1.3)</span>
            </div>
          </div>

          <div className="p-6">
            <AnimatePresence mode="wait">
              
              {activeTab === 'audit' && (
                <motion.div
                  key="audit"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  {/* Interactive Event Logger & Simulator Panel */}
                  <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 text-left relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />
                    
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                      <div>
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                          <Settings className="h-4 w-4 text-teal-600 animate-spin" />
                          <span>Interactive Security Event Logger</span>
                        </h3>
                        <p className="text-[11px] text-slate-500 font-semibold leading-relaxed mt-1">
                          Simulate and dispatch live login attempts, biometric liveness evaluations, and cryptographic token rotations to the ledger.
                        </p>
                      </div>
                      <span className="text-[10px] bg-teal-50 text-teal-700 font-mono font-bold px-2.5 py-1 rounded-full border border-teal-100/60">
                        AUDIT_LEDGER: SIMULATION_GRID
                      </span>
                    </div>

                    {/* Simulation Inputs Form */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 pt-1">
                      <div className="space-y-1">
                        <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400">
                          Predefined Event Pattern
                        </label>
                        <select
                          id="log-simulation-event-select"
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-teal-600"
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val) {
                              // Auto fill other fields based on selected predefined event
                              const customEventInput = document.getElementById('log-simulation-custom-input') as HTMLInputElement;
                              if (customEventInput) customEventInput.value = val;
                            }
                          }}
                        >
                          <option value="Employee Login Attempt - Success">Employee Login - Success</option>
                          <option value="Failed login attempt - IP blocked due to rate limits">Login Failed - IP Blocked</option>
                          <option value="Liveness matched successfully: 99.2% landmarks">Biometric Face Synced</option>
                          <option value="MFA challenge approved - secure SMS handshake verified">SMS OTP Verified</option>
                          <option value="JWT Token Rotation Cycle - payload signed with AES256">JWT Token Refreshed</option>
                          <option value="Sensitive action detected: updated payroll daily wage limits">Wage Limit Modified</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400">
                          Custom Payload Details
                        </label>
                        <input
                          id="log-simulation-custom-input"
                          type="text"
                          defaultValue="Employee Login Attempt - Success"
                          placeholder="Or enter custom audit details..."
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-teal-600"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400">
                          Payload Status
                        </label>
                        <select
                          id="log-simulation-status-select"
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-teal-600"
                        >
                          <option value="SUCCESS">SUCCESS</option>
                          <option value="WARNING">WARNING</option>
                          <option value="FAILED">FAILED</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400">
                          Severity Level
                        </label>
                        <select
                          id="log-simulation-severity-select"
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-teal-600"
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="Critical">Critical</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400">
                          Audit module Unit
                        </label>
                        <select
                          id="log-simulation-module-select"
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-teal-600"
                        >
                          <option value="AuthService">AuthService</option>
                          <option value="IdentityAudit">IdentityAudit</option>
                          <option value="SecurityService">SecurityService</option>
                          <option value="LocationEngine">LocationEngine</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end mt-4">
                      <button
                        type="button"
                        onClick={() => {
                          const eventInput = document.getElementById('log-simulation-custom-input') as HTMLInputElement;
                          const statusSelect = document.getElementById('log-simulation-status-select') as HTMLSelectElement;
                          const moduleSelect = document.getElementById('log-simulation-module-select') as HTMLSelectElement;
                          const severitySelect = document.getElementById('log-simulation-severity-select') as HTMLSelectElement;
                          
                          if (!eventInput || !eventInput.value.trim()) return;

                          const now = new Date();
                          const timestamp = now.toISOString().replace('T', ' ').substring(0, 19);
                          
                          const newLog: AuditLog = {
                            id: `log-${Date.now()}`,
                            timestamp,
                            event: eventInput.value.trim(),
                            status: statusSelect.value as 'SUCCESS' | 'WARNING' | 'FAILED',
                            module: moduleSelect.value,
                            severity: severitySelect.value as 'Low' | 'Medium' | 'Critical'
                          };

                          setLogs(prev => [newLog, ...prev]);
                        }}
                        className="bg-teal-600 hover:bg-teal-700 text-white text-[10px] font-black uppercase tracking-wider px-4 py-2 rounded-xl transition flex items-center space-x-2 cursor-pointer shadow-md shadow-teal-600/10"
                      >
                        <Terminal className="h-3.5 w-3.5 animate-pulse" />
                        <span>Inject Verified Security Event</span>
                      </button>
                    </div>
                  </div>

                   <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="text-left">
                      <p className="text-xs text-slate-500 font-semibold">
                        Real-time ledger events captured across active recruitment and identity validation service modules.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                      {/* Export Full Proposal Button */}
                      <button
                        type="button"
                        id="export-full-proposal-btn"
                        onClick={handleDownloadProposalPDF}
                        className="w-full sm:w-auto whitespace-nowrap bg-slate-900 hover:bg-black border border-slate-800 text-teal-400 text-[10px] font-black uppercase tracking-wider px-4.5 py-2.5 rounded-xl transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-md shadow-slate-900/20"
                      >
                        <FileText className="h-3.5 w-3.5 text-teal-400 animate-pulse" />
                        <span>Export Full Proposal</span>
                      </button>

                      {/* Download PDF Report Button */}
                      <button
                        type="button"
                        id="download-audit-pdf-btn"
                        onClick={handleDownloadPDF}
                        className="w-full sm:w-auto whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-wider px-4.5 py-2.5 rounded-xl transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-md shadow-blue-600/15"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Download PDF Report</span>
                      </button>
                    </div>
                  </div>

                  {/* Audit Telemetry Filter Hub */}
                  <div className="bg-slate-50/75 border border-slate-200 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-left" id="audit-telemetry-filter-hub">
                    {/* Keyword search */}
                    <div className="space-y-1">
                      <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400">
                        Keyword / ID Search
                      </label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                        <input
                          type="text"
                          id="audit-search-keyword"
                          placeholder="Search payload, unit, etc..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl pl-8.5 pr-3 py-1.5 text-xs font-bold text-slate-800 outline-none focus:border-blue-650"
                        />
                      </div>
                    </div>

                    {/* Module Filter */}
                    <div className="space-y-1">
                      <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400">
                        Event Unit (Module)
                      </label>
                      <select
                        id="audit-filter-module"
                        value={selectedModule}
                        onChange={(e) => setSelectedModule(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-blue-650 cursor-pointer"
                      >
                        <option value="All">All Modules</option>
                        <option value="AuthService">AuthService</option>
                        <option value="LocationEngine">LocationEngine</option>
                        <option value="MatchingService">MatchingService</option>
                        <option value="VaultEngine">VaultEngine</option>
                        <option value="IdentityAudit">IdentityAudit</option>
                      </select>
                    </div>

                    {/* Status Filter */}
                    <div className="space-y-1">
                      <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400">
                        Status Docket
                      </label>
                      <select
                        id="audit-filter-status"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-blue-650 cursor-pointer"
                      >
                        <option value="All">All Statuses</option>
                        <option value="SUCCESS">SUCCESS</option>
                        <option value="WARNING">WARNING</option>
                        <option value="FAILED">FAILED</option>
                      </select>
                    </div>

                    {/* Severity Filter */}
                    <div className="space-y-1">
                      <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400">
                        Severity Class
                      </label>
                      <select
                        id="audit-filter-severity"
                        value={selectedSeverity}
                        onChange={(e) => setSelectedSeverity(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-blue-650 cursor-pointer"
                      >
                        <option value="All">All Severities</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="Critical">Critical</option>
                      </select>
                    </div>

                    {/* Dynamic Sort Ledger (A-Z & Up-Down) & Reset Column */}
                    <div className="space-y-1 flex flex-col justify-between">
                      <div>
                        <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">
                          Sort & Order Ledger
                        </label>
                        <select
                          id="audit-filter-sorting"
                          value={`${sortKey}_${sortDirection}`}
                          onChange={(e) => {
                            const [key, dir] = e.target.value.split('_') as [any, any];
                            setSortKey(key);
                            setSortDirection(dir);
                          }}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-blue-650 cursor-pointer"
                        >
                          <option value="timestamp_desc">Time: Newest First (↓)</option>
                          <option value="timestamp_asc">Time: Oldest First (↑)</option>
                          <option value="event_asc">Event Name: A to Z (↑)</option>
                          <option value="event_desc">Event Name: Z to A (↓)</option>
                          <option value="module_asc">Unit: A to Z (↑)</option>
                          <option value="module_desc">Unit: Z to A (↓)</option>
                          <option value="severity_asc">Severity: Low to High (↑)</option>
                          <option value="severity_desc">Severity: High to Low (↓)</option>
                          <option value="status_asc">Status: A to Z (↑)</option>
                          <option value="status_desc">Status: Z to A (↓)</option>
                        </select>
                      </div>
                      
                      {(searchTerm || selectedModule !== 'All' || selectedStatus !== 'All' || selectedSeverity !== 'All' || sortKey !== 'timestamp' || sortDirection !== 'desc') && (
                        <button
                          type="button"
                          id="audit-clear-filters-btn"
                          onClick={() => {
                            setSearchTerm('');
                            setSelectedModule('All');
                            setSelectedStatus('All');
                            setSelectedSeverity('All');
                            setSortKey('timestamp');
                            setSortDirection('desc');
                          }}
                          className="text-[9px] text-rose-600 hover:text-rose-700 font-bold uppercase tracking-widest self-end mt-2 flex items-center space-x-1 cursor-pointer"
                        >
                          <span>Reset Ledger Filters</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Table view */}
                  <div className="border border-slate-150 rounded-2xl overflow-hidden bg-white">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-150 text-[9px] uppercase font-bold text-slate-400 tracking-widest">
                          <th 
                            className="p-4 cursor-pointer hover:bg-slate-100/80 transition-colors select-none"
                            onClick={() => {
                              if (sortKey === 'timestamp') {
                                setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                              } else {
                                setSortKey('timestamp');
                                setSortDirection('desc');
                              }
                            }}
                          >
                            <div className="flex items-center space-x-1">
                              <span>Time Node</span>
                              <span className="text-[10px] text-blue-600">
                                {sortKey === 'timestamp' ? (sortDirection === 'asc' ? '▲' : '▼') : '⇅'}
                              </span>
                            </div>
                          </th>
                          <th 
                            className="p-4 cursor-pointer hover:bg-slate-100/80 transition-colors select-none"
                            onClick={() => {
                              if (sortKey === 'event') {
                                setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                              } else {
                                setSortKey('event');
                                setSortDirection('asc');
                              }
                            }}
                          >
                            <div className="flex items-center space-x-1">
                              <span>Audited Event Payload</span>
                              <span className="text-[10px] text-blue-600">
                                {sortKey === 'event' ? (sortDirection === 'asc' ? '▲' : '▼') : '⇅'}
                              </span>
                            </div>
                          </th>
                          <th 
                            className="p-4 cursor-pointer hover:bg-slate-100/80 transition-colors select-none"
                            onClick={() => {
                              if (sortKey === 'module') {
                                setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                              } else {
                                setSortKey('module');
                                setSortDirection('asc');
                              }
                            }}
                          >
                            <div className="flex items-center space-x-1">
                              <span>Regulatory Unit</span>
                              <span className="text-[10px] text-blue-600">
                                {sortKey === 'module' ? (sortDirection === 'asc' ? '▲' : '▼') : '⇅'}
                              </span>
                            </div>
                          </th>
                          <th 
                            className="p-4 cursor-pointer hover:bg-slate-100/80 transition-colors select-none text-center"
                            onClick={() => {
                              if (sortKey === 'severity') {
                                setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                              } else {
                                setSortKey('severity');
                                setSortDirection('asc');
                              }
                            }}
                          >
                            <div className="flex items-center justify-center space-x-1">
                              <span>Severity</span>
                              <span className="text-[10px] text-blue-600">
                                {sortKey === 'severity' ? (sortDirection === 'asc' ? '▲' : '▼') : '⇅'}
                              </span>
                            </div>
                          </th>
                          <th 
                            className="p-4 cursor-pointer hover:bg-slate-100/80 transition-colors select-none text-center"
                            onClick={() => {
                              if (sortKey === 'status') {
                                setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                              } else {
                                setSortKey('status');
                                setSortDirection('asc');
                              }
                            }}
                          >
                            <div className="flex items-center justify-center space-x-1">
                              <span>Status Docket</span>
                              <span className="text-[10px] text-blue-600">
                                {sortKey === 'status' ? (sortDirection === 'asc' ? '▲' : '▼') : '⇅'}
                              </span>
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-[11px] font-medium text-slate-600 font-mono">
                        {filteredLogs.map((log) => (
                          <tr key={log.id} className="hover:bg-slate-50/50 transition">
                            <td className="p-4 text-slate-400 font-bold whitespace-nowrap">
                              {log.timestamp}
                            </td>
                            <td className="p-4 text-slate-800 font-black tracking-tight font-sans">
                              {log.event}
                            </td>
                            <td className="p-4 text-blue-650 font-bold">
                              {log.module}
                            </td>
                            <td className="p-4">
                              <div className="flex items-center justify-center">
                                <span className={`text-[9px] font-black tracking-wide px-2.5 py-0.5 rounded border uppercase ${
                                  log.severity === 'Critical'
                                    ? 'bg-rose-50 text-rose-700 border-rose-100'
                                    : log.severity === 'Medium'
                                    ? 'bg-amber-50 text-amber-700 border-amber-100'
                                    : 'bg-blue-50 text-blue-700 border-blue-100'
                                }`}>
                                  {log.severity || 'Low'}
                                </span>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center justify-center">
                                <span className={`text-[9px] font-black tracking-wide px-2 py-0.5 rounded border uppercase ${
                                  log.status === 'SUCCESS'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                    : log.status === 'WARNING'
                                    ? 'bg-amber-50 text-amber-700 border-amber-100'
                                    : 'bg-rose-50 text-rose-700 border-rose-100'
                                }`}>
                                  {log.status}
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {activeTab === 'roadmap' && (
                <motion.div
                  key="roadmap"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  {/* Panel Header */}
                  <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 text-left relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                          <Compass className="h-4 w-4 text-blue-600" />
                          <span>Interactive Enterprise Roadmap & Audit Phases</span>
                        </h3>
                        <p className="text-[11px] text-slate-500 font-semibold leading-relaxed mt-1">
                          Click on the timeline nodes to audit development milestones, active security review periods, and global compliance phases.
                        </p>
                      </div>
                      <span className="text-[10px] bg-blue-50 text-blue-700 font-mono font-bold px-2.5 py-1 rounded-full border border-blue-100/60">
                        ROADMAP_ENGINE: D3_TIMELINE
                      </span>
                    </div>
                  </div>

                  {/* Filter Toolbar */}
                  <div className="flex flex-wrap items-center gap-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-150">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Category Filter:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {['All', 'Feature', 'Security', 'Compliance'].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => {
                            setRoadmapCategoryFilter(cat);
                            const filtered = cat === 'All' 
                              ? roadmapMilestones 
                              : roadmapMilestones.filter(m => m.category === cat);
                            if (filtered.length > 0 && !filtered.find(m => m.id === selectedMilestone.id)) {
                              setSelectedMilestone(filtered[0]);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                            roadmapCategoryFilter === cat
                              ? 'bg-slate-900 text-white'
                              : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dual Grid: D3 Canvas & Selected Node details panel */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* D3 Timeline SVG Container */}
                    <div className="lg:col-span-2 space-y-3">
                      <div className="flex items-center justify-between px-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          Active Timeline Graph (D3.js)
                        </span>
                        <span className="text-[9px] font-bold text-slate-500 flex items-center space-x-1">
                          <span>Click node to select</span>
                          <ArrowRight className="h-2.5 w-2.5" />
                        </span>
                      </div>
                      <div id="roadmap-d3-timeline-container" className="h-[310px] w-full">
                        <D3RoadmapTimeline
                          milestones={filteredMilestones}
                          onSelectMilestone={(m) => setSelectedMilestone(m)}
                          selectedMilestoneId={selectedMilestone.id}
                        />
                      </div>
                    </div>

                    {/* Milestone Details Sidepanel */}
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5 text-left relative overflow-hidden flex flex-col justify-between">
                      <div className="space-y-4">
                        {/* Header: Quarter & Badge */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black font-mono tracking-widest text-slate-400 uppercase">
                            {selectedMilestone.quarter}
                          </span>
                          <span className={`text-[9px] font-black tracking-wide px-2 py-0.5 rounded border uppercase ${
                            selectedMilestone.category === 'Feature'
                              ? 'bg-blue-50 text-blue-700 border-blue-100'
                              : selectedMilestone.category === 'Security'
                              ? 'bg-teal-50 text-teal-700 border-teal-100'
                              : 'bg-purple-50 text-purple-700 border-purple-100'
                          }`}>
                            {selectedMilestone.category}
                          </span>
                        </div>

                        {/* Title & Status */}
                        <div>
                          <h4 className="text-base font-black text-slate-900 leading-snug">
                            {selectedMilestone.title}
                          </h4>
                          <div className="flex items-center space-x-1.5 mt-1">
                            <span className={`h-1.5 w-1.5 rounded-full ${
                              selectedMilestone.status === 'Completed'
                                ? 'bg-emerald-500'
                                : selectedMilestone.status === 'In-Progress'
                                ? 'bg-amber-500 animate-pulse'
                                : 'bg-slate-400'
                            }`} />
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                              {selectedMilestone.status}
                            </span>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                          {selectedMilestone.description}
                        </p>

                        {/* Checklist Details */}
                        <div className="space-y-2 pt-1 border-t border-slate-100">
                          <span className="block text-[8px] font-black uppercase tracking-widest text-slate-400">
                            Key Specifications
                          </span>
                          <div className="space-y-1.5">
                            {selectedMilestone.details.map((detail, idx) => (
                              <div key={idx} className="flex items-start space-x-2">
                                <span className="mt-1 h-1 w-1 bg-slate-300 rounded-full flex-shrink-0" />
                                <span className="text-[10px] text-slate-600 font-semibold leading-tight">
                                  {detail}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Owner Badge */}
                        <div className="pt-2">
                          <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 block mb-1">
                            Owner / Custodian
                          </span>
                          <div className="inline-flex items-center space-x-1.5 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200 text-[10px] font-bold text-slate-700">
                            <span className="h-1.5 w-1.5 bg-blue-500 rounded-full" />
                            <span>{selectedMilestone.owner}</span>
                          </div>
                        </div>
                      </div>

                      {/* Interactive Trigger Actions in details panel */}
                      <div className="pt-4 border-t border-slate-100 mt-4 space-y-2.5">
                        <span className="block text-[8px] font-black uppercase tracking-widest text-slate-400">
                          Audit Actions
                        </span>
                        
                        {selectedMilestone.status === 'Completed' && (
                          <button
                            type="button"
                            onClick={() => {
                              const newLog = {
                                id: `log-${Date.now()}`,
                                timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
                                event: `Cryptographic audit attestation accessed for ${selectedMilestone.title}`,
                                status: 'SUCCESS' as const,
                                module: 'SecurityAudit',
                                severity: 'Low' as const
                              };
                              setLogs(prev => [newLog, ...prev]);
                              alert(`Decrypted Secure Credentials Verification Token for ${selectedMilestone.title}. Hash logged to telemetry ledger!`);
                            }}
                            className="w-full bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider py-2 rounded-xl transition flex items-center justify-center space-x-1.5 cursor-pointer"
                          >
                            <ShieldCheck className="h-3.5 w-3.5" />
                            <span>Verify Attestation Hash</span>
                          </button>
                        )}

                        {selectedMilestone.status === 'In-Progress' && (
                          <button
                            type="button"
                            onClick={() => {
                              const newLog = {
                                id: `log-${Date.now()}`,
                                timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
                                event: `Simulated localized verification handshake dispatched for ${selectedMilestone.title}`,
                                status: 'SUCCESS' as const,
                                module: 'LocationEngine',
                                severity: 'Medium' as const
                              };
                              setLogs(prev => [newLog, ...prev]);
                              alert(`Handshake Simulation success! Target reticle focal distance calculated. Live telemetry entry generated.`);
                            }}
                            className="w-full bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider py-2 rounded-xl transition flex items-center justify-center space-x-1.5 cursor-pointer"
                          >
                            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                            <span>Simulate Focal Mesh Verification</span>
                          </button>
                        )}

                        {selectedMilestone.status === 'Upcoming' && (
                          <button
                            type="button"
                            onClick={() => {
                              const newLog = {
                                id: `log-${Date.now()}`,
                                timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
                                event: `Early pre-audit allocation requested for upcoming phase: ${selectedMilestone.title}`,
                                status: 'WARNING' as const,
                                module: 'AdminPortal',
                                severity: 'Medium' as const
                              };
                              setLogs(prev => [newLog, ...prev]);
                              alert(`Early pre-audit phase allocation request dispatched to the Executive Board. Logged with severity: Medium.`);
                            }}
                            className="w-full bg-slate-900 hover:bg-black text-white text-[10px] font-bold uppercase tracking-wider py-2 rounded-xl transition flex items-center justify-center space-x-1.5 cursor-pointer"
                          >
                            <Terminal className="h-3.5 w-3.5 text-teal-400" />
                            <span>Request Pre-Audit Allocation</span>
                          </button>
                        )}
                      </div>

                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'metrics' && (
                <motion.div
                  key="metrics"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-2">Verification Handshake Rules</h3>
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                      Configure dynamic regulatory parameters for automated payroll checks and active microservice endpoints.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-semibold">
                    <div className="p-5 border border-slate-200 rounded-3xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-900 uppercase tracking-wider">Aadhaar Checking Protocol</span>
                        <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">Strict Enforcement</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Forces UIDAI biometric cross-referencing and facial structure scans prior to granting access to active employer portals.
                      </p>
                    </div>

                    <div className="p-5 border border-slate-200 rounded-3xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-900 uppercase tracking-wider">Hourly Payrate Caps</span>
                        <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">Automatic Monitor</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Validates local currency settlements on hypergigs to adhere strictly with India regional daily wage statutory mandates.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

        </section>

      </main>
    </motion.div>
  );
}
