"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query } from "firebase/firestore";
import { CrowdMetric } from "@/components/CrowdMetric";
import { ChatInterface } from "@/components/ChatInterface";
import { Navbar } from "@/components/Navbar";
import { StatCards } from "@/components/StatCards";
import { Heatmap } from "@/components/Heatmap";
import { QueueList } from "@/components/QueueList";
import { Badge } from "@/components/ui/badge";
import { Activity } from "lucide-react";
import { toast, Toaster } from "sonner";

interface Zone {
  id: string;
  name: string;
  current_density: number;
  max_capacity: number;
  status: string;
}

interface Queue {
  id: string;
  name: string;
  wait_time: number;
  length: number;
}

export default function Dashboard() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [queues, setQueues] = useState<Queue[]>([]);
  const [metrics, setMetrics] = useState({
    avgOccupancy: 0,
    criticalZones: 0,
    totalZones: 0
  });

  useEffect(() => {
    const qZones = query(collection(db, "zones"));
    const unsubscribeZones = onSnapshot(qZones, (snapshot) => {
      const zonesData: Zone[] = [];
      let totalDensity = 0;
      let critical = 0;

      snapshot.forEach((doc) => {
        const data = doc.data() as Omit<Zone, 'id'>;
        zonesData.push({ id: doc.id, ...data });
        totalDensity += data.current_density;
        if (data.status === "Critical") {
          critical++;
          toast.error(`Critical density in ${data.name}!`, {
            description: "AI suggests rerouting attendees immediately.",
          });
        }
      });

      setZones(zonesData);
      setMetrics({
        avgOccupancy: zonesData.length > 0 ? totalDensity / zonesData.length : 0,
        criticalZones: critical,
        totalZones: zonesData.length
      });
    });

    const qQueues = query(collection(db, "queues"));
    const unsubscribeQueues = onSnapshot(qQueues, (snapshot) => {
      const queuesData: Queue[] = [];
      snapshot.forEach((doc) => {
        queuesData.push({ id: doc.id, ...doc.data() as Omit<Queue, 'id'> });
      });
      setQueues(queuesData);
    });

    return () => {
      unsubscribeZones();
      unsubscribeQueues();
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30">
      <Navbar criticalZones={metrics.criticalZones} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <StatCards metrics={metrics} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Activity className="w-6 h-6 text-blue-500" />
                  Real-time Density Metrics
                </h2>
                <Badge variant="outline" className="border-zinc-800 text-zinc-400">
                  Live View
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {zones.map((zone) => (
                  <CrowdMetric 
                    key={zone.id} 
                    name={zone.name} 
                    density={zone.current_density} 
                    status={zone.status} 
                  />
                ))}
              </div>
            </section>

            <Heatmap zones={zones} />
            <QueueList queues={queues} />
          </div>

          <div className="space-y-8">
            <section className="sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  AI Decision Support
                </h2>
              </div>
              <ChatInterface />
            </section>
          </div>
        </div>
      </main>
      <Toaster position="top-right" theme="dark" />
    </div>
  );
}
