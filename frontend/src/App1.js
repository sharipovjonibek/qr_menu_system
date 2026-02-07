import React, { useState, useEffect, useMemo } from "react";
import { BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";

const API_BASE_URL = "http://127.0.0.1:8000/api";

function TableSessionPage() {
  const { tableNumber } = useParams();
  const [customerName, setCustomerName] = useState("");
  const [token, setToken] = useState(localStorage.getItem(`table_token_${tableNumber}`));
  const [menuData, setMenuData] = useState({ customer_name: "", categories: [] });
  const [cart, setCart] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Initial Load
  useEffect(() => {
    const init = async () => {
      if (token) {
        await fetchMenu(token);
      } else {
        await checkActiveSession();
      }
      setLoading(false);
    };
    init();
  }, [tableNumber]);

  // Check if session exists
  const checkActiveSession = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/session/active/${tableNumber}`);
      if (response.ok) {
        const data = await response.json();
        if (data.active) {
          saveSession(data.session.token);
        }
      }
    } catch (err) {
      setError("Connection lost. Check your internet.");
    }
  };

  // Save Token & Refresh
  const saveSession = (newToken) => {
    setToken(newToken);
    localStorage.setItem(`table_token_${tableNumber}`, newToken);
    fetchMenu(newToken);
  };

  // Start New Session
  const startSession = async () => {
    if (!customerName.trim()) return setError("Please enter your name");
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/session/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table_number: tableNumber, customer_name: customerName })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to start");
      saveSession(data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Menu Data
  const fetchMenu = async (authToken) => {
    try {
      const response = await fetch(`${API_BASE_URL}/menu/`, {
        headers: { Authorization: `Token ${authToken}` }
      });
      if (response.ok) {
        const data = await response.json();
        setMenuData(data);
      } else {
        setToken(null);
        localStorage.removeItem(`table_token_${tableNumber}`);
      }
    } catch (err) {
      setError("Failed to load menu.");
    }
  };

  // Cart Logic
  const updateCart = (item, delta) => {
    setCart(prev => {
      const currentQty = prev[item.id]?.qty || 0;
      const newQty = Math.max(0, currentQty + delta);
      
      if (newQty === 0) {
        const { [item.id]: removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [item.id]: { ...item, qty: newQty } };
    });
  };

  // Filter Categories
  const filteredCategories = useMemo(() => {
    if (!selectedCategory) return menuData.categories;
    return menuData.categories.filter(c => c.id === selectedCategory);
  }, [selectedCategory, menuData]);

  const totalAmount = Object.values(cart).reduce((sum, item) => sum + (item.price * item.qty), 0);

  if (loading) return <div style={styles.loader}>🍽️ Opening Menu...</div>;

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.appContainer}>
        
        {/* HEADER */}
        <header style={styles.navbar}>
          <div>
            <h1 style={styles.brand}>Table {tableNumber}</h1>
            <p style={styles.welcomeText}>
               {token ? `Welcome back, ${menuData.customer_name}` : 'Welcome Guest'}
            </p>
          </div>
          {token && <div style={styles.statusDot} title="Session Active"></div>}
        </header>

        {!token ? (
          // LOGIN SCREEN
          <div style={styles.authContainer}>
            <div style={styles.authCard}>
              <div style={styles.iconCircle}>🍕</div>
              <h2 style={{ marginBottom: 10, color: '#333' }}>Ready to Feast?</h2>
              <p style={{ color: "#777", marginBottom: 25, lineHeight: '1.5' }}>
                Please enter your name to start ordering from the table.
              </p>
              
              {error && <div style={styles.errorMsg}>{error}</div>}
              
              <input
                type="text"
                placeholder="Your Name (e.g. John)"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                style={styles.mainInput}
              />
              <button onClick={startSession} style={styles.primaryBtn}>
                Start Ordering
              </button>
            </div>
          </div>
        ) : (
          // MENU SCREEN
          <>
            {/* CATEGORY NAV (Sticky) */}
            <div style={styles.catScrollWrapper}>
              <div style={styles.catScroll}>
                <button 
                  onClick={() => setSelectedCategory(null)} 
                  style={{...styles.catTag, backgroundColor: !selectedCategory ? '#FF4757' : '#fff', color: !selectedCategory ? '#fff' : '#333', borderColor: !selectedCategory ? '#FF4757' : '#eee'}}
                >
                  All
                </button>
                {menuData.categories.map(cat => (
                  <button 
                    key={cat.id} 
                    onClick={() => setSelectedCategory(cat.id)} 
                    style={{...styles.catTag, backgroundColor: selectedCategory === cat.id ? '#FF4757' : '#fff', color: selectedCategory === cat.id ? '#fff' : '#333', borderColor: selectedCategory === cat.id ? '#FF4757' : '#eee'}}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* MAIN MENU LIST */}
            <main style={styles.menuList}>
              {filteredCategories.map(category => (
                <div key={category.id} style={{ marginBottom: 30 }}>
                  <h3 style={styles.sectionTitle}>{category.name}</h3>
                  
                  <div style={styles.itemsColumn}>
                    {category.items.map(item => (
                      <div key={item.id} style={styles.foodCard}>
                        {/* Image Side */}
                        <div style={styles.imgWrapper}>
                          <img 
                            src={`http://127.0.0.1:8000${item.image}`} 
                            alt={item.name} 
                            style={styles.foodImg} 
                          />
                        </div>

                        {/* Content Side */}
                        <div style={styles.foodInfo}>
                          <div style={styles.foodHeader}>
                            <h4 style={styles.foodName}>{item.name}</h4>
                            <span style={styles.foodPrice}>
                              {parseFloat(item.price).toLocaleString()}
                            </span>
                          </div>
                          
                          {/* DESCRIPTION FIELD ADDED HERE */}
                          <p style={styles.foodDesc}>
                            {item.description || "No description available."}
                          </p>

                          {/* Action Area */}
                          <div style={styles.actionRow}>
                            {cart[item.id] ? (
                              <div style={styles.qtyControls}>
                                <button onClick={() => updateCart(item, -1)} style={styles.qtyBtn}>-</button>
                                <span style={styles.qtyValue}>{cart[item.id].qty}</span>
                                <button onClick={() => updateCart(item, 1)} style={styles.qtyBtn}>+</button>
                              </div>
                            ) : (
                              <button onClick={() => updateCart(item, 1)} style={styles.addBtn}>
                                Add to Cart
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </main>

            {/* FLOATING CART BAR */}
            {Object.keys(cart).length > 0 && (
              <div style={styles.floatingCartWrapper}>
                <div style={styles.floatingCart}>
                  <div style={styles.cartInfo}>
                    <div style={styles.cartCountCircle}>{Object.values(cart).reduce((a, b) => a + b.qty, 0)}</div>
                    <span style={styles.cartTotal}>Total: {totalAmount.toLocaleString()} sum</span>
                  </div>
                  <button style={styles.checkoutBtn}>
                    Checkout →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// STYLES
const styles = {
  // Page Layout (Centers content on desktop, Full width on mobile)
  pageWrapper: {
    minHeight: "100vh",
    backgroundColor: "#f0f2f5", // Light grey background outside the app
    display: "flex",
    justifyContent: "center",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  },
  appContainer: {
    width: "100%",
    maxWidth: "600px", // Limits width for phone-like feel on desktop
    backgroundColor: "#fff",
    minHeight: "100vh",
    position: "relative",
    boxShadow: "0 0 20px rgba(0,0,0,0.05)",
    paddingBottom: "100px", // Space for floating cart
  },
  
  // Header
  navbar: {
    padding: "20px 24px",
    background: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: 'sticky',
    top: 0,
    zIndex: 100,
    borderBottom: "1px solid #f0f0f0",
  },
  brand: { margin: 0, fontSize: '1.4rem', fontWeight: '800', color: '#1a1a1a' },
  welcomeText: { margin: "4px 0 0", fontSize: '0.9rem', color: '#888' },
  statusDot: { width: 10, height: 10, borderRadius: '50%', background: '#2ecc71', boxShadow: '0 0 0 4px rgba(46, 204, 113, 0.2)' },
  
  // Loader
  loader: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#666' },

  // Login / Auth
  authContainer: { padding: "40px 24px", display: "flex", flexDirection: "column", justifyContent: "center", height: "80vh" },
  authCard: { textAlign: 'center' },
  iconCircle: { width: 70, height: 70, background: '#fff0f1', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 20px', fontSize: '2rem' },
  mainInput: { width: '100%', padding: '16px', borderRadius: 12, border: '1px solid #ddd', marginBottom: 16, fontSize: '1rem', outline: 'none', background: '#f9f9f9', boxSizing: 'border-box' },
  primaryBtn: { width: '100%', padding: '16px', borderRadius: 12, border: 'none', background: '#FF4757', color: '#fff', fontSize: '1rem', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 12px rgba(255, 71, 87, 0.3)' },
  errorMsg: { color: '#e74c3c', marginBottom: 15, fontSize: '0.9rem', background: '#fdecea', padding: '10px', borderRadius: '8px' },

  // Categories
  catScrollWrapper: { position: 'sticky', top: 73, background: '#fff', zIndex: 90, padding: '10px 0', borderBottom: '1px solid #f5f5f5' },
  catScroll: { display: 'flex', gap: 10, overflowX: 'auto', padding: '0 24px', scrollbarWidth: 'none', whiteSpace: 'nowrap' },
  catTag: { padding: '8px 20px', borderRadius: 50, border: '1px solid', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s ease' },

  // Menu List
  menuList: { padding: '10px 24px' },
  sectionTitle: { fontSize: '1.25rem', margin: '25px 0 15px', color: '#2d3436', fontWeight: '800' },
  itemsColumn: { display: 'flex', flexDirection: 'column', gap: 20 },
  
  // Food Card (Horizontal Layout)
  foodCard: { display: 'flex', flexDirection: 'row', background: '#fff', borderRadius: 16, border: '1px solid #f0f0f0', overflow: 'hidden', height: '140px' },
  imgWrapper: { width: '130px', flexShrink: 0, position: 'relative' },
  foodImg: { width: '100%', height: '100%', objectFit: 'cover' },
  
  // Food Info
  foodInfo: { flex: 1, padding: '12px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
  foodHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  foodName: { margin: 0, fontSize: '1rem', fontWeight: '700', color: '#2d3436', lineHeight: '1.3' },
  foodPrice: { fontSize: '0.95rem', fontWeight: '700', color: '#FF4757', whiteSpace: 'nowrap', marginLeft: 10 },
  
  // Description Styling (Truncated)
  foodDesc: { 
    fontSize: '0.8rem', 
    color: '#888', 
    margin: '0 0 10px 0', 
    lineHeight: '1.4',
    // Line Clamping Logic
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },

  // Actions
  actionRow: { display: 'flex', justifyContent: 'flex-end', alignItems: 'center' },
  addBtn: { padding: '8px 16px', borderRadius: 8, background: '#f1f2f6', color: '#2d3436', border: 'none', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' },
  
  // Qty Controls
  qtyControls: { display: 'flex', alignItems: 'center', background: '#FF4757', borderRadius: 8, padding: '4px 8px', color: '#fff' },
  qtyBtn: { width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer', padding: 0 },
  qtyValue: { margin: '0 10px', fontWeight: '600', fontSize: '0.9rem' },

  // Floating Cart
  floatingCartWrapper: { position: 'fixed', bottom: 0, left: 0, width: '100%', display: 'flex', justifyContent: 'center', pointerEvents: 'none', paddingBottom: 30, zIndex: 200 },
  floatingCart: { pointerEvents: 'auto', width: '90%', maxWidth: '560px', background: '#2d3436', borderRadius: 16, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' },
  cartInfo: { display: 'flex', alignItems: 'center', gap: 12 },
  cartCountCircle: { background: '#FF4757', width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold' },
  cartTotal: { fontWeight: '600', fontSize: '1rem' },
  checkoutBtn: { background: '#fff', color: '#2d3436', border: 'none', padding: '10px 20px', borderRadius: 10, fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer' }
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/table/:tableNumber" element={<TableSessionPage />} />
      </Routes>
    </Router>
  );
}