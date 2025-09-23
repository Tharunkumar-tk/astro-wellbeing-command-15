import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Satellite, Shield } from 'lucide-react';
import spaceStationBg from '@/assets/space-station-bg.jpg';

const Login = () => {
  const [astronautId, setAstronautId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate authentication - in real app would validate credentials
    if (astronautId && password) {
      navigate('/');
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: `linear-gradient(rgba(34, 34, 47, 0.85), rgba(34, 34, 47, 0.85)), url(${spaceStationBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 bg-primary/10 rounded-full">
              <Satellite className="h-12 w-12 text-primary" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">AstroBot</h1>
            <p className="text-lg text-muted-foreground">Bhartiya Antariksh Station</p>
            <p className="text-sm text-muted-foreground">Crew Well-being AI Assistant</p>
          </div>
        </div>

        {/* Login Form */}
        <Card className="glow-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Secure Access
            </CardTitle>
            <CardDescription>
              Enter your astronaut credentials to access mission control
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="astronaut-id">Astronaut ID</Label>
                <Input
                  id="astronaut-id"
                  type="text"
                  placeholder="e.g. AST-001"
                  value={astronautId}
                  onChange={(e) => setAstronautId(e.target.value)}
                  className="bg-input border-border"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-input border-border"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full btn-primary-action"
                disabled={!astronautId || !password}
              >
                Access Mission Control
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground">
          <p>Bhartiya Antariksh Station • Mission Control Interface</p>
          <p className="mt-1">Authorized Personnel Only</p>
        </div>
      </div>
    </div>
  );
};

export default Login;