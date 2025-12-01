import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useOrganization } from '@/components/auth/OrganizationProvider';
import { InventoryItem, StockMovement, InventoryAnalytics } from '@/types/inventory';
import { toast } from '@/hooks/use-toast';

export function useOrganizationInventory() {
  const { organization } = useOrganization();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [analytics, setAnalytics] = useState<InventoryAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadInventoryData = useCallback(async () => {
    if (!organization) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      // Load inventory items for the organization (cast to any for future table creation)
      const { data: inventoryData, error: inventoryError } = await (supabase as any)
        .from('inventory_items')
        .select('*')
        .eq('organization_id', organization.id)
        .order('name');

      if (inventoryError) throw inventoryError;

      // Load stock movements for the organization
      const { data: movementsData, error: movementsError } = await (supabase as any)
        .from('stock_movements')
        .select(`
          *,
          inventory_items!inner(name, category)
        `)
        .eq('organization_id', organization.id)
        .order('created_at', { ascending: false })
        .limit(100);

      if (movementsError) throw movementsError;

      setInventory(inventoryData || []);
      setStockMovements(movementsData || []);
      
      // Calculate analytics
      if (inventoryData) {
        calculateAnalytics(inventoryData);
      }
    } catch (error: any) {
      console.error('Error loading inventory data:', error);
      toast({
        title: "Error",
        description: "Failed to load inventory data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [organization]);

  const calculateAnalytics = useCallback((items: InventoryItem[]) => {
    const totalValue = items.reduce((sum, item) => sum + (item.currentStock * item.costPerUnit), 0);
    const lowStockCount = items.filter(item => item.currentStock <= item.minThreshold).length;
    const outOfStockCount = items.filter(item => item.currentStock === 0).length;
    const criticalStockCount = items.filter(item => item.currentStock < item.minThreshold * 0.5).length;
    
    const analytics: InventoryAnalytics = {
      totalValue,
      totalItems: items.length,
      lowStockItems: lowStockCount,
      criticalStockItems: criticalStockCount,
      overStockItems: items.filter(item => item.currentStock > item.maxThreshold).length,
      monthlyCost: 0, // Would need historical data
      monthlyRevenue: 0, // Would need historical data
      profitMargin: 0, // Would need historical data
      turnoverRate: 0, // Would need historical data
      wastageValue: 0, // Would need wastage tracking
      topSellingItems: items
        .sort((a, b) => (b.totalPoured || 0) - (a.totalPoured || 0))
        .slice(0, 5)
        .map(item => ({
          item,
          revenue: (item.totalPoured || 0) * item.sellPrice / 1000, // Convert ML to liters
          volume: item.totalPoured || 0
        })),
      categoryBreakdown: [],
      supplierPerformance: []
    };

    setAnalytics(analytics);
  }, []);

  const updateStock = useCallback(async (
    itemId: string, 
    quantity: number, 
    reason: string, 
    type: 'in' | 'out' | 'adjustment' = 'adjustment'
  ): Promise<void> => {
    if (!organization) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get current item data
      const item = inventory.find(i => i.id === itemId);
      if (!item) throw new Error('Item not found');

      const newStock = type === 'out' 
        ? Math.max(0, item.currentStock - quantity)
        : item.currentStock + quantity;

      // Update inventory item (using database field names, cast for future table)
      const { error: updateError } = await (supabase as any)
        .from('inventory_items')
        .update({ 
          current_stock: newStock,
          updated_at: new Date().toISOString()
        })
        .eq('id', itemId)
        .eq('organization_id', organization.id);

      if (updateError) throw updateError;

      // Record stock movement
      const { error: movementError } = await (supabase as any)
        .from('stock_movements')
        .insert({
          organization_id: organization.id,
          item_id: itemId,
          user_id: user.id,
          movement_type: type,
          quantity: type === 'out' ? -quantity : quantity,
          reason,
          created_at: new Date().toISOString()
        });

      if (movementError) throw movementError;

      // Refresh data
      await loadInventoryData();

      toast({
        title: "Stock Updated",
        description: `${item.name} stock updated successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [organization, inventory, loadInventoryData]);

  const processPouredItem = useCallback(async (itemId: string, amountML: number): Promise<void> => {
    await updateStock(itemId, amountML / 1000, 'Poured drink', 'out');
  }, [updateStock]);

  useEffect(() => {
    loadInventoryData();
  }, [loadInventoryData]);

  return {
    inventory,
    stockMovements,
    analytics,
    isLoading,
    updateStock,
    processPouredItem,
    refreshData: loadInventoryData
  };
}