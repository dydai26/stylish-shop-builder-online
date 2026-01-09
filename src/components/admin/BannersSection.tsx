import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, MoveUp, MoveDown } from 'lucide-react';
import ImageUpload from '@/components/ui/ImageUpload';
import {
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  updateBannerOrder,
  type Banner,
  type CreateBannerData,
  type UpdateBannerData
} from '@/lib/bannersService';
import { replaceImage, extractPathFromUrl, deleteImage } from '@/lib/imageUploadService';

const BannersSection: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState<CreateBannerData>({
    title: '',
    description: '',
    image: '',
    link: '',
    is_active: true,
    display_order: 0
  });

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      setLoading(true);
      const data = await getAllBanners();
      setBanners(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load banners",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image: '',
      link: '',
      is_active: true,
      display_order: Math.max(...banners.map(b => b.display_order), -1) + 1
    });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.image.trim()) {
      toast({
        title: "Validation Error",
        description: "Title and image are required",
        variant: "destructive",
      });
      return;
    }

    try {
      await createBanner(formData);
      toast({
        title: "Success",
        description: "Banner created successfully!",
      });
      setIsCreateDialogOpen(false);
      resetForm();
      loadBanners();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create banner",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      description: banner.description || '',
      image: banner.image,
      link: banner.link || '',
      is_active: banner.is_active,
      display_order: banner.display_order
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingBanner || !formData.title.trim() || !formData.image.trim()) {
      toast({
        title: "Validation Error",
        description: "Title and image are required",
        variant: "destructive",
      });
      return;
    }

    try {
      // If image changed and new image is uploaded to our storage, delete old one
      if (formData.image !== editingBanner.image && 
          editingBanner.image.includes('supabase') && 
          formData.image.includes('supabase')) {
        const oldPath = extractPathFromUrl(editingBanner.image);
        if (oldPath) {
          try {
            await deleteImage(oldPath);
          } catch (error) {
            console.warn('Failed to delete old banner image:', error);
          }
        }
      }

      await updateBanner(editingBanner.id, formData);
      toast({
        title: "Success",
        description: "Banner updated successfully!",
      });
      setIsEditDialogOpen(false);
      setEditingBanner(null);
      resetForm();
      loadBanners();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update banner",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;

    const banner = banners.find(b => b.id === id);
    
    try {
      // Delete image from storage if it's uploaded to our storage
      if (banner && banner.image.includes('supabase')) {
        const imagePath = extractPathFromUrl(banner.image);
        if (imagePath) {
          try {
            await deleteImage(imagePath);
          } catch (error) {
            console.warn('Failed to delete banner image from storage:', error);
          }
        }
      }

      await deleteBanner(id);
      toast({
        title: "Success",
        description: "Banner deleted successfully!",
      });
      loadBanners();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete banner",
        variant: "destructive",
      });
    }
  };

  const moveUp = async (banner: Banner) => {
    const currentIndex = banners.findIndex(b => b.id === banner.id);
    if (currentIndex <= 0) return;

    const updatedBanners = [...banners];
    const temp = updatedBanners[currentIndex].display_order;
    updatedBanners[currentIndex].display_order = updatedBanners[currentIndex - 1].display_order;
    updatedBanners[currentIndex - 1].display_order = temp;

    try {
      await updateBannerOrder([
        { id: updatedBanners[currentIndex].id, display_order: updatedBanners[currentIndex].display_order },
        { id: updatedBanners[currentIndex - 1].id, display_order: updatedBanners[currentIndex - 1].display_order }
      ]);
      loadBanners();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update banner order",
        variant: "destructive",
      });
    }
  };

  const moveDown = async (banner: Banner) => {
    const currentIndex = banners.findIndex(b => b.id === banner.id);
    if (currentIndex >= banners.length - 1) return;

    const updatedBanners = [...banners];
    const temp = updatedBanners[currentIndex].display_order;
    updatedBanners[currentIndex].display_order = updatedBanners[currentIndex + 1].display_order;
    updatedBanners[currentIndex + 1].display_order = temp;

    try {
      await updateBannerOrder([
        { id: updatedBanners[currentIndex].id, display_order: updatedBanners[currentIndex].display_order },
        { id: updatedBanners[currentIndex + 1].id, display_order: updatedBanners[currentIndex + 1].display_order }
      ]);
      loadBanners();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update banner order",
        variant: "destructive",
      });
    }
  };

  const BannerForm = ({ onSubmit, isEdit = false }: { onSubmit: (e: React.FormEvent) => Promise<void>; isEdit?: boolean }) => {
    // Добавляем локальное состояние
    const [localFormData, setLocalFormData] = useState(formData);
  
    // Синхронизируем с родительским состоянием
    useEffect(() => {
      setLocalFormData(formData);
    }, [formData]);
  
    // Обработчик изменений
    const handleChange = useCallback((field: string, value: any) => {
      setLocalFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }, []);
  
    // Обработчик потери фокуса
    const handleBlur = useCallback(() => {
      setFormData(localFormData);
    }, [localFormData]);
  
    return (
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={localFormData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            onBlur={handleBlur}
            placeholder="Banner title"
            required
            autoComplete="off"
            spellCheck="false"
          />
        </div>
  
        
  
        <ImageUpload
          label="Banner Image"
          value={localFormData.image}
          onChange={(url) => {
            handleChange('image', url);
            handleBlur();
          }}
          placeholder="Upload banner image"
          required
        />
  
      <div>
          <Label htmlFor="display_order">Display Order</Label>
          <Input
            id="display_order"
            type="number"
            value={localFormData.display_order}
            onChange={(e) => handleChange('display_order', parseInt(e.target.value) || 0)}
            onBlur={handleBlur}
          />
        </div>
  
        <div className="flex items-center space-x-2">
          <Switch
            id="is_active"
            checked={localFormData.is_active}
            onCheckedChange={(checked) => {
              handleChange('is_active', checked);
              handleBlur();
            }}
          />
          <Label htmlFor="is_active">Active</Label>
        </div>
  
        <Button type="submit" className="w-full">
          {isEdit ? 'Update Banner' : 'Create Banner'}
        </Button>
      </form>
    );
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading banners...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Banners Management</CardTitle>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Banner</DialogTitle>
            </DialogHeader>
            <BannerForm onSubmit={handleCreate} />
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent>
        {banners.length === 0 ? (
          <div className="text-center p-8 text-muted-foreground">
            No banners found. Create your first banner to get started.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {banners.map((banner, index) => (
                <TableRow key={banner.id}>
                  <TableCell>
                    <img 
                      src={banner.image} 
                      alt={banner.title}
                      className="w-16 h-10 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{banner.title}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {banner.description || '-'}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${
                      banner.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {banner.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveUp(banner)}
                        disabled={index === 0}
                      >
                        <MoveUp className="h-3 w-3" />
                      </Button>
                      <span className="text-sm">{banner.display_order}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveDown(banner)}
                        disabled={index === banners.length - 1}
                      >
                        <MoveDown className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(banner)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(banner.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Banner</DialogTitle>
            </DialogHeader>
            <BannerForm onSubmit={handleUpdate} isEdit />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default BannersSection;