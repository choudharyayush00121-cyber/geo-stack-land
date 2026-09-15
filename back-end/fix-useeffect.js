import fs from 'fs';

const path = '../front-end/src/components/GISMap.jsx';
let content = fs.readFileSync(path, 'utf8');

// Find useEffect that calls handleScanMyLocation
const effectRegex = /useEffect\(\(\) => \{\s*\/\/[^\n]*\s*handleScanMyLocation\(\);\s*\/\/[^\n]*\s*\}, \[\]\);/m;

// Remove it
content = content.replace(effectRegex, '');

// Find end of handleScanMyLocation
const endOfHandler = /\s*\{ enableHighAccuracy: true, timeout: 8000, maximumAge: 0 \}\s*\);\s*\} else \{\s*console\.warn\('Geolocation not supported'\);\s*setScanningGps\(false\);\s*\}\s*};\n/;

// Add useEffect after the handler
content = content.replace(endOfHandler, (match) => {
  return match + `\n  useEffect(() => {\n    // Automatically trigger GPS scan when map component mounts\n    handleScanMyLocation();\n    // eslint-disable-next-line react-hooks/exhaustive-deps\n  }, []);\n`;
});

fs.writeFileSync(path, content);
console.log('Fixed GISMap.jsx');
