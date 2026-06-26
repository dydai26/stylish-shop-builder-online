import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdmin } from '@/context/AdminContext';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'recovery'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, login, resetPassword } = useAdmin();
  const { toast } = useToast();

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/ev-control-panel" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (activeTab === 'recovery') {
        const { error } = await resetPassword(email);
        if (error) {
          toast({
            title: "Recovery Error",
            description: error,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Email Sent",
            description: "Please check your email for password recovery",
          });
        }
      } else {
        const { error } = await login(email, password);
        if (error) {
          toast({
            title: "Login Error",
            description: error,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Login Successful",
            description: "Welcome back!",
          });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-background to-muted flex items-center justify-center p-4 relative overflow-hidden">
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      {/* Decorative 3D elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-accent/20 to-brand-orange/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 transform rotate-12" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-primary/10 to-accent/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 transform -rotate-12" />
      
      <Card className="w-full max-w-md relative z-10 shadow-2xl border-0 bg-card/90 backdrop-blur-xl rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/30 to-transparent" />
        
        <CardHeader className="text-center relative z-10 pb-6">
          <CardTitle className="text-3xl font-bold text-primary mb-2">
            Admin Panel
          </CardTitle>
          <p className="text-muted-foreground">
            Sign in to access your dashboard
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6 relative z-10">
          {/* Tab Navigation */}
          <div className="flex bg-muted/80 rounded-2xl p-1">
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all ${
                activeTab === 'login'
                  ? 'bg-card text-primary shadow-md'
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('recovery')}
              className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all ${
                activeTab === 'recovery'
                  ? 'bg-card text-primary shadow-md'
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              Recovery
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 border-border focus:border-accent bg-muted/30 rounded-xl"
              />
            </div>
            
            {activeTab !== 'recovery' && (
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 pr-10 border-border focus:border-accent bg-muted/30 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-medium text-base rounded-xl shadow-lg"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Loading...
                </div>
              ) : (
                <>
                  {activeTab === 'login' && 'Sign In'}
                  {activeTab === 'recovery' && 'Reset Password'}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;