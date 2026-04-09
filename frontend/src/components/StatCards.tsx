"use client";

import React from "react";
import { motion } from "framer-motion";
import { Map as MapIcon, Shield, Users } from "lucide-react";

interface StatCardsProps {
  metrics: {
    avgOccupancy: number;
    criticalZones: number;
    totalZones: number;
  };
}

export const StatCards = ({ metrics }: StatCardsProps) => {
  const stats = [
    { label: "Average Occupancy", value: `${(metrics.avgOccupancy * 100).toFixed(0)}%`, icon: Users, color: "text-blue-500" },
    { label: "Active Zones", value: metrics.totalZones, icon: MapIcon, color: "text-indigo-500" },
    { label: "Critical Alerts", value: metrics.criticalZones, icon: Shield, color: metrics.criticalZones > 0 ? "text-red-500" : "text-green-500" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      {stats.map((stat, i) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          key={stat.label}
          className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-3xl backdrop-blur-sm relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <stat.icon className="w-16 h-16" />
          </div>
          <p className="text-sm text-zinc-500 font-medium mb-1">{stat.label}</p>
          <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
        </motion.div>
      ))}
    </div>
  );
};
