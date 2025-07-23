# GitHub Actions Setup for Firebase Deployment

## Issue: GitHub Actions Failed

The GitHub Actions workflow is failing because it needs Firebase service account credentials that weren't automatically set up.

## Quick Fix

### Option 1: Setup GitHub Actions with Firebase (Recommended)

#### Step 1: Access Firebase Console
1. Go to: https://console.firebase.google.com/project/json-ordering-tool/overview
2. You should see your "JSON Ordering Tool" project

#### Step 2: Navigate to Hosting
1. In the **left sidebar**, click **"Hosting"** (it has a web/globe icon)
2. You'll see the Hosting dashboard

#### Step 3: Look for GitHub Integration
**Option A - If you see tabs at the top:**
- Look for tabs like "Files", "Usage", "GitHub" 
- Click the **"GitHub"** tab

**Option B - If you don't see GitHub tab:**
- Click **"Get started"** button (if shown)
- Or look for **"Set up automatic deployment with GitHub"**
- Or click **"Connect to GitHub"** button

**Option C - If Hosting is already set up:**
- Look for **"Manage site"** or **"View console"** 
- Click the **gear/settings icon** next to your site
- Look for **"GitHub integration"** or **"Connect repository"**

#### Step 4: Authorize GitHub Connection
1. Click **"Authorize Firebase to access GitHub"** or **"Connect to GitHub"**
2. You'll be redirected to GitHub to authorize Firebase
3. Click **"Authorize firebase-adminsdk-xxxxx"**
4. Return to Firebase Console

#### Step 5: Select Repository
1. You should now see a dropdown or search field
2. Search for or select: **`edmondmiu/json-ordering-tool`**
3. Click **"Next"** or **"Continue"**

#### Step 6: Configure Build Settings
1. **Repository**: `edmondmiu/json-ordering-tool`
2. **Branch**: `main` 
3. **Build command**: `npm run build`
4. **Output directory**: `out`
5. Click **"Save"** or **"Finish setup"**

#### Step 7: Automatic Secret Setup
Firebase will automatically:
- Create the GitHub secret: `FIREBASE_SERVICE_ACCOUNT_JSON_ORDERING_TOOL`
- Configure GitHub Actions to deploy on every push
- Show you a success message

### Alternative Path: Using Firebase CLI

If the UI steps don't work, try:
```bash
cd json-ordering-tool
firebase init hosting:github
```

This will walk you through the same process via command line.

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