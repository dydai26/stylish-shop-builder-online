import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { uploadMultipleImages, validateImageFile } from '@/lib/imageUploadService';
import { useToast } from '@/hooks/use-toast';

interface MultiImageUploadProps {
  label: string;
  value: string;
  onChange: (urls: string) => void;
  placeholder?: string;
  maxImages?: number;
}

const MultiImageUpload: React.FC<MultiImageUploadProps> = ({
  label,
  value,
  onChange,
  placeholder = "Upload additional images",
  maxImages = 10
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>(
    value ? value.split(',').map(url => url.trim()).filter(url => url.length > 0) : []
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const updateUrls = (urls: string[]) => {
    setPreviewUrls(urls);
    onChange(urls.join(', '));
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList || fileList.length === 0) return;
    
    const files: File[] = Array.from(fileList);
    if (files.length === 0) return;

    // Check total limit
    if (previewUrls.length + files.length > maxImages) {
      toast({
        title: "Too many images",
        description: `Maximum ${maxImages} images allowed. You can upload ${maxImages - previewUrls.length} more.`,
        variant: "destructive",
      });
      return;
    }

    try {
      // Validate all files
      files.forEach(file => validateImageFile(file));
      
      setIsUploading(true);

      // Create local previews
      const localUrls = files.map(file => URL.createObjectURL(file));
      const newPreviewUrls = [...previewUrls, ...localUrls];
      setPreviewUrls(newPreviewUrls);

      // Upload to Supabase
      const results = await uploadMultipleImages(files);
      const uploadedUrls = results.map(result => result.url);

      // Replace local URLs with uploaded URLs
      const finalUrls = [...previewUrls, ...uploadedUrls];
      updateUrls(finalUrls);

      // Clean up local URLs
      localUrls.forEach(url => URL.revokeObjectURL(url));

      toast({
        title: "Success",
        description: `${files.length} image${files.length > 1 ? 's' : ''} uploaded successfully!`,
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload images",
        variant: "destructive",
      });
      
      // Reset preview on error
      setPreviewUrls(value ? value.split(',').map(url => url.trim()).filter(url => url.length > 0) : []);
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    const newUrls = previewUrls.filter((_, i) => i !== index);
    updateUrls(newUrls);
  };

  return (
    <div className="space-y-3">
      <Label>
        {label}
        <span className="text-xs text-muted-foreground ml-2">
          ({previewUrls.length}/{maxImages} images)
        </span>
      </Label>
      
      {/* Preview Grid */}
      {previewUrls.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {previewUrls.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`Preview ${index + 1}`}
                className="w-full aspect-[4/5] object-cover rounded-md border"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemoveImage(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Controls */}
      <div className="flex gap-2 flex-wrap">
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading || previewUrls.length >= maxImages}
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
              Upload Images
            </>
          )}
        </Button>
        
        {previewUrls.length === 0 && (
          <div className="flex items-center text-muted-foreground">
            <ImageIcon className="h-4 w-4 mr-1" />
            <span className="text-xs">JPG, PNG, WebP, GIF (max 10MB each)</span>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

    </div>
  );
};

export default MultiImageUpload;