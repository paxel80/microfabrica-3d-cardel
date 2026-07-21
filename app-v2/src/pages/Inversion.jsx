import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Shield } from 'lucide-react';

export default function Inversion() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    },
    exit: { opacity: 0, transition: { duration: 0.5 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="max-w-7xl mx-auto px-6 pb-24 flex flex-col justify-center min-h-[calc(100vh-80px)]"
    >
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        {/* Left: Value Proposition */}
        <div className="space-y-8">
          <motion.div variants={itemVariants}>
            <h2 className="text-orange font-mono tracking-widest text-sm font-bold uppercase mb-4 flex items-center gap-2">
              <span className="w-8 h-[1px] bg-orange block"></span>
              Ronda Semilla
            </h2>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
              Sé parte del <br/>
              <span className="text-glow-orange text-orange">Futuro Industrial</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Estamos levantando una ronda estratégica para asegurar la maquinaria clave y escalar la producción en nuestra primera micro-fábrica.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex gap-4 items-start">
              <CheckCircle2 className="text-cyan w-6 h-6 shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-white text-xl">Ticket Promedio</h3>
                <p className="text-slate-400">Opciones desde $50K USD con equity preferencial.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <CheckCircle2 className="text-cyan w-6 h-6 shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-white text-xl">Uso de Fondos</h3>
                <p className="text-slate-400">80% Maquinaria, 20% Capital de trabajo y validación comercial.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <Shield className="text-orange w-6 h-6 shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-white text-xl">Protección al Inversor</h3>
                <p className="text-slate-400">Estructura legal robusta y reportes de telemetría de producción en tiempo real.</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right: The Ask */}
        <motion.div variants={itemVariants} className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-orange/20 to-cyan/20 blur-3xl opacity-50 rounded-full pointer-events-none" />
          
          <div className="glass-card-pro p-10 relative z-10 text-center">
            <h3 className="text-2xl font-bold mb-2">Objetivo de Ronda</h3>
            <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-500 mb-6">
              $250K
            </div>
            
            <div className="w-full bg-navy border border-white/10 rounded-full h-4 mb-6 overflow-hidden">
              <div className="bg-gradient-to-r from-orange to-cyan w-1/3 h-full rounded-full relative">
                <div className="absolute top-0 right-0 bottom-0 w-10 bg-white/30 blur-sm animate-pulse" />
              </div>
            </div>
            <div className="flex justify-between text-sm font-mono text-slate-400 mb-8">
              <span>Levantado: $80K</span>
              <span>Restante: $170K</span>
            </div>

            <button className="w-full group relative inline-flex items-center justify-center px-8 py-4 font-bold text-navy transition-all duration-200 bg-white rounded-xl hover:bg-slate-200 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]">
              Agendar Reunión con Founders
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-xs text-slate-500 mt-4">
              Solo para inversores acreditados. Sujeto a firma de NDA.
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
