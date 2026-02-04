"use client";

import { useEffect, useState } from "react";
import Image from "next/image"; 
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Trash2, Edit, ImageIcon } from "lucide-react";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { EditProductDialog } from "./edit-product-dialog";
import { Product } from "@/types"; 

export function ProductList({ refreshKey, onRefresh }: { refreshKey: number, onRefresh: () => void }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:3001/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, [refreshKey]);

  const currencyFormatter = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  });

  return (
    <>
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden overflow-x-auto">
        <Table className="min-w-175 md:min-w-full">
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-20">Imagen</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-32">
                  <Loader2 className="animate-spin inline mr-2 text-[#728d84]"/> Cargando...
                </TableCell>
              </TableRow>
            ) : products.map((prod) => (
              <TableRow key={prod.id} className="hover:bg-slate-50/50 transition-colors">
                <TableCell>
                  <div className="relative w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                    {prod.imageUrl ? (
                      <Image 
                        src={prod.imageUrl} 
                        alt={prod.name} 
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    ) : (
                      <ImageIcon className="text-slate-400" size={20} />
                    )}
                  </div>
                </TableCell>

                <TableCell className="font-medium text-slate-900">{prod.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-[#728d84]/10 text-[#728d84] border-[#728d84]/20 font-medium">
                    {prod.category?.name || "Sin categoría"}
                  </Badge>
                </TableCell>
                <TableCell className="font-semibold text-slate-700">{currencyFormatter.format(prod.price)}</TableCell>
                <TableCell>
                  <span className={prod.stock <= 5 ? "text-amber-600 font-bold" : "text-slate-600"}>
                    {prod.stock} u.
                  </span>
                </TableCell>
                <TableCell className="text-right space-x-1">
                  <Button variant="ghost" size="icon" className="text-[#728d84] hover:bg-green-50" onClick={() => setProductToEdit(prod)}>
                    <Edit size={16} />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-red-600 hover:bg-red-50" onClick={() => setProductToDelete(prod)}>
                    <Trash2 size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {productToEdit && (
        <EditProductDialog product={productToEdit} isOpen={!!productToEdit} onClose={() => setProductToEdit(null)} onProductUpdated={onRefresh} />
      )}

      <ConfirmDeleteDialog 
        isOpen={!!productToDelete} 
        onClose={() => setProductToDelete(null)} 
        onConfirm={async () => {
          if (!productToDelete) return;
          await fetch(`http://localhost:3001/products/${productToDelete.id}`, { method: "DELETE" });
          onRefresh();
          setProductToDelete(null);
        }} 
        title="¿Eliminar producto?" 
        description={`Borrarás "${productToDelete?.name}". Esta acción no se puede deshacer.`} 
      />
    </>
  );
}