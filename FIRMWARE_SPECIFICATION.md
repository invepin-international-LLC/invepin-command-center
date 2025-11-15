# Invepin IoT Firmware Specification

## Overview
This document specifies the communication protocol and firmware requirements for Invepin hardware devices (BLE tags and Colony Hub gateways) to integrate with the Invepin app ecosystem.

## Device Types

### 1. Invepin BLE Tag (INV-TAG-001)
**Capabilities:**
- BLE 5.0 communication
- GPS positioning
- 3-axis accelerometer
- Temperature sensor
- Battery monitoring
- Low-power sleep modes

### 2. Colony Hub Gateway (COL-HUB-001)
**Capabilities:**
- WiFi connectivity
- BLE scanning (supports 100+ concurrent devices)
- Edge processing
- Local data storage
- MQTT client
- OTA firmware updates

---

## Communication Protocols

### Protocol 1: MQTT over WiFi (Colony Hub Primary)

**Broker:** Lovable Cloud MQTT Broker
**Port:** 8883 (TLS)

#### Topics Structure:
```
devices/{organization_id}/{device_id}/telemetry
devices/{organization_id}/{device_id}/commands
devices/{organization_id}/{device_id}/status
```

#### Authentication:
- TLS 1.2+ required
- Device certificate authentication
- JWT tokens in MQTT password field

#### Message Format (JSON):
```json
{
  "timestamp": "2025-01-15T10:30:00Z",
  "device_id": "INV-TAG-12345",
  "data_type": "location",
  "payload": {
    "gps": {
      "lat": 37.7749,
      "lng": -122.4194,
      "accuracy": 5.2,
      "altitude": 15.0,
      "speed": 0.0
    },
    "battery": 87,
    "rssi": -45,
    "temperature": 23.5
  }
}
```

### Protocol 2: HTTP REST API (Fallback & Direct)

**Endpoint:** `https://dvqikpzjqycktlqwjkeq.supabase.co/functions/v1/device-telemetry`

#### Headers:
```
Content-Type: application/json
Authorization: Bearer {device_jwt_token}
```

#### Telemetry POST Request:
```json
{
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
  },
  "timestamp": "2025-01-15T10:30:00Z"
}
```

#### Response:
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

### Protocol 3: BLE GATT (Tag to Hub Local)

**Service UUID:** `0000180a-0000-1000-8000-00805f9b34fb`

**Characteristics:**

#### 1. Telemetry Data (Read/Notify)
- **UUID:** `00002a19-0000-1000-8000-00805f9b34fb`
- **Properties:** Read, Notify
- **Format:** Binary packed data (20 bytes)
```
Bytes 0-3:   GPS Latitude (float32)
Bytes 4-7:   GPS Longitude (float32)
Bytes 8-9:   GPS Accuracy (uint16, cm)
Byte  10:    Battery Level (uint8, %)
Byte  11:    RSSI (int8, dBm)
Bytes 12-13: Temperature (int16, 0.1°C)
Bytes 14-17: Timestamp (uint32, Unix epoch)
Bytes 18-19: CRC16
```

#### 2. Command Control (Write)
- **UUID:** `00002a20-0000-1000-8000-00805f9b34fb`
- **Properties:** Write
- **Format:** Command packets (variable length)

Command Structure:
```
Byte 0:      Command Type
Byte 1:      Payload Length
Bytes 2-N:   Payload Data
Bytes N+1-N+2: CRC16
```

Command Types:
- `0x01`: Locate (request GPS update)
- `0x02`: Identify (flash LED)
- `0x03`: Sleep (enter low power mode)
- `0x04`: Wake (exit sleep mode)
- `0x05`: Configure (update settings)
- `0x06`: Firmware Update Start
- `0x07`: Firmware Update Data

---

## Data Transmission Specifications

### Invepin BLE Tag Behavior

#### Normal Mode:
- GPS update: Every 30 seconds
- Battery check: Every 5 minutes
- Temperature: Every 1 minute
- Accelerometer: On motion detection

#### Low Power Mode (Battery < 20%):
- GPS update: Every 5 minutes
- Battery check: Every 10 minutes
- Temperature: Every 5 minutes
- Accelerometer: Disabled

#### Data Priority:
1. Critical alerts (theft detection, geofence breach)
2. GPS location updates
3. Battery status
4. Environmental data (temperature)
5. Diagnostic data

### Colony Hub Behavior

#### Scanning:
- Continuous BLE scan for Invepin tags
- RSSI threshold: -80 dBm
- Scan interval: 100ms
- Scan window: 100ms

#### Data Aggregation:
- Buffer up to 500 telemetry packets locally
- Batch upload every 10 seconds
- Immediate upload for critical events

#### Edge Processing:
- RSSI-based positioning
- Movement pattern detection
- Anomaly detection (theft, tampering)
- Geofencing logic

---

## Authentication & Security

### Device Provisioning:
1. Factory generates unique device ID and private key
2. Device ID format: `INV-{TYPE}-{SERIAL}`
   - Example: `INV-TAG-000123`
3. Device certificate signed by Invepin CA
4. Certificate stored in secure element

### Runtime Authentication:
1. Device sends certificate to auth endpoint
2. Server validates and issues JWT token
3. JWT contains: device_id, organization_id, permissions
4. JWT expiry: 24 hours
5. Token refresh before expiry

### Data Encryption:
- TLS 1.2+ for all HTTP/MQTT
- AES-128 for BLE GATT data
- Secure boot for firmware integrity

---

## OTA Firmware Updates

### Update Process:
1. App/Server sends `firmware_update` command
2. Device checks battery level (>30% required)
3. Device downloads firmware in chunks (4KB each)
4. Each chunk verified with SHA-256 hash
5. Full firmware verified before flash
6. Rollback capability on failure

### Firmware Package Format:
```
Header (64 bytes):
  - Magic number (4 bytes): 0x494E5650 ("INVP")
  - Version (4 bytes): Major.Minor.Patch.Build
  - Device type (4 bytes)
  - File size (4 bytes)
  - SHA-256 hash (32 bytes)
  - Signature (16 bytes)

Data:
  - Firmware binary

Footer (32 bytes):
  - CRC32 checksum
  - Build timestamp
  - Reserved
```

### Update API:
```
GET /firmware/{device_type}/{version}
Response:
{
  "version": "1.2.0",
  "file_url": "https://...",
  "file_hash": "sha256:...",
  "min_battery_level": 30,
  "changelog": "Bug fixes and improvements"
}
```

---

## Error Handling & Recovery

### Connection Loss:
- Retry connection: 3 attempts with exponential backoff
- Fallback to BLE if WiFi fails (Colony Hub)
- Store data locally (up to 1000 records)
- Upload when connection restored

### Data Corruption:
- All packets include CRC/checksum
- Invalid data logged and discarded
- Diagnostic telemetry sent to server

### Low Battery:
- Enter power-save mode at 20%
- Critical-only updates at 10%
- Shutdown at 5%
- Send low battery alert

---

## Implementation Checklist for Firmware Developers

### BLE Tag (INV-TAG-001):
- [ ] Implement BLE GATT server
- [ ] GPS module integration (NMEA parser)
- [ ] Battery monitoring (ADC)
- [ ] Accelerometer I2C driver
- [ ] Temperature sensor
- [ ] HTTP client for telemetry
- [ ] Command processing queue
- [ ] Power management
- [ ] OTA update client
- [ ] Secure storage for credentials

### Colony Hub (COL-HUB-001):
- [ ] WiFi connection manager
- [ ] MQTT client implementation
- [ ] BLE scanner (continuous)
- [ ] RSSI-based positioning algorithm
- [ ] Local data storage (SQLite)
- [ ] Edge ML model (optional)
- [ ] HTTP REST client
- [ ] Command relay to tags
- [ ] OTA update server (for tags)
- [ ] Web dashboard (optional)

---

## Testing & Certification

### Functional Tests:
- GPS accuracy: < 5m CEP50
- Battery life: > 6 months (normal use)
- BLE range: > 50m (open space)
- WiFi range: > 100m (2.4GHz)
- Cold start: < 30 seconds

### Stress Tests:
- 100+ simultaneous BLE connections (Hub)
- Network interruption recovery
- Extended offline operation
- Firmware corruption recovery

### Compliance:
- FCC Part 15 (USA)
- CE (Europe)
- RoHS
- IP67 rating (optional, for rugged tags)

---

## API Integration Examples

### Device Registration:
```bash
curl -X POST https://dvqikpzjqycktlqwjkeq.supabase.co/functions/v1/device-pairing \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {user_jwt}" \
  -d '{
    "device_id": "INV-TAG-000123",
    "device_type": "tag",
    "name": "Warehouse Tag 1",
    "mac_address": "AA:BB:CC:DD:EE:FF",
    "serial_number": "SN123456"
  }'
```

### Send Telemetry:
```bash
curl -X POST https://dvqikpzjqycktlqwjkeq.supabase.co/functions/v1/device-telemetry \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {device_jwt}" \
  -d '{
    "device_id": "INV-TAG-000123",
    "data_type": "location",
    "payload": {
      "gps": {"lat": 37.7749, "lng": -122.4194, "accuracy": 5.2},
      "battery": 87,
      "rssi": -45
    }
  }'
```

### Issue Command:
```bash
curl -X POST https://dvqikpzjqycktlqwjkeq.supabase.co/functions/v1/device-command \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {user_jwt}" \
  -d '{
    "device_id": "INV-TAG-000123",
    "command_type": "locate",
    "priority": 1
  }'
```

---

## Support & Resources

**Documentation:** https://docs.invepin.com/firmware
**SDK Downloads:** https://github.com/invepin/firmware-sdk
**Developer Forum:** https://community.invepin.com
**Technical Support:** firmware-support@invepin.com

---

**Version:** 1.0.0  
**Last Updated:** 2025-01-15  
**Status:** Production Ready
