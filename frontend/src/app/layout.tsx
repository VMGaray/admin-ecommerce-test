import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Sidebar } from "@/components/layout/sidebar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin E-commerce",
  description: "Panel de administración para ecommerce test",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-slate-50 flex`}>
        {/* El Sidebar queda fijo a la izquierda */}
        <Sidebar />
        
        {/* El contenido principal tiene un margen izquierdo de 64 (w-64 del sidebar) */}
        <main className="flex-1 ml-64 min-h-screen p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}