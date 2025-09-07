import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb, Pen, Search, Sparkles, Tags } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: <Pen className="w-8 h-8 text-primary" />,
    title: 'Rich Content',
    description: 'Create notes with titles and text/markdown content.',
  },
  {
    icon: <Tags className="w-8 h-8 text-primary" />,
    title: 'Smart Tagging',
    description: 'Organize your notes with tags for easy categorization.',
  },
  {
    icon: <Search className="w-8 h-8 text-primary" />,
    title: 'Powerful Search',
    description: 'Quickly find notes with keyword search and tag filters.',
  },
  {
    icon: <Sparkles className="w-8 h-8 text-primary" />,
    title: 'AI Suggestions',
    description: 'Get AI-powered tag suggestions based on your note content.',
  },
];

const Logo = () => (
  <div className="flex items-center justify-center gap-2">
    <div className="relative">
      <Lightbulb className="w-12 h-12 text-primary" />
      <Pen className="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary-foreground fill-primary" />
    </div>
    <span className="text-4xl font-bold tracking-tight">Inkling Notes</span>
  </div>
);

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Logo />
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-grow">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 text-center py-20 sm:py-32">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
            Capture Your Thoughts, Connect Your Ideas.
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
            Inkling Notes is a minimal, beautiful, and powerful tool to help you
            organize your knowledge and spark new insights.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/signup">Start for Free</Link>
            </Button>
          </div>
        </section>

        <section className="bg-muted/50 py-20 sm:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight">
                Everything You Need for a Personal Journal
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                All the features you need, and none that you don't.
              </p>
            </div>
            <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <Card key={feature.title} className="text-center shadow-md">
                  <CardContent className="p-6 flex flex-col items-center">
                    <div className="bg-primary/10 p-4 rounded-full mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="mt-2 text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Inkling Notes. All rights reserved.</p>
      </footer>
    </div>
  );
}
