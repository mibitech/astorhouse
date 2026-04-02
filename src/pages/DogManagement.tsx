import React, { useState } from 'react';
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
import { Dog, DogFormData } from '@/types/dog';
import { Plus, Edit, Trash2, Search, Filter, Dog as DogIcon, Loader2, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { toast } from 'sonner';
import { useDogs } from '@/hooks/useDogs';
import ImageUploader from '@/components/ui/image-uploader';

const dogSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  breed: z.enum(['australian_shepherd', 'pomeranian', 'rottweiler']),
  age: z.string().min(1, 'Idade é obrigatória'),
  birth_date: z.string().min(1, 'Data de nascimento é obrigatória'),
  color: z.string().min(1, 'Cor é obrigatória'),
  gender: z.enum(['male', 'female']),
  status: z.enum(['garanhao', 'reprodutora', 'jovem_promessa', 'aposentado', 'disponivel']),
  weight: z.number().min(0.1, 'Peso deve ser maior que 0'),
  height: z.number().min(0.1, 'Altura deve ser maior que 0'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  temperament: z.string().min(1, 'Temperamento é obrigatório'),
  health_status: z.string().min(1, 'Status de saúde é obrigatório'),
  vaccination_status: z.string().min(1, 'Status de vacinação é obrigatório'),
  microchip: z.string().optional(),
  pedigree: z.string().optional(),
  achievements: z.array(z.string()).default([]),
  image_url: z.string().optional(),
  images: z.array(z.string()).default([]),
  parents: z.object({
    father: z.string().optional(),
    mother: z.string().optional(),
  }).optional(),
  offspring: z.array(z.string()).default([]),
  medical_records: z.object({
    exams: z.array(z.string()).default([]),
    vaccinations: z.array(z.string()).default([]),
    treatments: z.array(z.string()).default([]),
  }).optional(),
  is_active: z.boolean().default(true),
  is_available_for_breeding: z.boolean().default(false),
  price: z.number().optional(),
  notes: z.string().optional(),
});

const DogManagement = () => {
  const { dogs, loading, error, createDog, updateDog, deleteDog } = useDogs();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDog, setEditingDog] = useState<Dog | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBreed, setFilterBreed] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const form = useForm<DogFormData>({
    resolver: zodResolver(dogSchema),
    defaultValues: {
      name: '',
      breed: 'australian_shepherd',
      age: '',
      birth_date: '',
      color: '',
      gender: 'male',
      status: 'jovem_promessa',
      weight: 0,
      height: 0,
      description: '',
      temperament: '',
      health_status: '',
      vaccination_status: '',
      achievements: [],
      images: [],
      offspring: [],
      is_active: true,
      is_available_for_breeding: false,
    },
  });

  const onSubmit = async (data: DogFormData) => {
    if (editingDog) {
      // Update existing dog
      const result = await updateDog(editingDog.id, data);
      if (result) {
        setIsDialogOpen(false);
        setEditingDog(null);
        form.reset();
      }
    } else {
      // Create new dog
      const result = await createDog(data);
      if (result) {
        setIsDialogOpen(false);
        setEditingDog(null);
        form.reset();
      }
    }
  };

  const handleEdit = (dog: Dog) => {
    setEditingDog(dog);
    form.reset(dog);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteDog(id);
  };

  const handleNewDog = () => {
    setEditingDog(null);
    form.reset();
    setIsDialogOpen(true);
  };

  const breedLabels = {
    australian_shepherd: 'Pastor Australiano',
    pomeranian: 'Lulu da Pomerânia',
    rottweiler: 'Rottweiler'
  };

  const statusLabels = {
    garanhao: 'Garanhão',
    reprodutora: 'Reprodutora',
    jovem_promessa: 'Jovem Promessa',
    aposentado: 'Aposentado',
    disponivel: 'Disponível'
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'garanhao': return 'bg-blue-100 text-blue-800';
      case 'reprodutora': return 'bg-pink-100 text-pink-800';
      case 'jovem_promessa': return 'bg-green-100 text-green-800';
      case 'aposentado': return 'bg-gray-100 text-gray-800';
      case 'disponivel': return 'bg-yellow-100 text-yellow-800';
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

  const filteredDogs = dogs
    .filter(dog => {
      const matchesSearch = dog.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           dog.color.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBreed = filterBreed === 'all' || dog.breed === filterBreed;
      const matchesStatus = filterStatus === 'all' || dog.status === filterStatus;
      
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
              <p className="text-muted-foreground">Carregando cães...</p>
            </div>
          </div>
        ) : (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Gerenciamento de Cães</h1>
            <p className="text-muted-foreground">Cadastre e gerencie os cães do canil</p>
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
                      <SelectItem value="garanhao">Garanhão</SelectItem>
                      <SelectItem value="reprodutora">Reprodutora</SelectItem>
                      <SelectItem value="jovem_promessa">Jovem Promessa</SelectItem>
                      <SelectItem value="aposentado">Aposentado</SelectItem>
                      <SelectItem value="disponivel">Disponível</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={handleNewDog} className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Novo Cão
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl">
                      <DialogHeader>
                        <DialogTitle>
                          {editingDog ? 'Editar Cão' : 'Cadastrar Novo Cão'}
                        </DialogTitle>
                        <DialogDescription>
                          Preencha as informações do cão. Campos marcados com * são obrigatórios.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                                        <Input placeholder="Nome do cão" {...field} />
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
                                        <FormLabel>Idade *</FormLabel>
                                        <FormControl>
                                          <Input placeholder="Ex: 3 anos" {...field} />
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
                              </CardContent>
                            </Card>
                            
                            {/* Características Físicas */}
                            <Card className="rounded-xl">
                              <CardHeader>
                                <CardTitle className="text-lg">Características Físicas</CardTitle>
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
                                            placeholder="25.5"
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
                                            placeholder="55.0"
                                            {...field}
                                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                                
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
                                          <SelectItem value="garanhao">Garanhão</SelectItem>
                                          <SelectItem value="reprodutora">Reprodutora</SelectItem>
                                          <SelectItem value="jovem_promessa">Jovem Promessa</SelectItem>
                                          <SelectItem value="aposentado">Aposentado</SelectItem>
                                          <SelectItem value="disponivel">Disponível</SelectItem>
                                        </SelectContent>
                                      </Select>
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
                                        <Input placeholder="Ex: Dócil, ativo, protetor" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <FormField
                                  control={form.control}
                                  name="microchip"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Microchip</FormLabel>
                                      <FormControl>
                                        <Input placeholder="Número do microchip" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </CardContent>
                            </Card>
                          </div>
                          
                          {/* Saúde e Documentação */}
                          <Card className="rounded-xl">
                            <CardHeader>
                              <CardTitle className="text-lg">Saúde e Documentação</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                  control={form.control}
                                  name="health_status"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Status de Saúde *</FormLabel>
                                      <FormControl>
                                        <Input placeholder="Ex: Excelente, Bom" {...field} />
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
                                        <Input placeholder="Ex: Em dia, Próxima em..." {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              
                              <FormField
                                control={form.control}
                                name="pedigree"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Pedigree</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Número do pedigree" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </CardContent>
                          </Card>

                          {/* Upload de Imagens */}
                          <ImageUploader
                            currentImages={form.watch('images') || []}
                            onImagesChange={(images) => {
                              form.setValue('images', images);
                              if (images.length > 0) {
                                form.setValue('image_url', images[0]);
                              }
                            }}
                            bucket="dog-images"
                            maxImages={8}
                            folder={`${form.watch('breed')}-adults`}
                          />
                          
                          {/* Descrição e Observações */}
                          <Card className="rounded-xl">
                            <CardHeader>
                              <CardTitle className="text-lg">Descrição e Observações</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Descrição *</FormLabel>
                                    <FormControl>
                                      <Textarea 
                                        placeholder="Descreva as características e qualidades do cão..."
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
                                    <FormLabel>Observações</FormLabel>
                                    <FormControl>
                                      <Textarea 
                                        placeholder="Observações adicionais..."
                                        {...field} 
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </CardContent>
                          </Card>
                          
                          <div className="flex justify-end gap-4">
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                              Cancelar
                            </Button>
                            <Button type="submit">
                              {editingDog ? 'Atualizar' : 'Cadastrar'}
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

          {/* Dogs Table */}
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DogIcon className="h-5 w-5" />
                Cães Cadastrados ({filteredDogs.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredDogs.length === 0 ? (
                <div className="text-center py-8">
                  <DogIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Nenhum cão encontrado</p>
                </div>
              ) : (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden md:block">
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
                          <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('color')}>
                            Cor {getSortIcon('color')}
                          </TableHead>
                          <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('status')}>
                            Status {getSortIcon('status')}
                          </TableHead>
                          <TableHead>Sexo</TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredDogs.map((dog) => (
                          <TableRow key={dog.id}>
                            <TableCell className="font-medium">{dog.name}</TableCell>
                            <TableCell>{breedLabels[dog.breed]}</TableCell>
                            <TableCell>{dog.age}</TableCell>
                            <TableCell>{dog.color}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(dog.status)}>{statusLabels[dog.status]}</Badge>
                            </TableCell>
                            <TableCell>{dog.gender === 'male' ? 'Macho' : 'Fêmea'}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => handleEdit(dog)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive" 
                                  onClick={() => handleDelete(dog.id)}
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

                  {/* Mobile Card View */}
                  <div className="block md:hidden space-y-4">
                    {filteredDogs.map((dog) => (
                      <Card key={dog.id} className="rounded-xl border border-border/50">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-lg">{dog.name}</h3>
                              <p className="text-sm text-muted-foreground">{breedLabels[dog.breed]}</p>
                            </div>
                            <Badge className={`${getStatusColor(dog.status)} text-xs`}>
                              {statusLabels[dog.status]}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Idade:</span>
                              <p className="font-medium">{dog.age}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Sexo:</span>
                              <p className="font-medium">{dog.gender === 'male' ? 'Macho' : 'Fêmea'}</p>
                            </div>
                            <div className="col-span-2">
                              <span className="text-muted-foreground">Cor:</span>
                              <p className="font-medium">{dog.color}</p>
                            </div>
                          </div>
                          
                          <div className="flex gap-2 pt-2 border-t border-border/50">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleEdit(dog)}
                              className="flex-1"
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              onClick={() => handleDelete(dog.id)}
                              className="flex-1"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default DogManagement;