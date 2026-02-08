# Android APK (Capacitor) — Full Documentation

This guide documents the complete flow used to generate a **signed Android APK** from the Next.js app using Capacitor, including **every error encountered and the fixes** applied.

---

## 1) Prepare the Next.js app for Android (static export + PWA)

Capacitor needs a **static web directory** that includes an `index.html`.

### ✅ Changes made
`apps/ecommerce-app/next.config.js`
- `output: 'export'`  
  Enables static export so Capacitor can load a local `index.html`.
- `images.unoptimized: true`  
  Required for static export when using `next/image`.
- production GraphQL defaults:
  - `NEXT_PUBLIC_PORTAL_API = https://ecommerce-server-app.up.railway.app/graphql`  
    Default API endpoint used during production builds.
  - `NEXT_PUBLIC_BASE_URL_PORTAL_API = https://ecommerce-server-app.up.railway.app`  
    Base URL for auth/license services in production.

---

## 2) Add Capacitor config + dependencies

### ✅ Added
`capacitor.config.ts`
```
webDir: 'dist/apps/ecommerce-app/.next'
appName: 'Amy Store'
```
`webDir` points Capacitor to the exported static assets. `appName` controls the Android display name.

### ✅ Installed
- `@capacitor/core`
- `@capacitor/android`
- `@capacitor/cli`

### ✅ package.json updates
Added scripts:
- `build:app`: `NX_ISOLATE_PLUGINS=false NX_NATIVE_COMMAND_RUNNER=false NX_PSEUDO_TERMINAL=false npx nx run ecommerce-app:build`  
  Builds the Next.js app in a sandbox-safe way (avoids Nx pseudo-terminal errors).
- `cap:sync`: `CI=1 npx cap sync android`  
  Syncs Capacitor assets while disabling telemetry IPC logging.
- `android:version:bump`: `node scripts/bump-android-version.js`  
  Auto-increments `versionCode` and bumps `versionName`.
- `apk:release`: `node scripts/run-apk-release.js`  
  One-command release build: bump → build → sync → gradle assemble.

Added dependencies:
- `@capacitor/core`  
  Capacitor runtime for hybrid apps.
- `@capacitor/android`  
  Android platform implementation for Capacitor.

Added devDependencies:
- `@capacitor/cli`  
  Capacitor CLI tools (init, sync, add platform, etc).

---

## 3) Build and Sync

```bash
npm run build:app
npm run cap:sync
```
`build:app` generates the static web assets. `cap:sync` copies them into the Android project.

---

## 4) Signing Setup

### ✅ Steps

**Generate keystore**
```bash
keytool -genkeypair -v \
  -keystore android/app/release.keystore \
  -alias ecommerce \
  -keyalg RSA -keysize 2048 -validity 10000
```
Creates a private signing key used for release APKs.

**Create `android/keystore.properties`**
```properties
storeFile=release.keystore
storePassword=YOUR_STORE_PASSWORD
keyAlias=ecommerce
keyPassword=YOUR_KEY_PASSWORD
```
Gradle reads this file to sign the release build.

**Gradle signing config**
`android/app/build.gradle` now loads the keystore and uses `signingConfigs.release`.
This ensures the release APK is properly signed.

---

## 5) One-command APK build

```bash
npm run apk:release
```
Runs the entire release pipeline end-to-end.

This script:
- bumps `versionCode` + `versionName`
- builds web assets
- runs `cap sync`
- builds the signed release APK
- prints the APK path at the end

---

## ✅ APK Output
```
android/app/build/outputs/apk/release/app-release.apk
```
This is the file you upload to Play Store or share directly.

---

## 6) Branding (App Name + Icon)

### ✅ App name
Updated Android app name to **Amy Store**:
`android/app/src/main/res/values/strings.xml`
- `app_name`
- `title_activity_main`
These values control the label shown on the device.

Also updated Capacitor config:
`capacitor.config.ts` → `appName: 'Amy Store'`
Keeps Capacitor metadata consistent with Android resources.

### ✅ App icon
Replaced all Android launcher icons with `LogoBlack.png` (padded on white background) in:
```
android/app/src/main/res/mipmap-*
```
Files replaced:
- `ic_launcher.png`
- `ic_launcher_round.png`
- `ic_launcher_foreground.png`
These files define the adaptive and legacy launcher icons.

---

# Errors Encountered & Fixes

### ❌ `NX Failed to start plugin worker`
**Cause**: Nx pseudo-terminal not allowed  
**Fix**: Disabled pseudo-terminal & native runner:
```
NX_NATIVE_COMMAND_RUNNER=false NX_PSEUDO_TERMINAL=false
```
This prevents Nx from creating IPC sockets in restricted environments.

---

### ❌ `Unsupported class file major version 68`
**Cause**: Java 24 detected  
**Fix**: Force JDK 17  
```bash
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
```
Gradle/AGP requires Java 17 (or 21) for stable builds.

---

### ❌ `Failed to read key ecommerce` (wrong password)
**Cause**: keystore password mismatch  
**Fix**: update `android/keystore.properties` or regenerate keystore
The store password must match the keystore used for signing.

---

### ❌ `Could not find web assets directory`
**Cause**: Capacitor expected `apps/ecommerce-app/out`  
**Fix**: set `webDir` to `dist/apps/ecommerce-app/.next`
Capacitor needs the actual exported folder with `index.html`.

---

### ❌ `/product/[productId] missing generateStaticParams()`
**Cause**: static export requires params  
**Fix**: added `generateStaticParams` with fallback
Static export must know all dynamic routes at build time.

---

### ❌ `/admin/[slug] missing generateStaticParams()`
**Cause**: static export requires params  
**Fix**: added slug list
Admin routes must be enumerated for static export.

---

### ❌ `useSearchParams should be wrapped in Suspense`
**Cause**: not compatible with static export  
**Fix**: removed `useSearchParams` in `/admin`
`useSearchParams` triggers dynamic rendering which breaks export.

---

### ❌ Capacitor IPC log `EPERM`
**Cause**: telemetry logging blocked  
**Fix**: run with `CI=1`
This disables Capacitor IPC logging to protected directories.

---

### ❌ `Using flatDir should be avoided` (Gradle warning)
**Cause**: Capacitor Cordova plugin module adds `flatDir` repositories by default.  
**Fix**: post-process Gradle files after `cap sync` to remove `flatDir` and keep local JAR/AAR support.
Script added:
```
node scripts/patch-capacitor-gradle.js
```
This disables Capacitor IPC logging to protected directories.

---

If you want this moved into `README.md` or converted to PDF, just say the word.
