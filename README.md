# factrotify

factrotify ist ein simpler Bot der über Slack Benachrichtigungen versendet, sobald man eine neue Aufgabe in factro zugewiesen bekommt.

## Vorraussetzungen

- [Node.JS](https://nodejs.org/de)
- [Slack](https://slack.com)
- [factro](https://www.factro.de)

- Port 3000 muss frei sein.

## Konfiguration

Bevor Sie factrotify nutzen können müssen Sie ein paar Vorbereitungen treffen.

### Slack

Zunächst müssen Sie (falls noch nicht geschehen) einen Slack Bot erstellen.
Diesen können Sie [hier](https://api.slack.com/apps) erstellen.
Wählen Sie hierfür die Option "Create New App" aus.
Es taucht ein Modal auf. Wählen Sie hier "From scratch" aus.
Geben Sie einen Namen für den Bot ein (dieser ist auch der Anzeigename in Slack) und wählen Sie das Workspace aus, in dem der Bot genutzt werden soll.
Klicken Sie anschließend auf "Create App".

Der Bot ist nun erstellt, muss aber noch konfiguriert werden.

Unter "Add features and functionality" wählen Sie "Permissions" aus.
Hier müssen Sie nun folgende "Bot Token Scopes" hinzufügen:

1. `chat:write`
2. `im:write`
3. `users:read`

Anschließend müssen Sie den Bot noch in den Workspace einladen.
Hierfür scrollen Sie zunächst hoch und wählen dann "Install to Workspace" aus.
Klicken Sie anschließend auf "Zulassen".

Die Installation ist nun abgeschlossen.
Der nun angezeigte "Bot User OAuth Token" kann nun in die [Konfigurationsdatei](./src/config/config.json) unter "slack" -> "botToken" eingetragen werden.

Als nächstes wird der "Signing Secret" benötigt.
Diesen finden Sie unter "Basic Information" -> "App Credentials".
Dieser kann nun in die [Konfigurationsdatei](./src/config/config.json) unter "slack" -> "signingSecret" eingetragen werden.

Als letztes benötigen Sie den Anzeigenamen des Nutzers an den die Benachrichtigungen gesendet werden sollen.
Dieser kann in die [Konfigurationsdatei](./src/config/config.json) unter "slack" -> "username" eingetragen werden.

Die Konfiguration von Slack ist nun abgeschlossen.

### factro

Damit factrotify auf Änderungen an Tasks hören kann wird ein API Key von factro benötigt.
Diesen können Sie unter "Einstellungen" -> "Einstellungen" -> "API" erstellen.
Geben Sie einen Namen und eine Beschreibung für den API Key ein und klicken Sie auf "API-Key erstellen".
Nun wird der API-Key angezeigt.

Dieser kann nun in die [Konfigurationsdatei](./src/config/config.json) unter "factro" -> "apiKey" eingetragen werden.

Als nächstes müssen Sie einen Webhook anlegen.
Diesen können Sie unter "Einstellungen" -> "Einstellungen" -> "Webhooks" erstellen.
Unter "Aufzurufende URL" tragen Sie die URL ein, unter der factrotify erreichbar ist, gefolgt von `/factro/task-executor-changed`.
Als "Aktion" wählen Sie "TaskExecutorChanged" aus.

Optional können Sie die Authentifizierungsfunktionalität von factro verwenden.
Dazu tragen Sie einfach als "Authentifizierungsheader" "authorization" ein und als "Authentifizierungsschlüssel" einen beliebigen Schlüssel ein.
Den Schlüssel müssen Sie nun in der [Konfigurationsdatei](./src/config/config.json) unter "factro" -> "webhookAuthKey" eintragen.

Wenn Sie das nicht benötigen können Sie die restlichen Felder können leer lassen und in der [Konfigurationsdatei](./src/config/config.json) unter "factro" -> "webhookAuthKey" den Wert leeren.

Klicken Sie anschließend auf "Webhook erstellen".

Als letztes benötigen Sie die ID Ihres Benutzerkontos.
Um diese herauszufinden klicken Sie auf "Benutzer" und wählen Sie Ihren Benutzer aus.
In der URL können Sie nun Ihre ID finden `https://cloud.factro.com/<mandantID>/Users/Overview?p=employee&pi=<IHRE ID>`.
Alternativ können Sie über [diesen API-Request](https://cloud.factro.com/api/core/docs/#/users/HandleGetUsers) die Benutzer abrufen und Ihre ID heraussuchen.
Die ID kann nun in die [Konfigurationsdatei](./src/config/config.json) unter "factro" -> "employeeId" eingetragen werden.

## Installation

Zum Installieren von factrotify müssen Sie zunächst die Abhängigkeiten installieren und die Anwendung bauen.

```bash
npm install
npm run build
```

## Starten

Da factrotify nun konfiguriert und installiert ist, können Sie die Anwendung nun starten.

```bash
npm start
```

## Docker

Alternativ können Sie factrotify auch über Docker starten.

Dafür müssen Sie zunächst das Image bauen.

```bash
docker build -t factrotify .
```

Dann können Sie das Image starten.

```bash
docker run -p 3000:3000 factrotify --name factrotify
```
