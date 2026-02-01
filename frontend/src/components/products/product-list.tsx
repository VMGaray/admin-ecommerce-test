"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Trash2, Edit } from "lucide-react";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { EditProductDialog } from "./edit-product-dialog";

export function ProductList({ refreshKey, onRefresh }: { refreshKey: number, onRefresh: () => void }) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [productToDelete, setProductToDelete] = useState<any | null>(null);
  const [productToEdit, setProductToEdit] = useState<any | null>(null);

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
      <div className="rounded-md border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="text-center h-24"><Loader2 className="animate-spin inline mr-2"/>Cargando...</TableCell></TableRow>
            ) : products.map((prod) => (
              <TableRow key={prod.id}>
                <TableCell className="font-medium">{prod.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100">{prod.category?.name}</Badge>
                </TableCell>
                {/* LÍNEA CLAVE: Formateo con puntos de miles */}
                <TableCell className="font-semibold">{currencyFormatter.format(prod.price)}</TableCell>
                <TableCell>{prod.stock} u.</TableCell>
                <TableCell className="text-right space-x-1">
                  <Button variant="ghost" size="icon" className="text-blue-600" onClick={() => setProductToEdit(prod)}><Edit size={16} /></Button>
                  <Button variant="ghost" size="icon" className="text-red-600" onClick={() => setProductToDelete(prod)}><Trash2 size={16} /></Button>
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
          await fetch(`http://localhost:3001/products/${productToDelete.id}`, { method: "DELETE" });
          onRefresh();
          setProductToDelete(null);
        }} 
        title="¿Eliminar producto?" 
        description={`Borrarás "${productToDelete?.name}".`} 
      />
    </>
  );
}