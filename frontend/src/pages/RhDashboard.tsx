// src/pages/RhDashboard.tsx
import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { StatCard } from "../components/StatCard";
import { Users, CalendarDays, UserX, Plus, Search, Trash2 } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";
import { userApi, UserDTO } from "../api/userApi";
import { demandeApi, DemandeDTO } from "../api/demandeApi";
import { RoleModal } from "../components/RoleModal";
import { taskApi, TaskDTO } from "../api/TaskApi";
import { ClipboardList, PlusCircle } from "lucide-react";



const attendanceData = [
  { name: "Lun", présents: 145, absents: 5 },
  { name: "Mar", présents: 148, absents: 2 },
  { name: "Mer", présents: 142, absents: 8 },
  { name: "Jeu", présents: 147, absents: 3 },
  { name: "Ven", présents: 140, absents: 10 },
];

export function RhDashboard() {
  const stored = localStorage.getItem("user");
  const currentUser = stored ? JSON.parse(stored) : null;
  const rhId = currentUser?.userId;

  const [employees, setEmployees] = useState<UserDTO[]>([]);
  const [conges, setConge] = useState<DemandeDTO[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState<TaskDTO[]>([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);


  // --- Modal pour ajouter un employé
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!rhId) {
      toast.error("Session invalide. Reconnectez-vous.");
      window.location.href = "/login";
      return;
    }
    loadEmployees();
    loadConges();
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

  async function loadConges() {
    setLoading(true);
    try {
      const data = await demandeApi.getRhRequest(rhId);
      setConge(data);
    } catch (err) {
      toast.error("Impossible de charger les demandes de congés");
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return employees;

    return employees.filter((u) => {
      const name = `${u.userPrenom ?? ""} ${u.userName ?? ""}`.toLowerCase();
      return (
        name.includes(q) ||
        (u.email ?? "").toLowerCase().includes(q) ||
        (u.profession ?? "").toLowerCase().includes(q)
      );
    });
  }, [employees, query]);

  const handleStatusChange = async (u: UserDTO, status: string) => {
    try {
      await userApi.updateRhStatus(u.userId!, status);
      toast.success("Statut mis à jour");
      setEmployees((prev) =>
        prev.map((p) => (p.userId === u.userId ? { ...p, status } : p))
      );
    } catch (err) {
      toast.error("Erreur lors de la mise à jour du statut");
    }
  };

  const handleDelete = async (u: UserDTO) => {
    if (!confirm(`Supprimer définitivement ${u.email} ?`)) return;

    try {
      await userApi.deleteUserByEmail(u.email!);
      toast.success("Utilisateur supprimé");
      setEmployees((prev) => prev.filter((p) => p.email !== u.email));
    } catch (err) {
      toast.error("Impossible de supprimer cet utilisateur");
    }
  };

  const handleAddEmployee = async (employeePayload: Partial<UserDTO>) => {
    if (!rhId) {
      toast.error("RH non identifié !");
      return;
    }

    const payload = {
      ...employeePayload,
      rhId: rhId, // RH connecté
      status: employeePayload.status || "active",
    };

    try {
      const addedEmployee = await userApi.addEmployer(payload);
      toast.success(`Employé ${addedEmployee.userName} ajouté avec succès !`);
      setIsModalOpen(false);
      loadEmployees(); // rafraîchir la liste
    } catch (error) {
      console.error(error);
      toast.error("Impossible d'ajouter l'employé");
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl md:text-3xl">
          Bienvenue {currentUser?.userPrenom}
        </h1>
        <p className="text-gray-600 mt-1">
          Vous êtes connecté en tant que responsable RH
        </p>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard title="Total Employés" value={`${employees.length}`} icon={Users} color="blue" />
        <StatCard title="En Congé" value={`${conges.length}`} icon={CalendarDays} color="orange" />
        <StatCard title="Absents" value="-" icon={UserX} color="red" />
      </div>

      {/* FILTRE + BOUTON AJOUT */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Liste des employés</h2>
          <p className="text-sm text-gray-600">{employees.length} personnes</p>
        </div>

        <div className="flex gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <Input
              className="pl-10"
              placeholder="Rechercher..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <Button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="size-4 mr-2" /> Ajouter un employé
          </Button>
        </div>
      </div>

      {/* TABLEAU DES EMPLOYÉS */}
      <Card>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Nom</th>
                <th className="text-left py-3 px-4">Email</th>
                <th className="text-left py-3 px-4">Profession</th>
                <th className="text-left py-3 px-4">Statut</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.userId} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{u.userPrenom} {u.userName}</td>
                  <td className="py-3 px-4">{u.email}</td>
                  <td className="py-3 px-4">{u.profession ?? "-"}</td>

                  <td className="py-3 px-4">
                    <select
                      value={u.status ?? "active"}
                      onChange={(e) => handleStatusChange(u, e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option value="active">Actif</option>
                      <option value="inactive">Inactif</option>
                    </select>
                  </td>

                  <td className="py-3 px-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(u)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </td>
                </tr>
              ))}

              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-gray-500">
                    Aucun employé trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* MODAL AJOUT EMPLOYÉ */}
     <RoleModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  rhs={currentUser ? [{ id: currentUser.userId, name: currentUser.userPrenom + ' ' + currentUser.userName }] : []}
  onSave={handleAddEmployee} 
  user={null} // création
/>

    </div>
  );
}

export default RhDashboard;
