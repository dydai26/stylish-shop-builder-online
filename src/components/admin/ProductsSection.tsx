import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import ImageUpload from "@/components/ui/ImageUpload";
import VideoUpload from "@/components/ui/VideoUpload";
import MultiImageUpload from "@/components/ui/MultiImageUpload";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, Search, Package, Eye, DollarSign } from "lucide-react";
import {
  getAllProductsAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
  generateSlug,
  Product,
  CreateProductData,
  UpdateProductData,
  EducationContentItem,
  ClinicalResultItem,
  FaqItem,
  UgcVideoItem
} from "@/lib/productsService";

const ProductsSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  // Form states
  const initialFormData = {
    name: "",
    slug: "",
    price: "",
    image: "",
    images: "",
    description: "",
    category: "",
    sku: "",
    tags: "",
    benefits: "",
    usage: "",
    ingredients: "",
    metaTitle: "",
    metaDescription: "",
    ogImage: "",
    status: "active",
    educationContent: {} as Record<string, import('@/lib/productsService').EducationContentItem>,
    clinicalResults: {} as Record<string, import('@/lib/productsService').ClinicalResultItem>,
    faqs: [] as import('@/lib/productsService').FaqItem[],
    ugcVideos: [] as import('@/lib/productsService').UgcVideoItem[],
  };

  const [formData, setFormData] = useState(initialFormData);
  const [localFormData, setLocalFormData] = useState(initialFormData);
  const [activeTab, setActiveTab] = useState("basic");

  useEffect(() => {
    setLocalFormData(formData);
  }, [formData]);


  const categories = ["shampoo", "mask", "conditioner", "treatment"];

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getAllProductsAdmin();
      setProducts(data);
    } catch (error) {
      console.error("Failed to load products:", error);
      toast({
        title: "Error",
        description: "Failed to load products. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      price: "",
      image: "",
      images: "",
      description: "",
      category: "",
      sku: "",
      tags: "",
      benefits: "",
      usage: "",
      ingredients: "",
      metaTitle: "",
      metaDescription: "",
      ogImage: "",
      status: "active",
      educationContent: {},
      clinicalResults: {},
      faqs: [],
      ugcVideos: [],
    });
  };

  const handleNameChange = useCallback((value: string) => {
    setFormData(prev => ({
      ...prev,
      name: value,
    }));
  }, []);

  useEffect(() => {
    if (formData.name && !editingProduct) {
      const debounceSlug = setTimeout(() => {
        const newSlug = generateSlug(formData.name);
        setFormData(prev => ({
          ...prev,
          slug: newSlug,
        }));
        setLocalFormData(prev => ({
          ...prev,
          slug: newSlug,
        }));
      }, 1000); // Увеличиваем задержку до 1 секунды

      return () => clearTimeout(debounceSlug);
    }
  }, [formData.name, editingProduct]);

  const handleAddProduct = async () => {
    // Validation
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Product name is required.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.image.trim()) {
      toast({
        title: "Validation Error", 
        description: "Main image is required.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast({
        title: "Validation Error",
        description: "Valid price is required.",
        variant: "destructive", 
      });
      return;
    }

    if (!formData.category) {
      toast({
        title: "Validation Error",
        description: "Category is required.",
        variant: "destructive",
      });
      return;
    }

    try {
      const productData: CreateProductData = {
        name: formData.name,
        slug: formData.slug,
        price: parseFloat(formData.price),
        image: formData.image,
        images: formData.images ? formData.images.split(",").map(img => img.trim()).filter(img => img.length > 0) : [],
        description: formData.description,
        category: formData.category,
        sku: formData.sku,
        tags: formData.tags ? formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag.length > 0) : [],
        benefits: formData.benefits ? formData.benefits.split("\n").filter(b => b.trim()) : [],
        usage: formData.usage,
        ingredients: formData.ingredients,
        metaTitle: formData.metaTitle,
        metaDescription: formData.metaDescription,
        ogImage: formData.ogImage,
        status: formData.status,
        educationContent: formData.educationContent,
        clinicalResults: formData.clinicalResults,
        faqs: formData.faqs,
        ugcVideos: formData.ugcVideos,
      };

      await createProduct(productData);
      toast({
        title: "Success",
        description: "Product created successfully!",
      });
      setIsAddDialogOpen(false);
      resetForm();
      loadProducts();
    } catch (error) {
      console.error("Failed to create product:", error);
      toast({
        title: "Error",
        description: "Failed to create product. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditProduct = (product: Product) => {
    const formattedData = {
      name: product.name,
      slug: product.slug,
      price: product.price.toString(),
      image: product.image,
      images: product.images.join(", "),
      description: product.description || "",
      category: product.category,
      sku: product.sku || "",
      tags: product.tags.join(", "),
      benefits: product.benefits.join("\n"),
      usage: product.usage || "",
      ingredients: product.ingredients || "",
      metaTitle: product.metaTitle || "",
      metaDescription: product.metaDescription || "",
      ogImage: product.ogImage || "",
      status: product.status,
      educationContent: product.educationContent || {},
      clinicalResults: product.clinicalResults || {},
      faqs: product.faqs || [],
      ugcVideos: product.ugcVideos || [],
    };
    setEditingProduct(product);
    setLocalFormData(formattedData as any);
    setFormData(formattedData as any);
    setIsEditDialogOpen(true);
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;

    // Validation
    if (!localFormData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Product name is required.",
        variant: "destructive",
      });
      return;
    }

    if (!localFormData.image || typeof localFormData.image !== 'string' || !localFormData.image.trim()) {
      toast({
        title: "Validation Error", 
        description: "Main image is required.",
        variant: "destructive",
      });
      return;
    }

    if (!localFormData.price || parseFloat(localFormData.price.toString()) <= 0) {
      toast({
        title: "Validation Error",
        description: "Valid price is required.",
        variant: "destructive", 
      });
      return;
    }

    if (!localFormData.category) {
      toast({
        title: "Validation Error",
        description: "Category is required.",
        variant: "destructive",
      });
      return;
    }

    try {
      const updateData: UpdateProductData = {
        id: editingProduct.id,
        name: localFormData.name,
        slug: localFormData.slug,
        price: parseFloat(localFormData.price.toString()),
        image: localFormData.image,
        images: localFormData.images && typeof localFormData.images === 'string' ? localFormData.images.split(",").map((img: string) => img.trim()).filter((img: string) => img.length > 0) : Array.isArray(localFormData.images) ? localFormData.images : [],
        description: localFormData.description,
        category: localFormData.category,
        sku: localFormData.sku,
        tags: localFormData.tags && typeof localFormData.tags === 'string' ? localFormData.tags.split(",").map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0) : Array.isArray(localFormData.tags) ? localFormData.tags : [],
        benefits: localFormData.benefits && typeof localFormData.benefits === 'string' ? localFormData.benefits.split("\n").filter((b: string) => b.trim()) : Array.isArray(localFormData.benefits) ? localFormData.benefits : [],
        usage: localFormData.usage,
        ingredients: localFormData.ingredients,
        metaTitle: localFormData.metaTitle,
        metaDescription: localFormData.metaDescription,
        ogImage: localFormData.ogImage,
        status: localFormData.status,
        educationContent: localFormData.educationContent,
        clinicalResults: localFormData.clinicalResults,
        faqs: localFormData.faqs,
        ugcVideos: localFormData.ugcVideos,
      };

      await updateProduct(updateData);
      toast({
        title: "Success",
        description: "Product updated successfully!",
      });
      setIsEditDialogOpen(false);
      setEditingProduct(null);
      resetForm();
      loadProducts();
    } catch (error) {
      console.error("Failed to update product:", error);
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    try {
      await deleteProduct(productId);
      toast({
        title: "Success",
        description: "Product deleted successfully!",
      });
      loadProducts();
    } catch (error) {
      console.error("Failed to delete product:", error);
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async (product: Product) => {
    try {
      const newStatus = product.status === 'active' ? 'inactive' : 'active';
      await updateProduct({
        id: product.id,
        status: newStatus
      });
      toast({
        title: `Product ${newStatus === 'active' ? 'activated' : 'deactivated'}`,
        description: `${product.name} is now ${newStatus}.`,
      });
      // Update local state for immediate feedback
      setProducts(prev => prev.map(p => 
        p.id === product.id ? { ...p, status: newStatus } : p
      ));
    } catch (error) {
      console.error("Failed to toggle product status:", error);
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderProductForm = (isEdit: boolean = false) => {
    
    const handleChange = (field: string, value: any) => {
      setLocalFormData(prev => ({
        ...prev,
        [field]: value
      }));
    };

    const handleBlur = () => {
      setFormData(localFormData);
    };

    const handleImageChange = (field: string, value: string) => {
      setLocalFormData(prev => ({ ...prev, [field]: value }));
      setFormData(prev => ({ ...prev, [field]: value }));
    };

    
    // Helpers for JSON updates
    const updateJsonField = (field: keyof typeof localFormData, newValue: any) => {
      setLocalFormData(prev => ({ ...prev, [field]: newValue }));
      setFormData(prev => ({ ...prev, [field]: newValue }));
    };



    return (
      <div className="max-h-[85vh] overflow-y-auto pr-2">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="media">Media & SEO</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="rich">Rich Tabs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" value={localFormData.name} onChange={(e) => handleChange('name', e.target.value)} onBlur={handleBlur} />
              </div>
              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" value={localFormData.slug || ""} onChange={(e) => handleChange('slug', e.target.value)} onBlur={handleBlur} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price (€)</Label>
                <Input id="price" type="text" inputMode="decimal" value={localFormData.price ?? ""} onChange={(e) => handleChange('price', e.target.value)} onBlur={handleBlur} />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={localFormData.category} onValueChange={(val) => { handleChange('category', val); setFormData(p => ({...p, category: val})); }}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sku">SKU</Label>
                <Input id="sku" value={localFormData.sku || ""} onChange={(e) => handleChange('sku', e.target.value)} onBlur={handleBlur} />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={localFormData.status} onValueChange={(val) => handleChange('status', val)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input id="tags" value={localFormData.tags || ""} onChange={(e) => handleChange('tags', e.target.value)} onBlur={handleBlur} />
            </div>
          </TabsContent>

          <TabsContent value="media" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <ImageUpload label="Main Image" value={localFormData.image} onChange={(url) => handleImageChange('image', url)} required />
              <div className="space-y-3">
                <h4 className="font-medium">SEO Settings</h4>
                <Input placeholder="Meta Title" value={localFormData.metaTitle || ""} onChange={(e) => handleChange('metaTitle', e.target.value)} onBlur={handleBlur} />
                <Textarea placeholder="Meta Description" value={localFormData.metaDescription || ""} onChange={(e) => handleChange('metaDescription', e.target.value)} onBlur={handleBlur} rows={2} />
                <Input placeholder="OG Image URL" value={localFormData.ogImage || ""} onChange={(e) => handleChange('ogImage', e.target.value)} onBlur={handleBlur} />
              </div>
            </div>
            <MultiImageUpload label="Additional Images" value={localFormData.images} onChange={(urls) => handleImageChange('images', urls)} maxImages={8} />
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <div>
              <Label>Description</Label>
              <Textarea value={localFormData.description || ""} onChange={(e) => handleChange('description', e.target.value)} onBlur={handleBlur} rows={4} />
            </div>
            <div>
              <Label>Benefits (one per line)</Label>
              <Textarea value={localFormData.benefits || ""} onChange={(e) => handleChange('benefits', e.target.value)} onBlur={handleBlur} rows={4} />
            </div>
            <div>
              <Label>Usage Instructions</Label>
              <Textarea value={localFormData.usage || ""} onChange={(e) => handleChange('usage', e.target.value)} onBlur={handleBlur} rows={3} />
            </div>
            <div>
              <Label>Ingredients</Label>
              <Textarea value={localFormData.ingredients || ""} onChange={(e) => handleChange('ingredients', e.target.value)} onBlur={handleBlur} rows={3} />
            </div>
          </TabsContent>

          <TabsContent value="rich" className="space-y-6">
            {/* Education Content */}
            <div className="border p-4 rounded-md">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold">Education Tabs</h4>
                <Button type="button" variant="outline" size="sm" onClick={() => {
                  const key = prompt("Enter Tab Name (e.g. Hydration):");
                  if (key && !localFormData.educationContent[key]) {
                    updateJsonField('educationContent', { ...localFormData.educationContent, [key]: { title: "", text1: "", text2: "", fact: "" } });
                  }
                }}>+ Add Tab</Button>
              </div>
              {Object.entries(localFormData.educationContent || {}).map(([key, item]: [string, any]) => (
                <div key={key} className="mb-4 p-3 bg-muted/30 rounded border">
                  <div className="flex justify-between font-medium mb-2"><span>{key}</span> <Button type="button" variant="ghost" size="sm" className="h-6 text-red-500" onClick={() => {
                    const newObj = {...localFormData.educationContent}; delete newObj[key]; updateJsonField('educationContent', newObj);
                  }}>Remove</Button></div>
                  <Input placeholder="Title" value={item.title} className="mb-2" onChange={(e) => updateJsonField('educationContent', {...localFormData.educationContent, [key]: {...item, title: e.target.value}})} />
                  <Textarea placeholder="Text 1" value={item.text1} className="mb-2" rows={2} onChange={(e) => updateJsonField('educationContent', {...localFormData.educationContent, [key]: {...item, text1: e.target.value}})} />
                  <Textarea placeholder="Text 2" value={item.text2} className="mb-2" rows={2} onChange={(e) => updateJsonField('educationContent', {...localFormData.educationContent, [key]: {...item, text2: e.target.value}})} />
                  <Input placeholder="Fact" value={item.fact} onChange={(e) => updateJsonField('educationContent', {...localFormData.educationContent, [key]: {...item, fact: e.target.value}})} />
                </div>
              ))}
            </div>

            {/* FAQs */}
            <div className="border p-4 rounded-md">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold">FAQs</h4>
                <Button type="button" variant="outline" size="sm" onClick={() => {
                  updateJsonField('faqs', [...(localFormData.faqs || []), { question: "", answer: "" }]);
                }}>+ Add FAQ</Button>
              </div>
              {(localFormData.faqs || []).map((faq, i) => (
                <div key={i} className="mb-4 flex gap-2">
                  <div className="flex-1 space-y-2">
                    <Input placeholder="Question" value={faq.question} onChange={(e) => {
                      const newFaqs = [...localFormData.faqs]; newFaqs[i].question = e.target.value; updateJsonField('faqs', newFaqs);
                    }} />
                    <Textarea placeholder="Answer" value={faq.answer} rows={2} onChange={(e) => {
                      const newFaqs = [...localFormData.faqs]; newFaqs[i].answer = e.target.value; updateJsonField('faqs', newFaqs);
                    }} />
                  </div>
                  <Button type="button" variant="ghost" size="icon" className="text-red-500" onClick={() => {
                     const newFaqs = localFormData.faqs.filter((_, idx) => idx !== i); updateJsonField('faqs', newFaqs);
                  }}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
            </div>

            {/* Results */}
            <div className="border p-4 rounded-md">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold">Clinical Results Tabs</h4>
                <Button type="button" variant="outline" size="sm" onClick={() => {
                  const key = prompt("Enter Target (e.g. Dry Hair):");
                  if (key && !localFormData.clinicalResults[key]) {
                    updateJsonField('clinicalResults', { ...localFormData.clinicalResults, [key]: { percent1: "", desc1: "", percent2: "", desc2: "" } });
                  }
                }}>+ Add Result</Button>
              </div>
              {Object.entries(localFormData.clinicalResults || {}).map(([key, item]: [string, any]) => (
                <div key={key} className="mb-4 p-3 bg-muted/30 rounded border">
                  <div className="flex justify-between font-medium mb-2"><span>{key}</span> <Button type="button" variant="ghost" size="sm" className="h-6 text-red-500" onClick={() => {
                    const newObj = {...localFormData.clinicalResults}; delete newObj[key]; updateJsonField('clinicalResults', newObj);
                  }}>Remove</Button></div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <ImageUpload 
                      label="Before Image" 
                      value={item.beforeImage || ""} 
                      onChange={(url) => updateJsonField('clinicalResults', {...localFormData.clinicalResults, [key]: {...item, beforeImage: url}})} 
                    />
                    <ImageUpload 
                      label="After Image" 
                      value={item.afterImage || ""} 
                      onChange={(url) => updateJsonField('clinicalResults', {...localFormData.clinicalResults, [key]: {...item, afterImage: url}})} 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <Input placeholder="Percent 1 (e.g. 92%)" value={item.percent1} onChange={(e) => updateJsonField('clinicalResults', {...localFormData.clinicalResults, [key]: {...item, percent1: e.target.value}})} />
                    <Input placeholder="Desc 1" value={item.desc1} onChange={(e) => updateJsonField('clinicalResults', {...localFormData.clinicalResults, [key]: {...item, desc1: e.target.value}})} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input placeholder="Percent 2 (e.g. 88%)" value={item.percent2} onChange={(e) => updateJsonField('clinicalResults', {...localFormData.clinicalResults, [key]: {...item, percent2: e.target.value}})} />
                    <Input placeholder="Desc 2" value={item.desc2} onChange={(e) => updateJsonField('clinicalResults', {...localFormData.clinicalResults, [key]: {...item, desc2: e.target.value}})} />
                  </div>
                </div>
              ))}
            </div>
            
            {/* UGC Videos */}
            <div className="border p-4 rounded-md">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold">UGC Quotes/Videos</h4>
                <Button type="button" variant="outline" size="sm" onClick={() => {
                  updateJsonField('ugcVideos', [...(localFormData.ugcVideos || []), { quote: "", author: "", videoUrl: "" }]);
                }}>+ Add UGC</Button>
              </div>
              {(localFormData.ugcVideos || []).map((ugc, i) => (
                <div key={i} className="mb-4 p-3 bg-muted/30 rounded border flex gap-2">
                  <div className="flex-1 space-y-2">
                    <Input placeholder="Quote" value={ugc.quote} onChange={(e) => {
                      const newUgc = [...localFormData.ugcVideos]; newUgc[i].quote = e.target.value; updateJsonField('ugcVideos', newUgc);
                    }} />
                    <Input placeholder="Author (e.g. @hanan · Verified Buyer)" value={ugc.author} onChange={(e) => {
                      const newUgc = [...localFormData.ugcVideos]; newUgc[i].author = e.target.value; updateJsonField('ugcVideos', newUgc);
                    }} />
                    <VideoUpload label="Video (optional)" value={ugc.videoUrl || ""} onChange={(url) => {
                      const newUgc = [...localFormData.ugcVideos]; newUgc[i].videoUrl = url; updateJsonField('ugcVideos', newUgc);
                    }} />
                  </div>
                  <Button type="button" variant="ghost" size="icon" className="text-red-500" onClick={() => {
                     const newUgc = localFormData.ugcVideos.filter((_, idx) => idx !== i); updateJsonField('ugcVideos', newUgc);
                  }}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  const statsCards = [
    {
      title: "Total Products",
      value: products.length,
      icon: Package,
      color: "text-blue-600",
    },
    {
      title: "Active Products",
      value: products.filter(p => p.status === 'active').length,
      icon: Eye,
      color: "text-green-600",
    },
    {
      title: "Average Price",
      value: `€${products.length > 0 ? (products.reduce((sum, p) => sum + p.price, 0) / products.length).toFixed(2) : '0.00'}`,
      icon: DollarSign,
      color: "text-purple-600",
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardHeader className="space-y-0 pb-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
                
        </CardContent>
            </Card>
          ))}
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <Card key={index} className="p-6 animate-pulse">
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <div className="h-5 bg-muted rounded w-1/3"></div>
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </div>
                <div className="h-24 w-24 bg-muted rounded"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-[250px]"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-5xl">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            {renderProductForm()}
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddProduct}>Create Product</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Products List */}
      <div className="space-y-4">
        {filteredProducts.length === 0 ? (
          <Card className="p-8 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              No products found
            </h3>
            <p className="text-sm text-muted-foreground">
              {searchTerm || selectedCategory !== "all"
                ? "Try adjusting your search criteria."
                : "Create your first product to get started."}
            </p>
          </Card>
        ) : (
          filteredProducts.map(product => (
            <Card key={product.id} className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1 pr-6">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                        {product.status}
                      </Badge>
                      <div className="flex items-center space-x-2 border rounded-full px-2 py-1 bg-muted/30">
                        <Switch 
                          checked={product.status === 'active'} 
                          onCheckedChange={() => handleToggleStatus(product)}
                          id={`status-${product.id}`}
                        />
                        <Label htmlFor={`status-${product.id}`} className="text-xs font-normal cursor-pointer">
                          {product.status === 'active' ? 'On' : 'Off'}
                        </Label>
                      </div>
                    </div>
                  </div>
                  <div className="text-muted-foreground text-sm mb-2 text-left w-full">
                    SKU: {product.sku} | Category: {product.category}
                  </div>
                  <div className="text-xl font-bold text-primary mb-2 text-left w-full">
                    €{product.price.toFixed(2)}
                  </div>
                  <p className="text-muted-foreground text-sm line-clamp-2 text-left w-full">
                    {product.description}
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    {product.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="inline-flex items-center rounded-full border border-input bg-background px-2.5 py-0.5 text-xs font-semibold text-foreground">
                        {tag}
                      </span>
                    ))}
                    {product.tags.length > 3 && (
                      <span className="text-xs text-muted-foreground">
                        +{product.tags.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEditProduct(product)}><Edit className="h-4 w-4" /></Button>

                    <AlertDialog>
  <AlertDialogTrigger asChild>
    <Button size="sm" variant="outline" className="text-destructive">
      <Trash2 className="h-4 w-4" />
    </Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Delete Product</AlertDialogTitle>
      <AlertDialogDescription>
        Are you sure you want to delete "{product?.name}"? This action cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={() => handleDeleteProduct(product.id)}>
        Delete Product
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>


                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                      
                      <DialogContent className="max-w-5xl">
                        <DialogHeader>
                          <DialogTitle>Edit Product</DialogTitle>
                        </DialogHeader>
                        {renderProductForm(true)}
                        <div className="flex justify-end space-x-2 pt-4 border-t">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setIsEditDialogOpen(false);
                              setEditingProduct(null);
                              resetForm();
                            }}
                          >
                            Cancel
                          </Button>
                          <Button onClick={handleUpdateProduct}>Update Product</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
    </div>
  );
};

export default ProductsSection;