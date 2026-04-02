import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';
import { useCompanyInfo } from '@/hooks/useCompanyInfo';

const Footer = () => {
  const { data: companyInfo } = useCompanyInfo();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">
              {companyInfo?.name || 'AstorHouse'}
            </h3>
            <p className="text-primary-foreground/80 text-sm">
              {companyInfo?.slogan || 'Criação responsável de Pastor Australiano com pedigree'}
            </p>
            {companyInfo?.mission && (
              <p className="text-primary-foreground/70 text-sm">
                {companyInfo.mission}
              </p>
            )}
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Links Rápidos</h4>
            <div className="space-y-2">
              <Link to="/sobre" className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">
                Sobre Nós
              </Link>
              <Link to="/caes" className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">
                Nossos Cães
              </Link>
              <Link to="/adestramento" className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">
                Adestramento
              </Link>
              <Link to="/eventos" className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">
                Eventos
              </Link>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Serviços</h4>
            <div className="space-y-2">
              <div className="text-primary-foreground/80 text-sm">Criação com Pedigree</div>
              <div className="text-primary-foreground/80 text-sm">Adestramento Especializado</div>
              <div className="text-primary-foreground/80 text-sm">Consultoria Comportamental</div>
              <div className="text-primary-foreground/80 text-sm">Exposições e Eventos</div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contato</h4>
            <div className="space-y-3">
              {companyInfo?.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4" />
                  <span className="text-primary-foreground/80">{companyInfo.phone}</span>
                </div>
              )}
              {companyInfo?.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4" />
                  <span className="text-primary-foreground/80">{companyInfo.email}</span>
                </div>
              )}
              {companyInfo?.address && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4" />
                  <span className="text-primary-foreground/80">{companyInfo.address}</span>
                </div>
              )}
              
              {/* Social Media */}
              <div className="flex gap-3 pt-2">
                {companyInfo?.social_media && typeof companyInfo.social_media === 'object' && (
                  <>
                    {(companyInfo.social_media as any)?.facebook && (
                      <a 
                        href={(companyInfo.social_media as any).facebook} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        aria-label="Facebook"
                      >
                        <Facebook className="h-5 w-5 text-primary-foreground/60 hover:text-primary-foreground cursor-pointer transition-colors" />
                      </a>
                    )}
                    {(companyInfo.social_media as any)?.instagram && (
                      <a 
                        href={(companyInfo.social_media as any).instagram} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        aria-label="Instagram"
                      >
                        <Instagram className="h-5 w-5 text-primary-foreground/60 hover:text-primary-foreground cursor-pointer transition-colors" />
                      </a>
                    )}
                    {(companyInfo.social_media as any)?.youtube && (
                      <a 
                        href={(companyInfo.social_media as any).youtube} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        aria-label="YouTube"
                      >
                        <Youtube className="h-5 w-5 text-primary-foreground/60 hover:text-primary-foreground cursor-pointer transition-colors" />
                      </a>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center space-y-2">
          <p className="text-primary-foreground/60 text-sm">
            © {new Date().getFullYear()} {companyInfo?.name || 'AstorHouse'}. Todos os direitos reservados.
          </p>
          <p className="text-primary-foreground/50 text-xs">
            Desenvolvido por{' '}
            <a 
              href="https://www.mibitech.com.br" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-foreground/70 hover:text-primary-foreground transition-colors underline"
            >
              Mibitech Soluções Digitais
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;