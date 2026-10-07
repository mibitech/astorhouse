import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Chat do site ligado ao atendimento da suíte Nexus (Aurora): as conversas
// caem no mesmo inbox do WhatsApp e são respondidas pelo mesmo Atendente.
const WORKSPACE_ID = "22e20e80-3c3f-4c93-bdc2-14f1813a7811";
const API_URL = "https://supa.mibiutil.com.br";
const SCRIPT_SRC = "https://aurora.mibiutil.com.br/webchat.js";
const ROOT_ID = "aurora-webchat-root";

declare global {
  interface Window {
    AuroraChat?: { workspaceId: string; apiUrl: string };
  }
}

// Painel do canil não é lugar de atendimento ao cliente.
function isPrivateRoute(pathname: string): boolean {
  return pathname === "/login" || pathname.startsWith("/admin");
}

export function WebChat() {
  const { pathname } = useLocation();
  const hidden = isPrivateRoute(pathname);

  useEffect(() => {
    if (hidden || document.querySelector(`script[src="${SCRIPT_SRC}"]`)) return;
    window.AuroraChat = { workspaceId: WORKSPACE_ID, apiUrl: API_URL };
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    document.body.appendChild(script);
  }, [hidden]);

  // O widget não sai da página depois de carregado (SPA); só é escondido
  // quando a navegação entra no painel.
  useEffect(() => {
    const root = document.getElementById(ROOT_ID);
    if (root) root.style.display = hidden ? "none" : "";
  }, [hidden]);

  return null;
}
