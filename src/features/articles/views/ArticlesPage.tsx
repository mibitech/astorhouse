import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Calendar } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { usePublishedArticles } from '../controllers/useArticles';
import { articleCategories } from '../models/article.types';

const categoryLabel = (value: string) =>
  articleCategories.find((c) => c.value === value)?.label ?? value;

export const ArticlesPage = () => {
  const { data: articles = [], isLoading } = usePublishedArticles();
  const [activeCategory, setActiveCategory] = useState<string>('todos');

  const filtered =
    activeCategory === 'todos'
      ? articles
      : articles.filter((a) => a.category === activeCategory);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  return (
    <div className="min-h-screen">
      <Header />

      <main>
        <section className="bg-gradient-to-r from-primary to-primary-light text-primary-foreground py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <Badge variant="secondary" className="mb-6 text-lg px-4 py-2">
                <BookOpen className="h-5 w-5 mr-2" />
                Conhecimento Especializado
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Artigos e Guias</h1>
              <p className="text-xl opacity-90 leading-relaxed">
                Conhecimento especializado sobre cães, desde cuidados básicos até técnicas
                avançadas de adestramento e preparação para competições.
              </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            <Button
              variant={activeCategory === 'todos' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory('todos')}
            >
              Todos
            </Button>
            {articleCategories.map((cat) => (
              <Button
                key={cat.value}
                variant={activeCategory === cat.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveCategory(cat.value)}
              >
                {cat.label}
              </Button>
            ))}
          </div>

          {isLoading ? (
            <p className="text-center text-muted-foreground py-16">Carregando artigos…</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-16">
              Nenhum artigo publicado nesta categoria.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {filtered.map((article) => (
                <Card key={article.id} className="hover:shadow-lg transition-shadow flex flex-col">
                  {article.image_url && (
                    <img
                      src={article.image_url}
                      alt={article.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  )}
                  <CardHeader className="flex-1">
                    {article.category && (
                      <Badge variant="secondary" className="w-fit mb-2">
                        {categoryLabel(article.category)}
                      </Badge>
                    )}
                    <CardTitle className="text-lg line-clamp-2">{article.title}</CardTitle>
                    {article.excerpt && (
                      <CardDescription className="line-clamp-3">{article.excerpt}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                      <Calendar className="h-4 w-4" />
                      {formatDate(article.created_at)}
                    </div>
                    {article.tags && article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {article.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};
