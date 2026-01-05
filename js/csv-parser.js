/**
 * CSV PARSER (Comma Separated Values)
 * 
 * Ova funkcija pretvara tekstualni CSV format (redovi i zarezima odvojene vrijednosti)
 * u JavaScript objekte koje možemo lako koristiti u aplikaciji.
 * 
 * Primjer ulaza:
 * "Ime,Prezime\nIvan,Horvat"
 * 
 * Primjer izlaza:
 * [ { "Ime": "Ivan", "Prezime": "Horvat" } ]
 * 
 * @param {string} text - Sirovi tekst iz CSV datoteke
 * @returns {Array} Niz objekata gdje su ključevi nazivi stupaca
 */
function parseCSV(text) {
  const rows = [];
  let currentRow = [];
  let currentField = "";
  let inQuotes = false; // Zastavica: jesmo li trenutno unutar navodnika?

  // Prolazimo kroz svako slovo (znak) u tekstu, jedan po jedan
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    // 1. Obrada navodnika (")
    // Navodnici su posebni jer omogućuju da unutar polja imamo zarez (npr. "Horvat, Ivan")
    if (char === '"') {
      // Ako naiđemo na dvostruki navodnik ("") unutar navodnika, to znači doslovni navodnik
      if (inQuotes && nextChar === '"') {
        currentField += '"';
        i++; // Preskačemo idući znak jer smo ga upravo obradili
      } else {
        // Inače, ovo je početak ili kraj citiranog dijela
        inQuotes = !inQuotes;
      }
    }
    // 2. Obrada zareza (,) - označava kraj polja
    // Samo ako NISMO unutar navodnika
    else if (char === ',' && !inQuotes) {
      currentRow.push(currentField); // Spremi polje u trenutni red
      currentField = "";             // Resetiraj polje za iduće
    }
    // 3. Obrada novog reda (\n ili \r) - označava kraj reda
    // Samo ako NISMO unutar navodnika
    else if ((char === '\n' || char === '\r') && !inQuotes) {
      // Ako je \r\n (Windowsov stil novog reda), preskoči \n
      if (char === '\r' && nextChar === '\n') {
        i++;
      }

      // Spremi red samo ako ima nekog sadržaja
      if (currentField || currentRow.length > 0) {
        currentRow.push(currentField);

        // Provjeri je li red prazan (samo razmaci)
        if (currentRow.some(field => field.trim() !== "")) {
          rows.push(currentRow);
        }

        // Resetiraj za novi red
        currentRow = [];
        currentField = "";
      }
    }
    // 4. Običan znak - samo ga dodaj u trenutno polje
    else {
      currentField += char;
    }
  }

  // Dodaj zadnje polje i red ako datoteka ne završava novim redom
  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField);
    if (currentRow.some(field => field.trim() !== "")) {
      rows.push(currentRow);
    }
  }

  // Ako nismo našli podatke, vrati prazan niz
  if (rows.length === 0) return [];

  // Prvi red sadrži nazive stupaca (Headere)
  const headers = rows[0].map(h => h.trim()); // .trim() miče razmake s početka i kraja
  const data = [];

  // Prolazimo kroz ostale redove (od indexa 1) i pretvaramo ih u objekte
  for (let i = 1; i < rows.length; i++) {
    const row = {};
    headers.forEach((header, index) => {
      // Spajamo naziv stupca (header) s vrijednošću na tom indeksu
      row[header] = rows[i][index] ? rows[i][index].trim() : "";
    });
    data.push(row);
  }

  return data;
}
