<p align="center">
  <img src="public/icon.png" alt="CAMT.052 Viewer Logo" width="200">
</p>

# CAMT.052 Kontoauszug Viewer

Eine Node.js-Anwendung (Web und Desktop) zum Auslesen und Anzeigen von Buchungen aus CAMT.052 v8 XML-Dateien. Dabei werden alle Daten ausschließlich lokal auf Ihrem Computer (Desktop-Anwendung) oder dem Server (Serveranwendung) verarbeitet. Eine Übertragung an externe Server oder Dritte findet nicht statt.


## 📋 Funktionen

- **XML-Datei Upload**: Einfaches Hochladen von CAMT.052 v8 XML-Dateien
- **Vollständige Transaktionsanzeige**: Zeigt alle wichtigen Informationen an:
  - Absender (Name und IBAN)
  - Empfänger (Name und IBAN)
  - Betrag (formatiert in EUR)
  - Buchungsdatum
  - Valutadatum
  - Verwendungszweck
  - Transaktionstyp (Eingang/Ausgang)
- **Kontoinformationen**: Anzeige von IBAN, Kontoinhaber und Währung
- **Saldoanzeige**: Übersicht über Eröffnungs- und Schlusssaldo
- **Statistiken**: Anzahl der Buchungen, Eingänge und Ausgänge
- **Moderne Benutzeroberfläche**: Responsive Design mit professionellem Look

## 📥 Binäre Dateien herunterladen (Empfohlen)

**Keine Installation erforderlich!** Laden Sie die vorkompilierten ausführbaren Dateien direkt herunter:

### Desktop-Anwendungen (Direkt ausführbar)

**Windows:**
- [camt.052-desktop-viewer-windows.exe](https://github.com/steinwedel/Camt-052/releases/latest/download/camt.052-desktop-viewer-windows.exe) (Portable, ~100-150 MB)
  - Einfach herunterladen und per Doppelklick starten - keine Installation nötig!

**macOS:**
- [camt.052-desktop-viewer-macOS-universal.dmg](https://github.com/steinwedel/Camt-052/releases/latest/download/camt.052-desktop-viewer-macOS-universal.dmg) (Universal Binary, ~200-250 MB)
  - Funktioniert auf Intel und Apple Silicon Macs
  - DMG öffnen, App in Programme-Ordner ziehen und starten

> **⚠️ macOS Sicherheitshinweis**
> 
> Beim Ausführen wird folgende Fehlermeldung angezeigt:
> 
> *"Apple konnte nicht überprüfen, ob „CAMT.052 Viewer" frei von Schadsoftware ist, die deinen Mac beschädigen oder deine Privatsphäre verletzen kann."*
> 
> **Lösung:** Das Problem kann wie folgt behoben werden:  
> 👉 [Apple Support: App aus unbekannter Quelle öffnen](https://support.apple.com/de-de/guide/mac-help/mchleab3a043/mac)

**Linux:**
- [camt.052-desktop-viewer-linux-x64.AppImage](https://github.com/steinwedel/Camt-052/releases/latest/download/camt.052-desktop-viewer-linux-x64.AppImage) (Intel/AMD 64-bit, ~150-200 MB)
  - Ausführbar machen: `chmod +x camt.052-desktop-viewer-linux-x64.AppImage`
  - Starten: `./camt.052-desktop-viewer-linux-x64.AppImage`

- [camt.052-desktop-viewer-linux-arm64.AppImage](https://github.com/steinwedel/Camt-052/releases/latest/download/camt.052-desktop-viewer-linux-arm64.AppImage) (ARM 64-bit, ~150-200 MB)
  - Ausführbar machen: `chmod +x camt.052-desktop-viewer-linux-arm64.AppImage`
  - Starten: `./camt.052-desktop-viewer-linux-arm64.AppImage`

### Server-Executables (Standalone)

**Windows:**
- [camt.052-web-viewer-windows.exe](https://github.com/steinwedel/Camt-052/releases/latest/download/camt.052-web-viewer-windows.exe) (~38 MB)

**macOS:**
- [camt.052-web-viewer-macOS-universal](https://github.com/steinwedel/Camt-052/releases/latest/download/camt.052-web-viewer-macOS-universal) (~51 MB)
  - Ausführbar machen: `chmod +x camt.052-web-viewer-macOS-universal`

**Linux:**
- [camt.052-web-viewer-linux-x64](https://github.com/steinwedel/Camt-052/releases/latest/download/camt.052-web-viewer-linux-x64) (Intel/AMD 64-bit, ~46 MB)
  - Ausführbar machen: `chmod +x camt.052-web-viewer-linux-x64`

- [camt.052-web-viewer-linux-arm64](https://github.com/steinwedel/Camt-052/releases/latest/download/camt.052-web-viewer-linux-arm64) (ARM 64-bit, ~46 MB)
  - Ausführbar machen: `chmod +x camt.052-web-viewer-linux-arm64`

### Checksums (SHA256)

Zur Verifizierung der Downloads:
- [SHA256SUMS-server.txt](https://github.com/steinwedel/Camt-052/releases/latest/download/SHA256SUMS-server.txt)
- [SHA256SUMS-desktop.txt](https://github.com/steinwedel/Camt-052/releases/latest/download/SHA256SUMS-desktop.txt)

**Alle Releases anzeigen:** [GitHub Releases](https://github.com/steinwedel/Camt-052/releases)

---

## 🚀 Installation (Für Entwickler)

1. **Repository klonen oder Dateien herunterladen**

2. **Abhängigkeiten installieren**:
```bash
npm install
```

Die folgenden Pakete werden installiert:
- `express` - Web-Server Framework
- `fast-xml-parser` - XML-Parser für CAMT.052 Dateien
- `multer` - Datei-Upload Middleware

## 📦 Standalone Executables erstellen

Sie können eigenständige ausführbare Dateien für Windows, macOS und Linux erstellen, die keine Node.js-Installation benötigen.

### Voraussetzungen

- Node.js und npm müssen installiert sein (nur für den Build-Prozess)
- Mindestens 500 MB freier Speicherplatz

### Build-Methoden

#### Methode 1: Build-Script verwenden (Empfohlen)

Das `build.js` Script bietet eine benutzerfreundliche Oberfläche für **beide Build-Typen**:

**Server-Executables (Standalone):**
```bash
# Alle Plattformen erstellen
node build.js server

# Nur Windows
node build.js server:windows

# Nur macOS
node build.js server:macos

# Nur Linux (erstellt beide Architekturen: x64 und ARM64)
node build.js server:linux
```

**Desktop-Apps (Electron - Direkt ausführbare Dateien):**
```bash
# Desktop-App für aktuelle Plattform
node build.js desktop

# Desktop-Apps für alle Plattformen (empfohlen)
node build.js desktop:all

# Nur Windows
node build.js desktop:windows

# Nur macOS
node build.js desktop:macos

# Nur Linux (erstellt beide Architekturen: x64 und ARM64)
node build.js desktop:linux
```

Die Desktop-Builds erstellen **direkt ausführbare Dateien** ohne Installation:
- **macOS**: DMG Installer (Universal Binary für Intel + Apple Silicon)
- **Windows**: Portable .exe (keine Installation nötig)
- **Linux**: AppImage (direkt ausführbar, x64 und ARM64)

Das Script:
- ✅ Prüft automatisch ob `pkg` installiert ist
- ✅ Installiert `pkg` falls nötig
- ✅ Erstellt die `dist-server` und `dist-desktop` Verzeichnisse
- ✅ Komprimiert die Server-Executables mit GZip
- ✅ Unterstützt Electron-Builder für Desktop-Apps
- ✅ Zeigt detaillierte Fortschrittsinformationen
- ✅ Gibt eine Zusammenfassung mit Dateigrößen aus

#### Methode 2: NPM Scripts verwenden

```bash
# Server-Executables
npm run build:server           # Alle Plattformen
npm run build:server:win       # Windows
npm run build:server:mac       # macOS
npm run build:server:linux     # Linux (x64 und ARM64)

# Desktop-Apps
npm run build:desktop          # Aktuelle Plattform
npm run build:desktop:all      # Alle Plattformen
npm run build:desktop:win      # Windows
npm run build:desktop:mac      # macOS
npm run build:desktop:linux    # Linux (x64 und ARM64)
```

### Erstellte Dateien

**Server-Executables** (im `dist-server/` Verzeichnis):

```
dist-server/
├── camt.052-web-viewer-windows.exe          # Windows (ca. 50-70 MB)
├── camt.052-web-viewer-macOS-universal      # macOS Universal (ca. 50-70 MB)
├── camt.052-web-viewer-linux-x64            # Linux Intel/AMD (ca. 50-70 MB)
└── camt.052-web-viewer-linux-arm64          # Linux ARM (ca. 50-70 MB)
```

**Desktop-Apps** (im `dist-desktop/` Verzeichnis):

```
dist-desktop/
├── camt.052-desktop-viewer-windows.exe              # Windows Portable (ca. 100-150 MB)
├── camt.052-desktop-viewer-macOS-universal.dmg      # macOS DMG Installer (ca. 200-250 MB)
├── camt.052-desktop-viewer-linux-x64.AppImage       # Linux Intel/AMD (ca. 150-200 MB)
└── camt.052-desktop-viewer-linux-arm64.AppImage     # Linux ARM (ca. 150-200 MB)
```

**Hinweis**: 
- Die Desktop-Apps sind größer als Server-Executables, da sie eine vollständige Chromium-Engine enthalten
- Die macOS DMG ist eine Universal Binary (Intel + Apple Silicon)
- Linux-Builds sind für beide Architekturen verfügbar (x64 und ARM64)

### Executables ausführen

#### Server-Executables

**Windows:**
```bash
# Doppelklick auf die .exe Datei oder im Terminal:
camt.052-web-viewer-windows.exe
```

**macOS:**
```bash
# Ausführbar machen (einmalig):
chmod +x camt.052-web-viewer-macOS-universal

# Starten:
./camt.052-web-viewer-macOS-universal
```

**Linux:**
```bash
# Intel/AMD 64-bit:
chmod +x camt.052-web-viewer-linux-x64
./camt.052-web-viewer-linux-x64

# ARM 64-bit:
chmod +x camt.052-web-viewer-linux-arm64
./camt.052-web-viewer-linux-arm64
```

#### Desktop-Apps (Direkt ausführbar)

**Windows:**
```bash
# Einfach die portable .exe Datei starten:
camt.052-desktop-viewer-windows.exe
# Oder per Doppelklick - keine Installation erforderlich!
```

**macOS:**
```bash
# DMG öffnen und App in Applications-Ordner ziehen:
open camt.052-desktop-viewer-macOS-universal.dmg
# Dann .app aus Applications-Ordner starten
# Oder per Doppelklick auf die DMG-Datei

# Die App ist eine Universal Binary und läuft automatisch nativ
# auf Intel und Apple Silicon Macs
```

**Linux:**
```bash
# Intel/AMD 64-bit:
chmod +x camt.052-desktop-viewer-linux-x64.AppImage
./camt.052-desktop-viewer-linux-x64.AppImage

# ARM 64-bit:
chmod +x camt.052-desktop-viewer-linux-arm64.AppImage
./camt.052-desktop-viewer-linux-arm64.AppImage

# Oder per Doppelklick
```

### Was ist enthalten?

Die Executables enthalten:
- ✅ Node.js Runtime
- ✅ Alle npm-Abhängigkeiten (express, fast-xml-parser, multer, adm-zip)
- ✅ Server-Code (server.js)
- ✅ Web-Interface (public/index.html)
- ✅ Alle benötigten Assets

**Keine Installation erforderlich!** Die Dateien können direkt ausgeführt werden.

### Optimierung

Die Executables sind mit GZip komprimiert, um die Dateigröße zu minimieren:
- **Ohne Kompression**: ~80-100 MB
- **Mit GZip**: ~50-70 MB (ca. 30-40% kleiner)

### Verteilung

Die erstellten Executables können einfach verteilt werden:
1. Kopieren Sie die entsprechende Datei auf den Zielrechner
2. Keine Installation oder Abhängigkeiten erforderlich
3. Einfach ausführen und im Browser öffnen (http://localhost:3001)

### Technische Details

- **pkg Version**: 5.8.1
- **Node.js Version**: 18 (eingebettet)
- **Kompression**: GZip
- **Plattformen**: 
  - Windows: x64
  - macOS: x64 (Universal Binary)
  - Linux: x64 und ARM64

### Fehlerbehebung

**Problem**: "pkg: command not found"
```bash
npm install --save-dev pkg@5.8.1
```

**Problem**: Executable startet nicht auf macOS
```bash
# Sicherheitseinstellungen umgehen:
xattr -d com.apple.quarantine camt.052-web-viewer-macOS-universal
chmod +x camt.052-web-viewer-macOS-universal
```

**Problem**: Executable startet nicht auf Linux
```bash
# Ausführungsrechte setzen:
chmod +x camt.052-web-viewer-linux-x64
# oder für ARM:
chmod +x camt.052-web-viewer-linux-arm64
```

## 💻 Verwendung

Die Anwendung kann auf **zwei Arten** verwendet werden:

### Modus 1: Desktop-Anwendung (Electron) 🖥️

**Empfohlen für die tägliche Nutzung**

```bash
npm run electron
```

Dies öffnet die Anwendung in einem nativen Desktop-Fenster mit eingebettetem Browser. Vorteile:
- ✅ Eigenständiges Fenster (kein Browser erforderlich)
- ✅ Native Desktop-Integration
- ✅ Automatischer Start des Servers im Hintergrund
- ✅ Einfaches Schließen über das Fenster

**Entwicklungsmodus mit DevTools:**
```bash
npm run electron:dev
```

### Modus 2: Web-Browser 🌐

**Für Entwicklung oder wenn kein Electron installiert ist**

```bash
npm start
```

Der Server läuft standardmäßig auf **http://localhost:3001**

**Port-Konfiguration:**

Sie können einen benutzerdefinierten Port über die Kommandozeile angeben:

```bash
# Direktes Format (Port als Argument)
node server.js 8080

# Flag-Format (mit --port)
node server.js --port 8080
```

Wenn kein Port angegeben wird, verwendet der Server automatisch Port 3001.

Öffnen Sie dann Ihren Browser und navigieren Sie zu `http://localhost:3001` (oder dem von Ihnen gewählten Port)

### Anwendung verwenden

**Datei-Upload (2 Methoden):**

1. **Methode 1 - Datei auswählen:**
   - Klicken Sie auf "📁 Datei auswählen"
   - Wählen Sie eine CAMT.052/053 XML- oder ZIP-Datei aus
   - Die Datei wird automatisch hochgeladen und analysiert

2. **Methode 2 - Drag & Drop:**
   - Ziehen Sie eine XML- oder ZIP-Datei auf den Upload-Bereich
   - Die Datei wird automatisch hochgeladen und analysiert

Die Buchungen werden sofort geparst und angezeigt - kein zusätzlicher Button-Klick erforderlich!

### Beispieldatei testen

Eine Beispiel-CAMT.052-Datei ist im Projekt enthalten:
- **Datei**: `sample-camt052.xml`
- **Inhalt**: Enthält 6 Beispielbuchungen mit verschiedenen Transaktionstypen
- **Konto**: Max Mustermann (DE89370400440532013000)

## 📁 Projektstruktur

```
camt52/
├── electron.js            # Electron Hauptprozess (Desktop-Modus)
├── server.js              # Express-Server mit XML-Parsing-Logik
├── package.json           # Projekt-Konfiguration und Abhängigkeiten
├── public/
│   └── index.html        # Web-Interface (Frontend)
├── testdaten/            # Beispiel-XML-Dateien zum Testen
├── uploads/              # Temporärer Ordner für hochgeladene Dateien
└── README.md             # Diese Datei
```

## 🔍 Angezeigte Informationen

Die Anwendung zeigt folgende Informationen an:

### Kontoinformationen
- IBAN
- Kontoinhaber
- Währung

### Kontostände
- Eröffnungssaldo (OPBD)
- Schlusssaldo (CLBD)
- Weitere Salden falls vorhanden

### Buchungen (Transaktionen)
Jede Buchung zeigt:
- **Typ**: Eingang (grün) oder Ausgang (rot)
- **Buchungsdatum**: Datum der Buchung
- **Valutadatum**: Wertstellungsdatum
- **Absender**: Name und IBAN des Absenders
- **Empfänger**: Name und IBAN des Empfängers
- **Betrag**: Formatiert in der jeweiligen Währung
- **Verwendungszweck**: Beschreibung der Transaktion

### Statistiken
- Gesamtanzahl der Buchungen
- Anzahl der Eingänge
- Anzahl der Ausgänge

## 🛠️ Technische Details

### CAMT.052 Format
Die Anwendung unterstützt das CAMT.052 v8 Format (ISO 20022 Standard) für Kontoauszüge.

### Parsing-Logik
- Automatische Erkennung von Einzel- und Mehrfachberichten
- Unterstützung für verschiedene Saldo-Typen
- Flexible Extraktion von Absender/Empfänger-Informationen
- Robuste Fehlerbehandlung

### Sicherheit
- **Datenschutz**: Alle Daten werden ausschließlich lokal auf Ihrem Computer verarbeitet - keine Übertragung an externe Server oder Dritte
- Hochgeladene Dateien werden nach dem Parsen automatisch gelöscht
- Nur XML-Dateien werden akzeptiert
- Fehlerhafte Dateien werden mit aussagekräftigen Fehlermeldungen abgelehnt

## 📝 Beispiel-Transaktionen

Die `sample-camt052.xml` enthält folgende Beispiel-Transaktionen:

1. **Gehaltszahlung** - 1.500,00 € (Eingang)
2. **Mietzahlung** - 850,00 € (Ausgang)
3. **Stromrechnung** - 125,50 € (Ausgang)
4. **Beratungsleistung** - 2.500,00 € (Eingang)
5. **Krankenversicherung** - 450,00 € (Ausgang)
6. **Mobilfunkrechnung** - 75,00 € (Ausgang)

## 🎨 Features

- ✅ Responsive Design
- ✅ Deutsche Lokalisierung
- ✅ Farbcodierte Transaktionstypen
- ✅ Übersichtliche Tabellenansicht
- ✅ Moderne Benutzeroberfläche
- ✅ Echtzeit-Dateiverarbeitung
- ✅ Detaillierte Fehlerbehandlung

## 📄 Lizenz

MIT

## 👨‍💻 Entwicklung

Entwickelt mit:
- Node.js
- Express.js
- fast-xml-parser
- Vanilla JavaScript (Frontend)
- HTML5 & CSS3

---

**Hinweis**: Diese Anwendung dient zu Demonstrationszwecken. Für den produktiven Einsatz sollten zusätzliche Sicherheitsmaßnahmen implementiert werden.