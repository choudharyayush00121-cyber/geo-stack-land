import fs from 'fs';

const data = JSON.parse(fs.readFileSync('data/parcels.json', 'utf8'));

// Shift coordinates from Bengaluru (12.9, 77.5) to Shimla (31.1, 77.1)
const latShift = 31.1048 - 12.98025;
const lngShift = 77.1734 - 77.58675;

data.forEach(p => {
  p.district = 'Shimla';
  p.taluk = 'Theog';
  p.village = 'Fagu';
  
  if (p.owner.deedNo.startsWith('KA-BNG')) {
    p.owner.deedNo = p.owner.deedNo.replace('KA-BNG', 'HP-SHM');
  }

  p.center = [p.center[0] + latShift, p.center[1] + lngShift];
  
  p.coordinates = p.coordinates.map(coord => [
    coord[0] + lngShift,
    coord[1] + latShift
  ]);
});

fs.writeFileSync('data/parcels.json', JSON.stringify(data, null, 2));
console.log('Parcels updated to Himachal Pradesh!');
