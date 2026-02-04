"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

// Importamos los tipos centralizados
import { Product, Category } from "@/types";

// Esquema corregido: Evitamos z.any() para que TypeScript no pierda el rastro de los tipos
const productSchema = z.object({
  name: z.string().min(3, "Mínimo 3 caracteres"),
  price: z.preprocess(
    (val) => {
      if (typeof val === 'string') return Number(val.replace(/\./g, '').replace(',', '.'));
      return val;
    },
    z.number().min(0.01, "El precio debe ser mayor a 0")
  ),
  stock: z.coerce.number().int().min(0, "No puede ser negativo"),
  description: z.string().optional().or(z.literal('')), 
  categoryId: z.string().min(1, "Selecciona una categoría"),
});

export type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  categories: Category[]; // Usamos el tipo global
  onSubmit: (data: ProductFormValues) => void;
  initialData?: Product | null; // Eliminamos el any
  isLoading: boolean;
}

export function ProductForm({ categories, onSubmit, initialData, isLoading }: ProductFormProps) {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    /* LÍNEA 42 & 46 FIX: Definimos valores iniciales seguros. 
       Cambiamos el 'as any' por una conversión de tipo controlada.
    */
    defaultValues: initialData ? {
      name: initialData.name,
      price: initialData.price as unknown as number, 
      stock: initialData.stock,
      description: initialData.description || "",
      categoryId: initialData.categoryId
    } : { name: "", price: 0, stock: 0, description: "", categoryId: "" },
  });

  const focusClasses = "focus-visible:ring-[#728d84] focus:ring-[#728d84] border-slate-200";

  return (
    /* LÍNEA 57 FIX: Ahora los tipos coinciden perfectamente */
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-slate-700 font-medium">Nombre del Producto</Label>
        <Input id="name" {...register("name")} className={focusClasses} />
        {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price" className="text-slate-700 font-medium">Precio</Label>
          <Input 
            id="price" 
            type="text" 
            {...register("price")} 
            placeholder="Ej: 1.300.578" 
            className={focusClasses}
          />
          {errors.price && <p className="text-xs text-red-500 font-medium">{errors.price.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="stock" className="text-slate-700 font-medium">Stock</Label>
          <Input id="stock" type="number" {...register("stock")} className={focusClasses} />
          {errors.stock && <p className="text-xs text-red-500 font-medium">{errors.stock.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-slate-700 font-medium">Categoría</Label>
        <Select 
          onValueChange={(val) => setValue("categoryId", val)}
          defaultValue={initialData?.categoryId}
        >
          <SelectTrigger className={focusClasses}>
            <SelectValue placeholder="Selecciona una categoría..." />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.categoryId && <p className="text-xs text-red-500 font-medium">{errors.categoryId.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-slate-700 font-medium">Descripción (Opcional)</Label>
        <Textarea id="description" {...register("description")} className={`resize-none h-24 ${focusClasses}`} />
      </div>

      <button 
        type="submit" 
        disabled={isLoading}
        className="w-full bg-[#728d84] hover:bg-[#617971] text-white font-bold h-11 rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center disabled:opacity-70"
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          initialData ? "Actualizar Producto" : "Guardar Producto"
        )}
      </button>
    </form>
  );
}