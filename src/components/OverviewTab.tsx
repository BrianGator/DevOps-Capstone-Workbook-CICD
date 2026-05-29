import React from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  FolderGit, 
  Layout, 
  Settings, 
  ShieldCheck, 
  Terminal, 
  LineChart, 
  Activity, 
  Zap, 
  ArrowRight
} from 'lucide-react';

interface OverviewTabProps {
  onStartPlanning: () => void;
  onStartSandbox: () => void;
  onStartPipeline: () => void;
  taskCounts: { total: number; done: number };
}

export default function OverviewTab({ 
  onStartPlanning, 
  onStartSandbox, 
  onStartPipeline,
  taskCounts 
}: OverviewTabProps) {
  const completionPercentage = Math.round((taskCounts.done / taskCounts.total) * 100);

  const mainGoals = [
    {
      icon: <Layout className="w-5 h-5 text-blue-600" />,
      title: "Agile Planning (Sprint 0)",
      desc: "Implement a GitHub project kanban board, create user story templates, triage issues, refine product backlogs, and construct one-week Sprints."
    },
    {
      icon: <Terminal className="w-5 h-5 text-emerald-600" />,
      title: "Flask RESTful Development (TDD)",
      desc: "Write unit tests, design database models, and build robust CRUD endpoints (POST, GET, PUT, DELETE, LIST) resulting in 95%+ spec code coverage."
    },
    {
      icon: <Activity className="w-5 h-5 text-sky-600" />,
      title: "Continuous Integration (GHA)",
      desc: "Build secondary pipeline automation validating code health, PostgreSQL databases container hooks, real-time linters, and pull-requests."
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-red-600" />,
      title: "Defensive DevSecOps Validation",
      desc: "Integrate CORS restrictions and secure Talisman-mounted headers into Flask applications to safeguard consumer data profiles."
    },
    {
      icon: <Zap className="w-5 h-5 text-amber-600" />,
      title: "Containerization & CD Pipeline (Tekton)",
      desc: "Pack high-efficiency Python images using Docker, map routing specifications in Kubernetes, and run parallel Tekton compilation lines."
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn" id="overview-container">
      {/* Welcome Banner */}
      <div className="lg:col-span-2 space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-xs text-left"
          id="welcome-card"
        >
          {/* Subtle background abstract shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-blue-50 text-blue-700 border border-blue-100 mb-4">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            Active Capstone Workbook
          </div>
          
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-800 mb-2 font-sans">
            DevOps-Capstone-Workbook-CICD
          </h1>
          <p className="text-slate-600 text-xs md:text-sm leading-relaxed max-w-xl mb-6">
            Welcome to the ultimate DevOps Capstone workbench, <strong>written by Brian McCarthy</strong>. This interface is carefully designed to guide you through Agile Planning, Test-Driven Flask Development, DevSecOps Hardening, and automated CI/CD container integration. 
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 block font-mono font-bold">APP PORT</span>
              <span className="text-xs font-bold text-slate-800 font-mono">3000 / 5000</span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 block font-mono font-bold">RUNTIME STACK</span>
              <span className="text-xs font-bold text-blue-600">Python 3.9 + Flask</span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 block font-mono font-bold">TEST COVERAGE</span>
              <span className="text-xs font-bold text-emerald-600 font-mono">97.5% passing</span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 block font-mono font-bold">CONTAINER RUNTIME</span>
              <span className="text-xs font-bold text-amber-600">K8s / OpenShift</span>
            </div>
          </div>
        </motion.div>

        {/* Capstone Flow / Key Milestones */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase text-slate-400 tracking-wider text-left">Capstone Blueprint & Scope</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mainGoals.map((g, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-xs transition-shadow flex gap-4"
              >
                <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg shrink-0 flex items-center justify-center h-12 w-12">
                  {g.icon}
                </div>
                <div className="space-y-1 text-left">
                  <h3 className="text-xs font-bold text-slate-800 font-sans">{g.title}</h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-sans">{g.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Metrics & Shortcut Column */}
      <div className="space-y-6">
        {/* Progress Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between shadow-xs text-left" id="progress-card">
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider">CAPSTONE COMPLETION</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold tracking-tight text-slate-800 font-sans">{completionPercentage}%</span>
              <span className="text-xs text-slate-400">completed</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-100">
              <div 
                className="bg-blue-600 h-full transition-all duration-500 rounded-full" 
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          <div className="space-y-3 pt-6 border-t border-slate-100 mt-6 text-left">
            <div className="flex justify-between text-xs font-mono text-slate-500">
              <span>Sprints Tracked</span>
              <span className="text-blue-600 font-bold">3 Sprints</span>
            </div>
            <div className="flex justify-between text-xs font-mono text-slate-500">
              <span>Unit Tests Programmed</span>
              <span className="text-emerald-600 font-bold">36 Assertions</span>
            </div>
            <div className="flex justify-between text-xs font-mono text-slate-500">
              <span>Artifacts Generated</span>
              <span className="text-sky-600 font-bold">12 Documents</span>
            </div>
          </div>
        </div>

        {/* Interactive Lab Shortcuts */}
        <div className="bg-slate-50/50 border border-slate-200 rounded-xl p-6 space-y-4 text-left" id="lab-shortcuts-card">
          <div>
            <h3 className="text-xs font-bold text-slate-700">Quick-Action Lab Triggers</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Fast-travel into visual simulations or REST API code testers mapping real capstone lab workspaces:
            </p>
          </div>
          <div className="space-y-2 pt-2">
            <button 
              onClick={onStartPlanning}
              className="w-full inline-flex items-center justify-between p-3 rounded-lg bg-white text-left text-xs font-bold text-slate-700 hover:border-blue-300 hover:text-blue-600 border border-slate-200 transition-all group"
              id="goto-planning-btn"
            >
              <span className="flex items-center gap-2">
                <Layout className="w-4 h-4 text-blue-500" />
                Agile Kanban Board
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button 
              onClick={onStartSandbox}
              className="w-full inline-flex items-center justify-between p-3 rounded-lg bg-white text-left text-xs font-bold text-slate-700 hover:border-emerald-300 hover:text-emerald-600 border border-slate-200 transition-all group"
              id="goto-sandbox-btn"
            >
              <span className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-500" />
                REST API Sandbox
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button 
              onClick={onStartPipeline}
              className="w-full inline-flex items-center justify-between p-3 rounded-lg bg-white text-left text-xs font-bold text-slate-700 hover:border-sky-300 hover:text-sky-600 border border-slate-200 transition-all group"
              id="goto-pipeline-btn"
            >
              <span className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-sky-500" />
                Automated CI/CD Pipelines
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
