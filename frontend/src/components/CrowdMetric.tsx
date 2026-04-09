import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress, ProgressTrack, ProgressIndicator } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

interface CrowdMetricProps {
  name: string;
  density: number;
  status: string;
}

export const CrowdMetric: React.FC<CrowdMetricProps> = ({ name, density, status }) => {
  const getStatusColor = (s: string) => {
    switch (s.toLowerCase()) {
      case "normal": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "congested": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "critical": return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    }
  };

  const getProgressColor = (d: number) => {
    if (d > 0.8) return "bg-red-500";
    if (d > 0.6) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <Card 
      role="region" 
      aria-label={`Crowd metrics for ${name}`}
      className="bg-zinc-900/50 border-zinc-800 backdrop-blur-md overflow-hidden group hover:border-zinc-700 transition-all"
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-zinc-400 group-hover:text-zinc-100 transition-colors">
          {name}
        </CardTitle>
        <Users className="w-4 h-4 text-zinc-500" aria-hidden="true" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <div className="text-2xl font-bold text-white">{(density * 100).toFixed(0)}%</div>
          <Badge variant="outline" className={getStatusColor(status)} aria-label={`Status: ${status}`}>
            {status}
          </Badge>
        </div>
        <Progress 
          value={density * 100} 
          className="h-1 bg-zinc-800"
          role="progressbar"
          aria-valuenow={Math.round(density * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${name} occupancy level`}
        >
          <ProgressTrack>
            <ProgressIndicator className={getProgressColor(density)} />
          </ProgressTrack>
        </Progress>
      </CardContent>
    </Card>
  );
};
