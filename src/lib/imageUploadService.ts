import { supabase } from "@/integrations/supabase/client";

export interface UploadResult {
  url: string;
  path: string;
}

// Upload a single image to Supabase storage
export const uploadImage = async (file: File, folder: string = 'products'): Promise<UploadResult> => {
  // Generate unique filename
  const fileExt = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Error uploading image:', error);
    throw error;
  }

  // Get public URL
  const { data: publicUrlData } = supabase.storage
    .from('product-images')
    .getPublicUrl(data.path);

  return {
    url: publicUrlData.publicUrl,
    path: data.path
  };
};

// Upload multiple images
export const uploadMultipleImages = async (files: File[], folder: string = 'products'): Promise<UploadResult[]> => {
  const uploadPromises = files.map(file => uploadImage(file, folder));
  return Promise.all(uploadPromises);
};

// Delete an image from storage
export const deleteImage = async (path: string): Promise<void> => {
  const { error } = await supabase.storage
    .from('product-images')
    .remove([path]);

  if (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

// Replace image and delete old one
export const replaceImage = async (file: File, oldUrl?: string, folder: string = 'products'): Promise<UploadResult> => {
  // Upload new image first
  const result = await uploadImage(file, folder);
  
  // If there's an old image and it's from our storage, delete it
  if (oldUrl && oldUrl.includes('supabase')) {
    const oldPath = extractPathFromUrl(oldUrl);
    if (oldPath) {
      try {
        await deleteImage(oldPath);
      } catch (error) {
        console.warn('Failed to delete old image:', error);
        // Continue even if deletion fails
      }
    }
  }
  
  return result;
};

// Validate image file
export const validateImageFile = (file: File): boolean => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/bmp', 'image/tiff'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please upload an image file (JPEG, PNG, WebP, GIF, BMP, TIFF).');
  }

  if (file.size > maxSize) {
    throw new Error('File size too large. Please upload an image smaller than 10MB.');
  }

  return true;
};

// Extract path from Supabase storage URL
export const extractPathFromUrl = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    const pathMatch = urlObj.pathname.match(/\/storage\/v1\/object\/public\/product-images\/(.+)$/);
    return pathMatch ? pathMatch[1] : null;
  } catch {
    return null;
  }
};