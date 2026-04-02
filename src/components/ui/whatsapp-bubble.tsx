import React from 'react';
import { MessageCircle } from 'lucide-react';

interface WhatsAppBubbleProps {
  phoneNumber: string;
  message?: string;
}

export const WhatsAppBubble: React.FC<WhatsAppBubbleProps> = ({ 
  phoneNumber, 
  message = "Olá, gostaria de mais informações" 
}) => {
  const formattedPhone = phoneNumber.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(message);
  const href = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        // Tenta abrir em nova aba; se bloqueado, navega na mesma aba do iframe
        const win = window.open(href, '_blank', 'noopener,noreferrer');
        if (!win) {
          e.preventDefault();
          window.location.href = href;
        }
      }}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-smooth hover:scale-110 btn-whatsapp"
      aria-label="Contato via WhatsApp"
      title="Fale conosco no WhatsApp"
      role="link"
    >
      <MessageCircle className="w-7 h-7" />
    </a>
  );
};
