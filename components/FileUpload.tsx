import React, { useState } from 'react';
import { Upload, FileType, Zap, AlertCircle, X, CheckCircle } from 'lucide-react';

interface Props {
  onFileUpload: (file: File) => void;
  onDemoLoad: () => void;
}

const FileUpload: React.FC<Props> = ({ onFileUpload, onDemoLoad }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showDemoConfirm, setShowDemoConfirm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isUploading) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onFileUpload(file);
          }, 600);
          return 100;
        }
        return prev + 5;
      });
    }, 40);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (isUploading) return;
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isUploading) return;
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto relative z-20">
      
      {/* Demo Confirmation Modal */}
      {showDemoConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
             <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 text-yellow-400">
                   <AlertCircle className="w-6 h-6" />
                   <h3 className="text-lg font-bold text-white">Load Demo Data?</h3>
                </div>
                <button onClick={() => setShowDemoConfirm(false)} className="text-gray-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
             </div>
             <p className="text-gray-400 text-sm mb-6 leading-relaxed">
               This will load a sample SaaS sales dataset to demonstrate the dashboard capabilities. Any existing data will be replaced.
             </p>
             <div className="flex gap-3">
               <button 
                 onClick={() => setShowDemoConfirm(false)}
                 className="flex-1 py-2.5 rounded-lg border border-white/10 text-gray-300 font-medium hover:bg-white/5 transition-colors"
               >
                 Cancel
               </button>
               <button 
                 onClick={() => { setShowDemoConfirm(false); onDemoLoad(); }}
                 className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
               >
                 Load Demo
               </button>
             </div>
          </div>
        </div>
      )}

      <div 
        className={`relative group cursor-pointer transition-all duration-300 transform ${isDragging ? 'scale-105' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className={`absolute -inset-0.5 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-2xl blur opacity-30 transition duration-1000 ${isDragging || isUploading ? 'opacity-70 duration-200' : 'group-hover:opacity-70 group-hover:duration-200'}`}></div>
        
        <div className={`relative bg-black/60 backdrop-blur-xl border rounded-2xl p-10 text-center transition-all min-h-[320px] flex flex-col items-center justify-center ${isDragging ? 'bg-black/80 border-cyan-400 shadow-2xl shadow-cyan-900/20' : 'border-white/10 hover:bg-black/80'}`}>
          
          {isUploading ? (
            <div className="w-full max-w-xs animate-in fade-in zoom-in duration-300">
               <div className="mb-6 relative">
                 <div className="w-20 h-20 mx-auto bg-white/5 rounded-full flex items-center justify-center relative">
                    <svg className="w-full h-full transform -rotate-90 absolute top-0 left-0">
                      <circle cx="40" cy="40" r="38" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/10" />
                      <circle cx="40" cy="40" r="38" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-cyan-400 transition-all duration-200 ease-out" strokeDasharray="238.76" strokeDashoffset={238.76 - (238.76 * uploadProgress) / 100} strokeLinecap="round" />
                    </svg>
                    {uploadProgress < 100 ? (
                        <span className="text-lg font-bold font-display text-white">{uploadProgress}%</span>
                    ) : (
                        <CheckCircle className="w-8 h-8 text-green-400 animate-in zoom-in" />
                    )}
                 </div>
               </div>
               <h3 className="text-xl font-bold text-white mb-2">
                 {uploadProgress < 100 ? 'Uploading File...' : 'Upload Complete!'}
               </h3>
               <p className="text-gray-400 text-sm">
                 {uploadProgress < 100 ? 'Securely processing your data' : 'Redirecting to dashboard...'}
               </p>
            </div>
          ) : (
            <>
              <div className={`w-16 h-16 bg-gradient-to-tr from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-500/20 transition-transform duration-300 ${isDragging ? 'scale-125 rotate-12' : 'group-hover:scale-110'}`}>
                <Upload className="w-8 h-8 text-white" />
              </div>

              <h3 className={`text-2xl font-bold mb-2 transition-colors ${isDragging ? 'text-cyan-400' : 'text-white'}`}>
                {isDragging ? 'Drop it like it\'s hot!' : 'Upload your data'}
              </h3>
              <p className="text-gray-400 mb-8">
                Drag & drop CSV or JSON files here.<br/>
                <span className="text-sm opacity-60">Automatic schema detection & visualization.</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10 w-full">
                <label className="relative inline-flex items-center justify-center px-8 py-3 text-sm font-bold text-white transition-all duration-200 bg-brand-blue font-display rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue hover:bg-brand-blue/90 cursor-pointer shadow-lg hover:shadow-blue-500/30">
                    Select File
                    <input type="file" className="hidden" accept=".csv,.json" onChange={handleInputChange} />
                </label>

                <button 
                    onClick={(e) => { e.stopPropagation(); setShowDemoConfirm(true); }}
                    className="inline-flex items-center justify-center px-8 py-3 text-sm font-bold text-gray-300 transition-all duration-200 border border-white/20 rounded-lg hover:bg-white/5 hover:text-white"
                >
                  <Zap className="w-4 h-4 mr-2 text-yellow-400" />
                  Try Live Demo
                </button>
              </div>
            </>
          )}

        </div>
      </div>
      
      {!isUploading && (
        <div className="mt-8 flex justify-center gap-6 text-sm text-gray-500">
          <div className="flex items-center"><FileType className="w-4 h-4 mr-1"/> CSV</div>
          <div className="flex items-center"><FileType className="w-4 h-4 mr-1"/> JSON</div>
          <div className="flex items-center"><FileType className="w-4 h-4 mr-1"/> XLSX (Pro)</div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;