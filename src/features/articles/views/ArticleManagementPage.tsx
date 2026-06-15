import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Pencil, Trash2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Header from '@/components/layout/Header';
import { articleSchema, articleCategories, type Article, type ArticleFormData } from '../models/article.types';
import { useAllArticles, useCreateArticle, useUpdateArticle, useDeleteArticle } from '../controllers/useArticles';

const categoryLabel = (value: string) =>
  articleCategories.find((c) => c.value === value)?.label ?? value;

export const ArticleManagementPage = () => {
  const { data: articles = [], isLoading } = useAllArticles();
  const createArticle = useCreateArticle();
  const updateArticle = useUpdateArticle();
  const deleteArticle = useDeleteArticle();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  const form = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: '',
      content: '',
      excerpt: '',
      category: null,
      image_url: null,
      is_published: false,
      tags: [],
    },
  });

  const openCreate = () => {
    setEditingArticle(null);
    form.reset({
      title: '',
      content: '',
      excerpt: '',
      category: null,
      image_url: null,
      is_published: false,
      tags: [],
    });
    setIsDialogOpen(true);
  };

  const openEdit = (article: Article) => {
    setEditingArticle(article);
    form.reset({
      title: article.title,
      content: article.content,
      excerpt: article.excerpt ?? '',
      category: article.category,
      image_url: article.image_url,
      is_published: article.is_published ?? false,
      tags: article.tags ?? [],
    });
    setIsDialogOpen(true);
  };

  const onSubmit = async (data: ArticleFormData) => {
    try {
      if (editingArticle) {
        await updateArticle.mutateAsync({ id: editingArticle.id, ...data });
      } else {
        await createArticle.mutateAsync(data);
      }
      setIsDialogOpen(false);
      setEditingArticle(null);
      form.reset();
    } catch {
      // erro tratado pelo controller (toast)
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este artigo?')) {
      deleteArticle.mutate(id);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Artigos</h1>
              <p className="text-muted-foreground">
                {articles.length} artigo{articles.length !== 1 ? 's' : ''} cadastrado{articles.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Artigo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingArticle ? 'Editar Artigo' : 'Novo Artigo'}</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título</FormLabel>
                        <FormControl>
                          <Input placeholder="Título do artigo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="excerpt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Resumo</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Breve descrição do artigo"
                            rows={2}
                            {...field}
                            value={field.value ?? ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Conteúdo</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Conteúdo completo do artigo"
                            rows={8}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Categoria</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value ?? ''}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {articleCategories.map((cat) => (
                                <SelectItem key={cat.value} value={cat.value}>
                                  {cat.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="image_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL da Imagem</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://..."
                              {...field}
                              value={field.value ?? ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="is_published"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-3">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="!mt-0">Publicado</FormLabel>
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      disabled={createArticle.isPending || updateArticle.isPending}
                    >
                      {editingArticle ? 'Atualizar' : 'Cadastrar'}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <p className="text-center text-muted-foreground py-16">Carregando artigos…</p>
        ) : articles.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center text-muted-foreground">
              Nenhum artigo cadastrado. Clique em "Novo Artigo" para começar.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {articles.map((article) => (
              <Card key={article.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-base line-clamp-1">{article.title}</CardTitle>
                        {article.is_published ? (
                          <Badge variant="default" className="shrink-0">Publicado</Badge>
                        ) : (
                          <Badge variant="secondary" className="shrink-0">Rascunho</Badge>
                        )}
                        {article.category && (
                          <Badge variant="outline" className="shrink-0">
                            {categoryLabel(article.category)}
                          </Badge>
                        )}
                      </div>
                      {article.excerpt && (
                        <p className="text-sm text-muted-foreground line-clamp-2">{article.excerpt}</p>
                      )}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEdit(article)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(article.id)}
                        disabled={deleteArticle.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {article.tags && article.tags.length > 0 && (
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-1">
                      {article.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
