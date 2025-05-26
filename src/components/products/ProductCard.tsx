'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent link navigation if card is wrapped in Link
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <Link href={`/products/${product.id}`} className="block">
        <CardHeader className="p-0">
          <div className="aspect-[4/3] relative w-full">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              data-ai-hint={product.dataAiHint}
            />
          </div>
        </CardHeader>
      </Link>
      <CardContent className="p-4 flex-grow">
        <Link href={`/products/${product.id}`} className="block">
          <CardTitle className="text-lg font-semibold hover:text-primary transition-colors">{product.name}</CardTitle>
        </Link>
        <Badge variant="secondary" className="mt-1 mb-2">{product.category}</Badge>
        <CardDescription className="text-sm text-muted-foreground line-clamp-2 mb-2">
          {product.description}
        </CardDescription>
        <p className="text-lg font-bold text-primary">${product.price.toFixed(2)}</p>
        {product.rating && (
          <div className="text-xs text-muted-foreground mt-1">
            Rating: {product.rating}/5 ({product.reviews} reviews)
            <div  className='text-xs text-muted-foreground mt-1 font-semibold bg-red-500 w-48 text-white px-2 py-1 rounded-full' >recently bought by sanju bisone</div>
          </div>
          
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
        <Link href={`/products/${product.id}`} passHref className="flex-1 w-full sm:w-auto">
          <Button variant="outline" className="w-full">
            <Eye className="mr-2 h-4 w-4" /> View Details
          </Button>
        </Link>
        <Button onClick={handleAddToCart} className="flex-1 w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
          <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
