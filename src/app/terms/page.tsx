import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Button variant="outline" asChild className="mb-6 border-primary text-primary hover:bg-primary/10 hover:text-primary">
          <Link href="/signup">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Sign Up
          </Link>
        </Button>
      <Card className="glass-card">
        <CardHeader className="text-center">
          <FileText className="mx-auto h-12 w-12 text-primary mb-4" />
          <CardTitle className="text-3xl font-bold text-primary text-glow-primary">Terms and Conditions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-foreground/80">
          <h2 className="text-xl font-semibold text-accent">1. Introduction</h2>
          <p>Welcome to GamblrNation Hub. By accessing or using our platform, you agree to be bound by these terms and conditions. Please read them carefully.</p>
          
          <h2 className="text-xl font-semibold text-accent">2. User Accounts</h2>
          <p>You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.</p>
          
          <h2 className="text-xl font-semibold text-accent">3. User Conduct</h2>
          <p>You agree not to use the platform for any unlawful purpose or any purpose prohibited under this clause. You agree not to use the platform in any way that could damage the platform, services, or general business of GamblrNation Hub.</p>
          
          <h2 className="text-xl font-semibold text-accent">4. Intellectual Property</h2>
          <p>All content present on this platform is the exclusive property of GamblrNation Hub or its licensors. This includes, but is not limited to, text, graphics, logos, icons, images, audio clips, digital downloads, and software.</p>
          
          <h2 className="text-xl font-semibold text-accent">5. Limitation of Liability</h2>
          <p>GamblrNation Hub shall not be liable for any damages that occur as a result of your use of the platform.</p>
          
          <h2 className="text-xl font-semibold text-accent">6. Changes to Terms</h2>
          <p>We reserve the right to modify these terms at any time. We will notify users of any changes by posting the new terms on this page.</p>
          
          <p className="mt-6 text-sm text-muted-foreground">This is a placeholder for terms and conditions. In a real application, this section would contain detailed legal information.</p>
        </CardContent>
      </Card>
    </div>
  );
}
