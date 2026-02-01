"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card } from "@/components/ui/card";
import { Package, Tags, DollarSign, Users, TrendingUp, Loader2 } from "lucide-react";

export default function HomePage() {
  const [categoryCount, setCategoryCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Consumimos el endpoint que ya tenés listo en NestJS
    fetch("http://localhost:3001/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategoryCount(data.length); // Contamos los elementos del array
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar métricas:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h2>
        <p className="text-slate-500">Bienvenida de nuevo, Victoria. Resumen general de la tienda.</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Ventas Totales" 
          value="$0.00" 
          icon={DollarSign} 
          iconColorClass="text-green-600" 
          iconBgClass="bg-green-50" 
        />
        
        <StatCard 
          title="Productos" 
          value="0" 
          icon={Package} 
        />
        
        <StatCard 
          title="Categorías" 
          value={loading ? "..." : categoryCount ?? 0} 
          icon={Tags} 
          iconColorClass="text-purple-600" 
          iconBgClass="bg-purple-50" 
          description={loading ? "Cargando..." : "Categorías activas"}
        />
        
        <StatCard 
          title="Usuarios" 
          value="1" 
          icon={Users} 
          iconColorClass="text-orange-600" 
          iconBgClass="bg-orange-50" 
        />
      </div>

      <Card className="shadow-sm border-slate-200 p-8 flex flex-col items-center justify-center text-center space-y-3 bg-slate-50/50 border-dashed">
        {loading ? (
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
        ) : (
          <TrendingUp className="h-8 w-8 text-slate-400" />
        )}
        <h3 className="font-semibold text-slate-900">Actividad Reciente</h3>
        <p className="text-sm text-slate-500">
          {categoryCount && categoryCount > 0 
            ? `Tienes ${categoryCount} categorías configuradas correctamente.` 
            : "Comienza creando tu primera categoría en el panel lateral."}
        </p>
      </Card>
    </div>
  );
}