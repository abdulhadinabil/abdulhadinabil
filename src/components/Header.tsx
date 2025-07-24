import React, { useState, useEffect } from 'react';
import { Menu, X, User, LogIn, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AdminLogin from './AdminLogin';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass shadow-2xl py-3' : 'glass-purple py-5'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link 
          to="/" 
         className="flex items-center space-x-3 gradient-text-blue hover:scale-105 transition-all duration-300"
          onClick={closeMenu}
        >
          <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
            <User size={24} className="text-white" />
          </div>
          <span className="font-bold text-xl">Abdul Hadi Nabil</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className={`relative px-4 py-2 rounded-xl transition-all duration-300 font-medium ${
              isActive('/') 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            Home
          </Link>
          <Link 
            to="/about" 
            className={`relative px-4 py-2 rounded-xl transition-all duration-300 font-medium ${
              isActive('/about') 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            About
          </Link>
          <Link 
            to="/projects" 
            className={`relative px-4 py-2 rounded-xl transition-all duration-300 font-medium ${
              isActive('/projects') 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            Projects
          </Link>
          <Link 
            to="/photography" 
            className={`relative px-4 py-2 rounded-xl transition-all duration-300 font-medium ${
              isActive('/photography') 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            Photography
          </Link>
          <Link 
            to="/blog" 
            className={`relative px-4 py-2 rounded-xl transition-all duration-300 font-medium ${
              isActive('/blog') 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            Blog
          </Link>
          <Link 
            to="/contact" 
            className={`relative px-4 py-2 rounded-xl transition-all duration-300 font-medium ${
              isActive('/contact') 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            Contact
          </Link>
          
          {/* Admin Login/Logout */}
          {isAuthenticated ? (
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover-lift font-medium"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="btn-gradient flex items-center space-x-2 px-4 py-2 text-white rounded-xl hover-lift font-medium"
            >
              <LogIn size={16} />
              <span>Admin</span>
            </button>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden glass absolute top-full left-0 right-0 shadow-2xl border-t border-blue-100 animate-fadeInUp">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link 
              to="/" 
              className={`py-3 px-4 rounded-xl transition-all duration-300 font-medium ${
                isActive('/') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
              onClick={closeMenu}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className={`py-3 px-4 rounded-xl transition-all duration-300 font-medium ${
                isActive('/about') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
              onClick={closeMenu}
            >
              About
            </Link>
            <Link 
              to="/projects" 
              className={`py-3 px-4 rounded-xl transition-all duration-300 font-medium ${
                isActive('/projects') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
              onClick={closeMenu}
            >
              Projects
            </Link>
            <Link 
              to="/photography" 
              className={`py-3 px-4 rounded-xl transition-all duration-300 font-medium ${
                isActive('/photography') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
              onClick={closeMenu}
            >
              Photography
            </Link>
            <Link 
              to="/blog" 
              className={`py-3 px-4 rounded-xl transition-all duration-300 font-medium ${
                isActive('/blog') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
              onClick={closeMenu}
            >
              Blog
            </Link>
            <Link 
              to="/contact" 
              className={`py-3 px-4 rounded-xl transition-all duration-300 font-medium ${
                isActive('/contact') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
              onClick={closeMenu}
            >
              Contact
            </Link>
            
            {/* Mobile Admin Login/Logout */}
            {isAuthenticated ? (
                <button
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                  className="flex items-center space-x-2 py-3 px-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setShowLoginModal(true);
                    closeMenu();
                  }}
                  className="btn-gradient flex items-center space-x-2 py-3 px-4 text-white rounded-xl font-medium"
                >
                  <LogIn size={16} />
                  <span>Admin Login</span>
                </button>
              )}
          </div>
        </div>
      )}
      
      {/* Admin Login Modal */}
      {showLoginModal && (
        <AdminLogin onClose={() => setShowLoginModal(false)} />
      )}
    </header>
  );
};

export default Header;