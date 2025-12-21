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
 * Filter listings by search query (case-insensitive match on make, model, trim, year)
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
 * @typedef {Object} Filters
 * @property {number | null} minPrice
 * @property {number | null} maxPrice
 * @property {number | null} minYear
 * @property {number | null} maxYear
 * @property {string | null} make
 */

/**
 * Apply price, year, and make filters to listings
 * @param {import('../types.js').Listing[]} listings
 * @param {Filters} filters
 * @returns {import('../types.js').Listing[]}
 */
export function applyFilters(listings, filters) {
  return listings.filter((listing) => {
    // Price range (inclusive)
    if (filters.minPrice != null && listing.price < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice != null && listing.price > filters.maxPrice) {
      return false;
    }

    // Year range (inclusive)
    if (filters.minYear != null && listing.year < filters.minYear) {
      return false;
    }
    if (filters.maxYear != null && listing.year > filters.maxYear) {
      return false;
    }

    // Make (exact, case-insensitive)
    if (filters.make && normalize(listing.make) !== normalize(filters.make)) {
      return false;
    }

    return true;
  });
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

/**
 * Extract unique makes from listings (sorted alphabetically)
 * @param {import('../types.js').Listing[]} listings
 * @returns {string[]}
 */
export function getUniqueMakes(listings) {
  const makes = [...new Set(listings.map((l) => l.make))];
  return makes.sort((a, b) => a.localeCompare(b));
}