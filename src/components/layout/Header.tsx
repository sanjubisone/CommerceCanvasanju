'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, ShoppingCart, Home, LayoutGrid, UserCircle2, Menu, X } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const Header = () => {
  const { getItemCount } = useCart();
  const itemCount = getItemCount();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-200",
      isScrolled ? "bg-white shadow-md" : "bg-white/80 backdrop-blur-md"
    )}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
            <ShoppingBag className="h-8 w-8" />
            <span className="hidden sm:inline">CommerceCanvas</span>
          </Link>

          {/* Always Visible Navigation */}
          <div className="flex items-center gap-4">
            <Link href="/products" className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors">
              <LayoutGrid className="h-5 w-5" />
              <span className="hidden md:inline">Products</span>
            </Link>
            
            <Link href="/cart" className="relative">
              <Button variant="ghost" size="icon" className="relative hover:text-primary">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                  >
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Mobile Menu Button - pushed to the end */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>

            {/* Desktop-only navigation items */}
            <nav className="hidden md:flex items-center gap-4">
              <Link href="/" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1">
                <Home className="h-4 w-4" /> Home
              </Link>
              <Button variant="ghost" size="icon">
                <UserCircle2 className="h-5 w-5" />
              </Button>
            </nav>
          </div>
        </div>

        {/* Mobile Menu - without cart and products */}
        <div className={cn(
          "md:hidden",
          isMobileMenuOpen ? "block" : "hidden"
        )}>
          <nav className="py-4 flex flex-col gap-4">
            <Link 
              href="/" 
              className="flex items-center gap-2 p-2 hover:bg-accent rounded-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Home className="h-4 w-4" /> Home
            </Link>
            <Button 
              variant="ghost" 
              className="flex items-center gap-2 p-2 hover:bg-accent rounded-lg justify-start"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <UserCircle2 className="h-4 w-4" /> Account
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
