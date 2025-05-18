'use client';

import Link from 'next/link';
import { ShoppingBag, ShoppingCart, Home, LayoutGrid, UserCircle2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Header = () => {
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
          <ShoppingBag className="h-8 w-8" />
          <span>CommerceCanvas</span>
        </Link>
        <nav className="flex items-center gap-4 md:gap-6">
          <Link href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1">
            <Home className="h-4 w-4" /> Home
          </Link>
          <Link href="/products" className="text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1">
            <LayoutGrid className="h-4 w-4" /> Products
          </Link>
          <Link href="/cart" passHref>
            <Button variant="ghost" size="icon" className="relative text-foreground hover:text-primary">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {itemCount}
                </Badge>
              )}
              <span className="sr-only">Shopping Cart</span>
            </Button>
          </Link>
           {/* Placeholder for user account/login */}
          <Button variant="ghost" size="icon" className="text-foreground hover:text-primary">
            <UserCircle2 className="h-5 w-5" />
            <span className="sr-only">User Account</span>
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
