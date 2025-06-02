// Utility za konverziju valuta u EUR koristeći exchangerate.host
// Dodaj u .env.local: EXCHANGERATE_API_KEY=OVDJE_STAVI_SVOJ_KLJUC

const ACCESS_KEY = "ccb481da2626e4ea9a262f7ffbfe1d25";

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
