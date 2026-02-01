"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card } from "@/components/ui/card";
import { Package, Tags, DollarSign, Users, TrendingUp, Loader2 } from "lucide-react";

export default function HomePage() {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    loading: true,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        // Ejecutamos ambos fetches al mismo tiempo (Senior Approach)
        const [prodRes, catRes] = await Promise.all([
          fetch("http://localhost:3001/products"),
          fetch("http://localhost:3001/categories")
        ]);

        const products = await prodRes.json();
        const categories = await catRes.json();

        setStats({
          products: products.length,
          categories: categories.length,
          loading: false,
        });
      } catch (error) {
        console.error("Error cargando estadísticas:", error);
        setStats((prev) => ({ ...prev, loading: false }));
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h2>
        <p className="text-slate-500">Bienvenida de nuevo, Victoria. Aquí tienes el resumen real de tu tienda.</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Ventas Totales (Aún estático hasta que hagamos el módulo de Ventas) */}
        <StatCard 
          title="Ventas Totales" 
          value="$0.00" 
          icon={DollarSign} 
          iconColorClass="text-green-600" 
          iconBgClass="bg-green-50" 
        />
        
        {/* Productos Dinámico */}
        <StatCard 
          title="Productos" 
          value={stats.loading ? "..." : stats.products} 
          icon={Package} 
          description={stats.loading ? "Cargando..." : "Items en inventario"}
        />
        
        {/* Categorías Dinámico */}
        <StatCard 
          title="Categorías" 
          value={stats.loading ? "..." : stats.categories} 
          icon={Tags} 
          iconColorClass="text-purple-600" 
          iconBgClass="bg-purple-50" 
          description={stats.loading ? "Cargando..." : "Organizadas por tipo"}
        />
        
        {/* Usuarios (Estático por ahora) */}
        <StatCard 
          title="Usuarios" 
          value="1" 
          icon={Users} 
          iconColorClass="text-orange-600" 
          iconBgClass="bg-orange-50" 
        />
      </div>

      <Card className="shadow-sm border-slate-200 p-8 flex flex-col items-center justify-center text-center space-y-3 bg-slate-50/50 border-dashed">
        <div className="p-4 bg-white rounded-full shadow-sm">
          <TrendingUp className="h-8 w-8 text-slate-400" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">Resumen de Actividad</h3>
          <p className="text-sm text-slate-500 max-w-xs">
            {stats.loading 
              ? "Calculando métricas..." 
              : `Actualmente tienes ${stats.products} productos distribuidos en ${stats.categories} categorías.`}
          </p>
        </div>
      </Card>
    </div>
  );
}