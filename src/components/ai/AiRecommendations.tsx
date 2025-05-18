'use client';

import { useEffect, useState } from 'react';
import { getProductRecommendations, ProductRecommendationsInput } from '@/ai/flows/product-recommendations';
import type { Product } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Sparkles, Loader2 } from 'lucide-react';

interface AiRecommendationsProps {
  currentProduct: Product;
  browsingHistory: string[]; // Array of product IDs
}

const AiRecommendations = ({ currentProduct, browsingHistory }: AiRecommendationsProps) => {
  const [recommendations, setRecommendations] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!browsingHistory || browsingHistory.length === 0) {
        // Use current product as part of history if actual history is empty
        // Or provide a generic message / don't fetch
        setRecommendations("View more products to get personalized recommendations!");
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const historyString = browsingHistory.join(',');
        const input: ProductRecommendationsInput = {
          browsingHistory: historyString,
        };
        const result = await getProductRecommendations(input);
        setRecommendations(result.recommendations);
      } catch (e) {
        console.error("Failed to fetch AI recommendations:", e);
        setError("Could not load recommendations at this time.");
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch if there's some history or current product context
    if (browsingHistory.length > 0 || currentProduct) {
       fetchRecommendations();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProduct.id, browsingHistory.join(',')]); // Depend on joined string to avoid re-renders for same history array object

  return (
    <Card className="bg-primary/5 border-primary/20 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center text-xl text-primary">
          <Sparkles className="mr-2 h-6 w-6" />
          AI Powered Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-2 text-muted-foreground">Generating recommendations...</p>
          </div>
        )}
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {recommendations && !isLoading && !error && (
          <div className="prose prose-sm max-w-none text-foreground">
            <p className="italic text-muted-foreground">Based on your recent activity, you might also like:</p>
            {/* Assuming recommendations is a string list. This might need parsing if it's structured. */}
            <ul className="list-disc pl-5 space-y-1">
              {recommendations.split('\n').map((rec, index) => rec.trim() && <li key={index}>{rec.replace(/^- /, '')}</li>)}
            </ul>
          </div>
        )}
         {!recommendations && !isLoading && !error && (
           <p className="text-muted-foreground">No recommendations available yet. Keep browsing!</p>
         )}
      </CardContent>
    </Card>
  );
};

export default AiRecommendations;
