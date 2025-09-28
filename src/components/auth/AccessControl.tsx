import React from 'react';
import { useSecurity } from './SecurityProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle } from 'lucide-react';

interface AccessControlProps {
  requiredRoles?: string[];
  requiredPermissions?: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AccessControl({ 
  requiredRoles = [], 
  requiredPermissions = [], 
  children, 
  fallback 
}: AccessControlProps) {
  const { userRole, hasPermission, isAuthorized } = useSecurity();

  // Check role authorization
  const roleAuthorized = requiredRoles.length === 0 || isAuthorized(requiredRoles);
  
  // Check permission authorization
  const permissionAuthorized = requiredPermissions.length === 0 || 
    requiredPermissions.every(permission => hasPermission(permission));

  if (!roleAuthorized || !permissionAuthorized) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <Card className="border-danger/20 bg-gradient-card">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center">
            <Shield className="h-6 w-6 text-danger" />
          </div>
          <CardTitle className="text-danger">Access Restricted</CardTitle>
          <CardDescription>
            You don't have permission to access this feature.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-3">
          <div className="flex flex-wrap gap-2 justify-center">
            {requiredRoles.length > 0 && (
              <Badge variant="outline" className="border-warning text-warning">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Requires: {requiredRoles.join(' or ')}
              </Badge>
            )}
            {requiredPermissions.length > 0 && (
              <Badge variant="outline" className="border-warning text-warning">
                <Shield className="w-3 h-3 mr-1" />
                Permissions: {requiredPermissions.join(', ')}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Current Role: <Badge variant="secondary">{userRole || 'None'}</Badge>
          </p>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
}