'use client';

import { useCart } from '@/contexts/CartContext';
import CartItemCard from './CartItemCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, ArrowRight } from 'lucide-react';

const CartClient = () => {
  const { cartItems, getCartTotal, clearCart, getItemCount } = useCart();

  if (cartItems.length === 0) {
    return (
      <Card className="text-center p-8 shadow-lg">
        <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <CardTitle className="text-2xl mb-2">Your cart is empty</CardTitle>
        <p className="text-muted-foreground mb-6">Looks like you haven't added anything to your cart yet.</p>
        <Link href="/products" passHref>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Start Shopping</Button>
        </Link>
      </Card>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-2 space-y-4">
        {cartItems.map(item => (
          <CartItemCard key={item.id} item={item} />
        ))}
      </div>

      <Card className="lg:sticky lg:top-24 shadow-lg"> {/* sticky top value should match header height + some padding */}
        <CardHeader>
          <CardTitle className="text-2xl">Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal ({getItemCount()} items)</span>
            <span>${getCartTotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span>Free</span> {/* Placeholder */}
          </div>
          <Separator />
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${getCartTotal().toFixed(2)}</span>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Link href="/checkout" passHref className="w-full">
            <Button size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              Proceed to Checkout <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Button variant="outline" onClick={clearCart} className="w-full">
            Clear Cart
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CartClient;
