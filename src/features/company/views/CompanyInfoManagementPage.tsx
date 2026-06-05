import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useCompanyInfo, useUpdateCompanyInfo } from '../controllers/useCompanyInfo';
import type { SocialMedia } from '../models/company.types';

export function CompanyInfoManagementPage() {
  const { data: companyInfo, isLoading } = useCompanyInfo();
  const updateCompanyInfo = useUpdateCompanyInfo();

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    slogan: '',
    mission: '',
    vision: '',
    values: '',
    phone: '',
    email: '',
    address: '',
    logo_url: '',
    social_media: {
      facebook: '',
      instagram: '',
      youtube: '',
      linkedin: '',
    },
  });

  useEffect(() => {
    if (companyInfo) {
      const socialMedia =
        typeof companyInfo.social_media === 'object' && companyInfo.social_media !== null
          ? (companyInfo.social_media as Partial<SocialMedia>)
          : { facebook: '', instagram: '', youtube: '', linkedin: '' };

      setFormData({
        id: companyInfo.id || '',
        name: companyInfo.name || '',
        slogan: companyInfo.slogan || '',
        mission: companyInfo.mission || '',
        vision: companyInfo.vision || '',
        values: companyInfo.values || '',
        phone: companyInfo.phone || '',
        email: companyInfo.email || '',
        address: companyInfo.address || '',
        logo_url: companyInfo.logo_url || '',
        social_media: {
          facebook: socialMedia.facebook || '',
          instagram: socialMedia.instagram || '',
          youtube: socialMedia.youtube || '',
          linkedin: socialMedia.linkedin || '',
        },
      });
    }
  }, [companyInfo]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      social_media: {
        ...prev.social_media,
        [name]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCompanyInfo.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Informações da Empresa</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Nome da Empresa</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>

              <div>
                <Label htmlFor="slogan">Slogan</Label>
                <Input id="slogan" name="slogan" value={formData.slogan} onChange={handleInputChange} />
              </div>

              <div>
                <Label htmlFor="logo_url">URL do Logo</Label>
                <Input id="logo_url" name="logo_url" value={formData.logo_url} onChange={handleInputChange} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Missão, Visão e Valores</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="mission">Missão</Label>
                <Textarea id="mission" name="mission" value={formData.mission} onChange={handleInputChange} rows={4} />
              </div>

              <div>
                <Label htmlFor="vision">Visão</Label>
                <Textarea id="vision" name="vision" value={formData.vision} onChange={handleInputChange} rows={4} />
              </div>

              <div>
                <Label htmlFor="values">Valores</Label>
                <Textarea id="values" name="values" value={formData.values} onChange={handleInputChange} rows={4} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} />
              </div>

              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
              </div>

              <div>
                <Label htmlFor="address">Endereço</Label>
                <Textarea id="address" name="address" value={formData.address} onChange={handleInputChange} rows={3} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Redes Sociais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  name="facebook"
                  value={formData.social_media.facebook}
                  onChange={handleSocialMediaChange}
                />
              </div>

              <div>
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  name="instagram"
                  value={formData.social_media.instagram}
                  onChange={handleSocialMediaChange}
                />
              </div>

              <div>
                <Label htmlFor="youtube">YouTube</Label>
                <Input
                  id="youtube"
                  name="youtube"
                  value={formData.social_media.youtube}
                  onChange={handleSocialMediaChange}
                />
              </div>

              <div>
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  name="linkedin"
                  value={formData.social_media.linkedin}
                  onChange={handleSocialMediaChange}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={updateCompanyInfo.isPending}>
              {updateCompanyInfo.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar Alterações
            </Button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}
