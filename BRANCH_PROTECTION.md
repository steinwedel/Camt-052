# Branch Protection Setup Guide

## Übersicht

Dieses Dokument beschreibt die Einrichtung von Branch Protection Rules für den `main` Branch, um die Codequalität und Stabilität des Projekts zu gewährleisten.

## Was wurde implementiert

### 1. GitHub Actions CI Workflow (`.github/workflows/ci.yml`)

Ein automatisierter CI/CD Workflow wurde erstellt, der folgende Checks durchführt:

#### Build and Test Job
- **Node.js Versionen**: Testet auf Node.js 18.x und 20.x
- **Dependency Installation**: Installiert alle Abhängigkeiten mit `npm ci`
- **Build Verification**: Führt `npm run build` aus, um sicherzustellen, dass der Build funktioniert
- **Security Audit**: Prüft auf bekannte Sicherheitslücken in Dependencies

#### Code Quality Check Job
- Vorbereitet für zukünftige Linting-Tools (ESLint, Prettier)
- Kann erweitert werden mit Code-Formatierungsprüfungen

#### Build Matrix Job
- **Cross-Platform Testing**: Verifiziert Builds auf Ubuntu, Windows und macOS
- **Server Build**: Testet die Server-Package-Erstellung
- **Electron Verification**: Überprüft die Electron-Build-Konfiguration

### 2. Wann wird der Workflow ausgeführt?

Der Workflow wird automatisch ausgeführt bei:
- **Pull Requests** zum `main` Branch
- **Pushes** zum `main` Branch

## GitHub Branch Protection Rules einrichten

### Schritt-für-Schritt Anleitung

1. **Navigieren Sie zu den Repository-Einstellungen**
   - Öffnen Sie Ihr Repository auf GitHub
   - Klicken Sie auf `Settings` (Einstellungen)
   - Wählen Sie `Branches` im linken Menü

2. **Branch Protection Rule erstellen**
   - Klicken Sie auf `Add branch protection rule`
   - Bei "Branch name pattern" geben Sie ein: `main`

3. **Empfohlene Einstellungen aktivieren**

   #### Grundlegende Schutzmaßnahmen (Empfohlen für alle):
   
   ✅ **Require a pull request before merging**
   - Aktivieren Sie diese Option
   - Setzen Sie "Required number of approvals before merging" auf: `1`
   - ✅ Aktivieren Sie "Dismiss stale pull request approvals when new commits are pushed"
   - ✅ Aktivieren Sie "Require review from Code Owners" (optional, wenn Sie CODEOWNERS haben)

   ✅ **Require status checks to pass before merging**
   - Aktivieren Sie diese Option
   - ✅ Aktivieren Sie "Require branches to be up to date before merging"
   - Wählen Sie folgende Status Checks aus (nach dem ersten Workflow-Lauf verfügbar):
     - `Build and Test`
     - `Code Quality Check`
     - `Build Verification (ubuntu-latest)`
     - `Build Verification (windows-latest)` (optional)
     - `Build Verification (macos-latest)` (optional)

   ✅ **Require conversation resolution before merging**
   - Stellt sicher, dass alle Kommentare aufgelöst sind

   ✅ **Require signed commits** (optional, aber empfohlen)
   - Erhöht die Sicherheit durch signierte Commits

   ✅ **Require linear history** (optional)
   - Erzwingt eine saubere, lineare Git-Historie

   ✅ **Do not allow bypassing the above settings**
   - Auch Administratoren müssen sich an die Regeln halten
   - Empfohlen für maximale Sicherheit

   ❌ **Allow force pushes** - DEAKTIVIERT lassen
   - Verhindert das Überschreiben der Historie

   ❌ **Allow deletions** - DEAKTIVIERT lassen
   - Verhindert versehentliches Löschen des Branches

4. **Speichern Sie die Einstellungen**
   - Scrollen Sie nach unten und klicken Sie auf `Create` oder `Save changes`

## Workflow für Entwickler

### Neues Feature entwickeln

```bash
# 1. Neuen Feature-Branch erstellen
git checkout -b feature/mein-neues-feature

# 2. Änderungen vornehmen und committen
git add .
git commit -m "feat: mein neues Feature"

# 3. Branch pushen
git push origin feature/mein-neues-feature

# 4. Pull Request auf GitHub erstellen
# - Gehen Sie zu GitHub
# - Erstellen Sie einen Pull Request von Ihrem Branch zu main
# - Warten Sie, bis alle CI Checks grün sind
# - Holen Sie sich ein Review/Approval
# - Mergen Sie den PR
```

### Was passiert bei einem Pull Request?

1. **Automatische CI Checks starten**
   - Build wird auf mehreren Node.js Versionen getestet
   - Dependencies werden installiert und geprüft
   - Security Audit wird durchgeführt
   - Cross-Platform Builds werden verifiziert

2. **Status Checks müssen grün sein**
   - Alle konfigurierten Checks müssen erfolgreich sein
   - Bei Fehlern muss der Code korrigiert werden

3. **Review erforderlich**
   - Mindestens 1 Approval von einem anderen Entwickler
   - Alle Kommentare müssen aufgelöst sein

4. **Merge möglich**
   - Erst wenn alle Bedingungen erfüllt sind
   - Der Merge kann durchgeführt werden

## Erweiterte Konfiguration

### Code Owners einrichten (optional)

Erstellen Sie eine `.github/CODEOWNERS` Datei:

```
# Alle Dateien
* @steinwedel

# Spezifische Bereiche
/public/ @steinwedel
/build/ @steinwedel
*.json @steinwedel
```

### ESLint/Prettier hinzufügen (empfohlen)

1. **ESLint installieren**:
```bash
npm install --save-dev eslint
npx eslint --init
```

2. **Script in package.json hinzufügen**:
```json
"scripts": {
  "lint": "eslint .",
  "lint:fix": "eslint . --fix"
}
```

3. **CI Workflow erweitern** (`.github/workflows/ci.yml`):
```yaml
- name: Run ESLint
  run: npm run lint
```

### Tests hinzufügen (empfohlen)

1. **Test Framework installieren** (z.B. Jest):
```bash
npm install --save-dev jest
```

2. **Script in package.json hinzufügen**:
```json
"scripts": {
  "test": "jest",
  "test:coverage": "jest --coverage"
}
```

3. **CI Workflow erweitern**:
```yaml
- name: Run tests
  run: npm test
```

## Fehlerbehebung

### Status Checks erscheinen nicht in den Branch Protection Settings

**Problem**: Nach dem Erstellen der Branch Protection Rule sind die Status Checks nicht sichtbar.

**Lösung**: 
1. Erstellen Sie einen Test-Pull-Request
2. Warten Sie, bis der CI Workflow einmal durchgelaufen ist
3. Gehen Sie zurück zu den Branch Protection Settings
4. Die Status Checks sollten jetzt in der Liste erscheinen

### CI Workflow schlägt fehl

**Problem**: Der Build schlägt im CI fehl, funktioniert aber lokal.

**Mögliche Ursachen**:
1. **Node.js Version**: Stellen Sie sicher, dass die lokale Version mit der CI-Version übereinstimmt
2. **Dependencies**: Führen Sie `npm ci` statt `npm install` aus
3. **Environment Variables**: Prüfen Sie, ob spezielle Umgebungsvariablen benötigt werden

### Pull Request kann nicht gemerged werden

**Problem**: Der Merge-Button ist deaktiviert.

**Checkliste**:
- [ ] Sind alle Status Checks grün?
- [ ] Wurde der PR approved?
- [ ] Sind alle Kommentare aufgelöst?
- [ ] Ist der Branch up-to-date mit main?

## Best Practices

1. **Kleine, fokussierte Pull Requests**
   - Einfacher zu reviewen
   - Schnellere CI-Durchläufe
   - Weniger Merge-Konflikte

2. **Aussagekräftige Commit Messages**
   - Verwenden Sie Conventional Commits: `feat:`, `fix:`, `docs:`, etc.
   - Beschreiben Sie das "Warum", nicht nur das "Was"

3. **Regelmäßig mit main synchronisieren**
   ```bash
   git checkout main
   git pull
   git checkout feature/mein-branch
   git rebase main
   ```

4. **CI-Fehler lokal reproduzieren**
   - Verwenden Sie die gleiche Node.js Version wie im CI
   - Führen Sie `npm ci` statt `npm install` aus
   - Testen Sie alle Build-Befehle lokal

## Zusammenfassung

Mit dieser Konfiguration ist Ihr `main` Branch nun geschützt durch:

✅ **Automatisierte CI Checks** - Builds und Tests laufen automatisch  
✅ **Code Reviews** - Mindestens 1 Approval erforderlich  
✅ **Status Checks** - Alle Tests müssen grün sein  
✅ **Keine Force Pushes** - Historie kann nicht überschrieben werden  
✅ **Keine direkten Commits** - Nur über Pull Requests  

Dies stellt sicher, dass nur geprüfter und funktionierender Code in den `main` Branch gelangt.

## Support

Bei Fragen oder Problemen:
1. Überprüfen Sie die GitHub Actions Logs
2. Konsultieren Sie die [GitHub Documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
3. Erstellen Sie ein Issue im Repository