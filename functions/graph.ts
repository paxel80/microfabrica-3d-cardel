// Cloudflare Pages Function: /graph
// Serves the Interactive NEXUS Knowledge Graph Bloom Visualizer

const VISUALIZER_HTML = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NEXUS Knowledge Graph — Visualizador Bloom (la-inconclusa)</title>
    <script src="https://cdn.jsdelivr.net/npm/neovis.js@2.1.0/dist/neovis.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-dark: #0f172a;
            --panel-bg: rgba(30, 41, 59, 0.85);
            --border-color: rgba(255, 255, 255, 0.1);
            --accent-blue: #3b82f6;
            --accent-cyan: #06b6d4;
            --accent-green: #10b981;
            --accent-purple: #8b5cf6;
            --accent-amber: #f59e0b;
            --text-main: #f8fafc;
            --text-muted: #94a3b8;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Outfit', sans-serif; background-color: var(--bg-dark); color: var(--text-main); height: 100vh; overflow: hidden; display: flex; flex-direction: column; }
        header { background: var(--panel-bg); backdrop-filter: blur(12px); border-bottom: 1px solid var(--border-color); padding: 1rem 1.5rem; display: flex; align-items: center; justify-content: space-between; z-index: 10; }
        .brand { display: flex; align-items: center; gap: 0.75rem; }
        .brand-logo { width: 32px; height: 32px; background: linear-gradient(135deg, var(--accent-purple), var(--accent-blue)); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.1rem; box-shadow: 0 0 15px rgba(139, 92, 246, 0.4); }
        .brand-title { font-size: 1.25rem; font-weight: 600; letter-spacing: -0.02em; }
        .brand-badge { background: rgba(59, 130, 246, 0.2); color: var(--accent-blue); border: 1px solid rgba(59, 130, 246, 0.3); padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.75rem; font-weight: 500; }
        .controls { display: flex; gap: 1rem; align-items: center; }
        .cypher-input-group { display: flex; gap: 0.5rem; background: rgba(15, 23, 42, 0.6); padding: 0.3rem 0.5rem; border-radius: 8px; border: 1px solid var(--border-color); width: 420px; }
        .cypher-input { background: transparent; border: none; color: var(--text-main); font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; width: 100%; outline: none; }
        .btn { background: linear-gradient(135deg, var(--accent-blue), var(--accent-cyan)); color: white; border: none; padding: 0.5rem 1rem; border-radius: 6px; font-family: 'Outfit', sans-serif; font-weight: 500; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; }
        .btn:hover { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3); }
        .btn-outline { background: transparent; border: 1px solid var(--border-color); color: var(--text-muted); }
        main { flex: 1; position: relative; display: flex; }
        #viz { width: 100%; height: 100%; background: radial-gradient(circle at center, #1e293b 0%, #0f172a 100%); }
        .sidebar { position: absolute; top: 1rem; left: 1rem; width: 300px; background: var(--panel-bg); backdrop-filter: blur(16px); border: 1px solid var(--border-color); border-radius: 12px; padding: 1.25rem; display: flex; flex-direction: column; gap: 1rem; z-index: 5; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); }
        .legend-title { font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); font-weight: 600; margin-bottom: 0.5rem; }
        .legend-items { display: flex; flex-direction: column; gap: 0.4rem; }
        .legend-item { display: flex; align-items: center; gap: 0.75rem; font-size: 0.85rem; cursor: pointer; padding: 0.3rem 0.5rem; border-radius: 6px; }
        .legend-item:hover { background: rgba(255, 255, 255, 0.05); }
        .dot { width: 10px; height: 10px; border-radius: 50%; }
        .dot.agent { background-color: #8b5cf6; }
        .dot.task { background-color: #3b82f6; }
        .dot.fact { background-color: #10b981; }
        .dot.doc { background-color: #f59e0b; }
        .dot.chunk { background-color: #06b6d4; }
        .dot.run { background-color: #ec4899; }
    </style>
</head>
<body>
    <header>
        <div class="brand">
            <div class="brand-logo">N</div>
            <div class="brand-title">NEXUS Memory Graph</div>
            <span class="brand-badge">la-inconclusa</span>
        </div>
        <div class="controls">
            <div class="cypher-input-group">
                <input type="text" id="cypherQuery" class="cypher-input" value="MATCH (n)-[r]->(m) RETURN n,r,m LIMIT 50">
            </div>
            <button class="btn" onclick="renderGraph()">⚡ Ejecutar</button>
            <button class="btn btn-outline" onclick="resetView()">🔄 Reset</button>
        </div>
    </header>
    <main>
        <div class="sidebar">
            <div>
                <div class="legend-title">Nodos de Memoria</div>
                <div class="legend-items">
                    <div class="legend-item" onclick="filterByLabel('Agent')"><span class="dot agent"></span><span>Agent</span></div>
                    <div class="legend-item" onclick="filterByLabel('Task')"><span class="dot task"></span><span>Task</span></div>
                    <div class="legend-item" onclick="filterByLabel('Fact')"><span class="dot fact"></span><span>Fact</span></div>
                    <div class="legend-item" onclick="filterByLabel('Document')"><span class="dot doc"></span><span>Document</span></div>
                    <div class="legend-item" onclick="filterByLabel('Chunk')"><span class="dot chunk"></span><span>Chunk</span></div>
                    <div class="legend-item" onclick="filterByLabel('AgentRun')"><span class="dot run"></span><span>AgentRun</span></div>
                </div>
            </div>
            <div>
                <div class="legend-title">Servidor Neo4j</div>
                <div style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.4;">
                    Bolt: <code>bolt://localhost:7687</code><br>
                    HTTP Browser: <a href="http://localhost:7474" target="_blank" style="color: var(--accent-cyan);">localhost:7474</a>
                </div>
            </div>
        </div>
        <div id="viz"></div>
    </main>
    <script>
        let viz = null;
        const config = {
            container_id: "viz",
            server_url: "bolt://localhost:7687",
            server_user: "neo4j",
            server_password: "testpassword",
            labels: {
                Agent: { caption: "name", font: { size: 14, color: "#ffffff" }, [NeoVis.NEOVIS_ADVANCED_CONFIG]: { static: { color: "#8b5cf6" } } },
                Task: { caption: "description", font: { size: 12, color: "#ffffff" }, [NeoVis.NEOVIS_ADVANCED_CONFIG]: { static: { color: "#3b82f6" } } },
                Fact: { caption: "statement", font: { size: 12, color: "#ffffff" }, [NeoVis.NEOVIS_ADVANCED_CONFIG]: { static: { color: "#10b981" } } },
                Document: { caption: "uri", font: { size: 12, color: "#ffffff" }, [NeoVis.NEOVIS_ADVANCED_CONFIG]: { static: { color: "#f59e0b" } } },
                Chunk: { caption: "content_hash", font: { size: 10, color: "#ffffff" }, [NeoVis.NEOVIS_ADVANCED_CONFIG]: { static: { color: "#06b6d4" } } },
                AgentRun: { caption: "model", font: { size: 10, color: "#ffffff" }, [NeoVis.NEOVIS_ADVANCED_CONFIG]: { static: { color: "#ec4899" } } }
            },
            initial_cypher: "MATCH (n)-[r]->(m) RETURN n,r,m LIMIT 50"
        };
        function renderGraph() {
            const query = document.getElementById("cypherQuery").value;
            config.initial_cypher = query;
            if (viz) { viz.renderWithCypher(query); }
            else { try { viz = new NeoVis.default(config); viz.render(); } catch(e) { console.error(e); } }
        }
        function filterByLabel(label) {
            document.getElementById("cypherQuery").value = \`MATCH (n:\${label})-[r]-(m) RETURN n,r,m LIMIT 50\`;
            renderGraph();
        }
        function resetView() {
            document.getElementById("cypherQuery").value = "MATCH (n)-[r]->(m) RETURN n,r,m LIMIT 50";
            renderGraph();
        }
        window.addEventListener("DOMContentLoaded", renderGraph);
    </script>
</body>
</html>`;

export async function onRequest(context) {
    return new Response(VISUALIZER_HTML, {
        headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'no-cache'
        }
    });
}
