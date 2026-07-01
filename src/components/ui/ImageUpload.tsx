import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { uploadImage, validateImageFile } from '@/lib/imageUploadService';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  onUploadSuccess?: (fileName: string) => void;
  placeholder?: string;
  required?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  value,
  onChange,
  onUploadSuccess,
  placeholder = "Upload an image",
  required = false
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(value);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      validateImageFile(file);
      setIsUploading(true);

      // Create preview
      const localUrl = URL.createObjectURL(file);
      setPreviewUrl(localUrl);

      // Upload to Supabase
      const result = await uploadImage(file);
      onChange(result.url);
      setPreviewUrl(result.url);

      if (onUploadSuccess) {
        onUploadSuccess(file.name);
      }

      // Clean up local URL
      URL.revokeObjectURL(localUrl);

      toast({
        title: "Success",
        description: "Image uploaded successfully!",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive",
      });
      
      // Reset preview on error
      setPreviewUrl(value);
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = () => {
    onChange('');
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUrlChange = (url: string) => {
    onChange(url);
    setPreviewUrl(url);
  };

  return (
    <div className="flex flex-col space-y-2">
      {/* Preview */}
      {previewUrl && (
        <div className="relative inline-block w-32">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-md border"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
            onClick={handleRemoveImage}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
      
      <Label htmlFor={`${label}-upload`} className="block font-semibold">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>

      {/* Upload Button */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex items-center gap-2"
        >
          {isUploading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Upload Image
            </>
          )}
        </Button>
        
        {!previewUrl && (
          <div className="flex items-center text-muted-foreground">
            <ImageIcon className="h-4 w-4 mr-1" />
            <span className="text-xs">JPG, PNG, WebP, GIF (max 10MB)</span>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        id={`${label}-upload`}
      />

    </div>
  );
};

export default ImageUpload;