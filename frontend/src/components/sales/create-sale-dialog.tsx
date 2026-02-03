"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function CreateSaleDialog({ onSaleCreated }: { onSaleCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  
  // Datos del formulario
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (open) {
      fetch("http://localhost:3001/products")
        .then(res => res.json())
        .then(data => setProducts(data));
    }
  }, [open]);

  const handleGenerateSale = async () => {
    if (!selectedProductId) return;
    setLoading(true);
    
    try {
      const res = await fetch("http://localhost:3001/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          productId: selectedProductId, 
          quantity: Number(quantity) 
        }),
      });

      if (res.ok) {
        onSaleCreated();
        setOpen(false);
        setSelectedProductId("");
        setQuantity(1);
      }
    } catch (error) {
      console.error("Error al generar venta:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700 flex gap-2">
          <ShoppingCart size={18} /> Generar Venta
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar Nueva Venta</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Producto</Label>
            <Select onValueChange={setSelectedProductId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un producto" />
              </SelectTrigger>
              <SelectContent>
                {products.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name} - ${p.price}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Cantidad</Label>
            <Input 
              type="number" 
              min="1" 
              value={quantity} 
              onChange={(e) => setQuantity(Number(e.target.value))} 
            />
          </div>
          <Button 
            className="w-full bg-green-600 hover:bg-green-700" 
            onClick={handleGenerateSale}
            disabled={loading || !selectedProductId}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirmar Venta
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}