# COPOS Info Panel

Ovo je web aplikacija "Info Panel" za Centar obrane od poplava – Osijek. Dizajnirana je za prikaz na velikim ekranima (kiosk mode) i automatski rotira ključne informacije: vodostaje, meteorološke podatke i status branjenih dionica.

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

Datoteka se sastoji od tri glavna dijela:

1.  **`app`**: Opće postavke aplikacije.
2.  **`rotation`**: Postavke rotacije slajdova.
3.  **`dataSources`**: Linkovi na podatke (Google Sheets).

### 1. Opće postavke (`app`)

Ovdje definirati naslove i interval osvježavanja cijele aplikacije.

```json
"app": {
    "title": "CENTAR OBRANE OD POPLAVA – OSIJEK",
    "subtitle": "INFO PANEL",
    "refreshInterval": 36000000 
}
```
*   `refreshInterval`: Vrijeme u milisekundama nakon kojeg se cijela stranica osvježava (npr. `600000` = 10 minuta).

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
        {
            "src": "meteo.html?id=1",
            "label": "Meteo Podaci - 1",
            "duration": 20000
        }
    ]
}
```
*   `defaultDuration`: Zadano trajanje slajda u milisekundama (ako nije specificirano drugačije).
*   `slides`: Lista slajdova.
    *   `src`: Putanja do datoteke. **Važno:** `?id=1` određuje koji dio podataka se prikazuje (filtrira se prema stupcu SLAJD u CSV-u).
    *   `label`: Tekst koji se ispisuje u podnožju ekrana.
    *   `duration`: (Opcionalno) Trajanje specifičnog slajda ako želite da bude duže ili kraće od zadanog.

### 3. Izvori podataka (`dataSources`)

Ovdje lijepite linkove na CSV export iz Google Sheets tablica.

```json
"dataSources": {
    "hidro": "https://docs.google.com/spreadsheets/d/.../export?format=csv",
    "meteo": "https://docs.google.com/spreadsheets/d/.../export?format=csv",
    "dionice": "https://docs.google.com/spreadsheets/d/.../export?format=csv"
}
```

**Napomena:** Link mora završavati s `export?format=csv` kako bi aplikacija mogla pročitati podatke.

## Struktura Podataka (CSV / Google Sheets)

Aplikacija očekuje specifične stupce u tablicama. Najvažniji stupac je `SLAJD`.

| Stupac     | Opis                                                                                    |
| :--------- | :-------------------------------------------------------------------------------------- |
| **SLAJD**  | Broj ili oznaka (npr. `1`, `2`) koja povezuje red s konfiguracijom (`hidro.html?id=1`). |
| **STATUS** | Određuje boju reda/statusa (Normalno, Pripremno, Redovna, Izvanredna...).               |
| **TREND**  | Prikazuje strelice rasta ili pada (npr. `+2`, `-5`).                                    |

---

## Rješavanje problema

*   **Greška u inicijalizaciji / Nije moguće učitati konfiguraciju**
    *   Najvjerojatnije ste otvorili `index.html` direktno s diska (file://). **Morate koristiti lokalni server** (vidi "Kako koristiti" gore).
*   **Podaci se ne učitavaju?**
    *   Provjerite internetsku vezu.
    *   Provjerite jesu li linkovi u `dataSources` ispravni i javno dostupni.
*   **Neki slajd je prazan?**
    *   Provjerite odgovara li `id` u `config.json` (npr. `?id=5`) broju u stupcu `SLAJD` u Google tablici.
