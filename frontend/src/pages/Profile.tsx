// === Profile.tsx (profil utilisateur connecté + historique congés) ===

import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { User, Mail, Phone, Briefcase, Calendar, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { userApi, UserDTO } from '../api/userApi';
import { demandeApi, DemandeDTO } from '../api/demandeApi';

export function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<UserDTO | null>(null);
  const [leaveHistory, setLeaveHistory] = useState<DemandeDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const stored = localStorage.getItem('user');
  const currentUser = stored ? JSON.parse(stored) : null;
  const userEmail = currentUser?.email;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        if (!userEmail) return;

        const user = await userApi.getUserByEmail(userEmail);
        setProfileData(user);

        const demandes = await demandeApi.getByEmail(userEmail);
        setLeaveHistory(demandes);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userEmail]);

  const handleSave = async () => {
    if (!profileData) return;
    try {
      await userApi.updateUserInfo(profileData.userId!, profileData);
      setIsEditing(false);
      toast.success('Profil mis à jour avec succès');
    } catch (err) {
      console.error(err);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400">Validé</Badge>;
      case 'pending':
        return <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400">En attente</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400">Refusé</Badge>;
      default:
        return null;
    }
  };

  if (loading || !profileData) return <div className="text-center py-8">Chargement...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-gray-900 dark:text-white">Mon Profil</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Gérez vos informations personnelles</p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700">
            <Edit className="size-4 mr-2" />
            Modifier le profil
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <Avatar className="size-24">
                  <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-2xl">
                    {profileData.userPrenom?.[0]}{profileData.userName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl text-gray-900 dark:text-white">
                    {profileData.userPrenom} {profileData.userName}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">{profileData.profession}</p>
                  <Badge className="mt-2 bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400">
                    {profileData.status}
                  </Badge>
                </div>
                <div className="w-full pt-4 space-y-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="size-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">{profileData.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="size-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">{profileData.tel}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="size-5 text-blue-600" />
                Informations personnelles
              </CardTitle>
              <CardDescription>{isEditing ? 'Modifiez vos informations' : 'Vos informations personnelles'}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input id="firstName" value={profileData.userPrenom || ''} disabled={!isEditing}
                    onChange={(e) => setProfileData({...profileData, userPrenom: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input id="lastName" value={profileData.userName || ''} disabled={!isEditing}
                    onChange={(e) => setProfileData({...profileData, userName: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={profileData.email || ''} disabled={!isEditing}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input id="phone" value={profileData.tel || ''} disabled={!isEditing}
                    onChange={(e) => setProfileData({...profileData, tel: e.target.value})} />
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-3 justify-end mt-6">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>Annuler</Button>
                  <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">Enregistrer</Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="size-5 text-blue-600" />
                Historique des congés
              </CardTitle>
              <CardDescription>Vos demandes de congés récentes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400">Type</th>
                      <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400">Date début</th>
                      <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400">Date fin</th>
                      <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaveHistory.map((leave) => (
                      <tr key={leave.demandeId} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-3 px-4"><Badge>{leave.raison}</Badge></td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{new Date(leave.dateDebut).toLocaleDateString('fr-FR')}</td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{new Date(leave.dateFin).toLocaleDateString('fr-FR')}</td>
                        <td className="py-3 px-4">{getStatusBadge(leave.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!leaveHistory.length && <p className="text-center py-6 text-gray-500">Aucune demande de congé trouvée.</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Profile;
