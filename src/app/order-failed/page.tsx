import { Metadata } from 'next';
import OrderFailureClient from '@/components/checkout/OrderFailureClient';

export const metadata: Metadata = {
  title: 'Order Failed - CommerceCanvas',
  description: 'Your order could not be processed',
};

// Mark the page as dynamic to prevent static prerendering
export const dynamic = 'force-dynamic';

export default function OrderFailedPage() {
  return <OrderFailureClient />;
}