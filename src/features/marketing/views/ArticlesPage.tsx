import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Calendar, User, Heart, Brain, Stethoscope, Trophy } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const ArticlesPage = () => {
  const featuredArticle = {
    title: 'Como Escolher o Cão Ideal para sua Família',
    excerpt: 'Um guia completo para ajudar você a tomar a melhor decisão na escolha do seu companheiro de quatro patas.',
    author: 'Dr. Carlos Silva',
    date: '10 de Janeiro, 2024',
    readTime: '8 min',
    category: 'Guias',
    image: '/placeholder.svg'
  };

  const articles = [
    {
      title: 'Alimentação Balanceada: O Que Todo Tutor Deve Saber',
      excerpt: 'Descubra os fundamentos de uma nutrição adequada para manter seu cão saudável e feliz.',
      author: 'Dra. Ana Santos',
      date: '5 de Janeiro, 2024',
      readTime: '6 min',
      category: 'Saúde',
      icon: Stethoscope
    },
    {
      title: 'Técnicas de Adestramento Positivo',
      excerpt: 'Aprenda métodos eficazes de treinamento baseados em reforço positivo.',
      author: 'João Mendonça',
      date: '28 de Dezembro, 2023',
      readTime: '10 min',
      category: 'Adestramento',
      icon: Brain
    },
    {
      title: 'Preparando seu Cão para Competições',
      excerpt: 'Dicas essenciais para preparar seu cão para exposições e competições oficiais.',
      author: 'Maria Costa',
      date: '20 de Dezembro, 2023',
      readTime: '12 min',
      category: 'Competições',
      icon: Trophy
    },
    {
      title: 'Sinais de Estresse em Cães: Como Identificar',
      excerpt: 'Reconheça os sinais de estresse no seu cão e saiba como ajudá-lo.',
      author: 'Dr. Pedro Lima',
      date: '15 de Dezembro, 2023',
      readTime: '7 min',
      category: 'Comportamento',
      icon: Heart
    },
    {
      title: 'Cuidados com Filhotes: Primeiros Meses',
      excerpt: 'Tudo que você precisa saber sobre os cuidados essenciais com filhotes.',
      author: 'Dra. Sofia Rodrigues',
      date: '10 de Dezembro, 2023',
      readTime: '9 min',
      category: 'Filhotes',
      icon: Heart
    },
    {
      title: 'Exercícios Ideais para Cada Raça',
      excerpt: 'Entenda as necessidades específicas de exercício para diferentes raças de cães.',
      author: 'Ricardo Alves',
      date: '5 de Dezembro, 2023',
      readTime: '8 min',
      category: 'Exercícios',
      icon: Trophy
    }
  ];

  const categories = [
    'Todos',
    'Saúde',
    'Adestramento',
    'Comportamento',
    'Competições',
    'Filhotes',
    'Exercícios',
    'Guias'
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      'Saúde': 'bg-red-100 text-red-800',
      'Adestramento': 'bg-blue-100 text-blue-800',
      'Comportamento': 'bg-purple-100 text-purple-800',
      'Competições': 'bg-yellow-100 text-yellow-800',
      'Filhotes': 'bg-pink-100 text-pink-800',
      'Exercícios': 'bg-green-100 text-green-800',
      'Guias': 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-primary-light text-primary-foreground py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <Badge variant="secondary" className="mb-6 text-lg px-4 py-2">
                <BookOpen className="h-5 w-5 mr-2" />
                Conhecimento Especializado
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Artigos e Guias
              </h1>
              <p className="text-xl opacity-90 leading-relaxed">
                Conhecimento especializado sobre cães, desde cuidados básicos até técnicas 
                avançadas de adestramento e preparação para competições.
              </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">

        {/* Categories Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={category === 'Todos' ? 'default' : 'outline'}
              size="sm"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Featured Article */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Artigo em Destaque</h2>
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="md:flex">
              <div className="md:w-1/3">
                <img 
                  src={featuredArticle.image} 
                  alt={featuredArticle.title}
                  className="w-full h-48 md:h-full object-cover"
                />
              </div>
              <div className="md:w-2/3">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getCategoryColor(featuredArticle.category)}>
                      {featuredArticle.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl mb-3">{featuredArticle.title}</CardTitle>
                  <CardDescription className="text-base mb-4">
                    {featuredArticle.excerpt}
                  </CardDescription>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {featuredArticle.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {featuredArticle.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      {featuredArticle.readTime} de leitura
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button>Ler Artigo Completo</Button>
                </CardContent>
              </div>
            </div>
          </Card>
        </section>

        {/* Articles Grid */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Artigos Recentes</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, index) => {
              const IconComponent = article.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      <Badge className={getCategoryColor(article.category)}>
                        {article.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">{article.title}</CardTitle>
                    <CardDescription className="line-clamp-3">
                      {article.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {article.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {article.readTime}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                      <Calendar className="h-4 w-4" />
                      {article.date}
                    </div>
                    <Button variant="outline" className="w-full">
                      Ler Mais
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Newsletter */}
        <section className="text-center gradient-primary rounded-lg p-8 text-primary-foreground">
          <h2 className="text-3xl font-bold mb-4">Receba Novos Artigos</h2>
          <p className="text-lg mb-6 opacity-90">
            Cadastre-se para receber nossos artigos diretamente no seu e-mail
          </p>
          <div className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Seu e-mail"
              className="flex-1 px-3 py-2 border rounded-md bg-white/10 border-white/20 text-white placeholder:text-white/70"
            />
            <Button variant="secondary">Cadastrar</Button>
          </div>
        </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};
