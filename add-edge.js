const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // We only want to add it to non-static dynamic routes like pages/routes that we just removed it from
      const isRouteOrDynamicPage = fullPath.includes('route.ts') || 
                                   fullPath.includes('login') ||
                                   fullPath.includes('leads') ||
                                   fullPath.includes('outreach') ||
                                   fullPath.includes('health\\page.tsx');

      if (isRouteOrDynamicPage && !content.includes("export const runtime = 'edge';")) {
        // Insert right after the imports
        const lines = content.split('\n');
        let insertIndex = 0;
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].trim() === '' || lines[i].startsWith('import')) {
            insertIndex = i + 1;
          } else {
            break;
          }
        }
        lines.splice(insertIndex, 0, "export const runtime = 'edge';\n");
        fs.writeFileSync(fullPath, lines.join('\n'), 'utf8');
        console.log('Added back to', fullPath);
      }
    }
  }
}

processDir(path.join(__dirname, 'app'));
