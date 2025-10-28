# TODO: Vorbereitung für GitHub-Veröffentlichung


- [ ] Optional: **bugs** und **homepage** Felder hinzufügen

---

## 🟡 Empfohlen (Sollte gemacht werden)

### 5. package-lock.json committen
- [ ] `git add package-lock.json` ausführen
- [ ] Für reproduzierbare Builds


### 7. README.md erweitern
- [ ] Screenshots der Anwendung hinzufügen
- [ ] Contributing Guidelines Abschnitt hinzufügen
- [ ] Badges hinzufügen (License, Version, etc.)
- [ ] Known Issues / Roadmap Abschnitt hinzufügen
- [ ] Installation-Anleitung überprüfen und testen


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
