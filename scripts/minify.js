const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const htmlFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));

console.log('=== BRUTALIST PRODUCTION MINIFIER ===');

htmlFiles.forEach(file => {
    const filePath = path.join(rootDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    const originalSize = Buffer.byteLength(content, 'utf8');

    // 1. Remove HTML comments (preserving GSAP/Three inline scripts)
    content = content.replace(/<!--(?!\[if)[\s\S]*?-->/g, '');

    // 2. Collapse whitespace between tags
    content = content.replace(/>\s+</g, '><');

    // 3. Trim line leads & multi-blank lines
    content = content.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .join('\n');

    const minifiedSize = Buffer.byteLength(content, 'utf8');
    const savings = (((originalSize - minifiedSize) / originalSize) * 100).toFixed(1);

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Minified ${file}: ${originalSize} B -> ${minifiedSize} B (${savings}% reduced)`);
});

console.log('Minification complete! Production build ready.');
