import React, { useState } from 'react';
import { FileBarChart, Download, FileText, CheckCircle } from 'lucide-react';

export function Analytics() {
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = (reportName: string) => {
    setDownloading(reportName);
    setTimeout(() => {
      setDownloading(null);
      alert(`${reportName} downloaded successfully.`);
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-text font-display flex items-center gap-2">
          <FileBarChart className="text-brand" /> Generated Reports
        </h2>
        <p className="text-sm text-text-dim mt-1">Access AI-generated investigation reports, charge sheets, and analytics.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass p-6 rounded-2xl flex flex-col items-center text-center justify-center min-h-[200px] border-accent/30 hover:shadow-glow cursor-pointer transition-all">
          <FileText size={40} className="text-accent mb-4" />
          <h3 className="text-lg font-bold text-text mb-2">Investigation Report Draft</h3>
          <p className="text-sm text-text-dim mb-4">Latest generated summary of all evidence, timelines, and entities for active cases.</p>
          <button 
            onClick={() => handleDownload('Investigation_Report.pdf')}
            disabled={downloading === 'Investigation_Report.pdf'}
            className="flex items-center gap-2 text-sm font-bold bg-accent text-bg px-4 py-2 rounded-lg hover:bg-accent-bright disabled:opacity-50"
          >
            {downloading === 'Investigation_Report.pdf' ? <span className="animate-pulse">Generating...</span> : <><Download size={16} /> Download PDF</>}
          </button>
        </div>

        <div className="glass p-6 rounded-2xl flex flex-col items-center text-center justify-center min-h-[200px] border-brand/30 hover:shadow-glow cursor-pointer transition-all">
          <FileBarChart size={40} className="text-brand mb-4" />
          <h3 className="text-lg font-bold text-text mb-2">Station Analytics Report</h3>
          <p className="text-sm text-text-dim mb-4">Monthly breakdown of crime trends, solved rates, and hotspots.</p>
          <button 
            onClick={() => handleDownload('Station_Analytics.pdf')}
            disabled={downloading === 'Station_Analytics.pdf'}
            className="flex items-center gap-2 text-sm font-bold bg-brand text-bg px-4 py-2 rounded-lg hover:bg-brand-bright disabled:opacity-50"
          >
            {downloading === 'Station_Analytics.pdf' ? <span className="animate-pulse">Generating...</span> : <><Download size={16} /> Download PDF</>}
          </button>
        </div>
      </div>
    </div>
  );
}
