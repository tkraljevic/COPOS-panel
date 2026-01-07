# COPOS Info Panel

Ovo je web aplikacija "Info Panel" za Centar obrane od poplava – Osijek. Dizajnirana je za prikaz na velikim ekranima (kiosk mode) i automatski rotira ključne informacije: vodostaje, meteorološke podatke i status branjenih dionica.

## Verzija v0.1.4-alpha

Ova verzija donosi značajne promjene u arhitekturi konfiguracije aplikacije.

**Glavne promjene:**
*   **Centralizirana Konfiguracija**: Sve postavke koje su ranije bile "hardkodirane" u HTML datotekama (`dionice.html`, `hidro.html`, `meteo.html`) sada se nalaze u `config.json`. To uključuje intervale osvježavanja, naslove stranica, boje tema i tekstove u podnožju.
*   **Dinamički Init**: Implementiran je novi sustav inicijalizacije (`init()`) koji prvo učitava postavke, a zatim pokreće aplikaciju. Ovo osigurava da promjene u konfiguraciji ne zahtijevaju diranje u kodu.
*   **Pametno Osvježavanje**: Interval osvježavanja podataka sada se može globalno kontrolirati kroz `config.json` (`dataSources.refreshIntervalMs`), umjesto da je fiksiran na 60 sekundi u svakoj datoteci.
*   **Prošireni Config.json**:
    *   Dodana sekcija `app` za globalne postavke (footer, theme color).
    *   Dodana sekcija `pages` za specifične naslove pojedinih modula.

---

## Kako koristiti

Iako je ovo statička aplikacija, **potrebno ju je pokrenuti putem lokalnog web servera** jer moderni preglednici blokiraju učitavanje konfiguracijskih datoteka (`config.json`) direktno s diska (CORS politika).

### Opcija 1: Python (Preporučeno)
Ako imate instaliran Python:

1. Otvorite Terminal u mapi projekta.
2. Pokrenite naredbu:
   ```bash
   python3 -m http.server
   ```
3. Otvorite preglednik na: `http://localhost:8000`

### Opcija 2: PHP
Ako imate instaliran PHP:

1. Otvorite Terminal u mapi projekta.
2. Pokrenite naredbu:
   ```bash
   php -S localhost:8000
   ```
3. Otvorite preglednik na: `http://localhost:8000`

### Opcija 3: VS Code "Live Server"
Ako koristite Visual Studio Code:
1. Instalirajte ekstenziju **Live Server**.
2. Desni klik na `index.html`.
3. Odaberite **"Open with Live Server"**.

Za kiosk način rada (preko cijelog ekrana), pritisnite tipku `F11`.

---

## Konfiguracija (config.json)

Sve postavke aplikacije nalaze se u datoteci `config.json`. **Nije potrebno mijenjati programski kod** za dodavanje novih slajdova ili promjenu izvora podataka.

### Struktura datoteke

Datoteka se sastoji od četiri glavna dijela:

1.  **`app`**: Opće postavke aplikacije (novo u v0.1.4).
2.  **`pages`**: Postavke specifične za podstranice (novo u v0.1.4).
3.  **`rotation`**: Postavke rotacije slajdova.
4.  **`dataSources`**: Linkovi na podatke (Google Sheets).

### 1. Opće postavke (`app`)

Ovdje definirate globalne atribute aplikacije.

```json
"app": {
    "title": "CENTAR OBRANE OD POPLAVA – OSIJEK",
    "subtitle": "INFO PANEL",
    "footerText": "Izvor: Hrvatske vode / DHMZ / SHMU / OVF",
    "themeColor": "#0b1118",
    "metaRefreshSeconds": 3600
}
```
*   `footerText`: Tekst koji se prikazuje u lijevom kutu podnožja.
*   `metaRefreshSeconds`: Interval (u sekundama) potpunog ponovnog učitavanja stranice (za oslobađanje memorije).

### 2. Rotacija (`rotation`)

Ovdje definirate koji se slajdovi prikazuju i koliko dugo.

```json
"rotation": {
    "defaultDuration": 15000, 
    "slides": [
        {
            "src": "hidro.html?id=1",
            "label": "VODOSTAJI - 1"
        },
        // ...
    ]
}
```
*   `defaultDuration`: Zadano trajanje slajda u milisekundama.
*   `slides`: Lista slajdova (`src`, `label`, opcionalno `duration`).

### 3. Izvori podataka (`dataSources`)

Linkovi na CSV export iz Google Sheets tablica i frekvencija osvježavanja.

```json
"dataSources": {
    "hidro": "https://docs.google.com/spreadsheets/d/.../export?format=csv",
    "meteo": "https://docs.google.com/spreadsheets/d/.../export?format=csv",
    "dionice": "https://docs.google.com/spreadsheets/d/.../export?format=csv",
    "refreshIntervalMs": 60000
}
```
*   `refreshIntervalMs`: Koliko često (u ms) skripte provjeravaju Google Sheets za nove podatke (zadano 60000 = 1 min).

---

## Struktura Podataka (CSV / Google Sheets)

Aplikacija očekuje specifične stupce u tablicama. Najvažniji stupac je `SLAJD`.

| Stupac     | Opis                                                                                    |
| :--------- | :-------------------------------------------------------------------------------------- |
| **SLAJD**  | Broj ili oznaka (npr. `1`, `2`) koja povezuje red s konfiguracijom (`hidro.html?id=1`). |
| **STATUS** | Određuje boju reda/statusa (Normalno, Pripremno, Redovna, Izvanredna...).               |
| **TREND**  | Prikazuje strelice rasta ili pada (npr. `+2`, `-5`).                                    |

---

## Responzivni Dizajn (Web & Mobile)

Aplikacija se automatski prilagođava veličini ekrana na kojem se prikazuje.

### 1. Mobiteli (< 768px)
*   **Card View**: Kako bi podaci bili čitljivi na malim ekranima, tablice se transformiraju u "kartice". Zaglavlja tablica se skrivaju, a svaki redak postaje zaseban blok s jasno označenim podacima.
*   **Auto-Pause**: Na mobitelima se automatska rotacija slajdova **pauzira prema zadanim postavkama** kako bi korisnik mogao pregledavati podatke svojim tempom. Tipkom "Play" (trokutić) rotacija se može ponovno pokrenuti.

### 2. Video Zidovi / Mega Ekrani (> 2560px)
*   **Auto-Scaling**: Za ekrane vrlo visokih rezolucija (4K i veće), aplikacija automatski povećava veličinu fonta i sučelja kako bi podaci bili čitljivi s udaljenosti.

---

## Rješavanje problema

*   **Greška u inicijalizaciji / Nije moguće učitati konfiguraciju**
    *   Najvjerojatnije ste otvorili `index.html` direktno s diska (file://). **Morate koristiti lokalni server** (vidi "Kako koristiti" gore).
*   **Podaci se ne učitavaju?**
    *   Provjerite internetsku vezu.
    *   Provjerite jesu li linkovi u `dataSources` ispravni i javno dostupni.
*   **Neki slajd je prazan?**
    *   Provjerite odgovara li `id` u `config.json` (npr. `?id=5`) broju u stupcu `SLAJD` u Google tablici.
