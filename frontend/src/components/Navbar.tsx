"use client";

import React from "react";
import { Activity, Bell, Menu } from "lucide-react";

interface NavbarProps {
  criticalZones: number;
}

export const Navbar = ({ criticalZones }: NavbarProps) => {
  return (
    <>
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:bg-blue-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-b-lg focus:left-4"
      >
        Skip to main content
      </a>
      <nav 
        role="navigation"
        aria-label="Main Navigation"
        className="border-b border-zinc-800 bg-black/50 backdrop-blur-md sticky top-0 z-50"
      >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Activity className="w-6 h-6 text-white" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">CrowdSense <span className="text-blue-500">AI</span></h1>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Smart Stadium Experience</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900 rounded-full border border-zinc-800">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-zinc-400 font-medium">Live System Status: Optimal</span>
          </div>
          <button aria-label="Notifications" className="text-zinc-400 hover:text-white transition-colors relative">
            <Bell className="w-5 h-5" />
            {criticalZones > 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>
          <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden">
             <div className="w-full h-full bg-gradient-to-tr from-zinc-700 to-zinc-900" />
          </div>
        </div>
        <button aria-label="Open Menu" className="md:hidden p-2 text-zinc-400">
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </nav>
    </>
  );
};
