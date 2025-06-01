import { Metadata } from 'next';
import OrderSuccessClient from '@/components/checkout/OrderSuccessClient';

export const metadata: Metadata = {
  title: 'Order Success - CommerceCanvas',
  description: 'Your order has been successfully processed',
};

export const dynamic = 'force-dynamic';

export default function OrderSuccessPage() {
  return (
    <main className="min-h-screen">
      <OrderSuccessClient />
    </main>
  );
}