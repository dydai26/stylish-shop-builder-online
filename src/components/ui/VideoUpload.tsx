import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { X, Upload, Video as VideoIcon } from 'lucide-react';
import { uploadVideo, validateVideoFile } from '@/lib/videoUploadService';
import { useToast } from '@/hooks/use-toast';

interface VideoUploadProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  required?: boolean;
}

const VideoUpload: React.FC<VideoUploadProps> = ({
  label,
  value,
  onChange,
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
      validateVideoFile(file);
      setIsUploading(true);

      // Create preview
      const localUrl = URL.createObjectURL(file);
      setPreviewUrl(localUrl);

      // Upload to Supabase
      const result = await uploadVideo(file);
      onChange(result.url);
      setPreviewUrl(result.url);

      // Clean up local URL
      URL.revokeObjectURL(localUrl);

      toast({
        title: "Success",
        description: "Video uploaded successfully!",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload video",
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

  const handleRemoveVideo = () => {
    onChange('');
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      {/* Preview */}
      {previewUrl && (
        <div className="relative inline-block w-full max-w-sm">
          <video
            src={previewUrl}
            controls
            className="w-full h-auto max-h-48 rounded-md border bg-black"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 z-10"
            onClick={handleRemoveVideo}
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
              Upload Video
            </>
          )}
        </Button>
        
        {!previewUrl && (
          <div className="flex items-center text-muted-foreground">
            <VideoIcon className="h-4 w-4 mr-1" />
            <span className="text-xs">MP4, WebM, MOV (max 100MB)</span>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime"
        onChange={handleFileSelect}
        className="hidden"
        id={`${label}-upload`}
      />

    </div>
  );
};

export default VideoUpload;
