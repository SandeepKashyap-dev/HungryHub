const fs = require('fs');
const path = require('path');

function removeComments(content) {
  // Remove single-line comments
  content = content.replace(/^\s*\/\/.*$/gm, '');
  // Remove multi-line comments
  content = content.replace(/\/\*[\s\S]*?\*\//g, '');
  return content;
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      processDirectory(filePath);
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      const content = fs.readFileSync(filePath, 'utf8');
      const newContent = removeComments(content);
      fs.writeFileSync(filePath, newContent);
    }
  });
}

processDirectory('./client/src');
processDirectory('./server/src');