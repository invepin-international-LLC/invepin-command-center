import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

// Device ID validation
export const DeviceIdSchema = z.string()
  .regex(/^[A-Z0-9]{8,32}$/, 'Device ID must be 8-32 alphanumeric characters')
  .trim();

// UUID validation
export const UUIDSchema = z.string()
  .uuid('Invalid UUID format');

// Telemetry validation schema
export const TelemetrySchema = z.object({
  device_id: DeviceIdSchema,
  data_type: z.enum(['sensor', 'location', 'status', 'heartbeat']),
  payload: z.object({
    battery: z.number().int().min(0).max(100).optional(),
    rssi: z.number().int().min(-120).max(0).optional(),
    temperature: z.number().min(-40).max(85).optional(),
    gps: z.object({
      lat: z.number().min(-90).max(90),
      lng: z.number().min(-180).max(180),
      accuracy: z.number().min(0).max(1000),
      altitude: z.number().min(-500).max(9000).optional(),
      speed: z.number().min(0).max(500).optional()
    }).optional()
  }).strict(),
  timestamp: z.string().datetime().optional()
});

// Device command validation schema
export const DeviceCommandSchema = z.object({
  device_id: DeviceIdSchema,
  command_type: z.enum(['locate', 'identify', 'firmware_update', 'reset', 'configure']),
  payload: z.record(z.any()).optional(),
  priority: z.number().int().min(0).max(10).default(0),
  expires_in: z.number().int().min(60).max(86400).optional()
});

// Device pairing validation schema
export const PairingSchema = z.object({
  device_id: DeviceIdSchema,
  device_type: z.string().min(1).max(50),
  name: z.string().trim().min(1).max(100).optional(),
  mac_address: z.string().regex(/^([0-9A-F]{2}[:-]){5}[0-9A-F]{2}$/i, 'Invalid MAC address format').optional(),
  serial_number: z.string().trim().max(50).optional(),
  metadata: z.record(z.any()).optional()
});

// AI analysis validation schema
export const AIAnalysisSchema = z.object({
  analysisType: z.enum(['theft_detection', 'inventory_prediction', 'anomaly_detection']),
  organizationId: UUIDSchema,
  data: z.record(z.any())
});
