# Customer Purchase & Access Flow - Apple App Store Compliant

## Overview

This app is **Apple App Store compliant** by operating as a B2B enterprise demo and customer portal. It does NOT use In-App Purchase (IAP) because all sales happen through direct contact with your sales team.

## How It Works

### Phase 1: Demo/Prospect (BEFORE Purchase)
**Status**: `customer_status: 'demo'` in database

1. **User Downloads App**
   - User finds app in App Store
   - Downloads and installs on their device
   
2. **User Explores Demo**
   - Can register a company account (creates demo organization)
   - Sees demo data and test scenarios
   - Banner displays: "Demo Mode - Contact sales to activate full features"
   - Pricing page shows: "For information only - contact sales for purchasing"
   
3. **User Contacts Sales**
   - Clicks "Request Quote & Demo" buttons
   - Calls: 302-343-5004
   - Emails: support@invepin.com
   - Fills out enterprise consultation form

### Phase 2: Purchase (OUTSIDE the App)
**This happens via phone/email, NOT in the app**

4. **Sales Process (Off-App)**
   - Sales team provides custom quote
   - Discusses features, deployment, pricing
   - Customer signs contract
   - Customer makes payment (wire transfer, check, credit card via invoice)
   
5. **Sales Team Provisions Account**
   - Sales team logs into app as `super_admin`
   - Goes to Sales Portal tab
   - Enters customer's company code
   - Selects subscription tier (Starter/Professional/Enterprise)
   - Clicks "Provision Customer"
   - Customer status changes from `demo` to `active`

### Phase 3: Full Access (IN the App)
**Status**: `customer_status: 'active'` in database

6. **Customer Gets Access**
   - Customer already has the app installed
   - Customer logs in with existing credentials
   - App detects `customer_status: 'active'`
   - **Onboarding wizard appears** (if not completed)
   
7. **Onboarding Wizard**
   - Step 1: Welcome message
   - Step 2: Store setup (add first location)
   - Step 3: Device pairing info (explains installation process)
   - Step 4: Team setup (invite team members)
   - Marks `onboarding_completed: true`

8. **Full Feature Access**
   - No more demo banner
   - Header shows: "Professional Plan Active" (or their tier)
   - Can add real stores, devices, team members
   - Sees their actual data (not demo data)
   - Full access based on subscription tier

## Database Status Flow

```
Demo Account Registration
  ↓
customer_status: 'demo'
subscription_tier: 'demo'
  ↓
Sales Team Closes Deal (outside app)
  ↓
Sales Team Provisions via Sales Portal
  ↓
customer_status: 'active'
subscription_tier: 'starter' | 'professional' | 'enterprise'
purchased_at: timestamp
  ↓
Customer Logs In → Onboarding Wizard
  ↓
onboarding_completed: true
setup_completed_at: timestamp
  ↓
Full Access to Real Features
```

## Key Apple Compliance Points

### ✅ COMPLIANT: No In-App Purchase

- App does NOT sell subscriptions via Apple IAP
- App does NOT unlock features based on external purchases
- App authenticates legitimate business customers who purchased via direct sales

### ✅ COMPLIANT: B2B Enterprise Model

Similar to enterprise apps like:
- Salesforce Mobile (CRM system)
- SAP Mobile (ERP system)
- Microsoft Dynamics (business system)
- Oracle Mobile (enterprise software)

These apps:
1. Show demos for prospects
2. Sales happen via enterprise sales teams (outside app)
3. App authenticates paying customers
4. Customers access their business data

### ✅ COMPLIANT: Clear Demo Labeling

- Demo users see: "Demo Mode - Contact sales"
- Pricing page: "For information only - contact sales"
- All CTAs: "Request Quote" not "Subscribe Now"
- No "free trial" or "purchase" buttons

### ✅ COMPLIANT: Account Deletion

- Accessible via: Security Center → Account Settings
- Permanent deletion with confirmation
- Clear explanation of what gets deleted

## Subscription Tiers & Features

### Demo (Unpaid)
- Full feature exploration
- Demo data only
- Clear demo mode indicators
- All features accessible for testing

### Starter ($299/month)
- Up to 500 micro-pins
- Basic theft detection
- Mobile app access
- Email alerts

### Professional ($799/month)
- Up to 2,000 micro-pins
- Facial recognition
- Real-time dashboard
- SMS + Email alerts
- Advanced analytics

### Enterprise (Custom pricing)
- Unlimited micro-pins
- Full Colony hub system
- Advanced AI analytics
- Custom integrations
- Dedicated support
- White-label options

## Technical Implementation

### Customer Status Check

```typescript
const { organization, isDemoMode, isPaidCustomer } = useOrganization();

if (isDemoMode) {
  // Show demo banner, limit certain actions
}

if (isPaidCustomer) {
  // Full access, no banners
}
```

### Onboarding Check

```typescript
useEffect(() => {
  if (isPaidCustomer && !organization?.onboarding_completed) {
    // Show onboarding wizard
  }
}, [isPaidCustomer, organization]);
```

### Tier-Based Features

```typescript
const hasFeature = (feature: string) => {
  if (isDemoMode) return true; // Demo shows all features
  
  const tierFeatures = {
    starter: ['basic_tracking', 'mobile_access', 'email_alerts'],
    professional: ['basic_tracking', 'mobile_access', 'email_alerts', 'facial_recognition', 'sms_alerts', 'analytics'],
    enterprise: ['all'] // Everything
  };
  
  return tierFeatures[organization.subscription_tier]?.includes(feature) || 
         tierFeatures[organization.subscription_tier]?.includes('all');
};
```

## Sales Team Workflow

### To Provision a New Customer:

1. **Customer must first register** in the app (creates demo account)
2. **Sales team closes deal** via phone/email
3. **Login as super_admin**
4. **Navigate to** Sales Portal tab
5. **Enter company code** (customer has this from their registration email)
6. **Select subscription tier** (Starter/Professional/Enterprise)
7. **Click "Provision Customer"**
8. **Customer is notified** (they can now access full features)

### Company Code Lookup:

- Company codes are auto-generated during registration
- Format: ABC1234 (3 letters + 4 digits)
- Stored in `organizations.company_code`
- Customers receive this in their welcome email

## Support Contacts

All customer inquiries for purchasing should be directed to:
- **Email**: support@invepin.com
- **Phone**: 302-343-5004
- **Address**: Dover, Delaware (Headquarters)

## Important Notes

### ⚠️ What NOT to Add

**DO NOT ADD:**
- In-App Purchase (IAP) integration
- "Subscribe Now" buttons
- "Upgrade to unlock" messaging
- Subscription payment forms in the app
- Auto-renewal or billing screens

**WHY:** These would violate Apple's guidelines since purchases must go through IAP if offered in-app. Our model (direct B2B sales) is compliant because purchasing happens entirely outside the app.

### ✅ What IS Allowed

**YOU CAN:**
- Show pricing information (labeled as "reference only")
- Display subscription tiers and features
- Link to contact sales (phone/email)
- Authenticate customers who purchased outside app
- Show different features to demo vs paying customers

**WHY:** Apple allows B2B apps to authenticate business customers. The app doesn't facilitate purchasing - it just verifies legitimate access.

## Testing

### Test as Demo User:
1. Register new company
2. Verify demo banner appears
3. Verify all "Request Quote" CTAs work
4. Verify pricing shows disclaimer

### Test as Paying Customer:
1. Use Sales Portal to provision an account
2. Login as that customer
3. Verify onboarding wizard appears
4. Complete onboarding
5. Verify demo banner is gone
6. Verify subscription tier badge shows

### Test Account Deletion:
1. Login as any user
2. Navigate to Security Center → Account Settings
3. Click "Delete My Account"
4. Verify confirmation required
5. Verify account deletes successfully

## Frequently Asked Questions

### Q: Can users upgrade their plan in the app?
**A:** No. All plan changes happen via sales team (phone/email). This keeps us Apple compliant.

### Q: What if customer wants to cancel?
**A:** They contact support@invepin.com. Sales team updates their status to 'cancelled' via backend.

### Q: Can demo users see everything?
**A:** Yes! Demo users can explore all features with demo data. This helps with sales.

### Q: How long do demo accounts last?
**A:** Indefinitely. There's no time limit on demo accounts. This is intentional for Apple compliance - we don't pressure users to purchase within the app.

### Q: What happens when a customer's subscription ends?
**A:** Sales team changes `customer_status` from 'active' to 'cancelled'. User can still log in but sees demo mode banner and loses access to real data.

### Q: Do we ever show pricing in the app?
**A:** Yes, but with clear disclaimers that it's "reference only" and all purchasing happens via direct contact. This is Apple compliant.

## Conclusion

This model is **specifically designed for Apple App Store compliance** while providing excellent user experience for both prospects (demo users) and paying customers. The key is that the app never facilitates purchasing - it only authenticates business customers who purchased through traditional B2B sales channels.
