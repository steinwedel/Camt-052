# Icon-Dateien für CAMT.052 Viewer

Dieses Verzeichnis enthält die Icon-Dateien für die Desktop-Anwendung.

## Benötigte Icon-Dateien:

- **icon.icns** - macOS Icon (512x512 oder 1024x1024)
- **icon.ico** - Windows Icon (256x256)
- **icon.png** - Linux Icon (512x512)

## Icon-Thema: Bankkonto

Das Icon sollte eine Assoziation mit einem Bankkonto herstellen. Mögliche Motive:

- 🏦 Bankgebäude mit Säulen
- 💳 Kreditkarte oder EC-Karte
- 💰 Geldsack oder Münzen
- 📊 Kontoauszug oder Diagramm
- € Euro-Symbol mit Bank-Elementen

## Empfohlene Farben:

- **Primär**: Blau (#2563eb) - Vertrauen, Professionalität
- **Akzent**: Gold/Gelb (#fbbf24) - Wohlstand, Wert
- **Hintergrund**: Weiß oder Hellgrau

## Icons automatisch generieren:

### Option 1: Online Icon Generator
1. Besuchen Sie: https://www.electron.build/icons
2. Laden Sie ein 1024x1024 PNG hoch
3. Generieren Sie alle benötigten Formate

### Option 2: electron-icon-builder verwenden

```bash
# Installieren
npm install --save-dev electron-icon-builder

# Icon erstellen (benötigt eine icon.png im Projektroot)
npx electron-icon-builder --input=./icon-source.png --output=./build
```

### Option 3: Manuell erstellen

1. Erstellen Sie ein 1024x1024 PNG mit Ihrem Icon-Design
2. Konvertieren Sie es:
   - **macOS**: `png2icns icon.icns icon.png`
   - **Windows**: Verwenden Sie ein Online-Tool oder ImageMagick
   - **Linux**: Kopieren Sie einfach die PNG-Datei

## Temporäre Lösung:

Wenn keine Icons vorhanden sind, verwendet electron-builder Standard-Icons.
Die Anwendung funktioniert auch ohne benutzerdefinierte Icons.

## Aktuelles Icon-Design (Vorschlag):

Ein blaues rundes Icon mit:
- Weißem Bankgebäude (Säulen)
- Goldenem Euro-Symbol (€) in der Mitte
- Kleinem Dokument-Symbol in der Ecke (für Kontoauszug)

Dies vermittelt: Bank + Euro + Dokument = Kontoauszug-Viewer