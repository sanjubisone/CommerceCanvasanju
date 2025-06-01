'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

export default function OrderSuccessClient() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const sessionId = searchParams.get('session_id');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      clearCart();
      setIsLoading(false);
    }
  }, [sessionId, clearCart]);

  if (isLoading) {
    return (
      <div className="container max-w-md mx-auto py-16 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container max-w-md mx-auto py-16">
      <Card className="text-center">
        <CardHeader>
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <CardTitle className="text-2xl text-green-600">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-gray-600">
            Thank you for your purchase. Your order has been processed successfully.
          </p>
          {sessionId && (
            <p className="text-sm text-gray-500">
              Order ID: {sessionId.slice(0, 8)}...
            </p>
          )}
        </CardContent>
        <CardFooter className="flex justify-center space-x-4">
          <Link href="/products">
            <Button variant="outline">
              Continue Shopping
            </Button>
          </Link>
          <Link href="/orders">
            <Button variant="default">
              View Orders
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}