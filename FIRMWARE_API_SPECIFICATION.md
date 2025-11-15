/*
 * Invepin BarMate / Invepin Ecosystem Firmware
 * © 2025 Invepin International LLC. All rights reserved.
 * Invepin®, Invepin BarMate™, Colony Hub™, and The Hive™
 * are trademarks or registered trademarks of Invepin International LLC.
 * Unauthorized copying of this file, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

# Invepin Firmware API Specification
**Version**: 1.0.0  
**Last Updated**: November 2025  
**Project**: Persephone 3.0 - Complete Backend Integration

---

## System Architecture Overview

```
[Invepin V1/V2 Devices] -->|BLE| [Colony Hub™]
[Invepin BarMate™] -->|BLE/Wi-Fi| [Colony Hub™] or [The Hive™ Cloud]
[Colony Hub™] -->|Wi-Fi/LTE| [The Hive™ Cloud]
[The Hive™ Cloud] -->|REST API/WebSockets| [Invepin iOS/Android App]
[The Hive™ Cloud] -->|MQTT/Webhooks| [Real-time Alert & Analytics]
[OTA Firmware Repo] -->|HTTPS| [The Hive™ Cloud] -->|Secure Download| [Devices]
[Colony Hub™] -->|LoRa Mesh| [Other Colonies/Beacons]
```

---

## Device Authentication & Security

### Device Identity
Every device has:
- **Device UUID**: Unique 128-bit identifier (factory-programmed or generated on first boot)
- **Secret Key**: AES-128 key for HMAC signing (injected at factory or via secure config tool)
- **Public/Private Keypair**: Optional for certificate-based auth

### Authentication Flow

#### Option 1: HMAC Signature (Recommended)
```c++
// Device-side (C++ firmware)
#include <mbedtls/md.h>

String generateSignature(String payload, String secretKey) {
  byte hmac[32];
  mbedtls_md_context_t ctx;
  mbedtls_md_init(&ctx);
  mbedtls_md_setup(&ctx, mbedtls_md_info_from_type(MBEDTLS_MD_SHA256), 1);
  mbedtls_md_hmac_starts(&ctx, (const unsigned char*)secretKey.c_str(), secretKey.length());
  mbedtls_md_hmac_update(&ctx, (const unsigned char*)payload.c_str(), payload.length());
  mbedtls_md_hmac_finish(&ctx, hmac);
  mbedtls_md_free(&ctx);
  
  // Convert to hex string
  String signature = "";
  for(int i = 0; i < 32; i++) {
    signature += String(hmac[i], HEX);
  }
  return signature;
}

// Usage in HTTP request
String payload = createTelemetryPayload();
String signature = generateSignature(payload, DEVICE_SECRET_KEY);
http.addHeader("X-Device-UUID", DEVICE_UUID);
http.addHeader("X-Device-Signature", signature);
http.POST(payload);
```

#### Option 2: JWT Token
```c++
// Device requests JWT from Hive using Device UUID + Secret
POST /device-auth/token
Headers: X-Device-UUID, X-Device-Secret
Response: { "token": "eyJhbG...", "expires_in": 3600 }

// Use JWT for subsequent requests
Headers: Authorization: Bearer eyJhbG...
```

---

## API Endpoints

### Base URL
- **Production**: `https://dvqikpzjqycktlqwjkeq.supabase.co/functions/v1`
- **Development**: Configure via build-time settings

---

## 1. Device Registration & Pairing

### `POST /device-pairing`

Pair a new device with an organization.

**Headers**:
```
Authorization: Bearer {user_jwt_token}
Content-Type: application/json
```

**Request Body**:
```json
{
  "device_id": "INVP12345678",
  "device_type": "BarMate",
  "name": "Bar Station 1",
  "mac_address": "AA:BB:CC:DD:EE:FF",
  "serial_number": "BM-2025-001234",
  "metadata": {
    "location": "Main Bar",
    "installation_date": "2025-11-15"
  }
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "device": {
    "id": "uuid",
    "device_id": "INVP12345678",
    "status": "online",
    "paired_at": "2025-11-15T12:00:00Z"
  },
  "message": "Device paired successfully"
}
```

---

## 2. Device Telemetry Submission

### `POST /device-telemetry`

Submit sensor data and telemetry from devices.

**Headers**:
```
X-Device-UUID: {device_uuid}
X-Device-Signature: {hmac_signature}
Content-Type: application/json
```

**Request Body**:
```json
{
  "device_id": "INVP12345678",
  "data_type": "sensor",
  "payload": {
    "battery": 85,
    "rssi": -65,
    "temperature": 22.5,
    "gps": {
      "lat": 40.7128,
      "lng": -74.0060,
      "accuracy": 10,
      "altitude": 15,
      "speed": 0
    }
  },
  "timestamp": "2025-11-15T12:00:00Z"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "commands": [
    {
      "id": "uuid",
      "command_type": "locate",
      "payload": {},
      "priority": 5,
      "expires_at": "2025-11-15T12:05:00Z"
    }
  ]
}
```

---

## 3. OTA Firmware Updates

### `POST /ota-firmware-check`

Check for available firmware updates.

**Headers**:
```
X-Device-UUID: {device_uuid}
X-Device-Signature: {hmac_signature}
Content-Type: application/json
```

**Request Body**:
```json
{
  "device_uuid": "550e8400-e29b-41d4-a716-446655440000",
  "current_version": "1.2.3",
  "device_type": "BarMate",
  "battery_level": 85
}
```

**Response** (200 OK):
```json
{
  "update_available": true,
  "current_version": "1.2.3",
  "latest_version": "1.3.0",
  "build_number": 130,
  "file_url": "https://firmware.invepin.com/barmate-v1.3.0.bin",
  "file_hash": "sha256:abc123...",
  "file_size_bytes": 524288,
  "signature": "rsa_sig...",
  "is_mandatory": false,
  "requires_backup": true,
  "rollback_version": "1.2.3",
  "changelog": "- Added tamper detection\n- Improved flow sensor accuracy\n- Bug fixes"
}
```

### `POST /ota-firmware-download`

Update OTA job status during download/installation.

**Request Body**:
```json
{
  "device_uuid": "550e8400-e29b-41d4-a716-446655440000",
  "ota_job_id": "uuid",
  "status": "downloading",
  "progress_percent": 45
}
```

**Status Values**: `downloading`, `verifying`, `installing`, `completed`, `failed`, `rollback`

**Response** (200 OK):
```json
{
  "success": true,
  "message": "OTA status updated"
}
```

---

## 4. BarMate™ Pour Events

### `POST /barmate-pour-event`

Log pour events from BarMate devices.

**Headers**:
```
X-Device-UUID: {device_uuid}
X-Device-Signature: {hmac_signature}
Content-Type: application/json
```

**Request Body**:
```json
{
  "device_uuid": "550e8400-e29b-41d4-a716-446655440000",
  "volume_ml": 45.5,
  "flow_rate": 15.2,
  "duration_seconds": 3.0,
  "product_name": "Premium Whiskey",
  "authorized_method": "facial_id",
  "user_id": "user-uuid",
  "timestamp": "2025-11-15T12:00:00Z"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "event_id": "uuid",
  "message": "Pour event logged successfully"
}
```

---

## 5. Tamper Detection Alerts

### `POST /tamper-alert`

Report tamper events immediately.

**Headers**:
```
X-Device-UUID: {device_uuid}
X-Device-Signature: {hmac_signature}
Content-Type: application/json
```

**Request Body**:
```json
{
  "device_uuid": "550e8400-e29b-41d4-a716-446655440000",
  "event_type": "physical_tamper",
  "severity": "critical",
  "details": {
    "sensor_readings": {
      "accelerometer": [1.2, 0.5, 9.8],
      "tamper_switch": false
    },
    "timestamp_device": "2025-11-15T12:00:00Z",
    "location": { "lat": 40.7128, "lng": -74.0060 }
  }
}
```

**Event Types**:
- `physical_tamper`: Device enclosure opened or physically manipulated
- `unauthorized_access`: Unauthorized lock/unlock attempt
- `sensor_manipulation`: Sensor readings indicate tampering
- `enclosure_opened`: Tamper switch triggered
- `wire_cut`: Power or sensor wires disconnected

**Severity Levels**:
- `low`: Minor anomaly (e.g., single sensor spike)
- `medium`: Suspicious pattern detected
- `high`: Clear tamper attempt
- `critical`: Active tampering in progress

**Response** (200 OK):
```json
{
  "success": true,
  "event_id": "uuid",
  "action": "lock_device",
  "alert_level": "critical",
  "message": "Tamper detected - device locked"
}
```

---

## 6. Device Diagnostics

### `POST /device-diagnostics`

Submit health check and performance diagnostics.

**Headers**:
```
X-Device-UUID: {device_uuid}
X-Device-Signature: {hmac_signature}
Content-Type: application/json
```

**Request Body**:
```json
{
  "device_uuid": "550e8400-e29b-41d4-a716-446655440000",
  "diagnostic_type": "health_check",
  "metrics": {
    "uptime_seconds": 86400,
    "memory_usage_percent": 65,
    "cpu_usage_percent": 45,
    "network_latency_ms": 125,
    "ble_connection_count": 12,
    "lora_signal_quality": 85,
    "sensor_readings": {
      "flow_sensor": 12.5,
      "level_sensor": 75.3,
      "temperature": 22.1
    },
    "error_counts": {
      "ble_timeout": 2,
      "sensor_error": 0,
      "network_error": 1
    }
  }
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "diagnostic_id": "uuid",
  "status": "healthy",
  "recommendations": [],
  "message": "Diagnostic logged successfully"
}
```

---

## 7. Device Commands

### `POST /device-command`

Issue commands to devices (user-initiated from app/dashboard).

**Headers**:
```
Authorization: Bearer {user_jwt_token}
Content-Type: application/json
```

**Request Body**:
```json
{
  "device_id": "INVP12345678",
  "command_type": "lock",
  "payload": {
    "duration_seconds": 300
  },
  "priority": 10,
  "expires_in": 300
}
```

**Command Types**:
- **All Devices**: `locate`, `identify`, `reset`, `configure`
- **BarMate**: `lock`, `unlock`, `pour`, `calibrate`
- **Colony Hub**: `ota_update`, `mesh_scan`, `reboot`
- **Tags (V1/V2)**: `ping_interval`, `power_mode`

**Response** (200 OK):
```json
{
  "success": true,
  "command_id": "uuid",
  "message": "Command queued for device"
}
```

Devices retrieve pending commands via telemetry response or by polling this endpoint.

---

## Firmware Implementation Guidelines

### 1. Shared Core Module (All Devices)

#### Heartbeat Loop
```c++
void sendHeartbeat() {
  if (millis() - lastHeartbeat >= HEARTBEAT_INTERVAL) {
    StaticJsonDocument<512> doc;
    doc["device_id"] = DEVICE_ID;
    doc["data_type"] = "heartbeat";
    doc["payload"]["battery"] = getBatteryLevel();
    doc["payload"]["rssi"] = WiFi.RSSI();
    doc["timestamp"] = getISO8601Timestamp();
    
    String payload;
    serializeJson(doc, payload);
    String signature = generateSignature(payload, SECRET_KEY);
    
    HTTPClient http;
    http.begin(HIVE_API_BASE + "/device-telemetry");
    http.addHeader("X-Device-UUID", DEVICE_UUID);
    http.addHeader("X-Device-Signature", signature);
    http.addHeader("Content-Type", "application/json");
    
    int httpCode = http.POST(payload);
    if (httpCode == 200) {
      String response = http.getString();
      processCommands(response); // Handle pending commands
    }
    
    http.end();
    lastHeartbeat = millis();
  }
}
```

#### OTA Update Flow
```c++
void checkFirmwareUpdate() {
  StaticJsonDocument<256> doc;
  doc["device_uuid"] = DEVICE_UUID;
  doc["current_version"] = FIRMWARE_VERSION;
  doc["device_type"] = DEVICE_TYPE;
  doc["battery_level"] = getBatteryLevel();
  
  String payload;
  serializeJson(payload, doc);
  
  HTTPClient http;
  http.begin(HIVE_API_BASE + "/ota-firmware-check");
  http.addHeader("X-Device-UUID", DEVICE_UUID);
  http.addHeader("X-Device-Signature", generateSignature(payload, SECRET_KEY));
  http.addHeader("Content-Type", "application/json");
  
  int httpCode = http.POST(payload);
  if (httpCode == 200) {
    DynamicJsonDocument response(2048);
    deserializeJson(response, http.getString());
    
    if (response["update_available"] == true && !response["update_blocked"]) {
      downloadAndInstallFirmware(
        response["file_url"],
        response["file_hash"],
        response["signature"],
        response["latest_version"]
      );
    }
  }
  http.end();
}

void downloadAndInstallFirmware(String url, String expectedHash, String signature, String version) {
  // 1. Report status: downloading
  updateOTAStatus("downloading", 0);
  
  // 2. Download firmware to secondary partition
  HTTPClient http;
  http.begin(url);
  int httpCode = http.GET();
  
  if (httpCode == 200) {
    int totalLength = http.getSize();
    int downloaded = 0;
    WiFiClient *stream = http.getStreamPtr();
    
    Update.begin(totalLength);
    while (http.connected() && downloaded < totalLength) {
      size_t size = stream->available();
      if (size) {
        uint8_t buff[128];
        int c = stream->readBytes(buff, min(size, sizeof(buff)));
        Update.write(buff, c);
        downloaded += c;
        
        // Report progress every 10%
        int progress = (downloaded * 100) / totalLength;
        if (progress % 10 == 0) {
          updateOTAStatus("downloading", progress);
        }
      }
    }
    
    // 3. Verify checksum
    updateOTAStatus("verifying", 100);
    String actualHash = calculateSHA256(Update.getStream());
    
    if (actualHash != expectedHash) {
      Update.abort();
      updateOTAStatus("failed", 100, "Checksum mismatch");
      return;
    }
    
    // 4. Verify signature (if using certificate-based)
    if (!verifySignature(Update.getStream(), signature)) {
      Update.abort();
      updateOTAStatus("failed", 100, "Invalid signature");
      return;
    }
    
    // 5. Install
    updateOTAStatus("installing", 100);
    if (Update.end(true)) {
      updateOTAStatus("completed", 100);
      ESP.restart(); // Reboot to new firmware
    } else {
      updateOTAStatus("failed", 100, Update.errorString());
    }
  }
  
  http.end();
}

void updateOTAStatus(String status, int progress, String error = "") {
  StaticJsonDocument<256> doc;
  doc["device_uuid"] = DEVICE_UUID;
  doc["ota_job_id"] = CURRENT_OTA_JOB_ID;
  doc["status"] = status;
  doc["progress_percent"] = progress;
  if (error.length() > 0) doc["error_message"] = error;
  
  String payload;
  serializeJson(doc, payload);
  
  HTTPClient http;
  http.begin(HIVE_API_BASE + "/ota-firmware-download");
  http.addHeader("X-Device-UUID", DEVICE_UUID);
  http.addHeader("X-Device-Signature", generateSignature(payload, SECRET_KEY));
  http.POST(payload);
  http.end();
}
```

---

### 2. BarMate™-Specific Implementation

#### Pour Detection & Logging
```c++
// Flow sensor interrupt handler
volatile int pulseCount = 0;
float flowRate = 0.0;
float totalVolume = 0.0;

void IRAM_ATTR flowSensorISR() {
  pulseCount++;
}

void setupFlowSensor() {
  pinMode(FLOW_SENSOR_PIN, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(FLOW_SENSOR_PIN), flowSensorISR, FALLING);
}

void monitorPour() {
  static unsigned long lastPourCheck = 0;
  
  if (millis() - lastPourCheck >= 1000) { // Check every second
    noInterrupts();
    int pulses = pulseCount;
    pulseCount = 0;
    interrupts();
    
    // Calculate flow rate (pulses per second * calibration factor)
    flowRate = pulses / FLOW_CALIBRATION_FACTOR; // ml/s
    
    if (flowRate > 0.5) { // Pour detected
      if (!pourInProgress) {
        startPour();
      }
      totalVolume += flowRate;
    } else if (pourInProgress && flowRate < 0.1) {
      // Pour ended
      endPour();
    }
    
    lastPourCheck = millis();
  }
}

void endPour() {
  pourInProgress = false;
  
  StaticJsonDocument<512> doc;
  doc["device_uuid"] = DEVICE_UUID;
  doc["volume_ml"] = totalVolume;
  doc["flow_rate"] = averageFlowRate;
  doc["duration_seconds"] = (millis() - pourStartTime) / 1000.0;
  doc["product_name"] = currentProductName;
  doc["authorized_method"] = lastAuthMethod; // facial_id, thumbprint, qr_code
  doc["user_id"] = lastAuthorizedUserId;
  doc["timestamp"] = getISO8601Timestamp();
  
  String payload;
  serializeJson(doc, payload);
  
  HTTPClient http;
  http.begin(HIVE_API_BASE + "/barmate-pour-event");
  http.addHeader("X-Device-UUID", DEVICE_UUID);
  http.addHeader("X-Device-Signature", generateSignature(payload, SECRET_KEY));
  http.POST(payload);
  http.end();
  
  totalVolume = 0;
}
```

#### Locking Mechanism
```c++
void executeLockCommand(JsonDocument& command) {
  int duration = command["payload"]["duration_seconds"] | 0;
  
  // Activate solenoid lock
  digitalWrite(LOCK_SOLENOID_PIN, HIGH);
  lockEngaged = true;
  lockEngagedAt = millis();
  
  if (duration > 0) {
    lockDuration = duration * 1000;
  } else {
    lockDuration = 0; // Indefinite lock
  }
  
  Serial.println("Device locked");
}

void executeUnlockCommand() {
  digitalWrite(LOCK_SOLENOID_PIN, LOW);
  lockEngaged = false;
  Serial.println("Device unlocked");
}

void checkLockTimeout() {
  if (lockEngaged && lockDuration > 0) {
    if (millis() - lockEngagedAt >= lockDuration) {
      executeUnlockCommand();
    }
  }
}
```

#### Tamper Detection
```c++
void setupTamperDetection() {
  pinMode(TAMPER_SWITCH_PIN, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(TAMPER_SWITCH_PIN), tamperISR, CHANGE);
}

void IRAM_ATTR tamperISR() {
  tamperDetected = true;
}

void handleTamperAlert() {
  if (tamperDetected) {
    tamperDetected = false;
    
    // Immediately lock device
    executeLockCommand({});
    
    // Send tamper alert
    StaticJsonDocument<512> doc;
    doc["device_uuid"] = DEVICE_UUID;
    doc["event_type"] = "enclosure_opened";
    doc["severity"] = "critical";
    doc["details"]["sensor_readings"]["tamper_switch"] = digitalRead(TAMPER_SWITCH_PIN);
    doc["details"]["timestamp_device"] = getISO8601Timestamp();
    
    String payload;
    serializeJson(doc, payload);
    
    HTTPClient http;
    http.begin(HIVE_API_BASE + "/tamper-alert");
    http.addHeader("X-Device-UUID", DEVICE_UUID);
    http.addHeader("X-Device-Signature", generateSignature(payload, SECRET_KEY));
    http.POST(payload);
    http.end();
    
    Serial.println("CRITICAL: Tamper detected - device locked");
  }
}
```

---

### 3. Invepin V1/V2 Tag Implementation

#### BLE Advertising (V1)
```c++
#include <NimBLEDevice.h>

void setupBLE() {
  NimBLEDevice::init("InvepinTag-" + DEVICE_ID);
  BLEAdvertising *pAdvertising = NimBLEDevice::getAdvertising();
  
  // Custom manufacturer data with Invepin UUID
  BLEAdvertisementData advData;
  advData.setFlags(0x06); // BR_EDR_NOT_SUPPORTED | LE_GENERAL_DISCOVERABLE
  
  uint8_t manufacturerData[12];
  manufacturerData[0] = 0xFF; // Invepin Company ID (placeholder)
  manufacturerData[1] = 0xFE;
  // Device UUID bytes 2-11
  memcpy(&manufacturerData[2], DEVICE_UUID_BYTES, 10);
  
  advData.setManufacturerData(std::string((char*)manufacturerData, 12));
  pAdvertising->setAdvertisementData(advData);
  pAdvertising->start();
}

void detectProximityEvents() {
  // Scan for Colony Hub or other Invepins
  NimBLEScan* pScan = NimBLEDevice::getScan();
  BLEScanResults results = pScan->start(5);
  
  for (int i = 0; i < results.getCount(); i++) {
    BLEAdvertisedDevice device = results.getDevice(i);
    
    if (isColonyHub(device) || isInvepinDevice(device)) {
      int rssi = device.getRSSI();
      
      // Log proximity event
      logProximityEvent(device.getAddress().toString(), rssi);
    }
  }
}
```

#### NFC Tap Logging (V2 Only)
```c++
#include <PN532.h>

void setupNFC() {
  nfc.begin();
  nfc.SAMConfig();
}

void checkNFCTap() {
  uint8_t uid[7];
  uint8_t uidLength;
  
  if (nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, uid, &uidLength, 100)) {
    String nfcUid = "";
    for (uint8_t i = 0; i < uidLength; i++) {
      nfcUid += String(uid[i], HEX);
    }
    
    logNFCTap(nfcUid);
  }
}

void logNFCTap(String nfcUid) {
  StaticJsonDocument<512> doc;
  doc["device_id"] = DEVICE_ID;
  doc["data_type"] = "nfc_tap";
  doc["payload"]["nfc_uid"] = nfcUid;
  doc["payload"]["battery"] = getBatteryLevel();
  doc["payload"]["rssi"] = getBLERSSI();
  doc["timestamp"] = getISO8601Timestamp();
  
  sendTelemetry(doc);
}
```

---

### 4. Colony Hub™ Implementation

#### BLE/LoRa Mesh Manager
```c++
// Manage connections to 100+ Invepin devices
std::vector<ConnectedDevice> connectedDevices;

void scanForDevices() {
  // BLE scan
  NimBLEScan* pScan = NimBLEDevice::getScan();
  BLEScanResults results = pScan->start(10);
  
  for (int i = 0; i < results.getCount(); i++) {
    BLEAdvertisedDevice device = results.getDevice(i);
    if (isInvepinDevice(device)) {
      addOrUpdateDevice(device);
    }
  }
  
  // LoRa mesh scan
  sendLoRaMeshBeacon();
  listenForLoRaResponses();
}

void forwardEventsToHive() {
  // Buffer events locally, batch upload to Hive
  for (auto& event : eventQueue) {
    if (WiFi.status() == WL_CONNECTED) {
      sendToHive(event);
    } else {
      // Store in local queue for later
      persistToSPIFFS(event);
    }
  }
}
```

#### Local Dashboard API (WebSocket/HTTP)
```c++
#include <ESPAsyncWebServer.h>
#include <AsyncWebSocket.h>

AsyncWebServer server(80);
AsyncWebSocket ws("/ws");

void setupLocalDashboard() {
  // REST endpoints
  server.on("/api/devices", HTTP_GET, [](AsyncWebServerRequest *request){
    String json = getConnectedDevicesJSON();
    request->send(200, "application/json", json);
  });
  
  server.on("/api/events", HTTP_GET, [](AsyncWebServerRequest *request){
    String json = getRecentEventsJSON();
    request->send(200, "application/json", json);
  });
  
  // WebSocket for real-time updates
  ws.onEvent(onWebSocketEvent);
  server.addHandler(&ws);
  
  server.begin();
}

void broadcastDeviceUpdate(String deviceId, String status) {
  StaticJsonDocument<256> doc;
  doc["type"] = "device_update";
  doc["device_id"] = deviceId;
  doc["status"] = status;
  doc["timestamp"] = millis();
  
  String json;
  serializeJson(doc, json);
  ws.textAll(json);
}
```

---

## Data Formats

### Telemetry Payload Structure
```json
{
  "device_id": "INVP12345678",
  "data_type": "sensor|location|status|heartbeat|pour|nfc_tap",
  "payload": {
    "battery": 0-100,
    "rssi": -120 to 0,
    "temperature": -40 to 85,
    "gps": {
      "lat": -90 to 90,
      "lng": -180 to 180,
      "accuracy": 0-1000,
      "altitude": -500 to 9000,
      "speed": 0-500
    },
    // BarMate-specific
    "flow_rate": 0-100,
    "volume": 0-10000,
    "level_percent": 0-100,
    "lock_status": "locked|unlocked",
    "tamper_status": false,
    // V2-specific
    "nfc_uid": "hex string",
    "shelf_position": "A1|B2|C3",
    // Colony Hub-specific
    "connected_devices": 0-100,
    "mesh_quality": 0-100
  },
  "timestamp": "ISO8601 string"
}
```

---

## Error Handling & Recovery

### Watchdog & Crash Recovery
```c++
#include <esp_task_wdt.h>

void setup() {
  // Enable watchdog timer (60 seconds)
  esp_task_wdt_init(60, true);
  esp_task_wdt_add(NULL);
  
  // Check if this is a crash recovery
  esp_reset_reason_t reason = esp_reset_reason();
  if (reason == ESP_RST_PANIC || reason == ESP_RST_WDT) {
    logCrashEvent(reason);
    
    // Roll back to previous firmware if within 5 minutes of OTA
    if (otaCompletedRecently()) {
      rollbackFirmware();
    }
  }
}

void loop() {
  // Reset watchdog
  esp_task_wdt_reset();
  
  // Main loop logic
  sendHeartbeat();
  checkFirmwareUpdate();
  monitorSensors();
}
```

---

## Security Best Practices

1. **Never hardcode secrets** - Use secure provisioning tool or factory injection
2. **Always validate signatures** before accepting commands
3. **Use TLS 1.2+** for all HTTP communications
4. **Implement rollback** if new firmware crashes within 5 minutes
5. **Log all security events** (auth failures, tamper detections)
6. **Rate limit** telemetry: max 1 request per 30 seconds
7. **Encrypt sensitive data** in SPIFFS/EEPROM using AES-128

---

## Testing Checklist

- [ ] Device registration via QR code scan
- [ ] Heartbeat telemetry every 60 seconds
- [ ] OTA update with battery check
- [ ] OTA rollback on crash
- [ ] Pour event logging (BarMate)
- [ ] Lock/unlock commands (BarMate)
- [ ] Tamper detection and auto-lock
- [ ] NFC tap logging (V2)
- [ ] Mesh connectivity (Colony Hub)
- [ ] Local dashboard API (Colony Hub)
- [ ] Firmware signature verification
- [ ] HMAC authentication
- [ ] Low battery handling (no OTA if <30%)

---

## Support

For integration questions, contact: james@invepin.com  
Technical Documentation: [Internal Wiki]  
Firmware Repository: [GitHub - Private Repos]

**Version History**:
- 1.0.0 (Nov 2025): Initial API specification for Persephone 3.0
