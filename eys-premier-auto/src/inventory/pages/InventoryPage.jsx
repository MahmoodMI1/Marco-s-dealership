import { getAllListings } from '../repo/ListingsRepo.js';
import ListingCard from '../components/ListingCard.jsx';
import InventoryLayout from '../components/InventoryLayout.jsx';

export default function InventoryPage() {
  const listings = getAllListings();

  return (
    <InventoryLayout>
      <div className="inv-header">
        <h1 className="inv-title">Inventory</h1>
        <p className="inv-count">{listings.length} vehicles</p>
      </div>

      <div className="inv-tools">
        <div className="inv-search">
          <label htmlFor="inv-search-input" className="visually-hidden">Search inventory</label>
          <input
            type="text"
            id="inv-search-input"
            className="inv-search-input"
            placeholder="Search make or model…"
          />
        </div>
        <div className="inv-sort">
          <label htmlFor="inv-sort-select" className="visually-hidden">Sort by</label>
          <select id="inv-sort-select" className="inv-sort-select">
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low–High</option>
            <option value="price-desc">Price: High–Low</option>
          </select>
        </div>
      </div>

      <div className="inv-grid">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </InventoryLayout>
  );
}