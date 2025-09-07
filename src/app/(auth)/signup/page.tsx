import { AuthForm } from '@/components/auth-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Lightbulb, Pen } from 'lucide-react';
import Link from 'next/link';

const Logo = () => (
  <Link href="/" className="flex items-center justify-center gap-2 mb-8">
    <div className="relative">
      <Lightbulb className="w-10 h-10 text-primary" />
      <Pen className="w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary-foreground fill-primary" />
    </div>
    <span className="text-3xl font-bold tracking-tight">Inkling Notes</span>
  </Link>
);

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <Logo />
          <CardTitle>Create an account</CardTitle>
          <CardDescription>Start organizing your thoughts today.</CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForm mode="signup" />
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
