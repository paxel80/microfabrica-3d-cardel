import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, PieChart as PieIcon, LineChart } from 'lucide-react';

const vanData = [
  { year: 'Año 1', van: 0.5 },
  { year: 'Año 2', van: 1.2 },
  { year: 'Año 3', van: 2.1 },
  { year: 'Año 4', van: 2.8 },
  { year: 'Año 5', van: 3.05 },
];

const capexData = [
  { name: 'Maquinaria', value: 120 },
  { name: 'Instalaciones', value: 50 },
  { name: 'Licencias', value: 30 },
  { name: 'Capital de Trabajo', value: 48 },
];
const COLORS = ['#FF5A00', '#00F0FF', '#080C14', '#ffffff'];

export default function Finanzas() {
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
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="max-w-7xl mx-auto px-6 pb-24"
    >
      <motion.div variants={itemVariants} className="mb-16">
        <h2 className="text-cyan font-mono tracking-widest text-sm font-bold uppercase mb-4 flex items-center gap-2">
          <span className="w-8 h-[1px] bg-cyan block"></span>
          Proyección a 5 Años
        </h2>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
          Solidez <span className="title-gradient">Financiera</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl">
          Nuestro modelo operativo lean garantiza puntos de equilibrio tempranos y una proyección de Valor Actual Neto líder en el sector B2B regional.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* CAPEX Chart */}
        <motion.div variants={itemVariants} className="glass-card-pro p-8 flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <PieIcon className="text-cyan w-6 h-6" />
            <h3 className="text-2xl font-bold">Desglose de CAPEX</h3>
            <span className="ml-auto bg-cyan/10 text-cyan px-3 py-1 rounded-full text-sm font-mono border border-cyan/20">
              $248K USD
            </span>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={capexData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {capexData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#080C14', borderColor: '#2e303a', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legend */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            {capexData.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                <span className="text-sm text-slate-300">{item.name}</span>
                <span className="text-sm font-bold text-white ml-auto">${item.value}K</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* VAN Projection Chart */}
        <motion.div variants={itemVariants} className="glass-card-pro p-8 flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <LineChart className="text-orange w-6 h-6" />
            <h3 className="text-2xl font-bold">Proyección VAN</h3>
            <span className="ml-auto bg-orange/10 text-orange px-3 py-1 rounded-full text-sm font-mono border border-orange/20">
              $3.05M USD
            </span>
          </div>
          
          <div className="h-[300px] w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={vanData}>
                <defs>
                  <linearGradient id="colorVan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF5A00" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#FF5A00" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="year" stroke="#9ca3af" axisLine={false} tickLine={false} />
                <YAxis stroke="#9ca3af" axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}M`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#080C14', borderColor: '#FF5A00', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="van" stroke="#FF5A00" strokeWidth={3} fillOpacity={1} fill="url(#colorVan)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
      
      <motion.div variants={itemVariants} className="mt-12 text-center">
        <button className="inline-flex items-center justify-center px-6 py-3 font-bold text-white transition-all duration-200 border border-white/20 rounded-lg hover:bg-white/5 hover:border-cyan hover:text-cyan group">
          <Download className="w-5 h-5 mr-2 group-hover:-translate-y-1 transition-transform" />
          Descargar Memorándum Completo (PDF)
        </button>
      </motion.div>
    </motion.div>
  );
}
