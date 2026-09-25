import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle, Search, Loader2 } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useFaq } from '../controllers/useFaq';
import { publicFaqCategories } from '../models/faq.types';

export function FaqPage() {
  const { faqs, isLoading } = useFaq();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const getCategoryLabel = (category: string) => {
    const cat = publicFaqCategories.find((c) => c.value === category);
    return cat ? cat.label : category;
  };

  // Apenas FAQs publicadas
  const publishedFAQs = faqs.filter((faq) => faq.is_published);

  const filteredFAQs = publishedFAQs
    .filter((faq) => {
      const matchesSearch =
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || faq.category === filterCategory;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => a.order_index - b.order_index);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mr-3" />
            <span className="text-lg">Carregando perguntas frequentes...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <HelpCircle className="h-12 w-12 text-primary" />
            <div>
              <h1 className="text-4xl md:text-5xl font-bold">Perguntas Frequentes</h1>
              <p className="text-xl text-muted-foreground mt-2">
                Encontre respostas para as principais dúvidas sobre nossos cães e serviços
              </p>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <Card className="rounded-2xl mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Buscar e Filtrar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="search">Buscar por pergunta ou resposta</Label>
                <Input
                  id="search"
                  placeholder="Digite para buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="category-filter">Categoria</Label>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger id="category-filter">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {publicFaqCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Content */}
        {filteredFAQs.length === 0 ? (
          <Card className="rounded-2xl">
            <CardContent className="text-center py-12">
              <HelpCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nenhuma pergunta encontrada</h3>
              <p className="text-muted-foreground">
                {searchTerm || filterCategory !== 'all'
                  ? 'Tente ajustar os filtros ou termo de busca.'
                  : 'Ainda não há perguntas frequentes publicadas.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Perguntas e Respostas ({filteredFAQs.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {filteredFAQs.map((faq, index) => (
                  <AccordionItem key={faq.id} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      <div className="flex items-start gap-3 w-full">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{faq.question}</h3>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                              {getCategoryLabel(faq.category)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pt-4 border-t">
                        <div className="prose max-w-none">
                          <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>

                        {/* Fonte, quando disponível */}
                        {faq.source && (
                          <div className="mt-4 pt-4 border-t border-border/50">
                            <p className="text-sm text-muted-foreground">
                              <strong>Fonte:</strong> {faq.source}
                            </p>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
}
