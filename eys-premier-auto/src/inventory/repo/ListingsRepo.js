import { listings } from '../data/Listings.js';

/**
 * @returns {import('../types.js').Listing[]}
 */
export function getAllListings() {
  return listings;
}

/**
 * @param {string} id
 * @returns {import('../types.js').Listing | null}
 */
export function getListingById(id) {
  return listings.find((l) => l.id === id) || null;
}