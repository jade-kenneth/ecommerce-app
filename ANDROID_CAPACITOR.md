# Android APK (Capacitor) — Full Documentation

This guide documents the complete flow used to generate a **signed Android APK** from the Next.js app using Capacitor, including **every error encountered and the fixes** applied.

---

## 1) Prepare the Next.js app for Android (static export + PWA)

Capacitor needs a **static web directory** that includes an `index.html`.

### ✅ Changes made
`apps/ecommerce-app/next.config.js`
- `output: 'export'`
- `images.unoptimized: true`
- production GraphQL defaults:
  - `NEXT_PUBLIC_PORTAL_API = https://ecommerce-server-app.up.railway.app/graphql`
  - `NEXT_PUBLIC_BASE_URL_PORTAL_API = https://ecommerce-server-app.up.railway.app`

---

## 2) Add Capacitor config + dependencies

### ✅ Added
`capacitor.config.ts`
```
webDir: 'dist/apps/ecommerce-app/.next'
```

### ✅ Installed
- `@capacitor/core`
- `@capacitor/android`
- `@capacitor/cli`

---

## 3) Build and Sync

```bash
npm run build:app
npm run cap:sync
```

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

**Create `android/keystore.properties`**
```properties
storeFile=release.keystore
storePassword=YOUR_STORE_PASSWORD
keyAlias=ecommerce
keyPassword=YOUR_KEY_PASSWORD
```

**Gradle signing config**
`android/app/build.gradle` now loads the keystore and uses `signingConfigs.release`.

---

## 5) One-command APK build

```bash
npm run apk:release
```

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

---

# Errors Encountered & Fixes

### ❌ `NX Failed to start plugin worker`
**Cause**: Nx pseudo-terminal not allowed  
**Fix**: Disabled pseudo-terminal & native runner:
```
NX_NATIVE_COMMAND_RUNNER=false NX_PSEUDO_TERMINAL=false
```

---

### ❌ `Unsupported class file major version 68`
**Cause**: Java 24 detected  
**Fix**: Force JDK 17  
```bash
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
```

---

### ❌ `Failed to read key ecommerce` (wrong password)
**Cause**: keystore password mismatch  
**Fix**: update `android/keystore.properties` or regenerate keystore

---

### ❌ `Could not find web assets directory`
**Cause**: Capacitor expected `apps/ecommerce-app/out`  
**Fix**: set `webDir` to `dist/apps/ecommerce-app/.next`

---

### ❌ `/product/[productId] missing generateStaticParams()`
**Cause**: static export requires params  
**Fix**: added `generateStaticParams` with fallback

---

### ❌ `/admin/[slug] missing generateStaticParams()`
**Cause**: static export requires params  
**Fix**: added slug list

---

### ❌ `useSearchParams should be wrapped in Suspense`
**Cause**: not compatible with static export  
**Fix**: removed `useSearchParams` in `/admin`

---

### ❌ Capacitor IPC log `EPERM`
**Cause**: telemetry logging blocked  
**Fix**: run with `CI=1`

---

If you want this moved into `README.md` or converted to PDF, just say the word.

