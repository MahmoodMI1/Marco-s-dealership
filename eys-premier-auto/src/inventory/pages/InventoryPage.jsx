import { useState, useMemo } from 'react';
import { getAllListings } from '../repo/ListingsRepo.js';
import { applySearch, applyFilters, applySort, getUniqueMakes } from '../utils/filterSort.js';
import ListingCard from '../components/ListingCard.jsx';
import InventoryLayout from '../components/InventoryLayout.jsx';

const defaultFilters = {
  minPrice: null,
  maxPrice: null,
  minYear: null,
  maxYear: null,
  make: null,
};

export default function InventoryPage() {
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState('newest');
  const [filters, setFilters] = useState(defaultFilters);

  const allListings = getAllListings();
  const uniqueMakes = useMemo(() => getUniqueMakes(allListings), [allListings]);

  // Pipeline: search → filter → sort
  const searched = applySearch(allListings, query);
  const filtered = applyFilters(searched, filters);
  const finalList = applySort(filtered, sortKey);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleNumberChange = (key, rawValue) => {
    const parsed = rawValue === '' ? null : Number(rawValue);
    handleFilterChange(key, parsed);
  };

  const handleClearAll = () => {
    setQuery('');
    setSortKey('newest');
    setFilters(defaultFilters);
  };

  const hasActiveFilters =
    query ||
    sortKey !== 'newest' ||
    filters.minPrice != null ||
    filters.maxPrice != null ||
    filters.minYear != null ||
    filters.maxYear != null ||
    filters.make;

  return (
    <InventoryLayout>
      <div className="inv-header">
        <h1 className="inv-title">Inventory</h1>
        <p className="inv-count">
          Showing {finalList.length} of {allListings.length} vehicles
        </p>
      </div>

      {/* Search + Sort Row */}
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

      {/* Filters Row */}
      <div className="inv-filters">
        <div className="inv-filter-group">
          <label htmlFor="filter-make" className="inv-filter-label">Make</label>
          <select
            id="filter-make"
            className="inv-filter-select"
            value={filters.make || ''}
            onChange={(e) => handleFilterChange('make', e.target.value || null)}
          >
            <option value="">All Makes</option>
            {uniqueMakes.map((make) => (
              <option key={make} value={make}>{make}</option>
            ))}
          </select>
        </div>

        <div className="inv-filter-group">
          <label htmlFor="filter-min-price" className="inv-filter-label">Min Price</label>
          <input
            type="number"
            id="filter-min-price"
            className="inv-filter-input"
            placeholder="$0"
            value={filters.minPrice ?? ''}
            onChange={(e) => handleNumberChange('minPrice', e.target.value)}
          />
        </div>

        <div className="inv-filter-group">
          <label htmlFor="filter-max-price" className="inv-filter-label">Max Price</label>
          <input
            type="number"
            id="filter-max-price"
            className="inv-filter-input"
            placeholder="Any"
            value={filters.maxPrice ?? ''}
            onChange={(e) => handleNumberChange('maxPrice', e.target.value)}
          />
        </div>

        <div className="inv-filter-group">
          <label htmlFor="filter-min-year" className="inv-filter-label">Min Year</label>
          <input
            type="number"
            id="filter-min-year"
            className="inv-filter-input"
            placeholder="2000"
            value={filters.minYear ?? ''}
            onChange={(e) => handleNumberChange('minYear', e.target.value)}
          />
        </div>

        <div className="inv-filter-group">
          <label htmlFor="filter-max-year" className="inv-filter-label">Max Year</label>
          <input
            type="number"
            id="filter-max-year"
            className="inv-filter-input"
            placeholder="Any"
            value={filters.maxYear ?? ''}
            onChange={(e) => handleNumberChange('maxYear', e.target.value)}
          />
        </div>

        {hasActiveFilters && (
          <button type="button" className="inv-clear-btn" onClick={handleClearAll}>
            Clear all
          </button>
        )}
      </div>

      {/* Results */}
      {finalList.length > 0 ? (
        <div className="inv-grid">
          {finalList.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="inv-empty">
          <p className="inv-empty-text">No vehicles match your criteria.</p>
          <button type="button" className="inv-clear-btn" onClick={handleClearAll}>
            Clear all filters
          </button>
        </div>
      )}
    </InventoryLayout>
  );
}