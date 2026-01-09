import { supabase } from "@/integrations/supabase/client";

export interface Banner {
  id: string;
  title: string;
  description?: string;
  image: string;
  link?: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface CreateBannerData {
  title: string;
  description?: string;
  image: string;
  link?: string;
  is_active?: boolean;
  display_order?: number;
}

export interface UpdateBannerData {
  title?: string;
  description?: string;
  image?: string;
  link?: string;
  is_active?: boolean;
  display_order?: number;
}

// Get all banners (admin only)
export const getAllBanners = async (): Promise<Banner[]> => {
  const { data, error } = await supabase
    .from('banners')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching banners:', error);
    throw error;
  }

  return data || [];
};

// Get active banners (public)
export const getActiveBanners = async (): Promise<Banner[]> => {
  const { data, error } = await supabase
    .from('banners')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching active banners:', error);
    throw error;
  }

  return data || [];
};

// Get banner by ID
export const getBannerById = async (id: string): Promise<Banner | null> => {
  const { data, error } = await supabase
    .from('banners')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching banner:', error);
    throw error;
  }

  return data;
};

// Create new banner
export const createBanner = async (bannerData: CreateBannerData): Promise<Banner> => {
  const { data, error } = await supabase
    .from('banners')
    .insert([bannerData])
    .select()
    .single();

  if (error) {
    console.error('Error creating banner:', error);
    throw error;
  }

  return data;
};

// Update banner
export const updateBanner = async (id: string, bannerData: UpdateBannerData): Promise<Banner> => {
  const { data, error } = await supabase
    .from('banners')
    .update(bannerData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating banner:', error);
    throw error;
  }

  return data;
};

// Get banner by location (for displaying on pages)
export const getBannerByLocation = async (location: string): Promise<Banner | null> => {
  const { data, error } = await supabase
    .from('banners')
    .select('*')
    .eq('link', location)
    .eq('is_active', true)
    .maybeSingle();

  if (error) {
    console.error('Error fetching banner by location:', error);
    throw error;
  }

  return data;
};

// Delete banner
export const deleteBanner = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('banners')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting banner:', error);
    throw error;
  }
};

// Update banner order
export const updateBannerOrder = async (banners: { id: string; display_order: number }[]): Promise<void> => {
  const promises = banners.map(({ id, display_order }) =>
    supabase
      .from('banners')
      .update({ display_order })
      .eq('id', id)
  );

  const results = await Promise.all(promises);
  
  for (const result of results) {
    if (result.error) {
      console.error('Error updating banner order:', result.error);
      throw result.error;
    }
  }
};