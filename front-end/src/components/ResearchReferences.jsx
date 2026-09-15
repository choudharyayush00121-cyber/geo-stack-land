import React from 'react';
import { BookOpen, ExternalLink, Download, FileText, Globe, Layers, MapPin, Landmark } from 'lucide-react';

const researchData = [
  {
    id: 1,
    title: 'Digital India Land Records Modernization Programme (DILRMP)',
    description: 'DILRMP is a Government of India programme for modernizing land records. Its objectives include digitization of land records, integration of textual and spatial records, and connectivity between land records and registration systems. This directly supports the idea of a unified land information platform.',
    link: 'https://dolr.gov.in/en/programmes-schemes/dilrmp-2/',
    icon: Landmark,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/20'
  },
  {
    id: 2,
    title: 'Bhu-Naksha',
    description: 'Bhu-Naksha is an official cadastral mapping system developed by NIC for managing digitized land maps. It can integrate with land-record applications and textual Records of Rights (RoR). This research supports the GIS and map visualization component of the proposed solution.',
    link: 'https://www.nic.gov.in/project/bhunaksha/',
    icon: MapPin,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/20'
  },
  {
    id: 3,
    title: 'NAKSHA Programme',
    description: 'NAKSHA is a government initiative for creating GIS-integrated urban land records using modern surveying and geospatial technologies. It demonstrates the importance of connecting land parcels with digital spatial information for transparent land management and urban planning.',
    link: 'https://naksha.dolr.gov.in/NakshaPortal/',
    icon: Layers,
    color: 'text-amber-400',
    bg: 'bg-amber-500/20'
  },
  {
    id: 4,
    title: 'National Spatial Data Infrastructure (NSDI)',
    description: 'NSDI promotes the standardized sharing and use of geospatial data across multiple agencies. Its work supports the concept of creating a common platform where datasets from different organizations can be visualized and analysed together.',
    link: 'https://www.nsdi.gov.in/',
    icon: Globe,
    color: 'text-blue-400',
    bg: 'bg-blue-500/20'
  },
  {
    id: 5,
    title: 'Unique Land Parcel Identification Number (ULPIN)',
    description: 'The ULPIN or Bhu-Aadhaar initiative assigns a unique identity to land parcels using geospatial information. This concept supports our proposed idea of linking different departmental records to a common and unique land parcel identity.',
    link: 'https://dolr.gov.in/en/programmes-schemes/dilrmp-2/', // Placeholder as original didn't specify exact link
    icon: FileText,
    color: 'text-purple-400',
    bg: 'bg-purple-500/20'
  }
];

export default function ResearchReferences() {
  const handleExportData = () => {
    // Generate Markdown content for export
    let mdContent = `# Research and Reference Details\n\nThe proposed solution is based on existing Indian government initiatives, land-record modernization programmes, and geospatial data systems. The research shows that land records are already being digitized, but there is still a need for better integration, verification, visualization, and analytics across different data sources.\n\n`;

    researchData.forEach((item, index) => {
      mdContent += `### ${index + 1}. ${item.title}\n`;
      mdContent += `${item.description}\n`;
      mdContent += `[Official Information](${item.link})\n\n`;
    });

    // Create a Blob and trigger download
    const blob = new Blob([mdContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'GeoLand_Research_References.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 h-full overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-cyan-400" />
            Research & Reference Details
          </h1>
          <p className="text-slate-400 mt-2 text-sm max-w-3xl leading-relaxed">
            The proposed solution is based on existing Indian government initiatives, land-record modernization programmes, and geospatial data systems. Research shows that while land records are digitized, there is still a need for better integration, verification, visualization, and analytics across disparate data sources.
          </p>
        </div>
        <button
          onClick={handleExportData}
          className="shrink-0 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2.5 px-5 rounded-xl shadow-lg shadow-cyan-950 flex items-center space-x-2 transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Export Research Data</span>
        </button>
      </div>

      {/* Initiatives Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {researchData.map((item) => (
          <div key={item.id} className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all rounded-2xl p-6 flex flex-col h-full shadow-lg group">
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-3 rounded-xl ${item.bg} border border-slate-700/50 group-hover:scale-110 transition-transform`}>
                <item.icon className={`w-6 h-6 ${item.color}`} />
              </div>
              <h3 className="font-bold text-slate-200 text-sm leading-tight">{item.title}</h3>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed flex-grow">
              {item.description}
            </p>
            <div className="mt-6 pt-4 border-t border-slate-800/80">
              <a 
                href={item.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <span>Official Information</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
