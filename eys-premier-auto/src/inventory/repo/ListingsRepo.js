import { listings as seedListings } from '../data/Listings.js';

const STORAGE_KEY = 'eys_listings_v1';

/**
 * Load all listings from localStorage or seed from mock data
 * @returns {import('../types.js').Listing[]}
 */
function loadAll() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn('Failed to load listings from localStorage:', e);
  }
  // Seed from mock data and persist
  saveAll(seedListings);
  return seedListings;
}

/**
 * Save all listings to localStorage
 * @param {import('../types.js').Listing[]} list
 */
function saveAll(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn('Failed to save listings to localStorage:', e);
  }
}

/**
 * Generate a unique ID
 * @returns {string}
 */
function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

/**
 * Get all listings
 * @returns {import('../types.js').Listing[]}
 */
export function getAllListings() {
  return loadAll();
}

/**
 * Get a single listing by ID
 * @param {string} id
 * @returns {import('../types.js').Listing | null}
 */
export function getListingById(id) {
  const all = loadAll();
  return all.find((l) => l.id === id) || null;
}

/**
 * Create a new listing
 * @param {Omit<import('../types.js').Listing, 'id'>} payload
 * @returns {import('../types.js').Listing}
 */
export function createListing(payload) {
  const all = loadAll();
  const newListing = { ...payload, id: generateId() };
  all.unshift(newListing); // Add to beginning
  saveAll(all);
  return newListing;
}

/**
 * Update an existing listing
 * @param {string} id
 * @param {Partial<import('../types.js').Listing>} payload
 * @returns {import('../types.js').Listing | null}
 */
export function updateListing(id, payload) {
  const all = loadAll();
  const index = all.findIndex((l) => l.id === id);
  if (index === -1) return null;
  
  const updated = { ...all[index], ...payload, id }; // Preserve ID
  all[index] = updated;
  saveAll(all);
  return updated;
}

/**
 * Delete a listing
 * @param {string} id
 * @returns {boolean}
 */
export function deleteListing(id) {
  const all = loadAll();
  const filtered = all.filter((l) => l.id !== id);
  if (filtered.length === all.length) return false;
  saveAll(filtered);
  return true;
}