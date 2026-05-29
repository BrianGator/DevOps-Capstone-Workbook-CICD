import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  GitPullRequest, 
  Settings, 
  Layers, 
  CheckCircle2, 
  Play, 
  Server, 
  Activity, 
  Cpu, 
  ShieldCheck, 
  FileText, 
  HelpCircle, 
  ArrowRight,
  PlusCircle,
  Eye,
  Terminal,
  FileCode,
  Download
} from 'lucide-react';

interface PipelineLog {
  task: string;
  msg: string;
  status: 'info' | 'success' | 'running';
}

export default function PipelineTab() {
  const [pipelineSection, setPipelineSection] = useState<'gha' | 'kube' | 'tekton'>('gha');
  
  // GHA workflow States
  const [ghaRunning, setGhaRunning] = useState(false);
  const [ghaComplete, setGhaComplete] = useState(false);
  const [ghaLogs, setGhaLogs] = useState<string[]>([]);
  
  // Kube Deploy States
  const [dockerBuilt, setDockerBuilt] = useState(false);
  const [kubeDeployed, setKubeDeployed] = useState(false);
  
  // Tekton workflow pipeline logs details
  const [tektonRunning, setTektonRunning] = useState(false);
  const [tektonStep, setTektonStep] = useState<number>(0); // 0 to 5
  const [tektonConsole, setTektonConsole] = useState<PipelineLog[]>([]);

  // 1. Run GitHub Actions (CI) Simulation
  const triggerGha = () => {
    setGhaRunning(true);
    setGhaComplete(false);
    setGhaLogs([]);
    
    const logsList = [
      "Starting runner container (ubuntu-latest)...",
      "Syncing repository DevOps-Capstone-Workbook-CICD from GitHub remote...",
      "Cloning into '/root/workspace' on branch main...",
      "Setting up system Python 3.9-slim Environment...",
      "Pulling external Postgres SQL container: postgres:alpine...",
      "Postgres Service active. Port binding check 5432:5432 ... SUCCESS",
      "Installing system libraries (gcc, libpq-dev) via apt-get...",
      "Installing packages listed in requirements.txt (Flask, Talisman, CORS)...",
      "Analyzing layout standards with Flake8 Linter...",
      "Flake8 Analysis: Code quality adheres fully to PEP8 standards (0 violations!)",
      "Launching Unit tests: `nosetests` config applied...",
      "Running 32 test suites...",
      "----------------------------------------------------------------------",
      "test_create_account: OK",
      "test_read_account: OK",
      "test_update_account: OK",
      "test_delete_account: OK",
      "test_cors_options_validation: OK",
      "----------------------------------------------------------------------",
      "Nose execution complete. Coverage rating: 97.5%.",
      "Saving action status reporting badge to repository assets..."
    ];

    logsList.forEach((logMessage, idx) => {
      setTimeout(() => {
        setGhaLogs(prev => [...prev, logMessage]);
        if (idx === logsList.length - 1) {
          setGhaRunning(false);
          setGhaComplete(true);
        }
      }, (idx + 1) * 150);
    });
  };

  // 2. Run Container Build & Deploy Kubernetes simulation
  const handleBuildContainer = () => {
    setDockerBuilt(true);
  };

  const handleKubeDeploy = () => {
    if (!dockerBuilt) return;
    setKubeDeployed(true);
  };

  // 3. Run Tekton CD Pipeline Simulation with parallel task indicators
  const triggerTekton = () => {
    setTektonRunning(true);
    setTektonStep(1);
    setTektonConsole([]);

    // Step 1: Clone (duration 1000)
    setTektonConsole(prev => [...prev, { task: 'CLONE', msg: 'Syncing source code index repo...', status: 'running' }]);
    
    setTimeout(() => {
      setTektonStep(2); // Runs parallel Lint and Tests
      setTektonConsole(prev => {
        const copy = [...prev];
        copy[0].status = 'success';
        copy[0].msg = 'Repository successfully cloned. Checked out commit 12f86ac';
        return [
          ...copy,
          { task: 'LINT', msg: 'Executing flake8 linter standards checking...', status: 'running' },
          { task: 'TESTS', msg: 'Executing PyUnit nosetests inside SQLite context...', status: 'running' }
        ];
      });
    }, 1200);

    setTimeout(() => {
      setTektonStep(3); // Lint complete, Tests complete -> Trigger Build
      setTektonConsole(prev => {
        const copy = [...prev];
        copy[1].status = 'success';
        copy[1].msg = '0 coding errors detected. Standards PEP8 check complete.';
        copy[2].status = 'success';
        copy[2].msg = 'PyUnit completed successfully. 36 tests ran. 100% OK.';
        return [
          ...copy,
          { task: 'BUILD', msg: 'Executing multi-stage docker image compiler (buildah)...', status: 'running' }
        ];
      });
    }, 2800);

    setTimeout(() => {
      setTektonStep(4); // Build complete -> Trigger Deploy
      setTektonConsole(prev => {
        const copy = [...prev];
        copy[3].status = 'success';
        copy[3].msg = 'Successfully compiled container image 461bdf932bc2. Size: 178MB. Pushed to OpenShift Registry.';
        return [
          ...copy,
          { task: 'DEPLOY', msg: 'Injecting manifests into active cluster namespaces...', status: 'running' }
        ];
      });
    }, 4500);

    setTimeout(() => {
      setTektonStep(5); // Deploy complete -> Finish
      setTektonRunning(false);
      setTektonConsole(prev => {
        const copy = [...prev];
        copy[4].status = 'success';
        copy[4].msg = 'Applied manifests: deploy/deployment.yaml, deploy/service.yaml. 3 pods running!';
        return [
          ...copy,
          { task: 'SYSTEM', msg: 'CD DevOps Pipeline run SUCCEEDED. All checkpoints complete.', status: 'success' }
        ];
      });
    }, 6000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn text-left" id="pipeline-tab-container">
      {/* Sidebar pipeline selection */}
      <div className="lg:col-span-12 xl:col-span-3 space-y-3 shrink-0">
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2 shadow-xs">
          <h4 className="text-[10px] uppercase font-sans text-slate-400 font-bold tracking-wider mb-2">Automations Stage</h4>
          
          <button
            onClick={() => setPipelineSection('gha')}
            className={`w-full text-left p-3 rounded-lg border text-xs font-mono font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
              pipelineSection === 'gha'
                ? 'bg-blue-50 border-blue-200 text-blue-705 text-blue-700'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            <GitPullRequest className="w-4 h-4 text-blue-500" />
            GitHub Actions (CI)
          </button>

          <button
            onClick={() => setPipelineSection('kube')}
            className={`w-full text-left p-3 rounded-lg border text-xs font-mono font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
              pipelineSection === 'kube'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-bold'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            <Server className="w-4 h-4 text-emerald-500" />
            Docker & Kubernetes
          </button>

          <button
            onClick={() => setPipelineSection('tekton')}
            className={`w-full text-left p-3 rounded-lg border text-xs font-mono font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
              pipelineSection === 'tekton'
                ? 'bg-purple-50 border-purple-200 text-purple-700 font-bold'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            <Activity className="w-4 h-4 text-purple-500" />
            Tekton OpenShift (CD)
          </button>
        </div>

        {/* Dynamic visual health indicator based on state */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 text-xs font-sans font-medium text-slate-500 space-y-3 shadow-xs">
          <span className="text-[10px] text-slate-400 block uppercase font-bold">Workspace Pipeline Diagnostics</span>
          <div className="flex justify-between items-center bg-slate-50 p-2 rounded border border-slate-200 font-mono text-[11px]">
            <span>CI Status</span>
            <span className={ghaComplete ? 'text-emerald-600 font-bold' : 'text-amber-605 text-amber-605 text-amber-600 font-bold'}>
              {ghaComplete ? "✔ PASSING" : "○ UNTRIGGERED"}
            </span>
          </div>
          <div className="flex justify-between items-center bg-slate-50 p-2 rounded border border-slate-200 font-mono text-[11px]">
            <span>Containers</span>
            <span className={dockerBuilt ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
              {dockerBuilt ? "✔ COMPILED" : "○ UNBUILT"}
            </span>
          </div>
          <div className="flex justify-between items-center bg-slate-50 p-2 rounded border border-slate-200 font-mono text-[11px]">
            <span>K8s Cluster</span>
            <span className={kubeDeployed ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
              {kubeDeployed ? "✔ EXPOSED" : "○ STANDBY"}
            </span>
          </div>
        </div>
      </div>

      {/* Main interactive terminal simulator area */}
      <div className="lg:col-span-9 space-y-4">
        {/* SECTION 1: GITHUB ACTIONS */}
        {pipelineSection === 'gha' && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5 text-left shadow-xs animate-fadeIn" id="gha-sim-pane">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="space-y-0.5">
                <span className="text-[10px] font-sans font-bold text-indigo-600 uppercase">Continuous Integration Workflow</span>
                <h3 className="text-base font-bold text-slate-800 font-sans tracking-tight">GitHub Actions runner (ci-build.yaml)</h3>
              </div>
              <button
                onClick={triggerGha}
                disabled={ghaRunning}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200 text-white font-sans text-xs font-bold px-4 py-2 rounded-lg transition-all flex items-center gap-2 border border-indigo-650 border-indigo-600 shadow-sm cursor-pointer animate-fadeIn"
              >
                <Play className="w-3.5 h-3.5" />
                {ghaRunning ? "Running Pipeline..." : "Trigger GHA Workflow"}
              </button>
            </div>

            {/* Simulated actions badge preview */}
            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
              <span className="text-xs font-bold font-sans text-slate-500">CI Build Badge:</span>
              {ghaComplete ? (
                <div className="inline-flex rounded-md overflow-hidden text-[11px] font-mono border border-emerald-205 border-emerald-200 shadow-sm">
                  <span className="bg-slate-200 text-slate-700 px-2.5 py-1 font-bold animate-fadeIn">build</span>
                  <span className="bg-emerald-600 text-white px-2.5 py-1 font-bold animate-fadeIn">passing</span>
                </div>
              ) : (
                <div className="inline-flex rounded-md overflow-hidden text-[11px] font-mono border border-slate-205 border-slate-200 shadow-sm animate-fadeIn">
                  <span className="bg-slate-200 text-slate-400 px-2.5 py-1 font-bold">build</span>
                  <span className="bg-slate-300 text-slate-500 px-2.5 py-1 font-bold animate-pulse">unknown</span>
                </div>
              )}
              <span className="text-[11px] text-slate-500 font-sans font-medium">
                {ghaComplete ? "← Inject this badge into README.md!" : "← Trigger the workflow above to generate a successful status badge"}
              </span>
            </div>

            {/* Run-output pseudo terminal */}
            <div className="bg-slate-950 p-5 rounded-lg border border-slate-900 font-mono text-xs text-slate-300 h-80 overflow-y-auto space-y-1.5 leading-relaxed">
              {ghaLogs.length === 0 ? (
                <span className="text-slate-600 block text-center py-20 uppercase font-mono">Terminal on Standby. Click Trigger above to build.</span>
              ) : (
                ghaLogs.map((log, index) => (
                  <div key={index} className="flex gap-2">
                    <span className="text-indigo-400 shrink-0">❯</span>
                    <span>{log}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* SECTION 2: DOCKER & KUBERNETES CONTAINERIZATION */}
        {pipelineSection === 'kube' && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 text-left shadow-xs animate-fadeIn" id="kube-sim-pane">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
              <div className="space-y-0.5">
                <span className="text-[10px] font-sans font-bold text-emerald-605 text-emerald-605 text-emerald-600 uppercase">Container Orchestration</span>
                <h3 className="text-base font-bold text-slate-805 text-slate-800 font-sans tracking-tight">Docker Multi-stage Builds & Kubernetes Deployment</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Box 1: Image Builder */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center text-xs font-mono text-emerald-700">
                  <span className="inline-flex items-center gap-1.5 font-bold uppercase"><Cpu className="w-4 h-4" /> Docker Engine</span>
                  <span className="bg-white border border-slate-200 text-slate-500 text-[10px] px-1.5 py-0.5 font-sans font-semibold rounded">{dockerBuilt ? "BUILT" : "STANDBY"}</span>
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed font-sans font-semibold">
                  Compress the Flask service footprint using nested multi-stage dependencies filters to lock code execution context down safely.
                </p>

                <button
                  onClick={handleBuildContainer}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-xs font-sans font-bold py-2 rounded text-white border border-blue-600 transition-colors shadow-sm cursor-pointer"
                >
                  {dockerBuilt ? "✔ docker build -t accounts:latest (Success)" : "Run Docker Compilation Build"}
                </button>

                {dockerBuilt && (
                  <div className="space-y-1 bg-white border border-slate-200 p-2.5 rounded font-mono text-[9px] text-slate-650">
                    <div><strong>Built Hash:</strong> sha256:461bdf932bc2f</div>
                    <div><strong>Image Footprint:</strong> 178MB (Compact - python:3.9-slim)</div>
                    <div><strong>Status:</strong> Cached locally ready for deployment registries</div>
                  </div>
                )}
              </div>

              {/* Box 2: Kubernetes Services */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center text-xs font-mono text-sky-700">
                  <span className="inline-flex items-center gap-1.5 font-bold uppercase"><Server className="w-4 h-4" /> Kube Deploy</span>
                  <span className="bg-white border border-slate-200 text-slate-500 text-[10px] px-1.5 py-0.5 font-sans font-semibold rounded">{kubeDeployed ? "DEPLOYED" : "OFFLINE"}</span>
                </div>

                <p className="text-[11px] text-slate-505 text-slate-500 leading-relaxed font-sans font-semibold">
                  Expose container targets inside cluster routing topologies by applying manifest files exposing application replicas.
                </p>

                <button
                  onClick={handleKubeDeploy}
                  disabled={!dockerBuilt}
                  className={`w-full text-xs font-sans font-bold py-2 rounded transition-colors border shadow-sm cursor-pointer ${
                    dockerBuilt 
                      ? kubeDeployed 
                        ? 'bg-sky-50 border-sky-200 text-sky-700 hover:bg-sky-100' 
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 border-indigo-600'
                      : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {kubeDeployed ? "✔ kubectl apply -f deploy/ (Exposed)" : "Deploy Manifests to Kubernetes Cluster"}
                </button>

                {kubeDeployed && (
                  <div className="space-y-1 bg-white border border-slate-200 p-2.5 rounded font-mono text-[9px] text-slate-650 shadow-xs">
                    <div><strong>Replicas Specified:</strong> Deployment.apps/accounts spec (3 Replicas)</div>
                    <div><strong>Pod Status:</strong> Active 3/3 pods online: accounts-7f8976dcb9-*</div>
                    <div><strong>Balancer IP:</strong> 10.103.241.112 bound to port 8080 (Success)</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SECTION 3: TEKTON OPENSHIFT */}
        {pipelineSection === 'tekton' && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 text-left shadow-xs animate-fadeIn" id="tekton-sim-pane">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="space-y-0.5">
                <span className="text-[10px] font-sans font-bold text-purple-600 uppercase">Continuous Delivery (CD) Pipelines-as-Code</span>
                <h3 className="text-base font-bold text-slate-800 font-sans tracking-tight">Tekton Dashboard Emulator (pipeline.yaml)</h3>
              </div>
              <button
                onClick={triggerTekton}
                disabled={tektonRunning}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-slate-100 disabled:text-slate-400 text-white font-sans text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2 border border-purple-600 shadow-sm cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" />
                {tektonRunning ? "Pipeline Running..." : "Start CD Pipeline Run"}
              </button>
            </div>

            {/* Visual Task Pipeline Map depicting Parallelism */}
            <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 shadow-xs animate-fadeIn">
              <h5 className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-wider mb-4 text-center">Visual DAG / Task Parallelism layout</h5>
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-7">
                {/* Clone Task */}
                <div className={`p-3 rounded-lg border font-mono text-center text-xs shrink-0 w-24 relative shadow-xs transition-all ${
                  tektonStep >= 1 ? 'bg-purple-50 border-purple-200 text-purple-700 font-bold' : 'bg-white border-slate-200 text-slate-400'
                }`}>
                  <div className="font-bold">1. CLONE</div>
                  <div className="text-[9px] text-slate-500">{tektonStep > 1 ? '✔ Complete' : tektonStep === 1 ? '● Running' : 'Standby'}</div>
                </div>

                <ArrowRight className="hidden md:block w-4 h-4 text-slate-400" />

                {/* Parallel Grouping: Lint & Tests */}
                <div className="flex flex-col gap-2 relative border border-dashed border-slate-200 p-2.5 rounded-lg bg-white shadow-xs">
                  <span className="absolute -top-2.5 left-2 px-1 text-[8px] font-sans font-bold bg-white text-slate-400">PARALLEL STAGE</span>
                  
                  {/* Lint */}
                  <div className={`p-3 rounded-lg border font-mono text-center text-xs shrink-0 w-28 transition-all ${
                    tektonStep >= 2 ? 'bg-purple-50 border-purple-200 text-purple-700 font-bold' : 'bg-slate-550 border-slate-200 text-slate-400'
                  }`}>
                    <div className="font-bold">2A. LINT</div>
                    <div className="text-[9px] text-slate-500">{tektonStep > 2 ? '✔ Flake8 Complete' : tektonStep === 2 ? '● Linting' : 'Waiting'}</div>
                  </div>

                  {/* Tests */}
                  <div className={`p-3 rounded-lg border font-mono text-center text-xs shrink-0 w-28 transition-all ${
                    tektonStep >= 2 ? 'bg-purple-50 border-purple-200 text-purple-700 font-bold' : 'bg-slate-550 border-slate-200 text-slate-400'
                  }`}>
                    <div className="font-bold">2B. TESTS</div>
                    <div className="text-[9px] text-slate-500">{tektonStep > 2 ? '✔ Nose Complete' : tektonStep === 2 ? '● Testing' : 'Waiting'}</div>
                  </div>
                </div>

                <ArrowRight className="hidden md:block w-4 h-4 text-slate-400" />

                {/* Build Task (runsAfter parallel stage) */}
                <div className={`p-3 rounded-lg border font-mono text-center text-xs shrink-0 w-24 relative shadow-xs transition-all ${
                  tektonStep >= 3 ? 'bg-purple-50 border-purple-200 text-purple-700 font-bold' : 'bg-white border-slate-200 text-slate-400'
                }`}>
                  <span className="absolute -top-2 left-6 px-1 text-[7px] font-sans font-bold bg-purple-600 text-white rounded">RUNS AFTER</span>
                  <div className="font-bold">3. BUILD</div>
                  <div className="text-[9px] text-slate-500">{tektonStep > 3 ? '✔ Buildah Complete' : tektonStep === 3 ? '● Compiling' : 'Blocked'}</div>
                </div>

                <ArrowRight className="hidden md:block w-4 h-4 text-slate-400" />

                {/* Deploy Task */}
                <div className={`p-3 rounded-lg border font-mono text-center text-xs shrink-0 w-24 shadow-xs transition-all ${
                  tektonStep >= 4 ? 'bg-purple-50 border-purple-200 text-purple-700 font-bold' : 'bg-white border-slate-200 text-slate-400'
                }`}>
                  <div className="font-bold">4. DEPLOY</div>
                  <div className="text-[9px] text-slate-500">{tektonStep > 4 ? '✔ OpenShift Complete' : tektonStep === 4 ? '● Deploying' : 'Blocked'}</div>
                </div>
              </div>
            </div>

            {/* Simulated Tekton Terminal logs output */}
            <div className="bg-slate-950 p-5 rounded-lg border border-slate-200 font-mono text-xs text-slate-300 h-64 overflow-y-auto space-y-1">
              {tektonConsole.length === 0 ? (
                <span className="text-slate-500 block text-center py-20 uppercase font-mono font-bold">Terminal on Standby. Click Start Run to execute CD pipelines.</span>
              ) : (
                tektonConsole.map((log, index) => {
                  let badgeColor = 'bg-slate-800 text-slate-400 border border-slate-700';
                  if (log.status === 'success') badgeColor = 'bg-emerald-950 text-emerald-400 border border-emerald-940 border-emerald-900';
                  if (log.status === 'running') badgeColor = 'bg-purple-950 text-purple-300 border border-purple-800 animate-pulse';

                  return (
                    <div key={index} className="flex gap-2 items-start py-0.5 animate-fadeIn">
                      <span className={`px-1.5 py-0.5 text-[8px] font-bold rounded uppercase shrink-0 ${badgeColor}`}>
                        {log.task}
                      </span>
                      <span className="text-slate-300">{log.msg}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
