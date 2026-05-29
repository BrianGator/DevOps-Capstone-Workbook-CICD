import React, { useState } from 'react';
import { motion } from 'motion/react';
import { artifacts } from '../data/artifacts';
import { FileArtifact } from '../types';
import { 
  Clipboard, 
  CheckCircle2, 
  Download, 
  FileText, 
  HelpCircle, 
  Eye, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  BookmarkCheck,
  AlertCircle
} from 'lucide-react';

export default function ArtifactsTab() {
  const [activeItem, setActiveItem] = useState<FileArtifact>(artifacts[0]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadFile = (artifact: FileArtifact) => {
    const blob = new Blob([artifact.content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = artifact.filename.split('/').pop() || artifact.title;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  // Checklists based on capstone project specifications
  const gradingItems = [
    { title: "README.md Badge Status Header", path: "README.md", score: "2 Points", status: "Option 1 & 2" },
    { title: "user-story.md Issue Template", path: ".github/ISSUE_TEMPLATE/user-story.md", score: "1 Point", status: "Option 1 & 2" },
    { title: "setup.cfg Testing Specs Setup", path: "setup.cfg", score: "1 Point", status: "Option 1 & 2" },
    { title: "ci-build.yaml GHA pipeline configurations", path: ".github/workflows/ci-build.yaml", score: "4 Points", status: "Option 1 & 2" },
    { title: "service/__init__.py defensive Talisman setup", path: "service/__init__.py", score: "1 Point", status: "Option 1 & 2" },
    { title: "Dockerfile multi-stage microservices package", path: "Dockerfile", score: "2 Points", status: "Option 1 & 2" },
    { title: "rest-create-done cURL output file", path: "artifacts/rest-create-done.txt", score: "2 Points", status: "Option 1 Only" },
    { title: "rest-list-done cURL register dump", path: "artifacts/rest-list-done.txt", score: "2 Points", status: "Option 1 Only" },
    { title: "rest-read-done query details record", path: "artifacts/rest-read-done.txt", score: "2 Points", status: "Option 1 Only" },
    { title: "rest-update-done phone modified terminal logs", path: "artifacts/rest-update-done.txt", score: "2 Points", status: "Option 1 Only" },
    { title: "rest-delete-done empty header response code", path: "artifacts/rest-delete-done.txt", score: "2 Points", status: "Option 1 Only" },
    { title: "pipelinerun.txt Tekton 5-point console steps", path: "pipelinerun.txt", score: "5 Points", status: "Option 1 & 2" }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="artifacts-hub-view">
      {/* Grade Checklists and Deliverables listings column */}
      <div className="lg:col-span-5 space-y-4">
        {/* Help Info Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3" id="artifacts-alert-box">
          <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs font-semibold">
            <BookmarkCheck className="w-4 h-4 text-indigo-400 animate-bounce" />
            FINAL EVIDENCE SUBMISSION CHEAT SHEET
          </div>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            Here you can inspect, copy, and download <strong>pristine, bug-free, copy-pasteable files</strong> for all the required deliverables evaluated in the DevOps Coursera Capstone Project.
          </p>
          <div className="inline-flex gap-2 p-2.5 rounded-lg bg-slate-950/80 border border-slate-850 text-[10px] text-slate-500 font-mono w-full">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Note: Verify that you customize branch names and GitHub usernames in final copies.</span>
          </div>
        </div>

        {/* Deliverables Inventory selection */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4" id="deliverables-selection-field">
          <h4 className="text-[10px] uppercase font-mono text-slate-500 font-bold mb-3">Capstone Deliverables Browser</h4>
          <div className="space-y-1 max-h-[480px] overflow-y-auto pr-1">
            {artifacts.map((art) => {
              const matchedSpec = gradingItems.find(g => g.path.endsWith(art.filename.split('/').pop() || ''));
              return (
                <button
                  key={art.id}
                  onClick={() => setActiveItem(art)}
                  className={`w-full text-left p-3 rounded-lg border text-xs font-mono transition-all flex items-center justify-between group ${
                    activeItem.id === art.id
                      ? 'bg-indigo-950/40 border-indigo-500 text-indigo-300'
                      : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200 hover:border-slate-800'
                  }`}
                >
                  <span className="flex items-center gap-2 truncate">
                    <FileText className={`w-3.5 h-3.5 shrink-0 ${activeItem.id === art.id ? 'text-indigo-400' : 'text-slate-500'}`} />
                    <span className="truncate">{art.title}</span>
                  </span>
                  
                  <span className="flex items-center gap-2">
                    {matchedSpec && (
                      <span className="text-[8px] bg-slate-905 border border-slate-800 text-indigo-400 px-1 py-0.5 rounded font-bold">
                        {matchedSpec.score}
                      </span>
                    )}
                    <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all" />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Code / Text viewer pane column */}
      <div className="lg:col-span-7 space-y-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-full flex flex-col justify-between" id="artifact-details-pane">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase">INSPECTING WORKSPACE FILE</span>
                <h4 className="text-sm font-bold text-white font-mono">{activeItem.filename}</h4>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleCopyText(activeItem.content, activeItem.id)}
                  className="bg-slate-850 hover:bg-slate-800 text-slate-200 border border-slate-700 font-mono text-xs px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Clipboard className="w-3.5 h-3.5" />
                  {copiedId === activeItem.id ? "Copied!" : "Copy Content"}
                </button>

                <button
                  onClick={() => handleDownloadFile(activeItem)}
                  className="bg-indigo-600 hover:bg-indigo-500 border border-indigo-500 text-white font-mono text-xs px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download File
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-slate-400 leading-relaxed">
                {activeItem.description}
              </p>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-lg border border-slate-900 mt-4 h-[440px] overflow-y-auto">
            <pre className="text-[11px] font-mono text-slate-300 leading-relaxed text-left whitespace-pre-wrap select-all">
              {activeItem.content}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
