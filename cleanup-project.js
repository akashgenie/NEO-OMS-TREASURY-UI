const fs = require('fs');
const path = require('path');

const extensions = ['.ts', '.js', '.html', '.scss'];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Remove console statements
  content = content.replace(
    /^\s*console\.(log|warn|error|info|debug)\(.*?\);?\s*$/gm,
    ''
  );

  // Remove debugger
  content = content.replace(/^\s*debugger;?\s*$/gm, '');

  // Remove single line comments
  content = content.replace(/^\s*\/\/.*$/gm, '');

  // Remove block comments
  content = content.replace(/\/\*[\s\S]*?\*\//g, '');

  // Remove multiple blank lines
  content = content.replace(/\n\s*\n\s*\n/g, '\n\n');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Cleaned: ${filePath}`);
}

function walk(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);

    if (
      fullPath.includes('node_modules') ||
      fullPath.includes('.git') ||
      fullPath.includes('dist')
    ) {
      return;
    }

    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      walk(fullPath);
    } else if (extensions.includes(path.extname(fullPath))) {
      processFile(fullPath);
    }
  });
}

walk('./src');

console.log('Cleanup completed!');
