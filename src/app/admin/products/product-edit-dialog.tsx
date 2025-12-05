'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import ProductImageUpload from './product-image-upload';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: { name: string };
  images: Array<{ url: string; isPrimary: boolean }>;
  status: string;
  vendor: { storeName: string };
}

interface ProductEditDialogProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProductUpdated: () => void;
}

export default function ProductEditDialog({
  product,
  open,
  onOpenChange,
  onProductUpdated,
}: ProductEditDialogProps) {
  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description,
    price: product.price.toString(),
    stock: product.stock.toString(),
  });
  const [loading, setLoading] = useState(false);
  const [refreshImages, setRefreshImages] = useState(0);
  const [currentImages, setCurrentImages] = useState(product.images || []);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImagesUpdated = async () => {
    // Refresh images from API
    try {
      const response = await fetch(`/api/products/${product.id}/images`);
      if (response.ok) {
        const images = await response.json();
        setCurrentImages(images);
        setRefreshImages(prev => prev + 1);
      }
    } catch (error) {
      console.error('Failed to refresh images:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
        }),
      });

      if (!response.ok) throw new Error('Failed to update product');

      toast({
        title: 'Success',
        description: 'Product updated successfully',
      });
      onOpenChange(false);
      onProductUpdated();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update product',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>Update product details, prices, and inventory</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Product Name</label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Price (₱)</label>
              <Input
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Stock</label>
              <Input
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Product Images Section */}
          <div className="border-t pt-4">
            <ProductImageUpload
              key={refreshImages}
              productId={product.id}
              images={currentImages}
              onImagesUpdated={handleImagesUpdated}
            />
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

