import React, { useState, useEffect, useRef } from 'react';
import { Theme } from '../types';
import { THEME_CONFIGS } from '../constants';
import { Zap, Layout, Upload, User, Menu, X, Bell, ChevronDown, ExternalLink, Palette, ArrowLeft } from 'lucide-react';
import MegaDropdown from './MegaDropdown';

interface Props {
  theme: Theme;
  onNewUpload?: () => void;
  onNavigate: (page: 'landing' | 'dashboard' | 'about' | 'blog' | 'docs' | 'careers') => void;
  onToggleTheme?: () => void;
}

const Navbar: React.FC<Props> = ({ theme, onNewUpload, onNavigate, onToggleTheme }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showMobileMega, setShowMobileMega] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  
  const headerRef = useRef<HTMLElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const prevIsMobileMenuOpen = useRef(isMobileMenuOpen);
  const timeoutRef = useRef<any>(null);

  const isLight = theme === Theme.MINIMAL_LIGHT;
  
  // Navbar Visuals
  const navBackground = isLight 
    ? (isScrolled ? 'bg-white/95 shadow-md border-b border-gray-200' : 'bg-white/60 backdrop-blur-md') 
    : (isScrolled ? 'bg-[#0f172a]/95 shadow-lg border-b border-white/10' : 'bg-[#0f172a]/40 backdrop-blur-md');

  const textColor = isLight ? 'text-gray-900' : 'text-white';
  const navLinkColor = isLight ? 'text-gray-600 hover:text-blue-600' : 'text-gray-300 hover:text-white';
  
  // Dynamic Height Calculation
  useEffect(() => {
    const updateNavHeight = () => {
      if (headerRef.current) {
        const height = headerRef.current.offsetHeight;
        document.documentElement.style.setProperty('--nav-height', `${height}px`);
      }
    };

    updateNavHeight();
    window.addEventListener('resize', updateNavHeight);
    
    const observer = new ResizeObserver(updateNavHeight);
    if (headerRef.current) observer.observe(headerRef.current);

    return () => {
      window.removeEventListener('resize', updateNavHeight);
      observer.disconnect();
    };
  }, []);

  // Scroll Detection for Opacity
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Accessibility & Focus Management for Mobile Menu
  useEffect(() => {
    if (isMobileMenuOpen) {
      // Prevent background scrolling
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsMobileMenuOpen(false);
          return;
        }

        if (e.key === 'Tab' && mobileMenuRef.current) {
          const focusable = mobileMenuRef.current.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), textarea, input, select'
          );
          if (focusable.length === 0) return;

          const first = focusable[0];
          const last = focusable[focusable.length - 1];

          if (e.shiftKey) {
            if (document.activeElement === first) {
              e.preventDefault();
              last.focus();
            }
          } else {
            if (document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);

      // Set initial focus to first element or container
      const timer = setTimeout(() => {
        const focusable = mobileMenuRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select'
        );
        if (focusable && focusable.length > 0) {
          focusable[0].focus();
        } else {
          mobileMenuRef.current?.focus();
        }
      }, 50);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
        clearTimeout(timer);
      };
    } else if (prevIsMobileMenuOpen.current) {
      // Return focus to toggle button when closed
      menuBtnRef.current?.focus();
    }
    prevIsMobileMenuOpen.current = isMobileMenuOpen;
  }, [isMobileMenuOpen]);

  const handleNavClick = (e: React.MouseEvent, page: 'landing' | 'dashboard' | 'about' | 'blog' | 'docs' | 'careers') => {
    e.preventDefault();
    onNavigate(page);
    setIsMobileMenuOpen(false);
    setShowMobileMega(false);
    window.scrollTo(0, 0); 
  };

  const handleMegaEnter = () => {
    if (window.innerWidth >= 1024) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setIsMegaMenuOpen(true);
    }
  };

  const handleMegaLeave = () => {
    if (window.innerWidth >= 1024) {
      timeoutRef.current = setTimeout(() => {
        setIsMegaMenuOpen(false);
      }, 150);
    }
  };

  const NavLink = ({ label, target }: { label: string, target?: 'landing' | 'dashboard' | 'about' | 'blog' | 'docs' | 'careers' }) => (
    <a 
      href="#" 
      onClick={(e) => target ? handleNavClick(e, target) : e.preventDefault()}
      className={`relative group text-sm font-medium transition-colors py-2 ${navLinkColor}`}
    >
      {label}
      <span className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${isLight ? 'bg-blue-600' : 'bg-cyan-400'}`}></span>
    </a>
  );

  return (
    <>
      <header 
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-[500] transition-all duration-300 ${navBackground} ${isScrolled ? 'py-3' : 'py-5'}`}
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-6 relative flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2 group cursor-pointer z-50" onClick={(e) => handleNavClick(e, 'landing')}>
            <div className={`relative w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-lg ${isLight ? 'bg-blue-600 text-white shadow-blue-200' : 'bg-gradient-to-tr from-cyan-400 to-blue-600 text-white shadow-cyan-900/20'}`}>
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <span className={`font-display font-bold text-xl tracking-tight ${textColor}`}>
              InsightX
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 h-full" role="navigation" aria-label="Main Navigation">
            <NavLink label="Features" target="landing" />
            
            {/* Mega Menu Trigger */}
            <div 
              className="relative h-full flex items-center"
              onMouseEnter={handleMegaEnter}
              onMouseLeave={handleMegaLeave}
              onFocus={handleMegaEnter}
              onBlur={handleMegaLeave}
            >
              <button 
                className={`flex items-center gap-1 text-sm font-medium transition-colors group py-2 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-md px-1 ${navLinkColor} ${isMegaMenuOpen ? (isLight ? 'text-blue-600' : 'text-white') : ''}`}
                aria-expanded={isMegaMenuOpen}
                aria-haspopup="true"
                aria-controls="mega-menu-dropdown"
              >
                Use Cases <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isMegaMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Mega Dropdown Component */}
              <div 
                id="mega-menu-dropdown"
                className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 w-screen max-w-screen-xl transition-all duration-200 ${isMegaMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}
              >
                 <MegaDropdown 
                   isOpen={isMegaMenuOpen} 
                   theme={theme} 
                   onMouseEnter={handleMegaEnter} 
                   onMouseLeave={handleMegaLeave} 
                 />
              </div>
            </div>

            <NavLink label="Pricing" target="landing" />
            <NavLink label="About Us" target="about" />
            <NavLink label="Blog" target="blog" />
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-4">
             {/* Action Buttons */}
             <div className="flex items-center gap-3">
                {onToggleTheme && (
                  <button onClick={onToggleTheme} className={`p-2 rounded-full transition-colors ${isLight ? 'hover:bg-gray-100 text-gray-600' : 'hover:bg-white/10 text-gray-400 hover:text-white'}`} aria-label="Toggle Theme">
                    <Palette className="w-5 h-5" />
                  </button>
                )}
                {onNewUpload && (
                   <button 
                     onClick={onNewUpload}
                     className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white transition-all transform hover:scale-105 active:scale-95 shadow-lg ${isLight ? 'bg-gray-900 hover:bg-black' : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-cyan-500/25'}`}
                   >
                     <Upload className="w-4 h-4" />
                     <span>Upload</span>
                   </button>
                )}
             </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            ref={menuBtnRef}
            className={`lg:hidden p-2 rounded-lg z-50 transition-colors ${isLight ? 'hover:bg-gray-100 text-gray-900' : 'hover:bg-white/10 text-white'}`}
            onClick={() => { setIsMobileMenuOpen(!isMobileMenuOpen); setShowMobileMega(false); }}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay (Sheet) */}
      {isMobileMenuOpen && (
        <div 
          ref={mobileMenuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          tabIndex={-1}
          className={`fixed inset-0 top-[var(--nav-height)] z-[400] lg:hidden flex flex-col overflow-y-auto animate-slide-down ${isLight ? 'bg-white' : 'bg-[#0f172a]'}`}
        >
           
           {/* Mobile Content */}
           <div className="flex-1 px-6 py-8 space-y-6">
              
              {!showMobileMega ? (
                // Main Mobile Menu
                <div className="flex flex-col space-y-4 animate-fade-in">
                    <a href="#" onClick={(e) => handleNavClick(e, 'landing')} className={`block text-2xl font-bold ${textColor}`}>Features</a>
                    
                    <button 
                      onClick={() => setShowMobileMega(true)}
                      className={`w-full flex items-center justify-between text-2xl font-bold ${textColor}`}
                    >
                      Use Cases <ChevronDown className="-rotate-90 w-5 h-5 opacity-50" />
                    </button>

                    <a href="#" onClick={(e) => handleNavClick(e, 'landing')} className={`block text-2xl font-bold ${textColor}`}>Pricing</a>
                    <a href="#" onClick={(e) => handleNavClick(e, 'about')} className={`block text-2xl font-bold ${textColor}`}>About</a>
                    <a href="#" onClick={(e) => handleNavClick(e, 'blog')} className={`block text-2xl font-bold ${textColor}`}>Blog</a>
                    
                    <hr className={`my-6 ${isLight ? 'border-gray-200' : 'border-white/10'}`} />
                    
                    <div className="grid grid-cols-2 gap-4">
                      {onNewUpload && (
                        <button onClick={() => { onNewUpload(); setIsMobileMenuOpen(false); }} className={`py-4 rounded-xl font-bold text-center ${isLight ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
                           Upload Data
                        </button>
                      )}
                      <button onClick={(e) => handleNavClick(e, 'dashboard')} className={`py-4 rounded-xl font-bold text-center border ${isLight ? 'border-gray-200 text-gray-900' : 'border-white/10 text-white'}`}>
                           Dashboard
                      </button>
                    </div>
                </div>
              ) : (
                // Sub-menu for Use Cases
                <div className="flex flex-col space-y-6 animate-fade-in">
                   <button 
                     onClick={() => setShowMobileMega(false)}
                     className={`flex items-center gap-2 text-sm font-bold opacity-60 uppercase tracking-wider mb-4 ${textColor}`}
                   >
                     <ArrowLeft className="w-4 h-4" /> Back to Menu
                   </button>
                   
                   <div className="space-y-8">
                      <div>
                         <h4 className={`text-xs font-bold uppercase opacity-50 mb-4 ${textColor}`}>Sectors</h4>
                         <div className="flex flex-col gap-4">
                            {['E-commerce', 'Finance', 'Healthcare', 'Manufacturing', 'Startups'].map(item => (
                               <a key={item} href="#" className={`text-xl font-medium ${textColor}`}>{item}</a>
                            ))}
                         </div>
                      </div>
                      <div>
                         <h4 className={`text-xs font-bold uppercase opacity-50 mb-4 ${textColor}`}>Needs</h4>
                         <div className="flex flex-col gap-4">
                            {['Dashboards', 'AI Stories', 'Forecasting', 'Real-time'].map(item => (
                               <a key={item} href="#" className={`text-xl font-medium ${textColor}`}>{item}</a>
                            ))}
                         </div>
                      </div>
                   </div>
                </div>
              )}
           </div>
        </div>
      )}
    </>
  );
};

export default Navbar;