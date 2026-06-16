import { useState, useEffect } from 'react';
import './App.css';
import { backupOrders } from './backupData';

function App() {
  // State variables to manage orders, loading status, and error messages
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect hook to fetch orders from the mock API when the component mounts
  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch('https://my.api.mockaroo.com/orders.json?key=e49e6840');
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }

        const data = await response.json();

        // Mockaroo API returns a JSON object with an "error" property when the request limit is exceeded.
        // If this is detected, throw an error to trigger catch block and use the backup data instead.
        if (data && data.error) {
          throw new Error(`Mockaroo API Limit: ${data.error}`);
        }
        setOrders(data);
      } catch (err) {
        // // If the API call fails for any reason (network error, API limit, etc.), we log the error and fall back to local backup data.
        console.warn("External API-error. Activating local failover-data:", err.message);
        setOrders(backupOrders);
        
        // Set a user-friendly error message to inform about the fallback 
        setError("Live data unavailable. Showing local backup data.");
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);


  // Helper to make status text look pretty (e.g., "ready-for-pickup" -> "Ready For Pickup")
  function formatStatus(status) {
    if (!status) {
      return 'Unknown';
    }
    return status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  // Helper to clean up ISO strings into readable dates (e.g., "2024-06-01T14:30:00Z" -> "Jun 1, 2024, 2:30 PM")
  function formatDate(isoString) {
    if (!isoString) {
      return 'N/A';
    }
    
    return new Date(isoString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="status-message">Loading packages...</div>;
  }

  // if (error) {
  //   return <div className="status-message error">Error: {error}</div>;
  // }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>The Yellow Corporation Package Tracker</h1>
      </header>

      {error && (
        <div className="warning-banner">
          {error}
        </div>
      )}

      <main className="tracking-section">
        <h2>Tracking Information</h2>
        <div className="tracking-grid">
        {/* Map over orders and display each parcel's details in a card format */}
        {orders.map((order) => (
          <div key={order.parcel_id} className="parcel-card">
            <div className="card-header">
              <h3>Parcel #{order.parcel_id}</h3>
              <span className={`status-badge ${order.status}`}>
                {formatStatus(order.status)}
              </span>
            </div>

            <div className="card-body">
              <p><strong>Sender:</strong> {order.sender}</p>
              <p><strong>ETA:</strong> {formatDate(order.eta)}</p>
              <p><strong>Location:</strong> {order.location_name}</p>
              <p><strong>Last updated:</strong> {formatDate(order.last_updated)}</p>

              {order.location_status_ok === false && (
                <div className="alert-badge location-warning">
                  Location issue reported
                </div>
              )}
              {/* Display ID verification badge if required */}
              {order.verification_required && (
                <div className="alert-badge">ID Verification Required</div>
              )}

              {/* Display notes if they exist */}
              {order.notes && (
                <p className="card-notes"><em>Notes: {order.notes}</em></p>
              )}
            </div>
          </div>
        ))}
        </div>
      </main>
    </div>
  );
}

export default App;