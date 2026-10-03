import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { compressImageForUpload } from '@/lib/image-compress';

interface UseImageUploadReturn {
  uploading: boolean;
  uploadImage: (file: File, bucket: 'dog-images' | 'puppy-images', folder?: string) => Promise<string | null>;
  deleteImage: (bucket: 'dog-images' | 'puppy-images', path: string) => Promise<boolean>;
  getPublicUrl: (bucket: 'dog-images' | 'puppy-images', path: string) => string;
}

export const useImageUpload = (): UseImageUploadReturn => {
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (
    file: File,
    bucket: 'dog-images' | 'puppy-images',
    folder?: string
  ): Promise<string | null> => {
    try {
      setUploading(true);

      // Ajusta a foto ao padrão de envio do WhatsApp antes de subir: acima de
      // 5 MB a foto não chega ao cliente (a 1ª foto do Filhote 3 tinha 7,7 MB).
      // Nunca recusa — reduz dimensão e, se preciso, qualidade.
      file = await compressImageForUpload(file);
      // A redução pode falhar no aparelho (01/10/2026: fotos de 7-8 MB subiram
      // assim, em silêncio). A foto sobe mesmo assim, mas quem cadastra fica
      // sabendo — o atendimento tenta reduzir no envio, sem garantia.
      if (file.type.startsWith('image/') && file.size > 5 * 1024 * 1024) {
        toast.warning(
          `"${file.name}" ficou com ${(file.size / 1048576).toFixed(1)} MB e pode não chegar pelo WhatsApp. ` +
            'Se puder, envie uma versão menor (ou cadastre pelo computador).',
        );
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = folder ? `${folder}/${fileName}` : fileName;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        // Mostra o motivo real (ex.: sessão expirada / sem permissão / bucket
        // indisponível) em vez de um "erro ao enviar" genérico — sem isso o
        // operador não sabe se precisa logar de novo ou tentar outra foto.
        toast.error(`Erro ao enviar "${file.name}": ${uploadError.message}`);
        return null;
      }

      // Get public URL
      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Unexpected error:', error);
      const message = error instanceof Error ? error.message : 'erro desconhecido';
      toast.error(`Erro inesperado ao enviar "${file.name}": ${message}`);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (
    bucket: 'dog-images' | 'puppy-images',
    path: string
  ): Promise<boolean> => {
    try {
      let filePath = path;

      if (path.includes('storage/v1/object/public/')) {
        const parts = path.split(`${bucket}/`);
        if (parts.length > 1) {
          filePath = parts[1];
        }
      }

      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath]);

      if (error) {
        console.error('Error deleting image:', error);
        toast.error('Erro ao deletar imagem: ' + error.message);
        return false;
      }

      toast.success('Imagem deletada com sucesso!');
      return true;
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('Erro inesperado ao deletar imagem');
      return false;
    }
  };

  const getPublicUrl = (bucket: 'dog-images' | 'puppy-images', path: string): string => {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    
    return data.publicUrl;
  };

  return {
    uploading,
    uploadImage,
    deleteImage,
    getPublicUrl,
  };
};