import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Bluetooth, Radio, Database, Zap, Shield, Code } from "lucide-react";
import { PublicNav } from "@/components/navigation/PublicNav";

const InvepinSetup = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <PublicNav />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Invepin Programming Guide
            </h1>
            <p className="text-xl text-muted-foreground">
              Configure your Invepins to work seamlessly with the Invepin App and HIVE Command Center
            </p>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="specs">Specifications</TabsTrigger>
              <TabsTrigger value="esp32">ESP32-S3</TabsTrigger>
              <TabsTrigger value="setup">Setup</TabsTrigger>
              <TabsTrigger value="api">API</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Radio className="w-5 h-5" />
                    What are Invepins?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Invepins are smart BLE (Bluetooth Low Energy) tracking tags designed for real-time inventory management, 
                    loss prevention, and asset tracking across retail and enterprise environments.
                  </p>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                      <Bluetooth className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <h4 className="font-semibold mb-1">BLE 5.0+ Compatible</h4>
                        <p className="text-sm text-muted-foreground">
                          Long-range communication with minimal power consumption
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                      <Database className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <h4 className="font-semibold mb-1">Real-time Syncing</h4>
                        <p className="text-sm text-muted-foreground">
                          Instant updates to HIVE Command Center and mobile apps
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                      <Shield className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <h4 className="font-semibold mb-1">Secure Protocol</h4>
                        <p className="text-sm text-muted-foreground">
                          Encrypted communication with device authentication
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                      <Zap className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <h4 className="font-semibold mb-1">Low Power Design</h4>
                        <p className="text-sm text-muted-foreground">
                          Battery life of 1-2 years with optimized broadcast intervals
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Alert>
                <AlertDescription>
                  <strong>Note:</strong> Invepins must be programmed and registered in your HIVE Command Center 
                  before they can be used with the mobile app and tracked across your organization.
                </AlertDescription>
              </Alert>
            </TabsContent>

            <TabsContent value="specs" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Technical Specifications</CardTitle>
                  <CardDescription>Required hardware and firmware specifications for Invepin compatibility</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Bluetooth className="w-4 h-4" />
                      Bluetooth Requirements
                    </h3>
                    <div className="space-y-2 ml-6">
                      <div className="flex items-start gap-2">
                        <Badge variant="outline">Required</Badge>
                        <span className="text-sm">BLE 5.0 or higher</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Badge variant="outline">Required</Badge>
                        <span className="text-sm">Advertising interval: 100-1000ms (configurable)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Badge variant="outline">Required</Badge>
                        <span className="text-sm">TX Power: -20 dBm to +4 dBm</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Badge variant="outline">Recommended</Badge>
                        <span className="text-sm">Support for connection-oriented communication</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Advertisement Packet Format</h3>
                    <div className="bg-muted p-4 rounded-lg font-mono text-sm space-y-1">
                      <div>0x02 0x01 0x06 - Flags (General Discoverable, BR/EDR not supported)</div>
                      <div>0x09 0xFF - Manufacturer Specific Data</div>
                      <div className="ml-4">0x4956 - Company ID (Invepin)</div>
                      <div className="ml-4">[16 bytes] - Unique Invepin ID</div>
                      <div className="ml-4">[1 byte] - Battery Level (0-100)</div>
                      <div className="ml-4">[1 byte] - Tag Type (0x01=BLE, 0x02=NFC)</div>
                      <div className="ml-4">[2 bytes] - Firmware Version</div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">GATT Services (Optional)</h3>
                    <div className="space-y-2">
                      <div className="bg-muted p-3 rounded-lg">
                        <code className="text-sm">0x180F - Battery Service</code>
                        <p className="text-sm text-muted-foreground mt-1">Read battery level percentage</p>
                      </div>
                      <div className="bg-muted p-3 rounded-lg">
                        <code className="text-sm">0x180A - Device Information</code>
                        <p className="text-sm text-muted-foreground mt-1">Manufacturer, model, firmware version</p>
                      </div>
                      <div className="bg-muted p-3 rounded-lg">
                        <code className="text-sm">Custom: 6E400001-B5A3-F393-E0A9-E50E24DCCA9E</code>
                        <p className="text-sm text-muted-foreground mt-1">Invepin configuration service (write product SKU, location data)</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="esp32" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>ESP32-S3 Programming Guide</CardTitle>
                  <CardDescription>Complete guide to program your ESP32-S3 as an Invepin-compatible BLE tag</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">Hardware Requirements</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                      <li>ESP32-S3 development board with BLE support</li>
                      <li>USB-C cable for programming and power</li>
                      <li>Optional: CR2032 battery holder for portable deployment</li>
                      <li>Optional: Custom PCB with antenna for production units</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Development Environment Setup</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Option 1: Arduino IDE (Recommended for beginners)</h4>
                        <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside ml-4">
                          <li>Install Arduino IDE 2.0+</li>
                          <li>Add ESP32 board support: File → Preferences → Additional Board Manager URLs:
                            <div className="bg-muted p-2 rounded mt-1 font-mono text-xs break-all">
                              https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
                            </div>
                          </li>
                          <li>Install ESP32 boards: Tools → Board → Boards Manager → "esp32" → Install</li>
                          <li>Select board: Tools → Board → ESP32 Arduino → ESP32S3 Dev Module</li>
                        </ol>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold mb-2">Option 2: PlatformIO (Recommended for production)</h4>
                        <div className="bg-muted p-3 rounded-lg font-mono text-xs space-y-1">
                          <div>[env:esp32-s3-devkitc-1]</div>
                          <div>platform = espressif32</div>
                          <div>board = esp32-s3-devkitc-1</div>
                          <div>framework = arduino</div>
                          <div>monitor_speed = 115200</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Required Libraries</h3>
                    <div className="space-y-2">
                      <div className="bg-muted p-3 rounded-lg">
                        <code className="text-sm">NimBLE-Arduino</code>
                        <p className="text-sm text-muted-foreground mt-1">Install via Arduino Library Manager or add to platformio.ini</p>
                      </div>
                      <div className="bg-muted p-3 rounded-lg">
                        <code className="text-sm">Preferences (built-in)</code>
                        <p className="text-sm text-muted-foreground mt-1">For storing Invepin ID in flash memory</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Complete Arduino Code Example</h3>
                    <div className="bg-muted p-4 rounded-lg font-mono text-xs space-y-1 overflow-x-auto">
                      <div className="text-primary">#include &lt;NimBLEDevice.h&gt;</div>
                      <div className="text-primary">#include &lt;Preferences.h&gt;</div>
                      <div></div>
                      <div>Preferences preferences;</div>
                      <div>NimBLEAdvertising *pAdvertising;</div>
                      <div></div>
                      <div className="text-muted-foreground">// Configuration</div>
                      <div>const char* INVEPIN_ID = "INV-ESP32-0001-ABCD"; // Unique 16-char ID</div>
                      <div>const uint16_t COMPANY_ID = 0x4956; // Invepin manufacturer ID</div>
                      <div>const int ADVERTISING_INTERVAL = 500; // milliseconds</div>
                      <div></div>
                      <div>void setup() {'{'}</div>
                      <div className="ml-4">Serial.begin(115200);</div>
                      <div className="ml-4">Serial.println("Invepin ESP32-S3 Starting...");</div>
                      <div></div>
                      <div className="ml-4 text-muted-foreground">// Initialize BLE</div>
                      <div className="ml-4">NimBLEDevice::init("Invepin");</div>
                      <div className="ml-4">NimBLEDevice::setPower(ESP_PWR_LVL_P9); // Max power</div>
                      <div></div>
                      <div className="ml-4 text-muted-foreground">// Create advertising</div>
                      <div className="ml-4">pAdvertising = NimBLEDevice::getAdvertising();</div>
                      <div></div>
                      <div className="ml-4 text-muted-foreground">// Build manufacturer data packet</div>
                      <div className="ml-4">std::string manufacturerData;</div>
                      <div className="ml-4">manufacturerData += (char)(COMPANY_ID & 0xFF);</div>
                      <div className="ml-4">manufacturerData += (char)(COMPANY_ID {'>'} 8);</div>
                      <div className="ml-4">manufacturerData += INVEPIN_ID; // 16 bytes</div>
                      <div className="ml-4">manufacturerData += (char)getBatteryLevel(); // 1 byte</div>
                      <div className="ml-4">manufacturerData += (char)0x01; // Tag type: BLE</div>
                      <div className="ml-4">manufacturerData += (char)0x01; // Firmware v1.0</div>
                      <div className="ml-4">manufacturerData += (char)0x00;</div>
                      <div></div>
                      <div className="ml-4">pAdvertising-&gt;setManufacturerData(manufacturerData);</div>
                      <div className="ml-4">pAdvertising-&gt;setAdvertisementType(BLE_GAP_CONN_MODE_NON);</div>
                      <div className="ml-4">pAdvertising-&gt;setMinInterval(ADVERTISING_INTERVAL);</div>
                      <div className="ml-4">pAdvertising-&gt;setMaxInterval(ADVERTISING_INTERVAL);</div>
                      <div></div>
                      <div className="ml-4 text-muted-foreground">// Start advertising</div>
                      <div className="ml-4">pAdvertising-&gt;start();</div>
                      <div className="ml-4">Serial.println("Invepin broadcasting!");</div>
                      <div>{'}'}</div>
                      <div></div>
                      <div>void loop() {'{'}</div>
                      <div className="ml-4 text-muted-foreground">// Update battery level every 60 seconds</div>
                      <div className="ml-4">delay(60000);</div>
                      <div className="ml-4">updateAdvertisement();</div>
                      <div>{'}'}</div>
                      <div></div>
                      <div>uint8_t getBatteryLevel() {'{'}</div>
                      <div className="ml-4 text-muted-foreground">// Read battery voltage (ESP32-S3 ADC)</div>
                      <div className="ml-4">int rawValue = analogRead(4); // GPIO4 for battery</div>
                      <div className="ml-4">int percentage = map(rawValue, 0, 4095, 0, 100);</div>
                      <div className="ml-4">return constrain(percentage, 0, 100);</div>
                      <div>{'}'}</div>
                      <div></div>
                      <div>void updateAdvertisement() {'{'}</div>
                      <div className="ml-4">pAdvertising-&gt;stop();</div>
                      <div className="ml-4 text-muted-foreground">// Rebuild packet with new battery level</div>
                      <div className="ml-4">std::string manufacturerData;</div>
                      <div className="ml-4">manufacturerData += (char)(COMPANY_ID & 0xFF);</div>
                      <div className="ml-4">manufacturerData += (char)(COMPANY_ID {'>'} 8);</div>
                      <div className="ml-4">manufacturerData += INVEPIN_ID;</div>
                      <div className="ml-4">manufacturerData += (char)getBatteryLevel();</div>
                      <div className="ml-4">manufacturerData += (char)0x01;</div>
                      <div className="ml-4">manufacturerData += (char)0x01;</div>
                      <div className="ml-4">manufacturerData += (char)0x00;</div>
                      <div className="ml-4">pAdvertising-&gt;setManufacturerData(manufacturerData);</div>
                      <div className="ml-4">pAdvertising-&gt;start();</div>
                      <div>{'}'}</div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Pin Configuration</h3>
                    <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
                      <div><strong>GPIO 4:</strong> Battery voltage monitoring (ADC)</div>
                      <div><strong>GPIO 5:</strong> Optional status LED</div>
                      <div><strong>GPIO 0:</strong> Boot button (for programming mode)</div>
                      <div><strong>3.3V / GND:</strong> Power supply (CR2032 holder or USB)</div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Flashing Instructions</h3>
                    <ol className="space-y-3 text-sm">
                      <li className="flex gap-3">
                        <span className="font-semibold">1.</span>
                        <div>
                          <strong>Connect ESP32-S3:</strong> Use USB-C cable to connect to computer
                          <div className="text-muted-foreground mt-1">Board should appear as COM port (Windows) or /dev/ttyUSB* (Linux/Mac)</div>
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <span className="font-semibold">2.</span>
                        <div>
                          <strong>Select Port:</strong> Tools → Port → Select your ESP32-S3
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <span className="font-semibold">3.</span>
                        <div>
                          <strong>Upload Code:</strong> Click Upload button (→) or use Ctrl+U
                          <div className="text-muted-foreground mt-1">If upload fails, hold BOOT button while connecting USB</div>
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <span className="font-semibold">4.</span>
                        <div>
                          <strong>Verify:</strong> Open Serial Monitor (115200 baud) to see "Invepin broadcasting!"
                        </div>
                      </li>
                    </ol>
                  </div>

                  <Alert>
                    <AlertDescription>
                      <strong>Important:</strong> Each Invepin must have a unique ID. Change the <code>INVEPIN_ID</code> constant 
                      for each device you program. After programming, register the device in HIVE Command Center using the same ID.
                    </AlertDescription>
                  </Alert>

                  <div>
                    <h3 className="font-semibold mb-3">Troubleshooting</h3>
                    <div className="space-y-2 text-sm">
                      <div className="bg-muted p-3 rounded-lg">
                        <strong>Issue:</strong> "Upload failed" or "Serial port not found"
                        <p className="text-muted-foreground mt-1">
                          Solution: Install CH340/CP2102 USB drivers. Hold BOOT button while connecting USB to enter download mode.
                        </p>
                      </div>
                      <div className="bg-muted p-3 rounded-lg">
                        <strong>Issue:</strong> Not detected by mobile app
                        <p className="text-muted-foreground mt-1">
                          Solution: Verify advertising is active (check Serial Monitor). Ensure COMPANY_ID is 0x4956. Check that Bluetooth is enabled on phone.
                        </p>
                      </div>
                      <div className="bg-muted p-3 rounded-lg">
                        <strong>Issue:</strong> Battery drains quickly
                        <p className="text-muted-foreground mt-1">
                          Solution: Increase advertising interval to 1000ms or higher. Reduce TX power if range isn't critical.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="setup" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Setup & Configuration</CardTitle>
                  <CardDescription>Step-by-step guide to program and register your Invepins</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">1</span>
                      Flash Firmware
                    </h3>
                    <p className="text-sm text-muted-foreground ml-9 mb-2">
                      Program your BLE device with Invepin-compatible firmware that implements the required advertisement format and GATT services.
                    </p>
                    <div className="ml-9 bg-muted p-4 rounded-lg">
                      <code className="text-xs">
                        // Example using Nordic nRF SDK<br/>
                        ble_advdata_t advdata;<br/>
                        advdata.flags = BLE_GAP_ADV_FLAGS_LE_ONLY_GENERAL_DISC_MODE;<br/>
                        // Add manufacturer data with Invepin ID<br/>
                      </code>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">2</span>
                      Configure Invepin ID
                    </h3>
                    <p className="text-sm text-muted-foreground ml-9 mb-2">
                      Each Invepin must have a unique 16-byte identifier. This can be generated or assigned during manufacturing.
                    </p>
                    <Alert className="ml-9">
                      <AlertDescription className="text-sm">
                        <strong>Format:</strong> Use a UUID v4 or sequential ID. Example: <code>INV-0001-ABCD-1234</code>
                      </AlertDescription>
                    </Alert>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">3</span>
                      Register in HIVE
                    </h3>
                    <p className="text-sm text-muted-foreground ml-9 mb-2">
                      Go to HIVE Command Center → Invepins tab and scan or manually register your Invepin:
                    </p>
                    <ul className="ml-9 space-y-2 text-sm text-muted-foreground list-disc list-inside">
                      <li>Enter the Invepin ID</li>
                      <li>Assign to a store location</li>
                      <li>Link to product SKU/UPC (optional)</li>
                      <li>Set item name and location details</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">4</span>
                      Verify Detection
                    </h3>
                    <p className="text-sm text-muted-foreground ml-9 mb-2">
                      Use the mobile app or HIVE dashboard to verify the Invepin is broadcasting and being detected:
                    </p>
                    <ul className="ml-9 space-y-2 text-sm text-muted-foreground list-disc list-inside">
                      <li>Check signal strength (RSSI)</li>
                      <li>Verify battery level reporting</li>
                      <li>Test location tracking</li>
                      <li>Confirm data sync to backend</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="api" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="w-5 h-5" />
                    Backend API Integration
                  </CardTitle>
                  <CardDescription>How Invepins communicate with the Invepin platform</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">Database Schema</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Invepin data is stored in the <code>invepin_data</code> table:
                    </p>
                    <div className="bg-muted p-4 rounded-lg font-mono text-xs space-y-1">
                      <div>id: uuid (primary key)</div>
                      <div>invepin_id: text (unique identifier)</div>
                      <div>store_id: uuid (reference to stores table)</div>
                      <div>item_name: text</div>
                      <div>location: text</div>
                      <div>battery_level: integer (0-100)</div>
                      <div>last_detected: timestamp</div>
                      <div>upc: text (product barcode)</div>
                      <div>data: jsonb (additional metadata)</div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Mobile App Detection Flow</h3>
                    <ol className="space-y-3 text-sm">
                      <li className="flex gap-3">
                        <span className="font-semibold">1.</span>
                        <div>
                          <strong>BLE Scan:</strong> App continuously scans for BLE advertisements
                          <div className="text-muted-foreground mt-1">Filters by Invepin manufacturer ID (0x4956)</div>
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <span className="font-semibold">2.</span>
                        <div>
                          <strong>Parse Data:</strong> Extracts Invepin ID, battery, RSSI from advertisement
                          <div className="text-muted-foreground mt-1">Validates packet format and checksum</div>
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <span className="font-semibold">3.</span>
                        <div>
                          <strong>Update Backend:</strong> Sends detection event to backend via real-time channel
                          <div className="bg-muted p-2 rounded mt-1 font-mono text-xs">
                            supabase.from('invepin_data').upsert()
                          </div>
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <span className="font-semibold">4.</span>
                        <div>
                          <strong>HIVE Sync:</strong> HIVE Command Center receives real-time updates
                          <div className="text-muted-foreground mt-1">All connected clients see live tracking data</div>
                        </div>
                      </li>
                    </ol>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Vision-Tag Fusion</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      The system combines BLE tag detection with AI vision for enhanced accuracy:
                    </p>
                    <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                      <li>Camera detects products visually with 85-95% confidence</li>
                      <li>BLE tags provide exact location via RSSI clustering</li>
                      <li>Fusion algorithm cross-validates both sources</li>
                      <li>Generates alerts for mismatches (missing tags, misplaced items)</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default InvepinSetup;
