import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Activity, TrendingUp, ShieldCheck } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Float } from '@react-three/drei';

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={2} color="#00F0FF" />
      <directionalLight position={[-10, -10, -5]} intensity={1} color="#FF5A00" />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <mesh>
          <torusKnotGeometry args={[10, 3, 100, 16]} />
          <meshStandardMaterial color="#080C14" metalness={0.9} roughness={0.1} wireframe={true} />
        </mesh>
      </Float>
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
    </>
  );
}

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    },
    exit: { opacity: 0, transition: { duration: 0.5 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center relative overflow-hidden"
    >
      {/* 3D Background */}
      <div className="absolute inset-0 z-0 opacity-40">
        <Canvas camera={{ position: [0, 0, 30], fov: 45 }}>
          <Scene />
        </Canvas>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left Column: The Pitch */}
        <div className="text-left space-y-8">
          <motion.div variants={itemVariants}>
            <h2 className="text-cyan font-mono tracking-widest text-sm font-bold uppercase mb-4 flex items-center gap-2">
              <span className="w-8 h-[1px] bg-cyan block"></span>
              Proyecto de Inversión B2B
            </h2>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1]">
              Micro-Fábrica <br/>
              <span className="title-gradient text-glow-cyan">3D Industrial</span>
            </h1>
          </motion.div>
          
          <motion.p variants={itemVariants} className="text-slate-400 text-lg md:text-xl max-w-lg leading-relaxed">
            Revolucionando la manufactura en Cardel. Producción bajo demanda, cero desperdicios y márgenes de ganancia sin precedentes.
          </motion.p>

          <motion.div variants={itemVariants} className="flex gap-4">
            <Link to="/inversion" className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-orange border border-transparent rounded-full hover:bg-orange/90 hover:shadow-[0_0_20px_rgba(255,90,0,0.4)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange">
              Oportunidad de Inversión
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/por-que" className="inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 border border-white/20 rounded-full hover:bg-white/5 hover:border-cyan hover:text-cyan hover:shadow-[0_0_20px_rgba(0,240,255,0.2)]">
              Ver Detalles
            </Link>
          </motion.div>
        </div>

        {/* Right Column: Key Highlights / HUD */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
          {/* Decorative scanner line */}
          <div className="absolute inset-0 border-l border-t border-cyan/20 pointer-events-none rounded-tl-3xl"></div>
          
          <MetricCard 
            icon={<TrendingUp className="text-orange" />}
            label="VAN (5 años)"
            value="$3.05M"
            subtext="+34% vs mercado"
          />
          <MetricCard 
            icon={<Activity className="text-cyan" />}
            label="Breakeven"
            value="Mes 7"
            subtext="Recuperación rápida"
          />
          <MetricCard 
            icon={<ShieldCheck className="text-white" />}
            label="Riesgo"
            value="Bajo"
            subtext="Demanda validada"
            className="sm:col-span-2"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

function MetricCard({ icon, label, value, subtext, className = "" }) {
  return (
    <div className={`glass-card-pro p-6 flex flex-col gap-2 ${className}`}>
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-white/5 rounded-lg border border-white/10">
          {icon}
        </div>
        <span className="text-sm text-slate-400 font-mono">{label}</span>
      </div>
      <div className="text-4xl font-bold tracking-tight text-white">{value}</div>
      <div className="text-sm font-medium text-cyan">{subtext}</div>
    </div>
  );
}
