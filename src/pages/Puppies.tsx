import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Dog, Phone, CheckCircle, DollarSign, Truck, Gift, HeadphonesIcon, Heart, Info, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { usePuppiesByBreed } from '@/hooks/usePuppies';
import { Puppy } from '@/types/puppy';

const Puppies = () => {
  const [selectedPuppy, setSelectedPuppy] = useState<Puppy | null>(null);
  
  // Fetch puppies from Supabase by breed
  const { puppies: australianShepherdPuppies, loading: loadingAS } = usePuppiesByBreed('australian_shepherd');
  const { puppies: pomeranianPuppies, loading: loadingPom } = usePuppiesByBreed('pomeranian');
  const { puppies: rottweilerPuppies, loading: loadingRott } = usePuppiesByBreed('rottweiler');

  // Filter out sold and unavailable puppies from the carousels
  const availableAustralianShepherds = australianShepherdPuppies.filter(p => p.status !== 'vendido' && p.status !== 'nao_disponivel');
  const availablePomeranians = pomeranianPuppies.filter(p => p.status !== 'vendido' && p.status !== 'nao_disponivel');
  const availableRottweilers = rottweilerPuppies.filter(p => p.status !== 'vendido' && p.status !== 'nao_disponivel');
  
  // Get sold puppies for historical display
  const soldPuppies = [...australianShepherdPuppies, ...pomeranianPuppies, ...rottweilerPuppies]
    .filter(p => p.status === 'vendido');

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'disponivel': return 'bg-green-500 text-white';
      case 'reservado': return 'bg-yellow-500 text-white';
      case 'vendido': return 'bg-red-500 text-white';
      case 'nao_disponivel': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const renderPuppyCard = (puppy: any) => {
    const breedLabels: { [key: string]: string } = {
      'australian_shepherd': 'Pastor Australiano',
      'pomeranian': 'Lulu da Pomerânia',
      'rottweiler': 'Rottweiler'
    };

    const statusLabels: { [key: string]: string } = {
      'disponivel': 'Disponível',
      'reservado': 'Reservado',
      'vendido': 'Vendido',
      'nao_disponivel': 'Não Disponível'
    };

    const genderLabel = puppy.gender === 'male' ? 'Macho' : 'Fêmea';
    const parentsText = puppy.parents ? `${puppy.parents.mother || 'N/A'} x ${puppy.parents.father || 'N/A'}` : 'N/A';
    
    return (
      <Card key={puppy.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
        <div className="aspect-square bg-muted flex items-center justify-center relative">
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
            <Dog className="h-16 w-16 text-muted-foreground" />
          )}
          <Badge className={`absolute top-2 right-2 ${getStatusColor(puppy.status)}`}>
            {statusLabels[puppy.status] || puppy.status}
          </Badge>
        </div>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">{puppy.name}</CardTitle>
              <CardDescription>
                {puppy.age} • {puppy.color} • {genderLabel}
              </CardDescription>
              <p className="text-sm text-muted-foreground mt-1">
                Pais: {parentsText}
              </p>
            </div>
            {puppy.status !== 'vendido' && (
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">
                  {puppy.price ? `R$ ${puppy.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'Consulte'}
                </div>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <p className="text-sm text-muted-foreground mb-4">
            {puppy.description}
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {puppy.vaccination_status && (
              <Badge variant="outline" className="text-xs">
                <CheckCircle className="h-3 w-3 mr-1" />
                Vacinado
              </Badge>
            )}
            {puppy.microchip && (
              <Badge variant="outline" className="text-xs">
                <CheckCircle className="h-3 w-3 mr-1" />
                Microchip
              </Badge>
            )}
            {puppy.pedigree && (
              <Badge variant="outline" className="text-xs">
                <CheckCircle className="h-3 w-3 mr-1" />
                Pedigree
              </Badge>
            )}
          </div>
          <div className="flex gap-2 mt-auto pt-4">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setSelectedPuppy(puppy)}
            >
              <Info className="h-4 w-4 mr-2" />
              Detalhe
            </Button>
            {puppy.status === 'disponivel' ? (
              <a
                href={`https://wa.me/551140354243?text=${encodeURIComponent(`Eu gostaria de reservar o filhote ${puppy.name}, quais são os próximos passos?`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button className="w-full">
                  <Phone className="h-4 w-4 mr-2" />
                  Reserva
                </Button>
              </a>
            ) : (
              <Button className="w-full flex-1" disabled>
                <Phone className="h-4 w-4 mr-2" />
                Reserva
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center bg-white/20 rounded-full px-6 py-3 mb-6">
              <Heart className="h-5 w-5 mr-2" />
              <span className="text-lg font-medium">Filhotes Disponíveis</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Nossos Filhotes
            </h1>
            <p className="text-xl opacity-90 leading-relaxed">
              Filhotes selecionados com amor e cuidado especial, prontos para fazer parte da sua família
            </p>
          </div>
        </div>
      </section>

      {/* Available Australian Shepherds */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Pastores Australianos</h2>
            <p className="text-xl text-muted-foreground">Filhotes da mais alta qualidade</p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <Carousel className="w-full">
              <CarouselContent>
                {availableAustralianShepherds.length > 0 ? (
                  availableAustralianShepherds.map((puppy) => (
                    <CarouselItem key={puppy.id} className="md:basis-1/2 lg:basis-1/3">
                      {renderPuppyCard(puppy)}
                    </CarouselItem>
                  ))
                ) : (
                  <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                    <Card className="p-8 text-center">
                      <Dog className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                       <p className="text-muted-foreground">
                         {loadingAS ? 'Carregando...' : 'Nenhum filhote no momento'}
                      </p>
                    </Card>
                  </CarouselItem>
                )}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>
      </section>

      {/* Pomeranian Puppies */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Lulus da Pomerânia</h2>
            <p className="text-xl text-muted-foreground">Pequenos príncipes e princesas</p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <Carousel className="w-full">
              <CarouselContent>
                {availablePomeranians.length > 0 ? (
                  availablePomeranians.map((puppy) => (
                    <CarouselItem key={puppy.id} className="md:basis-1/2 lg:basis-1/3">
                      {renderPuppyCard(puppy)}
                    </CarouselItem>
                  ))
                ) : (
                  <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                    <Card className="p-8 text-center">
                      <Dog className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                       <p className="text-muted-foreground">
                         {loadingPom ? 'Carregando...' : 'Nenhum filhote no momento'}
                      </p>
                    </Card>
                  </CarouselItem>
                )}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>
      </section>

      {/* Rottweiler Puppies */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Rottweilers</h2>
            <p className="text-xl text-muted-foreground">Força e lealdade desde filhotes</p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <Carousel className="w-full">
              <CarouselContent>
                {availableRottweilers.length > 0 ? (
                  availableRottweilers.map((puppy) => (
                    <CarouselItem key={puppy.id} className="md:basis-1/2 lg:basis-1/3">
                      {renderPuppyCard(puppy)}
                    </CarouselItem>
                  ))
                ) : (
                  <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                    <Card className="p-8 text-center">
                      <Dog className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                       <p className="text-muted-foreground">
                         {loadingRott ? 'Carregando...' : 'Nenhum filhote no momento'}
                      </p>
                    </Card>
                  </CarouselItem>
                )}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>
      </section>

      {/* Recently Sold Puppies */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Filhotes Recentemente Vendidos</h2>
            <p className="text-xl text-muted-foreground">Nossos bebês que encontraram seus lares</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {soldPuppies.length > 0 ? (
              soldPuppies.slice(0, 6).map((puppy) => (
                <Card key={puppy.id} className="overflow-hidden">
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
                      <Dog className="h-16 w-16 text-muted-foreground" />
                    )}
                  </div>
                  <CardHeader className="text-center">
                    <CardTitle className="text-lg">{puppy.name}</CardTitle>
                    <CardDescription>
                      {puppy.breed === 'australian_shepherd' ? 'Pastor Australiano' : 
                       puppy.breed === 'pomeranian' ? 'Lulu da Pomerânia' : 'Rottweiler'} • {puppy.color}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Badge variant="secondary">Vendido</Badge>
                    <p className="text-sm text-muted-foreground mt-2">
                      Entregue com amor para nova família
                    </p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="p-8 text-center col-span-full">
                <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Nenhum filhote vendido recentemente</p>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Purchase Information */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Informações de Compra</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tudo que você precisa saber sobre a aquisição do seu novo companheiro
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="text-center rounded-2xl shadow-soft">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Condições de Pagamento</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-left text-muted-foreground space-y-2">
                  <li>• 50% na reserva</li>
                  <li>• 50% na entrega</li>
                  <li>• PIX, cartão ou dinheiro</li>
                  <li>• Parcelamento disponível</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center rounded-2xl shadow-soft">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>O que está Incluso</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-left text-muted-foreground space-y-2">
                  <li>• Pedigree CBKC</li>
                  <li>• Cartão de vacinação</li>
                  <li>• Microchip identificação</li>
                  <li>• Kit inicial</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center rounded-2xl shadow-soft">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Entrega</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-left text-muted-foreground space-y-2">
                  <li>• A partir de 60 dias</li>
                  <li>• Visitas antes da entrega</li>
                  <li>• Entrega presencial</li>
                  <li>• Suporte pós-venda</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Encontre seu novo melhor amigo
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Entre em contato conosco para conhecer nossos filhotes disponíveis e agendar uma visita.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/551140354243?text=Olá, gostaria de saber mais sobre os filhotes"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="secondary" size="lg" className="text-lg px-8 py-6 bg-white text-primary hover:bg-gray-100">
                <Phone className="h-5 w-5 mr-2" />
                Ligar Agora
              </Button>
            </a>
            <Button 
              asChild 
              size="lg" 
              variant="secondary"
              className="text-lg px-8 py-6 bg-white text-primary hover:bg-gray-100"
            >
              <Link to="/sobre" onClick={() => window.scrollTo(0, 0)}>
                Saiba Mais
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />

      {/* Puppy Details Dialog */}
      <Dialog open={!!selectedPuppy} onOpenChange={() => setSelectedPuppy(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedPuppy && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedPuppy.name}</DialogTitle>
                <DialogDescription>
                  {selectedPuppy.breed === 'australian_shepherd' ? 'Pastor Australiano' : 
                   selectedPuppy.breed === 'pomeranian' ? 'Lulu da Pomerânia' : 'Rottweiler'} • {selectedPuppy.age} • {selectedPuppy.gender === 'male' ? 'Macho' : 'Fêmea'}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Images Carousel */}
                {selectedPuppy.images && selectedPuppy.images.length > 0 && (
                  <div className="relative">
                    <Carousel className="w-full">
                      <CarouselContent>
                        {selectedPuppy.images.map((image, index) => (
                          <CarouselItem key={index}>
                            <div className="aspect-video bg-muted flex items-center justify-center rounded-lg overflow-hidden">
                              <img
                                src={image}
                                alt={`${selectedPuppy.name} - Foto ${index + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = '/placeholder.svg';
                                }}
                              />
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="left-4 h-12 w-12 bg-background/90 hover:bg-background" />
                      <CarouselNext className="right-4 h-12 w-12 bg-background/90 hover:bg-background" />
                    </Carousel>
                    <div className="absolute top-4 right-4">
                      <Badge className={getStatusColor(selectedPuppy.status)}>
                        {selectedPuppy.status === 'disponivel' ? 'Disponível' : 
                         selectedPuppy.status === 'reservado' ? 'Reservado' : 
                         selectedPuppy.status === 'vendido' ? 'Vendido' : 'Não Disponível'}
                      </Badge>
                    </div>
                  </div>
                )}

                {/* Price */}
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <span className="text-lg font-semibold">Preço:</span>
                  <span className="text-2xl font-bold text-primary">
                    {selectedPuppy.price ? `R$ ${selectedPuppy.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'Consulte'}
                  </span>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Descrição</h3>
                  <p className="text-muted-foreground">{selectedPuppy.description}</p>
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Cor:</span>
                    <p className="font-medium">{selectedPuppy.color}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Peso:</span>
                    <p className="font-medium">{selectedPuppy.weight} kg</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Altura:</span>
                    <p className="font-medium">{selectedPuppy.height} cm</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Data de Nascimento:</span>
                    <p className="font-medium">{new Date(selectedPuppy.birth_date).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Temperamento:</span>
                    <p className="font-medium">{selectedPuppy.temperament}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Estado de Saúde:</span>
                    <p className="font-medium">{selectedPuppy.health_status}</p>
                  </div>
                </div>

                {/* Parents */}
                {selectedPuppy.parents && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Pais</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-muted-foreground">Mãe:</span>
                        <p className="font-medium">{selectedPuppy.parents.mother || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Pai:</span>
                        <p className="font-medium">{selectedPuppy.parents.father || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Certifications */}
                <div className="flex flex-wrap gap-2">
                  {selectedPuppy.vaccination_status && (
                    <Badge variant="outline">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Vacinado
                    </Badge>
                  )}
                  {selectedPuppy.microchip && (
                    <Badge variant="outline">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Microchip: {selectedPuppy.microchip}
                    </Badge>
                  )}
                  {selectedPuppy.pedigree && (
                    <Badge variant="outline">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Pedigree: {selectedPuppy.pedigree}
                    </Badge>
                  )}
                </div>

                {/* Achievements */}
                {selectedPuppy.achievements && selectedPuppy.achievements.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Conquistas</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedPuppy.achievements.map((achievement, index) => (
                        <li key={index} className="text-muted-foreground">{achievement}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Notes */}
                {selectedPuppy.notes && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Observações</h3>
                    <p className="text-muted-foreground">{selectedPuppy.notes}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => setSelectedPuppy(null)}
                    className="flex-1"
                  >
                    <X className="h-5 w-5 mr-2" />
                    Voltar
                  </Button>
                  <a
                    href={`https://wa.me/551140354243?text=${encodeURIComponent(`Eu gostaria de reservar o filhote ${selectedPuppy.name}, quais são os próximos passos?`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button className="w-full" size="lg">
                      <Phone className="h-5 w-5 mr-2" />
                      Reservar Agora
                    </Button>
                  </a>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Puppies;