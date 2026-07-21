// 1. Limpieza inicial (opcional - elimina todos los nodos y relaciones)
// Descomentar la siguiente línea si deseas borrar la base de datos antes de insertar
// MATCH (n) DETACH DELETE n;

// 2. Creación de Nodos y Relaciones
CREATE 
  // Nodos
  (catalogo:Root:Catalogo {id: "catalogo", label: "Catálogo 3D", descripcion: "Catálogo maestro de líneas de impresión 3D", version: "v1.0", region: "MX"}),
  (fdm:Tech:Tecnologia {id: "fdm", label: "FDM / FFF", descripcion: "Impresión por deposición de material fundido", segmento: ["consumo", "educacion", "industrial_ligero"], ventajas: ["bajo coste", "materiales variados"], limitaciones: ["acabado superficial", "tolerancias medias"]}),
  (bambu:Printer:Impresora {id: "bambu", label: "Familia Bambu Lab", tecnologia_base: "FDM", volumen_impresion: "medio", velocidad: "alta", perfil_cliente: ["prosumer", "productores pequeños"]}),
  (industrial:Market:Mercado {id: "industrial", label: "Mercado industrial", descripcion: "Prototipos funcionales, utillaje, moldes", sensibilidad_precio: "media", sensibilidad_plazo: "alta"}),
  (moldes:Niche:Nicho {id: "moldes", label: "Nicho moldes y utillaje", descripcion: "Moldes, jigs, fixtures, herramientas especiales", sector_principal: ["industrial", "manufactura"], metrics_margen_promedio_pct: 0.48, metrics_ticket_promedio: 2500, metrics_frecuencia_proyectos_mes: 4, scoring_atractividad: 0.76, scoring_estrategia: "expandir"}),
  (jigs:Product:Producto {id: "jigs", label: "Producto: jigs / fixtures", descripcion: "Herramentales personalizados para líneas de producción", tipo_oferta: "B2B", metrics_margen_bruto_pct: 0.55, metrics_tiempo_promedio_produccion_h: 8, metrics_complejidad_tecnica: 4, metrics_tasa_repeticion_cliente: 0.6, metrics_demanda_estimada_mensual: 12, scoring_atractividad: 0.82, scoring_estrategia: "priorizar", scoring_nota: "Buen margen y repetición; complejidad manejable."}),
  
  // Relaciones
  (catalogo)-[:INCLUYE_TECNOLOGIA {prioridad: "alta"}]->(fdm),
  (fdm)-[:USA_TECNOLOGIA {nivel_adecuacion: "alta"}]->(bambu),
  (bambu)-[:SE_APLICA_EN {intensidad_uso: "media"}]->(industrial),
  (industrial)-[:ATIENDE_MERCADO {prioridad_estrategica: "alta"}]->(moldes),
  (moldes)-[:DERIVA_EN_PRODUCTO {nivel_encaje: "alto"}]->(jigs);
