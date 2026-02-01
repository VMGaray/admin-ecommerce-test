"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2 } from "lucide-react"; // Agregamos Loader2
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CreateCategoryDialog({ onCategoryCreated }: { onCategoryCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Estado de carga para el botón

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:3001/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }), // Enviamos solo el nombre limpio
      });

      if (res.ok) {
        setName("");
        setOpen(false);
        onCategoryCreated();
      } else {
        // DETECCIÓN DE ERROR 400: Leemos el mensaje del servidor
        const errorData = await res.json();
        console.error("Respuesta del servidor (Error):", errorData.message); 
        // ^ Aquí verás si el backend dice "name must be a string" o algo similar
      }
    } catch (err) {
      console.error("Error de conexión:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex gap-2 bg-blue-600 hover:bg-blue-700">
          <PlusCircle size={18} /> Nueva Categoría
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Agregar Nueva Categoría</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Nombre</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="col-span-3" 
                placeholder="Ej: Electrónica"
                disabled={isLoading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading || !name.trim()}>
              {isLoading ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
              {isLoading ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}