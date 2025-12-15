import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { UserDTO } from '../api/userApi';
import { toast } from 'sonner';

interface LocalUser extends Partial<UserDTO> {
    id: string; 
    name?: string;
    userPrenom?: string;
}

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Partial<UserDTO> & { role: string; rhId?: string; userPassword?: string }) => void;
  user: LocalUser | null; 
  rhs: LocalUser[]; 
  forceRole?: "RH" | null;
}

const getRhDisplay = (rh: LocalUser) => {
    let fullName = rh.name && rh.name !== ' ' 
        ? rh.name 
        : `${rh.userPrenom ?? ''} ${rh.userName ?? ''}`.trim();

    if (!fullName) fullName = rh.userName ?? 'RH Inconnu';
    return fullName;
}

export function RoleModal({ isOpen, onClose, onSave, user, rhs }: RoleModalProps) {
  const [formData, setFormData] = useState({
    userName: '',
    userPrenom: '',
    email: '',
    tel: '',
    profession: '',
    userPassword: '',
    role: 'employer' as 'admin' | 'rh' | 'employer' | string, 
    status: 'active' as 'active' | 'inactive' | string,
    rhId: '',
  });

  // Réinitialisation pour nouvelle création
  useEffect(() => {
    if (isOpen) {
      setFormData({
        userName: '',
        userPrenom: '',
        email: '',
        tel: '',
        profession: '',
        userPassword: '',
        role: 'employer',
        status: 'active',
        rhId: rhs.length === 1 ? rhs[0].id : '', // Pré-selection RH si un seul
      });
    }
  }, [isOpen, rhs]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.role.toLowerCase() === 'employer' && !formData.rhId) {
      toast.error("Veuillez sélectionner un Responsable RH pour le nouvel employé.");
      return;
    }

    if (!formData.userName || !formData.email || !formData.userPassword) {
      toast.error("Le Nom, l'Email et le Mot de passe sont requis.");
      return;
    }

    const payload: Partial<UserDTO> & { role: string; rhId?: string; userPassword?: string } = {
      userName: formData.userName,
      userPrenom: formData.userPrenom,
      email: formData.email,
      tel: formData.tel,
      profession: formData.profession,
      status: formData.status,
      role: formData.role.toUpperCase(),
      userPassword: formData.userPassword,
    };

    if (formData.role.toLowerCase() === 'employer' && formData.rhId) {
      payload.rhId = formData.rhId;
    }

    onSave(payload);
  };

  const isEmployer = formData.role.toLowerCase() === 'employer';
  const selectedRh = rhs.find(rh => rh.id === formData.rhId);
  const placeholderText = selectedRh ? getRhDisplay(selectedRh) : 'Sélectionner un responsable RH';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Ajouter un utilisateur</DialogTitle>
          <DialogDescription>Créez un nouvel utilisateur et assignez-lui un rôle.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="userName">Nom (requis)</Label>
              <Input
                id="userName"
                value={formData.userName}
                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userPrenom">Prénom</Label>
              <Input
                id="userPrenom"
                value={formData.userPrenom}
                onChange={(e) => setFormData({ ...formData, userPrenom: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email (requis)</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe (requis)</Label>
            <Input
              id="password"
              type="password"
              value={formData.userPassword}
              onChange={(e) => setFormData({ ...formData, userPassword: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="profession">Profession</Label>
              <Input
                id="profession"
                value={formData.profession}
                onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tel">Téléphone</Label>
              <Input
                id="tel"
                value={formData.tel}
                onChange={(e) => setFormData({ ...formData, tel: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Rôle</Label>
              <Select
                value={formData.role}
                onValueChange={(value: typeof formData.role) => {
                  setFormData({ ...formData, role: value, rhId: value !== 'employer' ? '' : formData.rhId });
                }}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrateur</SelectItem>
                  <SelectItem value="rh">Ressources Humaines</SelectItem>
                  <SelectItem value="employer">Employé</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select
                value={formData.status}
                onValueChange={(value: typeof formData.status) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isEmployer && rhs.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="rhId">Responsable RH</Label>
              <Select
                value={formData.rhId}
                onValueChange={(value) => setFormData({ ...formData, rhId: value })}
                disabled={rhs.length === 1} // RH connecté
              >
                <SelectTrigger id="rhId">
                  <SelectValue placeholder={placeholderText} />
                </SelectTrigger>
                <SelectContent>
                  {rhs.map((rh) => (
                    <SelectItem key={rh.id} value={rh.id}>
                      {getRhDisplay(rh)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" type="button" onClick={onClose}>Annuler</Button>
            <Button type="submit">Enregistrer</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
