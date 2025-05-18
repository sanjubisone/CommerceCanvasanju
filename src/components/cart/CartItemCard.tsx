'use client';

import Image from 'next/image';
import type { CartItem } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, Plus, Minus } from 'lucide-react';
import Link from 'next/link';

interface CartItemCardProps {
  item: CartItem;
}

const CartItemCard = ({ item }: CartItemCardProps) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (newQuantity: number) => {
    updateQuantity(item.id, newQuantity);
  };

  return (
    <Card className="flex flex-col sm:flex-row gap-4 p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="relative w-full sm:w-32 h-32 sm:h-auto aspect-square flex-shrink-0">
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          sizes="(max-width: 640px) 100vw, 128px"
          className="object-cover rounded-md"
          data-ai-hint={item.dataAiHint}
        />
      </div>
      <CardContent className="flex-grow p-0 flex flex-col justify-between">
        <div>
          <Link href={`/products/${item.id}`} className="hover:text-primary transition-colors">
            <h3 className="text-lg font-semibold">{item.name}</h3>
          </Link>
          <p className="text-sm text-muted-foreground">{item.category}</p>
          <p className="text-md font-medium text-primary mt-1">${item.price.toFixed(2)}</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 gap-4">
          <div className="flex items-center border rounded-md">
            <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(item.quantity - 1)} disabled={item.quantity <= 1}>
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              type="number"
              value={item.quantity}
              onChange={(e) => handleQuantityChange(Math.max(1, Math.min(parseInt(e.target.value) || 1, item.stock)))}
              className="w-16 h-10 text-center border-0 focus-visible:ring-0 hide-arrows"
              aria-label="Item quantity"
            />
            <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(item.quantity + 1)} disabled={item.quantity >= item.stock}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)} className="text-destructive hover:bg-destructive/10">
            <Trash2 className="h-5 w-5" />
            <span className="sr-only">Remove item</span>
          </Button>
        </div>
        {item.quantity > item.stock && <p className="text-xs text-destructive mt-1">Only {item.stock} in stock.</p>}
      </CardContent>
      <style jsx global>{`
        /* Hide number input arrows */
        .hide-arrows::-webkit-outer-spin-button,
        .hide-arrows::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .hide-arrows[type=number] {
          -moz-appearance: textfield;
        }
      `}</style>
    </Card>
  );
};

export default CartItemCard;
