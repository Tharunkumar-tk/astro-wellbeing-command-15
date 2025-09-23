import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="p-4 bg-destructive/10 rounded-full">
            <AlertTriangle className="h-16 w-16 text-destructive" />
          </div>
        </div>
        <div>
          <h1 className="mb-4 text-6xl font-bold text-foreground">404</h1>
          <h2 className="mb-4 text-2xl font-semibold text-foreground">Access Denied</h2>
          <p className="mb-6 text-lg text-muted-foreground">The requested station module could not be found</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Error Code: MODULE_NOT_FOUND</p>
          <p className="text-sm text-muted-foreground">Mission Day 124 • {new Date().toISOString().split('T')[0]}</p>
        </div>
        <Button 
          asChild 
          className="btn-primary-action"
        >
          <a href="/">Return to Mission Control</a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
