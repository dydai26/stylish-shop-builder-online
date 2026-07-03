import { supabase } from "@/integrations/supabase/client";

export interface AboutSettings {
  id: string;
  key: string;
  title: string | null;
  description: string | null;
  content: any;
  images: string[] | null;
  meta_title: string | null;
  meta_description: string | null;
  updated_at: string;
}

export const getAboutContent = async (key: string): Promise<AboutSettings | null> => {
  try {
    const { data, error } = await supabase
      .from("about_settings")
      .select("*")
      .eq("key", key)
      .maybeSingle();

    if (error) {
      console.error(`Error fetching about content for key ${key}:`, error);
      return null;
    }

    if (!data) return null;

    // Parse images if it's a string, or cast if already parsed as JSON/array
    let parsedImages: string[] | null = null;
    if (data.images) {
      parsedImages = Array.isArray(data.images)
        ? (data.images as string[])
        : typeof data.images === "string"
        ? JSON.parse(data.images)
        : null;
    }

    // Parse content if it's a string
    let parsedContent = data.content;
    if (typeof data.content === "string") {
      parsedContent = JSON.parse(data.content);
    }

    return {
      id: data.id,
      key: data.key,
      title: data.title,
      description: data.description,
      images: parsedImages,
      content: parsedContent,
      meta_title: data.meta_title,
      meta_description: data.meta_description,
      updated_at: data.updated_at,
    };
  } catch (err) {
    console.error(`Unexpected error fetching about content for ${key}:`, err);
    return null;
  }
};

export const updateAboutContent = async (
  key: string,
  updateData: {
    title?: string | null;
    description?: string | null;
    images?: string[] | null;
    content?: any;
    meta_title?: string | null;
    meta_description?: string | null;
  }
): Promise<boolean> => {
  try {
    // Auto-generate meta tags if blank
    let meta_title = updateData.meta_title;
    let meta_description = updateData.meta_description;

    if (updateData.title && !meta_title) {
      meta_title = `${updateData.title} | ECOVLUU`;
    }

    if (updateData.description && !meta_description) {
      // Strip HTML if rich text was used
      const textOnly = updateData.description.replace(/<[^>]*>/g, "");
      meta_description = textOnly.slice(0, 150).trim();
      if (textOnly.length > 150) {
        meta_description += "...";
      }
    }

    const { error } = await supabase
      .from("about_settings")
      .update({
        title: updateData.title !== undefined ? updateData.title : undefined,
        description: updateData.description !== undefined ? updateData.description : undefined,
        images: updateData.images !== undefined ? (updateData.images as any) : undefined,
        content: updateData.content !== undefined ? updateData.content : undefined,
        meta_title: meta_title !== undefined ? meta_title : undefined,
        meta_description: meta_description !== undefined ? meta_description : undefined,
        updated_at: new Date().toISOString(),
      })
      .eq("key", key);

    if (error) {
      console.error(`Error updating about content for key ${key}:`, error);
      return false;
    }

    return true;
  } catch (err) {
    console.error(`Unexpected error updating about content for ${key}:`, err);
    return false;
  }
};
