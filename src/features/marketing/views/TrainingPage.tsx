import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, Users, Award, Brain, Heart, MapPin, Calendar, Shield, Phone } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import robsonTrainer from '@/assets/robson.webp';
import kennelSpace from '@/assets/acomodacao.webp';
import trainingSpace from '@/assets/moradia.webp';

export const TrainingPage = () => {
  const trainingTypes = [
    {
      title: 'Comandos Básicos',
      description: 'Fundamentos essenciais para um cão obediente',
      icon: CheckCircle
    },
    {
      title: 'Comandos Avançados',
      description: 'Treinamento especializado para cães experientes',
      icon: Award
    },
    {
      title: 'Mudança no Comportamento',
      description: 'Correção de comportamentos problemáticos',
      icon: Brain
    },
    {
      title: 'Aulas de Obediência',
      description: 'Sessões focadas em disciplina e respeito',
      icon: Shield
    }
  ];

  const facilities = [
    {
      title: 'Localização Privilegiada',
      description: 'Bragança Paulista - 100km de SP, 60km de Campinas, acessível de São José dos Campos e Piracicaba',
      icon: MapPin
    },
    {
      title: 'Programa de 20 Dias',
      description: '4 aulas diárias em período integral, funcionando como férias para seu cão',
      icon: Calendar
    },
    {
      title: '8 Unidades Independentes',
      description: 'Acomodações limpas, iluminadas, ventiladas e protegidas do frio',
      icon: Shield
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-primary-light text-primary-foreground py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <Badge variant="secondary" className="mb-6 text-lg px-4 py-2">
                <Brain className="h-5 w-5 mr-2" />
                Adestramento Profissional
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Adestramento Profissional
              </h1>
              <p className="text-xl opacity-90 leading-relaxed">
                Transforme a relação com seu cão através de métodos cientificamente comprovados 
                e baseados no respeito mútuo.
              </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">

        {/* Introduction Section */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-6">Adestramento de Cães de Todas as Raças</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Com duas décadas de experiência, adestramos cães de todas as raças e tamanho, 
              com segurança e dentro dos padrões de adestramento conhecido como "sem castigo".
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-lg leading-relaxed">
                Nosso diferencial é o espaço-boutique do nosso canil, localizado em Bragança Paulista, 
                a 100 kms de São Paulo, 60 kms de Campinas, e bastante acessível para quem reside em 
                São José dos Campos, Piracicaba e regiões.
              </p>
              
              <div className="grid grid-cols-3 gap-4">
                {facilities.map((facility, index) => {
                  const IconComponent = facility.icon;
                  return (
                    <Card key={index} className="text-center p-4">
                      <div className="mx-auto w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      <h4 className="font-semibold text-sm mb-2">{facility.title}</h4>
                      <p className="text-xs text-muted-foreground">{facility.description}</p>
                    </Card>
                  );
                })}
              </div>
            </div>
            
            <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
              <img 
                src={robsonTrainer} 
                alt="Treinador Robson com Pastor Australiano" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Ideal Space Section */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">O Canil Astor House possui o Espaço Ideal Para Adestramento o Seu Cão</h2>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <p className="text-lg leading-relaxed">
                  O nosso Canil Astor House é pequeno, simples e tem exatamente o que o seu cão necessita 
                  para o seu desenvolvimento físico, psicológico e educacional: muita atenção da nossa equipe 
                  e um bom espaço onde possa se sentir acolhido para se sociabilizar com pessoas e também com 
                  outros cãezinhos, aprender, se alimentar e também descansar, que ninguém é de ferro.
                </p>
                <p className="text-lg leading-relaxed">
                  Os programas de Adestramento levam normalmente <strong>20 dias</strong> e funcionam como 
                  umas férias para os caninos. E para você também, não é mesmo?
                </p>
                <Badge variant="outline" className="text-lg px-4 py-2">
                  <Calendar className="h-5 w-5 mr-2" />
                  Programa de 20 dias corridos
                </Badge>
              </div>
              
              <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
                <img 
                  src={kennelSpace} 
                  alt="Espaço do Canil Astor House" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Accommodation Section */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Onde Seu Cão Vai Morar no Período de Adestramento</h2>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="aspect-video rounded-lg overflow-hidden shadow-lg order-2 lg:order-1">
                <img 
                  src={trainingSpace} 
                  alt="Espaço de moradia e adestramento" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="space-y-6 order-1 lg:order-2">
                <p className="text-lg leading-relaxed">
                  Dentro deste conceito, a moradia do seu cão aqui na Astor House é limpa, iluminada, 
                  ventilada, protegida do frio e bem construída. Ou seja, digna e segura para o animal.
                </p>
                <p className="text-lg leading-relaxed">
                  O Canil Astor House dispõe de <strong>8 unidades independentes</strong> para acomodação 
                  e convívio do nossos animais.
                </p>
                <p className="text-lg leading-relaxed">
                  Portanto, os cães possuem um rotina tranquila em que a prioridade é deixá-los à vontade 
                  para tomarem sol ou se repousarem na sombra, no intervalo das <strong>4 aulas diárias</strong> 
                  que eles recebem, no período de 20 dias corridos de treinamento.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 font-semibold">
                    💡 Dica: É bom reservar com antecedência pois há poucas vagas e muita procura.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Training Types Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Tipos de Adestramento</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trainingTypes.map((type, index) => {
              const IconComponent = type.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{type.title}</CardTitle>
                    <CardDescription>{type.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Contact CTA Section */}
        <section className="text-center bg-gradient-to-r from-primary to-primary/80 rounded-lg p-8 text-primary-foreground">
          <h2 className="text-3xl font-bold mb-4">Programa de Adestramento</h2>
          <p className="text-lg mb-6 opacity-90 max-w-3xl mx-auto">
            Quer saber mais sobre o nosso Programa de Adestramento Sem Castigo? Nossa equipe 
            entrará em contato com você, provavelmente por WhatsApp.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://wa.me/551140354243?text=Olá, gostaria de saber mais sobre o programa de adestramento"
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
};
