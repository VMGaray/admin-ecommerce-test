"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  iconColorClass?: string;
  iconBgClass?: string;
}

export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  iconColorClass = "text-[#728d84]", 
  iconBgClass = "bg-[#728d84]/10" 
}: StatCardProps) {

  return (
    <Card className="shadow-sm border-slate-200 transition-all hover:shadow-md group">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-tight">
          {title}
        </CardTitle>
        <div className={`p-2.5 rounded-xl transition-colors ${iconBgClass} group-hover:bg-[#728d84]/20`}>
          <Icon className={`h-5 w-5 ${iconColorClass}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-slate-800 tracking-tight">
          {value}
        </div>
        {description && (
          <p className="text-xs text-slate-400 mt-1 font-medium">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}