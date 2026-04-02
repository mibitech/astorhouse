import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
        toast.error('Erro ao fazer upload da imagem');
        return null;
      }

      // Get public URL
      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      toast.success('Imagem enviada com sucesso!');
      return data.publicUrl;
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('Erro inesperado ao fazer upload');
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
      console.log('Tentando deletar imagem:', path);
      
      // Extract path from URL if necessary
      let filePath = path;
      
      if (path.includes('storage/v1/object/public/')) {
        const parts = path.split(`${bucket}/`);
        if (parts.length > 1) {
          filePath = parts[1];
        }
      }
      
      console.log('Caminho do arquivo para deletar:', filePath);

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