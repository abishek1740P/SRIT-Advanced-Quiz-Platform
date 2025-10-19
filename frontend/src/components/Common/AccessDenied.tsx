// src/components/Common/AccessDenied.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AccessDeniedProps {
  userRole?: string;
  onRedirect: () => void;
  requiredRole: string;
}

export function AccessDenied({ userRole, onRedirect, requiredRole }: AccessDeniedProps) {
  const getRoleDashboardName = (role?: string) => {
    switch (role) {
      case 'teacher': return 'Teacher Dashboard';
      case 'admin': return 'Admin Dashboard';
      case 'student': return 'Student Dashboard';
      default: return 'Login Page';
    }
  };

  const getDashboardPath = (role?: string) => {
    switch (role) {
      case 'teacher': return '/dashboard/teacher';
      case 'admin': return '/dashboard/admin';
      case 'student': return '/dashboard/student';
      default: return '/auth/login';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center p-4">
      <Card className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-red-400 text-center">
            Access Denied
          </CardTitle>
          <CardDescription className="text-slate-300 text-center mt-2">
            This area is restricted to {requiredRole}s only.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <p className="text-slate-400">
              Your role: <span className="text-yellow-400 font-medium capitalize">{userRole || 'Unknown'}</span>
            </p>
            <p className="text-slate-400 text-sm">
              You don't have permission to access the student dashboard.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Button 
              onClick={onRedirect}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Go to {getRoleDashboardName(userRole)}
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.location.href = '/auth/login'}
              className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Sign in with different account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}