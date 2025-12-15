// src/pages/AdminUsers.tsx
import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { userApi, UserDTO } from "../api/userApi";

export function AdminUsers() {
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const data = await userApi.getAllUsers();
      setUsers(data);
    } catch {
      toast.error("Impossible de charger les utilisateurs");
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

  const handleRoleChange = async (id: string, role: string) => {
    try {
       console.log(role);
       console.log(id);
      await userApi.setRole(id, role);
      
      toast.success("Rôle mis à jour");
      loadUsers();
    } catch {
      toast.error("Erreur mise à jour du rôle");
    }
  };

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
      <h1 className="text-3xl">Gestion des utilisateurs</h1>

      <Card>
        <CardHeader>
          <Input
            placeholder="Rechercher..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </CardHeader>

        <CardContent>
          <table className="w-full">
            <thead className="border-b">
              <tr>
                <th className="px-4 py-3 text-left">Nom</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Rôle</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((u) => (
                <tr key={u.userId} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{u.userPrenom} {u.userName}</td>
                  <td className="px-4 py-3">{u.email}</td>

                  <td className="px-4 py-3">
                    <select
                      className="border px-2 py-1 rounded"
                      value={u.role ?? "EMPLOYER"}
                      onChange={(e) => handleRoleChange(u.userId!, e.target.value)}
                    >
                      <option value="ADMIN">Admin</option>
                      <option value="RH">RH</option>
                      <option value="EMPLOYER">Employé</option>
                    </select>
                  </td>

                  <td className="px-4 py-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(u)}
                      className="text-red-600"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-gray-500">
                    Aucun utilisateur trouvé
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

export default AdminUsers;
