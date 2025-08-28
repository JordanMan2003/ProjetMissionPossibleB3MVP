import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/UserContext';
import { useToast } from '@/components/ui/use-toast';

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    toast({
      title: "Accès refusé",
      description: "Veuillez vous connecter pour accéder à l'administration",
      variant: "destructive"
    });
    return <Navigate to="/login" replace />;
  }

  // Redirect to dashboard if not admin
  const isAdmin = user.role === 'ADMIN' || (user.userType && user.userType.toUpperCase() === 'ADMIN');
  if (!isAdmin) {
    toast({
      title: "Accès refusé",
      description: "Vous devez être administrateur pour accéder à cette page",
      variant: "destructive"
    });
    return <Navigate to="/dashboard" replace />;
  }

  // Render admin content if authenticated and admin
  return children;
};

export default AdminRoute;

