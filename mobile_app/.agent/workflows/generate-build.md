---
description: How to generate a new Play Store build with auto-versioning
---

When the user says "Generate a new Play Store build", follow these steps:

1. Ensure all changes are committed to git.
2. Run the automated build script:
// turbo
```powershell
powershell -ExecutionPolicy Bypass -File scripts/build_release.ps1
```
3. The script will:
   - Increment the build number in `pubspec.yaml` (e.g., 2.0.0+4 -> 2.0.0+5).
   - Resolve dependencies via `flutter pub get`.
   - Build a signed App Bundle (.aab) and APK.
   - Copy the final artifacts to the root directory with the new version name.
4. Push the version change to GitHub:
// turbo
```powershell
git add pubspec.yaml ; git commit -m "Bump version for new build" ; git push origin main
```
5. Notify the user of the new filename and completion status.
