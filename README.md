# COPOS Info Panel

Ovo je web aplikacija "Info Panel" za Centar obrane od poplava – Osijek. Dizajnirana je za prikaz na velikim ekranima (kiosk mode) i automatski rotira ključne informacije: vodostaje, meteorološke podatke i status branjenih dionica.

## Verzija v0.1.7-alpha

Ova verzija proširuje funkcionalnost "Status dionica" s dodatnim informacijama i poboljšanom prezentacijom.

**Glavne promjene:**

* **Novi Stupac "NASIP"**: U tablicu "Status dionica" dodan je stupac "NASIP" koji prikazuje podatke iz istoimenog stupca u Google tablicama.
* **Formatiranje Teksta**: Omogućeno je prikazivanje višestrukih redova teksta (novi redovi iz CSV-a) unutar ćelija tablice, čime se poboljšava čitljivost dužih opisa.
* **Poboljšani Layout**:
  * **Desktop**: Reorganizirana je mreža (grid) tablice kako bi podržala 7 stupaca uz optimalnu iskoristivost prostora.
  * **Mobile**: Ažuriran je kartični prikaz na mobitelima kako bi se novi podatak ispravno prikazivao s odgovarajućom oznakom.
* **Offline Mode Podrška**: Sustav keširanja verificirano podržava i nove podatke, osiguravajući dostupnost informacija o nasipima i bez internetske veze.

## Verzija v0.1.6-alpha

Ova verzija implementira **Offline Mode** funkcionalnost.

**Glavne promjene:**

* **Keširanje Podataka**: Aplikacija sada automatski sprema (kešira) zadnje uspješno učitane podatke u lokalnu memoriju preglednika (`localStorage`).
* **Offline Indikator**: U slučaju gubitka internetske veze ili nemogućnosti dohvata novih podataka, aplikacija automatski prikazuje crvenu traku na vrhu ekrana s porukom "OFFLINE MODE" i vremenom zadnjeg uspješnog ažuriranja.
* **Kontinuitet Rada**: Panel više neće prikazivati ekran s greškom ("Error State") ako internet nestane, već će nastaviti vrtjeti zadnje poznate podatke dok se veza ne uspostavi.

## Verzija v0.1.5-alpha

Ova verzija donosi značajna poboljšanja stabilnosti i robusnosti sustava za parsiranje podataka.

**Glavne promjene:**

* **Robusni CSV Parser**:
  * **Duplicate Header Handling**: Parser sada automatski preimenuje duplicirane nazive stupaca (npr. `Vrijednost`, `Vrijednost_2`) umjesto da prebriše podatke. Ovo rješava problem kada vanjski izvori podataka imaju neispravna zaglavlja.
  * **Zaštita od Praznih Ulaza**: Dodana je provjera za prazne ili neispravne ulazne podatke koja sprječava "rušenje" aplikacije i ispisuje jasno upozorenje u konzolu.
  * **Detekcija Grešaka**: Implementirano je tiho logiranje (debug level) kada broj stupaca u redu ne odgovara zaglavlju, što olakšava dijagnostiku problema s podacima bez ometanja rada aplikacije.
  * **Bolje Upravljanje Novim Redovima**: Poboljšana logika za ignoriranje praznih linija na kraju datoteke.

## Verzija v0.1.4-alpha

Ova verzija donosi značajne promjene u arhitekturi konfiguracije aplikacije.

**Glavne promjene:**

* **Centralizirana Konfiguracija**: Sve postavke koje su ranije bile "hardkodirane" u HTML datotekama (`dionice.html`, `hidro.html`, `meteo.html`) sada se nalaze u `config.json`. To uključuje intervale osvježavanja, naslove stranica, boje tema i tekstove u podnožju.
* **Dinamički Init**: Implementiran je novi sustav inicijalizacije (`init()`) koji prvo učitava postavke, a zatim pokreće aplikaciju. Ovo osigurava da promjene u konfiguraciji ne zahtijevaju diranje u kodu.
* **Pametno Osvježavanje**: Interval osvježavanja podataka sada se može globalno kontrolirati kroz `config.json` (`dataSources.refreshIntervalMs`), umjesto da je fiksiran na 60 sekundi u svakoj datoteci.
* **Prošireni Config.json**:
  * Dodana sekcija `app` za globalne postavke (footer, theme color).
  * Dodana sekcija `pages` za specifične naslove pojedinih modula.

---

## Struktura Projekta

Brzi pregled ključnih datoteka za developere:

* **`index.html`**: Glavni okvir aplikacije. Sadrži "header" i "footer" te `iframe` koji vrti module.
* **`config.json`**: Centralna konfiguracijska datoteka. Ovdje se definiraju slajdovi, boje i izvori podataka.
* **`style.css`**: Svi stilovi na jednom mjestu. Koristi CSS varijable za laganu promjenu tema.
* **`js/csv-parser.js`**: "Mozak" aplikacije za podatke. Parsira Google Sheets CSV i rješava probleme s formatiranjem.
* **`dionice.html` / `hidro.html` / `meteo.html`**: Zasebni moduli za prikaz.


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

### Kiosk Mode (Produkcija)

Za postavljanje na javni ekran (TV), preporuča se pokrenuti preglednik u "Kiosk" modu. Ovo skriva sve trake (address bar, bookmarks) i onemogućuje izlazak bez tipkovnice.

**Google Chrome / Microsoft Edge:**
Kreirajte prečac (shortcut) i u "Target" polje dodajte:

```bash
--kiosk --disable-infobars --check-for-update-interval=31536000 "http://localhost:8000"
```

* `--kiosk`: Puni ekran, blokiran izlaz.
* `--disable-infobars`: Sklanja poruke tipa "Chrome is being controlled...".


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
* `footerText`: Tekst koji se prikazuje u lijevom kutu podnožja.
* `metaRefreshSeconds`: Interval (u sekundama) potpunog ponovnog učitavanja stranice (za oslobađanje memorije).

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
* `defaultDuration`: Zadano trajanje slajda u milisekundama.
* `slides`: Lista slajdova (`src`, `label`, opcionalno `duration`).

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
* `refreshIntervalMs`: Koliko često (u ms) skripte provjeravaju Google Sheets za nove podatke (zadano 60000 = 1 min).

---

## Struktura Podataka (CSV / Google Sheets)

## Specifikacija Podataka (Google Sheets)

Svaki modul zahtijeva specifične stupce u Google Sheets tablici.

### 1. Zajednički stupci (Obavezni za sve)
| Stupac    | Opis                                                                              |
| :-------- | :-------------------------------------------------------------------------------- |
| **SLAJD** | ID slajda (npr. `1`, `2`) koji povezuje red s konfiguracijom (`hidro.html?id=1`). |

### 2. Hidro Podaci (`hidro.html`)
| Stupac                  | Opis                                |
| :---------------------- | :---------------------------------- |
| **POSTAJA**             | Ime mjerne postaje (npr. `Osijek`). |
| **DIONICE**             | Ime rijeke/lokacije (npr. `Drava`). |
| **VODOSTAJ**            | Trenutna vrijednost (broj).         |
| **TREND**               | Promjena (npr. `+2`, `-5`).         |
| **STATUS**              | Stanje (npr. `Redovna obrana`).     |
| **DATUM** / **VRIJEME** | Vrijeme očitanja.                   |

### 3. Meteo Podaci (`meteo.html`)
Zahtijeva točne nazive stupaca jer je tablica kompleksna:

* LOKACIJA
* DATUM, VRIJEME
* TEMPERATURA ZRAKA C°
* SMJER VJETRA, VJETAR [m/s], MAX UDARI VJETRA [m/s]
* TLAK ZRAKA [hPa], VLAGA [%]
* SATNA OBORINA [mm], DNEVNA OBORINA [mm], MJESEČNA OBORINA [mm]

### 4. Status Dionica (`dionice.html`)
| Stupac                          | Opis                                |
| :------------------------------ | :---------------------------------- |
| **OZNAKA PODRUČJA**             | Šifra dionice (npr. `A.12.3`).      |
| **VODOTOK**                     | Ime rijeke/kanala.                  |
| **NASIP**                       | (Novo v0.1.7) Opis nasipa.           |
| **STATUS**                      | Stanje obrane (boja statusa).       |
| **MJERODAVNI VODOMJER**         | Ime referentne postaje.             |
| **RUKOVODITELJ** / **ZAMJENIK** | Imena odgovornih osoba.             |


---

## Responzivni Dizajn (Web & Mobile)

Aplikacija se automatski prilagođava veličini ekrana na kojem se prikazuje.

### 1. Mobiteli (< 768px)

* **Card View**: Kako bi podaci bili čitljivi na malim ekranima, tablice se transformiraju u "kartice". Zaglavlja tablica se skrivaju, a svaki redak postaje zaseban blok s jasno označenim podacima.
* **Auto-Pause**: Na mobitelima se automatska rotacija slajdova **pauzira prema zadanim postavkama** kako bi korisnik mogao pregledavati podatke svojim tempom. Tipkom "Play" (trokutić) rotacija se može ponovno pokrenuti.

### 2. Video Zidovi / Mega Ekrani (> 2560px)

* **Auto-Scaling**: Za ekrane vrlo visokih rezolucija (4K i veće), aplikacija automatski povećava veličinu fonta i sučelja kako bi podaci bili čitljivi s udaljenosti.

---

## Offline Način Rada

Aplikacija je dizajnirana da bude otporna na prekide internetske veze.

### Kako funkcionira?
1.  **Spremanje**: Svaki put kada aplikacija uspješno dohvati CSV s Google Sheetsa, sprema ga u `localStorage` preglednika.
2.  **Detekcija Greške**: Ako dohvat podataka ne uspije (nema interneta, Google Sheets je nedostupan), aplikacija automatski učitava spremljene podatke.
3.  **Indikacija**: Na vrhu ekrana pojavljuje se crvena traka **"OFFLINE MODE"** s vremenom kada su podaci zadnji put uspješno osvježeni.

### Ograničenja

* Podaci se spremaju samo u **tom specifičnom pregledniku** na tom uređaju.
* Ako očistite povijest/cache preglednika, offline podaci će biti obrisani.
* Potrebno je barem jedno uspješno učitavanje dok je uređaj online da bi offline mod radio.

---

## Rješavanje problema

* **Greška u inicijalizaciji / Nije moguće učitati konfiguraciju**
  * Najvjerojatnije ste otvorili `index.html` direktno s diska (file://). **Morate koristiti lokalni server** (vidi "Kako koristiti" gore).
* **Podaci se ne učitavaju?**
  * Provjerite internetsku vezu.
  * Provjerite jesu li linkovi u `dataSources` ispravni i javno dostupni.
* **Neki slajd je prazan?**
  * Provjerite odgovara li `id` u `config.json` (npr. `?id=5`) broju u stupcu `SLAJD` u Google tablici.

---

## Tutorial: Kako dodati vlastite podatke

Želite prikazati vlastitu tablicu? Slijedite ove korake:

1.  **Kreirajte Google Sheet**:
    * Napravite novu tablicu.
    * U prvi red upišite nazive stupaca (npr. `Naslov`, `Vrijednost`, `SLAJD`).

2.  **Objavite na Web**:
    * Idite na `File` > `Share` > `Publish to web`.
    * Odaberite "Entire Document" (ili specifični Sheet) i **"Comma-separated values (.csv)"**.
    * Kliknite "Publish". Dobit ćete link.

3.  **Ažurirajte Config**:
    * Otvorite `config.json`.
    * Dodajte taj link pod `dataSources` (npr. `"mojiPodaci": "LINK_OD_GORE"`).

4.  **Kreirajte HTML Modul**:
    * Kopirajte npr. `dionice.html` u `moji-podaci.html`.
    * U `loadData` funkciji promijenite `config.dataSources.dionice` u `config.dataSources.mojiPodaci`.
    * U `renderTable` funkciji promijenite nazive stupaca da odgovaraju vašima (`row['Naslov']`).

---

## Tehnički Stack

* **Jezik**: Čisti HTML5, CSS3, JavaScript (ES6+).
* **Build**: Nema (No npm, no webpack needed). Samo "Save & Refresh".
* **Ikone**: Inline SVG (nema vanjskih fontova).
* **Font**: Sistemski fontovi (Inter/Roboto) za brzinu.
