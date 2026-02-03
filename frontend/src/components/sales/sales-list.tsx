"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar, Hash } from "lucide-react";

export function SalesList({ refreshKey }: { refreshKey: number }) {
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/sales")
      .then((res) => res.json())
      .then((data) => {
        setSales(data);
        setLoading(false);
      })
      .catch((err) => console.error("Error al cargar ventas:", err));
  }, [refreshKey]);

  // Formateadores para un acabado profesional (Nivel Senior)
  const currencyFormatter = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  });

  const dateFormatter = new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-600" /></div>;

  return (
    <div className="rounded-md border bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="w-[100px]">ID Venta</TableHead>
            <TableHead>Fecha y Hora</TableHead>
            <TableHead>Productos</TableHead>
            <TableHead className="text-right">Total Cobrado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center h-24 text-slate-500">
                No hay ventas registradas todavía.
              </TableCell>
            </TableRow>
          ) : (
            sales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell className="font-mono text-xs text-slate-500">
                  #{sale.id.split('-')[0]}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-slate-400" />
                    <span className="text-sm">{dateFormatter.format(new Date(sale.createdAt))}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {sale.items.map((item: any) => (
                      <Badge key={item.id} variant="secondary" className="font-normal">
                        {item.quantity}x {item.product.name}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-right font-bold text-slate-900">
                  {currencyFormatter.format(sale.total)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}