import fs from 'fs';

function addHoverEffects(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace standard card backgrounds with 3D hover ones
  content = content.replace(
    /className="([^"]*)bg-slate-900 border border-slate-800 rounded-2xl([^"]*)"/g,
    'className="$1bg-slate-900 border border-slate-800 rounded-2xl shadow-xl hover:shadow-[0_10px_40px_-10px_rgba(6,182,212,0.3)] hover:-translate-y-1.5 hover:scale-[1.02] transform transition-all duration-300 ease-out $2"'
  );

  // Apply gradient headers with deeper shadow
  content = content.replace(
    /className="([^"]*)bg-gradient-to-r from-slate-900([^"]*)rounded-2xl([^"]*)"/g,
    'className="$1bg-gradient-to-r from-slate-900$2rounded-2xl hover:shadow-[0_15px_50px_-12px_rgba(59,130,246,0.3)] transition-shadow duration-500$3"'
  );

  fs.writeFileSync(filePath, content);
}

addHoverEffects('../front-end/src/components/DashboardStats.jsx');
addHoverEffects('../front-end/src/components/ResearchReferences.jsx');
addHoverEffects('../front-end/src/components/Sidebar.jsx');
addHoverEffects('../front-end/src/components/SurroundingAreaModal.jsx');

console.log('Applied 3D hover effects to multiple components!');
