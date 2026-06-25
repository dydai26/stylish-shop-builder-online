import { supabase } from "@/integrations/supabase/client";

export interface UploadResult {
  url: string;
  path: string;
}

export const uploadVideo = async (
  file: File,
  folder: string = "videos",
): Promise<UploadResult> => {
  const fileName = `${folder}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

  const { data, error } = await supabase.storage
    .from("product-images")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Error uploading video:", error);
    throw error;
  }

  const { data: publicUrlData } = supabase.storage
    .from("product-images")
    .getPublicUrl(data.path);

  return {
    url: publicUrlData.publicUrl,
    path: data.path,
  };
};

export const validateVideoFile = (file: File): boolean => {
  const allowedTypes = [
    "video/mp4",
    "video/webm",
    "video/quicktime", // MOV
  ];
  const maxSize = 100 * 1024 * 1024; // 100MB limit for video

  if (!allowedTypes.includes(file.type)) {
    throw new Error(
      "Invalid file type. Please upload an MP4, WebM, or MOV video.",
    );
  }

  if (file.size > maxSize) {
    throw new Error(
      "File size too large. Please upload a video smaller than 100MB.",
    );
  }

  return true;
};
