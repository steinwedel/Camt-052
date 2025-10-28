# 📦 Release Guide - Binäre Dateien veröffentlichen

Umfassender Leitfaden zur Veröffentlichung von binären Dateien (Executables) für den CAMT.052 Viewer.

---

## 🎯 Übersicht

Für die Veröffentlichung der binären Dateien empfehle ich einen **mehrstufigen Ansatz**:

1. **GitHub Releases** (Primär) - Für alle Plattformen
2. **Automatisierte CI/CD Builds** - Mit GitHub Actions
3. **Alternative Distributionskanäle** - Optional für größere Reichweite

---

## 📋 Methode 1: GitHub Releases (Empfohlen)

### Vorteile
- ✅ Kostenlos und direkt im Repository
- ✅ Versionskontrolle und Changelog
- ✅ Automatische Benachrichtigungen für Follower
- ✅ Download-Statistiken
- ✅ Einfache Integration mit CI/CD

### Schritt-für-Schritt Anleitung

#### 1. Binäre Dateien erstellen

```bash
# Alle Plattformen bauen
npm run build:server        # Server-Executables
npm run build:desktop:all   # Desktop-Apps (alle Plattformen)

# Oder einzeln:
npm run build:server:win
npm run build:server:mac
npm run build:server:linux
npm run build:desktop:win
npm run build:desktop:mac
npm run build:desktop:linux
```

#### 2. Checksums erstellen (Sicherheit)

```bash
# Im dist-server/ Verzeichnis
cd dist-server
shasum -a 256 * > SHA256SUMS.txt

# Im dist-desktop/ Verzeichnis
cd ../dist-desktop
shasum -a 256 * > SHA256SUMS.txt
```

**Für Windows (PowerShell):**
```powershell
Get-ChildItem dist-server | Get-FileHash -Algorithm SHA256 | Format-List > dist-server/SHA256SUMS.txt
Get-ChildItem dist-desktop | Get-FileHash -Algorithm SHA256 | Format-List > dist-desktop/SHA256SUMS.txt
```

#### 3. Release auf GitHub erstellen

**Option A: Über GitHub Web-Interface**

1. Gehe zu: `https://github.com/steinwedel/Camt-052/releases`
2. Klicke auf **"Draft a new release"**
3. Fülle die Felder aus:
   - **Tag version**: `v1.0.0` (folge Semantic Versioning)
   - **Release title**: `v1.0.0 - Erste stabile Version`
   - **Description**: Siehe Template unten
4. Lade die Dateien hoch:
   - Alle Dateien aus `dist-server/`
   - Alle Dateien aus `dist-desktop/`
   - Die `SHA256SUMS.txt` Dateien
5. Markiere als **"Latest release"**
6. Klicke auf **"Publish release"**

**Option B: Mit GitHub CLI**

```bash
# GitHub CLI installieren (falls nicht vorhanden)
# macOS: brew install gh
# Windows: winget install GitHub.cli
# Linux: siehe https://cli.github.com/

# Authentifizieren
gh auth login

# Release erstellen
gh release create v1.0.0 \
  --title "v1.0.0 - Erste stabile Version" \
  --notes-file RELEASE_NOTES.md \
  dist-server/* \
  dist-desktop/* \
  dist-server/SHA256SUMS.txt \
  dist-desktop/SHA256SUMS.txt
```

#### 4. Release Notes Template

Erstelle eine Datei `RELEASE_NOTES.md`:

```markdown
# CAMT.052 Viewer v1.0.0

## 🎉 Erste stabile Version

Dies ist die erste offizielle Version des CAMT.052 Viewers.

## ✨ Features

- ✅ CAMT.052 v8 XML-Dateien einlesen und anzeigen
- ✅ ZIP-Dateien Unterstützung
- ✅ Vollständige Transaktionsdetails
- ✅ Kontoinformationen und Salden
- ✅ Statistiken (Eingänge/Ausgänge)
- ✅ Moderne, responsive Benutzeroberfläche
- ✅ Multi-Sprachen Support (DE, EN, FR, ES, IT)
- ✅ Desktop-App (Electron) und Web-Server Modus

## 📦 Downloads

### Desktop-Anwendungen (Empfohlen)

**Windows:**
- `CAMT.052 Viewer-1.0.0.exe` (Portable, keine Installation nötig)

**macOS:**
- `CAMT.052 Viewer-1.0.0.dmg` (Universal Binary für Intel + Apple Silicon)

**Linux:**
- `CAMT.052 Viewer-1.0.0.AppImage` (Direkt ausführbar)

### Server-Executables (Standalone)

**Windows:**
- `camt52-viewer-windows.exe`

**macOS:**
- `camt52-viewer-macos`

**Linux:**
- `camt52-viewer-linux`

## 🔐 Checksums (SHA256)

Siehe `SHA256SUMS.txt` Dateien zur Verifizierung der Downloads.

## 📖 Installation & Verwendung

Siehe [README.md](https://github.com/steinwedel/Camt-052/blob/main/README.md) für detaillierte Anweisungen.

## 🐛 Bekannte Probleme

Keine bekannten kritischen Probleme.

## 🙏 Danksagungen

Danke an alle Tester und frühen Nutzer!

---

**Vollständiges Changelog**: https://github.com/steinwedel/Camt-052/commits/v1.0.0
```

---

## 🤖 Methode 2: Automatisierte CI/CD mit GitHub Actions

### Vorteile
- ✅ Automatische Builds bei jedem Release
- ✅ Konsistente Build-Umgebung
- ✅ Zeitersparnis
- ✅ Weniger Fehleranfälligkeit

### GitHub Actions Workflow erstellen

Erstelle `.github/workflows/release.yml`:

```yaml
name: Build and Release

on:
  push:
    tags:
      - 'v*'  # Triggert bei Tags wie v1.0.0

jobs:
  build-server:
    name: Build Server Executables
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build server executables
        run: npm run build:server
      
      - name: Generate checksums
        run: |
          cd dist-server
          shasum -a 256 * > SHA256SUMS.txt
      
      - name: Upload artifacts
        uses: actions/upload-artifact@v4
        with:
          name: server-executables
          path: dist-server/*

  build-desktop-windows:
    name: Build Desktop App (Windows)
    runs-on: windows-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build Windows app
        run: npm run build:desktop:win
      
      - name: Upload artifacts
        uses: actions/upload-artifact@v4
        with:
          name: desktop-windows
          path: dist-desktop/*.exe

  build-desktop-macos:
    name: Build Desktop App (macOS)
    runs-on: macos-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build macOS app
        run: npm run build:desktop:mac
      
      - name: Upload artifacts
        uses: actions/upload-artifact@v4
        with:
          name: desktop-macos
          path: dist-desktop/*.dmg

  build-desktop-linux:
    name: Build Desktop App (Linux)
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build Linux app
        run: npm run build:desktop:linux
      
      - name: Upload artifacts
        uses: actions/upload-artifact@v4
        with:
          name: desktop-linux
          path: dist-desktop/*.AppImage

  create-release:
    name: Create GitHub Release
    needs: [build-server, build-desktop-windows, build-desktop-macos, build-desktop-linux]
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Download all artifacts
        uses: actions/download-artifact@v4
        with:
          path: artifacts
      
      - name: Create Release
        uses: softprops/action-gh-release@v1
        with:
          files: |
            artifacts/server-executables/*
            artifacts/desktop-windows/*
            artifacts/desktop-macos/*
            artifacts/desktop-linux/*
          body_path: RELEASE_NOTES.md
          draft: false
          prerelease: false
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Workflow verwenden

```bash
# 1. Workflow-Datei committen
git add .github/workflows/release.yml
git commit -m "ci: add automated release workflow"
git push

# 2. Tag erstellen und pushen
git tag v1.0.0
git push origin v1.0.0

# 3. GitHub Actions baut automatisch und erstellt Release
# Überwache den Fortschritt unter: Actions Tab auf GitHub
```

---

## 🌐 Methode 3: Alternative Distributionskanäle

### 3.1 Homebrew (macOS)

Erstelle ein Homebrew Tap für einfache Installation:

```bash
# Erstelle ein neues Repository: homebrew-camt52
# Erstelle Datei: Formula/camt52-viewer.rb

class Camt52Viewer < Formula
  desc "CAMT.052 v8 XML transaction viewer"
  homepage "https://github.com/steinwedel/Camt-052"
  url "https://github.com/steinwedel/Camt-052/releases/download/v1.0.0/camt52-viewer-macos"
  sha256 "CHECKSUM_HIER_EINFÜGEN"
  version "1.0.0"

  def install
    bin.install "camt52-viewer-macos" => "camt52-viewer"
  end

  test do
    system "#{bin}/camt52-viewer", "--version"
  end
end
```

**Installation für Nutzer:**
```bash
brew tap steinwedel/camt52
brew install camt52-viewer
```

### 3.2 Chocolatey (Windows)

Erstelle ein Chocolatey Package:

```powershell
# camt52-viewer.nuspec
<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://schemas.microsoft.com/packaging/2015/06/nuspec.xsd">
  <metadata>
    <id>camt52-viewer</id>
    <version>1.0.0</version>
    <title>CAMT.052 Viewer</title>
    <authors>Gerhard Steinwedel</authors>
    <projectUrl>https://github.com/steinwedel/Camt-052</projectUrl>
    <licenseUrl>https://github.com/steinwedel/Camt-052/blob/main/LICENSE</licenseUrl>
    <requireLicenseAcceptance>false</requireLicenseAcceptance>
    <description>CAMT.052 v8 XML transaction viewer</description>
    <tags>camt052 banking xml finance</tags>
  </metadata>
</package>
```

**Installation für Nutzer:**
```powershell
choco install camt52-viewer
```

### 3.3 Snap Store (Linux)

Erstelle `snap/snapcraft.yaml`:

```yaml
name: camt52-viewer
version: '1.0.0'
summary: CAMT.052 v8 XML transaction viewer
description: |
  View and analyze CAMT.052 banking transaction files

grade: stable
confinement: strict

apps:
  camt52-viewer:
    command: camt52-viewer-linux
    plugs: [network, network-bind]

parts:
  camt52-viewer:
    plugin: dump
    source: https://github.com/steinwedel/Camt-052/releases/download/v1.0.0/camt52-viewer-linux
```

**Installation für Nutzer:**
```bash
sudo snap install camt52-viewer
```

### 3.4 npm Registry

Veröffentliche auch als npm-Paket:

```bash
# package.json bereits vorhanden
npm publish
```

**Installation für Nutzer:**
```bash
npm install -g camt52-viewer
camt52-viewer  # Startet den Server
```

### 3.5 Docker Hub

Erstelle `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3001

CMD ["node", "server.js"]
```

**Veröffentlichen:**
```bash
docker build -t steinwedel/camt52-viewer:1.0.0 .
docker push steinwedel/camt52-viewer:1.0.0
docker tag steinwedel/camt52-viewer:1.0.0 steinwedel/camt52-viewer:latest
docker push steinwedel/camt52-viewer:latest
```

**Installation für Nutzer:**
```bash
docker run -p 3001:3001 steinwedel/camt52-viewer:latest
```

---

## 📊 Best Practices

### 1. Semantic Versioning

Folge [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.0.0): Breaking Changes
- **MINOR** (1.1.0): Neue Features (rückwärtskompatibel)
- **PATCH** (1.0.1): Bug-Fixes

```bash
# Beispiele
v1.0.0  # Erste stabile Version
v1.1.0  # Neue Features hinzugefügt
v1.1.1  # Bug-Fix
v2.0.0  # Breaking Changes
```

### 2. Dateinamen-Konventionen

```
# Server-Executables
camt52-viewer-{platform}-v{version}.{ext}
camt52-viewer-windows-v1.0.0.exe
camt52-viewer-macos-v1.0.0
camt52-viewer-linux-v1.0.0

# Desktop-Apps
CAMT.052-Viewer-{version}-{platform}.{ext}
CAMT.052-Viewer-1.0.0-win.exe
CAMT.052-Viewer-1.0.0-mac.dmg
CAMT.052-Viewer-1.0.0-linux.AppImage
```

### 3. Release-Zyklus

```
Entwicklung → Testing → Pre-Release → Stable Release
    ↓            ↓           ↓              ↓
  main       develop    v1.0.0-rc.1    v1.0.0
```

**Pre-Release Tags:**
```bash
v1.0.0-alpha.1  # Frühe Entwicklung
v1.0.0-beta.1   # Feature-komplett, Testing
v1.0.0-rc.1     # Release Candidate
v1.0.0          # Stable Release
```

### 4. Changelog pflegen

Nutze [Keep a Changelog](https://keepachangelog.com/) Format:

```markdown
# Changelog

## [1.0.0] - 2025-01-15

### Added
- CAMT.052 v8 XML-Parser
- Desktop-App mit Electron
- Multi-Sprachen Support

### Changed
- Verbesserte UI

### Fixed
- Bug bei großen Dateien

### Security
- Input-Validierung verbessert
```

### 5. Sicherheit

```bash
# GPG-Signatur für Releases
gpg --armor --detach-sign camt52-viewer-windows.exe

# Checksums verifizieren
shasum -a 256 -c SHA256SUMS.txt

# Code-Signing (macOS)
codesign --sign "Developer ID" CAMT.052\ Viewer.app

# Code-Signing (Windows)
signtool sign /f certificate.pfx /p password CAMT.052-Viewer.exe
```

---

## 📈 Download-Statistiken tracken

### GitHub API nutzen

```bash
# Download-Zahlen abrufen
curl -s https://api.github.com/repos/steinwedel/Camt-052/releases/latest \
  | jq '.assets[] | {name: .name, downloads: .download_count}'
```

### Badge im README

```markdown
![Downloads](https://img.shields.io/github/downloads/steinwedel/Camt-052/total)
![Latest Release](https://img.shields.io/github/v/release/steinwedel/Camt-052)
```

---

## 🔄 Update-Mechanismus

### Auto-Update für Electron-App

Nutze `electron-updater`:

```javascript
// electron.js
const { autoUpdater } = require('electron-updater');

autoUpdater.checkForUpdatesAndNotify();

autoUpdater.on('update-available', () => {
  dialog.showMessageBox({
    type: 'info',
    title: 'Update verfügbar',
    message: 'Eine neue Version ist verfügbar. Download startet...'
  });
});
```

### Update-Server konfigurieren

```json
// package.json
{
  "build": {
    "publish": {
      "provider": "github",
      "owner": "steinwedel",
      "repo": "Camt-052"
    }
  }
}
```

---

## ✅ Checkliste für Release

- [ ] Code-Review abgeschlossen
- [ ] Alle Tests bestehen
- [ ] CHANGELOG.md aktualisiert
- [ ] Version in package.json erhöht
- [ ] README.md aktualisiert
- [ ] Binäre Dateien gebaut (alle Plattformen)
- [ ] Checksums erstellt
- [ ] Release Notes geschrieben
- [ ] GitHub Release erstellt
- [ ] Binäre Dateien hochgeladen
- [ ] Release veröffentlicht
- [ ] Social Media Ankündigung (optional)
- [ ] Dokumentation aktualisiert

---

## 🎯 Empfohlene Strategie für CAMT.052 Viewer

**Phase 1: Initiales Release (v1.0.0)**
1. ✅ GitHub Releases (primär)
2. ✅ Automatisierte CI/CD mit GitHub Actions
3. ✅ npm Registry

**Phase 2: Wachstum (v1.x)**
1. ✅ Homebrew Tap (macOS)
2. ✅ Chocolatey (Windows)
3. ✅ Snap Store (Linux)

**Phase 3: Enterprise (v2.x)**
1. ✅ Docker Hub
2. ✅ Private Package Registry
3. ✅ Auto-Update Mechanismus

---

**Letzte Aktualisierung**: Januar 2025  
**Version**: 1.0