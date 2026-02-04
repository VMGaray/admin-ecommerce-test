"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CreateCategoryDialog({ onCategoryCreated }: { onCategoryCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:3001/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });

      if (res.ok) {
        setName("");
        setOpen(false);
        onCategoryCreated();
      } else {
        const errorData = await res.json();
        console.error("Respuesta del servidor (Error):", errorData.message); 
      }
    } catch (err) {
      console.error("Error de conexión:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const focusClasses = "focus-visible:ring-[#728d84] focus:ring-[#728d84]";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 bg-[#728d84] hover:bg-[#617971] text-white px-4 py-2 rounded-xl shadow-md transition-all font-medium active:scale-95 text-sm">
          <PlusCircle size={18} /> Nueva Categoría
        </button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-106.25 rounded-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-800">Agregar Nueva Categoría</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name" className="text-slate-700 font-semibold ml-1">Nombre</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className={`bg-slate-50 border-slate-200 h-11 ${focusClasses}`}
                placeholder="Ej: Electrónica, Hogar..."
                disabled={isLoading}
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              type="submit" 
              className="w-full bg-[#728d84] hover:bg-[#617971] text-white font-bold h-11 rounded-xl shadow-lg transition-all active:scale-[0.98]"
              disabled={isLoading || !name.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={18} />
                  Guardando...
                </>
              ) : (
                "Guardar Categoría"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}