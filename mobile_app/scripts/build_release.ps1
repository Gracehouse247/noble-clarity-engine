# Noble Clarity Build & Version Management Script
# This script auto-increments the build number and generates signed release artifacts.

$pubspecPath = "pubspec.yaml"
$buildDir = "build"

# 1. Read current version from pubspec.yaml
Write-Host "Reading current version..." -ForegroundColor Cyan
$pubspecContent = Get-Content $pubspecPath -Raw
$versionMatch = [regex]::Match($pubspecContent, 'version:\s*(\d+\.\d+\.\d+)\+(\d+)')

if (-not $versionMatch.Success) {
    Write-Error "Could not find version string in pubspec.yaml"
    exit 1
}

$versionName = $versionMatch.Groups[1].Value
$buildNumber = [int]$versionMatch.Groups[2].Value
$newBuildNumber = $buildNumber + 1
$newVersion = "$versionName+$newBuildNumber"

Write-Host "Incrementing build number: $buildNumber -> $newBuildNumber" -ForegroundColor Green

# 2. Update pubspec.yaml
$newPubspecContent = $pubspecContent -replace 'version:\s*\d+\.\d+\.\d+\+\d+', "version: $newVersion"
Set-Content -Path $pubspecPath -Value $newPubspecContent -NoNewline

# 3. Clean and Fetch Dependencies
Write-Host "Cleaning project..." -ForegroundColor Yellow
flutter clean
Write-Host "Fetching dependencies..." -ForegroundColor Yellow
flutter pub get

# 4. Build App Bundle (.aab)
Write-Host "Building App Bundle (Release)..." -ForegroundColor Magenta
flutter build appbundle --release --no-tree-shake-icons

# 5. Build APK
Write-Host "Building APK (Release)..." -ForegroundColor Magenta
flutter build apk --release --no-tree-shake-icons

# 6. Organize Artifacts
$buildDir = "build"

# ... (rest of script setup) ...

# NOTE: Sections 1-5 (lines 7-42) are unchanged. I am correcting the artifact retrieval section below.

# 6. Organize Artifacts
$safeVersion = $newVersion -replace '\+', '_' -replace '\.', '_'
$aabDest = "noble_clarity_v$safeVersion.aab"
$apkDest = "noble_clarity_v$safeVersion.apk"

Write-Host "Organizing artifacts..." -ForegroundColor Cyan

$aabSource = "$buildDir\app\outputs\bundle\release\app-release.aab"
$apkSource = "$buildDir\app\outputs\flutter-apk\app-release.apk"

if (Test-Path $aabSource) {
    Copy-Item -Path $aabSource -Destination ".\$aabDest" -Force
    Write-Host "Created: $aabDest" -ForegroundColor Green
}
else {
    Write-Error "App Bundle source not found at $aabSource"
}

if (Test-Path $apkSource) {
    Copy-Item -Path $apkSource -Destination ".\$apkDest" -Force
    Write-Host "Created: $apkDest" -ForegroundColor Green
}
else {
    Write-Error "APK source not found at $apkSource"
}

Write-Host "Build Process Complete! Version: $newVersion" -ForegroundColor Green
