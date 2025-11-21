import { ProjectFile } from './types';

export const INITIAL_FILES: ProjectFile[] = [
    {
        name: 'index.html',
        language: 'html',
        content: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="author" content="Jose Divino Prado da Lapa">
    <title>Cucaypy Workspace</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <!-- Toast Container -->
    <div id="toast-container"></div>

    <!-- Terminal Overlay (Server Console) -->
    <div id="server-terminal" class="terminal-overlay" style="display: none;">
        <div class="terminal-header">
            <div class="term-title"><i class="fa-solid fa-terminal"></i> Cucaypy Server v1.0</div>
            <button onclick="toggleTerminal()" class="term-close"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="terminal-body" id="term-output">
            <div class="term-line"><span class="term-green">root@cucaypy:~$</span> <span class="typing-cursor">_</span></div>
        </div>
    </div>

    <!-- Context Menu (Visual Editor - Double Tap) -->
    <div id="context-menu" class="context-menu" style="display: none;">
        <div class="context-header">Cucaypy Visual</div>
        <div class="context-body">
            <button onclick="executeVisualAction('paste')" class="ctx-btn primary"><i class="fa-solid fa-paste"></i> Colar Banner 3D</button>
            <button onclick="executeVisualAction('edit')" class="ctx-btn"><i class="fa-solid fa-pen"></i> Editar Texto</button>
            <button onclick="executeVisualAction('delete')" class="ctx-btn delete"><i class="fa-solid fa-trash"></i> Excluir Item</button>
        </div>
    </div>

    <div class="app-container">
        <!-- Sidebar Navigation -->
        <aside class="sidebar">
            <div class="brand">
                <div class="brand-icon"><i class="fa-solid fa-cube"></i></div>
                <span id="brand-name">Cucaypy</span>
            </div>
            
            <nav class="nav-menu">
                <a href="javascript:void(0)" class="nav-item active" id="nav-dashboard" onclick="selectTab('dashboard')">
                    <i class="fa-solid fa-grid-2"></i>
                    <span>Início</span>
                </a>
                <a href="javascript:void(0)" class="nav-item" id="nav-editor" onclick="selectTab('editor')">
                    <i class="fa-solid fa-code"></i>
                    <span>Editor</span>
                </a>
                <a href="javascript:void(0)" class="nav-item" id="nav-files" onclick="selectTab('files')">
                    <i class="fa-solid fa-folder-tree"></i>
                    <span>Arquivos</span>
                </a>
                <div class="nav-divider"></div>
                <!-- NOVO BOTÃO INSTALADO -->
                <a href="javascript:void(0)" class="nav-item highlight-item" id="nav-assets" onclick="selectTab('assets')">
                    <i class="fa-solid fa-wand-magic-sparkles"></i>
                    <span>Magic Assets 3D</span>
                </a>
            </nav>

            <div class="server-status" onclick="toggleTerminal()">
                <div class="status-indicator online" id="server-indicator"></div>
                <span id="server-text">Servidor Online (3000)</span>
            </div>
        </aside>

        <!-- Main Content Area -->
        <main class="main-content">
            <header class="top-bar">
                <div class="breadcrumbs">
                    <span class="text-muted">Workspace</span> / <span class="current" id="breadcrumb-title">Início</span>
                </div>
                <div class="actions">
                    <!-- Visual Mode Toggle -->
                    <div class="visual-mode-toggle" id="visual-mode-wrapper">
                        <span class="text-sm mr-2 font-medium" id="visual-status-text">Modo Visual: OFF</span>
                        <label class="switch">
                            <input type="checkbox" id="visual-mode-check" onchange="toggleVisualMode(this)">
                            <span class="slider round"></span>
                        </label>
                    </div>
                </div>
            </header>

            <!-- VIEW: DASHBOARD (RAIZ) -->
            <div id="dashboard-view" class="view-section active">
                <div class="welcome-banner">
                    <h1>Painel de Controle</h1>
                    <p>Bem-vindo ao Cucaypy OS. Criado por Jose Divino Prado da Lapa.</p>
                </div>
                
                <div class="grid-3-col">
                    <div class="tool-card" onclick="selectTab('editor')">
                        <div class="icon-box blue"><i class="fa-solid fa-code"></i></div>
                        <h3>Editor</h3>
                    </div>
                    <div class="tool-card" onclick="deployProject()">
                        <div class="icon-box green"><i class="fa-solid fa-rocket"></i></div>
                        <h3>Deploy Live</h3>
                    </div>
                    <div class="tool-card" onclick="selectTab('assets')">
                        <div class="icon-box purple"><i class="fa-solid fa-cubes-stacked"></i></div>
                        <h3>Loja 3D</h3>
                    </div>
                </div>

                <div class="deploy-info-card">
                     <h4><i class="fa-solid fa-network-wired"></i> Status da Rede</h4>
                     <div class="info-row">
                        <span>Porta:</span> <span class="text-green">3000 (Active)</span>
                     </div>
                     <div class="info-row">
                        <span>Environment:</span> <span class="text-blue">Production</span>
                     </div>
                     <div class="info-row">
                        <span>Uptime:</span> <span id="uptime-counter">00:00:00</span>
                     </div>
                </div>
            </div>
            
            <!-- VIEW: MAGIC ASSETS 3D (NOVA FERRAMENTA FUNCIONAL) -->
            <div id="assets-view" class="view-section" style="display: none;">
                <div class="store-header">
                    <h2><i class="fa-solid fa-cloud-arrow-down"></i> Loja de Assets 3D</h2>
                    <p class="text-muted">Pesquise, baixe e copie para usar no Editor Visual.</p>
                    <div class="search-bar-lg">
                        <input type="text" id="asset-search-input" placeholder="Buscar assets (ex: banner, botão)..." onkeyup="handleAssetSearch(event)">
                        <button class="btn-primary" onclick="triggerSearch()"><i class="fa-solid fa-search"></i></button>
                    </div>
                    <div class="store-tabs">
                        <button class="store-tab active" id="tab-all" onclick="filterStore('all')">Loja Online</button>
                        <button class="store-tab" id="tab-saved" onclick="filterStore('saved')">Meus Downloads <span id="saved-count" class="badge">0</span></button>
                    </div>
                </div>

                <div class="assets-grid" id="assets-grid">
                    <!-- Preenchido via JS -->
                </div>
            </div>

            <!-- VIEW: EDITOR -->
            <div id="editor-view" class="view-section" style="display: none;">
                <div class="editor-layout">
                    <div class="editor-main full-width">
                         <div class="editor-toolbar">
                            <span><i class="fa-solid fa-eye"></i> Preview do Site (Modo Visual Disponível)</span>
                            <button class="btn-sm-icon" onclick="deployProject()" title="Abrir em nova aba"><i class="fa-solid fa-external-link"></i> Abrir Live</button>
                        </div>
                        <!-- Área de Preview Interna para Teste Visual -->
                        <div class="preview-mockup-container">
                            <div id="visual-editor-canvas" class="visual-canvas">
                                <!-- Elementos Iniciais do Site -->
                                <div class="visual-item header-section">
                                    <h1>Meu Site 3D</h1>
                                    <p>Dê dois toques aqui para testar o menu.</p>
                                </div>
                                <div class="visual-item content-box">
                                    <p>Esta área está vazia. Ative o Modo Visual, vá na loja, copie um banner e cole aqui!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- VIEW: FILES -->
            <div id="files-view" class="view-section" style="display: none;">
                <div class="card">
                    <div class="card-header"><h2>Arquivos</h2></div>
                    <div class="file-tree">
                        <div class="tree-item folder open"><i class="fa-solid fa-folder text-yellow-500"></i> root</div>
                        <div class="tree-children">
                            <div class="tree-item file"><i class="fa-brands fa-html5 text-orange-500"></i> index.html</div>
                            <div class="tree-item file"><i class="fa-brands fa-css3 text-blue-500"></i> style.css</div>
                            <div class="tree-item file"><i class="fa-brands fa-js text-yellow-500"></i> script.js</div>
                            <div class="tree-item file"><i class="fa-brands fa-npm text-red-500"></i> package.json</div>
                        </div>
                    </div>
                    <div class="card-footer" style="margin-top: 20px;">
                        <button class="btn-primary" style="width:100%" onclick="downloadProject()"><i class="fa-solid fa-download"></i> Baixar Projeto (.html)</button>
                    </div>
                </div>
            </div>

        </main>
    </div>
    <script src="script.js"></script>
</body>
</html>`
    },
    {
        name: 'style.css',
        language: 'css',
        content: `:root {
    --bg-dark: #0f172a;
    --bg-card: #1e293b;
    --primary: #6366f1;
    --border: #334155;
    --term-bg: #0c0c0c;
    --term-text: #22c55e;
}
* { box-sizing: border-box; outline: none; }
body { margin: 0; font-family: 'Inter', sans-serif; background: var(--bg-dark); color: #f8fafc; height: 100vh; overflow: hidden; }

.app-container { display: flex; height: 100%; }
.sidebar { width: 240px; background: #020617; border-right: 1px solid var(--border); padding: 1.5rem; display: flex; flex-direction: column; }
.main-content { flex: 1; overflow-y: auto; background: var(--bg-dark); position: relative; }

/* Nav */
.brand { display: flex; align-items: center; gap: 10px; margin-bottom: 2rem; font-weight: bold; font-size: 1.2rem; }
.brand-icon { width: 32px; height: 32px; background: var(--primary); border-radius: 8px; display: flex; align-items: center; justify-content: center; }
.nav-item { display: flex; align-items: center; gap: 12px; padding: 12px; color: #94a3b8; text-decoration: none; border-radius: 8px; margin-bottom: 4px; transition: 0.2s; }
.nav-item:hover, .nav-item.active { background: rgba(99, 102, 241, 0.1); color: var(--primary); }
.highlight-item { margin-top: 10px; background: linear-gradient(90deg, rgba(139, 92, 246, 0.2), transparent); border: 1px solid rgba(139, 92, 246, 0.3); color: #c4b5fd; }

.server-status { margin-top: auto; padding: 10px; background: rgba(0,0,0,0.3); border-radius: 8px; display: flex; align-items: center; gap: 8px; font-size: 12px; cursor: pointer; transition: 0.2s; border: 1px solid transparent; }
.server-status:hover { border-color: var(--border); background: rgba(255,255,255,0.05); }
.status-indicator { width: 8px; height: 8px; border-radius: 50%; }
.status-indicator.online { background: #22c55e; box-shadow: 0 0 8px #22c55e; }
.status-indicator.busy { background: #eab308; box-shadow: 0 0 8px #eab308; }

/* Views */
.top-bar { padding: 1rem 2rem; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; background: var(--bg-card); }
.grid-3-col { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; padding: 2rem; }
.tool-card { background: var(--bg-card); border: 1px solid var(--border); padding: 1.5rem; border-radius: 12px; text-align: center; cursor: pointer; transition: 0.3s; }
.tool-card:hover { border-color: var(--primary); transform: translateY(-3px); }
.icon-box { width: 50px; height: 50px; margin: 0 auto 1rem; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; }
.blue { background: rgba(59,130,246,0.2); color:#3b82f6; }
.green { background: rgba(34,197,94,0.2); color:#22c55e; }
.purple { background: rgba(168,85,247,0.2); color:#a855f7; }

.deploy-info-card { margin: 0 2rem; padding: 1.5rem; background: rgba(15, 23, 42, 0.5); border: 1px solid var(--border); border-radius: 12px; }
.deploy-info-card h4 { margin: 0 0 1rem 0; color: #94a3b8; }
.info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 14px; }
.text-green { color: #22c55e; }
.text-blue { color: #3b82f6; }

/* Terminal Overlay */
.terminal-overlay { position: absolute; bottom: 0; left: 0; right: 0; height: 300px; background: var(--term-bg); border-top: 1px solid #333; z-index: 100; font-family: 'Fira Code', monospace; display: flex; flex-direction: column; box-shadow: 0 -5px 20px rgba(0,0,0,0.5); }
.terminal-header { background: #1a1a1a; padding: 5px 15px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #333; }
.term-title { color: #888; font-size: 12px; }
.term-close { background: none; border: none; color: #888; cursor: pointer; }
.terminal-body { flex: 1; padding: 15px; overflow-y: auto; color: #ddd; font-size: 13px; }
.term-line { margin-bottom: 5px; line-height: 1.4; }
.term-green { color: var(--term-text); }
.term-blue { color: #3b82f6; }
.term-yellow { color: #eab308; }
.typing-cursor { animation: blink 1s infinite; }

/* Store */
.store-header { padding: 2rem; background: linear-gradient(to right, #1e1b4b, #312e81); border-bottom: 1px solid var(--border); }
.search-bar-lg { display: flex; gap: 10px; margin-top: 1rem; }
.search-bar-lg input { flex: 1; padding: 12px; border-radius: 6px; border: none; background: rgba(255,255,255,0.1); color: white; }
.btn-primary { padding: 0 20px; background: var(--primary); border: none; border-radius: 6px; color: white; cursor: pointer; }
.store-tabs { display: flex; gap: 20px; margin-top: 2rem; }
.store-tab { background: none; border: none; border-bottom: 2px solid transparent; color: #94a3b8; padding-bottom: 5px; cursor: pointer; }
.store-tab.active { color: white; border-color: var(--primary); }
.badge { background: var(--primary); color: white; font-size: 10px; padding: 2px 6px; border-radius: 10px; margin-left: 5px; }

.assets-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1.5rem; padding: 2rem; }
.asset-card { background: var(--bg-card); border-radius: 12px; overflow: hidden; border: 1px solid var(--border); }
.asset-preview { height: 160px; background: #000; display: flex; align-items: center; justify-content: center; overflow: hidden; perspective: 1000px; }
.asset-info { padding: 1rem; }
.asset-actions { display: flex; gap: 10px; margin-top: 10px; }
.btn-sm { flex: 1; padding: 8px; border-radius: 4px; border: 1px solid var(--border); background: transparent; color: white; cursor: pointer; transition: 0.2s; }
.btn-sm:hover { background: var(--primary); border-color: var(--primary); }
.btn-sm-icon { background: none; border: 1px solid var(--border); color: #94a3b8; padding: 4px 8px; border-radius: 4px; font-size: 12px; cursor: pointer; display: flex; align-items: center; gap: 5px; }
.btn-sm-icon:hover { color: white; border-color: white; }

/* Visual Editor & Context Menu */
.preview-mockup-container { background: white; height: calc(100vh - 160px); overflow-y: auto; }
.visual-canvas { padding: 20px; min-height: 100%; color: #333; }
.visual-canvas.active-mode .visual-item { outline: 2px dashed #6366f1; outline-offset: 2px; cursor: pointer; }
.visual-canvas.active-mode .visual-item:hover { background: rgba(99,102,241,0.05); }

.context-menu { position: fixed; z-index: 9999; background: rgba(30, 41, 59, 0.95); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; width: 180px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); overflow: hidden; animation: popup 0.1s ease-out; }
.context-header { background: rgba(0,0,0,0.2); padding: 8px 12px; font-size: 11px; text-transform: uppercase; color: #94a3b8; font-weight: bold; }
.ctx-btn { width: 100%; text-align: left; background: none; border: none; color: #e2e8f0; padding: 10px 15px; cursor: pointer; display: flex; align-items: center; gap: 10px; font-size: 13px; transition: 0.2s; }
.ctx-btn:hover { background: rgba(255,255,255,0.1); }
.ctx-btn.primary { color: #818cf8; }
.ctx-btn.delete { color: #f87171; }

@keyframes popup { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
@keyframes blink { 50% { opacity: 0; } }

/* Sample 3D Assets CSS */
.banner-3d { width: 80%; height: 100px; background: linear-gradient(45deg, #ff00cc, #3333ff); transform: rotateY(20deg) rotateX(10deg); box-shadow: 5px 5px 15px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; border-radius: 10px; transition: 0.5s; }
.banner-3d:hover { transform: rotateY(0deg) rotateX(0deg) scale(1.05); }
.btn-neon { padding: 10px 20px; background: transparent; border: 2px solid #0f0; color: #0f0; box-shadow: 0 0 10px #0f0; text-transform: uppercase; font-weight: bold; letter-spacing: 2px; }
`
    },
    {
        name: 'script.js',
        language: 'javascript',
        content: `// Cucaypy OS Core Logic - Created by Jose Divino Prado da Lapa
const sys = {
    clipboard: '', 
    visualMode: false,
    selectedEl: null,
    library: [],
    isTerminalOpen: false,
    startTime: Date.now(),
    // Catálogo da Loja (Simulação Backend)
    onlineAssets: [
        { id: 1, name: 'Banner Holográfico', type: 'banner', html: '<div class="banner-3d">PROMOÇÃO 3D</div>' },
        { id: 2, name: 'Botão Cyberpunk', type: 'button', html: '<button class="btn-neon">START</button>' },
        { id: 3, name: 'Card Flutuante', type: 'card', html: '<div style="background:#fff; padding:20px; border-radius:10px; box-shadow:0 20px 40px rgba(0,0,0,0.2); transform:translateY(-5px);"><h3>Info Card</h3><p>Texto flutuante.</p></div>' },
        { id: 4, name: 'Galeria Grid', type: 'section', html: '<div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;"><div style="background:#ccc;height:50px;"></div><div style="background:#ccc;height:50px;"></div></div>' }
    ]
};

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    filterStore('all');
    startUptime();
    
    // Fechar menu contextual ao clicar fora
    document.addEventListener('click', (e) => {
        const menu = document.getElementById('context-menu');
        if (menu && menu.style.display === 'block') {
            if (!menu.contains(e.target)) {
                menu.style.display = 'none';
            }
        }
    });
});

function startUptime() {
    setInterval(() => {
        const diff = Math.floor((Date.now() - sys.startTime) / 1000);
        const h = Math.floor(diff / 3600).toString().padStart(2,'0');
        const m = Math.floor((diff % 3600) / 60).toString().padStart(2,'0');
        const s = (diff % 60).toString().padStart(2,'0');
        const el = document.getElementById('uptime-counter');
        if(el) el.innerText = \`\${h}:\${m}:\${s}\`;
    }, 1000);
}

// Sistema de Abas
function selectTab(tab) {
    document.querySelectorAll('.view-section').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    
    const targetView = document.getElementById(tab + '-view');
    if (targetView) targetView.style.display = 'block';
    
    const nav = document.getElementById('nav-' + tab);
    if (nav) nav.classList.add('active');
    
    const titles = { 'dashboard': 'Início', 'editor': 'Editor', 'assets': 'Magic Assets', 'files': 'Arquivos' };
    const titleEl = document.getElementById('breadcrumb-title');
    if (titleEl) titleEl.innerText = titles[tab] || 'Workspace';
}

// --- TERMINAL & DEPLOYMENT SYSTEM ---
function toggleTerminal() {
    const term = document.getElementById('server-terminal');
    sys.isTerminalOpen = !sys.isTerminalOpen;
    term.style.display = sys.isTerminalOpen ? 'flex' : 'none';
}

function logToTerminal(msg, color='white') {
    const term = document.getElementById('term-output');
    const line = document.createElement('div');
    line.className = 'term-line';
    
    let colorClass = '';
    if(color === 'green') colorClass = 'term-green';
    if(color === 'blue') colorClass = 'term-blue';
    if(color === 'yellow') colorClass = 'term-yellow';
    
    line.innerHTML = \`<span class="\${colorClass}">></span> \${msg}\`;
    term.insertBefore(line, term.lastElementChild);
    term.scrollTop = term.scrollHeight;
}

function deployProject() {
    if (!sys.isTerminalOpen) toggleTerminal();
    
    // TRUQUE: Abrir a janela IMEDIATAMENTE (no clique) para evitar bloqueio de popup
    // Cria uma janela de loading enquanto o "servidor" processa
    const deployWindow = window.open('', '_blank');
    if (deployWindow) {
        deployWindow.document.write('<html><body style="background:#0f172a;color:white;display:flex;justify-content:center;align-items:center;height:100vh;font-family:sans-serif;flex-direction:column;"><h1>🚀 Cucaypy Deploy</h1><p style="color:#94a3b8;margin-top:10px;">Construindo seu site... aguarde a finalização no terminal.</p></body></html>');
    } else {
        showToast("Pop-up bloqueado! Permita pop-ups para ver o deploy.", "error");
    }

    logToTerminal("Iniciando protocolo de deploy...", "yellow");
    document.getElementById('server-indicator').className = "status-indicator busy";
    document.getElementById('server-text').innerText = "Building...";
    
    setTimeout(() => logToTerminal("Otimizando assets 3D (WebGL)...", "blue"), 800);
    setTimeout(() => logToTerminal("Minificando CSS/JS bundle...", "blue"), 1600);
    setTimeout(() => logToTerminal("Conectando ao Cucaypy Edge Network...", "blue"), 2400);
    
    setTimeout(() => {
        logToTerminal("DEPLOY SUCCESSFUL!", "green");
        logToTerminal("O site está online.", "white");
        document.getElementById('server-indicator').className = "status-indicator online";
        document.getElementById('server-text').innerText = "Servidor Online (3000)";
        
        // Agora populamos a janela que já abrimos com o conteúdo real
        finishDeploy(deployWindow);
        
    }, 3500);
}

function finishDeploy(deployWindow) {
    // Pega o conteúdo atual do editor visual
    const visualContent = document.getElementById('visual-editor-canvas').innerHTML;
    const styles = document.querySelector('style').innerText;
    
    // Monta um HTML completo
    const fullHTML = \`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Meu Projeto Cucaypy Live</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                /* Estilos básicos + Estilos dos Assets */
                body { font-family: sans-serif; margin: 0; padding: 20px; background: #f0f2f5; }
                \${styles}
            </style>
        </head>
        <body>
            \${visualContent}
            <div style="position:fixed; bottom:10px; right:10px; background:black; color:white; padding:5px 10px; border-radius:20px; font-size:10px; opacity:0.7; font-family:sans-serif;">
                Powered by Cucaypy
            </div>
        </body>
        </html>
    \`;
    
    // Cria o Blob URL
    const blob = new Blob([fullHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    if (deployWindow) {
        // Redireciona a janela de loading para o site real
        deployWindow.location.href = url;
        showToast("Site no ar! Verifique a nova aba.", "success");
    } else {
        // Fallback (se o usuário fechou a janela de loading, tenta abrir outra)
        window.open(url, '_blank');
    }
}

function downloadProject() {
    const visualContent = document.getElementById('visual-editor-canvas').innerHTML;
    const fullHTML = \`<!DOCTYPE html><html><head><title>Projeto Cucaypy</title></head><body>\${visualContent}</body></html>\`;
    
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(fullHTML));
    element.setAttribute('download', 'meu-site-cucaypy.html');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}


// --- LÓGICA DA LOJA DE ASSETS ---
function handleAssetSearch(e) {
    if (e.key === 'Enter') triggerSearch();
}

function triggerSearch() {
    const term = document.getElementById('asset-search-input').value.toLowerCase();
    const filtered = sys.onlineAssets.filter(a => a.name.toLowerCase().includes(term));
    renderGrid(filtered, 'search');
    showToast(\`\${filtered.length} assets encontrados.\`);
}

function filterStore(mode) {
    document.querySelectorAll('.store-tab').forEach(t => t.classList.remove('active'));
    const activeTab = mode === 'saved' ? 'tab-saved' : 'tab-all';
    document.getElementById(activeTab).classList.add('active');
    
    if (mode === 'saved') {
        renderGrid(sys.library, 'saved');
    } else {
        renderGrid(sys.onlineAssets, 'search');
    }
}

function renderGrid(list, context) {
    const grid = document.getElementById('assets-grid');
    if (!grid) return;
    
    if (list.length === 0) {
        grid.innerHTML = '<div style="grid-column:1/-1; text-align:center; color:#64748b; padding:2rem;">Nenhum asset encontrado aqui.</div>';
        return;
    }
    
    grid.innerHTML = list.map(item => \`
        <div class="asset-card">
            <div class="asset-preview">\${item.html}</div>
            <div class="asset-info">
                <h4 style="margin:0 0 5px 0; color:#f1f5f9;">\${item.name}</h4>
                <div class="asset-actions">
                    \${context === 'search' 
                      ? \`<button class="btn-sm" onclick="downloadAsset(\${item.id})"><i class="fa-solid fa-download"></i> Baixar</button>\` 
                      : '<button class="btn-sm" disabled style="border-color:var(--primary); color:var(--primary);"><i class="fa-solid fa-check"></i> Salvo</button>'
                    }
                    <button class="btn-sm" onclick="copyAsset(\${item.id})"><i class="fa-regular fa-copy"></i> Copiar</button>
                </div>
            </div>
        </div>
    \`).join('');
}

function downloadAsset(id) {
    const asset = sys.onlineAssets.find(a => a.id === id);
    if (asset) {
        // Verifica se já existe
        if (!sys.library.some(a => a.id === id)) {
            sys.library.push(asset);
            document.getElementById('saved-count').innerText = sys.library.length;
            showToast('Asset baixado! Vá em "Meus Downloads".', 'success');
        } else {
            showToast('Você já baixou este asset.', 'info');
        }
    }
}

function copyAsset(id) {
    const asset = sys.onlineAssets.find(a => a.id === id) || sys.library.find(a => a.id === id);
    if (asset) {
        sys.clipboard = asset.html;
        showToast('Copiado! Ative o Modo Visual e toque 2x para colar.', 'success');
        
        // Sugere ir para o editor
        setTimeout(() => {
            if(confirm('Código copiado. Ir para o Editor Visual agora?')) {
                selectTab('editor');
            }
        }, 500);
    }
}

// --- MODO VISUAL & INTERAÇÃO DOUBLE TAP ---
function toggleVisualMode(checkbox) {
    sys.visualMode = checkbox.checked;
    const status = document.getElementById('visual-status-text');
    const canvas = document.getElementById('visual-editor-canvas');
    
    if (sys.visualMode) {
        status.innerText = "Modo Visual: ON";
        status.style.color = "#6366f1";
        canvas.classList.add('active-mode');
        setupVisualListeners(); // Reinicializa listeners
        showToast('Modo Visual Ativo: Toque 2x nos elementos para editar.');
    } else {
        status.innerText = "Modo Visual: OFF";
        status.style.color = "#64748b";
        canvas.classList.remove('active-mode');
    }
}

function setupVisualListeners() {
    // Aplica a todos os elementos dentro do canvas visual
    const items = document.querySelectorAll('.visual-item, .visual-item *');
    
    items.forEach(el => {
        // Remove listeners antigos para evitar duplicação
        el.removeEventListener('dblclick', handleDesktopDblClick);
        el.removeEventListener('touchend', handleMobileDoubleTap);
        
        // Adiciona novos
        el.addEventListener('dblclick', (e) => handleDesktopDblClick(e, el));
        
        let lastTap = 0;
        el.addEventListener('touchend', (e) => {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTap;
            if (tapLength < 500 && tapLength > 0) {
                handleInteraction(e, el);
                e.preventDefault(); // Evita zoom nativo
            }
            lastTap = currentTime;
        });
    });
}

function handleDesktopDblClick(e, el) {
    handleInteraction(e, el);
}

function handleInteraction(e, el) {
    if (!sys.visualMode) return;
    e.stopPropagation(); // Não abrir menu do pai se clicar no filho
    
    sys.selectedEl = el;
    
    const menu = document.getElementById('context-menu');
    
    // Coordenadas (Touch vs Mouse)
    let clientX, clientY;
    if (e.changedTouches) {
        clientX = e.changedTouches[0].clientX;
        clientY = e.changedTouches[0].clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }
    
    // Ajuste de borda da tela
    const menuWidth = 180;
    if (clientX + menuWidth > window.innerWidth) {
        clientX = window.innerWidth - menuWidth - 10;
    }
    
    menu.style.left = clientX + 'px';
    menu.style.top = clientY + 'px';
    menu.style.display = 'block';
}

function executeVisualAction(action) {
    const el = sys.selectedEl;
    const menu = document.getElementById('context-menu');
    menu.style.display = 'none';
    
    if (!el) return;

    if (action === 'paste') {
        if (sys.clipboard) {
            // Adiciona o HTML do banner dentro do elemento selecionado
            el.insertAdjacentHTML('beforeend', sys.clipboard);
            showToast('Asset colado com sucesso!', 'success');
            // Re-aplicar listeners para o novo elemento ser editável também
            setupVisualListeners();
        } else {
            showToast('Clipboard vazio. Copie um asset na loja primeiro.', 'error');
        }
    } 
    else if (action === 'edit') {
        const currentText = el.innerText;
        const newText = prompt("Editar Texto:", currentText);
        if (newText !== null) {
            el.innerText = newText;
            showToast('Texto atualizado.');
        }
    } 
    else if (action === 'delete') {
        if(confirm('Tem certeza que deseja excluir este item?')) {
            el.remove();
            showToast('Item excluído.');
        }
    }
}

function showToast(msg, type='info') {
    const container = document.getElementById('toast-container');
    const div = document.createElement('div');
    div.innerText = msg;
    div.style.background = type === 'error' ? '#ef4444' : (type === 'success' ? '#22c55e' : '#334155');
    div.style.color = 'white';
    div.style.padding = '10px 20px';
    div.style.borderRadius = '8px';
    div.style.marginBottom = '10px';
    div.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
    div.style.fontSize = '13px';
    div.style.animation = 'popup 0.3s ease-out';
    
    container.appendChild(div);
    setTimeout(() => div.remove(), 3000);
}
`
    },
    {
        name: 'package.json',
        language: 'json',
        content: `{
  "name": "cucaypy-3d-project",
  "version": "1.0.0",
  "description": "A 3D web experience created with Cucaypy OS",
  "main": "index.html",
  "scripts": {
    "start": "serve",
    "build": "echo 'Building project...' && exit 0"
  },
  "keywords": [
    "3d",
    "webgl",
    "css3d",
    "cucaypy"
  ],
  "author": "Jose Divino Prado da Lapa",
  "license": "MIT",
  "dependencies": {
    "three": "^0.160.0"
  }
}`
    }
];