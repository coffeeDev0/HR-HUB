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
import { toast } from 'sonner';
import { UserDTO } from '../api/userApi';

interface AddRhModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Partial<UserDTO>) => void;
}

export function AddRhModal({ isOpen, onClose, onSave }: AddRhModalProps) {
  const [formData, setFormData] = useState({
    userName: '',
    userPrenom: '',
    email: '',
    tel: '',
    profession: '',
    userPassword: '',
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        userName: '',
        userPrenom: '',
        email: '',
        tel: '',
        profession: '',
        userPassword: '',
      });
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.userName || !formData.email || !formData.userPassword) {
      toast.error("Nom, Email et Mot de passe requis");
      return;
    }

    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Ajouter un Responsable RH</DialogTitle>
          <DialogDescription>
            Création d’un compte Ressources Humaines
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Label>Nom</Label>
          <Input value={formData.userName} onChange={e => setFormData({ ...formData, userName: e.target.value })} />

          <Label>Prénom</Label>
          <Input value={formData.userPrenom} onChange={e => setFormData({ ...formData, userPrenom: e.target.value })} />

          <Label>Email</Label>
          <Input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />

          <Label>Mot de passe</Label>
          <Input type="password" value={formData.userPassword} onChange={e => setFormData({ ...formData, userPassword: e.target.value })} />

          <Label>Téléphone</Label>
          <Input value={formData.tel} onChange={e => setFormData({ ...formData, tel: e.target.value })} />

          <Label>Profession</Label>
          <Input value={formData.profession} onChange={e => setFormData({ ...formData, profession: e.target.value })} />

          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={onClose}>Annuler</Button>
            <Button type="submit">Créer RH</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
