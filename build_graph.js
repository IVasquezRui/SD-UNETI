const fs = require('fs');
const path = require('path');

function buildUnifiedVault() {
    const projectRoot = path.resolve('.');
    const lookdownDir = path.join(projectRoot, 'lookdown');
    const nodesDir = path.join(lookdownDir, 'nodes');

    if (fs.existsSync(nodesDir)) {
        fs.rmSync(nodesDir, { recursive: true, force: true });
    }
    fs.mkdirSync(nodesDir, { recursive: true });

    // Fases y orígenes estructurados para el mapeo integral
    const sectors = {
        wordpress: {
            dir: 'wp_data',
            extensions: ['.php', '.json', '.js', '.css'],
            ignored: new Set(['wp-admin', 'wp-includes', 'node_modules', '.git'])
        },
        database: {
            dir: 'db_data',
            extensions: ['.sql', '.json', '.env'],
            ignored: new Set(['node_modules', '.git'])
        },
        template: {
            dir: 'demo-elearning',
            extensions: ['.html', '.css', '.js'],
            ignored: new Set(['node_modules', '.git'])
        },
        nextjs: {
            dir: '.', // Raíz o carpeta frontend para Next.js, funciones, clases y componentes
            extensions: ['.ts', '.tsx', '.js', '.jsx'],
            ignored: new Set(['node_modules', '.next', '.git', 'wp_data', 'db_data', 'lookdown', 'demo-elearning'])
        }
    };

    const fileMap = {};

    for (const [sectorName, config] of Object.entries(sectors)) {
        const targetPath = path.join(projectRoot, config.dir);
        if (!fs.existsSync(targetPath)) continue;

        function walk(currentDir) {
            let entries = [];
            try {
                entries = fs.readdirSync(currentDir, { withFileTypes: true });
            } catch (e) {
                return;
            }

            for (const entry of entries) {
                const fullPath = path.join(currentDir, entry.name);
                if (entry.isDirectory()) {
                    if (!config.ignored.has(entry.name)) {
                        walk(fullPath);
                    }
                } else if (entry.isFile()) {
                    const ext = path.extname(entry.name);
                    if (config.extensions.includes(ext) && entry.name !== 'build_graph.js') {
                        const relPath = path.relative(projectRoot, fullPath).replace(/\\/g, '/');
                        // Evitar duplicados si una carpeta engloba a otra
                        if (!fileMap[relPath]) {
                            const safeName = `${sectorName}_${relPath.replace(/[\/\.\-]/g, '_')}`;
                            fileMap[relPath] = { safeName, sector: sectorName };
                        }
                    }
                }
            }
        }

        walk(targetPath);
    }

    const indexLines = [
        "# 📊 Índice Global del Grafo de Memoria (Lookdown)\n",
        "## Mapa Arquitectónico Integral (WordPress + Base de Datos + Plantilla + Next.js)\n"
    ];

    for (const [relPath, info] of Object.entries(fileMap)) {
        const nodeFile = path.join(nodesDir, `${info.safeName}.md`);
        const nodeContent = `# Sector: [${info.sector.toUpperCase()}] - \`${relPath}\`

- **Ruta física:** \`${relPath}\`
- **Subsistema:** \`${info.sector}\`
- **ID de Nodo:** \`${info.safeName}\`

---
*Memoria persistente unificada optimizada para Agente.*
`;
        fs.writeFileSync(nodeFile, nodeContent, 'utf8');
        indexLines.push(`- **[${info.sector}]** [[nodes/${info.safeName}|${relPath}]]`);
    }

    fs.writeFileSync(path.join(lookdownDir, 'INDEX.md'), indexLines.join('\n'), 'utf8');
    console.log(`✅ Grafo unificado totalizado con éxito: ${Object.keys(fileMap).length} nodos indexados.`);
}

if (require.main === module) {
    buildUnifiedVault();
}