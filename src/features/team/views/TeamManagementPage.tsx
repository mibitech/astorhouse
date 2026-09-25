import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Pencil, UserX, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import Header from '@/components/layout/Header';
import { teamMemberSchema, type TeamMember, type TeamMemberFormData } from '../models/team.types';
import { useAllTeamMembers, useCreateTeamMember, useUpdateTeamMember, useDeactivateTeamMember } from '../controllers/useTeam';

export const TeamManagementPage = () => {
  const { data: members = [], isLoading } = useAllTeamMembers();
  const createMember = useCreateTeamMember();
  const updateMember = useUpdateTeamMember();
  const deactivateMember = useDeactivateTeamMember();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  const form = useForm<TeamMemberFormData>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: {
      name: '',
      position: '',
      bio: '',
      photo_url: null,
      is_active: true,
      order_index: null,
    },
  });

  const openCreate = () => {
    setEditingMember(null);
    form.reset({ name: '', position: '', bio: '', photo_url: null, is_active: true, order_index: null });
    setIsDialogOpen(true);
  };

  const openEdit = (member: TeamMember) => {
    setEditingMember(member);
    form.reset({
      name: member.name,
      position: member.position,
      bio: member.bio ?? '',
      photo_url: member.photo_url,
      is_active: member.is_active ?? true,
      order_index: member.order_index,
    });
    setIsDialogOpen(true);
  };

  const onSubmit = async (data: TeamMemberFormData) => {
    try {
      if (editingMember) {
        await updateMember.mutateAsync({ id: editingMember.id, ...data });
      } else {
        await createMember.mutateAsync(data);
      }
      setIsDialogOpen(false);
      setEditingMember(null);
      form.reset();
    } catch {
      // erro tratado pelo controller (toast)
    }
  };

  const handleDeactivate = (id: string) => {
    if (confirm('Tem certeza que deseja desativar este membro?')) {
      deactivateMember.mutate(id);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Equipe</h1>
              <p className="text-muted-foreground">
                {members.filter((m) => m.is_active).length} membro{members.filter((m) => m.is_active).length !== 1 ? 's' : ''} ativo{members.filter((m) => m.is_active).length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Membro
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingMember ? 'Editar Membro' : 'Novo Membro'}</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome completo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cargo</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Veterinário, Adestradora…" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Breve descrição do membro"
                            rows={3}
                            {...field}
                            value={field.value ?? ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="photo_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL da Foto</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://..."
                              {...field}
                              value={field.value ?? ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="order_index"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ordem</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0"
                              {...field}
                              value={field.value ?? ''}
                              onChange={(e) =>
                                field.onChange(e.target.value ? Number(e.target.value) : null)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-3">
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="!mt-0">Ativo</FormLabel>
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      disabled={createMember.isPending || updateMember.isPending}
                    >
                      {editingMember ? 'Atualizar' : 'Cadastrar'}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <p className="text-center text-muted-foreground py-16">Carregando equipe…</p>
        ) : members.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center text-muted-foreground">
              Nenhum membro cadastrado. Clique em "Novo Membro" para começar.
            </CardContent>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {members.map((member) => (
              <Card key={member.id} className={!member.is_active ? 'opacity-50' : ''}>
                <CardHeader className="pb-2">
                  <div className="flex items-start gap-3">
                    {member.photo_url ? (
                      <img
                        src={member.photo_url}
                        alt={member.name}
                        className="w-12 h-12 rounded-full object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center shrink-0">
                        <Users className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base">{member.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{member.position}</p>
                    </div>
                    <Badge variant={member.is_active ? 'default' : 'secondary'} className="shrink-0">
                      {member.is_active ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                </CardHeader>
                {member.bio && (
                  <CardContent className="pt-0 pb-2">
                    <p className="text-sm text-muted-foreground line-clamp-2">{member.bio}</p>
                  </CardContent>
                )}
                <CardContent className="pt-0 flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => openEdit(member)}>
                    <Pencil className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  {member.is_active && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeactivate(member.id)}
                      disabled={deactivateMember.isPending}
                    >
                      <UserX className="h-4 w-4 mr-1" />
                      Desativar
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
