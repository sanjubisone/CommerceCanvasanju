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
    const handleSuccess = async () => {
      try {
        if (sessionId) {
          await clearCart();
        }
      } catch (error) {
        console.error('Error clearing cart:', error);
      } finally {
        setIsLoading(false);
      }
    };

    handleSuccess();
  }, [sessionId, clearCart]);

  // Return loading state while initializing
  if (isLoading) {
    return (
      <div className="container max-w-md mx-auto py-16 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Return error state if no session ID

  return (
    <div className="container max-w-md mx-auto py-16">
      <Card className="text-center shadow-lg">
        <CardHeader className="space-y-4">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
          <CardTitle className="text-2xl text-green-600">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Thank you for your purchase. Your order has been processed successfully.
          </p>
          <p className="text-sm text-gray-500 bg-gray-50 p-2 rounded">
            Order ID: sessionId.slice(0, 8)...
          </p>
        </CardContent>
        <CardFooter className="flex justify-center gap-4 pt-4">
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