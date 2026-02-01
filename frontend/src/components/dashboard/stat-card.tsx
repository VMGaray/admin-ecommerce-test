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
  iconColorClass = "text-blue-600", 
  iconBgClass = "bg-blue-50" 
}: StatCardProps) {
  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
        <div className={`p-2 rounded-lg ${iconBgClass}`}>
          <Icon className={`h-4 w-4 ${iconColorClass}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-slate-400 mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}