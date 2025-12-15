import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Search, Plus, Trash2, Shield, UndoIcon, Loader2 } from 'lucide-react';
import { RoleModal } from '../components/RoleModal';
import { toast } from 'sonner';

import { userApi, UserDTO } from '../api/userApi'; 

interface User extends UserDTO {
  id: string; 
  name: string;
  email: string;
  role: 'admin' | 'rh' | 'employer' | string; 
  status: 'active' | 'inactive' | string; 
  rhId?: string;
}

const mapUserDTOToUser = (dto: UserDTO): User => {
  const name = `${dto.userName ?? ''} ${dto.userPrenom ?? ''}`.trim();
  
  return ({
    ...dto,
    id: dto.userId || (dto as any).id || crypto.randomUUID(), 
    name: name || dto.userName || 'Utilisateur Inconnu', 
    email: dto.email || 'N/A', 
    role: (dto.role?.toLowerCase() || 'employer') as User['role'], 
    status: (dto.status?.toLowerCase() || 'inactive') as User['status'],
    rhId: dto.rhId,
  });
};

export function Settings() {
  const [users, setUsers] = useState<User[]>([]);
  const [rhs, setRhs] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingUser, setEditingUser] = useState<User | null>(null); 
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); 

  // Nouvelle variable pour forcer la modal à créer un RH
  const [forceRole, setForceRole] = useState<"RH" | null>(null);

  const adminId = localStorage.getItem("userId"); 

  useEffect(() => {
    const fetchUsersAndRhs = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const [usersData, rhsData] = await Promise.all([
            userApi.getAllUsers(),
            userApi.getAllUsers().then(users => 
                users.filter(u => u.role?.toUpperCase() === 'RH' || u.role?.toUpperCase() === 'ADMIN')
            )
        ]);
        
        setUsers(usersData.map(mapUserDTOToUser));
        setRhs(rhsData.map(mapUserDTOToUser));

      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        toast.error('Échec du chargement.');
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsersAndRhs();
  }, [refreshKey]);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    setEditingUser(null);
    setForceRole(null);          // mode normal
    setIsModalOpen(true);
  };

 
  const handleAddRh = () => {
    if (!adminId) {
      toast.error("Impossible de récupérer l'ID de l'administrateur");
      return;
    }

    setEditingUser(null);
    setForceRole("RH");          // mode RH forcé
    setIsModalOpen(true);
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleDeleteUser = async (id: string) => {
    const userToDelete = users.find(u => u.id === id);
    if (!userToDelete) return;

    if (!window.confirm(`Supprimer ${userToDelete.name} ?`)) return;

    try {
      await userApi.deleteUser(id);
      setUsers(users.filter(user => user.id !== id));
      toast.success('Utilisateur supprimé');
    } catch (error) {
      console.error(error);
      toast.error("Échec de la suppression");
    }
  };

  // APPEL API RH ADD
  const handleSaveRh = async (userPayload: Partial<UserDTO>) => {
    const payload = {
      userName: userPayload.userName,
      userPassword: userPayload.userPassword,
      rhId: adminId,              // important
      email: userPayload.email,
      tel: userPayload.tel,
      userPrenom: userPayload.userPrenom,
      profession: userPayload.profession,
      status: "active"
    };
    console.log(payload)
    try {
      
      await userApi.addRh(payload);
    
      setIsModalOpen(false);
      handleRefresh();
    } catch (e) {
      console.error(e);
      toast.error("Erreur lors de l'ajout d'un RH");
    }
  };

  // MODE NORMAL (admin, employer)
  const handleSaveUser = async (userPayload: Partial<UserDTO> & { role: string; rhId?: string }) => {
    setIsModalOpen(false);

    const roleUpper = userPayload.role.toUpperCase();

    const payload = {
      userName: userPayload.userName,
      userPassword: userPayload.userPassword,
      rhId: roleUpper === "EMPLOYER" ? userPayload.rhId : undefined,
      email: userPayload.email,
      tel: userPayload.tel,
      userPrenom: userPayload.userPrenom,
      profession: userPayload.profession,
      status: userPayload.status || "active",
    };

    (Object.keys(payload) as (keyof typeof payload)[]).forEach(k => {
      if (payload[k] === undefined) {
        delete payload[k];
      }
    });

    try {
      const added = await userApi.addEmployer(payload);

      if (added.userId && roleUpper !== "EMPLOYER") {
        await userApi.setRole(added.userId, roleUpper);
      }

      toast.success("Utilisateur ajouté");
      handleRefresh();

    } catch (error) {
      toast.error("Erreur lors de la création");
    }
  };


  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Paramètres</h1>
          <p className="text-gray-500">Gestion des utilisateurs</p>
        </div>

        <div className="flex gap-3">

          {/* NOUVEAU : AJOUTER UN RH */}
          <Button onClick={handleAddRh} className="bg-purple-600 hover:bg-purple-700">
            <Plus className="size-4 mr-2" />
            Ajouter un RH
          </Button>

          <Button onClick={handleAddUser} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="size-4 mr-2" />
            Ajouter un utilisateur
          </Button>
        </div>
      </div>


      {/* LISTE DES UTILISATEURS */}
      <Card>
        <CardHeader>
          <CardTitle>Utilisateurs</CardTitle>
          <CardDescription>Gérez les accès</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {isLoading && (
            <div className="py-4 text-center">
              <Loader2 className="animate-spin inline-block text-blue-500" />
            </div>
          )}

          {!isLoading && (
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left py-2">Nom</th>
                  <th className="text-left py-2">Email</th>
                  <th className="text-left py-2">Rôle</th>
                  <th className="text-left py-2">Actions</th>
                </tr>
              </thead>
              <tbody>

                {filteredUsers.map(u => (
                  <tr key={u.id} className="border-b">
                    <td className="py-2">{u.name}</td>
                    <td className="py-2">{u.email}</td>
                    <td className="py-2">
                      <Badge>{u.role.toUpperCase()}</Badge>
                    </td>
                    <td className="py-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteUser(u.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </td>
                  </tr>
                ))}

              </tbody>
            </table>
          )}

        </CardContent>
      </Card>

      <RoleModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      rhs={rhs}
      user={editingUser}
      forceRole={forceRole}   // ✅ AJOUT
      onSave={forceRole === "RH" ? (handleSaveRh as any) : (handleSaveUser as any)}
    />

    </div>
  );
}
export default Settings;  