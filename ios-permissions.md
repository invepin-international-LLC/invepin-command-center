# iOS Microphone & Camera Permissions Setup

After syncing with `npx cap sync ios`, you need to add microphone and camera permissions to your iOS app:

1. Open `ios/App/App/Info.plist` in Xcode or a text editor
2. Add the following entries:

```xml
<key>NSMicrophoneUsageDescription</key>
<string>This app needs microphone access for walkie-talkie voice communication and emergency alerts</string>
<key>NSCameraUsageDescription</key>
<string>This app needs camera access for facial recognition clock in/out and item scanning</string>
```

3. Clean and rebuild the app:
   - In Xcode: Product → Clean Build Folder (Shift + Cmd + K)
   - Then: Product → Build (Cmd + B)
4. Run the app with `npx cap run ios`

## Full iOS Setup Steps

```bash
# From your local machine after pulling from GitHub
npm install
npx cap add ios
npx cap sync ios
```

Then manually add the microphone permission to Info.plist as shown above, and run:

```bash
npx cap run ios
```
