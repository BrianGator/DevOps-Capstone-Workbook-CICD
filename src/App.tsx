import React, { useState } from 'react';
import { initialUserStories } from './data/userStories';
import { UserStory } from './types';
import OverviewTab from './components/OverviewTab';
import BoardTab from './components/BoardTab';
import SandboxTab from './components/SandboxTab';
import PipelineTab from './components/PipelineTab';
import ArtifactsTab from './components/ArtifactsTab';

import { 
  BarChart3, 
  BookOpen, 
  GitBranch, 
  Terminal, 
  Layers, 
  Cpu, 
  Download, 
  HelpCircle,
  Layout, 
  Sliders, 
  Smartphone, 
  Sparkles, 
  TrendingUp,
  LayoutGrid
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'board' | 'sandbox' | 'pipelines' | 'artifacts'>('overview');
  const [stories, setStories] = useState<UserStory[]>(initialUserStories);

  // Compute stats on current user stories to drive progress indicators
  const totalTasks = stories.length;
  const doneTasks = stories.filter(st => st.status === 'done').length;

  const handleUpdateStories = (updated: UserStory[]) => {
    setStories(updated);
  };

  return (
    <div className="min-h-screen bg-[#070b13] flex flex-col justify-between" id="app-viewport">
      {/* Central Interactive Workspace */}
      <div className="flex-1 space-y-6 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8">
        
        {/* Navigation & Brand Header Bar */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6" id="brand-header">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-xl shadow-md shrink-0 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div className="text-left space-y-0.5">
              <h1 className="text-lg md:text-xl font-bold text-white tracking-tight flex items-center gap-2 font-sans">
                DevOps Capstone Workbook <span className="text-[10px] bg-indigo-950 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded font-mono font-medium">V1.0</span>
              </h1>
              <p className="text-xs text-slate-500">
                Interactive companion workbench matching IBM DevOps final evaluations
              </p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-wrap gap-1 bg-slate-950 p-1 rounded-xl border border-slate-900" id="main-tabs-navbar">
            {(['overview', 'board', 'sandbox', 'pipelines', 'artifacts'] as const).map((tab) => {
              const tabLabels = {
                overview: 'Workbook Overview',
                board: 'User Scrum Board',
                sandbox: 'REST Flask API',
                pipelines: 'CI/CD Pipelines',
                artifacts: 'Deliverables & Downloads'
              };

              const tabIcons = {
                overview: <BookOpen className="w-4 h-4" />,
                board: <LayoutGrid className="w-4 h-4" />,
                sandbox: <Terminal className="w-4 h-4" />,
                pipelines: <GitBranch className="w-4 h-4" />,
                artifacts: <Download className="w-4 h-4" />
              };

              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-slate-400 hover:text-white px-3.5 py-2 text-xs font-mono rounded-lg transition-all flex items-center gap-1.5 ${
                    activeTab === tab 
                      ? 'bg-indigo-600 text-white font-medium shadow-sm' 
                      : 'hover:bg-slate-900/60'
                  }`}
                  id={`tab-btn-${tab}`}
                >
                  {tabIcons[tab]}
                  {tabLabels[tab]}
                </button>
              );
            })}
          </nav>
        </header>

        {/* Dynamic Inner Tab Viewport */}
        <main className="min-h-[500px]" id="tab-viewport-body">
          {activeTab === 'overview' && (
            <OverviewTab 
              onStartPlanning={() => setActiveTab('board')}
              onStartSandbox={() => setActiveTab('sandbox')}
              onStartPipeline={() => setActiveTab('pipelines')}
              taskCounts={{ total: totalTasks, done: doneTasks }}
            />
          )}

          {activeTab === 'board' && (
            <BoardTab 
              stories={stories}
              onUpdateStories={handleUpdateStories}
            />
          )}

          {activeTab === 'sandbox' && (
            <SandboxTab />
          )}

          {activeTab === 'pipelines' && (
            <PipelineTab />
          )}

          {activeTab === 'artifacts' && (
            <ArtifactsTab />
          )}
        </main>
      </div>

      {/* Humble Footer containing System References */}
      <footer className="border-t border-slate-900 bg-slate-950/40 py-6 text-center text-slate-500 text-xs" id="footer-credits">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="font-mono">
            © 2026 DevOps Capstone Interactive Workbook. Developed under safe sandbox constraints.
          </p>
          <div className="flex gap-4 text-[10px] font-mono text-slate-600">
            <span>PORT BINDING: L0-3000 / L1-5000</span>
            <span>SPEC: NOSERULES 100% OK</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
