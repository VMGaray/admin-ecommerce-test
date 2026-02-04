"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Tags, 
  Settings, 
  ChevronRight, 
  ShoppingCart,
  LogOut 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/ui/brand-logo";

const menuItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard, color: "text-sky-400" },
  { name: "Categorías", href: "/categories", icon: Tags, color: "text-purple-400" },
  { name: "Productos", href: "/products", icon: ShoppingBag, color: "text-blue-400" },
  { name: "Ventas", href: "/sales", icon: ShoppingCart, color: "text-green-400" },
  { name: "Configuración", href: "/settings", icon: Settings, color: "text-slate-400" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    router.push("/login");
    router.refresh();
  };

  return (
   <div className="w-64 h-screen bg-slate-900 text-white p-4 fixed left-0 top-0 flex flex-col border-r border-slate-800 z-50">
     <div className="mb-10 mt-2 px-2">
        <BrandLogo variant="sidebar" />
     </div>

      {/* Navegación Principal */}
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
                  ? "bg-slate-800 text-white font-medium shadow-sm" 
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-100"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon 
                  size={20} 
                  className={cn(
                    "transition-colors",
                    isActive ? item.color : "text-slate-400 group-hover:text-slate-100"
                  )} 
                />
                <span>{item.name}</span>
              </div>
              {isActive && <ChevronRight size={16} className={item.color} />}
            </Link>
          );
        })}
      </nav>

      {/* Sección Inferior: Logout y Créditos */}
      <div className="mt-auto space-y-4">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 w-full rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all group"
        >
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Cerrar Sesión</span>
        </button>

        <div className="p-2 border-t border-slate-800 pt-4">
          <p className="text-xs text-slate-500 px-2 uppercase tracking-widest font-semibold">
            Desarrollado por
          </p>
          <p className="text-sm text-slate-300 px-2 font-medium">Victoria Garay</p>
        </div>
      </div>
    </div>
  );
}