import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Puppy, PuppyFormData } from '../models/puppy.types';
import { Plus, Edit, Trash2, Search, Filter, Heart, Loader2, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { toast } from 'sonner';
import { usePuppies } from '../controllers/usePuppies';
import ImageUploader from '@/components/ui/image-uploader';
import { differenceInWeeks, parseISO } from 'date-fns';

const puppySchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  breed: z.enum(['australian_shepherd', 'pomeranian', 'rottweiler']),
  age: z.string().min(1, 'Idade é obrigatória'),
  birth_date: z.string().min(1, 'Data de nascimento é obrigatória'),
  color: z.string().min(1, 'Cor é obrigatória'),
  gender: z.enum(['male', 'female']),
  status: z.enum(['disponivel', 'reservado', 'vendido', 'nao_disponivel']),
  weight: z.number().min(0.1, 'Peso deve ser maior que 0'),
  height: z.number().min(0.1, 'Altura deve ser maior que 0'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  temperament: z.string().min(1, 'Temperamento é obrigatório'),
  health_status: z.string().min(1, 'Status de saúde é obrigatório'),
  vaccination_status: z.string().min(1, 'Status de vacinação é obrigatório'),
  microchip: z.string().nullable().optional(),
  pedigree: z.string().optional(),
  achievements: z.array(z.string()).default([]),
  image_url: z.string().optional().nullable(),
  images: z.array(z.string()).default([]),
  parents: z.object({
    father: z.string().optional(),
    mother: z.string().optional(),
  }).optional(),
  medical_records: z.object({
    exams: z.array(z.string()).default([]),
    vaccinations: z.array(z.string()).default([]),
    treatments: z.array(z.string()).default([]),
  }).optional(),
  is_active: z.boolean().default(true),
  is_available_for_sale: z.boolean().default(true),
  price: z.number().optional(),
  notes: z.string().optional().nullable(),
});

export const PuppyManagementPage = () => {
  const { puppies, loading, error, createPuppy, updatePuppy, deletePuppy } = usePuppies();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPuppy, setEditingPuppy] = useState<Puppy | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBreed, setFilterBreed] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const form = useForm<PuppyFormData>({
    resolver: zodResolver(puppySchema),
    defaultValues: {
      name: '',
      breed: 'australian_shepherd',
      age: '',
      birth_date: '',
      color: '',
      gender: 'male',
      status: 'disponivel',
      weight: 0,
      height: 0,
      description: '',
      temperament: '',
      health_status: '',
      vaccination_status: '',
      microchip: '',
      pedigree: '',
      achievements: [],
      images: [],
      parents: {
        father: '',
        mother: '',
      },
      medical_records: {
        exams: [],
        vaccinations: [],
        treatments: [],
      },
      notes: '',
      is_active: true,
      is_available_for_sale: true,
    },
  });

  // Calcular idade automaticamente com base na data de nascimento
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'birth_date' && value.birth_date) {
        try {
          const birthDate = parseISO(value.birth_date);
          const weeks = differenceInWeeks(new Date(), birthDate);
          form.setValue('age', `${weeks} semanas`);
        } catch (error) {
          console.error('Erro ao calcular idade:', error);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const onSubmit = async (data: PuppyFormData) => {
    console.log('onSubmit chamado com dados:', data);
    console.log('Editando filhote:', editingPuppy);
    
    if (editingPuppy) {
      console.log('Atualizando filhote ID:', editingPuppy.id);
      const result = await updatePuppy(editingPuppy.id, data);
      console.log('Resultado da atualização:', result);
      if (result) {
        setIsDialogOpen(false);
        setEditingPuppy(null);
        form.reset();
      }
    } else {
      console.log('Criando novo filhote');
      const result = await createPuppy(data);
      console.log('Resultado da criação:', result);
      if (result) {
        setIsDialogOpen(false);
        setEditingPuppy(null);
        form.reset();
      }
    }
  };

  const handleEdit = (puppy: Puppy) => {
    setEditingPuppy(puppy);
    form.reset(puppy);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deletePuppy(id);
  };

  const handleNewPuppy = () => {
    setEditingPuppy(null);
    form.reset();
    setIsDialogOpen(true);
  };

  const breedLabels = {
    australian_shepherd: 'Pastor Australiano',
    pomeranian: 'Lulu da Pomerânia',
    rottweiler: 'Rottweiler'
  };

  const statusLabels = {
    disponivel: 'Disponível',
    reservado: 'Reservado',
    vendido: 'Vendido',
    nao_disponivel: 'Não Disponível'
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'disponivel': return 'bg-green-100 text-green-800';
      case 'reservado': return 'bg-yellow-100 text-yellow-800';
      case 'vendido': return 'bg-gray-100 text-gray-800';
      case 'nao_disponivel': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (column: string) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="h-4 w-4 ml-1 inline opacity-50" />;
    }
    return sortDirection === 'asc' 
      ? <ArrowUp className="h-4 w-4 ml-1 inline" />
      : <ArrowDown className="h-4 w-4 ml-1 inline" />;
  };

  const filteredPuppies = puppies
    .filter(puppy => {
      const matchesSearch = puppy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           puppy.color.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBreed = filterBreed === 'all' || puppy.breed === filterBreed;
      const matchesStatus = filterStatus === 'all' || puppy.status === filterStatus;
      
      return matchesSearch && matchesBreed && matchesStatus;
    })
    .sort((a, b) => {
      if (!sortColumn) return 0;
      
      const direction = sortDirection === 'asc' ? 1 : -1;
      
      switch (sortColumn) {
        case 'name':
          return direction * a.name.localeCompare(b.name);
        case 'breed':
          return direction * breedLabels[a.breed].localeCompare(breedLabels[b.breed]);
        case 'age':
          return direction * (new Date(b.birth_date).getTime() - new Date(a.birth_date).getTime());
        case 'color':
          return direction * a.color.localeCompare(b.color);
        case 'status':
          return direction * statusLabels[a.status].localeCompare(statusLabels[b.status]);
        case 'price':
          return direction * ((a.price || 0) - (b.price || 0));
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Carregando filhotes...</p>
            </div>
          </div>
        ) : (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Gerenciamento de Filhotes</h1>
            <p className="text-muted-foreground">Cadastre e gerencie os filhotes do canil</p>
          </div>

          {/* Filters and Search */}
          <Card className="rounded-2xl mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Filtros e Busca
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="search">Buscar por nome ou cor</Label>
                  <Input
                    id="search"
                    placeholder="Digite para buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="breed-filter">Raça</Label>
                  <Select value={filterBreed} onValueChange={setFilterBreed}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as raças" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as raças</SelectItem>
                      <SelectItem value="australian_shepherd">Pastor Australiano</SelectItem>
                      <SelectItem value="pomeranian">Lulu da Pomerânia</SelectItem>
                      <SelectItem value="rottweiler">Rottweiler</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status-filter">Status</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os status</SelectItem>
                      <SelectItem value="disponivel">Disponível</SelectItem>
                      <SelectItem value="reservado">Reservado</SelectItem>
                      <SelectItem value="vendido">Vendido</SelectItem>
                      <SelectItem value="nao_disponivel">Não Disponível</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={handleNewPuppy} className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Novo Filhote
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl">
                      <DialogHeader>
                        <DialogTitle>
                          {editingPuppy ? 'Editar Filhote' : 'Cadastrar Novo Filhote'}
                        </DialogTitle>
                        <DialogDescription>
                          Preencha as informações do filhote. Campos marcados com * são obrigatórios.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <Form {...form}>
                        <form 
                          onSubmit={(e) => {
                            console.log('Form submit event triggered');
                            console.log('Form errors:', form.formState.errors);
                            console.log('Form values:', form.getValues());
                            return form.handleSubmit(onSubmit)(e);
                          }} 
                          className="space-y-6"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Informações Básicas */}
                            <Card className="rounded-xl">
                              <CardHeader>
                                <CardTitle className="text-lg">Informações Básicas</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <FormField
                                  control={form.control}
                                  name="name"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Nome *</FormLabel>
                                      <FormControl>
                                        <Input placeholder="Nome do filhote" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <FormField
                                  control={form.control}
                                  name="breed"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Raça *</FormLabel>
                                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                          <SelectTrigger>
                                            <SelectValue placeholder="Selecione a raça" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          <SelectItem value="australian_shepherd">Pastor Australiano</SelectItem>
                                          <SelectItem value="pomeranian">Lulu da Pomerânia</SelectItem>
                                          <SelectItem value="rottweiler">Rottweiler</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <FormField
                                  control={form.control}
                                  name="gender"
                                  render={({ field }) => (
                                    <FormItem className="space-y-3">
                                      <FormLabel>Sexo *</FormLabel>
                                      <FormControl>
                                        <RadioGroup
                                          onValueChange={field.onChange}
                                          defaultValue={field.value}
                                          className="flex flex-row space-x-6"
                                        >
                                          <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="male" id="male" />
                                            <Label htmlFor="male">Macho</Label>
                                          </div>
                                          <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="female" id="female" />
                                            <Label htmlFor="female">Fêmea</Label>
                                          </div>
                                        </RadioGroup>
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <div className="grid grid-cols-2 gap-4">
                                  <FormField
                                    control={form.control}
                                    name="age"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Idade (semanas)</FormLabel>
                                        <FormControl>
                                          <Input 
                                            placeholder="Calculado automaticamente" 
                                            {...field} 
                                            readOnly
                                            className="bg-muted cursor-not-allowed"
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  
                                  <FormField
                                    control={form.control}
                                    name="birth_date"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Data de Nascimento *</FormLabel>
                                        <FormControl>
                                          <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                                
                                <FormField
                                  control={form.control}
                                  name="color"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Cor *</FormLabel>
                                      <FormControl>
                                        <Input placeholder="Ex: Blue Merle" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name="status"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Status *</FormLabel>
                                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                          <SelectTrigger>
                                            <SelectValue placeholder="Selecione o status" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          <SelectItem value="disponivel">Disponível</SelectItem>
                                          <SelectItem value="reservado">Reservado</SelectItem>
                                          <SelectItem value="vendido">Vendido</SelectItem>
                                          <SelectItem value="nao_disponivel">Não Disponível</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </CardContent>
                            </Card>
                            
                          {/* Características Físicas e Saúde */}
                            <Card className="rounded-xl">
                              <CardHeader>
                                <CardTitle className="text-lg">Características Físicas e Saúde</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <FormField
                                    control={form.control}
                                    name="weight"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Peso (kg) *</FormLabel>
                                        <FormControl>
                                          <Input 
                                            type="number" 
                                            step="0.1"
                                            placeholder="2.5"
                                            {...field}
                                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  
                                  <FormField
                                    control={form.control}
                                    name="height"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Altura (cm) *</FormLabel>
                                        <FormControl>
                                          <Input 
                                            type="number" 
                                            step="0.1"
                                            placeholder="25"
                                            {...field}
                                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                          </div>

                          {/* Upload de Imagens */}
                          <ImageUploader
                            currentImages={form.watch('images') || []}
                            onImagesChange={(images) => {
                              form.setValue('images', images);
                              if (images.length > 0) {
                                form.setValue('image_url', images[0]);
                              }
                            }}
                            bucket="puppy-images"
                            maxImages={5}
                            folder={`${form.watch('breed')}-puppies`}
                          />
                                
                                <FormField
                                  control={form.control}
                                  name="health_status"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Status de Saúde *</FormLabel>
                                      <FormControl>
                                        <Input placeholder="Ex: Saudável, em dia com exames" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <FormField
                                  control={form.control}
                                  name="vaccination_status"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Status de Vacinação *</FormLabel>
                                      <FormControl>
                                        <Input placeholder="Ex: Primeira dose aplicada" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <FormField
                                  control={form.control}
                                  name="temperament"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Temperamento *</FormLabel>
                                      <FormControl>
                                        <Input placeholder="Ex: Brincalhão, sociável" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </CardContent>
                            </Card>
                          </div>

                          {/* Dados técnicos e financeiro */}
                          <Card className="rounded-xl">
                            <CardHeader>
                              <CardTitle className="text-lg">Dados técnicos e financeiro</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField
                                  control={form.control}
                                  name="microchip"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Microchip</FormLabel>
                                      <FormControl>
                                        <Input placeholder="Número do microchip" {...field} value={field.value || ''} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name="pedigree"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Pedigree</FormLabel>
                                      <FormControl>
                                        <Input placeholder="Número do pedigree" {...field} value={field.value || ''} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name="price"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Preço (R$)</FormLabel>
                                      <FormControl>
                                        <Input 
                                          type="number" 
                                          step="0.01"
                                          placeholder="3500.00"
                                          {...field}
                                          onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </CardContent>
                          </Card>

                          {/* Informações dos Pais */}
                          <Card className="rounded-xl">
                            <CardHeader>
                              <CardTitle className="text-lg">Informações dos Pais</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <FormField
                                control={form.control}
                                name="parents.mother"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Mãe</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Nome da mãe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="parents.father"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Pai</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Nome do pai" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </CardContent>
                          </Card>

                          {/* Descrição */}
                          <Card className="rounded-xl">
                            <CardHeader>
                              <CardTitle className="text-lg">Descrição</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Descrição Completa *</FormLabel>
                                    <FormControl>
                                      <Textarea 
                                        placeholder="Descreva o filhote em detalhes..."
                                        className="min-h-[100px]"
                                        {...field} 
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="notes"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Observações Adicionais</FormLabel>
                                    <FormControl>
                                      <Textarea 
                                        placeholder="Observações gerais sobre o filhote..."
                                        className="min-h-[80px]"
                                        {...field}
                                        value={field.value || ''}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </CardContent>
                          </Card>

                          <div className="flex justify-end gap-3">
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={() => setIsDialogOpen(false)}
                            >
                              Cancelar
                            </Button>
                            <Button 
                              type="submit"
                              onClick={(e) => {
                                console.log('Botão atualizar clicado!', e);
                              }}
                            >
                              {editingPuppy ? 'Atualizar' : 'Cadastrar'}
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Puppies Table - Desktop */}
          <Card className="rounded-2xl hidden md:block">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Filhotes Cadastrados ({filteredPuppies.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredPuppies.length === 0 ? (
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-muted-foreground mb-2">Nenhum filhote encontrado</p>
                  <p className="text-sm text-muted-foreground">
                    {searchTerm || filterBreed !== 'all' || filterStatus !== 'all' 
                      ? 'Tente ajustar os filtros de busca'
                      : 'Comece cadastrando o primeiro filhote'
                    }
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('name')}>
                          Nome {getSortIcon('name')}
                        </TableHead>
                        <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('breed')}>
                          Raça {getSortIcon('breed')}
                        </TableHead>
                        <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('age')}>
                          Idade {getSortIcon('age')}
                        </TableHead>
                        <TableHead>Sexo</TableHead>
                        <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('color')}>
                          Cor {getSortIcon('color')}
                        </TableHead>
                        <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('status')}>
                          Status {getSortIcon('status')}
                        </TableHead>
                        <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('price')}>
                          Preço {getSortIcon('price')}
                        </TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPuppies.map((puppy) => (
                        <TableRow key={puppy.id}>
                          <TableCell className="font-medium">{puppy.name}</TableCell>
                          <TableCell>{breedLabels[puppy.breed]}</TableCell>
                          <TableCell>{puppy.age}</TableCell>
                          <TableCell>{puppy.gender === 'male' ? 'Macho' : 'Fêmea'}</TableCell>
                          <TableCell>{puppy.color}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(puppy.status)}>
                              {statusLabels[puppy.status]}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {puppy.price ? `R$ ${puppy.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-'}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(puppy)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(puppy.id)}
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

          {/* Puppies Cards - Mobile */}
          <div className="block md:hidden">
            <div className="mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Filhotes Cadastrados ({filteredPuppies.length})
              </h2>
            </div>
            
            {filteredPuppies.length === 0 ? (
              <Card className="rounded-2xl">
                <CardContent className="text-center py-8">
                  <Heart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-muted-foreground mb-2">Nenhum filhote encontrado</p>
                  <p className="text-sm text-muted-foreground">
                    {searchTerm || filterBreed !== 'all' || filterStatus !== 'all' 
                      ? 'Tente ajustar os filtros de busca'
                      : 'Comece cadastrando o primeiro filhote'
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredPuppies.map((puppy) => (
                  <Card key={puppy.id} className="rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="aspect-square bg-muted flex items-center justify-center">
                      {puppy.images && puppy.images.length > 0 ? (
                        <img
                          src={puppy.images[0]}
                          alt={puppy.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.svg';
                          }}
                        />
                      ) : (
                        <Heart className="h-16 w-16 text-muted-foreground" />
                      )}
                    </div>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">{puppy.name}</CardTitle>
                          <CardDescription>{puppy.age} • {puppy.color}</CardDescription>
                        </div>
                        <Badge className={getStatusColor(puppy.status)}>
                          {statusLabels[puppy.status]}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground text-sm line-clamp-2">{puppy.description}</p>
                      
                      {/* Physical Info */}
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="text-center">
                          <p className="text-muted-foreground text-xs">Raça</p>
                          <p className="font-medium">{breedLabels[puppy.breed]}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-muted-foreground text-xs">Sexo</p>
                          <p className="font-medium">{puppy.gender === 'male' ? 'Macho' : 'Fêmea'}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-muted-foreground text-xs">Peso</p>
                          <p className="font-medium">{puppy.weight}kg</p>
                        </div>
                      </div>

                      {/* Price */}
                      {puppy.price && (
                        <div className="text-center py-2 bg-muted rounded-lg">
                          <p className="text-xs text-muted-foreground">Preço</p>
                          <p className="text-lg font-bold text-primary">
                            R$ {puppy.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                      )}
                      
                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleEdit(puppy)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleDelete(puppy.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

