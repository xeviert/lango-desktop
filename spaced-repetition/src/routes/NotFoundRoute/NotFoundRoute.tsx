import { Link } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function NotFoundRoute() {
  return (
    <section className="flex items-center justify-center mt-20 px-6">
      <Card className="max-w-sm w-full text-center">
        <CardContent className="pt-8 pb-8 flex flex-col items-center gap-4">
          <FileQuestion className="w-16 h-16 text-gray-400" />
          <h2 className="text-2xl font-extrabold text-gray-800">404 - Page not found</h2>
          <p className="text-gray-500">The page you're looking for doesn't exist.</p>
          <Button variant="gradient" asChild>
            <Link to="/">Go Home</Link>
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
