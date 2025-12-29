# Marble Masters - Deployment Guide

## Prerequisites

- Node.js 18+
- npm or yarn
- Xcode 15+ (for iOS builds)
- Apple Developer Account (for App Store submission)

---

## 1. Generate App Icons

First, install sharp for icon generation:

```bash
npm install sharp --save-dev
```

Then run the icon generation script:

```bash
node scripts/generate-icons.js
```

This creates:
- PWA icons in `public/icons/`
- iOS icons in `ios-icons/`
- Apple touch icon at `public/apple-touch-icon.png`

---

## 2. Build for Web (PWA)

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Preview locally
npm run preview
```

The PWA is built to `dist/` and can be deployed to any static hosting:
- Vercel
- Netlify
- GitHub Pages
- Firebase Hosting

---

## 3. Build for iOS (Native App)

### Initial Setup (One Time)

```bash
# Install Capacitor iOS platform
npm install @capacitor/ios

# Initialize iOS project
npx cap add ios

# Copy iOS icons to Xcode project
# Copy contents of ios-icons/ to ios/App/App/Assets.xcassets/AppIcon.appiconset/
```

### Build & Deploy

```bash
# Build web assets
npm run build

# Sync to iOS project
npx cap sync ios

# Open in Xcode
npx cap open ios
```

### In Xcode

1. Select your Apple Developer Team
2. Set the Bundle Identifier to `com.marblemasters.app`
3. Configure signing certificates
4. Select target device or "Any iOS Device"
5. Product → Archive
6. Distribute to App Store Connect

---

## 4. App Store Submission Checklist

### Before Submission

- [ ] All icons generated (see step 1)
- [ ] App builds without errors
- [ ] Tested on multiple device sizes
- [ ] Privacy policy accessible in-app and online
- [ ] Age rating questionnaire completed

### App Store Connect Setup

1. Create new app in App Store Connect
2. Fill in app metadata (see `APP_STORE_METADATA.md`)
3. Upload screenshots for:
   - iPhone 6.7" (1290 x 2796)
   - iPhone 6.5" (1284 x 2778)
   - iPhone 5.5" (1242 x 2208)
   - iPad Pro 12.9" (2048 x 2732)
   - iPad Pro 11" (1668 x 2388)

### Screenshots to Capture

1. Age selection screen
2. Gameplay (marble on track)
3. Educational challenge modal
4. Level completion with stars
5. Badge collection view
6. Parent dashboard

### Required Information

- **App Name**: Marble Masters: Learn & Play
- **Category**: Education
- **Age Rating**: 4+
- **Price**: Free
- **Privacy Policy URL**: https://marblemasters.app/privacy
- **Support URL**: https://marblemasters.app/support

---

## 5. Privacy & Compliance

### COPPA Compliance

Marble Masters is designed to be fully COPPA compliant:

- ✅ No personal data collection
- ✅ No third-party analytics
- ✅ No advertising
- ✅ No in-app purchases
- ✅ No external links accessible to children
- ✅ Parental gate for settings
- ✅ Works offline

### App Store Review Notes

Include in review notes:
```
Marble Masters is an educational game for children ages 3-10.

Parental Controls Access:
- Long-press the family icon (bottom left) for 2 seconds
- Default PIN is 0000

The app:
- Collects no personal data
- Has no ads or in-app purchases
- Works completely offline
- Is COPPA compliant
```

---

## 6. Post-Launch

### Analytics (Privacy-Preserving)

For privacy-preserving analytics, consider:
- App Store Connect analytics (built-in, no SDK needed)
- Plausible Analytics (GDPR/COPPA friendly)

### Updates

```bash
# Make changes to code
# Update version in package.json

# Rebuild
npm run build
npx cap sync ios

# Open Xcode and create new archive
npx cap open ios
```

---

## Troubleshooting

### Build Errors

```bash
# Clear caches
rm -rf node_modules dist
npm install
npm run build
```

### Capacitor Sync Issues

```bash
# Clean iOS build
cd ios && xcodebuild clean && cd ..
npx cap sync ios
```

### Icon Issues

Make sure all icon sizes exist in:
- `public/icons/` for PWA
- `ios/App/App/Assets.xcassets/AppIcon.appiconset/` for iOS

---

## File Structure

```
marblemasters/
├── public/
│   ├── icons/              # PWA icons
│   ├── favicon.svg         # Source icon
│   └── apple-touch-icon.png
├── ios-icons/              # Generated iOS icons
├── ios/                    # Capacitor iOS project
├── dist/                   # Built web app
├── scripts/
│   └── generate-icons.js   # Icon generation script
├── capacitor.config.ts     # Capacitor configuration
├── APP_STORE_METADATA.md   # App Store listing content
└── DEPLOYMENT.md           # This file
```

---

## Support

For issues or questions:
- GitHub Issues: https://github.com/marblemasters/app/issues
- Email: support@marblemasters.app
