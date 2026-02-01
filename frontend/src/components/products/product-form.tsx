"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const productSchema = z.object({
  name: z.string().min(3, "Mínimo 3 caracteres"),
  price: z.any().transform((val) => {
    // Si es un string con puntos (1.300.000), le quitamos los puntos para que sea número
    if (typeof val === 'string') return Number(val.replace(/\./g, '').replace(',', '.'));
    return Number(val);
  }).pipe(z.number().min(0.01, "El precio debe ser mayor a 0")),
  stock: z.coerce.number().int().min(0, "No puede ser negativo"),
  description: z.string().optional().or(z.literal('')), 
  categoryId: z.string().min(1, "Selecciona una categoría"),
});

export type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  categories: { id: string; name: string }[];
  onSubmit: (data: ProductFormValues) => void;
  initialData?: any;
  isLoading: boolean;
}

export function ProductForm({ categories, onSubmit, initialData, isLoading }: ProductFormProps) {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData || { name: "", price: "", stock: 0, description: "", categoryId: "" },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre del Producto</Label>
        <Input id="name" {...register("name")} />
        {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Precio </Label>
          <Input 
            id="price" 
            type="text" // Cambiado a text para permitir escribir puntos
            {...register("price")} 
            placeholder="Ej: 1.300.578" 
          />
          {errors.price && <p className="text-xs text-red-500 font-medium text-wrap">{(errors.price as any).message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="stock">Stock</Label>
          <Input id="stock" type="number" {...register("stock")} />
          {errors.stock && <p className="text-xs text-red-500 font-medium">{errors.stock.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Categoría</Label>
        <Select 
          onValueChange={(val) => setValue("categoryId", val)}
          defaultValue={initialData?.categoryId}
        >
          <SelectTrigger>
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
        <Label htmlFor="description">Descripción (Opcional)</Label>
        <Textarea id="description" {...register("description")} className="resize-none" />
      </div>

      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Guardar Producto
      </Button>
    </form>
  );
}