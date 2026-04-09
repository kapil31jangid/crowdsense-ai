"use client";

import React from "react";
import { Clock } from "lucide-react";

interface Queue {
  id: string;
  name: string;
  wait_time: number;
  length: number;
}

interface QueueListProps {
  queues: Queue[];
}

export const QueueList = ({ queues }: QueueListProps) => {
  return (
    <section aria-labelledby="queue-title">
      <h3 id="queue-title" className="text-xl font-bold mb-6 flex items-center gap-2">
        <Clock className="w-5 h-5 text-indigo-400" aria-hidden="true" />
        Live Queue Estimations
      </h3>
      <div className="grid grid-cols-1 gap-4" role="list" aria-label="List of queues and wait times">
        {queues.map((q) => (
          <div 
            key={q.id} 
            role="listitem"
            className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-2xl flex items-center justify-between transition-all hover:bg-zinc-900/80 group focus-within:ring-2 focus-within:ring-blue-500 outline-none"
            tabIndex={0}
          >
            <div>
              <div className="text-sm font-medium text-zinc-100 group-hover:text-white transition-colors">{q.name}</div>
              <div className="text-xs text-zinc-500">{q.length} people in line</div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-indigo-400" aria-label={`Wait time: ${q.wait_time} minutes`}>{q.wait_time} min</div>
              <div className="text-[10px] text-zinc-600 uppercase font-black tracking-tighter">Est. Wait</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
