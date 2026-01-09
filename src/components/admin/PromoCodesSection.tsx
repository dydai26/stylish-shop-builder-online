import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Percent } from 'lucide-react';
import {
  getAllPromoCodes,
  createPromoCode,
  updatePromoCode,
  deletePromoCode,
  type PromoCode,
  type CreatePromoCodeData,
  type UpdatePromoCodeData
} from '@/lib/promoCodesService';

const PromoCodesSection: React.FC = () => {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPromoCode, setEditingPromoCode] = useState<PromoCode | null>(null);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState<CreatePromoCodeData>({
    code: '',
    discount_percentage: 10,
    is_active: true,
    max_usage_count: undefined
  });

  useEffect(() => {
    loadPromoCodes();
  }, []);

  const loadPromoCodes = async () => {
    try {
      setLoading(true);
      const data = await getAllPromoCodes();
      setPromoCodes(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load promo codes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      discount_percentage: 10,
      is_active: true,
      max_usage_count: undefined
    });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.code.trim()) {
      toast({
        title: "Validation Error",
        description: "Promo code is required",
        variant: "destructive",
      });
      return;
    }

    if (formData.discount_percentage < 1 || formData.discount_percentage > 100) {
      toast({
        title: "Validation Error",
        description: "Discount must be between 1% and 100%",
        variant: "destructive",
      });
      return;
    }

    try {
      await createPromoCode(formData);
      toast({
        title: "Success",
        description: "Promo code created successfully!",
      });
      setIsCreateDialogOpen(false);
      resetForm();
      loadPromoCodes();
    } catch (error: any) {
      const message = error?.message?.includes('duplicate key') 
        ? "Promo code already exists"
        : "Failed to create promo code";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (promoCode: PromoCode) => {
    setEditingPromoCode(promoCode);
    setFormData({
      code: promoCode.code,
      discount_percentage: promoCode.discount_percentage,
      is_active: promoCode.is_active,
      max_usage_count: promoCode.max_usage_count || undefined
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingPromoCode || !formData.code.trim()) {
      toast({
        title: "Validation Error",
        description: "Promo code is required",
        variant: "destructive",
      });
      return;
    }

    if (formData.discount_percentage < 1 || formData.discount_percentage > 100) {
      toast({
        title: "Validation Error",
        description: "Discount must be between 1% and 100%",
        variant: "destructive",
      });
      return;
    }

    try {
      await updatePromoCode(editingPromoCode.id, formData);
      toast({
        title: "Success",
        description: "Promo code updated successfully!",
      });
      setIsEditDialogOpen(false);
      setEditingPromoCode(null);
      resetForm();
      loadPromoCodes();
    } catch (error: any) {
      const message = error?.message?.includes('duplicate key') 
        ? "Promo code already exists"
        : "Failed to update promo code";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this promo code?')) return;

    try {
      await deletePromoCode(id);
      toast({
        title: "Success",
        description: "Promo code deleted successfully!",
      });
      loadPromoCodes();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete promo code",
        variant: "destructive",
      });
    }
  };

  const PromoCodeForm = ({ onSubmit, isEdit = false }: { onSubmit: (e: React.FormEvent) => Promise<void>; isEdit?: boolean }) => {
    // Добавляем локальное состояние
    const [localFormData, setLocalFormData] = useState(formData);

    // Синхронизация с родительским состоянием
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
          <Label htmlFor="code">Promo Code *</Label>
          <Input
            id="code"
            value={localFormData.code}
            onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
            onBlur={handleBlur}
            placeholder="SAVE20"
            required
            className="uppercase"
            autoComplete="off"
          />
        </div>

        <div>
          <Label htmlFor="discount_percentage">Discount Percentage *</Label>
          <div className="relative">
            <Input
              id="discount_percentage"
              type="number"
              min="1"
              max="100"
              value={localFormData.discount_percentage}
              onChange={(e) => handleChange('discount_percentage', parseInt(e.target.value) || 0)}
              onBlur={handleBlur}
              placeholder="10"
              required
            />
            <Percent className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <div>
          <Label htmlFor="max_usage_count">Max Usage Count (Optional)</Label>
          <Input
            id="max_usage_count"
            type="number"
            min="1"
            value={localFormData.max_usage_count || ''}
            onChange={(e) => handleChange('max_usage_count', e.target.value ? parseInt(e.target.value) : undefined)}
            onBlur={handleBlur}
            placeholder="100"
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
          {isEdit ? 'Update Promo Code' : 'Create Promo Code'}
        </Button>
      </form>
    );
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading promo codes...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Promo Codes Management</CardTitle>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Promo Code
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Promo Code</DialogTitle>
            </DialogHeader>
            <PromoCodeForm onSubmit={handleCreate} />
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent>
        {promoCodes.length === 0 ? (
          <div className="text-center p-8 text-muted-foreground">
            No promo codes found. Create your first promo code to get started.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promoCodes.map((promoCode) => (
                <TableRow key={promoCode.id}>
                  <TableCell className="font-mono font-medium">{promoCode.code}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {promoCode.discount_percentage}
                      <Percent className="h-3 w-3 ml-1" />
                    </div>
                  </TableCell>
                  <TableCell>
                    {promoCode.usage_count}
                    {promoCode.max_usage_count && ` / ${promoCode.max_usage_count}`}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${
                      promoCode.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {promoCode.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(promoCode.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(promoCode)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(promoCode.id)}
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
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Promo Code</DialogTitle>
            </DialogHeader>
            <PromoCodeForm onSubmit={handleUpdate} isEdit />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default PromoCodesSection;