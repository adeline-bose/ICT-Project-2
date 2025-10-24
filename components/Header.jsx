import { useState, useEffect } from 'react';
import { ArrowRight, Recycle, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const navigate=useNavigate()
  const handleClick=()=>{
    navigate('/auth')
  }

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrollY > 50 ? 'bg-slate-900/90 backdrop-blur-md border-b border-slate-700/50' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-600 rounded-xl flex items-center justify-center">
              <Recycle className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">ScrapSmart</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-slate-300 hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="text-slate-300 hover:text-white transition-colors">How It Works</a>
            <a href="#testimonials" className="text-slate-300 hover:text-white transition-colors">Reviews</a>
            {/* <button className="text-slate-300 hover:text-white transition-colors">Login</button> */}
            <button onClick={handleClick} className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105">
              Get Started
            </button>
          </div>

          <button 
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-slate-900/95 backdrop-blur-md border-t border-slate-700/50">
          <div className="px-4 py-6 space-y-4">
            <a href="#features" className="block text-slate-300 hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="block text-slate-300 hover:text-white transition-colors">How It Works</a>
            <a href="#testimonials" className="block text-slate-300 hover:text-white transition-colors">Reviews</a>
            {/* <button className="block text-slate-300 hover:text-white transition-colors">Login</button> */}
            <button onClick={handleClick} className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all">
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;