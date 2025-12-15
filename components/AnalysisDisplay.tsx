import React from 'react';
import ReactMarkdown from 'react-markdown';

interface AnalysisDisplayProps {
  markdown: string | null;
  loading: boolean;
  statusMessage: string;
  labels: any;
}

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ markdown, loading, statusMessage, labels }) => {
  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-500 font-mono animate-pulse min-h-[400px]">
        <div className="w-12 h-12 border-4 border-terminal-blue border-t-transparent rounded-full animate-spin mb-4"></div>
        <p>{statusMessage}</p>
        <p className="text-xs text-gray-600 mt-2">{labels.connecting}</p>
      </div>
    );
  }

  if (!markdown) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-600 font-mono min-h-[400px] border-2 border-dashed border-terminal-border rounded-lg">
        <p>{labels.awaitingReport}</p>
        <p className="text-sm mt-2">{labels.awaitingSub}</p>
      </div>
    );
  }

  return (
    <div className="prose prose-invert prose-sm max-w-none font-sans leading-relaxed">
      <div className="mb-6 pb-4 border-b border-terminal-border flex justify-between items-center">
        <h2 className="text-xl font-bold text-white tracking-tight">{labels.tacticalAnalysis}</h2>
        <span className="text-xs font-mono text-terminal-blue bg-terminal-blue/10 px-2 py-1 rounded">
          {labels.generated}: {new Date().toLocaleTimeString()}
        </span>
      </div>
      
      <ReactMarkdown
        components={{
          h3: ({node, ...props}) => <h3 className="text-terminal-blue font-mono uppercase text-sm tracking-widest mt-8 mb-4 border-l-2 border-terminal-blue pl-3" {...props} />,
          ul: ({node, ...props}) => <ul className="space-y-2 my-4" {...props} />,
          li: ({node, ...props}) => <li className="text-gray-300 ml-4 list-disc marker:text-gray-600" {...props} />,
          strong: ({node, ...props}) => <strong className="text-white font-semibold" {...props} />,
          p: ({node, ...props}) => <p className="text-gray-400 mb-4" {...props} />,
        }}
      >
        {markdown}
      </ReactMarkdown>

      <div className="mt-12 pt-6 border-t border-terminal-border text-center">
        <p className="text-xs text-gray-600 font-mono">
          {labels.disclaimer}
        </p>
      </div>
    </div>
  );
};

export default AnalysisDisplay;