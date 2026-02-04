import { ShoppingBag } from "lucide-react";

interface BrandLogoProps {
  className?: string;
  variant?: "default" | "sidebar"; // Nueva prop para controlar el estilo
}

export function BrandLogo({ className = "", variant = "default" }: BrandLogoProps) {
  const isSidebar = variant === "sidebar";

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* El Ícono: Adaptable según la variante */}
      <div 
        className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all ${
          isSidebar 
            ? "bg-transparent border-2 border-slate-600" // Estilo limpio para sidebar
            : "bg-gradient-to-tr from-indigo-600 to-blue-500 shadow-lg shadow-indigo-200" // Estilo original
        }`}
      >
        <ShoppingBag 
          className={`h-6 w-6 transition-colors ${
            isSidebar ? "text-slate-200" : "text-white"
          }`} 
          strokeWidth={isSidebar ? 2.5 : 2} 
        />
      </div>
      
      {/* El Nombre de la Marca */}
      <div className="flex flex-col leading-none">
        <span 
          className={`font-black text-xl tracking-tighter uppercase ${
            isSidebar ? "text-slate-100" : "text-slate-900"
          }`}
        >
          VG <span className={isSidebar ? "text-blue-400" : "text-indigo-600"}>Store</span>
        </span>
        <span 
          className={`text-[10px] font-bold uppercase tracking-[0.2em] mt-1 ${
            isSidebar ? "text-slate-400" : "text-slate-400"
          }`}
        >
          Admin Panel
        </span>
      </div>
    </div>
  );
}