export interface InventoryItem {
  id: string;
  name: string;
  brand: string;
  category: 'spirits' | 'wine' | 'beer' | 'mixers' | 'garnish' | 'supplies';
  sku: string;
  barcode?: string;
  currentStock: number;
  unit: 'bottles' | 'liters' | 'cases' | 'units' | 'kg';
  minThreshold: number;
  maxThreshold: number;
  costPerUnit: number;
  supplierPrice: number;
  sellPrice: number;
  profitMargin: number;
  supplier: Supplier;
  lastRestocked: string;
  expiryDate?: string;
  location: string;
  isActive: boolean;
  pourSpoutId?: string; // Connected BLE sensor
  totalPoured?: number; // ML poured this period
  estimatedRemaining?: number; // ML remaining
}

export interface Supplier {
  id: string;
  name: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  paymentTerms: string;
  deliveryDays: number[];
  minimumOrder: number;
  isPreferred: boolean;
  rating: number;
  lastOrderDate?: string;
}

export interface ReorderAlert {
  id: string;
  itemId: string;
  itemName: string;
  currentStock: number;
  minThreshold: number;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  suggestedQuantity: number;
  estimatedCost: number;
  supplier: Supplier;
  predictedStockout: string; // Date when stock will run out
  createdAt: string;
  acknowledged: boolean;
}

export interface StockMovement {
  id: string;
  itemId: string;
  type: 'in' | 'out' | 'adjustment' | 'waste' | 'pour';
  quantity: number;
  reason: string;
  cost?: number;
  userId: string;
  timestamp: string;
  orderId?: string;
  deviceId?: string; // For automatic pour tracking
}

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplier: Supplier;
  items: OrderItem[];
  totalCost: number;
  status: 'draft' | 'sent' | 'confirmed' | 'shipped' | 'delivered' | 'completed';
  orderDate: string;
  expectedDelivery: string;
  actualDelivery?: string;
  notes?: string;
  createdBy: string;
}

export interface OrderItem {
  itemId: string;
  itemName: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
}

export interface InventoryAnalytics {
  totalValue: number;
  totalItems: number;
  lowStockItems: number;
  criticalStockItems: number;
  overStockItems: number;
  monthlyCost: number;
  monthlyRevenue: number;
  profitMargin: number;
  turnoverRate: number;
  wastageValue: number;
  topSellingItems: { item: InventoryItem; revenue: number; volume: number }[];
  categoryBreakdown: { category: string; value: number; count: number }[];
  supplierPerformance: { supplier: Supplier; onTimeDelivery: number; totalOrders: number }[];
}

export interface InventorySettings {
  autoReorderEnabled: boolean;
  reorderLeadTimeDays: number;
  safetyStockMultiplier: number;
  lowStockAlertEmail: boolean;
  criticalStockAlertSMS: boolean;
  defaultMarkupPercentage: number;
  wastageThresholdPercentage: number;
  inventoryCountFrequency: 'daily' | 'weekly' | 'monthly';
}