import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { useCompanyInfo } from '@/features/company';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// Página institucional de contato (informativa). O formulário de envio do
// protótipo Lovable não era renderizado (código morto) e foi removido na migração;
// quando houver formulário real, usar um `createContact` no contact.service.
export function ContactPage() {
  const { data: companyInfo } = useCompanyInfo();

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-light text-primary-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Entre em Contato</h1>
            <p className="text-xl opacity-90 leading-relaxed">
              Estamos aqui para ajudar você a encontrar o companheiro perfeito ou esclarecer suas dúvidas
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Informações de Contato</CardTitle>
                  <CardDescription>Entre em contato através dos canais abaixo</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {companyInfo?.phone && (
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Phone className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Telefone</h3>
                        <p className="text-muted-foreground">{companyInfo.phone}</p>
                      </div>
                    </div>
                  )}

                  {companyInfo?.email && (
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Mail className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">E-mail</h3>
                        <p className="text-muted-foreground">{companyInfo.email}</p>
                      </div>
                    </div>
                  )}

                  {companyInfo?.address && (
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Endereço</h3>
                        <p className="text-muted-foreground">{companyInfo.address}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Horário de Atendimento</h3>
                      <p className="text-muted-foreground">
                        Segunda a Sexta: 8h às 18h
                        <br />
                        Sábado: 8h às 12h
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Dicas Importantes</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Responderemos em até 24 horas</li>
                    <li>• Para emergências, ligue diretamente</li>
                    <li>• Visitas são agendadas previamente</li>
                    <li>• Consultas presenciais disponíveis</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
