import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Target, Zap, Clock } from 'lucide-react';

export default function PorQue() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    },
    exit: { opacity: 0, transition: { duration: 0.5 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8 } }
  };

  return (
    <motion.div 
      ref={containerRef}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="max-w-7xl mx-auto px-6 pb-24 overflow-hidden"
    >
      <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[calc(100vh-80px)]">
        {/* Left: Interactive Image */}
        <motion.div style={{ y, opacity }} className="relative hidden lg:block">
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy via-transparent to-transparent z-10" />
          <div className="glass-card-pro p-2 relative overflow-hidden rounded-3xl">
            <img 
              src="/cad_hero_blueprint.jpg" 
              alt="Blueprint CAD" 
              className="w-full h-auto object-cover opacity-80 mix-blend-screen filter contrast-125"
            />
            {/* Scanning overlay */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan shadow-[0_0_15px_rgba(0,240,255,1)] animate-[scan_3s_ease-in-out_infinite]" />
          </div>
        </motion.div>

        {/* Right: Content */}
        <div className="space-y-12">
          <motion.div variants={itemVariants}>
            <h2 className="text-cyan font-mono tracking-widest text-sm font-bold uppercase mb-4 flex items-center gap-2">
              <span className="w-8 h-[1px] bg-cyan block"></span>
              La Ventaja Injusta
            </h2>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              ¿Por qué el modelo de <br/>
              <span className="title-gradient">Micro-Fábrica?</span>
            </h1>
          </motion.div>

          <div className="space-y-8">
            <Feature 
              icon={<Zap className="w-6 h-6 text-orange" />}
              title="Cero Inventario, 100% Agilidad"
              desc="Adiós a las naves industriales gigantes. Nuestra micro-fábrica opera 'Just In Time', reduciendo los costos de almacenamiento en un 95% y eliminando el riesgo de inventario obsoleto."
            />
            <Feature 
              icon={<Target className="w-6 h-6 text-cyan" />}
              title="Precisión Micrométrica"
              desc="Implementamos un sistema robótico con redundancia láser. Cada pieza pasa por un control de calidad automático (Computer Vision), reduciendo la tasa de error a menos del 0.1%."
            />
            <Feature 
              icon={<Clock className="w-6 h-6 text-white" />}
              title="Velocidad Go-to-Market"
              desc="Desde el diseño CAD hasta la pieza final en 24 horas. Permitimos a nuestros clientes iterar componentes industriales a una fracción del tiempo de la manufactura tradicional."
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Feature({ icon, title, desc }) {
  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <motion.div variants={itemVariants} className="flex gap-6 group">
      <div className="shrink-0 relative">
        <div className="absolute inset-0 bg-current opacity-20 blur-xl group-hover:opacity-40 transition-opacity rounded-full" style={{ color: icon.props.className.includes('text-orange') ? '#FF5A00' : icon.props.className.includes('text-cyan') ? '#00F0FF' : '#fff' }} />
        <div className="w-14 h-14 rounded-2xl glass-card-pro flex items-center justify-center relative z-10 group-hover:border-white/20 transition-colors">
          {icon}
        </div>
      </div>
      <div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
          {desc}
        </p>
      </div>
    </motion.div>
  );
}
