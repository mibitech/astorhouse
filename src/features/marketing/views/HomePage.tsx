import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Shield, Award, Users, ArrowRight, Dog, Trophy, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCompanyInfo } from '@/features/company';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import familyWithAussies from '@/assets/family-with-aussies.jpg';

export const HomePage = () => {
  const { data: companyInfo } = useCompanyInfo();

  const features = [
    {
      icon: Shield,
      title: 'Criação Responsável',
      description: 'Focamos no bem-estar e saúde dos nossos cães, seguindo os mais altos padrões de criação.',
    },
    {
      icon: Award,
      title: 'Pedigree Certificado',
      description: 'Todos os nossos cães possuem pedigree reconhecido e certificação de qualidade.',
    },
    {
      icon: Heart,
      title: 'Amor e Dedicação',
      description: 'Cada cão é tratado como família, recebendo todo carinho e atenção necessários.',
    },
    {
      icon: Users,
      title: 'Adestramento Especializado',
      description: 'Oferecemos serviços de adestramento com técnicas modernas e eficazes.',
    },
  ];

  const achievements = [
    { number: '20+', label: 'Anos de Experiência' },
    { number: '600+', label: 'Cães Criados' },
    { number: '300+', label: 'Avaliações 5 Estrelas' },
    { number: '1000+', label: 'Filhotes Treinados' },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section with Background Image */}
      <section 
        className="relative min-h-screen bg-cover bg-center bg-no-repeat py-20 md:py-32"
        style={{
          backgroundImage: `url(${familyWithAussies})`,
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="container mx-auto px-4 relative z-10 flex items-center min-h-screen">
          <div className="text-center max-w-4xl mx-auto text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight drop-shadow-lg">
              {companyInfo?.name || 'AstorHouse'}
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-95 leading-relaxed drop-shadow-md">
              {companyInfo?.slogan || 'Criação responsável de Pastor Australiano com pedigree'}
            </p>
            <p className="text-lg mb-10 opacity-90 max-w-3xl mx-auto drop-shadow-md">
              {companyInfo?.mission || 'Proporcionar cães de qualidade excepcional através de criação responsável e adestramento especializado.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 border-white bg-white/10 text-white hover:bg-white hover:text-primary backdrop-blur-sm">
                <Link to="/caes">
                  Conheça Nossos Cães <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 border-white bg-white/10 text-white hover:bg-white hover:text-primary backdrop-blur-sm">
                <Link to="/contato">
                  Fale Conosco
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Por que escolher a AstorHouse?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Somos especialistas em Pastor Australiano, oferecendo criação responsável e serviços completos
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Nossos Números
            </h2>
            <p className="text-xl text-muted-foreground">
              Resultados que comprovam nossa experiência e dedicação
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  {achievement.number}
                </div>
                <div className="text-muted-foreground font-medium">
                  {achievement.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-tricolor text-white">
        <div className="container mx-auto px-4 text-center">
          <Trophy className="h-16 w-16 mx-auto mb-6 text-accent" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para encontrar seu companheiro ideal?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Entre em contato conosco e descubra como podemos ajudar você a encontrar o Pastor Australiano perfeito para sua família.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-6 bg-white text-primary hover:bg-white/90">
              <Link to="/contato">
                Entrar em Contato <Star className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" className="text-lg px-8 py-6 bg-white text-primary hover:bg-gray-100">
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
