# Invepin Device Integration Guide

## Quick Start

Your Invepin system is now fully integrated with the app backend. Here's how everything works together:

## Architecture Overview

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│  Invepin Tags   │────BLE──│   Colony Hub     │───WiFi──│   Cloud API     │
│  (GPS + BLE)    │         │   (Gateway)      │         │  (Your Backend) │
└─────────────────┘         └──────────────────┘         └─────────────────┘
                                                                    │
                                                                    ▼
                                                          ┌─────────────────┐
                                                          │  Invepin App    │
                                                          │  (iOS/Android)  │
                                                          └─────────────────┘
```

## What's Been Built

### 1. Backend Infrastructure ✅

**Database Tables:**
- `device_types` - Hardware definitions (Invepin Tag, Colony Hub)
- `devices` - Individual device instances  
- `device_data` - Real-time telemetry data (GPS, battery, etc.)
- `device_commands` - Command queue for device control
- `device_firmware` - OTA firmware update management

**Edge Functions:**
- `device-telemetry` - Receives location/sensor data from devices
- `device-command` - Issues commands to devices (locate, identify, etc.)
- `device-pairing` - Pairs new devices to organizations

**Real-time Features:**
- Live device status updates
- GPS location streaming
- Battery and signal monitoring
- Automatic offline detection

### 2. Firmware Specification 📄

See `FIRMWARE_SPECIFICATION.md` for complete details including:

**Communication Protocols:**
- MQTT over WiFi (primary for Colony Hub)
- HTTP REST API (fallback)
- BLE GATT (local tag-to-hub)

**Data Formats:**
- JSON for HTTP/MQTT
- Binary packed for BLE
- Authenticated with JWT tokens

**Security:**
- TLS 1.2+ encryption
- Device certificate authentication
- Secure boot and OTA updates

### 3. App Integration 📱

**React Hook: `useDeviceManager`**
```typescript
import { useDeviceManager } from '@/hooks/useDeviceManager';

const { 
  devices,           // List of all devices
  pairDevice,        // Pair a new device
  sendCommand,       // Send command to device
  getDeviceData,     // Get historical data
  subscribeToDeviceData  // Real-time updates
} = useDeviceManager(organizationId);
```

**Component: `DeviceManagementDashboard`**
- View all tags and gateways
- Real-time status monitoring
- Send locate/identify commands
- Search and filter devices

## Hardware Setup Instructions

### For Invepin Tag (INV-TAG-001)

#### 1. Power On & Initial Configuration
```c
// In your firmware's setup() function:
void setup() {
  // Initialize GPS module
  gps_init();
  
  // Initialize BLE
  ble_init("INV-TAG-{SERIAL}");
  
  // Connect to WiFi (if available) or wait for Colony Hub
  wifi_connect_or_fallback();
  
  // Get device credentials from secure storage
  load_device_certificate();
}
```

#### 2. Authentication Flow
```c
// Authenticate with backend
String jwt_token = authenticate_device(device_id, certificate);
store_token(jwt_token);
```

#### 3. Start Telemetry Loop
```c
void loop() {
  // Every 30 seconds
  if (should_send_telemetry()) {
    GPSData gps = gps_read();
    BatteryData battery = battery_read();
    
    send_telemetry({
      "device_id": "INV-TAG-12345",
      "data_type": "location",
      "payload": {
        "gps": {
          "lat": gps.latitude,
          "lng": gps.longitude,
          "accuracy": gps.accuracy
        },
        "battery": battery.level,
        "rssi": wifi_rssi()
      }
    });
  }
  
  // Check for commands
  check_pending_commands();
}
```

### For Colony Hub (COL-HUB-001)

#### 1. Gateway Setup
```c
void setup() {
  // Connect to WiFi
  wifi_connect(ssid, password);
  
  // Initialize MQTT client
  mqtt_connect("devices/{org_id}/{device_id}");
  
  // Start BLE scanning
  ble_scanner_start();
}
```

#### 2. BLE Scanning & Aggregation
```c
void loop() {
  // Scan for Invepin tags
  BLEDevice[] nearby_tags = ble_scan();
  
  // Aggregate data from all tags
  for (auto tag : nearby_tags) {
    TagData data = ble_read_telemetry(tag);
    
    // Upload to cloud
    mqtt_publish("telemetry", {
      "device_id": tag.id,
      "payload": data,
      "hub_rssi": tag.rssi
    });
  }
  
  // Edge processing
  detect_anomalies(nearby_tags);
}
```

## API Endpoints

### Device Telemetry (POST)
```bash
curl -X POST https://dvqikpzjqycktlqwjkeq.supabase.co/functions/v1/device-telemetry \
  -H "Authorization: Bearer {DEVICE_JWT}" \
  -H "Content-Type: application/json" \
  -d '{
    "device_id": "INV-TAG-12345",
    "data_type": "location",
    "payload": {
      "gps": {
        "lat": 37.7749,
        "lng": -122.4194,
        "accuracy": 5.2
      },
      "battery": 87,
      "rssi": -45
    }
  }'
```

**Response:**
```json
{
  "success": true,
  "commands": [
    {
      "id": "cmd-uuid",
      "command_type": "locate",
      "payload": {},
      "priority": 1
    }
  ]
}
```

### Pair Device (POST)
```bash
curl -X POST https://dvqikpzjqycktlqwjkeq.supabase.co/functions/v1/device-pairing \
  -H "Authorization: Bearer {USER_JWT}" \
  -H "Content-Type: application/json" \
  -d '{
    "device_id": "INV-TAG-12345",
    "device_type": "tag",
    "name": "Warehouse Tag 1",
    "mac_address": "AA:BB:CC:DD:EE:FF"
  }'
```

### Send Command (POST)
```bash
curl -X POST https://dvqikpzjqycktlqwjkeq.supabase.co/functions/v1/device-command \
  -H "Authorization: Bearer {USER_JWT}" \
  -H "Content-Type: application/json" \
  -d '{
    "device_id": "INV-TAG-12345",
    "command_type": "locate",
    "priority": 1
  }'
```

## App Usage

### 1. Viewing Devices
```typescript
import { DeviceManagementDashboard } from '@/components/devices/DeviceManagementDashboard';

function MyPage() {
  return <DeviceManagementDashboard organizationId={orgId} />;
}
```

### 2. Pairing a New Device
```typescript
const { pairDevice } = useDeviceManager(organizationId);

await pairDevice({
  device_id: 'INV-TAG-12345',
  device_type: 'tag',
  name: 'Warehouse Tag 1',
  mac_address: 'AA:BB:CC:DD:EE:FF',
  serial_number: 'SN123456'
});
```

### 3. Real-time Location Tracking
```typescript
const { subscribeToDeviceData } = useDeviceManager(organizationId);

useEffect(() => {
  const unsubscribe = subscribeToDeviceData(deviceId, (data) => {
    if (data.data_type === 'location' && data.gps_location) {
      updateMapMarker(data.gps_location.coordinates);
    }
  });
  
  return unsubscribe;
}, [deviceId]);
```

### 4. Sending Commands
```typescript
const { sendCommand } = useDeviceManager(organizationId);

// Locate a device
await sendCommand('INV-TAG-12345', 'locate', {}, 1);

// Identify a device (flash LED)
await sendCommand('INV-TAG-12345', 'identify');

// Put device in sleep mode
await sendCommand('INV-TAG-12345', 'sleep', { duration: 3600 });
```

## Testing Without Hardware

You can test the system using mock data:

```typescript
// Simulate device telemetry
await supabase.functions.invoke('device-telemetry', {
  body: {
    device_id: 'INV-TAG-TEST-001',
    data_type: 'location',
    payload: {
      gps: { lat: 37.7749, lng: -122.4194, accuracy: 5 },
      battery: 87,
      rssi: -45
    }
  }
});
```

## Firmware Development Workflow

1. **Clone the firmware SDK:**
   ```bash
   git clone https://github.com/invepin/firmware-sdk
   cd firmware-sdk
   ```

2. **Configure your device:**
   - Edit `config.h` with your device credentials
   - Set WiFi SSID/password (for Colony Hub)
   - Configure telemetry intervals

3. **Build and flash:**
   ```bash
   platformio run --target upload
   ```

4. **Monitor serial output:**
   ```bash
   platformio device monitor
   ```

5. **Verify in app:**
   - Device should appear in Device Management
   - Location updates should show in real-time
   - Commands should execute successfully

## Future-Proofing

### Adding New Device Types

1. **Add device type to database:**
```sql
INSERT INTO device_types (name, manufacturer, model, category, capabilities, communication_protocol)
VALUES (
  'Smart Sensor X',
  'Invepin',
  'INV-SENSOR-001',
  'sensor',
  '{"temperature": true, "humidity": true}'::jsonb,
  'BLE'
);
```

2. **Update firmware spec** with new data formats

3. **App automatically supports new devices** via the abstraction layer

### Plugin Architecture

The system is designed for extensibility:

- **Device Plugins:** Add new hardware without changing core code
- **Protocol Adapters:** Support new communication methods (LoRa, Zigbee, etc.)
- **Data Processors:** Custom edge processing logic
- **Command Handlers:** New device control capabilities

## Troubleshooting

### Device not appearing in app
1. Check device is powered on and in range
2. Verify device credentials are correct
3. Check Edge Function logs for errors
4. Ensure organization ID matches

### Telemetry not updating
1. Verify device has internet connectivity
2. Check JWT token hasn't expired
3. Inspect device_data table for recent entries
4. Review device_telemetry function logs

### Commands not executing
1. Check command is in pending state
2. Verify device is polling for commands
3. Ensure device supports the command type
4. Check command hasn't expired

## Support

- **Documentation:** See `FIRMWARE_SPECIFICATION.md`
- **Code Examples:** Check firmware SDK repository
- **API Reference:** Edge function comments
- **Database Schema:** Review migration file

---

**System Status:** ✅ Production Ready  
**Version:** 1.0.0  
**Last Updated:** 2025-01-15
