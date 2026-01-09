import { supabase } from "@/integrations/supabase/client";

export interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  image: string;
  images: string[];
  description?: string;
  category: string;
  sku?: string;
  tags: string[];
  benefits: string[];
  usage?: string;
  ingredients?: string;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductData {
  name: string;
  slug: string;
  price: number;
  image: string;
  images: string[];
  description?: string;
  category: string;
  sku?: string;
  tags: string[];
  benefits: string[];
  usage?: string;
  ingredients?: string;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  status?: string;
}

export interface UpdateProductData extends Partial<CreateProductData> {
  id: number;
}

// Get all products
export const getAllProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    throw error;
  }

  return data.map(product => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
    image: product.image,
    images: Array.isArray(product.images) ? product.images as string[] : [],
    description: product.description || undefined,
    category: product.category,
    sku: product.sku || undefined,
    tags: Array.isArray(product.tags) ? product.tags as string[] : [],
    benefits: Array.isArray(product.benefits) ? product.benefits as string[] : [],
    usage: product.usage || undefined,
    ingredients: product.ingredients || undefined,
    metaTitle: product.meta_title || undefined,
    metaDescription: product.meta_description || undefined,
    ogImage: product.og_image || undefined,
    status: product.status,
    createdAt: product.created_at,
    updatedAt: product.updated_at,
  }));
};

// Get all products for admin (including inactive)
export const getAllProductsAdmin = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .neq('status', 'deleted')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    throw error;
  }

  return data.map(product => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
    image: product.image,
    images: Array.isArray(product.images) ? product.images as string[] : [],
    description: product.description || undefined,
    category: product.category,
    sku: product.sku || undefined,
    tags: Array.isArray(product.tags) ? product.tags as string[] : [],
    benefits: Array.isArray(product.benefits) ? product.benefits as string[] : [],
    usage: product.usage || undefined,
    ingredients: product.ingredients || undefined,
    metaTitle: product.meta_title || undefined,
    metaDescription: product.meta_description || undefined,
    ogImage: product.og_image || undefined,
    status: product.status,
    createdAt: product.created_at,
    updatedAt: product.updated_at,
  }));
};

// Get featured products (first 3 active products)
export const getFeaturedProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(3);

  if (error) {
    console.error('Error fetching featured products:', error);
    throw error;
  }

  return data.map(product => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
    image: product.image,
    images: Array.isArray(product.images) ? product.images as string[] : [],
    description: product.description || undefined,
    category: product.category,
    sku: product.sku || undefined,
    tags: Array.isArray(product.tags) ? product.tags as string[] : [],
    benefits: Array.isArray(product.benefits) ? product.benefits as string[] : [],
    usage: product.usage || undefined,
    ingredients: product.ingredients || undefined,
    metaTitle: product.meta_title || undefined,
    metaDescription: product.meta_description || undefined,
    ogImage: product.og_image || undefined,
    status: product.status,
    createdAt: product.created_at,
    updatedAt: product.updated_at,
  }));
};

// Get product by ID
export const getProductById = async (id: number): Promise<Product | null> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .eq('status', 'active')
    .maybeSingle();

  if (error) {
    console.error('Error fetching product:', error);
    throw error;
  }

  if (!data) return null;

  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    price: typeof data.price === 'string' ? parseFloat(data.price) : data.price,
    image: data.image,
    images: Array.isArray(data.images) ? data.images as string[] : [],
    description: data.description || undefined,
    category: data.category,
    sku: data.sku || undefined,
    tags: Array.isArray(data.tags) ? data.tags as string[] : [],
    benefits: Array.isArray(data.benefits) ? data.benefits as string[] : [],
    usage: data.usage || undefined,
    ingredients: data.ingredients || undefined,
    metaTitle: data.meta_title || undefined,
    metaDescription: data.meta_description || undefined,
    ogImage: data.og_image || undefined,
    status: data.status,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
};

// Get related products by category
export const getRelatedProducts = async (category: string, excludeId?: number): Promise<Product[]> => {
  let query = supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(4);

  if (excludeId) {
    query = query.neq('id', excludeId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching related products:', error);
    throw error;
  }

  return data.map(product => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
    image: product.image,
    images: Array.isArray(product.images) ? product.images as string[] : [],
    description: product.description || undefined,
    category: product.category,
    sku: product.sku || undefined,
    tags: Array.isArray(product.tags) ? product.tags as string[] : [],
    benefits: Array.isArray(product.benefits) ? product.benefits as string[] : [],
    usage: product.usage || undefined,
    ingredients: product.ingredients || undefined,
    metaTitle: product.meta_title || undefined,
    metaDescription: product.meta_description || undefined,
    ogImage: product.og_image || undefined,
    status: product.status,
    createdAt: product.created_at,
    updatedAt: product.updated_at,
  }));
};

// Create new product
export const createProduct = async (productData: CreateProductData): Promise<Product> => {
  const { data, error } = await supabase
    .from('products')
    .insert({
      name: productData.name,
      slug: productData.slug,
      price: productData.price,
      image: productData.image,
      images: productData.images,
      description: productData.description,
      category: productData.category,
      sku: productData.sku,
      tags: productData.tags,
      benefits: productData.benefits,
      usage: productData.usage,
      ingredients: productData.ingredients,
      meta_title: productData.metaTitle,
      meta_description: productData.metaDescription,
      og_image: productData.ogImage,
      status: productData.status || 'active',
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating product:', error);
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    price: typeof data.price === 'string' ? parseFloat(data.price) : data.price,
    image: data.image,
    images: Array.isArray(data.images) ? data.images as string[] : [],
    description: data.description || undefined,
    category: data.category,
    sku: data.sku || undefined,
    tags: Array.isArray(data.tags) ? data.tags as string[] : [],
    benefits: Array.isArray(data.benefits) ? data.benefits as string[] : [],
    usage: data.usage || undefined,
    ingredients: data.ingredients || undefined,
    metaTitle: data.meta_title || undefined,
    metaDescription: data.meta_description || undefined,
    ogImage: data.og_image || undefined,
    status: data.status,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
};

// Update product
export const updateProduct = async (productData: UpdateProductData): Promise<Product> => {
  const { id, ...updateData } = productData;
  
  const { data, error } = await supabase
    .from('products')
    .update({
      ...(updateData.name && { name: updateData.name }),
      ...(updateData.slug && { slug: updateData.slug }),
      ...(updateData.price && { price: updateData.price }),
      ...(updateData.image && { image: updateData.image }),
      ...(updateData.images && { images: updateData.images }),
      ...(updateData.description !== undefined && { description: updateData.description }),
      ...(updateData.category && { category: updateData.category }),
      ...(updateData.sku !== undefined && { sku: updateData.sku }),
      ...(updateData.tags && { tags: updateData.tags }),
      ...(updateData.benefits && { benefits: updateData.benefits }),
      ...(updateData.usage !== undefined && { usage: updateData.usage }),
      ...(updateData.ingredients !== undefined && { ingredients: updateData.ingredients }),
      ...(updateData.metaTitle !== undefined && { meta_title: updateData.metaTitle }),
      ...(updateData.metaDescription !== undefined && { meta_description: updateData.metaDescription }),
      ...(updateData.ogImage !== undefined && { og_image: updateData.ogImage }),
      ...(updateData.status && { status: updateData.status }),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating product:', error);
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    price: typeof data.price === 'string' ? parseFloat(data.price) : data.price,
    image: data.image,
    images: Array.isArray(data.images) ? data.images as string[] : [],
    description: data.description || undefined,
    category: data.category,
    sku: data.sku || undefined,
    tags: Array.isArray(data.tags) ? data.tags as string[] : [],
    benefits: Array.isArray(data.benefits) ? data.benefits as string[] : [],
    usage: data.usage || undefined,
    ingredients: data.ingredients || undefined,
    metaTitle: data.meta_title || undefined,
    metaDescription: data.meta_description || undefined,
    ogImage: data.og_image || undefined,
    status: data.status,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
};

// Delete product (soft delete by changing status)
export const deleteProduct = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('products')
    .update({ status: 'deleted' })
    .eq('id', id);

  if (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Generate slug from name
export const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};