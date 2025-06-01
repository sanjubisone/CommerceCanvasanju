'use client';

import { useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const sessionId = searchParams.get('session_id');

  // Use useCallback to memoize the clear cart function
  const handleClearCart = useCallback(() => {
    if (sessionId) {
      clearCart();
    }
  }, [sessionId, clearCart]);

  useEffect(() => {
    handleClearCart();
  }, [handleClearCart]);

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
          <Link href="/products">
            <Button variant="default">
              View Orders
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}