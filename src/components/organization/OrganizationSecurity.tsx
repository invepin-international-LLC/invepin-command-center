import React from 'react';
import { useOrganization } from '@/components/auth/OrganizationProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Users, Database, Eye } from 'lucide-react';

export function OrganizationSecurity() {
  const { organization, isLoading } = useOrganization();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Organization Security</CardTitle>
          <CardDescription>Loading security information...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!organization) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Organization Security</CardTitle>
          <CardDescription>No organization data available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Data Isolation Security
          </CardTitle>
          <CardDescription>
            Your organization's data is completely isolated from other clients
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Organization ID:</span>
            <Badge variant="secondary">{organization.id}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium">Organization Name:</span>
            <Badge variant="outline">{organization.name}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium">Data Protection:</span>
            <Badge variant="default" className="bg-green-600">
              <Shield className="h-3 w-3 mr-1" />
              Fully Isolated
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Database className="h-4 w-4" />
              Inventory Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              All inventory data is scoped to your organization ID. Other clients cannot access your inventory even if they scan barcodes in your building.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Staff Access Control
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Chat messages and staff communications are limited to your organization members only. Role-based permissions apply.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Audit Trail
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              All security logs and camera access are isolated by organization. Complete audit trail for compliance.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}