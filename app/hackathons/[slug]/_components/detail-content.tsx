"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface HackathonDetailContentProps {
  requirements?: string[] | null;
  technologies?: string[] | null;
  prizes?: { place: string; prize: string }[] | null;
}

export function HackathonDetailContent({
  requirements = [],
  technologies = [],
  prizes = [],
}: HackathonDetailContentProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {technologies && technologies.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Technologies</h2>
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech, idx) => (
              <Badge key={idx} variant="secondary">
                {tech}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {requirements && requirements.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Requirements</h2>
          <ul className="space-y-2 text-sm">
            {requirements.map((req, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {prizes && prizes.length > 0 && (
        <Card className="p-6 md:col-span-2">
          <h2 className="text-xl font-bold mb-4">Prizes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {prizes.map((prize, idx) => (
              <div key={idx} className="text-center p-4 bg-muted rounded-lg">
                <p className="text-lg font-bold">{prize.prize}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
