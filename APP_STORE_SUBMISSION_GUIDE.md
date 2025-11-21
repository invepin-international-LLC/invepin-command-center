# App Store Submission Guide for Invepin

## Prerequisites Checklist

✅ **Apple Developer Account** ($99/year)
- Enroll at: https://developer.apple.com/programs/enroll/

✅ **Mac with Xcode** (Latest version)
- Download from Mac App Store

✅ **Project on GitHub**
- Export your Lovable project to GitHub using the GitHub button

---

## Step 1: Build the App Locally

### 1.1 Clone Your Project
```bash
# Clone from your GitHub repo
git clone [your-github-repo-url]
cd [your-project-name]

# Install dependencies
npm install
```

### 1.2 Add iOS Platform
```bash
# Add iOS platform
npx cap add ios

# Build the web assets
npm run build

# Sync to iOS
npx cap sync ios

# Open in Xcode
npx cap open ios
```

### 1.3 Configure Info.plist
Open `ios/App/App/Info.plist` and add:

```xml
<key>NSMicrophoneUsageDescription</key>
<string>This app needs microphone access for walkie-talkie voice communication and emergency alerts</string>
<key>NSCameraUsageDescription</key>
<string>This app needs camera access for facial recognition clock in/out and item scanning</string>
```

---

## Step 2: Configure in Xcode

### 2.1 Signing & Capabilities
1. Open the project in Xcode
2. Select the "App" target
3. Go to "Signing & Capabilities"
4. **Team**: Select your Apple Developer account
5. **Bundle Identifier**: `com.invepin.barmanagement` (already configured)
6. Enable **Automatic Signing**

### 2.2 App Icons
Create app icons for all required sizes and add to `ios/App/App/Assets.xcassets/AppIcon.appiconset/`:
- 1024×1024 (App Store)
- 180×180, 120×120, 87×87, 80×80, 60×60, 58×58, 40×40, 29×29, 20×20

Use a tool like https://appicon.co/ to generate all sizes from one image.

### 2.3 Launch Screen
Configure your launch screen in Xcode:
- Background color: #0F172A (already set in capacitor.config.json)
- Add your logo to the launch screen storyboard

---

## Step 3: Archive & Upload

### 3.1 Create Archive
1. In Xcode, select **Any iOS Device** as target
2. Go to **Product → Archive**
3. Wait for the archive to complete
4. Archive window will open automatically

### 3.2 Distribute to App Store
1. Click **Distribute App**
2. Select **App Store Connect**
3. Click **Upload**
4. Follow the prompts and upload

---

## Step 4: Fill Out App Store Connect

### 4.1 Create New App
1. Go to https://appstoreconnect.apple.com
2. Click **My Apps** → **+** → **New App**
3. Fill in:
   - **Platform**: iOS
   - **Name**: Invepin
   - **Primary Language**: English (U.S.)
   - **Bundle ID**: com.invepin.barmanagement
   - **SKU**: INVEPIN001 (or any unique identifier)

### 4.2 App Information

#### General Information
- **Name**: `Invepin`
- **Subtitle**: `Professional Inventory Control`
- **Privacy Policy URL**: `https://[your-domain]/privacy-policy.html`
  - (Upload your `public/privacy-policy.html` to your domain)

#### Categories
- **Primary Category**: Business
- **Secondary Category**: Productivity

#### Content Rights
- Check: "Contains no copyrighted content"

---

## Step 5: Version Information (New Version/Release)

### 5.1 Screenshots Required
Create screenshots for these devices:
- **6.7" Display** (iPhone 15 Pro Max): 1290×2796 (up to 10 screenshots)
- **6.5" Display** (iPhone 11 Pro Max): 1242×2688 (up to 10 screenshots)
- **5.5" Display** (iPhone 8 Plus): 1242×2208 (up to 10 screenshots)

Use Xcode Simulator to capture screenshots:
1. Run app in desired simulator
2. **Window → Screenshot** (Cmd+S)
3. Take 3-10 screenshots showing key features

### 5.2 Description
```
Invepin is a comprehensive inventory management and loss prevention platform designed to transform how businesses track, protect, and optimize their inventory across retail, hospitality, healthcare, and grocery operations.

Our intelligent inventory management system provides real-time stock tracking with advanced barcode and SKU scanning capabilities. The platform automatically monitors stock levels and sends reorder alerts before you run out.

Security and loss prevention are at the core of Invepin's design. Our innovative IoT micro-pin tracking technology provides unprecedented protection for high-value items, with our Colony Hub system capable of managing up to 10,000 individual micro-pins simultaneously.

KEY FEATURES:
• Real-time inventory tracking with barcode scanning
• Advanced loss prevention with IoT micro-pin technology
• Multi-camera security monitoring with AI detection
• Facial recognition clock in/out for staff
• Comprehensive analytics and reporting
• Multi-location support for enterprise operations
• Bar & restaurant pour detection technology
• Role-based access control
• Shift scheduling and time tracking
• Real-time alerts and notifications

INDUSTRY SOLUTIONS:
• Bars & Restaurants: Bottle tracking, pour detection
• Retail: High-value item protection, theft prevention
• Healthcare: Medical supply tracking, compliance
• Multi-location Enterprise: Centralized management

Whether you operate a retail store, bar, restaurant, nightclub, hotel, grocery store, healthcare facility, or multi-location enterprise, Invepin provides professional-grade management tools to prevent shrinkage, improve accountability, and gain complete visibility.
```

### 5.3 Keywords (100 characters max)
```
bar management,inventory,loss prevention,barcode,staff,security,tracking,restaurant,analytics,POS
```

### 5.4 Promotional Text (Optional, 170 characters)
```
Transform your business with professional inventory management. Real-time tracking, loss prevention, and staff management in one powerful platform.
```

### 5.5 Support URL
```
https://[your-domain]/support
```

### 5.6 Marketing URL (Optional)
```
https://[your-domain]
```

---

## Step 6: App Privacy

### 6.1 Privacy Information
Click **Set Up Privacy Details** and answer:

#### **Data Types Collected**:

1. **Contact Info** → **Email Address**
   - Used for: App Functionality, Developer's Advertising
   - Linked to user: Yes
   - Used for tracking: No

2. **User Content** → **Photos or Videos**
   - Purpose: App Functionality (Facial Recognition, Barcode Scanning)
   - Linked to user: Yes
   - Used for tracking: No

3. **Identifiers** → **User ID**
   - Purpose: App Functionality
   - Linked to user: Yes
   - Used for tracking: No

4. **Usage Data** → **Product Interaction**
   - Purpose: Analytics
   - Linked to user: Yes
   - Used for tracking: No

5. **Location** → **Precise Location** (if using GPS features)
   - Purpose: App Functionality (Clock in/out location verification)
   - Linked to user: Yes
   - Used for tracking: No

### 6.2 Privacy Practices
- **Does this app use data for tracking purposes?** → No
- **Does this app collect data from the app?** → Yes

---

## Step 7: Age Rating

### Content Rating Questionnaire:
- **Unrestricted Web Access**: No
- **Gambling and Contests**: No
- **Made for Kids**: No
- **Frequent/Intense Mature/Suggestive Themes**: No

**Result**: **4+** (No Objectionable Content)

---

## Step 8: App Review Information

### 8.1 Contact Information
- **First Name**: [Your First Name]
- **Last Name**: [Your Last Name]
- **Phone Number**: [Your Phone]
- **Email**: [Your Email]

### 8.2 Demo Account (Required for Review)
Create a test account for Apple reviewers:
- **Username**: demo@invepin.com
- **Password**: DemoPassword123!
- **Additional Notes**: 
```
Demo account has full access to all features.

FACIAL RECOGNITION: The app uses facial recognition for staff clock in/out. 
This is an optional feature that requires user consent and is used exclusively 
for time tracking and payroll accuracy. Users can also clock in with PIN codes.

CAMERA: Camera is used for:
1. Barcode scanning for inventory management
2. Optional facial recognition for clock in/out with user consent

MICROPHONE: Used for walkie-talkie communication between staff members 
for emergency alerts and team coordination.
```

### 8.3 Notes
```
This is a professional business management application designed for retail, 
hospitality, and healthcare operations.

Camera Permission: Used for barcode scanning (inventory) and optional 
facial recognition (staff authentication with explicit consent).

Microphone Permission: Used for walkie-talkie voice communication between 
staff members and emergency alerts.

The app requires users to create an account and join an organization. 
The demo account is pre-configured for full feature access.
```

---

## Step 9: Pricing & Availability

### Pricing
- **Price**: Free (or set your pricing tier)

### Availability
- **Countries/Regions**: Select all or specific countries
- **Pre-Order**: No (unless you want to set a future release date)

---

## Step 10: Build Selection

1. After uploading from Xcode, wait 5-15 minutes for processing
2. Refresh App Store Connect
3. In **Version** section, click **Build** → Select your uploaded build
4. If asked about **Export Compliance**: 
   - "No" if you're not using encryption beyond standard iOS encryption

---

## Step 11: Submit for Review

1. Review all sections (must have green checkmarks)
2. Click **Add for Review**
3. Click **Submit to App Review**

### Review Timeline
- **Initial Review**: 24-48 hours typically
- **Resubmission**: If rejected, address issues and resubmit

---

## Post-Submission

### Monitor Status
- **Waiting for Review** → **In Review** → **Pending Developer Release** or **Ready for Sale**

### If Rejected
- Check the Resolution Center in App Store Connect
- Address all issues listed by reviewers
- Resubmit with explanations

---

## Quick Reference: App Details

- **App Name**: Invepin
- **Bundle ID**: com.invepin.barmanagement
- **Version**: 1.0
- **Category**: Business / Productivity
- **Age Rating**: 4+
- **Price**: Free
- **Keywords**: bar management,inventory,loss prevention,barcode,staff,security,tracking,restaurant,analytics,POS

---

## Troubleshooting

### Build Failed
- Clean build folder: Xcode → Product → Clean Build Folder (Shift+Cmd+K)
- Update CocoaPods: `cd ios/App && pod install`
- Check provisioning profiles and certificates

### Upload Failed
- Verify Bundle ID matches
- Check code signing certificates
- Ensure Xcode is latest version

### Review Rejection
- Carefully read rejection reasons
- Address each point specifically
- Provide clear explanations in "Notes" section

---

## Need Help?

- **Apple Developer Support**: https://developer.apple.com/support/
- **App Store Connect Help**: https://help.apple.com/app-store-connect/
- **Capacitor iOS Docs**: https://capacitorjs.com/docs/ios

---

**Good luck with your submission! 🚀**
