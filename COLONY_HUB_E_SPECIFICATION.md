# Colony Hub E (Persephone 3.0) - Enterprise Vision System
## Technical Specification & Integration Guide

**© 2025 Invepin International LLC. All rights reserved.**

---

## Overview

The Colony Hub E is Invepin's flagship enterprise-grade vision and sensing platform, designed for comprehensive retail space monitoring, people analytics, and inventory management. Codename: **Persephone 3.0**.

### Key Capabilities
- Multi-camera AI vision system (4K primary + secondary + thermal)
- Real-time people counting and facial recognition
- 360° retail space coverage
- Thermal sensing and anomaly detection
- BLE and WiFi connectivity
- Addressable RGB LED status indication
- Edge AI processing via Raspberry Pi 5
- Blockchain-verified audit trails

---

## Hardware Specifications

### Physical Dimensions
- **Form Factor**: Hexagonal
- **Dimensions**: 320mm × 322mm (width) × 280mm (height)
- **Base Plate**: 820mm diameter (aluminum 601-T6)
- **Weight**: ~5kg (assembled)
- **Material**: 
  - Front Panel: Translucent Amber PETG/Resin (Pantone 1375C)
  - Rear Panel: Opaque Black ABS/PETG
  - Base: Aluminum 601-T6 (4mm CNC machined)

### Vision System Components

#### Camera Array
1. **Primary Camera** (Camera 1)
   - Resolution: 4K (110° Wide Single FOV)
   - Coverage: 120° center zone (blue zone)
   - Range: Facial recognition 3-8m
   - Positioning: Center top, elevated

2. **Secondary Camera** (Camera 2)
   - Resolution: 4K (110° Wide FOV)
   - Coverage: Center zone overlap
   - USB Bandwidth: 4Kp30fps @ 1.5 Gbps

3. **Thermal Camera** (FLIR Lepton 3.5)
   - Type: FLIR Thermal Sensor
   - Purpose: Temperature monitoring, anomaly detection
   - Coverage: Wide angle peripheral (red zone)
   - Ricoh thermal box Kieferlite housing

4. **Side Angle Camera** (Camera 4)
   - Resolution: 4K
   - FOV: 110° @ 7.7mm spacing
   - Coverage: Peripheral monitoring
   - Bandwidth: 0.3 Tbps, 1.5 Gbps

#### Retail Space Coverage
- **Total Coverage**: 360° complete retail space
- **Facial Recognition Range**: 3-8m
- **People Counting Range**: 3-15m
- **Zone Distribution**:
  - Blue Zone: Camera 1 (120° center)
  - Yellow Zone: Camera 2 (center)
  - Red Zone: Camera 3 Thermal
  - Green Zone: Overlap zone (lower)

### Sensors & Detection

#### Ultrasonic Sensors (4x)
- **Position**: Mounted at panel corners
- **Purpose**: Distance measurement, proximity detection
- **Configuration**: 6x 12mm depth with M2.3 2mm/1.2mm threading

#### LED Indication System

**Addressable RGB LED Ring** (120 LEDs total)
- **Type**: WS2812B addressable LEDs
- **Layout**: Flexible PCB strip (1800mm total length)
- **Segments**: 6 zones × 20 LEDs per segment
- **Control**: Daisy-chain data flow via GPIO18
- **Power**: 5V 3A dedicated rail, 60W max (full white), 80W with data (Typita signal, 30fps refresh)
- **Diffusion**: 2μm frosted acrylic diffuser with honeycomb texture

**LED Status Modes**:
- **GREEN**: Operational
- **AMBER**: Warning/standby
- **RED+**: Alert condition

**Animation Modes**:
- BUESING (breathing fade in/out 2s cycle)
- PULSING (quick flash 5s segments)
- SCANNING (rotating amber 50%)
- RAINGOW (color cycle)
- CUSTOM PATTERNS (software-defined)

**OLED Display Ring** (120 LEDs)
- **Type**: WS512B Hedressale LED
- **Purpose**: Status information display

### Computing & Connectivity

#### Main Controller
- **Processor**: Raspberry Pi 5
- **HAT**: NVME HAT for storage expansion
- **USB Controller**: 7-port USB 3.0 hub (5 Gbps)
- **Storage**: NVME SSD (via HAT)

#### Wireless Connectivity
- **BLE**: BLE ANT-4 antenna array
  - 4x BLE antennas for triangulation
  - Invepin Tag detection and tracking
- **WiFi**: Dual-band 2.4/5/6GHz antenna (WIFI ANT-4)
- **Gateway**: Minew Gateway integration
- **Backup**: Qualcomm WiFi module (BLE Gargle)

#### Network & Power
- **Ethernet**: Dual Gigabit LAN ports (IEEC, LAN)
- **USB Ports**: 5x USB 3.0 Type-A (labeled USB)
- **Power Input**: IEC C13 inlet (5A mains)
- **PSU**: Mean Well RS-60-5 (60W)
  - +5V @ 8A MAX
  - +5V @ 8A MAX (dual rail)
  - +12V @ 2A MAX
  - GND

**Total Power Budget**:
- **Typical**: 55W
- **Maximum**: 60W
- **LED Full White**: 60W
- **Illuminated Switch**: 2μM6

### Power Distribution

#### Custom Power Distribution PCB
- **Size**: 70mm × 50mm (2-layer)
- **Voltage Rails**:
  - 5V → 3.3V dropout regulator (3.5W/3.8V = 3.3V @ 1A)
  - Multiple isolated outputs:
    - OUT1: Cameras
    - CONV1: 30B2/WiFi (backup)
    - F5: 4 Fans
    - F4: LED Ring
    - OUT4: LED Ring
    - OUT5: Fans/Sensors

- **Grounding**: Solid GND plane with thermal vias (bottom layer)

#### Wiring Harness
- **Camera Distribution**:
  - 4× USB cameras (+5A each via USB3)
  - FLIR Thermal (+6f via SPI)
- **Cable Lengths**:
  - USB3: 15cm, 25cm, 20cm, 30cm, 45cm (sequential)
  - I2C: 10cm (LED ring), 25cm (OLED display)
  - Power: 40cm (thermal sensors)
- **Cooling**: 2× 60mm fans

### Cooling & Thermal Management
- **Fans**: 2× 60mm cooling fans
- **Thermal Sensors**: 2LIR thermal monitoring
- **Heat Dissipation**: Aluminum base plate acts as heatsink
- **Airflow**: Rear panel ventilation (85×60H DA3)

---

## Firmware & Software Integration

### Device Type Configuration
```json
{
  "device_type": "colony_hub_e",
  "model": "Persephone 3.0",
  "manufacturer": "Invepin International LLC",
  "category": "vision_system",
  "communication_protocol": "WiFi,BLE,Ethernet",
  "capabilities": {
    "cameras": 5,
    "camera_types": ["4K_primary", "4K_secondary", "4K_side", "thermal_flir"],
    "sensors": ["ultrasonic", "thermal", "ble_proximity"],
    "led_control": true,
    "facial_recognition": true,
    "people_counting": true,
    "thermal_monitoring": true,
    "ble_beacon_detection": true,
    "edge_ai": true
  }
}
```

### Telemetry Data Schema

The Colony Hub E sends comprehensive telemetry including:

```typescript
interface ColonyHubETelemetry {
  // Device identification
  device_uuid: string;
  device_type: "colony_hub_e";
  firmware_version: string;
  
  // System health
  timestamp: string;
  uptime_seconds: number;
  cpu_temp: number;        // °C
  cpu_usage: number;       // %
  memory_usage: number;    // %
  disk_usage: number;      // %
  
  // Power monitoring
  voltage_5v_rail1: number;
  voltage_5v_rail2: number;
  voltage_12v: number;
  current_draw: number;    // Amps
  power_consumption: number; // Watts
  
  // Cameras status
  cameras: {
    primary_4k: CameraStatus;
    secondary_4k: CameraStatus;
    side_4k: CameraStatus;
    thermal_flir: CameraStatus;
  };
  
  // Sensor data
  ultrasonic_sensors: number[]; // 4 distance readings in cm
  thermal_zones: {
    zone_1: number;  // °C
    zone_2: number;
    ambient: number;
  };
  
  // BLE detection
  ble_tags_detected: number;
  ble_signal_strength: number; // dBm average
  
  // Vision analytics (processed on device)
  people_count: number;
  faces_detected: number;
  zone_occupancy: {
    blue_zone: number;
    yellow_zone: number;
    red_zone: number;
    green_zone: number;
  };
  
  // LED status
  led_ring_status: {
    mode: "operational" | "warning" | "alert" | "custom";
    animation: string;
    brightness: number;
  };
  
  // Network
  wifi_rssi: number;
  ethernet_connected: boolean;
  ble_active: boolean;
  
  // Alerts
  alerts: Array<{
    type: string;
    severity: "info" | "warning" | "critical";
    message: string;
    timestamp: string;
  }>;
}

interface CameraStatus {
  online: boolean;
  resolution: string;
  fps: number;
  bitrate: number;
  errors_last_hour: number;
}
```

### Command Interface

The Colony Hub E accepts the following commands:

```typescript
// LED Control
{
  "command_type": "led_control",
  "payload": {
    "mode": "operational" | "warning" | "alert" | "custom",
    "animation": "breathing" | "pulsing" | "scanning" | "rainbow" | "custom",
    "color": { "r": 0-255, "g": 0-255, "b": 0-255 },
    "brightness": 0-100,
    "pattern": [] // Optional custom pattern array
  }
}

// Camera Configuration
{
  "command_type": "camera_config",
  "payload": {
    "camera": "primary" | "secondary" | "side" | "thermal",
    "resolution": "4K" | "1080p" | "720p",
    "fps": 30 | 60,
    "exposure": "auto" | number,
    "enable_ai": boolean
  }
}

// Analytics Configuration
{
  "command_type": "analytics_config",
  "payload": {
    "enable_people_counting": boolean,
    "enable_facial_recognition": boolean,
    "enable_thermal_monitoring": boolean,
    "thermal_alert_threshold": number, // °C
    "zone_tracking": boolean
  }
}

// System Commands
{
  "command_type": "system",
  "payload": {
    "action": "reboot" | "restart_service" | "update_firmware" | "diagnostic",
    "service": string // optional
  }
}

// BLE Scanning
{
  "command_type": "ble_scan",
  "payload": {
    "enabled": boolean,
    "scan_interval_ms": number,
    "filter_rssi_threshold": number
  }
}
```

### API Endpoints Usage

The Colony Hub E utilizes all standard Invepin firmware API endpoints:

1. **Device Registration**: `/device-pairing`
2. **Telemetry Upload**: `/device-telemetry`
3. **Firmware Updates**: `/ota-firmware-check`, `/ota-firmware-download`
4. **Command Polling**: Via telemetry response
5. **Diagnostics**: `/device-diagnostics`

See `FIRMWARE_API_SPECIFICATION.md` for complete API documentation.

---

## Installation & Setup

### Physical Installation

1. **Mounting**:
   - M6 thread inserts in corners (4 rubber feet)
   - Can be ceiling or wall mounted
   - Ensure 120mm clearance for airflow

2. **Power**:
   - Connect IEC C13 power cable (5A mains)
   - Use illuminated power switch (2μM6)
   - Verify voltage: 5A @ 5V regulated

3. **Network**:
   - Connect Gigabit Ethernet (preferred) or configure WiFi
   - Dual LAN ports support redundancy

4. **Positioning**:
   - Install at 2.5-3m height for optimal coverage
   - Ensure unobstructed view of monitored area
   - Align primary camera with main traffic flow

### Initial Configuration

1. **Device Registration**:
   ```bash
   # Device auto-generates UUID on first boot
   # Posts to /device-pairing endpoint
   # Receives organization assignment
   ```

2. **Camera Calibration**:
   - Auto-calibration routine runs on first boot
   - Thermal camera baseline established
   - Zone boundaries auto-detected

3. **LED Initialization**:
   - Ring performs self-test (color cycle)
   - Sets to operational green

4. **BLE Pairing**:
   - Scans for nearby Invepin Tags
   - Establishes baseline RSSI map

---

## Maintenance & Troubleshooting

### LED Status Codes

| Pattern | Color | Meaning |
|---------|-------|---------|
| Solid | Green | Operational |
| Breathing | Green | Normal standby |
| Pulsing | Amber | Warning - check logs |
| Flashing | Red | Critical error |
| Rainbow | Multi | Self-test mode |
| Scanning | Amber | Updating firmware |

### Common Issues

**No Power**:
- Check IEC C13 connection
- Verify 5A fuse in power switch
- Test PSU output voltages

**Camera Offline**:
- Check USB hub power
- Verify bandwidth allocation
- Restart camera service via command

**High Temperature**:
- Check fan operation (listen for noise)
- Clean ventilation grilles
- Verify ambient temperature < 35°C

**BLE Detection Issues**:
- Verify BLE antennas connected
- Check RSSI threshold settings
- Restart BLE service

### Diagnostics

Run automated diagnostics:
```json
{
  "command_type": "system",
  "payload": {
    "action": "diagnostic"
  }
}
```

Results posted to `/device-diagnostics` include:
- All component health checks
- Camera frame rate tests
- Thermal sensor readings
- Network connectivity tests
- Storage capacity
- LED functionality

---

## Safety & Compliance

### Certifications
- **FC**: FCC compliant
- **CE**: CE marked
- **RoHS**: RoHS compliant
- **UKCA**: UK Conformity Assessed

### Privacy Compliance
- GDPR compliant data handling
- Facial recognition requires consent
- Data encryption at rest and in transit
- Blockchain audit trail for all captures
- User consent tracking built-in

### Electrical Safety
- IEC 60950-1 compliant
- Class I electrical device
- Proper grounding required
- 5A maximum current draw

---

## Assembly Hardware List

### Fasteners
- 48× M4×12mm button head screws (panel to frame)
- 12× M2.8×15 standoffs (Pi mounting)
- 4× rubber feet (100×158mm)
- 4× M6 thread inserts
- Thermal paste (thread locker)

### Print Components
- Front panel (43g MS12mm NCRUISES, 18hrs print time)
- Side panels (568/6.5 CCRNIS, 18hrs each × 4)
- Mounting brackets (13×62×15 STANDOFS, Pi mounting)
- Rear panel (8hrs print time)

### Print Settings
- STL file specs included
- Print orientation: FLAT ON BED
- Layer height: 0.2mm, 20% gyroid infill
- SA106 4010 GIIT vapor smooth finish
- UV coating for outdoor use
- Tolerances: ±0.1mm

---

## Revision History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-01 | Initial Persephone 3.0 specification |

---

**For technical support**: support@invepin.com  
**Firmware updates**: https://firmware.invepin.com  
**Developer documentation**: https://docs.invepin.com
