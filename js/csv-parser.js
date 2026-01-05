/**
 * Jednostavan CSV parser koji podržava polja pod navodnicima (quoted fields)
 * i nove retke unutar navodnika.
 * Pretpostavlja zarez kao separator.
 */
function parseCSV(text) {
  const rows = [];
  let currentRow = [];
  let currentField = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      // Handle escaped quotes (double quotes)
      if (inQuotes && nextChar === '"') {
        currentField += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      currentRow.push(currentField);
      currentField = "";
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      // End of row (handle both \n and \r\n)
      if (char === '\r' && nextChar === '\n') {
        i++; // Skip the \n in \r\n
      }

      // Only add row if we have content
      if (currentField || currentRow.length > 0) {
        currentRow.push(currentField);

        // Skip empty rows
        if (currentRow.some(field => field.trim() !== "")) {
          rows.push(currentRow);
        }

        currentRow = [];
        currentField = "";
      }
    } else {
      // Regular character
      currentField += char;
    }
  }

  // Add last field and row if exists
  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField);
    if (currentRow.some(field => field.trim() !== "")) {
      rows.push(currentRow);
    }
  }

  // Convert rows array to objects using first row as headers
  if (rows.length === 0) return [];

  const headers = rows[0].map(h => h.trim());
  const data = [];

  for (let i = 1; i < rows.length; i++) {
    const row = {};
    headers.forEach((header, index) => {
      row[header] = rows[i][index] ? rows[i][index].trim() : "";
    });
    data.push(row);
  }

  return data;
}
