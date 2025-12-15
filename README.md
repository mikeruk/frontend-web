

# frontend-web (UI + API Gateway)

Dieses Projekt ist der **Frontend-Web**-Baustein der Demo-Anwendung zur **Berechnung von Versicherungstarifen**.  
Es kombiniert **Spring Boot** (als Host + Proxy/API) mit einer **Angular Single-Page-App** (Wizard mit 3 Schritten), 
die im **Production-Modus** über **Thymeleaf** ausgeliefert wird.

---

## Überblick & Architektur

Die Anwendung besteht aus mehreren Services. `frontend-web` übernimmt zwei Aufgaben:

1) **UI ausliefern** (Angular Build wird von Spring Boot ausgeliefert)
2) **Backend-Aufrufe bündeln** (Angular ruft nur `frontend-web` auf; `frontend-web` ruft das `offer-service` weiter)

Datenfluss:

Browser (Angular) via POST to /api/offers to frontend-web (Spring Boot)
frontend-web (Spring Boot) via POST to /api/v1/offers/create to offer-service
offer-service via POST /api/v1/price/calculate to calculator-service


---

## UI-Funktionalität (Angular Wizard)

Die Angular UI ist ein Wizard mit 3 Schritten:

- **Step 1**: Auswahl des Fahrzeugtyps (`vehicleType`) über Kacheln (mit Material Symbols Icons)
- **Step 2**: Eingaben:
   - `kilometers` (Validierung: required, min 1, max 999999999)
   - `postcode` (required)
- **Step 3**: Das Ergebnis + Anzeige:
   - große **Preis-Box** (Preis mit 2 Nachkommastellen)
   - kleine **Countdown-Box** bis `expirationDate` (laufender Timer, blinkender Punkt)
   - bei Fehlern wird die **Backend-Fehlermeldung** angezeigt (z.B. "Unknown postcode: …")

Zusätzlich:
- Beim Wechseln per **Next** wird ein **2 Sekunden Spinner** angezeigt (UI-Transition).
- Die Step-Kreise werden nach erfolgreichem Abschluss **grün**.

---

## API & URLs

### UI (Production)
- `GET /` via Thymeleaf `index.html`  lädt Angular Assets aus `/static`

### API (für Angular / externe Clients)
- `POST /api/offers`
   - Request:
     ```json
     {
       "kilometers": 12000,
       "vehicleType": "PKW",
       "postcode": "51069"
     }
     ```
   - Success: `200 OK` mit `NewOfferResponseDto` (inkl. price, Faktoren, status, expirationDate)
   - Error: HTTP Status + JSON Body werden **durchgereicht** (z. B. `400` inkl. `message`)

---

## Spring Boot Setup (frontend-web)

Wichtige Bausteine in `frontend-web`:

- **MVC Controller** (Thymeleaf View):
   - `AppPageController` (`@Controller`)
   - `GET /` und `GET /app` -->> `index` (templates/index.html)

- **REST Controller** (API Gateway):
   - `OfferControllerImpl` (`@RestController`, `/api`)
   - `POST /offers` -->> ruft `OffersClient.createOffer(...)` auf

- **Downstream Client** zum `offer-service`:
   - `OffersClient` via `@HttpExchange` / `@PostExchange` (Spring 6 HTTP Interface)
   - `WebClient` + `HttpServiceProxyFactory` in `AppConfig`

- **Error Forwarding** (sehr wichtig):
   - `GlobalErrorHandler` (`@RestControllerAdvice`)
   - fängt `WebClientResponseException` ab und gibt **Status + JSON Body** exakt weiter  
     -->> Angular kann `err.error.message` sauber anzeigen

Beispiel `application.properties`:
```properties
spring.application.name=frontend-web
server.port=8080

offer-service.base-url=http://localhost:8181
```

Lokal starten (Development)
Auch wenn das Ziel Production ist, hilft das für lokale Tests:
1. Backend Services starten (Ports sind Beispiele):
• calculator-service: http://localhost:8282
• offer-service: http://localhost:8181
• frontend-web: http://localhost:8080
2. Angular Dev Server starten (im Angular Projekt):

```text
npm install
npm start
```

Angular läuft dann unter:
• http://localhost:4200
In Dev wird über Proxy Requests an Spring weitergeleitet (/api/**).

Production Build: Angular direkt über Spring Boot ausliefern
Ziel: ng build schreibt die fertigen Dateien direkt nach:
• frontend-web/src/main/resources/static/
1) Angular Output direkt in Spring /static schreiben
   In angular.json (Angular Projekt) den outputPath setzen:
```json
{
   "projects": {
      "page": {
         "architect": {
            "build": {
               "options": {
                  "outputPath": "../frontend-web/src/main/resources/static",
                  "outputHashing": "none"
               }
            }
         }
      }
   }
}

```

outputHashing: "none" ist wichtig, damit man stabile Namen wie main.js / styles.css bekommt
(sonst heißen die Dateien z. B. main-XYZ123.js).


2) Production Build ausführen
   ng build --configuration production

Danach liegen u. a. folgende Dateien in frontend-web/src/main/resources/static/:
• main.js
• styles.css
3) Thymeleaf Template lädt Angular Assets
   frontend-web/src/main/resources/templates/index.html (Beispiel):

<link rel="stylesheet" th:href="@{/styles.css}">
<script type="module" th:src="@{/main.js}"></script>

4) Spring Boot starten und UI öffnen
   • Spring Boot starten (frontend-web)
   • Browser öffnen:
   ◦ http://localhost:8080/

Troubleshooting
Browser zeigt nur „Loading…“
Dann bootstrapped Angular nicht. Prüfe im Browser direkt:
• http://localhost:8080/main.js (darf nicht 404 sein)
• http://localhost:8080/styles.css (darf nicht 404 sein)
Wenn 404:
• Angular Production Build erneut ausführen (ng build --configuration production)
• prüfen, ob outputPath korrekt auf .../src/main/resources/static zeigt.
Angular zeigt bei Fehlern nur generische 400/500 Meldungen
Stelle sicher, dass frontend-web einen globalen Handler hat, der WebClientResponseException
abfängt und den JSON Body weiterreicht (Status + Body unverändert).