# CAMT.052 Kontoauszug Viewer

Eine Node.js-Webanwendung zum Auslesen und Anzeigen von Buchungen aus CAMT.052 v8 XML-Dateien.

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

## 🚀 Installation

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

Das `build.js` Script bietet eine benutzerfreundliche Oberfläche:

```bash
# Alle Plattformen erstellen
node build.js

# Nur Windows
node build.js windows

# Nur macOS
node build.js macos

# Nur Linux
node build.js linux
```

Das Script:
- ✅ Prüft automatisch ob `pkg` installiert ist
- ✅ Installiert `pkg` falls nötig
- ✅ Erstellt das `dist` Verzeichnis
- ✅ Komprimiert die Executables mit GZip
- ✅ Zeigt detaillierte Fortschrittsinformationen
- ✅ Gibt eine Zusammenfassung mit Dateigrößen aus

#### Methode 2: NPM Scripts verwenden

```bash
# Alle Plattformen
npm run build

# Einzelne Plattformen
npm run build:win      # Windows
npm run build:mac      # macOS
npm run build:linux    # Linux
```

### Erstellte Dateien

Nach dem Build-Prozess finden Sie im `dist/` Verzeichnis:

```
dist/
├── camt52-viewer-windows.exe    # Windows (ca. 50-70 MB)
├── camt52-viewer-macos          # macOS (ca. 50-70 MB)
└── camt52-viewer-linux          # Linux (ca. 50-70 MB)
```

### Executables ausführen

#### Windows
```bash
# Doppelklick auf die .exe Datei oder im Terminal:
camt52-viewer-windows.exe
```

#### macOS
```bash
# Ausführbar machen (einmalig):
chmod +x camt52-viewer-macos

# Starten:
./camt52-viewer-macos
```

#### Linux
```bash
# Ausführbar machen (einmalig):
chmod +x camt52-viewer-linux

# Starten:
./camt52-viewer-linux
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
  - macOS: x64
  - Linux: x64

### Fehlerbehebung

**Problem**: "pkg: command not found"
```bash
npm install --save-dev pkg@5.8.1
```

**Problem**: Executable startet nicht auf macOS
```bash
# Sicherheitseinstellungen umgehen:
xattr -d com.apple.quarantine camt52-viewer-macos
chmod +x camt52-viewer-macos
```

**Problem**: Executable startet nicht auf Linux
```bash
# Ausführungsrechte setzen:
chmod +x camt52-viewer-linux
```

## 💻 Verwendung

### Server starten (Entwicklung)

```bash
npm start
```

Der Server läuft standardmäßig auf **http://localhost:3001**

### Anwendung verwenden

1. Öffnen Sie Ihren Browser und navigieren Sie zu `http://localhost:3001`
2. Klicken Sie auf "📁 Datei auswählen"
3. Wählen Sie eine CAMT.052 v8 XML-Datei aus
4. Klicken Sie auf "🚀 Hochladen & Analysieren"
5. Die Buchungen werden automatisch geparst und angezeigt

### Beispieldatei testen

Eine Beispiel-CAMT.052-Datei ist im Projekt enthalten:
- **Datei**: `sample-camt052.xml`
- **Inhalt**: Enthält 6 Beispielbuchungen mit verschiedenen Transaktionstypen
- **Konto**: Max Mustermann (DE89370400440532013000)

## 📁 Projektstruktur

```
camt52/
├── server.js              # Express-Server mit XML-Parsing-Logik
├── package.json           # Projekt-Konfiguration und Abhängigkeiten
├── public/
│   └── index.html        # Web-Interface (Frontend)
├── sample-camt052.xml    # Beispiel-XML-Datei zum Testen
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