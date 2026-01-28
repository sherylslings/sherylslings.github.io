import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const loginSchema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const AdminLogin = () => {
  const navigate = useNavigate();
  const { signIn, signUp, signOut, user, isAdmin, loading } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (!loading && user && isAdmin) {
      navigate('/admin/dashboard');
    }
  }, [user, isAdmin, loading, navigate]);

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);

    try {
      if (isSignUp) {
        const { data: signUpData, error } = await signUp(data.email, data.password);
        if (error) {
          toast({ variant: 'destructive', title: 'Signup Failed', description: error.message });
          return;
        }

        // If email auto-confirm is enabled, Supabase may sign the user in immediately.
        // Since they won't have admin permissions yet, we sign them out to avoid a "stuck" state.
        if (signUpData?.session) {
          await signOut();
        }

        toast({
          title: 'Account Created!',
          description: signUpData?.session
            ? 'Ask the site owner to grant admin access, then sign in.'
            : 'Check your email to confirm your account, then ask the site owner to grant admin access.',
        });
        setIsSignUp(false);
      } else {
        const { error } = await signIn(data.email, data.password);
        if (error) {
          toast({ variant: 'destructive', title: 'Login Failed', description: error.message });
          return;
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // Signed in, but not an admin yet → explain what to do instead of looking "stuck".
  if (user && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-accent/30 p-4">
        <Card className="w-full max-w-md shadow-card">
          <CardHeader className="text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="font-serif text-2xl">Admin Access Pending</CardTitle>
            <CardDescription>
              You’re signed in as <span className="font-medium">{user.email}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This account doesn’t have admin permissions yet. Ask the site owner to grant the admin role.
              After that, sign out here and sign back in.
            </p>
            <Button
              type="button"
              className="w-full"
              onClick={async () => {
                await signOut();
                toast({ title: 'Signed out' });
              }}
            >
              Sign out
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-accent/30 p-4">
      <Card className="w-full max-w-md shadow-card">
        <CardHeader className="text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="font-serif text-2xl">{isSignUp ? 'Create Account' : 'Admin Login'}</CardTitle>
          <CardDescription>
            {isSignUp ? 'Sign up to request admin access' : 'Sign in to manage your inventory'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register('email')} placeholder="admin@example.com" />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...register('password')} placeholder="••••••••" />
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
            </Button>
          </form>

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-primary hover:underline"
            >
              {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
            </button>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-6">
            {isSignUp
              ? 'After signup, ask the site owner to grant admin access.'
              : 'Contact the site owner if you need admin access.'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
