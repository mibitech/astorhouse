import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useImageUpload } from '@/hooks/useImageUpload';

interface ImageUploaderProps {
  currentImages?: string[];
  onImagesChange: (images: string[]) => void;
  bucket: 'dog-images' | 'puppy-images';
  maxImages?: number;
  folder?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentImages = [],
  onImagesChange,
  bucket,
  maxImages = 5,
  folder
}) => {
  const { uploading, uploadImage, deleteImage } = useImageUpload();
  const [dragOver, setDragOver] = useState(false);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    console.log('Fazendo upload de imagens:', files.length);
    console.log('Imagens atuais antes do upload:', currentImages);

    const remainingSlots = maxImages - currentImages.length;
    const filesToUpload = Array.from(files).slice(0, remainingSlots);

    const uploadPromises = filesToUpload.map(file => uploadImage(file, bucket, folder));
    const uploadedUrls = await Promise.all(uploadPromises);
    
    const newImages = uploadedUrls.filter(url => url !== null) as string[];
    const finalImages = [...currentImages, ...newImages];
    
    console.log('URLs das imagens uploadadas:', newImages);
    console.log('Lista final de imagens:', finalImages);
    
    onImagesChange(finalImages);
  };

  const handleRemoveImage = async (imageUrl: string) => {
    console.log('Removendo imagem:', imageUrl);
    console.log('Imagens atuais:', currentImages);
    
    // Always remove from local list first
    const newImages = currentImages.filter(url => url !== imageUrl);
    console.log('Novas imagens após remoção:', newImages);
    onImagesChange(newImages);
    
    // Try to delete from storage only if it's a Supabase Storage URL
    if (imageUrl.includes('storage/v1/object/public/')) {
      await deleteImage(bucket, imageUrl);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const canUploadMore = currentImages.length < maxImages;

  return (
    <Card className="rounded-xl">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Imagens ({currentImages.length}/{maxImages})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        {canUploadMore && (
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragOver
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-primary/50'
            } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Enviando imagens...</p>
              </div>
            ) : (
              <>
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  Arraste e solte imagens aqui ou clique para selecionar
                </p>
                <Label htmlFor="image-upload">
                  <Button variant="outline" className="cursor-pointer" asChild>
                    <span>Selecionar Imagens</span>
                  </Button>
                </Label>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFileUpload(e.target.files)}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  PNG, JPG, JPEG até 10MB • Máximo {maxImages - currentImages.length} imagens
                </p>
              </>
            )}
          </div>
        )}

        {/* Current Images */}
        {currentImages.length > 0 && (
          <div>
            <Label className="text-sm font-medium mb-2 block">Imagens atuais:</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {currentImages.map((imageUrl, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                    <img
                      src={imageUrl}
                      alt={`Imagem ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                    onClick={() => handleRemoveImage(imageUrl)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  {index === 0 && (
                    <Badge className="absolute bottom-2 left-2 text-xs">
                      Principal
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {currentImages.length === 0 && (
          <div className="text-center py-4">
            <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Nenhuma imagem adicionada</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageUploader;