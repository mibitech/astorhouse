import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Eye, Trash2, Mail, Phone, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useContacts, useUpdateContactStatus, useDeleteContact, Contact } from '@/hooks/useContacts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ContactManagement = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: contacts, isLoading } = useContacts();
  const updateStatusMutation = useUpdateContactStatus();
  const deleteMutation = useDeleteContact();

  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      new: { variant: 'default', label: 'Novo' },
      in_progress: { variant: 'secondary', label: 'Em Andamento' },
      resolved: { variant: 'outline', label: 'Resolvido' },
    };
    
    const config = variants[status] || variants.new;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getContactTypeName = (type: string) => {
    const types: Record<string, string> = {
      general: 'Informações Gerais',
      adoption: 'Adoção de Filhotes',
      training: 'Adestramento',
      breeding: 'Reprodução',
      consultation: 'Consultoria',
    };
    return types[type] || type;
  };

  const handleViewDetails = (contact: Contact) => {
    setSelectedContact(contact);
    setIsDialogOpen(true);
  };

  const handleStatusChange = async (id: string, status: string) => {
    await updateStatusMutation.mutateAsync({ id, status });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este contato?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold">Gerenciar Contatos</h1>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Mensagens Recebidas</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Carregando...</p>
            ) : !contacts || contacts.length === 0 ? (
              <p className="text-muted-foreground">Nenhuma mensagem recebida.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contacts.map((contact) => (
                      <TableRow key={contact.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{contact.name}</div>
                            <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                              <Mail className="h-3 w-3" />
                              {contact.email}
                            </div>
                            {contact.phone && (
                              <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                <Phone className="h-3 w-3" />
                                {contact.phone}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {getContactTypeName(contact.contact_type)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={contact.status}
                            onValueChange={(value) => handleStatusChange(contact.id, value)}
                          >
                            <SelectTrigger className="w-36">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">Novo</SelectItem>
                              <SelectItem value="in_progress">Em Andamento</SelectItem>
                              <SelectItem value="resolved">Resolvido</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(contact.created_at), "dd/MM/yyyy 'às' HH:mm", {
                              locale: ptBR,
                            })}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewDetails(contact)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(contact.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Contato</DialogTitle>
          </DialogHeader>
          {selectedContact && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-1">Nome</h3>
                <p>{selectedContact.name}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-1">E-mail</h3>
                <p>{selectedContact.email}</p>
              </div>
              
              {selectedContact.phone && (
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground mb-1">Telefone</h3>
                  <p>{selectedContact.phone}</p>
                </div>
              )}
              
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-1">Tipo de Contato</h3>
                <p>{getContactTypeName(selectedContact.contact_type)}</p>
              </div>
              
              {selectedContact.subject && (
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground mb-1">Assunto</h3>
                  <p>{selectedContact.subject}</p>
                </div>
              )}
              
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-1">Mensagem</h3>
                <p className="whitespace-pre-wrap bg-muted/50 p-4 rounded-md">
                  {selectedContact.message}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-1">Status</h3>
                {getStatusBadge(selectedContact.status)}
              </div>
              
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-1">Data de Recebimento</h3>
                <p>
                  {format(new Date(selectedContact.created_at), "dd/MM/yyyy 'às' HH:mm", {
                    locale: ptBR,
                  })}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default ContactManagement;
