import React, { useState } from 'react';
import { motion } from 'motion/react';
import { UserStory } from '../types';
import { 
  Users, 
  Calendar, 
  Tag, 
  CircleDot, 
  Plus, 
  Info, 
  CheckCircle, 
  Trash, 
  HelpCircle, 
  SlidersHorizontal,
  FolderMinus,
  MoveRight,
  Sparkles,
  Download
} from 'lucide-react';

interface BoardTabProps {
  stories: UserStory[];
  onUpdateStories: (updated: UserStory[]) => void;
}

export default function BoardTab({ stories, onUpdateStories }: BoardTabProps) {
  const [selectedStory, setSelectedStory] = useState<UserStory | null>(null);
  const [filterSprint, setFilterSprint] = useState<string>('all');
  const [showTemplate, setShowTemplate] = useState(false);

  // Drag and drop states
  const [draggedStoryId, setDraggedStoryId] = useState<string | null>(null);
  const [draggedOverStoryId, setDraggedOverStoryId] = useState<string | null>(null);
  const [draggedOverColumnId, setDraggedOverColumnId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, storyId: string) => {
    setDraggedStoryId(storyId);
    e.dataTransfer.setData("text/plain", storyId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setDraggedStoryId(null);
    setDraggedOverStoryId(null);
    setDraggedOverColumnId(null);
  };

  const handleDragOverColumn = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setDraggedOverColumnId(columnId);
  };

  const handleDropOnColumn = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    const storyId = e.dataTransfer.getData("text/plain") || draggedStoryId;
    if (!storyId) return;

    reorderStory(storyId, columnId, 'top');
    handleDragEnd();
  };

  const handleDragOverStory = (e: React.DragEvent, storyId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggedOverStoryId(storyId);
  };

  const handleDropOnStory = (e: React.DragEvent, targetStoryId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const storyId = e.dataTransfer.getData("text/plain") || draggedStoryId;
    if (!storyId || storyId === targetStoryId) return;

    reorderStory(storyId, null, 'card', targetStoryId);
    handleDragEnd();
  };

  const reorderStory = (
    storyId: string, 
    targetColumnId: string | null, 
    position: 'top' | 'card', 
    targetStoryId?: string
  ) => {
    const sourceIdx = stories.findIndex(s => s.id === storyId);
    if (sourceIdx === -1) return;
    const sourceStory = { ...stories[sourceIdx] };

    // Set new status if changing column
    if (targetColumnId) {
      sourceStory.status = targetColumnId as UserStory['status'];
    } else if (targetStoryId) {
      const targetStory = stories.find(s => s.id === targetStoryId);
      if (targetStory) {
        sourceStory.status = targetStory.status;
      }
    }

    const remaining = stories.filter(s => s.id !== storyId);

    if (position === 'top') {
      const updated = [sourceStory, ...remaining];
      onUpdateStories(updated);
    } else if (position === 'card' && targetStoryId) {
      const targetIdxInRemaining = remaining.findIndex(s => s.id === targetStoryId);
      if (targetIdxInRemaining !== -1) {
        const updated = [...remaining];
        updated.splice(targetIdxInRemaining, 0, sourceStory);
        onUpdateStories(updated);
      } else {
        onUpdateStories([sourceStory, ...remaining]);
      }
    }
  };

  // Column definitions matching Lab specs
  const columns = [
    { id: 'new-issues', name: 'New Issues', border: 'border-slate-200' },
    { id: 'icebox', name: 'Icebox', border: 'border-amber-200' },
    { id: 'product-backlog', name: 'Product Backlog', border: 'border-blue-200' },
    { id: 'sprint-backlog', name: 'Sprint Backlog', border: 'border-purple-200' },
    { id: 'in-progress', name: 'In Progress', border: 'border-indigo-200' },
    { id: 'review-qa', name: 'Review/QA', border: 'border-sky-200' },
    { id: 'done', name: 'Done', border: 'border-emerald-200' }
  ] as const;

  const handleMoveStory = (storyId: string, nextStatus: UserStory['status']) => {
    const updated = stories.map(s => {
      if (s.id === storyId) {
        return { ...s, status: nextStatus };
      }
      return s;
    });
    onUpdateStories(updated);
  };

  const handleUpdateStoryProperty = (
    storyId: string, 
    field: keyof UserStory, 
    value: any
  ) => {
    const updated = stories.map(s => {
      if (s.id === storyId) {
        return { ...s, [field]: value };
      }
      return s;
    });
    onUpdateStories(updated);
    if (selectedStory && selectedStory.id === storyId) {
      setSelectedStory({ ...selectedStory, [field]: value });
    }
  };

  // Automated State Presets representing Capstone Exercises
  const applyPresetState = (preset: string) => {
    let updated: UserStory[] = [];
    switch (preset) {
      case 'ex4': // Assemble Product Backlog (all 7 stories in "New Issues")
        updated = stories.map((s, idx) => ({
          ...s,
          status: idx < 7 ? 'new-issues' : 'icebox',
          points: undefined,
          label: 'none',
          sprint: 'none',
          assignee: ''
        }));
        break;

      case 'ex5': // Triage New Issues (5 CRUD/Dev stories to Product Backlog, 2 Deploy-K8s to Icebox)
        updated = stories.map((s, idx) => {
          if (idx < 5) {
            return { ...s, status: 'product-backlog', label: 'none', sprint: 'none', points: undefined };
          } else if (idx < 7) {
            return { ...s, status: 'icebox', label: 'none', sprint: 'none', points: undefined };
          } else {
            return { ...s, status: 'icebox', label: 'none', sprint: 'none', points: undefined };
          }
        });
        break;

      case 'ex6': // Backlog Refinement (Rank priorities, and add labels "technical-debt" / "enhancement")
        updated = stories.map((s, idx) => {
          let label: 'technical-debt' | 'enhancement' | 'none' = 'none';
          if (s.id === 'story-1' || s.id === 'story-6' || s.id === 'story-8' || s.id === 'story-9') {
            label = 'technical-debt';
          } else {
            label = 'enhancement';
          }
          return {
            ...s,
            status: idx < 5 ? 'product-backlog' : idx < 7 ? 'icebox' : 'icebox',
            label
          };
        });
        break;

      case 'ex7': // Build First Sprint 1 Plan (CRUD / environment moved to Sprint 1 Backlog with points)
        updated = stories.map((s, idx) => {
          let label: 'technical-debt' | 'enhancement' | 'none' = 'none';
          if (s.id === 'story-1' || s.id === 'story-6' || s.id === 'story-8' || s.id === 'story-9') {
            label = 'technical-debt';
          } else {
            label = 'enhancement';
          }

          if (idx < 5) {
            // Sprint 1 stories
            const points = s.id === 'story-1' ? 3 : 5;
            return {
              ...s,
              status: 'sprint-backlog',
              points,
              label,
              sprint: 'sprint-1',
              assignee: 'John Doe'
            };
          } else {
            return {
              ...s,
              status: 'icebox',
              label,
              sprint: 'none',
              points: undefined
            };
          }
        });
        break;

      case 'sprint2': // Sprint 2 Planning (Adding CI checks & Security headers into Sprint Backlog Sprint 2)
        updated = stories.map((s, idx) => {
          // Initialize labels
          let label: 'technical-debt' | 'enhancement' | 'none' = 'none';
          if (s.id === 'story-1' || s.id === 'story-6' || s.id === 'story-8' || s.id === 'story-9') {
            label = 'technical-debt';
          } else {
            label = 'enhancement';
          }

          if (idx < 5) {
            // Already finished Sprint 1
            const points = s.id === 'story-1' ? 3 : 5;
            return { ...s, status: 'done', points, label, sprint: 'sprint-1', assignee: 'John Doe' };
          } else if (s.id === 'story-6') {
            // CI automation (tech debt, 8 points, Sprint 2)
            return { ...s, status: 'sprint-backlog', points: 8, label: 'technical-debt', sprint: 'sprint-2', assignee: 'John Doe' };
          } else if (s.id === 'story-7') {
            // Security headers (enhancement, 5 points, Sprint 2)
            return { ...s, status: 'sprint-backlog', points: 5, label: 'enhancement', sprint: 'sprint-2', assignee: 'John Doe' };
          } else {
            return { ...s, status: 'icebox', label, sprint: 'none', points: undefined };
          }
        });
        break;

      case 'sprint3': // Sprint 3 Planning (Add Containerization & Deployment to Sprint Backlog for Sprint 3)
        updated = stories.map((s, idx) => {
          let label: 'technical-debt' | 'enhancement' | 'none' = 'none';
          if (s.id === 'story-1' || s.id === 'story-6' || s.id === 'story-8' || s.id === 'story-9') {
            label = 'technical-debt';
          } else {
            label = 'enhancement';
          }

          if (idx < 5) {
            // Sprint 1 finished
            return { ...s, status: 'done', points: s.id === 'story-1' ? 3 : 5, label, sprint: 'sprint-1', assignee: 'John Doe' };
          } else if (idx < 7) {
            // Sprint 2 finished
            return { ...s, status: 'done', points: s.id === 'story-6' ? 8 : 5, label, sprint: 'sprint-2', assignee: 'John Doe' };
          } else if (s.id === 'story-8') {
            // Docker
            return { ...s, status: 'sprint-backlog', points: 3, label: 'technical-debt', sprint: 'sprint-3', assignee: 'John Doe' };
          } else {
            // K8s
            return { ...s, status: 'sprint-backlog', points: 5, label: 'technical-debt', sprint: 'sprint-3', assignee: 'John Doe' };
          }
        });
        break;

      default:
        return;
    }
    onUpdateStories(updated);
  };

  return (
    <div className="space-y-6 animate-fadeIn" id="board-tab-container">
      {/* Exercise Lab States Switchboard Panel (Extremely helpful for grading validation) */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs" id="preset-controls-panel">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 text-left">
            <h3 className="text-xs font-bold text-blue-600 font-sans inline-flex items-center gap-1.5 uppercase">
              <SlidersHorizontal className="w-4 h-4" />
              CAPSTONE STATE ALIGNMENT PRESETS
            </h3>
            <p className="text-[11px] text-slate-500">
              Sync this Scrum Board instantly to any lab checkpoint state to study configurations or verify grading screenshots:
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => applyPresetState('ex4')}
              className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-mono text-[10px] font-bold px-3 py-1.5 rounded border border-slate-200 transition-colors"
              title="Place seven core stories strictly in New Issues column"
            >
              Ex 4: Assembler
            </button>
            <button 
              onClick={() => applyPresetState('ex5')}
              className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-mono text-[10px] font-bold px-3 py-1.5 rounded border border-slate-200 transition-colors"
              title="CRUD in backlog, deploy stories in Icebox"
            >
              Ex 5: Triage
            </button>
            <button 
              onClick={() => applyPresetState('ex6')}
              className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-mono text-[10px] font-bold px-3 py-1.5 rounded border border-slate-200 transition-colors"
              title="Add Technical Debt / Enhancement labels"
            >
              Ex 6: Refinement
            </button>
            <button 
              onClick={() => applyPresetState('ex7')}
              className="bg-blue-50 text-blue-700 font-mono text-[10px] font-bold px-3 py-1.5 rounded border border-blue-200 hover:bg-blue-100 transition-colors"
              title="Sizing estimates + Sprint 1 planning"
            >
              Ex 7: Sprint 1
            </button>
            <button 
              onClick={() => applyPresetState('sprint2')}
              className="bg-purple-50 text-purple-700 font-mono text-[10px] font-bold px-3 py-1.5 rounded border border-purple-200 hover:bg-purple-150 transition-colors"
              title="Add CI pipeline + Security stories to Sprint 2"
            >
              Sprint 2 Plan
            </button>
            <button 
              onClick={() => applyPresetState('sprint3')}
              className="bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold px-3 py-1.5 rounded border border-emerald-200 hover:bg-emerald-150 transition-colors"
              title="Add containerization to Sprint 3"
            >
              Sprint 3 Plan
            </button>
          </div>
        </div>
      </div>

      {/* Boards Filtering Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 border border-slate-200 rounded-xl shadow-xs" id="board-filters-bar">
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-bold uppercase font-sans text-slate-400">FILTER BY SPRINT</span>
          <div className="flex gap-1.5 bg-slate-100/60 p-1 rounded-lg border border-slate-200">
            {['all', 'sprint-1', 'sprint-2', 'sprint-3', 'none'].map((spName) => (
              <button
                key={spName}
                onClick={() => setFilterSprint(spName)}
                className={`text-[10px] uppercase font-mono px-2.5 py-1 rounded transition-all font-bold ${
                  filterSprint === spName 
                    ? 'bg-blue-600 text-white shadow-xs' 
                    : 'text-slate-500 hover:bg-slate-200/50 hover:text-slate-800'
                }`}
              >
                {spName === 'none' ? 'Product Backlog' : spName.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={() => setShowTemplate(!showTemplate)}
          className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-mono transition-none font-bold"
        >
          <Info className="w-3.5 h-3.5" />
          {showTemplate ? "Hide Issue Template" : "Show Issue Template Format (.md)"}
        </button>
      </div>

      {/* Markdown Template Display */}
      {showTemplate && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3 font-mono text-xs text-slate-700 text-left"
          id="embedded-readme-viewer"
        >
          <div className="flex justify-between items-center text-slate-400 border-b border-slate-200 pb-2">
            <span className="font-bold text-[10px]">FILE: .github/ISSUE_TEMPLATE/user-story.md</span>
            <span className="bg-slate-200/60 text-slate-700 text-[9px] uppercase px-1.5 rounded font-bold">Markdown Template</span>
          </div>
          <pre className="overflow-x-auto text-slate-800 select-all p-3 bg-white border border-slate-200 rounded font-mono text-[11px] leading-relaxed">
{`**As a** [role]  
**I need** [function]  
**So that** [benefit]  
      
### Details and Assumptions
* [document what you know]      
### Acceptance Criteria     
\`\`\`gherkin 
Given [some context]
When [certain action is taken]
Then [the outcome of action is observed]
\`\`\``}
          </pre>
        </motion.div>
      )}

      {/* Main Kanban Columns Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-3 overflow-x-auto pb-6" id="kanban-scroll-field">
        {columns.map((col) => {
          // Filter stories that exist in this column status and matches sprint filter
          const colStories = stories.filter(st => {
            if (st.status !== col.id) return false;
            if (filterSprint === 'all') return true;
            if (filterSprint === 'none') return st.sprint === 'none' || !st.sprint;
            return st.sprint === filterSprint;
          });

          return (
            <div 
              key={col.id} 
              className={`bg-[#f8fafc]/80 flex flex-col min-h-[500px] rounded-xl border ${col.border} p-3 relative min-w-[240px] md:min-w-[190px] lg:min-w-[145px] xl:min-w-[165px] transition-all ${
                draggedOverColumnId === col.id ? 'bg-indigo-50/40 ring-2 ring-indigo-300' : ''
              }`}
              id={`col-${col.id}`}
              onDragOver={(e) => handleDragOverColumn(e, col.id)}
              onDrop={(e) => handleDropOnColumn(e, col.id)}
            >
              {/* Column Header */}
              <div className="sticky top-0 z-10 flex items-center justify-between pb-3 mb-2 border-b border-slate-200 bg-[#f8fafc] -mt-3 pt-3 px-3 -mx-3 rounded-t-xl select-none shadow-xs">
                <span className="text-xs font-black text-slate-800 uppercase font-sans tracking-wide whitespace-normal break-words h-auto text-left py-0.5 leading-tight pr-1">
                  {col.name}
                </span>
                <span className="bg-slate-200 text-slate-700 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full shrink-0">
                  {colStories.length}
                </span>
              </div>

              {/* Dynamic Dropzone Area to Prepend stories to Top of columns when dragging */}
              {draggedStoryId && (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const storyId = e.dataTransfer.getData("text/plain") || draggedStoryId;
                    if (storyId) {
                      reorderStory(storyId, col.id, 'top');
                    }
                    handleDragEnd();
                  }}
                  className="border border-dashed border-sky-400 bg-sky-50 text-sky-700 rounded-lg p-2 mb-2 text-center text-[10px] font-bold font-sans tracking-tight cursor-pointer hover:bg-sky-100 transition-all shadow-xs"
                >
                  Drop here to place on Top ↑
                </div>
              )}

              {/* Column Cards */}
              <div className="flex-1 space-y-2.5 overflow-y-auto" id={`list-${col.id}`}>
                {colStories.length === 0 ? (
                  <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-4 min-h-[80px]">
                    <span className="text-[10px] font-mono text-slate-400 text-center uppercase tracking-wide">
                      Empty Pipe
                    </span>
                  </div>
                ) : (
                  colStories.map((story) => {
                    const isDragged = draggedStoryId === story.id;
                    const isHoveredOver = draggedOverStoryId === story.id;

                    return (
                      <motion.div
                        layoutId={`card-${story.id}`}
                        key={story.id}
                        onClick={() => setSelectedStory(story)}
                        draggable="true"
                        onDragStart={(e) => handleDragStart(e, story.id)}
                        onDragEnd={handleDragEnd}
                        onDragOver={(e) => handleDragOverStory(e, story.id)}
                        onDrop={(e) => handleDropOnStory(e, story.id)}
                        className={`bg-white border text-left space-y-3 transition-colors relative group select-none shadow-xs p-3.5 rounded-xl cursor-grab active:cursor-grabbing hover:border-indigo-400 ${
                          isDragged ? 'opacity-30 border-dashed border-slate-300' : 'border-slate-250 border-slate-200'
                        } ${
                          isHoveredOver ? 'border-sky-500 ring-2 ring-sky-100' : ''
                        }`}
                        title={story.title}
                      >
                        {/* Priority Rank indicator if product backlog */}
                        <div className="flex justify-between items-start gap-1">
                          <span 
                            className="text-xs font-bold text-slate-800 break-words whitespace-normal leading-relaxed font-sans"
                            title={story.title}
                          >
                            {story.title}
                          </span>
                          {story.points && (
                            <span className="bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-mono font-bold h-5 w-5 rounded shrink-0 flex items-center justify-center">
                              {story.points}
                            </span>
                          )}
                        </div>

                        {/* Card labels */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {story.label && story.label === 'technical-debt' && (
                            <span className="bg-amber-100 border border-amber-205 text-amber-800 text-[9px] uppercase font-mono px-1.5 py-0.5 rounded font-bold">
                              technical debt
                            </span>
                          )}
                          {story.label && story.label === 'enhancement' && (
                            <span className="bg-blue-50 border border-blue-150 text-blue-700 text-[9px] uppercase font-mono px-1.5 py-0.5 rounded font-bold">
                              enhancement
                            </span>
                          )}
                          {story.sprint && story.sprint !== 'none' && (
                            <span className="bg-purple-50 border border-purple-150 text-purple-700 text-[9px] uppercase font-mono px-1.5 py-0.5 rounded font-bold">
                              {story.sprint.replace('-', ' ')}
                            </span>
                          )}
                        </div>

                        {/* Footer Actions / Assignee */}
                        <div className="flex flex-col gap-2 pt-2.5 border-t border-slate-100 text-[10px] font-mono text-slate-500">
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5 text-slate-400" />
                              <span className="truncate max-w-[64px] font-bold text-slate-600">
                                {story.assignee || 'Unassigned'}
                              </span>
                            </span>

                            {/* Quick Back & Forth slider arrows */}
                            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const currentIndex = columns.findIndex(c => c.id === story.status);
                                  if (currentIndex > 0) {
                                    handleMoveStory(story.id, columns[currentIndex - 1].id);
                                  }
                                }}
                                disabled={columns.findIndex(c => c.id === story.status) === 0}
                                className="px-1.5 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 active:bg-slate-300 disabled:opacity-30 disabled:pointer-events-none text-slate-700 font-bold border border-slate-250 transition-all font-sans cursor-pointer text-xs"
                                title="Move Left"
                              >
                                ←
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const currentIndex = columns.findIndex(c => c.id === story.status);
                                  if (currentIndex < columns.length - 1) {
                                    handleMoveStory(story.id, columns[currentIndex + 1].id);
                                  }
                                }}
                                disabled={columns.findIndex(c => c.id === story.status) === columns.length - 1}
                                className="px-1.5 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 active:bg-slate-300 disabled:opacity-30 disabled:pointer-events-none text-slate-700 font-bold border border-slate-250 transition-all font-sans cursor-pointer text-xs"
                                title="Move Right"
                              >
                                →
                              </button>
                            </div>
                          </div>

                          {/* Direct Select Relocation Dropdown */}
                          <div className="flex items-center gap-1 pt-1.5 border-t border-dashed border-slate-100" onClick={(e) => e.stopPropagation()}>
                            <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 shrink-0">Stage:</span>
                            <select
                              value={story.status}
                              onChange={(e) => handleMoveStory(story.id, e.target.value as any)}
                              className="w-full bg-slate-50 hover:bg-slate-100 text-[10px] text-slate-700 font-mono font-medium border border-slate-200 rounded px-1 py-0.5 outline-none cursor-pointer focus:border-blue-400"
                            >
                              {columns.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Modal Drawer for inspecting user-story fields, adding Gherkin criteria & labels */}
      {selectedStory && (
        <div 
          className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-4 z-50 overflow-y-auto"
          onClick={() => setSelectedStory(null)}
          id="epic-details-modal"
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white border border-slate-200 rounded-xl p-6 max-w-2xl w-full text-left space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-slate-200 pb-4">
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase">USER STORY INSPECTOR</span>
                <h4 className="text-base font-bold text-slate-800 font-sans tracking-tight leading-snug">{selectedStory.title}</h4>
              </div>
              <button 
                onClick={() => setSelectedStory(null)}
                className="text-slate-400 hover:text-slate-700 font-mono text-xs font-bold bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded transition-colors"
              >
                ✕ Close
              </button>
            </div>

            {/* Markdown Representation (User Story Card Format) */}
            <div className="space-y-3">
              <h5 className="text-[10px] font-bold text-blue-600 uppercase tracking-wider font-sans">User Story markdown specification</h5>
              <div className="bg-slate-50 p-4 rounded-lg font-mono text-[11px] text-slate-700 whitespace-pre-wrap select-all border border-slate-200 leading-normal">
{`**As a** ${selectedStory.role || '[role]'}  
**I need** ${selectedStory.functionDef || '[function]'}  
**So that** ${selectedStory.benefit || '[benefit]'}  

### Details and Assumptions
* ${selectedStory.details || 'No specific details provided'}

### Acceptance Criteria
\`\`\`gherkin
${selectedStory.acceptanceCriteria || 'Given context\\nWhen action\\nThen response'}
\`\`\``}
              </div>
            </div>

            {/* Quick Properties Configuration (Labels, points, sprint, assignee) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-150">
              {/* Estimates Size */}
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] uppercase font-bold text-slate-400 block font-sans">Sizing Point Estimates (S/M/L/XL)</label>
                <select
                  value={selectedStory.points || ''}
                  onChange={(e) => handleUpdateStoryProperty(selectedStory.id, 'points', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full bg-slate-50 text-xs border border-slate-200 rounded p-2 text-slate-700 font-mono focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Unestimated</option>
                  <option value="3">3 - Small (S)</option>
                  <option value="5">5 - Medium (M)</option>
                  <option value="8">8 - Large (L)</option>
                  <option value="13">13 - Extra Large (XL)</option>
                </select>
              </div>

              {/* Categorization Labels */}
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] uppercase font-bold text-slate-400 block font-sans">Backlog Story Labels</label>
                <select
                  value={selectedStory.label || 'none'}
                  onChange={(e) => handleUpdateStoryProperty(selectedStory.id, 'label', e.target.value)}
                  className="w-full bg-slate-50 text-xs border border-slate-200 rounded p-2 text-slate-700 font-mono focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="none">No Label</option>
                  <option value="technical-debt">Technical Debt (Yellow Code)</option>
                  <option value="enhancement">Enhancement (Blue Code)</option>
                </select>
              </div>

              {/* Sprint assignment */}
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] uppercase font-bold text-slate-400 block font-sans">Sprint Assignment</label>
                <select
                  value={selectedStory.sprint || 'none'}
                  onChange={(e) => handleUpdateStoryProperty(selectedStory.id, 'sprint', e.target.value)}
                  className="w-full bg-slate-50 text-xs border border-slate-200 rounded p-2 text-slate-700 font-mono focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="none">Product Backlog Only</option>
                  <option value="sprint-1">Sprint 1 (Current)</option>
                  <option value="sprint-2">Sprint 2</option>
                  <option value="sprint-3">Sprint 3</option>
                </select>
              </div>

              {/* Assignee */}
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] uppercase font-bold text-slate-400 block font-sans">Developer Assigned</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={selectedStory.assignee || ''}
                  onChange={(e) => handleUpdateStoryProperty(selectedStory.id, 'assignee', e.target.value)}
                  className="w-full bg-slate-50 text-xs border border-slate-200 rounded p-2 text-slate-750 font-mono placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Quick-move Status inside drawer */}
            <div className="pt-4 border-t border-slate-150 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
              <span className="font-bold text-[10px] text-slate-400 uppercase tracking-wider font-sans">Interactive Triage status:</span>
              <div className="flex flex-wrap gap-1">
                {columns.map(c => (
                  <button
                    key={c.id}
                    onClick={() => handleMoveStory(selectedStory.id, c.id)}
                    className={`px-2 py-1 text-[9px] font-mono border rounded font-bold transition-all ${
                      selectedStory.status === c.id 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-xs' 
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-100/80 hover:border-slate-300'
                    }`}
                  >
                    {c.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
