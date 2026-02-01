"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, Tags, Settings, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Categorías", href: "/categories", icon: Tags },
  { name: "Productos", href: "/products", icon: ShoppingBag },
  { name: "Configuración", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 h-screen bg-slate-900 text-white p-4 fixed left-0 top-0 flex flex-col border-r border-slate-800">
      <div className="flex items-center gap-3 px-2 mb-10 mt-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">
          E
        </div>
        <h1 className="text-xl font-bold tracking-tight text-slate-100">AdminShop</h1>
      </div>

      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={cn(
                "flex items-center justify-between gap-3 p-3 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-blue-600/10 text-blue-400 font-medium" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon size={20} className={cn(isActive ? "text-blue-400" : "text-slate-400 group-hover:text-slate-100")} />
                <span>{item.name}</span>
              </div>
              {isActive && <ChevronRight size={16} />}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto p-2 border-t border-slate-800 pt-4">
        <p className="text-xs text-slate-500 px-2 uppercase tracking-widest font-semibold">
          Desarrollado por
        </p>
        <p className="text-sm text-slate-300 px-2 font-medium">Victoria Garay</p>
      </div>
    </div>
  );
}