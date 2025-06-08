// Utility za konverziju valuta u EUR koristeći exchangerate.host
// Dodaj u .env.local: CURRENCY_CHANGER=OVDJE_STAVI_SVOJ_KLJUC

const ACCESS_KEY = process.env.CURRENCY_CHANGER;

/**
 * Konvertuje iznos iz bilo koje valute u EUR koristeći exchangerate.host API.
 * @param {number|string} amount - Iznos koji treba konvertovati
 * @param {string} fromCurrency - Valuta iz koje se konvertuje (npr. "USD", "BAM", "RSD", "EUR")
 * @returns {Promise<number>} - Iznos u EUR
 */
export async function convertToEUR(amount, fromCurrency) {
  if (!amount || !fromCurrency) return null;
  if (fromCurrency === "EUR") return Number(amount);
  let url;
  if (ACCESS_KEY) {
    url = `https://api.exchangerate.host/convert?access_key=${ACCESS_KEY}&from=${fromCurrency}&to=EUR&amount=${amount}`;
  } else {
    url = `https://api.exchangerate.host/convert?from=${fromCurrency}&to=EUR&amount=${amount}`;
  }
  const res = await fetch(url);
  const data = await res.json();
  if (typeof data.result === "number") {
    return data.result;
  }
  throw new Error(
    "Currency conversion failed: " + (data.error?.info || JSON.stringify(data))
  );
}

/**
 * Konvertuje iznos iz EUR u zadanu valutu koristeći exchangerate.host API.
 * @param {number|string} amount - Iznos u EUR koji treba konvertovati
 * @param {string} toCurrency - Valuta u koju se konvertuje (npr. "USD", "BAM", "RSD", "EUR")
 * @returns {Promise<number>} - Iznos u zadanoj valuti
 */
export async function convertFromEUR(amount, toCurrency) {
  if (!amount || !toCurrency) return null;
  if (toCurrency === "EUR") return Number(amount);
  let url;
  if (ACCESS_KEY) {
    url = `https://api.exchangerate.host/convert?access_key=${ACCESS_KEY}&from=EUR&to=${toCurrency}&amount=${amount}`;
  } else {
    url = `https://api.exchangerate.host/convert?from=EUR&to=${toCurrency}&amount=${amount}`;
  }
  const res = await fetch(url);
  const data = await res.json();
  if (typeof data.result === "number") {
    return data.result;
  }
  throw new Error(
    "Currency conversion failed: " + (data.error?.info || JSON.stringify(data))
  );
}
