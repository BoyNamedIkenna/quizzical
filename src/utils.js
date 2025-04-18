
/**
 * Decodes HTML entities in a string (e.g. &quot; to ")
 * @param {string} str - Encoded HTML string
 * @returns {string} - Decoded string
 */
export function decodeHtmlEntity(str) {
    const doc = new DOMParser().parseFromString(str, "text/html");
    return doc.documentElement.textContent || "";
  }
  
  /**
   * Shuffles an array using the Fisher-Yates (Knuth) shuffle algorithm
   * @param {Array} array - The array to shuffle
   * @returns {Array} - A new shuffled array
   */
  export function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }
  