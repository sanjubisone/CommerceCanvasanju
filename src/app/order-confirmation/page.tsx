import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Order Confirmed - CommerceCanvas',
  description: 'Your order has been successfully placed.',
};

export default function OrderConfirmationPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <Card className="w-full max-w-md p-6 md:p-10 shadow-xl">
        <CardHeader className="items-center">
          <CheckCircle2 className="h-20 w-20 text-green-500 mb-6" />
          <CardTitle className="text-3xl md:text-4xl font-bold text-primary">Order Confirmed!</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-lg text-foreground/80 mb-8">
            Thank you for your purchase. Your order has been successfully placed and is being processed. You'll receive an email confirmation shortly.
          </CardDescription>
          <Link href="/products" passHref>
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              Continue Shopping
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
