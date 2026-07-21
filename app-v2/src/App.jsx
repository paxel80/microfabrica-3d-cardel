import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

// Pages
import Home from './pages/Home';
import PorQue from './pages/PorQue';
import Finanzas from './pages/Finanzas';
import Inversion from './pages/Inversion';

function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-navy/50 backdrop-blur-md border-b border-white/5 h-20 flex items-center px-8">
      <Link to="/" className="flex items-center gap-3 group relative">
        {/* Glow effect behind logo */}
        <div className="absolute inset-0 bg-cyan blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 rounded-full" />
        
        {/* Abstract 3D Printer Logo */}
        <svg className="w-10 h-10 text-cyan relative z-10 drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.27 6.96 12 12.01l8.73-5.05M12 22.08V12" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5" className="text-orange" strokeWidth="2" />
        </svg>
        <span className="font-heading font-bold text-xl tracking-widest text-white relative z-10">M3D</span>
      </Link>
      
      {/* Minimalist visual navigation indicators instead of text */}
      <div className="ml-auto flex items-center gap-6">
        <NavLink to="/por-que" delay={0.1} />
        <NavLink to="/finanzas" delay={0.2} />
        <NavLink to="/inversion" delay={0.3} />
      </div>
    </nav>
  );
}

function NavLink({ to, delay }) {
  return (
    <Link to={to}>
      <motion.div 
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay, duration: 0.5 }}
        className="w-3 h-3 rounded-full bg-white/20 hover:bg-cyan hover:shadow-[0_0_15px_rgba(0,240,255,0.8)] transition-all duration-300 cursor-pointer"
      />
    </Link>
  )
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-navy text-slate-300 selection:bg-orange selection:text-white">
        <Navbar />
        
        {/* Background Grid */}
        <div className="fixed inset-0 z-0 pointer-events-none vivid-grid opacity-30" />
        
        {/* Main Content */}
        <main className="relative z-10 pt-20">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/por-que" element={<PorQue />} />
              <Route path="/finanzas" element={<Finanzas />} />
              <Route path="/inversion" element={<Inversion />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </Router>
  );
}

export default App;
