"use client";

import React from "react";
import { motion } from "framer-motion";
import { Map as MapIcon } from "lucide-react";

interface Zone {
  id: string;
  name: string;
  current_density: number;
  status: string;
}

interface HeatmapProps {
  zones: Zone[];
}

export const Heatmap = ({ zones }: HeatmapProps) => {
  return (
    <section 
      className="bg-zinc-900/30 rounded-3xl p-8 border border-zinc-800/50"
      aria-labelledby="heatmap-title"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 bg-indigo-500/10 rounded-2xl">
          <MapIcon className="w-6 h-6 text-indigo-500" aria-hidden="true" />
        </div>
        <div>
          <h3 id="heatmap-title" className="text-lg font-bold">Stadium Heatmap</h3>
          <p className="text-sm text-zinc-500">Live zone occupancy across gate entrances.</p>
        </div>
      </div>
      
      {/* Screen reader only description */}
      <div className="sr-only" aria-live="polite">
        Current stadium heatmap overview: {zones.map(z => `${z.name} is at ${(z.current_density * 100).toFixed(0)}% capacity`).join(', ')}.
      </div>

      <div 
        className="aspect-video bg-zinc-950 rounded-2xl border border-zinc-800 relative overflow-hidden flex items-center justify-center"
        role="img"
        aria-label="A graphical heatmap of the stadium showing crowd densities in different zones."
      >
        <svg viewBox="0 0 800 400" className="w-full h-full opacity-80" aria-hidden="true">
          <rect x="50" y="50" width="700" height="300" rx="40" fill="none" stroke="#27272a" strokeWidth="2" strokeDasharray="10 10" />
          {zones.map((zone, i) => {
            const x = 100 + (i * 150);
            const color = zone.current_density > 0.8 ? "#ef4444" : zone.current_density > 0.5 ? "#f59e0b" : "#3b82f6";
            return (
              <g key={zone.id}>
                <motion.circle 
                  cx={x} cy="200" r={40 + ((zone.current_density || 0) * 40)} 
                  fill={color} 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: (zone.current_density || 0) * 0.4 }}
                  className="blur-xl" 
                />
                <circle cx={x} cy="200" r="10" fill={color} />
                <text x={x} y="260" textAnchor="middle" fill="#71717a" fontSize="12" className="font-medium">{zone.name}</text>
              </g>
            );
          })}
        </svg>
        <div className="absolute bottom-4 right-4 flex gap-4 text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500" /> Normal</div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-yellow-500" /> Congested</div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500" /> Critical</div>
        </div>
      </div>
    </section>
  );
};
