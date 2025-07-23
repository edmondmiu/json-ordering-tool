# Deployment Guide

## Firebase Setup Instructions

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Name it `json-ordering-tool`
4. Follow the setup wizard

### 2. Enable Hosting
1. In Firebase Console, go to "Hosting"
2. Click "Get started"
3. Follow the setup instructions

### 3. Setup GitHub Actions (Recommended)

#### Option A: Automatic Setup
1. In Firebase Console, go to Hosting
2. Click "GitHub" tab
3. Connect your GitHub repository: `edmondmiu/json-ordering-tool`
4. Firebase will automatically add the deployment secrets

#### Option B: Manual Setup
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Generate service account key:
   ```bash
   firebase projects:list
   firebase use json-ordering-tool
   firebase hosting:github:setup
   ```
4. Add the service account JSON to GitHub Secrets as `FIREBASE_SERVICE_ACCOUNT_JSON_ORDERING_TOOL`

### 4. Deploy
Once setup is complete, the app will deploy automatically on every push to `main` branch.

## Manual Deployment

If you prefer manual deployment:

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Deploy to Firebase
firebase deploy --project json-ordering-tool
```

## Live URL
Once deployed, the app will be available at:
🌐 **https://json-ordering-tool.web.app**

## Project Structure for Deployment
```
out/                 # Next.js static export output
├── index.html       # Main app entry point
├── _next/           # Next.js assets
└── ...             # Other static files
```

Firebase hosting serves the `out/` directory as configured in `firebase.json`.