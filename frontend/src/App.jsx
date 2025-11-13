import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from './context/AuthContext';

// Import components
import ArticleList from './components/ArticleList';
import CreateArticle from './components/CreateArticle';
import EditArticle from './components/EditArticle';
import ViewArticle from './components/ViewArticle';
import Login from './components/Login';
import Signup from './components/Signup';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Page Layout with Animation
const PageLayout = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

// Navigation Component
const Navigation = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    // Navigate to login page after logout
    navigate('/login');
  };

  const toggleDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDropdownOpen(!dropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [dropdownOpen]);

  return (
    <motion.nav
      className="navbar navbar-expand-lg navbar-light"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Link to="/" className="navbar-brand">
        <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>📝</span>
        <span className="gradient-text" style={{ fontWeight: '700' }}>Blog App</span>
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        style={{ borderColor: 'rgba(255,255,255,0.5)' }}
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto">
          {isAuthenticated ? (
            <>
              <li className="nav-item">
                <Link
                  to="/"
                  className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                  style={{
                    fontWeight: location.pathname === '/' ? '600' : '400',
                    color: location.pathname === '/' ? 'var(--accent)' : 'white'
                  }}
                >
                  Articles
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/create"
                  className={`nav-link ${location.pathname === '/create' ? 'active' : ''}`}
                  style={{
                    fontWeight: location.pathname === '/create' ? '600' : '400',
                    color: location.pathname === '/create' ? 'var(--accent)' : 'white'
                  }}
                >
                  Create Article
                </Link>
              </li>
              <li className="nav-item dropdown" ref={dropdownRef}>
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  onClick={toggleDropdown}
                  aria-expanded={dropdownOpen}
                  style={{ 
                    color: 'white',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}
                >
                  {user?.username || 'User'}
                </a>
                <ul 
                  className={`dropdown-menu dropdown-menu-end ${dropdownOpen ? 'show' : ''}`}
                  aria-labelledby="navbarDropdown"
                  style={{
                    display: dropdownOpen ? 'block' : 'none',
                    position: 'absolute',
                    right: 0,
                    top: '100%',
                    marginTop: '0.5rem'
                  }}
                >
                  <li>
                    <span className="dropdown-item-text">
                      <small>Signed in as</small><br />
                      <strong>{user?.email}</strong>
                    </span>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button 
                      className="dropdown-item" 
                      onClick={handleLogout}
                      style={{ cursor: 'pointer', width: '100%', textAlign: 'left', border: 'none', background: 'transparent', padding: '0.5rem 1rem' }}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link
                  to="/login"
                  className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
                  style={{
                    fontWeight: location.pathname === '/login' ? '600' : '400',
                    color: location.pathname === '/login' ? 'var(--accent)' : 'white'
                  }}
                >
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/signup"
                  className={`nav-link ${location.pathname === '/signup' ? 'active' : ''}`}
                  style={{
                    fontWeight: location.pathname === '/signup' ? '600' : '400',
                    color: location.pathname === '/signup' ? 'var(--accent)' : 'white'
                  }}
                >
                  Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </motion.nav>
  );
};

// App Routes Component
function AppRoutes() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route
          path="/login"
          element={
            <PageLayout>
              <Login />
            </PageLayout>
          }
        />
        <Route
          path="/signup"
          element={
            <PageLayout>
              <Signup />
            </PageLayout>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <PageLayout>
                <ArticleList />
              </PageLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <PageLayout>
                <CreateArticle />
              </PageLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit/:id"
          element={
            <ProtectedRoute>
              <PageLayout>
                <EditArticle />
              </PageLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/view/:id"
          element={
            <ProtectedRoute>
              <PageLayout>
                <ViewArticle />
              </PageLayout>
            </ProtectedRoute>
          }
          />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

// App Content Component (with Navigation logic)
function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <>
      {!isAuthPage && <Navigation />}
      <AppRoutes />
    </>
  );
}

// Main App Component
function App() {
  return (
    <Router>
      <div className="container">
        <AppContent />
      </div>
    </Router>
  );
}

export default App;
