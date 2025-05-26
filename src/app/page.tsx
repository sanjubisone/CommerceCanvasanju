;
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ProductGrid from '@/components/products/ProductGrid';
import { PRODUCTS } from '@/lib/mock-data';
import type { Product } from '@/types';
import { ArrowRight } from 'lucide-react'
export default function HomePage() {
  const featuredProducts = PRODUCTS.slice(0, 4); // Show first 4 products as featured

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/20 via-background to-accent/20_ rounded-xl p-8 md:p-16 text-center shadow-lg">
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4">
          Welcome to CommerceCanvas
        </h1>
        <p className="text-lg md:text-xl text-foreground/80 mb-8 max-w-2xl mx-auto">
          Discover a seamless shopping experience with our curated collection of fine products. Built for you, by us.
        </p>
        <Link href="/products" passHref>
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Shop All Products <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </section>

      {/* Featured Products Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-foreground">Featured Products</h2>
          <Link href="/products" passHref>
            <Button variant="outline" className="text-primary border-primary hover:bg-primary/10">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <ProductGrid products={featuredProducts as Product[]} />
      </section>

      {/* Call to Action / About Section (Optional) */}
      <section className="bg-card p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold text-foreground mb-3">Why Shop With Us?</h2>
        <p className="text-foreground/70">
          At CommerceCanvas, we prioritize quality, customer satisfaction, and innovative solutions. Our AI-powered recommendations help you find exactly what you need, even before you know it.
        </p>
      </section>
    </div>
  );
}
