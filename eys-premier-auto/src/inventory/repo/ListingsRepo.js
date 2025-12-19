import { listings } from '../data/listings.js';

export function getAllListings() {
  return listings;
}

export function getListingById(id) {
  return listings.find((l) => l.id === id) || null;
}