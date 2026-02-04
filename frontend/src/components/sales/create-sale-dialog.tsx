"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Product } from "@/types";

export function CreateSaleDialog({ onSaleCreated }: { onSaleCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ productId: "", quantity: 1 });

  useEffect(() => {
    if (open) {
      fetch("http://localhost:3001/products")
        .then(res => res.json())
        .then((data: Product[]) => {
        setProducts(data.filter(p => p.stock > 0));
        })
        .catch(err => console.error("Error cargando productos:", err));
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!formData.productId) return;
    
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        onSaleCreated();
        setOpen(false);
        setFormData({ productId: "", quantity: 1 }); 
      }
    } catch (error) {
      console.error("Error al crear venta:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button 
          className="bg-[#728d84] hover:bg-[#617971] text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-md transition-all text-sm font-medium active:scale-95"
        >
          <ShoppingCart size={18} /> Registrar Nueva Venta
        </button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-125 rounded-2xl border-slate-200">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-800">Registrar Nueva Venta</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700 ml-1">Producto</Label>
            
            <Select onValueChange={(val) => setFormData({ ...formData, productId: val })}>
              <SelectTrigger className="w-full bg-slate-50 border-slate-200 focus:ring-[#728d84]">
                <SelectValue placeholder="Seleccioná un producto" />
              </SelectTrigger>
              <SelectContent>
                {products.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{p.name}</span>
                      <span className="text-xs text-slate-500">
                        Stock: {p.stock} unidades — 
                        <span className="text-[#728d84] font-bold ml-1">
                          ${Number(p.price).toLocaleString()}
                        </span>
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700 ml-1">Cantidad</Label>
            <Input 
              type="number" 
              min="1" 
              className="bg-slate-50 border-slate-200 focus-visible:ring-[#728d84]"
              value={formData.quantity} 
              onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })} 
            />
          </div>

          <Button 
            className="w-full bg-[#728d84] hover:bg-[#617971] text-white h-11 text-lg font-bold transition-all shadow-lg rounded-xl" 
            onClick={handleSubmit} 
            disabled={loading || !formData.productId}
          >
            {loading ? (
              <div className="flex items-center">
                <Loader2 className="animate-spin mr-2" size={20} />
                Procesando...
              </div>
            ) : "Confirmar Venta"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}