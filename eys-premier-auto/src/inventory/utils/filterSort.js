/**
 * Normalize text for search comparison
 * @param {string} str
 * @returns {string}
 */
function normalize(str) {
    return (str || '').toLowerCase().trim();
  }
  
  /**
   * Build searchable text from a listing
   * @param {import('../types.js').Listing} listing
   * @returns {string}
   */
  function getSearchableText(listing) {
    return normalize(
      `${listing.year} ${listing.make} ${listing.model} ${listing.trim || ''}`
    );
  }
  
  /**
   * Filter listings by search query (case insensitive match on make, model, trim, year)
   * @param {import('../types.js').Listing[]} listings
   * @param {string} query
   * @returns {import('../types.js').Listing[]}
   */
  export function applySearch(listings, query) {
    const q = normalize(query);
    if (!q) return listings;
    return listings.filter((listing) => getSearchableText(listing).includes(q));
  }
  
  /**
   * Sort listings by the given key
   * @param {import('../types.js').Listing[]} listings
   * @param {'newest' | 'price-asc' | 'price-desc'} sortKey
   * @returns {import('../types.js').Listing[]}
   */
  export function applySort(listings, sortKey) {
    const sorted = [...listings];
    switch (sortKey) {
      case 'newest':
        return sorted.sort((a, b) => b.year - a.year);
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      default:
        return sorted;
    }
  }