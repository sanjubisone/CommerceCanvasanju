'use client';

import { useEffect, useState }_ from 'react';
import Image from 'next/image';
import type { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AiRecommendations from '@/components/ai/AiRecommendations';
import ProductGrid from '@/components/products/ProductGrid';
import { Input } from '@/components/ui/input';
import { Minus, Plus, ShoppingCart, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

const ProductDetailClient = ({ product, relatedProducts }: ProductDetailClientProps) => {
  const { addToCart, addToBrowsingHistory, browsingHistory } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    addToBrowsingHistory(product.id);
  }, [product.id, addToBrowsingHistory]);

  const handleQuantityChange = (amount: number) => {
    setQuantity(prev => Math.max(1, Math.min(prev + amount, product.stock)));
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };
  
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
        ))}
        {/* Placeholder for half star if needed */}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="h-5 w-5 text-gray-300" />
        ))}
      </div>
    );
  };


  return (
    <div className="space-y-12">
      <Card className="overflow-hidden shadow-lg">
        <div className="grid md:grid-cols-2 gap-8">
          <CardHeader className="p-0">
             <Dialog>
              <DialogTrigger asChild>
                <div className="aspect-[4/3] relative w-full cursor-zoom-in group">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain group-hover:opacity-80 transition-opacity"
                    data-ai-hint={product.dataAiHint}
                  />
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] p-0">
                <DialogHeader className="sr-only"> 
                  <DialogTitle>{product.name}</DialogTitle>
                </DialogHeader>
                <div className="aspect-[4/3] relative w-full">
                   <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    priority
                    sizes="600px"
                    className="object-contain rounded-md"
                    data-ai-hint={product.dataAiHint}
                  />
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="p-6 flex flex-col justify-center">
            <Badge variant="secondary" className="w-fit mb-2">{product.category}</Badge>
            <CardTitle className="text-3xl lg:text-4xl font-bold mb-3">{product.name}</CardTitle>
            
            {product.rating && (
              <div className="flex items-center gap-2 mb-4">
                {renderStars(product.rating)}
                <span className="text-muted-foreground text-sm">({product.reviews} reviews)</span>
              </div>
            )}

            <p className="text-muted-foreground text-base mb-6 leading-relaxed">{product.description}</p>
            
            <p className="text-3xl font-extrabold text-primary mb-6">${product.price.toFixed(2)}</p>

            <div className="flex items-center gap-4 mb-6">
              <p className="text-sm font-medium">Quantity:</p>
              <div className="flex items-center border rounded-md">
                <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                  <Minus className="h-4 w-4" />
                </Button>
                <Input 
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(parseInt(e.target.value) || 1, product.stock)))}
                  className="w-16 h-10 text-center border-0 focus-visible:ring-0"
                  aria-label="Quantity"
                />
                <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(1)} disabled={quantity >= product.stock}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">(In stock: {product.stock})</p>
            </div>
            
            <Button size="lg" onClick={handleAddToCart} className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground" disabled={product.stock === 0}>
              <ShoppingCart className="mr-2 h-5 w-5" /> {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </CardContent>
        </div>
      </Card>

      <Separator />
      
      {isClient && <AiRecommendations currentProduct={product} browsingHistory={browsingHistory} />}

      {relatedProducts.length > 0 && (
        <section>
          <Separator className="my-8" />
          <h2 className="text-2xl font-semibold mb-6">Related Products</h2>
          <ProductGrid products={relatedProducts} />
        </section>
      )}
    </div>
  );
};

export default ProductDetailClient;
