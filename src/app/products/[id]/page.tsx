import { PRODUCTS } from '@/lib/mock-data';
import type { Product } from '@/types';
import ProductDetailClient from '@/components/products/ProductDetailClient';
import { notFound } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';

interface ProductDetailPageProps {
  params: { id: string };
}

// This function could fetch a single product from an API
async function getProduct(id: string): Promise<Product | undefined> {
  // Simulate API delay
  // await new Promise(resolve => setTimeout(resolve, 300));
  return PRODUCTS.find(p => p.id === id);
}

export async function generateMetadata(
  { params }: ProductDetailPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const product = await getProduct(params.id);
  if (!product) {
    return {
      title: 'Product Not Found - CommerceCanvas',
    };
  }
  return {
    title: `${product.name} - CommerceCanvas`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  // Suggest related products by category (excluding the current one)
  const relatedProducts = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />;
}

// For static site generation, if needed:
// export async function generateStaticParams() {
//   return PRODUCTS.map(product => ({
//     id: product.id,
//   }));
// }
