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
- `CAMT.052 Viewer 1.0.0.exe` (Portable, keine Installation nötig)

**macOS:**
- `CAMT.052 Viewer-1.0.0-universal.dmg` (Universal Binary für Intel + Apple Silicon)

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

Siehe Checksum-Dateien zur Verifizierung der Downloads:
- `SHA256SUMS-server.txt` - Checksums für Server-Executables
- `SHA256SUMS-desktop.txt` - Checksums für Desktop-Anwendungen

## 📖 Installation & Verwendung

### Desktop-Anwendungen

**Windows:**
1. `CAMT.052 Viewer 1.0.0.exe` herunterladen
2. Datei ausführen (keine Installation erforderlich)
3. CAMT.052 XML-Datei oder ZIP-Archiv öffnen

**macOS:**
1. `CAMT.052 Viewer-1.0.0-universal.dmg` herunterladen
2. DMG-Datei öffnen und App in den Programme-Ordner ziehen
3. App starten und CAMT.052 XML-Datei oder ZIP-Archiv öffnen

**Linux:**
1. `CAMT.052 Viewer-1.0.0.AppImage` herunterladen
2. Datei ausführbar machen: `chmod +x "CAMT.052 Viewer-1.0.0.AppImage"`
3. Datei ausführen: `./CAMT.052\ Viewer-1.0.0.AppImage`

### Server-Executables

**Windows:**
```cmd
camt52-viewer-windows.exe
```
Dann Browser öffnen: http://localhost:3001

**macOS/Linux:**
```bash
chmod +x camt52-viewer-macos  # oder camt52-viewer-linux
./camt52-viewer-macos         # oder ./camt52-viewer-linux
```
Dann Browser öffnen: http://localhost:3001

Siehe [README.md](https://github.com/steinwedel/Camt-052/blob/main/README.md) für detaillierte Anweisungen.

## 🐛 Bekannte Probleme

Keine bekannten kritischen Probleme.

## 🙏 Danksagungen

Danke an alle Tester und frühen Nutzer!

---

**Vollständiges Changelog**: https://github.com/steinwedel/Camt-052/commits/v1.0.0