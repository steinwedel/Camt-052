# TODO: Vorbereitung für GitHub-Veröffentlichung

## 🔴 Kritisch (Muss gemacht werden)

### 1. .gitignore Datei erstellen
- [ ] .gitignore Datei im Root-Verzeichnis erstellen
- [ ] Folgende Einträge hinzufügen:
  ```
  # Dependencies
  node_modules/
  
  # Build outputs
  dist-desktop/
  dist-server/
  
  # Temporary files
  uploads/
  *.log
  
  # OS files
  .DS_Store
  Thumbs.db
  
  # Screenshots/Test files
  *.jpeg
  *.jpg
  *.png
  !public/icon.png
  !build/**/*.png
  
  # IDE
  .vscode/
  .idea/
  *.swp
  *.swo
  ```

### 2. LICENSE Datei hinzufügen
- [ ] MIT LICENSE Datei erstellen
- [ ] Copyright-Jahr und Namen eintragen

### 3. Unerwünschte Dateien entfernen
- [ ] `.DS_Store` löschen
- [ ] Screenshot-Dateien löschen:
  - [ ] `http___localhost_3001-1761651270628.jpeg`
  - [ ] `http___localhost_3001_lang_en-1761651289346.jpeg`
  - [ ] `http___localhost_3001_lang_es-1761651344944.jpeg`
  - [ ] `http___localhost_3001_lang_fr-1761651307150.jpeg`
  - [ ] `http___localhost_3001_lang_it-1761651360840.jpeg`
- [ ] Sicherstellen, dass `node_modules/`, `dist-desktop/`, `dist-server/` nicht committed werden

### 4. package.json vervollständigen
- [ ] **author** Feld ausfüllen (aktuell leer)
- [ ] **repository** Feld hinzufügen:
  ```json
  "repository": {
    "type": "git",
    "url": "https://github.com/DEIN-USERNAME/camt52-viewer.git"
  }
  ```
- [ ] Optional: **bugs** und **homepage** Felder hinzufügen

---

## 🟡 Empfohlen (Sollte gemacht werden)

### 5. package-lock.json committen
- [ ] `git add package-lock.json` ausführen
- [ ] Für reproduzierbare Builds

### 6. testdaten/ Verzeichnis überprüfen
- [ ] Alle Dateien im `testdaten/` Ordner durchgehen
- [ ] Sicherstellen, dass KEINE echten/sensiblen Bankdaten enthalten sind
- [ ] Daten anonymisieren falls nötig
- [ ] Prüfen, ob Beispiele repräsentativ und hilfreich sind

### 7. README.md erweitern
- [ ] Screenshots der Anwendung hinzufügen
- [ ] Contributing Guidelines Abschnitt hinzufügen
- [ ] Badges hinzufügen (License, Version, etc.)
- [ ] Known Issues / Roadmap Abschnitt hinzufügen
- [ ] Installation-Anleitung überprüfen und testen

### 8. Sicherheitsüberprüfung durchführen
- [ ] Code nach API-Keys durchsuchen
- [ ] Code nach Passwörtern durchsuchen
- [ ] Testdateien auf echte Bankdaten prüfen
- [ ] Persönliche Informationen entfernen
- [ ] `.env` Dateien prüfen (falls vorhanden)

---

## 🟢 Optional (Nice to have)

### 9. GitHub-spezifische Dateien erstellen
- [ ] `.github/ISSUE_TEMPLATE/bug_report.md` erstellen
- [ ] `.github/ISSUE_TEMPLATE/feature_request.md` erstellen
- [ ] `.github/PULL_REQUEST_TEMPLATE.md` erstellen
- [ ] `CONTRIBUTING.md` erstellen
- [ ] `CHANGELOG.md` erstellen
- [ ] `CODE_OF_CONDUCT.md` hinzufügen

### 10. Weitere Verbesserungen
- [ ] GitHub Actions für CI/CD einrichten
- [ ] Dependabot konfigurieren
- [ ] Releases mit Build-Artefakten erstellen
- [ ] GitHub Pages für Demo-Seite einrichten
- [ ] Projekt-Website/Landing-Page erstellen

### 11. Code-Qualität verbessern
- [ ] ESLint Konfiguration hinzufügen
- [ ] Prettier Konfiguration hinzufügen
- [ ] Pre-commit Hooks mit Husky einrichten
- [ ] Tests schreiben (aktuell keine vorhanden)
- [ ] Code-Coverage einrichten

---

## 📋 Finale Checkliste vor dem ersten Push

### Vorbereitung
- [ ] Alle kritischen Punkte (🔴) abgeschlossen
- [ ] Alle empfohlenen Punkte (🟡) überprüft
- [ ] Lokale Tests durchgeführt

### Git-Befehle
```bash
# 1. Unerwünschte Dateien entfernen
rm .DS_Store
rm http___localhost_3001*.jpeg

# 2. .gitignore und LICENSE hinzufügen
git add .gitignore LICENSE

# 3. Gewünschte Dateien hinzufügen
git add package.json package-lock.json
git add build/ public/ testdaten/
git add *.js *.md

# 4. Status überprüfen
git status

# 5. Commit erstellen
git commit -m "chore: prepare project for GitHub publication"

# 6. Repository auf GitHub erstellen (über GitHub Website)

# 7. Remote hinzufügen und pushen
git remote add origin https://github.com/DEIN-USERNAME/camt52-viewer.git
git branch -M main  # Optional: master zu main umbenennen
git push -u origin main
```

### Nach dem Push
- [ ] README.md auf GitHub überprüfen
- [ ] Repository-Einstellungen konfigurieren
- [ ] Topics/Tags hinzufügen (camt052, banking, xml, nodejs, electron)
- [ ] Repository-Beschreibung hinzufügen
- [ ] GitHub Pages aktivieren (falls gewünscht)
- [ ] Erstes Release erstellen

---

## ⚠️ Wichtigste Punkte (Nicht vergessen!)

1. **✅ .gitignore** - Verhindert Upload von 100+ MB node_modules
2. **✅ LICENSE** - Rechtliche Klarheit für Open Source
3. **✅ Testdaten prüfen** - KEINE echten Bankdaten!
4. **✅ package.json** - Author und Repository-URL eintragen
5. **✅ Screenshots löschen** - Nicht für GitHub gedacht

---

## 📝 Notizen

- Das Projekt ist bereits gut dokumentiert
- Die Struktur ist sauber und professionell
- Mit den oben genannten Änderungen ist es GitHub-ready
- Geschätzte Zeit für kritische Punkte: 30-45 Minuten
- Geschätzte Zeit für alle empfohlenen Punkte: 2-3 Stunden

---

**Erstellt am:** 2025-10-28  
**Status:** In Bearbeitung  
**Ziel:** Projekt auf GitHub veröffentlichen