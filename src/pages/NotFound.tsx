import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    document.title = "Página não encontrada — AstorHouse";
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center">
        <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h1 className="text-6xl font-bold text-foreground mb-2">404</h1>
        <p className="text-xl text-muted-foreground mb-2">Página não encontrada</p>
        <p className="text-sm text-muted-foreground mb-8">
          O endereço <code className="bg-muted px-1 rounded">{location.pathname}</code> não existe.
        </p>
        <Button asChild>
          <Link to="/">
            <Home className="h-4 w-4 mr-2" />
            Voltar à página inicial
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
