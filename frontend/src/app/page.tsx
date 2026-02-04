"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/dashboard/stat-card";
import { Overview } from "@/components/dashboard/overview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Tags, DollarSign, Users, TrendingUp } from "lucide-react";
import { Sale, AnalyticsData } from "@/types";

export default function HomePage() {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    totalSales: 0,
    loading: true,
  });

  const [chartData, setChartData] = useState<AnalyticsData[]>([]);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [prodRes, catRes, salesRes, analyticsRes] = await Promise.all([
          fetch("http://localhost:3001/products"),
          fetch("http://localhost:3001/categories"),
          fetch("http://localhost:3001/sales"),
          fetch("http://localhost:3001/sales/analytics") 
        ]);

        const products = await prodRes.json();
        const categories = await catRes.json();
        const sales = await salesRes.json();
        const analytics = await analyticsRes.json();

        const totalSalesSum = sales.reduce((acc: number, sale: Sale) => acc + Number(sale.total), 0);

        setStats({
          products: products.length,
          categories: categories.length,
          totalSales: totalSalesSum,
          loading: false,
        });
        setChartData(analytics);
      } catch (error) {
        console.error("Error cargando Dashboard:", error);
      }
    }
    fetchDashboardData();
  }, []);

  const currencyFormatter = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  });

  return (
    <div className="space-y-8 p-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Panel de Control</h2>
        <p className="text-slate-500 text-sm">Resumen en tiempo real de VG Store.</p>
      </div>
      
      {/* Cards Superiores con identidad visual Sage Green */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Ventas Totales" 
          value={stats.loading ? "..." : currencyFormatter.format(stats.totalSales)} 
          icon={DollarSign} 
          iconColorClass="text-[#728d84]" 
          iconBgClass="bg-green-50" 
        />
        <StatCard 
          title="Productos" 
          value={stats.loading ? "..." : stats.products} 
          icon={Package} 
          iconColorClass="text-blue-600"
          iconBgClass="bg-blue-50"
        />
        <StatCard 
          title="Categorías" 
          value={stats.loading ? "..." : stats.categories} 
          icon={Tags} 
          iconColorClass="text-purple-600" 
          iconBgClass="bg-purple-50" 
        />
        <StatCard 
          title="Usuarios" 
          value="1" 
          icon={Users} 
          iconColorClass="text-orange-600" 
          iconBgClass="bg-orange-50" 
        />
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-7">
        <Card className="col-span-full lg:col-span-4 shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp size={20} className="text-[#728d84]" />
              Ventas por Categoría
            </CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview data={chartData} />
          </CardContent>
        </Card>

        <Card className="col-span-full lg:col-span-3 shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-800">Estado del Inventario</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
               <p className="text-sm text-slate-500">
                 Actualmente gestionas {stats.products} productos en {stats.categories} categorías diferentes.
               </p>
               <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                 <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Tip Senior</p>
                 <p className="text-sm text-slate-600 italic">
                   {"Los datos de ventas se actualizan automáticamente al registrar una nueva transacción."}
                 </p>
               </div>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}