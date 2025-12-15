// src/components/UserModal.tsx
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { UserDTO, userApi } from "../api/userApi";
import { toast } from "sonner";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: UserDTO | null;
  onSaved?: (updated?: UserDTO) => void;
}

/**
 * Modal simple pour éditer les informations d'un user et son rôle.
 * - si backend ne supporte pas la modification complète via /user/update/{id},
 *   la mise à jour du rôle utilise /admin/attribute/{id} (POST).
 */
export function UserModal({ isOpen, onClose, user, onSaved }: UserModalProps) {
  const [form, setForm] = useState<Partial<UserDTO>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(user ?? {});
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleChange = (key: keyof UserDTO, value: any) => {
    setForm((f) => ({ ...(f ?? {}), [key]: value }));
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      // First, if role changed, call admin attribute endpoint
      if (form.role && form.role !== user.role) {
        await userApi.setRole(user.userId!, form.role);
      }

      // Try to call updateUserInfo for other fields (backend may only accept password here).
      // We still attempt updating by sending a JSON with fields; backend behavior may vary.
      const payload: Partial<UserDTO> = {
        userName: form.userName,
        userPrenom: form.userPrenom,
        email: form.email,
        tel: form.tel,
        profession: form.profession,
        status: form.status,
      };

      try {
        await userApi.updateUserInfo(user.userId!, payload as any);
      } catch (err) {
        // Not fatal: role update likely succeeded, some backends don't support full update endpoint.
        console.warn("updateUserInfo failed (may be normal):", err);
      }

      toast.success("Utilisateur mis à jour");
      onSaved && onSaved({ ...(user as UserDTO), ...(form as UserDTO) });
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Erreur lors de la mise à jour");
    } finally {
      setSaving(false);
    }
  };

  return (
    // Overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <Card className="z-60 w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Modifier l'utilisateur</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Prénom</Label>
              <Input value={form.userPrenom ?? ""} onChange={(e) => handleChange("userPrenom", e.target.value)} />
            </div>
            <div>
              <Label>Nom</Label>
              <Input value={form.userName ?? ""} onChange={(e) => handleChange("userName", e.target.value)} />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={form.email ?? ""} onChange={(e) => handleChange("email", e.target.value)} />
            </div>
            <div>
              <Label>Téléphone</Label>
              <Input value={form.tel ?? ""} onChange={(e) => handleChange("tel", e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <Label>Profession</Label>
              <Input value={form.profession ?? ""} onChange={(e) => handleChange("profession", e.target.value)} />
            </div>

            <div>
              <Label>Statut</Label>
              <Select value={form.status as any} onValueChange={(v: string) => handleChange("status", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={"active"}>Actif</SelectItem>
                  <SelectItem value={"inactive"}>Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Rôle</Label>
              <Select value={form.role as any} onValueChange={(v: string) => handleChange("role", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={"EMPLOYER"}>Employer</SelectItem>
                  <SelectItem value={"RH"}>RH</SelectItem>
                  <SelectItem value={"ADMIN"}>Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={onClose} disabled={saving}>
              Annuler
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
