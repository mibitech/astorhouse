import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { ArrowLeft, Award, Calendar, Dog, Heart, Loader2, Phone, Ruler, Star, Weight } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useDogs } from '../controllers/useDogs';

const statusLabels: Record<string, string> = {
  garanhao: 'Garanhão',
  reprodutora: 'Reprodutora',
  jovem_promessa: 'Jovem Promessa',
  aposentado: 'Aposentado',
  disponivel: 'Disponível',
};

const breedLabels: Record<string, string> = {
  australian_shepherd: 'Pastor Australiano',
  pomeranian: 'Lulu da Pomerânia',
  rottweiler: 'Rottweiler',
};

export const DogDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { dogs, loading } = useDogs();
  const dog = dogs.find(d => d.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!dog) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Dog className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Cão não encontrado</h2>
            <p className="text-muted-foreground mb-6">O cão que você está procurando não existe ou foi removido.</p>
            <Button asChild>
              <Link to="/caes">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar para Nossos Cães
              </Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const allImages = dog.images && dog.images.length > 0 ? dog.images : (dog.image_url ? [dog.image_url] : []);

  return (
    <div className="min-h-screen">
      <Header />



      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Images */}
            <div>
              {allImages.length > 0 ? (
                allImages.length > 1 ? (
                  <Carousel className="w-full">
                    <CarouselContent>
                      {allImages.map((img, idx) => (
                        <CarouselItem key={idx}>
                          <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                            <img src={img} alt={`${dog.name} - foto ${idx + 1}`} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }} />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                ) : (
                  <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                    <img src={allImages[0]} alt={dog.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }} />
                  </div>
                )
              ) : (
                <div className="aspect-square rounded-lg bg-muted flex items-center justify-center">
                  <Dog className="h-24 w-24 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-bold">{dog.name}</h1>
                  <Badge variant="outline" className="text-sm">
                    {statusLabels[dog.status] || dog.status}
                  </Badge>
                </div>
                <p className="text-lg text-muted-foreground">
                  {breedLabels[dog.breed] || dog.breed} • {dog.color}
                </p>
              </div>

              <p className="text-muted-foreground leading-relaxed">{dog.description}</p>

              {/* Details grid */}
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="text-center">
                      <Weight className="h-5 w-5 mx-auto mb-1 text-primary" />
                      <p className="text-sm text-muted-foreground">Peso</p>
                      <p className="font-semibold">{dog.weight} kg</p>
                    </div>
                    <div className="text-center">
                      <Ruler className="h-5 w-5 mx-auto mb-1 text-primary" />
                      <p className="text-sm text-muted-foreground">Altura</p>
                      <p className="font-semibold">{dog.height} cm</p>
                    </div>
                    <div className="text-center">
                      <Calendar className="h-5 w-5 mx-auto mb-1 text-primary" />
                      <p className="text-sm text-muted-foreground">Idade</p>
                      <p className="font-semibold">{dog.age}</p>
                    </div>
                    <div className="text-center">
                      <Heart className="h-5 w-5 mx-auto mb-1 text-primary" />
                      <p className="text-sm text-muted-foreground">Gênero</p>
                      <p className="font-semibold">{dog.gender === 'male' ? 'Macho' : 'Fêmea'}</p>
                    </div>
                    <div className="text-center">
                      <span className="text-primary text-lg">🏥</span>
                      <p className="text-sm text-muted-foreground">Saúde</p>
                      <p className="font-semibold">{dog.health_status}</p>
                    </div>
                    <div className="text-center">
                      <span className="text-primary text-lg">💉</span>
                      <p className="text-sm text-muted-foreground">Vacinas</p>
                      <p className="font-semibold">{dog.vaccination_status}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Temperament */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Temperamento</h3>
                <p className="text-muted-foreground">{dog.temperament}</p>
              </div>

              {/* Achievements */}
              {dog.achievements && dog.achievements.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Conquistas
                  </h3>
                  <ul className="space-y-2">
                    {dog.achievements.map((achievement, index) => (
                      <li key={index} className="flex items-center gap-2 text-muted-foreground">
                        <Star className="h-4 w-4 text-accent flex-shrink-0" />
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Pedigree & Microchip */}
              <div className="flex flex-wrap gap-4 text-sm">
                {dog.pedigree && (
                  <div>
                    <span className="font-medium">Pedigree:</span>{' '}
                    <span className="text-muted-foreground">{dog.pedigree}</span>
                  </div>
                )}
                {dog.microchip && (
                  <div>
                    <span className="font-medium">Microchip:</span>{' '}
                    <span className="text-muted-foreground">{dog.microchip}</span>
                  </div>
                )}
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <Button variant="outline" size="lg" onClick={() => window.history.back()}>
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Voltar
                </Button>
                <a
                  href={`https://wa.me/551140354243?text=Olá, gostaria de saber mais sobre o cão ${dog.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="lg" className="w-full">
                    <Phone className="h-5 w-5 mr-2" />
                    Falar sobre {dog.name}
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
