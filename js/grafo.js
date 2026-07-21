// Configuración y conexión Neo4j
const uri = 'neo4j://localhost:7687';
const user = 'neo4j';
const password = 'testpassword';

// Elementos del DOM
const statusDot = document.getElementById('db-status-dot');
const statusText = document.getElementById('db-status-text');
const sidebar = document.getElementById('sidebar');
const closeBtn = document.getElementById('close-sidebar');
const nodeTag = document.getElementById('node-tag');
const nodeTitle = document.getElementById('node-title');
const nodeDesc = document.getElementById('node-desc');
const propertiesGrid = document.getElementById('properties-grid');
const scoringSection = document.getElementById('scoring-section');
const scoreValue = document.getElementById('score-value');
const strategyBadge = document.getElementById('strategy-badge');
const scoringNote = document.getElementById('scoring-note');

// Colores de Vis.js por tipo de nodo
const COLOR_MAP = {
  Root: { background: '#ffffff', border: '#ffffff', highlight: { background: '#f8fafc', border: '#cbd5e1' } },
  Tech: { background: '#3b82f6', border: '#2563eb', highlight: { background: '#60a5fa', border: '#3b82f6' } },
  Printer: { background: '#8b5cf6', border: '#7c3aed', highlight: { background: '#a78bfa', border: '#8b5cf6' } },
  Market: { background: '#10b981', border: '#059669', highlight: { background: '#34d399', border: '#10b981' } },
  Niche: { background: '#f59e0b', border: '#d97706', highlight: { background: '#fbbf24', border: '#f59e0b' } },
  Product: { background: '#ef4444', border: '#dc2626', highlight: { background: '#f87171', border: '#ef4444' } }
};

let network = null;
let graphNodes = new vis.DataSet([]);
let graphEdges = new vis.DataSet([]);
let rawNodesMap = {}; // Guardar la data cruda para el panel

// Iniciar aplicación
async function initGraph() {
  const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
  const session = driver.session();

  try {
    statusText.innerText = 'Cargando datos...';
    
    // Consulta: traer nodos y relaciones
    const result = await session.run(`
      MATCH (n)
      OPTIONAL MATCH (n)-[r]->(m)
      RETURN n, r, m
    `);

    const nodesSet = new Set();
    const edgesSet = new Set();

    result.records.forEach(record => {
      const n = record.get('n');
      const r = record.get('r');
      const m = record.get('m');

      // Procesar nodo N
      if (n && !nodesSet.has(n.identity.toNumber())) {
        nodesSet.add(n.identity.toNumber());
        addNodeToGraph(n);
      }

      // Procesar nodo M
      if (m && !nodesSet.has(m.identity.toNumber())) {
        nodesSet.add(m.identity.toNumber());
        addNodeToGraph(m);
      }

      // Procesar arista R
      if (r && !edgesSet.has(r.identity.toNumber())) {
        edgesSet.add(r.identity.toNumber());
        graphEdges.add({
          id: r.identity.toNumber(),
          from: r.start.toNumber(),
          to: r.end.toNumber(),
          label: r.type.replace(/_/g, ' '),
          font: { color: '#a1a1aa', size: 12, face: 'Inter', strokeWidth: 0 },
          color: { color: 'rgba(255,255,255,0.2)', highlight: '#6366f1' },
          arrows: 'to',
          smooth: { type: 'continuous' }
        });
      }
    });

    renderNetwork();

    statusText.innerText = 'Online';
    statusDot.classList.add('connected');

  } catch (error) {
    console.error('Neo4j Error:', error);
    statusText.innerText = 'Error de conexión';
    statusDot.classList.add('error');
  } finally {
    await session.close();
    await driver.close();
  }
}

function addNodeToGraph(neo4jNode) {
  const id = neo4jNode.identity.toNumber();
  const labels = neo4jNode.labels;
  const props = neo4jNode.properties;
  
  // Guardar en diccionario para panel
  rawNodesMap[id] = { labels, props };

  // Escoger tipo base
  const mainType = labels[0] || 'Default';
  const colors = COLOR_MAP[mainType] || { background: '#555', border: '#333' };

  // Crear nodo de vis.js
  graphNodes.add({
    id: id,
    label: props.label || props.id || 'Nodo',
    shape: 'dot',
    size: 25,
    color: colors,
    font: { color: '#ffffff', face: 'Inter' },
    shadow: { enabled: true, color: 'rgba(0,0,0,0.5)', size: 10 }
  });
}

function renderNetwork() {
  const container = document.getElementById('network-canvas');
  const data = { nodes: graphNodes, edges: graphEdges };
  const options = {
    physics: {
      solver: 'forceAtlas2Based',
      forceAtlas2Based: {
        gravitationalConstant: -100,
        centralGravity: 0.01,
        springConstant: 0.08,
        springLength: 250,
        damping: 0.4,
        avoidOverlap: 0.5
      },
      stabilization: {
        enabled: true,
        iterations: 200,
        fit: true
      }
    },
    interaction: {
      hover: true,
      tooltipDelay: 200,
      zoomSpeed: 0.5,
      navigationButtons: true // Add navigation buttons for better UX
    }
  };

  network = new vis.Network(container, data, options);

  // Evento Clic
  network.on('click', function(params) {
    if (params.nodes.length > 0) {
      const nodeId = params.nodes[0];
      showNodeDetails(nodeId);
    } else {
      hideSidebar();
    }
  });
}

function showNodeDetails(nodeId) {
  const data = rawNodesMap[nodeId];
  if (!data) return;

  const { labels, props } = data;
  
  // Tag y Título
  nodeTag.innerText = labels[0] || 'Entity';
  nodeTitle.innerText = props.label || props.id || 'Sin nombre';
  
  // Descripción
  nodeDesc.innerText = props.descripcion || 'No hay descripción disponible para este elemento.';

  // Limpiar grid
  propertiesGrid.innerHTML = '';
  scoringSection.style.display = 'none';

  // Mostrar propiedades iterando (excluyendo las predecibles o procesadas separadas)
  const excludeKeys = ['id', 'label', 'descripcion', 'scoring_atractividad', 'scoring_estrategia', 'scoring_nota'];
  
  for (const [key, value] of Object.entries(props)) {
    if (excludeKeys.includes(key)) continue;

    const div = document.createElement('div');
    div.className = 'prop-item';
    
    // Formatear key (ej: metrics_margen_bruto_pct -> Margen Bruto Pct)
    const cleanKey = key.replace('metrics_', '').replace(/_/g, ' ');
    
    let displayValue = value;
    if (Array.isArray(value)) displayValue = value.join(', ');
    if (typeof value === 'number' && key.includes('pct')) displayValue = (value * 100).toFixed(0) + '%';
    if (typeof value === 'number' && key.includes('promedio') && !key.includes('pct')) displayValue = value.toLocaleString();

    div.innerHTML = `
      <div class="prop-label">${cleanKey}</div>
      <div class="prop-value">${displayValue}</div>
    `;
    propertiesGrid.appendChild(div);
  }

  // Scoring Especial
  if (props.scoring_atractividad) {
    scoringSection.style.display = 'block';
    scoreValue.innerText = (props.scoring_atractividad * 10).toFixed(1);
    strategyBadge.innerText = props.scoring_estrategia || 'N/A';
    scoringNote.innerText = props.scoring_nota || '';
  }

  // Animar entrada
  sidebar.classList.add('active');
}

function hideSidebar() {
  sidebar.classList.remove('active');
}

closeBtn.addEventListener('click', hideSidebar);

// Inicializar cuando el DOM cargue
document.addEventListener('DOMContentLoaded', initGraph);
