import { useState } from 'react';
import { getAllListings } from '../repo/ListingsRepo.js';
import { applySearch, applySort } from '../utils/filtersort.js';
import ListingCard from '../components/ListingCard.jsx';
import InventoryLayout from '../components/InventoryLayout.jsx';

export default function InventoryPage() {
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState('newest');

  const allListings = getAllListings();
  const searched = applySearch(allListings, query);
  const finalList = applySort(searched, sortKey);

  const handleClear = () => {
    setQuery('');
    setSortKey('newest');
  };

  return (
    <InventoryLayout>
      <div className="inv-header">
        <h1 className="inv-title">Inventory</h1>
        <p className="inv-count">
          Showing {finalList.length} of {allListings.length} vehicles
        </p>
      </div>

      <div className="inv-tools">
        <div className="inv-search">
          <label htmlFor="inv-search-input" className="visually-hidden">
            Search inventory
          </label>
          <input
            type="text"
            id="inv-search-input"
            className="inv-search-input"
            placeholder="Search make or model…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="inv-sort">
          <label htmlFor="inv-sort-select" className="visually-hidden">
            Sort by
          </label>
          <select
            id="inv-sort-select"
            className="inv-sort-select"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low–High</option>
            <option value="price-desc">Price: High–Low</option>
          </select>
        </div>
      </div>

      {finalList.length > 0 ? (
        <div className="inv-grid">
          {finalList.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="inv-empty">
          <p className="inv-empty-text">No vehicles match your search.</p>
          <button type="button" className="inv-clear-btn" onClick={handleClear}>
            Clear filters
          </button>
        </div>
      )}
    </InventoryLayout>
  );
}