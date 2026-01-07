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
  // 0. Sigurnosna provjera ulaza
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    console.warn("CSV Parser: Ulazni tekst je prazan ili nije string.");
    return [];
  }

  const rows = [];
  let currentRow = [];
  let currentField = "";
  let inQuotes = false;

  // Prolazimo kroz svako slovo
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentField += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    }
    else if (char === ',' && !inQuotes) {
      currentRow.push(currentField);
      currentField = "";
    }
    else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }

      // Spremanje reda - čak i ako je naizgled prazan, može biti relevantan ako je unutar strukture,
      // ali za nas su bitni redovi s podacima.
      // Modifikacija: Spremi red ako sadrži bilo što, pa makar i prazne stringove ako je struktura takva,
      // ali za ovaj projekt preskačemo potpuno prazne linije.
      currentRow.push(currentField);

      if (currentRow.length > 1 || (currentRow.length === 1 && currentRow[0].trim() !== "")) {
        rows.push(currentRow);
      }

      currentRow = [];
      currentField = "";
    }
    else {
      currentField += char;
    }
  }

  // Handle last row
  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField);
    if (currentRow.length > 1 || (currentRow.length === 1 && currentRow[0].trim() !== "")) {
      rows.push(currentRow);
    }
  }

  if (rows.length === 0) return [];

  // 1. Obrada zaglavlja (Headers)
  // Trimamo i rješavamo duplikate
  const originalHeaders = rows[0].map(h => h ? h.trim() : "UNKNOWN");
  const headers = [];
  const headerCounts = {};

  originalHeaders.forEach(h => {
    if (headerCounts[h]) {
      headerCounts[h]++;
      headers.push(`${h}_${headerCounts[h]}`); // Npr. "Vrijednost_2"
    } else {
      headerCounts[h] = 1;
      headers.push(h);
    }
  });

  const data = [];

  // 2. Mapiranje podataka
  // Preskačemo prvi red (header)
  for (let i = 1; i < rows.length; i++) {
    const rowValues = rows[i];

    // Upozorenje za neslaganje broja stupaca (samo u console log, ne rušimo app)
    if (rowValues.length !== headers.length) {
      // Tihi log za debugiranje, da ne spamamo previše ako je cijeli file zbrkan
      if (i < 5) console.debug(`CSV Red ${i}: Broj stupaca (${rowValues.length}) ne odgovara zaglavlju (${headers.length}).`);
    }

    const rowObj = {};
    headers.forEach((header, index) => {
      // Ako polje ne postoji, stavi prazan string
      rowObj[header] = rowValues[index] ? rowValues[index].trim() : "";
    });
    data.push(rowObj);
  }

  return data;
}
