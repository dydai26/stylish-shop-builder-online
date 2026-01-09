import { supabase } from "@/integrations/supabase/client";

export interface PromoCode {
  id: string;
  code: string;
  discount_percentage: number;
  is_active: boolean;
  usage_count: number;
  max_usage_count?: number;
  created_at: string;
  updated_at: string;
}

export interface CreatePromoCodeData {
  code: string;
  discount_percentage: number;
  is_active?: boolean;
  max_usage_count?: number;
}

export interface UpdatePromoCodeData {
  code?: string;
  discount_percentage?: number;
  is_active?: boolean;
  max_usage_count?: number;
}

// Get all promo codes (admin only)
export const getAllPromoCodes = async (): Promise<PromoCode[]> => {
  const { data, error } = await supabase
    .from('promo_codes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching promo codes:', error);
    throw error;
  }

  return data || [];
};

// Get promo code by code (for validation)
export const getPromoCodeByCode = async (code: string): Promise<PromoCode | null> => {
  const { data, error } = await supabase
    .from('promo_codes')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('is_active', true)
    .maybeSingle();

  if (error) {
    console.error('Error fetching promo code:', error);
    throw error;
  }

  return data;
};

// Validate promo code and return discount
export const validatePromoCode = async (code: string): Promise<{ valid: boolean; discount?: number; message?: string }> => {
  try {
    const promoCode = await getPromoCodeByCode(code);
    
    if (!promoCode) {
      return { valid: false, message: "Promo code not found" };
    }

    if (!promoCode.is_active) {
      return { valid: false, message: "Promo code is inactive" };
    }

    if (promoCode.max_usage_count && promoCode.usage_count >= promoCode.max_usage_count) {
      return { valid: false, message: "Promo code usage limit reached" };
    }

    return { 
      valid: true, 
      discount: promoCode.discount_percentage,
      message: `${promoCode.discount_percentage}% discount applied!`
    };
  } catch (error) {
    console.error('Error validating promo code:', error);
    return { valid: false, message: "Error validating promo code" };
  }
};

// Create new promo code
export const createPromoCode = async (promoCodeData: CreatePromoCodeData): Promise<PromoCode> => {
  const { data, error } = await supabase
    .from('promo_codes')
    .insert([{
      ...promoCodeData,
      code: promoCodeData.code.toUpperCase() // Always store codes in uppercase
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating promo code:', error);
    throw error;
  }

  return data;
};

// Update promo code
export const updatePromoCode = async (id: string, promoCodeData: UpdatePromoCodeData): Promise<PromoCode> => {
  const updateData = { ...promoCodeData };
  if (updateData.code) {
    updateData.code = updateData.code.toUpperCase();
  }

  const { data, error } = await supabase
    .from('promo_codes')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating promo code:', error);
    throw error;
  }

  return data;
};

// Delete promo code
export const deletePromoCode = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('promo_codes')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting promo code:', error);
    throw error;
  }
};

// Increment usage count when promo code is used
export const usePromoCode = async (code: string): Promise<void> => {
  // First get the current promo code
  const promoCode = await getPromoCodeByCode(code);
  if (!promoCode) {
    throw new Error('Promo code not found');
  }

  // Increment the usage count
  const { error } = await supabase
    .from('promo_codes')
    .update({ usage_count: promoCode.usage_count + 1 })
    .eq('code', code.toUpperCase())
    .eq('is_active', true);

  if (error) {
    console.error('Error incrementing promo code usage:', error);
    throw error;
  }
};