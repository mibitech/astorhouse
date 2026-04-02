import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Heart, Award, Dog, Star, Crown, Shield, Calendar, Weight, Ruler, Loader2, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Dog as DogType } from '@/types/dog';
import { useDogs } from '@/hooks/useDogs';

const Dogs = () => {
  const { dogs, loading, error } = useDogs();

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Carregando informações dos cães...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Dog className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Erro ao carregar os cães: {error}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Filter dogs by breed
  const australianShepherds = dogs.filter(dog => dog.breed === 'australian_shepherd');
  const pomeranians = dogs.filter(dog => dog.breed === 'pomeranian');
  const rottweilers = dogs.filter(dog => dog.breed === 'rottweiler');

  const renderDogCard = (dog: DogType) => (
    <CarouselItem key={dog.id} className="md:basis-1/2 lg:basis-1/3">
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
        <div className="h-[280px] bg-muted flex items-center justify-center">
          {dog.images && dog.images.length > 0 ? (
            <img
              src={dog.images[0]}
              alt={dog.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
          ) : (
            <Dog className="h-16 w-16 text-muted-foreground" />
          )}
        </div>
        <CardHeader className="h-[72px]">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">{dog.name}</CardTitle>
              <CardDescription>{dog.age} • {dog.color}</CardDescription>
            </div>
            <Badge variant="outline">
              {dog.status === 'garanhao' && 'Garanhão'}
              {dog.status === 'reprodutora' && 'Reprodutora'}
              {dog.status === 'jovem_promessa' && 'Jovem Promessa'}
              {dog.status === 'aposentado' && 'Aposentado'}
              {dog.status === 'disponivel' && 'Disponível'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 flex-1 flex flex-col">
          <p className="text-muted-foreground text-sm line-clamp-3 min-h-[60px]">{dog.description}</p>
          
          {/* Physical Info */}
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Weight className="h-3 w-3" />
              <span>{dog.weight}kg</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Ruler className="h-3 w-3" />
              <span>{dog.height}cm</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{dog.gender === 'male' ? 'Macho' : 'Fêmea'}</span>
            </div>
          </div>

          {/* Temperament */}
          <div className="h-[40px]">
            <p className="text-xs font-medium text-muted-foreground mb-1">Temperamento:</p>
            <p className="text-sm line-clamp-1">{dog.temperament}</p>
          </div>
          
          <div className="min-h-[90px]">
            {dog.achievements.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm">
                  <Award className="h-4 w-4 text-primary" />
                  Principais Conquistas
                </h4>
                <ul className="space-y-1">
                  {dog.achievements.slice(0, 3).map((achievement, index) => (
                    <li key={index} className="text-xs text-muted-foreground flex items-center gap-2">
                      <Star className="h-3 w-3 text-accent" />
                      {achievement}
                    </li>
                  ))}
                  {dog.achievements.length > 3 && (
                    <li className="text-xs text-muted-foreground italic">
                      +{dog.achievements.length - 3} outras conquistas...
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* Health Status */}
          <div className="text-xs">
            <span className="font-medium">Saúde:</span> {dog.health_status} | 
            <span className="font-medium"> Vacinas:</span> {dog.vaccination_status}
          </div>
          
          <div className="mt-auto pt-4">
            <Button asChild className="w-full">
              <Link to={`/caes/${dog.id}`}>
                Ver Mais Detalhes
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </CarouselItem>
  );

  const characteristics = [
    {
      title: 'Temperamento Equilibrado',
      description: 'Cães com personalidade estável e previsível, ideais para famílias.',
    },
    {
      title: 'Saúde Comprovada',
      description: 'Todos os nossos reprodutores passam por exames rigorosos de saúde.',
    },
    {
      title: 'Linhagem Campeã',
      description: 'Descendentes de campeões nacionais e internacionais.',
    },
    {
      title: 'Socialização Completa',
      description: 'Filhotes criados em ambiente familiar, bem socializados.',
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-light text-primary-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6 text-lg px-4 py-2">
              <Dog className="h-5 w-5 mr-2" />
              Nossos Cães
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Conheça Nossos Pastores Australianos
            </h1>
            <p className="text-xl opacity-90 leading-relaxed">
              Cada um dos nossos cães é especial, selecionado criteriosamente para perpetuar o melhor da raça
            </p>
          </div>
        </div>
      </section>

      {/* Australian Shepherds Carousel */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Pastores Australianos</h2>
            <p className="text-xl text-muted-foreground">Nossos exemplares da raça Pastor Australiano</p>
          </div>
          
          <Carousel className="w-full max-w-5xl mx-auto">
            <CarouselContent>
              {australianShepherds.length > 0 ? (
                australianShepherds.map(renderDogCard)
              ) : (
                <div className="flex items-center justify-center w-full p-8">
                  <p className="text-muted-foreground">Nenhum Pastor Australiano cadastrado</p>
                </div>
              )}
            </CarouselContent>
            {australianShepherds.length > 1 && (
              <>
                <CarouselPrevious />
                <CarouselNext />
              </>
            )}
          </Carousel>
        </div>
      </section>

      {/* Pomeranians Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 text-lg px-4 py-2">
              <Crown className="h-5 w-5 mr-2" />
              Lulu da Pomerânia
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nossos Lulus da Pomerânia</h2>
            <p className="text-xl text-muted-foreground">Pequenos, mas cheios de personalidade e elegância</p>
          </div>
          
          <Carousel className="w-full max-w-5xl mx-auto">
            <CarouselContent>
              {pomeranians.length > 0 ? (
                pomeranians.map(renderDogCard)
              ) : (
                <div className="flex items-center justify-center w-full p-8">
                  <p className="text-muted-foreground">Nenhum Lulu da Pomerânia cadastrado</p>
                </div>
              )}
            </CarouselContent>
            {pomeranians.length > 1 && (
              <>
                <CarouselPrevious />
                <CarouselNext />
              </>
            )}
          </Carousel>
        </div>
      </section>

      {/* Rottweilers Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 text-lg px-4 py-2">
              <Shield className="h-5 w-5 mr-2" />
              Rottweiler
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nossos Rottweilers</h2>
            <p className="text-xl text-muted-foreground">Força, lealdade e proteção em cada exemplar</p>
          </div>
          
          <Carousel className="w-full max-w-5xl mx-auto">
            <CarouselContent>
              {rottweilers.length > 0 ? (
                rottweilers.map(renderDogCard)
              ) : (
                <div className="flex items-center justify-center w-full p-8">
                  <p className="text-muted-foreground">Nenhum Rottweiler cadastrado</p>
                </div>
              )}
            </CarouselContent>
            {rottweilers.length > 1 && (
              <>
                <CarouselPrevious />
                <CarouselNext />
              </>
            )}
          </Carousel>
        </div>
      </section>

      {/* Characteristics */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              O que torna nossos cães especiais
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Compromisso com a excelência em cada aspecto da criação
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {characteristics.map((characteristic, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{characteristic.title}</h3>
                <p className="text-muted-foreground">{characteristic.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-secondary text-secondary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Interessado em nossos filhotes?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Entre em contato conosco para saber mais sobre disponibilidade e agendar uma visita.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/551140354243?text=Olá, gostaria de saber mais sobre os cães"
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
    </div>
  );
};

export default Dogs;