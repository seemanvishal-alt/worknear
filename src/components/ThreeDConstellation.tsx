/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  color: string;
}

export default function ThreeDConstellation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.width = 400;
    let height = canvas.height = 400;

    // Handle container resizing
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newWidth, height: newHeight } = entry.contentRect;
        width = canvas.width = newWidth || 400;
        height = canvas.height = newHeight || 400;
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // 3D Engine Constants
    const NUM_PARTICLES = 50;
    const FOCAL_LENGTH = 280;
    const particles: Particle[] = [];
    const colors = ['#0d9488', '#0284c7', '#d97706', '#059669'];

    // Initialize 3D particles in a spherical layout
    for (let i = 0; i < NUM_PARTICLES; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const radius = 100 + Math.random() * 40;

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      particles.push({
        x,
        y,
        z,
        baseX: x,
        baseY: y,
        baseZ: z,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        vz: (Math.random() - 0.5) * 0.2,
        color: colors[i % colors.length],
      });
    }

    // Rotation angles
    let angleX = 0.002;
    let angleY = 0.003;

    // Track mouse coordinates
    const mouse = { x: 0, y: 0, active: false };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left - rect.width / 2;
      mouse.y = e.clientY - rect.top - rect.height / 2;
      mouse.active = true;

      // Adjust rotation speed based on cursor offset
      angleY = (e.clientX - rect.left - rect.width / 2) * 0.00003;
      angleX = (e.clientY - rect.top - rect.height / 2) * 0.00003;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      angleX = 0.002;
      angleY = 0.003;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // 3D Projection & Rendering Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Set white-slate canvas background
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, width, height);

      // Draw subtle background radial glow representing sovereign network node matching
      const gradient = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, Math.max(width, height) / 2);
      gradient.addColorStop(0, 'rgba(13, 148, 136, 0.08)');
      gradient.addColorStop(1, 'rgba(248, 250, 252, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Rotate and Project Particles
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      // Store projected 2D coords for linking
      const projected: { x: number; y: number; z: number; color: string; scale: number }[] = [];

      for (const p of particles) {
        // Apply rotation matrices around X axis (Pitch)
        let y1 = p.y * cosX - p.z * sinX;
        let z1 = p.z * cosX + p.y * sinX;

        // Apply rotation matrices around Y axis (Yaw)
        let x2 = p.x * cosY - z1 * sinY;
        let z2 = z1 * cosY + p.x * sinY;

        // Update raw positions back to particles
        p.x = x2 + p.vx;
        p.y = y1 + p.vy;
        p.z = z2 + p.vz;

        // Slow return forces to original base orbital boundaries
        const distFromBase = Math.sqrt(p.x * p.x + p.y * p.y + p.z * p.z);
        if (distFromBase > 160) {
          p.vx -= p.x * 0.0002;
          p.vy -= p.y * 0.0002;
          p.vz -= p.z * 0.0002;
        } else if (distFromBase < 80) {
          p.vx += p.x * 0.0002;
          p.vy += p.y * 0.0002;
          p.vz += p.z * 0.0002;
        }

        // Apply cursor gravity forces in 3D
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            const pull = (120 - distance) * 0.0003;
            p.vx += dx * pull;
            p.vy += dy * pull;
          }
        }

        // Friction to keep systems from exploding
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.vz *= 0.98;

        // Projection 3D to 2D
        const scale = FOCAL_LENGTH / (FOCAL_LENGTH + p.z);
        const projX = centerX + p.x * scale;
        const projY = centerY + p.y * scale;

        projected.push({
          x: projX,
          y: projY,
          z: p.z,
          color: p.color,
          scale: scale,
        });
      }

      // Draw constellation links (Lines connecting nearby projected points)
      for (let i = 0; i < projected.length; i++) {
        const pi = projected[i];
        for (let j = i + 1; j < projected.length; j++) {
          const pj = projected[j];

          const dx = pi.x - pj.x;
          const dy = pi.y - pj.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Threshold for showing link connection
          if (dist < 85) {
            const averageZ = (pi.z + pj.z) / 2;
            const alpha = (1 - dist / 85) * (1 - (averageZ + 140) / 280) * 0.35;

            ctx.beginPath();
            ctx.moveTo(pi.x, pi.y);
            ctx.lineTo(pj.x, pj.y);
            
            // Premium teal connection path
            ctx.strokeStyle = `rgba(13, 148, 136, ${Math.max(0, Math.min(1, alpha * 1.5))})`;
            ctx.lineWidth = pi.scale * 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw projected nodes
      for (const p of projected) {
        // Map depth to visual properties
        const size = Math.max(1.5, p.scale * 3.5);
        // Map depth to alpha (nearer is brighter, further is softer)
        const depthAlpha = Math.max(0.15, Math.min(0.9, 1 - (p.z + 140) / 280));

        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = depthAlpha;
        ctx.fill();

        // Glowing outer aura for premium display effect
        if (depthAlpha > 0.6) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, size * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = p.color === '#d97706' ? 'rgba(217, 119, 6, 0.12)' : 'rgba(13, 148, 136, 0.12)';
          ctx.fill();
        }
        ctx.globalAlpha = 1.0;
      }

      // Render overlay status message
      ctx.fillStyle = 'rgba(71, 85, 105, 0.4)';
      ctx.font = '10px monospace';
      ctx.fillText('3D_ALIGNMENT_MATRIX: LIVE_CONSTELLATION', 20, height - 20);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-full min-h-[300px] flex items-center justify-center bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
    >
      <canvas 
        ref={canvasRef} 
        className="block w-full h-full max-w-full max-h-full cursor-crosshair"
      />
      
      {/* Absolute overlay details to match Premium high-dimensional UI */}
      <div className="absolute top-4 left-4 flex flex-col space-y-1 bg-white/90 backdrop-blur-md p-3 rounded-xl border border-slate-200 pointer-events-none">
        <span className="text-[10px] uppercase tracking-widest text-teal-800 font-bold font-mono flex items-center">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse mr-2" />
          Neural Sourcing Active
        </span>
        <span className="text-[9px] text-slate-500 font-mono">Precision Index: 99.8%</span>
      </div>

      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-md border border-slate-200 pointer-events-none">
        <span className="text-[9px] text-slate-600 font-mono">FPS: 60.0 / 3D_ORTHO</span>
      </div>
    </div>
  );
}
