import fs from 'fs';

let routeFile = fs.readFileSync('routes/parcelRoutes.js', 'utf8');
routeFile = routeFile.replace(/12\.98025/g, '31.10480');
routeFile = routeFile.replace(/77\.58675/g, '77.17340');

routeFile = routeFile.replace(/12\.98025/g, '31.10480');
routeFile = routeFile.replace(/77\.58975/g, '77.17640');
routeFile = routeFile.replace(/12\.97725/g, '31.10180');
routeFile = routeFile.replace(/77\.59275/g, '77.17940');
fs.writeFileSync('routes/parcelRoutes.js', routeFile);

const frontendApp = '../front-end/src/App.jsx';
let appFile = fs.readFileSync(frontendApp, 'utf8');
appFile = appFile.replace(/Bengaluru Urban/g, 'Shimla');
appFile = appFile.replace(/Karnataka/g, 'Himachal Pradesh');
fs.writeFileSync(frontendApp, appFile);

const frontendMap = '../front-end/src/components/GISMap.jsx';
let mapFile = fs.readFileSync(frontendMap, 'utf8');
mapFile = mapFile.replace(/12\.98025/g, '31.10480');
mapFile = mapFile.replace(/77\.58675/g, '77.17340');
fs.writeFileSync(frontendMap, mapFile);

console.log('App configs updated to Himachal Pradesh!');
