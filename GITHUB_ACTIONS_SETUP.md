# GitHub Actions Setup for Firebase Deployment

## Issue: GitHub Actions Failed

The GitHub Actions workflow is failing because it needs Firebase service account credentials that weren't automatically set up.

## Quick Fix

### Option 1: Setup GitHub Actions with Firebase (Recommended)

1. **Go to Firebase Console**: https://console.firebase.google.com/project/json-ordering-tool/overview

2. **Navigate to Hosting**:
   - Click "Hosting" in the left sidebar
   - Click on the "GitHub" tab

3. **Connect Repository**:
   - Click "Authorize Firebase to access GitHub" 
   - Select repository: `edmondmiu/json-ordering-tool`
   - Configure deployment settings:
     - Branch: `main`
     - Build command: `npm run build`
     - Output directory: `out`

4. **Firebase will automatically**:
   - Add the required GitHub secret: `FIREBASE_SERVICE_ACCOUNT_JSON_ORDERING_TOOL`
   - Configure the workflow to deploy on every push to main

### Option 2: Disable GitHub Actions (Quick Fix)

If you prefer manual deployment only:

1. **Delete the workflow files**:
   ```bash
   rm -rf .github/workflows/
   ```

2. **Continue using manual deployment**:
   ```bash
   npm run build
   firebase deploy
   ```

## Current Status

- ✅ **Manual deployment works perfectly**
- ✅ **Live app is updated**: https://json-ordering-tool.web.app
- ❌ **GitHub Actions needs Firebase integration**

## Recommended Solution

Use **Option 1** to get automatic deployments working. Firebase will handle all the secret setup automatically when you connect the GitHub repository through the Firebase Console.

After setup, every push to `main` branch will automatically deploy to Firebase Hosting!