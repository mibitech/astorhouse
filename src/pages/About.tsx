import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Shield, Award, Users, Target, Eye } from 'lucide-react';
import { useCompanyInfo } from '@/hooks/useCompanyInfo';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const About = () => {
  const { data: companyInfo } = useCompanyInfo();

  const values = [
    {
      icon: Heart,
      title: 'Amor pelos Animais',
      description: 'Cada cão é tratado com carinho e dedicação, como parte de nossa família.',
    },
    {
      icon: Shield,
      title: 'Responsabilidade',
      description: 'Comprometimento com práticas éticas e transparentes em nossa criação.',
    },
    {
      icon: Award,
      title: 'Qualidade',
      description: 'Excelência em todos os aspectos, desde a seleção até o acompanhamento.',
    },
    {
      icon: Users,
      title: 'Comunidade',
      description: 'Criamos uma rede de tutores satisfeitos e cães felizes.',
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
              <Heart className="h-5 w-5 mr-2" />
              Nossa História
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Sobre a AstorHouse
            </h1>
            <p className="text-xl opacity-90 leading-relaxed">
              20 anos de experiência na criação artesanal de Pastores Australianos e adestramento especializado
            </p>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center">
              <CardHeader>
                <Target className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-2xl">Missão</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {companyInfo?.mission || 'Proporcionar cães de qualidade excepcional através de criação responsável e adestramento especializado.'}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Eye className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-2xl">Visão</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {companyInfo?.vision || 'Ser referência nacional na criação de Pastor Australiano, promovendo o bem-estar animal e a satisfação dos tutores.'}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-2xl">Valores</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {companyInfo?.values || 'Responsabilidade, Qualidade, Transparência, Bem-estar Animal, Excelência no Atendimento'}
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Nossos Princípios
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Os valores que guiam nosso trabalho e definem nosso compromisso com a excelência
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <value.icon className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience and Location */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
                Nossa Experiência e Localização
              </h2>
              <p className="text-xl text-muted-foreground">
                20 anos dedicados à criação artesanal e adestramento especializado
              </p>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-lg leading-relaxed mb-6">
                O Pastor Australiano é uma raça versátil e inteligente, conhecida por sua lealdade, 
                energia e capacidade de trabalho. Originalmente desenvolvido nos Estados Unidos para 
                trabalhar com gado, estes cães se tornaram companheiros excepcionais para famílias ativas.
              </p>
              
              <p className="text-lg leading-relaxed mb-6">
                <strong>Nosso espaço-boutique</strong> está localizado em Bragança Paulista, a 100 km de São Paulo, 
                60 km de Campinas, e facilmente acessível para quem reside em São José dos Campos, 
                Piracicaba e regiões. Este ambiente especial foi criado pensando no bem-estar e conforto 
                dos nossos cães e das famílias que nos visitam.
              </p>
              
              <p className="text-lg leading-relaxed mb-6">
                Na AstorHouse, nos especializamos na <strong>criação artesanal</strong> desta raça magnífica, 
                focando não apenas na beleza e conformação, mas também no temperamento equilibrado 
                e na saúde dos nossos cães. Nossa metodologia "sem castigo" garante que cada animal 
                seja tratado com respeito e carinho.
              </p>
              
              <p className="text-lg leading-relaxed">
                Nosso compromisso vai além da criação - acompanhamos cada família em sua jornada, 
                oferecendo suporte contínuo e serviços de adestramento especializados para garantir 
                uma convivência harmoniosa e feliz. <strong>Cão adestrado é mais feliz!</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;