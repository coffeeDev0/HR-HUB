// src/pages/AdminDashboard.tsx
import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { StatCard } from "../components/StatCard";
import { Users, CalendarDays, ShieldAlert } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { userApi, UserDTO } from "../api/userApi";
import { demandeApi, DemandeDTO } from "../api/demandeApi";

export function AdminLeaveDashboard() {
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [conges, setConges] = useState<DemandeDTO[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    loadUsers();
    loadConges();
  }, []);

  async function loadUsers() {
    try {
      const data = await userApi.getAllUsers();
      setUsers(data);
    } catch {
      toast.error("Impossible de charger les utilisateurs");
    }
  }

  async function loadConges() {
    try {
      const data = await demandeApi.getAll();
      setConges(data);
    } catch {
      toast.error("Impossible de charger les demandes");
    }
  }

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return users.filter(u =>
      u.userPrenom?.toLowerCase().includes(q) ||
      u.userName?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q)
    );
  }, [users, query]);

  const handleDelete = async (u: UserDTO) => {
    if (!confirm(`Supprimer ${u.email} ?`)) return;
    try {
      await userApi.deleteUserByEmail(u.email!);
      toast.success("Utilisateur supprimé");
      loadUsers();
    } catch {
      toast.error("Suppression impossible");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl">Dashboard Administrateur</h1>
      <p className="text-gray-600">Contrôle global du système</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Utilisateurs" value={users.length.toString()} icon={Users} color="blue" />
        <StatCard title="Total Congés" value={conges.length.toString()} icon={CalendarDays} color="orange" />
        <StatCard title="Rôles ⬆" value="Admin / RH / Employés" icon={ShieldAlert} color="purple" />
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Utilisateurs</h2>
          <Input
            placeholder="Rechercher..."
            className="mt-3"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </CardHeader>

        <CardContent>
          <table className="w-full text-left">
            <thead className="border-b">
              <tr>
                <th className="px-4 py-3">Nom</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Rôle</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((u) => (
                <tr key={u.userId} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{u.userPrenom} {u.userName}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">{u.role ?? "-"}</td>

                  <td className="px-4 py-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600"
                      onClick={() => handleDelete(u)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-gray-500">
                    Aucun utilisateur trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminLeaveDashboard;
