import { supabase } from "@/integrations/supabase/client";

export interface UploadResult {
  url: string;
  path: string;
}

// Compress image before upload
export const compressImage = async (
  file: File,
  maxWidth: number = 1200,
  quality: number = 0.8,
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Resize if larger than maxWidth
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP with specified quality
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Canvas toBlob failed"));
            }
          },
          "image/webp",
          quality,
        );
      };
      img.onerror = () =>
        reject(new Error("Failed to load image for compression"));
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
  });
};

// Upload a single image to Supabase storage with compression
export const uploadImage = async (
  file: File,
  folder: string = "products",
): Promise<UploadResult> => {
  // Compress image
  const compressedBlob = await compressImage(file);
  const compressedFile = new File(
    [compressedBlob],
    `${file.name.split(".")[0]}.webp`,
    {
      type: "image/webp",
    },
  );

  // Generate unique filename
  const fileName = `${folder}/${Date.now()}-${
    Math.random().toString(36).substring(7)
  }.webp`;

  const { data, error } = await supabase.storage
    .from("product-images")
    .upload(fileName, compressedFile, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Error uploading image:", error);
    throw error;
  }

  // Get public URL
  const { data: publicUrlData } = supabase.storage
    .from("product-images")
    .getPublicUrl(data.path);

  return {
    url: publicUrlData.publicUrl,
    path: data.path,
  };
};

// Upload multiple images
export const uploadMultipleImages = async (
  files: File[],
  folder: string = "products",
): Promise<UploadResult[]> => {
  const uploadPromises = files.map((file) => uploadImage(file, folder));
  return Promise.all(uploadPromises);
};

// Delete an image from storage
export const deleteImage = async (path: string): Promise<void> => {
  const { error } = await supabase.storage
    .from("product-images")
    .remove([path]);

  if (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
};

// Replace image and delete old one
export const replaceImage = async (
  file: File,
  oldUrl?: string,
  folder: string = "products",
): Promise<UploadResult> => {
  // Upload new image first
  const result = await uploadImage(file, folder);

  // If there's an old image and it's from our storage, delete it
  if (oldUrl && oldUrl.includes("supabase")) {
    const oldPath = extractPathFromUrl(oldUrl);
    if (oldPath) {
      try {
        await deleteImage(oldPath);
      } catch (error) {
        console.warn("Failed to delete old image:", error);
        // Continue even if deletion fails
      }
    }
  }

  return result;
};

// Validate image file
export const validateImageFile = (file: File): boolean => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/bmp",
    "image/tiff",
  ];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!allowedTypes.includes(file.type)) {
    throw new Error(
      "Invalid file type. Please upload an image file (JPEG, PNG, WebP, GIF, BMP, TIFF).",
    );
  }

  if (file.size > maxSize) {
    throw new Error(
      "File size too large. Please upload an image smaller than 10MB.",
    );
  }

  return true;
};

// Extract path from Supabase storage URL
export const extractPathFromUrl = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    const pathMatch = urlObj.pathname.match(
      /\/storage\/v1\/object\/public\/product-images\/(.+)$/,
    );
    return pathMatch ? pathMatch[1] : null;
  } catch {
    return null;
  }
};
