import { PRODUCTS } from '@/lib/mock-data';
import type { Product } from '@/types';
import ProductListingClient from '@/components/products/ProductListingClient';

export const metadata = {
  title: 'Products - CommerceCanvas',
  description: 'Browse our wide selection of products.',
};

// This function could fetch products from an API in a real app
async function getProducts(): Promise<Product[]> {
  // Simulate API delay
  // await new Promise(resolve => setTimeout(resolve, 500));
  return PRODUCTS;
}

export default async function ProductsPage() {
  const products = await getProducts();
  const categories = Array.from(new Set(products.map(p => p.category)));

  return (
    <div className="space-y-8">
      <section className="text-center py-8 bg-card rounded-lg shadow-sm">
        <h1 className="text-4xl font-bold text-primary">Our Products</h1>
        <p className="text-lg text-muted-foreground mt-2">Explore our diverse collection tailored for you.</p>
      </section>
      <ProductListingClient initialProducts={products} categories={categories} />
    </div>
  );
}
