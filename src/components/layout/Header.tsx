import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Phone, Mail, LogOut, ChevronDown, User, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCompanyInfo } from '@/hooks/useCompanyInfo';
import { useAuth } from '@/contexts/AuthContext';
import { useFaq } from '@/features/faq';
import logoImage from '@/assets/logo-astor-house-site.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [draftCount, setDraftCount] = useState(0);
  const { data: companyInfo } = useCompanyInfo();
  const { user, signOut } = useAuth();
  const { getDraftCount } = useFaq();
  const navigate = useNavigate();

  const navigationItems = [
    { label: 'Início', href: '/' },
    { label: 'Sobre', href: '/sobre' },
    { label: 'Nossos Cães', href: '/caes' },
    { label: 'Filhotes', href: '/filhotes' },
    { label: 'Hotel', href: '/hotel' },
    { label: 'Adestramento', href: '/adestramento' },
    { label: 'Contato', href: '/contato' },
  ];

  const handleSignOut = async () => {
    await signOut();
    setIsMenuOpen(false);
    navigate('/');
  };

  useEffect(() => {
    if (user) {
      const fetchDraftCount = async () => {
        const count = await getDraftCount();
        setDraftCount(count);
      };
      fetchDraftCount();
    }
  }, [user, getDraftCount]);

  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b">
      {/* Main navigation */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" onClick={() => window.scrollTo(0, 0)} className="flex items-center">
            <img 
              src={logoImage} 
              alt="AstorHouse Logo" 
              className="w-auto object-contain"
              style={{ height: 'calc(4rem * 0.855)' }}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => window.scrollTo(0, 0)}
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                {item.label}
              </Link>
            ))}
            
            {!user ? (
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Entrar
                </Button>
              </Link>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    Área Restrita
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>Cadastros</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem asChild>
                    <Link to="/admin/caes" className="w-full">
                      Nossos Cães
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild>
                    <Link to="/admin/filhotes" className="w-full">
                      Filhotes
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild>
                    <Link to="/admin/hotel" className="w-full">
                      Hotel
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild>
                    <Link to="/admin/empresa" className="w-full">
                      Contatos
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild>
                    <Link to="/admin/faq" className="w-full flex items-center justify-between">
                      <span>Perguntas & Respostas</span>
                      {draftCount > 0 && (
                        <div className="flex items-center gap-1">
                          <Bell className="h-3 w-3 text-orange-500" />
                          <span className="text-xs bg-orange-500 text-white px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                            {draftCount}
                          </span>
                        </div>
                      )}
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              {!user ? (
                <>
                  {navigationItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="text-foreground hover:text-primary transition-colors font-medium"
                      onClick={() => {
                        setIsMenuOpen(false);
                        window.scrollTo(0, 0);
                      }}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" size="sm">
                      Entrar
                    </Button>
                  </Link>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="text-sm font-semibold text-muted-foreground">
                    CADASTROS
                  </div>
                  
                  <Link
                    to="/admin/caes"
                    className="block text-foreground hover:text-primary transition-colors"
                    onClick={() => {
                      setIsMenuOpen(false);
                      window.scrollTo(0, 0);
                    }}
                  >
                    Nossos Cães
                  </Link>
                  
                  <Link
                    to="/admin/filhotes"
                    className="block text-foreground hover:text-primary transition-colors"
                    onClick={() => {
                      setIsMenuOpen(false);
                      window.scrollTo(0, 0);
                    }}
                  >
                    Filhotes
                  </Link>
                  
                  <Link
                    to="/admin/hotel"
                    className="block text-foreground hover:text-primary transition-colors"
                    onClick={() => {
                      setIsMenuOpen(false);
                      window.scrollTo(0, 0);
                    }}
                  >
                    Hotel
                  </Link>
                  
                  <Link
                    to="/admin/empresa"
                    className="block text-foreground hover:text-primary transition-colors"
                    onClick={() => {
                      setIsMenuOpen(false);
                      window.scrollTo(0, 0);
                    }}
                  >
                    Contatos
                  </Link>
                  
                  <Link
                    to="/admin/faq"
                    className="flex items-center justify-between text-foreground hover:text-primary transition-colors"
                    onClick={() => {
                      setIsMenuOpen(false);
                      window.scrollTo(0, 0);
                    }}
                  >
                    <span>Perguntas & Respostas</span>
                    {draftCount > 0 && (
                      <div className="flex items-center gap-1">
                        <Bell className="h-3 w-3 text-orange-500" />
                        <span className="text-xs bg-orange-500 text-white px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                          {draftCount}
                        </span>
                      </div>
                    )}
                  </Link>

                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleSignOut}
                    className="flex items-center gap-2 w-fit"
                  >
                    <LogOut className="h-4 w-4" />
                    Sair
                  </Button>
                </div>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;