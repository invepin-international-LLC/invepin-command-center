import { useState, useEffect, useCallback } from 'react';
import { InventoryItem, ReorderAlert, StockMovement, PurchaseOrder, InventoryAnalytics, Supplier } from '@/types/inventory';
import { useToast } from '@/hooks/use-toast';

export const useInventoryManagement = () => {
  const { toast } = useToast();
  
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [reorderAlerts, setReorderAlerts] = useState<ReorderAlert[]>([]);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [analytics, setAnalytics] = useState<InventoryAnalytics | null>(null);

  // Mock suppliers
  const mockSuppliers: Supplier[] = [
    {
      id: 'sup1',
      name: 'Premium Spirits Co.',
      contactEmail: 'orders@premiumspirits.com',
      contactPhone: '+1-555-0123',
      address: '123 Distillery Ave, New York, NY',
      paymentTerms: 'Net 30',
      deliveryDays: [1, 3, 5], // Mon, Wed, Fri
      minimumOrder: 500,
      isPreferred: true,
      rating: 4.8,
      lastOrderDate: '2024-01-15'
    },
    {
      id: 'sup2', 
      name: 'Local Wine Distributors',
      contactEmail: 'sales@localwine.com',
      contactPhone: '+1-555-0456',
      address: '456 Vineyard Rd, Napa, CA',
      paymentTerms: 'Net 15',
      deliveryDays: [2, 4], // Tue, Thu
      minimumOrder: 300,
      isPreferred: true,
      rating: 4.6,
      lastOrderDate: '2024-01-12'
    }
  ];

  // Mock inventory data
  useEffect(() => {
    const mockInventory: InventoryItem[] = [
      {
        id: 'inv1',
        name: 'Grey Goose Vodka',
        brand: 'Grey Goose',
        category: 'spirits',
        sku: 'GG-VOD-750',
        barcode: '3760070281176',
        currentStock: 8,
        unit: 'bottles',
        minThreshold: 12,
        maxThreshold: 48,
        costPerUnit: 35.50,
        supplierPrice: 35.50,
        sellPrice: 65.00,
        profitMargin: 45.4,
        supplier: mockSuppliers[0],
        lastRestocked: '2024-01-10',
        location: 'Bar Shelf A1',
        isActive: true,
        pourSpoutId: 'ble-001',
        totalPoured: 2250,
        estimatedRemaining: 3750
      },
      {
        id: 'inv2',
        name: 'Macallan 18',
        brand: 'Macallan',
        category: 'spirits',
        sku: 'MAC-18-700',
        barcode: '5010314700072',
        currentStock: 3,
        unit: 'bottles',
        minThreshold: 6,
        maxThreshold: 18,
        costPerUnit: 450.00,
        supplierPrice: 450.00,
        sellPrice: 850.00,
        profitMargin: 47.1,
        supplier: mockSuppliers[0],
        lastRestocked: '2024-01-05',
        location: 'Premium Cabinet B2',
        isActive: true,
        pourSpoutId: 'ble-002',
        totalPoured: 1400,
        estimatedRemaining: 2100
      },
      {
        id: 'inv3',
        name: 'Hendricks Gin',
        brand: 'Hendricks',
        category: 'spirits',
        sku: 'HEN-GIN-700',
        barcode: '5060194550023',
        currentStock: 15,
        unit: 'bottles',
        minThreshold: 10,
        maxThreshold: 30,
        costPerUnit: 28.75,
        supplierPrice: 28.75,
        sellPrice: 52.00,
        profitMargin: 44.7,
        supplier: mockSuppliers[0],
        lastRestocked: '2024-01-08',
        location: 'Bar Shelf A2',
        isActive: true,
        totalPoured: 850,
        estimatedRemaining: 9150
      },
      {
        id: 'inv4',
        name: 'Fresh Lime',
        brand: 'Local Farm',
        category: 'garnish',
        sku: 'LIME-FRESH',
        currentStock: 2,
        unit: 'kg',
        minThreshold: 5,
        maxThreshold: 15,
        costPerUnit: 4.50,
        supplierPrice: 4.50,
        sellPrice: 0.75, // per lime
        profitMargin: 66.7,
        supplier: mockSuppliers[1],
        lastRestocked: '2024-01-14',
        expiryDate: '2024-01-20',
        location: 'Refrigerator',
        isActive: true
      }
    ];

    const mockReorderAlerts: ReorderAlert[] = [
      {
        id: 'alert1',
        itemId: 'inv1',
        itemName: 'Grey Goose Vodka',
        currentStock: 8,
        minThreshold: 12,
        urgency: 'medium',
        suggestedQuantity: 24,
        estimatedCost: 852.00,
        supplier: mockSuppliers[0],
        predictedStockout: '2024-01-22',
        createdAt: '2024-01-16',
        acknowledged: false
      },
      {
        id: 'alert2',
        itemId: 'inv2',
        itemName: 'Macallan 18',
        currentStock: 3,
        minThreshold: 6,
        urgency: 'high',
        suggestedQuantity: 12,
        estimatedCost: 5400.00,
        supplier: mockSuppliers[0],
        predictedStockout: '2024-01-19',
        createdAt: '2024-01-16',
        acknowledged: false
      },
      {
        id: 'alert3',
        itemId: 'inv4',
        itemName: 'Fresh Lime',
        currentStock: 2,
        minThreshold: 5,
        urgency: 'critical',
        suggestedQuantity: 10,
        estimatedCost: 45.00,
        supplier: mockSuppliers[1],
        predictedStockout: '2024-01-17',
        createdAt: '2024-01-16',
        acknowledged: false
      }
    ];

    setInventory(mockInventory);
    setSuppliers(mockSuppliers);
    setReorderAlerts(mockReorderAlerts);
    
    // Calculate analytics
    calculateAnalytics(mockInventory);
  }, []);

  const calculateAnalytics = useCallback((items: InventoryItem[]) => {
    const totalValue = items.reduce((sum, item) => sum + (item.currentStock * item.costPerUnit), 0);
    const totalItems = items.length;
    const lowStockItems = items.filter(item => item.currentStock <= item.minThreshold).length;
    const criticalStockItems = items.filter(item => item.currentStock <= item.minThreshold * 0.5).length;
    const overStockItems = items.filter(item => item.currentStock >= item.maxThreshold).length;

    const analytics: InventoryAnalytics = {
      totalValue,
      totalItems,
      lowStockItems,
      criticalStockItems,
      overStockItems,
      monthlyCost: 15420.50, // Mock
      monthlyRevenue: 28975.30, // Mock
      profitMargin: 46.8,
      turnoverRate: 3.2,
      wastageValue: 245.80,
      topSellingItems: items.slice(0, 3).map(item => ({
        item,
        revenue: item.sellPrice * (item.totalPoured || 0) / 30, // Mock calculation
        volume: item.totalPoured || 0
      })),
      categoryBreakdown: [
        { category: 'spirits', value: 12850.50, count: 3 },
        { category: 'garnish', value: 125.30, count: 1 },
        { category: 'mixers', value: 450.75, count: 2 }
      ],
      supplierPerformance: mockSuppliers.map(supplier => ({
        supplier,
        onTimeDelivery: 92.5,
        totalOrders: 24
      }))
    };

    setAnalytics(analytics);
  }, []);

  const updateStock = useCallback((itemId: string, quantity: number, reason: string, type: 'in' | 'out' | 'adjustment' = 'adjustment') => {
    setInventory(prev => prev.map(item => {
      if (item.id === itemId) {
        const newStock = type === 'out' ? item.currentStock - quantity : item.currentStock + quantity;
        return { ...item, currentStock: Math.max(0, newStock) };
      }
      return item;
    }));

    // Add stock movement record
    const movement: StockMovement = {
      id: `mov-${Date.now()}`,
      itemId,
      type,
      quantity,
      reason,
      userId: 'current-user',
      timestamp: new Date().toISOString()
    };

    setStockMovements(prev => [movement, ...prev.slice(0, 99)]); // Keep last 100

    toast({
      title: "Stock Updated",
      description: `${type === 'in' ? 'Added' : 'Removed'} ${quantity} units - ${reason}`,
    });
  }, [toast]);

  const acknowledgeReorderAlert = useCallback((alertId: string) => {
    setReorderAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  }, []);

  const createPurchaseOrder = useCallback((items: { itemId: string; quantity: number }[], supplierId: string) => {
    const supplier = suppliers.find(s => s.id === supplierId);
    if (!supplier) return;

    const orderItems: any[] = items.map(orderItem => {
      const inventoryItem = inventory.find(inv => inv.id === orderItem.itemId);
      if (!inventoryItem) return null;
      
      return {
        itemId: orderItem.itemId,
        itemName: inventoryItem.name,
        quantity: orderItem.quantity,
        unitCost: inventoryItem.supplierPrice,
        totalCost: orderItem.quantity * inventoryItem.supplierPrice
      };
    }).filter(Boolean);

    const totalCost = orderItems.reduce((sum, item) => sum + item.totalCost, 0);

    const purchaseOrder: PurchaseOrder = {
      id: `po-${Date.now()}`,
      orderNumber: `PO${Date.now().toString().slice(-6)}`,
      supplier,
      items: orderItems,
      totalCost,
      status: 'draft',
      orderDate: new Date().toISOString(),
      expectedDelivery: new Date(Date.now() + supplier.deliveryDays[0] * 24 * 60 * 60 * 1000).toISOString(),
      createdBy: 'current-user'
    };

    setPurchaseOrders(prev => [purchaseOrder, ...prev]);

    toast({
      title: "Purchase Order Created",
      description: `Order ${purchaseOrder.orderNumber} for $${totalCost.toFixed(2)}`,
    });

    return purchaseOrder;
  }, [suppliers, inventory, toast]);

  const processPouredItem = useCallback((itemId: string, amountML: number) => {
    setInventory(prev => prev.map(item => {
      if (item.id === itemId && item.estimatedRemaining) {
        const newRemaining = item.estimatedRemaining - amountML;
        const bottleCapacityML = 750; // Standard bottle
        const newStock = Math.floor(newRemaining / bottleCapacityML);
        
        return {
          ...item,
          estimatedRemaining: Math.max(0, newRemaining),
          currentStock: Math.max(0, newStock),
          totalPoured: (item.totalPoured || 0) + amountML
        };
      }
      return item;
    }));

    // Record pour movement
    const movement: StockMovement = {
      id: `pour-${Date.now()}`,
      itemId,
      type: 'pour',
      quantity: amountML / 1000, // Convert to liters
      reason: 'Automatic pour detection',
      userId: 'system',
      timestamp: new Date().toISOString(),
      deviceId: inventory.find(item => item.id === itemId)?.pourSpoutId
    };

    setStockMovements(prev => [movement, ...prev.slice(0, 99)]);
  }, [inventory]);

  return {
    inventory,
    reorderAlerts,
    stockMovements,
    purchaseOrders,
    suppliers,
    analytics,
    updateStock,
    acknowledgeReorderAlert,
    createPurchaseOrder,
    processPouredItem,
    calculateAnalytics: () => calculateAnalytics(inventory)
  };
};