import { SettingsForm } from "@/components/settings/settings-form";

export default function SettingsPage() {
  return (
    <div className="space-y-6 p-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Configuración</h2>
        <p className="text-slate-500">Gestioná las preferencias de VG Store.</p>
      </div>

      <SettingsForm />
    </div>
  );
}