import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { UserDTO } from '../api/userApi';

interface LocalUser extends Partial<UserDTO> {
  id: string;
  name?: string;
}

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Partial<UserDTO> & { role: string; rhId?: string }) => void;
  rhs: LocalUser[];
}

export function AddUserModal({ isOpen, onClose, onSave, rhs }: AddUserModalProps) {
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    userPassword: '',
    role: 'employer',
    rhId: '',
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        userName: '',
        email: '',
        userPassword: '',
        role: 'employer',
        rhId: '',
      });
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.userName || !formData.email || !formData.userPassword) {
      toast.error("Champs requis manquants");
      return;
    }

    if (formData.role === 'employer' && !formData.rhId) {
      toast.error("Sélectionnez un RH");
      return;
    }

    onSave({
      userName: formData.userName,
      email: formData.email,
      userPassword: formData.userPassword,
      role: formData.role.toUpperCase(),
      rhId: formData.role === 'employer' ? formData.rhId : undefined,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Ajouter un utilisateur</DialogTitle>
          <DialogDescription>Admin ou Employé</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Label>Nom</Label>
          <Input value={formData.userName} onChange={e => setFormData({ ...formData, userName: e.target.value })} />

          <Label>Email</Label>
          <Input value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />

          <Label>Mot de passe</Label>
          <Input type="password" value={formData.userPassword} onChange={e => setFormData({ ...formData, userPassword: e.target.value })} />

          <Label>Rôle</Label>
          <Select value={formData.role} onValueChange={role => setFormData({ ...formData, role })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Administrateur</SelectItem>
              <SelectItem value="employer">Employé</SelectItem>
            </SelectContent>
          </Select>

          {formData.role === 'employer' && (
            <>
              <Label>Responsable RH</Label>
              <Select value={formData.rhId} onValueChange={rhId => setFormData({ ...formData, rhId })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {rhs.map(rh => (
                    <SelectItem key={rh.id} value={rh.id}>
                      {rh.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={onClose}>Annuler</Button>
            <Button type="submit">Créer</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
