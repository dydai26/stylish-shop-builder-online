// Re-export products service functions for backward compatibility
export {
  getAllProducts,
  getFeaturedProducts,
  getProductById,
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/productsService";
