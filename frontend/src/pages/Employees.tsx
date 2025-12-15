import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { userApi, UserDTO } from "../api/userApi";

export function Employees() {
  const stored = localStorage.getItem("user");
  const currentUser = stored ? JSON.parse(stored) : null;

  const rhId = currentUser?.userId;

  const [employees, setEmployees] = useState<UserDTO[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!rhId) {
      toast.error("Session invalide. Reconnectez-vous.");
      window.location.href = "/login";
      return;
    }
    loadEmployees();
  }, [rhId]);

  async function loadEmployees() {
    setLoading(true);
    try {
      const data = await userApi.getRhEmployers(rhId);
      setEmployees(data);
    } catch (err) {
      toast.error("Impossible de charger les employés");
    } finally {
      setLoading(false);
    }
  }

  const filteredEmployees = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return employees;

    return employees.filter((emp) => {
      const name = `${emp.userPrenom ?? ""} ${emp.userName ?? ""}`.toLowerCase();
      return (
        name.includes(q) ||
        (emp.email ?? "").toLowerCase().includes(q) ||
        (emp.profession ?? "").toLowerCase().includes(q)
      );
    });
  }, [employees, query]);

  const handleDeleteEmployee = async (u: UserDTO) => {
    if (!confirm(`Supprimer définitivement ${u.email} ?`)) return;

    try {
      await userApi.deleteUserByEmail(u.email!);
      toast.success("Utilisateur supprimé");
      setEmployees((prev) => prev.filter((p) => p.email !== u.email));
    } catch (err) {
      toast.error("Impossible de supprimer cet utilisateur");
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl md:text-3xl">Liste des employés</h1>
        <p className="text-gray-600">{employees.length} personnes</p>
      </div>

      {/* SEARCH */}
      <Card>
        <CardHeader>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <Input
              placeholder="Rechercher par nom, email ou profession..."
              className="pl-10"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </CardHeader>

        {/* TABLE */}
        <CardContent>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="py-3 px-4 text-left">Nom</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Profession</th>
                <th className="py-3 px-4 text-left">Département</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredEmployees.map((u) => (
                <tr key={u.userId} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    {u.userPrenom} {u.userName}
                  </td>

                  <td className="py-3 px-4">{u.email}</td>

                  <td className="py-3 px-4">{u.profession ?? "-"}</td>

                  {/* DELETE ONLY */}
                  <td className="py-3 px-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteEmployee(u)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </td>
                </tr>
              ))}

              {!loading && filteredEmployees.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-gray-500">
                    Aucun employé trouvé.
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

export default Employees;
