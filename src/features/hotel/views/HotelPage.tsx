import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { MapPin, Clock, Star, Heart, Shield, Users, Phone } from "lucide-react";
import { useHotelPackages } from "../controllers/useHotelPackages";
import hotelInfra1 from "@/assets/hotel-infra-1.jpg";
import hotelInfra2 from "@/assets/hotel-infra-2.jpg";
import hotelInfra3 from "@/assets/hotel-infra-3.jpg";
import hotelInfra4 from "@/assets/hotel-infra-4.jpg";
import hotelInfra5 from "@/assets/hotel-infra-5.jpg";

export function HotelPage() {
  const { data: packages, isLoading } = useHotelPackages();

  const facilities = [
    { id: 1, image: hotelInfra1, name: "Infraestrutura 1" },
    { id: 2, image: hotelInfra2, name: "Infraestrutura 2" },
    { id: 3, image: hotelInfra3, name: "Infraestrutura 3" },
    { id: 4, image: hotelInfra4, name: "Infraestrutura 4" },
    { id: 5, image: hotelInfra5, name: "Infraestrutura 5" },
  ];

  const guests = [
    {
      id: 1,
      name: "Max",
      breed: "Pastor Alemão",
      age: "3 anos",
      image: "/placeholder.svg",
      owner: "Maria Silva",
      stay: "7 dias",
      review: "Adorou a estadia! Voltou super relaxado e feliz.",
    },
    {
      id: 2,
      name: "Luna",
      breed: "Golden Retriever",
      age: "2 anos",
      image: "/placeholder.svg",
      owner: "João Santos",
      stay: "14 dias",
      review: "Excelente cuidado! Luna se sentiu em casa.",
    },
    {
      id: 3,
      name: "Thor",
      breed: "Rottweiler",
      age: "4 anos",
      image: "/placeholder.svg",
      owner: "Ana Costa",
      stay: "5 dias",
      review: "Profissionais muito competentes e carinhosos.",
    },
    {
      id: 4,
      name: "Bella",
      breed: "Lulu da Pomerânia",
      age: "1 ano",
      image: "/placeholder.svg",
      owner: "Pedro Lima",
      stay: "10 dias",
      review: "Bella adorou fazer novos amigos!",
    },
  ];

  const services = [
    {
      icon: Shield,
      title: "Segurança 24h",
      description: "Monitoramento constante com câmeras e profissionais qualificados",
    },
    {
      icon: Heart,
      title: "Cuidado Veterinário",
      description: "Veterinário de plantão para emergências e check-ups diários",
    },
    {
      icon: Users,
      title: "Socialização",
      description: "Atividades supervisionadas para interação social saudável",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-primary-light text-primary-foreground py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <Badge variant="secondary" className="mb-6 text-lg px-4 py-2">
                <MapPin className="h-5 w-5 mr-2" />
                Hotel Canino
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Hotel Canino AstorHouse</h1>
              <p className="text-xl opacity-90 leading-relaxed mb-8">
                Um lar longe de casa para seu melhor amigo. Hospedagem canina de luxo com todo o carinho e cuidado que
                seu pet merece.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Badge variant="outline" className="bg-white/10 border-white/20 text-white flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Seguraça 24h
                </Badge>
                <Badge variant="outline" className="bg-white/10 border-white/20 text-white flex items-center gap-2">
                  <Star className="h-4 w-4" />5 Estrelas
                </Badge>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          {/* Facilities Carousel */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Nossa Infraestrutura</h2>
            <Carousel className="w-full max-w-5xl mx-auto">
              <CarouselContent>
                {facilities.map((facility) => (
                  <CarouselItem key={facility.id} className="md:basis-1/2 lg:basis-1/3">
                    <Card className="h-full overflow-hidden">
                      <img src={facility.image} alt={facility.name} className="w-full h-64 object-cover" />
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </section>

          {/* Services */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Nossos Serviços</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <service.icon className="h-12 w-12 mx-auto text-primary mb-4" />
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{service.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Pricing Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Valores e Pacotes</h2>
            {isLoading ? (
              <div className="text-center text-muted-foreground">Carregando pacotes...</div>
            ) : !packages || packages.length === 0 ? (
              <div className="text-center text-muted-foreground">Nenhum pacote disponível no momento.</div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {packages.map((pkg) => (
                  <Card key={pkg.id} className={`relative ${pkg.is_popular ? 'border-primary shadow-lg' : ''}`}>
                    {pkg.is_popular && (
                      <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
                        Mais Popular
                      </Badge>
                    )}
                    <CardHeader>
                      <CardTitle className="text-center">{pkg.name}</CardTitle>
                      <div className="text-center">
                        <span className="text-3xl font-bold text-primary">R$ {pkg.price.toFixed(2)}</span>
                        <span className="text-muted-foreground">/dia</span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {pkg.description && (
                        <div className="text-center text-sm text-muted-foreground mb-4">{pkg.description}</div>
                      )}
                      <ul className="space-y-2 text-sm">
                        {pkg.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Discount Info */}
            <div className="text-center space-y-4 p-6 bg-muted/50 rounded-lg">
              <h3 className="text-xl font-semibold">Descontos Especiais</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <strong className="text-primary">10+ dias:</strong> 5% de desconto
                </div>
                <div>
                  <strong className="text-primary">15+ dias:</strong> 10% de desconto
                </div>
                <div>
                  <strong className="text-primary">30+ dias:</strong> 15% de desconto
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                * Check-in: após 14h | Check-out: até 12h | Taxa de reserva: R$ 50 (descontada do valor total)
              </p>
            </div>
          </section>

          {/* Happy Guests */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Nossos Hóspedes Felizes</h2>
            <Carousel className="w-full max-w-5xl mx-auto">
              <CarouselContent>
                {guests.map((guest) => (
                  <CarouselItem key={guest.id} className="md:basis-1/2 lg:basis-1/3">
                    <Card className="h-full">
                      <CardHeader className="text-center">
                        <img
                          src={guest.image}
                          alt={guest.name}
                          className="w-24 h-24 object-cover rounded-full mx-auto mb-4"
                        />
                        <CardTitle>{guest.name}</CardTitle>
                        <CardDescription>
                          {guest.breed} • {guest.age}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="text-center space-y-2">
                        <div className="text-sm">
                          <strong>Proprietário:</strong> {guest.owner}
                        </div>
                        <div className="text-sm">
                          <strong>Estadia:</strong> {guest.stay}
                        </div>
                        <blockquote className="text-sm italic text-muted-foreground mt-4">"{guest.review}"</blockquote>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </section>

          {/* CTA Section */}
          <section className="text-center gradient-primary rounded-lg p-8 text-primary-foreground">
            <h2 className="text-3xl font-bold mb-4">Reserve Agora a Hospedagem do Seu Pet</h2>
            <p className="text-lg mb-6 opacity-90">
              Garantimos o melhor cuidado e carinho para seu melhor amigo. Entre em contato e agende uma visita!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://wa.me/551140354243?text=Olá, gostaria de informações sobre hospedagem canina"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-gray-100">
                  <Phone className="h-5 w-5 mr-2" />
                  Ligar Agora
                </Button>
              </a>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
