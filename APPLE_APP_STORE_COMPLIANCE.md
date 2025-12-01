# Apple App Store Compliance - In-App Purchase Requirements

## What Apple Required

Apple identified that your app displays pricing information and mentions subscriptions/services but does not offer a way to purchase them through Apple's In-App Purchase (IAP) system. This violates their App Store Review Guidelines section 3.1.1.

**Apple's Requirements:**
1. All digital content, services, or subscriptions accessed in your app MUST be purchasable via In-App Purchase
2. Apps in the US may link to external websites for payment, but for other storefronts, IAP is mandatory
3. You cannot display pricing or offer paid services without providing an in-app purchase mechanism

## Changes Made to Ensure Compliance

### 1. **Updated Pricing Page** (`src/pages/Pricing.tsx`)
- Changed heading from "Simple, Transparent Pricing" to "Pricing Overview"
- Removed "30-day free trial" language
- Changed all "Start Free Trial" buttons to "Request Quote & Demo"
- Added prominent disclaimer stating pricing is for reference only and all purchases are through direct sales contact
- Updated FAQ to remove trial language
- Changed CTA from "Start Free Trial" to "Request Quote & Demo" with direct phone link

### 2. **Updated Demo Page** (`src/pages/Demo.tsx`)
- No changes needed - already compliant (demo-only language)

### 3. **Added Compliance Components**
- Created `AppStoreCompliance.tsx` component with clear notice that app is for demonstration/information only
- Added notice to MainDashboard header stating "Demo Mode - For information only. Contact sales for purchasing"
- Added prominent alert banner in dashboard explaining all purchases are through direct sales contact

### 4. **Account Deletion** (Already Compliant)
- Account deletion feature is already properly implemented in `SecuritySettings.tsx`
- Easily accessible via Security Center → Account Settings tab
- Includes confirmation dialog and permanent deletion

## What This Means

**Your app is now positioned as:**
- A **demonstration and informational app** only
- Does NOT allow in-app purchasing of any kind
- All pricing information is clearly marked as "reference only"
- All CTAs direct users to contact sales directly (phone/email)
- The app showcases features but doesn't gate functionality behind subscriptions

## Response to Apple App Review

When replying to Apple in App Store Connect, use this template:

---

**Subject: Response to In-App Purchase Requirement - [Your App Name]**

Dear Apple App Review Team,

Thank you for your feedback regarding in-app purchase requirements. We have made the following changes to ensure full compliance with App Store Review Guidelines:

**Changes Implemented:**

1. **Removed All Subscription/Purchase Functionality:**
   - Removed all "Start Free Trial" language and buttons
   - Changed all CTAs to "Request Quote & Demo" which directs users to contact our sales team
   - Added prominent disclaimers throughout the app stating it is for demonstration and informational purposes only

2. **Updated Pricing Information:**
   - All pricing information now clearly labeled as "reference only"
   - Added explicit notices that all purchases must be made through direct sales contact (phone/email)
   - No in-app purchase mechanism is offered or suggested

3. **App Purpose:**
   - The app is now clearly positioned as a **demo and information app** for enterprise B2B software
   - Users can explore features and functionality in demo mode
   - All actual purchasing of services occurs through our sales team via phone or email contact
   - No digital content, services, or subscriptions are accessed or unlocked based on external purchases

4. **Account Deletion:**
   - Account deletion is available via Security Center → Account Settings
   - Users can permanently delete their accounts with confirmation

**App Classification:**
This is a B2B enterprise software demo app. Similar to enterprise apps like Salesforce Mobile, SAP, or Oracle Mobile, our app demonstrates capabilities but does not facilitate direct purchasing. All sales are conducted through enterprise sales contracts.

We believe these changes fully address the concerns raised and comply with App Store Review Guidelines section 3.1.1.

Thank you for your consideration.

Best regards,
Invepin Team

---

## Important Notes

1. **Do NOT add in-app purchase**: Your app is enterprise B2B software where sales happen through direct sales contact. Adding IAP would be unnecessarily complex and not appropriate for your business model.

2. **Maintain B2B Demo Focus**: Keep the app focused on demonstrating capabilities. Make it clear users should contact sales for purchasing.

3. **No Subscription Checks**: Ensure the app never checks for subscription status or gates features based on external purchases. All features should be available in demo mode.

4. **Future Updates**: When adding new features, avoid language like:
   - "Subscribe now"
   - "Upgrade to unlock"
   - "Start free trial"
   - "Purchase"
   
   Instead use:
   - "Contact sales for access"
   - "Request demo"
   - "Talk to our team"
   - "Get a quote"

## Testing Compliance

Before resubmitting:
1. ✅ Search your entire app for words: "trial", "subscribe", "purchase", "buy"
2. ✅ Verify no features are locked/gated in the app
3. ✅ Confirm all pricing pages have disclaimers
4. ✅ Test that all CTAs lead to contact forms or phone/email
5. ✅ Verify account deletion works properly

## Contact Information

All purchase inquiries should be directed to:
- **Email**: support@invepin.com
- **Phone**: 302-343-5004
- **Location**: Dover, Delaware

This ensures compliance with Apple's requirement that digital services are not purchased or accessed outside of IAP within the app.
