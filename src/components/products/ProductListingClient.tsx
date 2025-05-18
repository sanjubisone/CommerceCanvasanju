'use client';

import { useState, useMemo, useEffect } from 'react';
import type { Product } from '@/types';
import ProductGrid from './ProductGrid';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, ArrowUpDown, Filter } from 'lucide-react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


interface ProductListingClientProps {
  initialProducts: Product[];
  categories: string[];
}

const ProductListingClient = ({ initialProducts, categories }: ProductListingClientProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');
  const [selectedCategories, setSelectedCategories] = useState<Record<string, boolean>>({});
  const [clientLoaded, setClientLoaded] = useState(false);

  useEffect(() => {
    setClientLoaded(true);
  }, []);


  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const activeCategories = useMemo(() => {
    return Object.entries(selectedCategories)
      .filter(([, isActive]) => isActive)
      .map(([category]) => category);
  }, [selectedCategories]);

  const filteredAndSortedProducts = useMemo(() => {
    let products = [...initialProducts];

    if (searchTerm) {
      products = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (activeCategories.length > 0) {
      products = products.filter(product => activeCategories.includes(product.category));
    }

    switch (sortBy) {
      case 'price-asc':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        products.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'rating-desc':
        products.sort((a,b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
    }
    return products;
  }, [initialProducts, searchTerm, sortBy, activeCategories]);

  if (!clientLoaded) {
     // Basic SSR-friendly skeleton or message
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="bg-muted h-10 w-full md:w-1/3 rounded-md animate-pulse"></div>
          <div className="bg-muted h-10 w-full md:w-1/3 rounded-md animate-pulse"></div>
          <div className="bg-muted h-10 w-full md:w-1/3 rounded-md animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-card h-96 rounded-lg shadow-sm animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 p-4 bg-card rounded-lg shadow">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex-shrink-0 w-full md:w-auto">
              <Filter className="mr-2 h-4 w-4" /> 
              Categories {activeCategories.length > 0 ? `(${activeCategories.length})` : ''}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {categories.map(category => (
              <DropdownMenuCheckboxItem
                key={category}
                checked={selectedCategories[category] || false}
                onCheckedChange={() => handleCategoryChange(category)}
              >
                {category}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-auto flex-shrink-0">
            <ArrowUpDown className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name-asc">Name: A-Z</SelectItem>
            <SelectItem value="name-desc">Name: Z-A</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="rating-desc">Rating: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ProductGrid products={filteredAndSortedProducts} />
    </div>
  );
};

export default ProductListingClient;
